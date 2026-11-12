import {Combat,simToDesign} from '../src/combat.js';
import {newCampaign,validCampaign} from '../src/save.js';
const raf=()=>new Promise(resolve=>requestAnimationFrame(resolve));
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const percentile=(values,p)=>[...values].sort((a,b)=>a-b)[Math.min(values.length-1,Math.floor(values.length*p))];
export function installReleaseQA(ctx){
 const {scenes,store,input,assets,renderer,viewport}=ctx;
 const report={environment:{userAgent:navigator.userAgent},campaign:null,benchmarks:[]};
 let stop=false;
 const status=text=>document.querySelector('#qa-status').textContent=text;
 const publish=()=>document.querySelector('#qa-report').textContent=JSON.stringify(report,null,2);
 const busy=value=>{ctx.busy(value);document.body.classList.toggle('qa-running',value);for(const b of document.querySelectorAll('#qa-controls button'))b.disabled=value;document.querySelector('#qa-stop').disabled=!value;};
 const render=()=>renderer.draw({time:scenes.combat?.elapsedMs/1000||0,scene:scenes.name,settings:store.settings,pointer:input.state,combat:scenes.combat,selectedSlot:scenes.selectedSlot});
 async function run(fn){stop=false;busy(true);try{await fn();}catch(error){report.error=error.message;status('FAILED: '+error.message);}finally{publish();busy(false);}}
 document.querySelector('#qa-stop').onclick=()=>{stop=true;};
 document.querySelector('#qa-campaign').onclick=()=>run(async()=>{
  report.campaign={mode:'Automated browser engine run; no injected damage/ammo/rewards',waves:[],complete:false};
  scenes.startNew();let totalKills=0;
  for(let wave=1;wave<=20;wave++){
   if(stop)throw Error('Stopped by user');
   const s=scenes.combat;
   for(const name of ['MashineGun','Bazooka','Rocket'])s.buyWeapon(name);
   while(s.health<800&&s.money>4)s.repairBase();
   for(let slot=0;slot<5;slot++){
    while(s.defenses[slot]?.health<s.defenses[slot]?.maxHealth&&s.money>5)if(!s.repairDefense(slot))break;
    if(!s.defenses[slot]&&s.weapons.includes('Rocket'))s.placeDefense(slot,'CannonBig');
   }
   scenes.persistPreparation();scenes.startCombat();let ticks=0;
   while(s.status==='running'&&ticks<30000){
    for(let batch=0;batch<40&&s.status==='running';batch++){
     const enemy=s.enemies.filter(e=>e.x<=640).sort((a,b)=>a.x-b.x)[0];
     const aim=simToDesign(enemy?{x:enemy.x,y:enemy.y-18}:{x:500,y:240});
     Object.assign(input.state,aim,{inside:true,battlefield:true,pressed:false});
     if(enemy)input.shots.push(aim);
     scenes.advance(.025);ticks++;
    }
    status(`Browser campaign: wave ${wave}/20 · ${s.kills}/${s.total} eliminated`);render();await raf();
    if(stop)throw Error('Stopped by user');
   }
   assert(s.status==='victory',`Wave ${wave} ended ${s.status}`);assert(store.campaign.wave===wave+1,'Next checkpoint not saved');assert(validCampaign(store.campaign),'Invalid checkpoint');
   totalKills+=s.kills;
   report.campaign.waves.push({wave,kills:s.kills,total:s.total,health:s.health,money:s.money,score:s.score,weapon:s.activeWeapon,saveRevision:store.data.revision,achievements:[...store.campaign.achievements]});
   publish();render();await raf();
   if(wave<20){scenes.campaign=store.campaign;scenes.prepare();}
  }
  assert(totalKills===665,'Enemy count mismatch');assert(store.campaign.score===31950,'Score total mismatch');
  assert(store.campaign.wave===21,'Completion checkpoint missing');
  for(const id of ['achivementsDefender','achivementsBronze','achivementsSilver','achivementsGold'])assert(store.campaign.achievements.includes(id),'Missing honor '+id);
  report.campaign.complete=true;report.campaign.totalKills=totalKills;report.campaign.finalTotal=store.campaign.score+store.campaign.money;
  status('PASS: all 20 waves completed and saved through the browser engine');
 });
 function fixture(patch={}){
  const checkpoint={...newCampaign(),wave:6,health:600,money:300,supplies:{Mine:1,Avia:1,Atom:1},...patch};
  store.startNew();store.saveCheckpoint(checkpoint);scenes.campaign=store.campaign;scenes.prepare();
 }
 document.querySelector('#qa-shop').onclick=()=>{fixture();status('Shop fixture · 300 supplies, damaged base, support stock 1 each.');};
 const shootingPreview=document.createElement('button');shootingPreview.textContent='Freeze shooting preview';document.querySelector('#qa-controls').append(shootingPreview);
 const blastPreview=document.createElement('button');blastPreview.textContent='Freeze explosion preview';document.querySelector('#qa-controls').append(blastPreview);
 blastPreview.onclick=()=>{
  fixture();scenes.startCombat();const s=scenes.combat;
  for(let i=0;i<350;i++)s.tick();s.arm('Atom');s.deploy({x:440,y:260});
  for(let i=0;i<4;i++)s.tick();s.pause();scenes.updateCombatHUD();render();
  status('Frozen support explosion · QA presentation fixture only.');
 };
 const destructionPreview=document.createElement('button');destructionPreview.textContent='Freeze destruction preview';document.querySelector('#qa-controls').append(destructionPreview);
 destructionPreview.onclick=()=>{
  fixture();scenes.startCombat();const s=scenes.combat;
  for(let i=0;i<1200&&!s.enemies.some(e=>!e.name.startsWith('Soldat')&&e.x<570);i++)s.tick();
  const target=s.enemies.find(e=>!e.name.startsWith('Soldat')&&e.x<570);
  if(!target){status('No vehicle target');return;}
  for(let i=0;i<1600&&s.enemies.includes(target)&&s.status==='running';i++)s.tick({shots:[{x:target.x,y:target.y-20}]});
  for(let i=0;i<3;i++)s.tick();s.pause();scenes.updateCombatHUD();render();
  status('Frozen vehicle destruction · normal cannon damage; QA presentation fixture only.');
 };
 shootingPreview.onclick=()=>{
  fixture();scenes.startCombat();const s=scenes.combat;
  for(let i=0;i<600&&!s.enemies.some(e=>e.x<570);i++)s.tick();
  const enemy=s.enemies.find(e=>e.x<570);if(!enemy){status('No preview target');return;}
  s.fire({x:enemy.x,y:enemy.y-20});s.pause();scenes.updateCombatHUD();render();
  status('Frozen actual cannon shot · presentation fixture only. Load shop fixture to resume normal testing.');
 };
 document.querySelector('#qa-loss').onclick=()=>{fixture({health:5,money:0});scenes.startCombat();status('Loss fixture · let the base fall, then verify Retry.');};
 document.querySelector('#qa-menu').onclick=()=>{scenes.combat=null;scenes.campaign=store.campaign;scenes.go('menu');status('QA save retained. Reload this page to verify persistence.');};
 document.querySelector('#qa-audio').onclick=()=>run(async()=>{
  const {audio}=ctx,settings=store.settings;
  await audio.unlock();assert(audio.context?.state==='running','AudioContext did not start');
  const analyser=audio.context.createAnalyser();analyser.fftSize=2048;audio.master.connect(analyser);
  const buffer=new Float32Array(analyser.fftSize);
  async function sample(frames,effects){
   let peak=0,squared=0,total=0;
   for(let i=0;i<frames;i++){
    await raf();if(stop)throw Error('Stopped by user');
     if(effects){if(i%8===0)audio.combatEvent('shot',{weapon:['Cannon','MashineGun','Bazooka','Rocket'][Math.floor(i/8)%4]});if(i%30===0)audio.combatEvent('explosion');if(i%12===0){audio.combatEvent('defense-shot');audio.combatEvent('enemy-hit',{vehicle:true,destroyed:i%24===0});}if(i%45===0)audio.combatEvent('reload-complete');}
    analyser.getFloatTimeDomainData(buffer);
    if(i>6)for(const value of buffer){peak=Math.max(peak,Math.abs(value));squared+=value*value;total++;}
   }
   return {peak,rms:Math.sqrt(squared/total)};
  }
  try{
   audio.apply({...settings,muted:false});status('Measuring sound: active mix');const active=await sample(150,true);
   audio.apply({...settings,muted:true});status('Measuring sound: muted mix');const muted=await sample(45,true);
   audio.apply({...settings,muted:false});const restored=await sample(45,false);
   report.audio={measurement:'Master bus before compressor; objective signal check, not a listening review',originalAudio:{decoded:[...audio.buffers.keys()],errors:audio.loadErrors,music:audio.trackKey},settings,active,muted,restored};
   assert(active.peak>0,'No active sound signal');assert(muted.peak<.00001,'Master mute did not silence signal');assert(restored.peak>0,'Unmute did not restore signal');
   status('PASS: sound signal, master mute and restoration verified');
  }finally{audio.apply(settings);audio.master.disconnect(analyser);analyser.disconnect();}
 });
 document.querySelector('#qa-benchmark').onclick=()=>run(async()=>{
  report.benchmarks=[];
  for(const [label,count,reduced]of [['10 enemies',10,false],['40 enemies + effects',40,false],['40 enemies + reduced motion',40,true]]){
   const s=new Combat(assets.balance,{...newCampaign(),wave:20,money:300},42,assets.art);
   for(let slot=0;slot<5;slot++)s.placeDefense(slot,'CannonBig');
   s.enemies=Array.from({length:count},(_,i)=>{const spec=assets.balance.enemys[i%8];return {...spec,id:i+1,x:210+(i%8)*52,y:135+Math.floor(i/8)*53,state:'move',counter:0,attackFlash:0,healthMax:spec.health,health:Math.ceil(spec.health*[1,.55,.2][i%3])};});
   s.queue=[];s.total=count;s.start();scenes.combat=s;scenes.name='combat';scenes.render();
   const cpu=[],intervals=[];let previous;
   for(let frame=0;frame<210;frame++){
    const timestamp=await raf();if(stop)throw Error('Stopped by user');
    s.elapsedMs=frame*1000/60;
    if(count===40){
     s.effects=Array.from({length:40},(_,i)=>({x:220+(i%8)*48,y:140+Math.floor(i/8)*50,ttl:150,hit:true,blast:i%5===0}));
     s.traces=Array.from({length:60},(_,i)=>({from:{x:86,y:130+i%5*50},to:{x:240+i%8*48,y:140+i%5*50},ttl:65,enemy:i%2===0}));
     s.projectiles=Array.from({length:30},(_,i)=>({x:250+i%8*45,y:150+i%5*45}));
     if(frame%12===0)for(const e of s.enemies)e.hitAt=s.elapsedMs;
    }
    const start=performance.now();scenes.updateHud();renderer.draw({time:s.elapsedMs/1000,scene:'combat',settings:{...store.settings,reducedMotion:reduced},pointer:{inside:false},combat:s,selectedSlot:0});const duration=performance.now()-start;
    if(frame>=30){cpu.push(duration);if(previous!==undefined)intervals.push(timestamp-previous);}previous=timestamp;
    status(`Benchmark: ${label} · ${frame+1}/210 frames`);
   }
   report.benchmarks.push({label,frames:cpu.length,viewport:{width:viewport.view.width,height:viewport.view.height,dpr:viewport.view.dpr},cpuMeanMs:cpu.reduce((a,b)=>a+b,0)/cpu.length,cpuP95Ms:percentile(cpu,.95),cpuMaxMs:Math.max(...cpu),rafMedianMs:percentile(intervals,.5),rafP95Ms:percentile(intervals,.95),framesOver33ms:intervals.filter(n=>n>33.4).length});
   s.pause();publish();
  }
  status('Benchmark complete · CPU render/HUD timing and RAF intervals, not a GPU profiler.');
 });
 publish();
}
