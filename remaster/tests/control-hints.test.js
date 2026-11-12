import test from 'node:test';
import assert from 'node:assert/strict';
import {shopHint,repairHint,supportHint,hintedControl} from '../src/control-hints.js';
import {AudioManager} from '../src/audio.js';
import {SaveStore,DEFAULT_SETTINGS,SAVE_KEY} from '../src/save.js';

test('shop and repair explanations distinguish combat, full health, loss and insufficient funds',()=>{
 assert.equal(shopHint(false),'Pause to open the shop.');assert.match(shopHint(false,'victory'),/before a wave/);
 assert.match(repairHint({health:800,money:10,canShop:true}),/full/);
 assert.match(repairHint({health:0,money:10,canShop:false}),/lost/);
 assert.match(repairHint({health:700,money:10,canShop:false}),/Pause/);
 assert.match(repairHint({health:700,money:4,canShop:true}),/at least 5/);
 assert.match(repairHint({health:700,money:5,canShop:true}),/80 HP for 3/);
});
test('support explanations include effect, correct price, stock and deployment state',()=>{
 for(const [name,cost]of [['Mine',10],['Avia',20],['Atom',50]]){
  const empty=supportHint({name,cost},0,true);assert.match(empty,/100 damage/);assert.ok(empty.includes(`Price: ${cost}`));assert.match(empty,/stock: 0/);assert.match(empty,/Buy stock/);
  assert.match(supportHint({name,cost},2,false),/Deploy during active combat/);
  assert.match(supportHint({name,cost},2,true,true),/again to cancel/);
 }
});
test('disabled controls retain focusable tooltip wrappers without enabling their actions',()=>{
 const html=hintedControl('<button disabled>Support</button>','Pause to open the shop.','shop-help',true);
 assert.match(html,/tabindex="0"/);assert.match(html,/aria-describedby="shop-help" disabled/);assert.match(html,/role="tooltip"/);
 assert.doesNotMatch(hintedControl('<button>Support</button>','Open','help',false),/tabindex/);
});
test('master mute silences all buses immediately and restores chosen volumes on unmute',()=>{
 const audio=new AudioManager(DEFAULT_SETTINGS),calls={master:[],music:[],effects:[]};
 audio.context={currentTime:10};
 for(const key of Object.keys(calls))audio[key]={gain:{cancelScheduledValues:t=>calls[key].push(['cancel',t]),setValueAtTime:(v,t)=>calls[key].push(['set',v,t]),setTargetAtTime:(v,t,c)=>calls[key].push(['target',v,t,c])}};
 audio.apply({...DEFAULT_SETTINGS,master:63,music:24,effects:82,muted:true});
 assert.deepEqual(calls.master,[['cancel',10],['set',0,10]]);assert.equal(calls.music.at(-1)[1],.24);assert.equal(calls.effects.at(-1)[1],.82);
 audio.apply({...audio.settings,muted:false});assert.equal(calls.master.at(-1)[1],.63);assert.equal(audio.settings.master,63);
});
test('mute survives save/reload independently of volume; legacy settings remain compatible',()=>{
 let raw;const storage={getItem:()=>raw,setItem:(k,v)=>{assert.equal(k,SAVE_KEY);raw=v;}};
 const store=new SaveStore(storage);store.startNew();store.saveSettings({...store.settings,master:63,muted:true});
 const loaded=new SaveStore(storage);assert.equal(loaded.settings.muted,true);assert.equal(loaded.settings.master,63);assert.equal(loaded.campaign.wave,1);
 const legacy=JSON.parse(raw);delete legacy.settings.muted;raw=JSON.stringify(legacy);
 const old=new SaveStore(storage);assert.equal(old.settings.muted,false);assert.equal(old.writable,true);
});
