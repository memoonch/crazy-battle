// Generates a temporary entry from the actual production bootstrap, with only
// storage isolation and an explicit QA controller. Never edits production main.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
let js=fs.readFileSync(path.join(root,'remaster/src/main.js'),'utf8').replaceAll("from './","from '../src/");
js="import { installReleaseQA } from './release-qa-runner.js';\nlet qaBusy=false;\n"+js;
const begin=js.indexOf('let storage;'),end=js.indexOf('if (store.data.revision',begin);
js=js.slice(0,begin)+`const storage={getItem:()=>localStorage.getItem('crazy-battle.release-qa.v1'),setItem:(key,value)=>localStorage.setItem('crazy-battle.release-qa.v1',value)};
const store=new SaveStore(storage);
`+js.slice(end);
js=js.replace('scenes?.advance(delta);','if(!qaBusy)scenes?.advance(delta);').replace('  renderer.draw({','  if(!qaBusy)renderer.draw({');
const hook="    scenes = new Scenes(document.querySelector('#ui'), store, audio, input, assets, notify);";
js=js.replace(hook,hook+"\n    installReleaseQA({scenes,store,audio,input,assets,renderer,viewport,notify,busy:value=>{qaBusy=value;}});");
fs.writeFileSync(path.join(root,'remaster/tests/browser-fixture.js'),js);
let html=fs.readFileSync(path.join(root,'remaster/index.html'),'utf8').replace('href="styles.css"','href="/remaster/styles.css"').replace('src="src/main.js"','src="/remaster/tests/browser-fixture.js"');
html=html.replace('<main>','<main><section id="qa-controls" aria-label="Release QA controls"><strong>QA ONLY · Separate test save</strong><p>This page never reads or writes your normal campaign save.</p><button id="qa-campaign">Run 20-wave browser test</button><button id="qa-benchmark">Benchmark crowded battles</button><button id="qa-shop">Load shop fixture</button><button id="qa-loss">Load loss fixture</button><button id="qa-menu">Return to QA checkpoint</button><button id="qa-stop" disabled>Stop test</button><p id="qa-status" role="status">Ready</p></section>');
html=html.replace('</footer>','</footer><details open><summary>QA report</summary><pre id="qa-report">No run yet.</pre></details>');
html=html.replace('<button id="qa-stop"','<button id="qa-audio">Measure sound levels</button><button id="qa-stop"');
html=html.replace('</head>',`<style>#qa-controls{max-width:960px;margin:0 auto 14px;padding:12px;background:#192b27;border:1px solid #8f8258;font:13px "Segoe UI",sans-serif}#qa-controls p{margin:5px 0 10px}#qa-controls button{padding:7px;margin:4px;background:#35493e;color:#fff;border:1px solid #768b7a;border-radius:4px}#qa-controls button:disabled{opacity:.4}#qa-report{white-space:pre-wrap;font:12px monospace;max-width:960px;margin:auto}.qa-running #ui,.qa-running #ui *{pointer-events:none!important}</style></head>`);
fs.writeFileSync(path.join(root,'remaster/tests/browser-fixture.html'),html);
console.log('QA: http://127.0.0.1:8765/remaster/tests/browser-fixture.html');
