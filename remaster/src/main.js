import { Viewport } from './viewport.js';
import { SaveStore } from './save.js';
import { loadAssets } from './assets.js';
import { AudioManager } from './audio.js';
import { PointerInput } from './input.js';
import { Renderer } from './renderer.js';
import { Scenes } from './scenes.js';

const element = document.querySelector('#viewport'), canvas = document.querySelector('#world');
const viewport = new Viewport(element, canvas);
let storage;
try { storage = window.localStorage; } catch { storage = { getItem() { throw new Error('Storage blocked'); } }; }
const store = new SaveStore(storage);
if (store.data.revision === 0 && window.matchMedia('(prefers-reduced-motion: reduce)').matches) store.data.settings.reducedMotion = true;
const audio = new AudioManager(store.settings);
let scenes = null, assets = null, loadController = null, frame = 0, previousTime = null, elapsed = 0, toastTimer;
const input = new PointerInput(canvas, viewport, () => scenes?.name === 'combat');
const renderer = new Renderer(canvas, viewport);
function notify(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message; toast.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}
async function fullscreen() {
  input.clear();
  try {
    const mode = await viewport.toggleFullscreen();
    if (mode === 'window') notify('Expanded to browser view · Esc to return');
    updateFullscreen();
  } catch (error) { notify(error.message); }
}
document.querySelector('#fullscreen').addEventListener('click', fullscreen);
function updateFullscreen() {
  input.clear(); viewport.resize();
  document.querySelector('#fullscreen').innerHTML = viewport.fullscreen ? 'Exit fullscreen <kbd>F</kbd>' : 'Fullscreen <kbd>F</kbd>';
}
document.addEventListener('fullscreenchange', updateFullscreen);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && viewport.fullscreen) {
    event.preventDefault(); event.stopPropagation(); fullscreen(); return;
  }
  if (event.code === 'KeyF' && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey && !/INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) {
    event.preventDefault(); fullscreen(); return;
  }
  if (!(event.key === 'Escape' && document.fullscreenElement) && scenes?.handleKey(event)) { event.preventDefault(); event.stopPropagation(); }
}, { capture: true });
document.addEventListener('pointerdown', () => { audio.unlock().catch(() => {}); }, { once: true });

function draw(timestamp) {
  const delta = previousTime === null ? 0 : Math.min((timestamp - previousTime) / 1000, .1);
  previousTime = timestamp; elapsed += delta;
  scenes?.advance(delta);
  audio.setScene(scenes?.name || 'menu');
  element.classList.toggle('reduced-motion',scenes?.settingsDraft?.reducedMotion ?? store.settings.reducedMotion);
  renderer.draw({ time: elapsed, scene: scenes?.name || 'loading', settings: scenes?.settingsDraft || store.settings,
    pointer: input.state, combat: scenes?.combat, selectedSlot: scenes?.selectedSlot });
  frame = requestAnimationFrame(draw);
}
document.addEventListener('visibilitychange', () => {
  input.clear(); previousTime = null;
  if (document.hidden) { scenes?.pause('Paused while you were away'); cancelAnimationFrame(frame); audio.context?.suspend().catch(() => {}); }
  else { audio.context?.resume().catch(() => {}); frame = requestAnimationFrame(draw); }
});
window.addEventListener('blur', () => scenes?.pause('Paused while you were away'));

async function start() {
  loadController?.abort(); loadController = new AbortController();
  const loading = document.querySelector('#loading'), message = document.querySelector('#loading-message');
  loading.hidden = false; document.querySelector('#retry').hidden = true; message.textContent = 'Preparing the outpost…';
  try {
    assets = await loadAssets(loadController.signal, (done, total) => { message.textContent = `Bringing the outpost to life · ${done} / ${total}`; });
    for (const [key, value] of Object.entries(assets.tokens.colors)) {
      element.style.setProperty('--' + key.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase()), value);
    }
    renderer.setAssets(assets);
    scenes = new Scenes(document.querySelector('#ui'), store, audio, input, assets, notify);
    loading.hidden = true;
    if (!frame) frame = requestAnimationFrame(draw);
  } catch (error) {
    if (error.name === 'AbortError') return;
    message.textContent = 'The outpost could not load. Check the local server and try again.';
    document.querySelector('#retry').hidden = false;
    console.error('Asset loading failed:', error);
  }
}
document.querySelector('#retry').addEventListener('click', start);
start();
