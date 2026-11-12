import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Combat, FixedStepClock, simToDesign, designToSim, STEP_MS, DEATH_MS } from '../src/combat.js';
import { newCampaign, SaveStore } from '../src/save.js';

const balance = JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json', import.meta.url)));
function game(seed = 42) { const sim = new Combat(balance, newCampaign(), seed); sim.start(); return sim; }
function ticks(sim, count, input) { for (let i=0;i<count;i++) sim.tick(input); }
function finishPerfectly(sim) {
  for (let i=0;i<5000 && sim.status==='running';i++) {
    const target = sim.enemies.find(e=>e.x<625);
    sim.tick({ shots: target ? [{x:target.x,y:target.y-20}] : [] });
  }
}

test('wave 1 has exactly ten rifle soldiers, spawning at 1500ms intervals', () => {
  const sim=game();ticks(sim,59);assert.equal(sim.enemies.length,0);
  sim.tick();assert.equal(sim.enemies.length,1);assert.equal(sim.queue.length,9);
  ticks(sim,59);assert.equal(sim.enemies.length,1);sim.tick();assert.equal(sim.enemies.length,2);
  assert.ok(sim.enemies.every(e=>e.name==='SoldatAK'&&e.health===10&&e.y>=120&&e.y<373));
});

test('one starter hit awards exactly one kill, ten points and one money', () => {
  const sim=game();ticks(sim,90);const enemy=sim.enemies[0];
  sim.tick({shots:[{x:enemy.x,y:enemy.y-20}]});
  assert.equal(sim.kills,1);assert.equal(sim.score,10);assert.equal(sim.money,1);assert.equal(sim.ammo,5);
  assert.equal(sim.enemies.length,0);assert.equal(sim.corpses.length,1);
  ticks(sim,12);assert.equal(sim.score,10);assert.equal(sim.money,1);
});

test('a miss spends ammo without granting damage or rewards', () => {
  const sim=game();sim.tick({shots:[{x:400,y:250}]});
  assert.equal(sim.ammo,5);assert.equal(sim.shots,1);assert.equal(sim.hits,0);assert.equal(sim.money,0);
});

test('Cannon ignores held input and prevents shots inside its rate threshold', () => {
  const sim=game();sim.tick({shots:[{x:400,y:250}]});
  ticks(sim,10,{pressed:true,shots:[{x:400,y:250}]});
  assert.equal(sim.shots,1);
  sim.tick({shots:[{x:400,y:250}]});assert.equal(sim.shots,2);
  ticks(sim,20,{pressed:true});assert.equal(sim.shots,2);
});

test('empty magazine refills over 1050ms and cannot fire during partial reload', () => {
  const sim=game();
  for(let shot=0;shot<6;shot++){assert.equal(sim.fire({x:400,y:250}),true);if(shot<5)ticks(sim,11);}
  assert.equal(sim.ammo,0);assert.equal(sim.reloading,true);
  ticks(sim,7);assert.equal(sim.ammo,1);assert.equal(sim.fire({x:400,y:250}),false);
  ticks(sim,34);assert.equal(sim.reloading,true);assert.equal(sim.ammo,5);
  sim.tick();assert.equal(sim.reloading,false);assert.equal(sim.ammo,6);
  assert.equal(sim.fire({x:400,y:250}),true);
});

test('pause freezes spawning, enemies, ammo, reload, effects and simulation time', () => {
  const sim=game();ticks(sim,90);sim.fire({x:100,y:100});sim.pause();
  const before=JSON.stringify({queue:sim.queue,enemies:sim.enemies,ammo:sim.ammo,time:sim.elapsedMs,effects:sim.effects});
  ticks(sim,400,{shots:[{x:400,y:250}]});
  assert.equal(JSON.stringify({queue:sim.queue,enemies:sim.enemies,ammo:sim.ammo,time:sim.elapsedMs,effects:sim.effects}),before);
  sim.resume();sim.tick();assert.equal(sim.elapsedMs,90*STEP_MS+STEP_MS);
});

