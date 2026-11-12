export const DESIGN = Object.freeze({ width: 960, height: 540 });

// Uniform scale preserves character proportions. Scenic background fills the
// remaining viewport; extensions never enlarge the logical combat rectangle.
export function measureViewport(width, height, dpr = 1) {
  if (!(width > 0 && height > 0)) throw new RangeError('Viewport must have a positive size');
  const scale = Math.min(width / DESIGN.width, height / DESIGN.height);
  return { width, height, scale, offsetX: (width - DESIGN.width * scale) / 2,
    offsetY: (height - DESIGN.height * scale) / 2, dpr: Math.min(Math.max(dpr, 1), 2) };
}

export function clientToWorld(clientX, clientY, rect, view) {
  const x = (clientX - rect.left - view.offsetX) / view.scale;
  const y = (clientY - rect.top - view.offsetY) / view.scale;
  return { x, y, inside: x >= 0 && x <= 960 && y >= 0 && y <= 540,
    // Tall vehicles in the highest lane reach roughly y=176. Their visible
    // upper armor must accept pointer presses, while HUD/scenic margins do not.
    battlefield: x >= 145 && x <= 960 && y >= 170 && y <= 465 };
}

export class Viewport {
  constructor(element, canvas) {
    this.element = element;
    this.canvas = canvas;
    this.view = measureViewport(960, 540);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(element);
    this.resize();
  }
  resize() {
    const rect = this.element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.view = measureViewport(rect.width, rect.height, window.devicePixelRatio);
    const { width, height, dpr, scale } = this.view;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.element.style.setProperty('--u', `${scale}px`);
    document.querySelector('#display-info').textContent = `${Math.round(width)} × ${Math.round(height)} · uniform scale ${scale.toFixed(3)}`;
  }
  point(event) { return clientToWorld(event.clientX, event.clientY, this.element.getBoundingClientRect(), this.view); }
  get expanded() { return this.element.classList.contains('expanded'); }
  get fullscreen() { return document.fullscreenElement === this.element || this.expanded; }
  async toggleFullscreen() {
    if (this.expanded) { this.element.classList.remove('expanded'); return 'normal'; }
    if (document.fullscreenElement) { await document.exitFullscreen(); return 'normal'; }
    try {
      if (!this.element.requestFullscreen) throw new Error('Native fullscreen unavailable');
      await this.element.requestFullscreen();
      return 'native';
    } catch {
      // Embedded browsers can deny native fullscreen. Fill their entire available
      // window instead, without depending on permission or changing browser settings.
      this.element.classList.add('expanded');
      return 'window';
    }
  }
}