test('a complete successful first wave yields the correct atomic checkpoint', () => {
  const sim=game();finishPerfectly(sim);
  assert.equal(sim.status,'victory');assert.equal(sim.kills,10);assert.equal(sim.health,800);
  assert.equal(sim.score,100);assert.equal(sim.money,10);assert.equal(sim.corpses.length,0);
  const next=sim.victoryCheckpoint();assert.equal(next.wave,2);assert.equal(next.score,100);assert.equal(next.money,10);
  let raw;const store=new SaveStore({getItem:()=>raw||null,setItem:(k,v)=>{raw=v;}});store.saveCheckpoint(next);
  const restored=new SaveStore({getItem:()=>raw,setItem:()=>{}});assert.deepEqual(restored.campaign,next);
});

test('victory waits for temporary death visuals to finish', () => {
  const small={...balance,levels:[{SoldatAK:1}]};const sim=new Combat(small,newCampaign(),3);sim.start();ticks(sim,90);
  const enemy=sim.enemies[0];sim.tick({shots:[{x:enemy.x,y:enemy.y-20}]});
  assert.equal(sim.status,'running');ticks(sim,DEATH_MS/STEP_MS-1);assert.equal(sim.status,'running');
  sim.tick();assert.equal(sim.status,'victory');
});

test('unopposed attacks deplete the base and terminate exactly once', () => {
  const sim=game();for(let n=0;n<10000&&sim.status==='running';n++)sim.tick();
  assert.equal(sim.status,'defeat');assert.equal(sim.health,0);assert.equal(sim.score,0);
  const time=sim.elapsedMs;sim.tick({shots:[{x:300,y:250}]});assert.equal(sim.elapsedMs,time);
  assert.throws(()=>sim.victoryCheckpoint());assert.equal(sim.drainEvents().filter(e=>e.type==='defeat').length,1);
});

test('a dead base cannot also become a victory', () => {
  const sim=new Combat({...balance,levels:[{}]},{...newCampaign(),health:0});sim.start();sim.tick();
  assert.equal(sim.status,'defeat');assert.equal(sim.drainEvents().filter(e=>e.type==='victory').length,0);
});

test('retrying from the checkpoint does not keep failed-run rewards or damage', () => {
  const failed=game();ticks(failed,90);const e=failed.enemies[0];failed.tick({shots:[{x:e.x,y:e.y-20}]});
  failed.health=100;const retry=new Combat(balance,failed.checkpoint,42);
  assert.equal(retry.health,800);assert.equal(retry.money,0);assert.equal(retry.score,0);assert.equal(retry.ammo,6);
});

test('the same seed and elapsed time produce identical state at 30/60/144 render fps', () => {
  const snapshots=[];
  for(const fps of [30,60,144]){const sim=game(123),clock=new FixedStepClock();for(let frame=0;frame<fps*10;frame++)clock.advance(1/fps,()=>sim.tick());snapshots.push(JSON.stringify({time:sim.elapsedMs,hp:sim.health,enemies:sim.enemies,queue:sim.queue}));}
  assert.equal(snapshots[0],snapshots[1]);assert.equal(snapshots[1],snapshots[2]);
});

test('world/display mapping preserves range and targeting through a widescreen layout', () => {
  for(const p of [{x:680,y:120},{x:200,y:250},{x:100,y:373}]){const restored=designToSim(simToDesign(p));assert.ok(Math.abs(restored.x-p.x)<1e-9);assert.ok(Math.abs(restored.y-p.y)<1e-9);}
});

test('long frame stalls have bounded catch-up; reset discards paused time', () => {
  const clock=new FixedStepClock();let steps=0;clock.advance(10,()=>{steps++;});assert.equal(steps,10);
  clock.advance(.012,()=>{steps++;});clock.reset();clock.advance(.013,()=>{steps++;});assert.equal(steps,10);
});

test('invalid campaign bounds and unowned weapons are rejected', () => {
  assert.equal(new Combat(balance,{...newCampaign(),wave:2}).total,15);
  assert.throws(()=>new Combat(balance,{...newCampaign(),wave:21}));
  assert.throws(()=>new Combat(balance,{...newCampaign(),activeWeapon:'Rocket'}));
});
