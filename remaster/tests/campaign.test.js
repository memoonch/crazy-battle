import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Combat } from '../src/combat.js';
import { newCampaign, SaveStore, validCampaign } from '../src/save.js';
const balance=JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json',import.meta.url)));
const game=(extra={})=>new Combat(balance,{...newCampaign(),...extra},123);
const ticks=(s,n,input)=>{for(let i=0;i<n;i++)s.tick(input);};

test('all twenty shuffled rosters match recovered counts, rewards and progression',()=>{
 let enemies=0,money=0,score=0;
 for(let wave=1;wave<=20;wave++){
  const s=game({wave});
  for(const [name,count]of Object.entries(balance.levels[wave-1]))assert.equal(s.queue.filter(n=>n===(name==='Rocket'?'RocketBig':name)).length,count);
  s.start();
  for(let i=0;i<10000&&s.status==='running';i++){
   s.tick();for(const e of [...s.enemies])s.damageEnemy(e,e.health);
  }
  assert.equal(s.status,'victory');const c=s.victoryCheckpoint();assert.equal(c.wave,wave+1);assert.ok(validCampaign(c));
  enemies+=s.kills;money+=s.money;score+=s.score;
 }
 assert.equal(enemies,665);assert.equal(money,1145);assert.equal(score,31950);
});
test('weapon acquisition charges once, requires ownership, equips and reloads at recovered durations',()=>{
 const s=game({money:1000});
 for(const w of balance.weapons){
  if(w.name!=='Cannon'){const before=s.money;assert.equal(s.buyWeapon(w.name),true);assert.equal(s.money,before-w.cost);assert.equal(s.buyWeapon(w.name),false);}
  s.start();s.resume();for(let i=0;i<w.magazine;i++){s.rateCounter=w.rate+1;s.fire({x:600,y:220});}
  assert.equal(s.reloading,true);const duration=s.roundReloadMs*w.magazine;ticks(s,duration/25-1);assert.equal(s.reloading,true);s.tick();assert.equal(s.reloading,false);assert.equal(s.ammo,w.magazine);s.pause();
 }
 s.resume();assert.equal(s.buyWeapon('invalid'),false);assert.equal(s.equip('Cannon'),false);
});
test('held input fires only the machine gun at the strict tick threshold',()=>{
 const s=game({weapons:['Cannon','MashineGun'],activeWeapon:'MashineGun'});s.start();
 ticks(s,21,{held:true,aim:{x:600,y:250}});assert.equal(s.shots,5);
 const cannon=game();cannon.start();ticks(cannon,30,{held:true});assert.equal(cannon.shots,0);
});
test('switching owned weapons cannot refill magazines or bypass a reload',()=>{
 const s=game({money:100});s.buyWeapon('MashineGun');s.start();s.fire({x:500,y:250});s.pause();
 assert.equal(s.ammo,9);assert.ok(s.equip('Cannon'));assert.ok(s.equip('MashineGun'));assert.equal(s.ammo,9);assert.equal(s.equip('MashineGun'),false);
 s.resume();s.ammo=1;s.rateCounter=5;s.fire({x:500,y:250});s.pause();s.equip('Cannon');s.equip('MashineGun');assert.equal(s.reloading,true);assert.equal(s.ammo,0);
});
test('every automatic defense uses its own damage and splash without duplicating a target',()=>{
 for(const spec of balance.inventory){
  const s=game({money:100});s.placeDefense(0,spec.name);s.start();ticks(s,60);
  const e=s.enemies[0];Object.assign(e,{x:250,y:150,health:500,healthMax:500,state:'attack',counter:0});
  s.tick();ticks(s,25);assert.equal(e.health,500-spec.damage,spec.name);
 }
});
test('area projectiles capture launch targets, delay damage and never double-hit the primary',()=>{
 const s=game({weapons:['Cannon','Bazooka'],activeWeapon:'Bazooka'});s.start();ticks(s,60);
 const e=s.enemies[0];e.health=e.healthMax=100;e.x=400;e.y=250;
 s.fire({x:400,y:250});assert.equal(e.health,100);assert.equal(s.projectiles.length,1);
 const late={...e,id:999};s.enemies.push(late);e.x=300;
 ticks(s,30);assert.equal(e.health,60);assert.equal(late.health,100);
});
test('all defenses pay original prices, repair safely, sell once and survive checkpoint round trips',()=>{
 const s=game({money:1000});
 for(const [i,d]of balance.inventory.entries()){const before=s.money;assert.ok(s.placeDefense(i,d.name));assert.equal(s.money,before-d.cost);s.defenses[i].health=1;assert.ok(s.repairDefense(i));assert.equal(s.defenses[i].health,Math.floor(1+d.health/3));}
 const c=s.snapshot();assert.ok(validCampaign(c));const restored=game(c);assert.deepEqual(restored.snapshot(),c);
 restored.money=6;restored.defenses[4].health=1;assert.equal(restored.repairDefense(4),false);assert.equal(restored.money,6);
 assert.ok(restored.sellDefense(4));assert.equal(restored.sellDefense(4),false);
});
test('enemy rockets delay lane damage until impact and pause freezes projectiles',()=>{
 const s=game({wave:2});s.start();ticks(s,60);const e=s.enemies[0];Object.assign(e,balance.enemys.find(n=>n.name==='SoldatBazooka'),{x:300,y:150,state:'attack',counter:100});
 s.tick();assert.equal(s.health,800);assert.equal(s.projectiles.length,1);s.pause();const before=JSON.stringify(s.projectiles);ticks(s,100);assert.equal(JSON.stringify(s.projectiles),before);s.resume();ticks(s,20);assert.equal(s.health,780);
});
test('support stock is paid, deployed once, and Atom affects spawned enemies only',()=>{
 const s=game({money:100});for(const item of balance.omps)assert.ok(s.buySupport(item.name));assert.equal(s.money,20);
 s.start();ticks(s,60);assert.ok(s.arm('Atom'));const queued=s.queue.length;s.deploy({x:400,y:250});assert.equal(s.kills,1);assert.equal(s.queue.length,queued);assert.equal(s.supplies.Atom,0);assert.equal(s.arm('Atom'),false);assert.equal(s.deploy({x:400,y:250}),false);
});
test('mine triggers on one enemy and aircraft bombs the selected strip repeatedly',()=>{
 const s=game({supplies:{Mine:1,Avia:1,Atom:0}});s.start();ticks(s,60);const e=s.enemies[0];e.x=400;e.y=250;
 s.arm('Mine');s.deploy({x:400,y:250});s.tick();assert.equal(s.kills,1);assert.equal(s.mines.length,0);
 ticks(s,60);const target=s.enemies[0];target.x=400;target.y=250;target.state='attack';
 s.arm('Avia');s.deploy({x:350,y:250});ticks(s,32);assert.equal(s.kills,2);assert.equal(s.supplies.Avia,0);
});
test('preparation transactions restore economy, equipment and defenses atomically; legacy saves remain valid',()=>{
 const mem=new Map(),storage={getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)};const store=new SaveStore(storage);store.startNew();
 const s=game({money:100});s.buyWeapon('MashineGun');s.buySupport('Mine');s.placeDefense(0,'Mortar');s.health=700;s.repairBase();store.saveCheckpoint(s.snapshot());
 const restored=new SaveStore(storage);assert.deepEqual(restored.campaign,s.snapshot());assert.ok(validCampaign(newCampaign()));
 assert.equal(validCampaign({...newCampaign(),defenses:[{name:'Tank',health:1},null,null,null,null]}),false);
 const retry=game(s.snapshot());retry.start();retry.money=0;retry.supplies.Mine=0;const reset=game(retry.checkpoint);assert.deepEqual(reset.snapshot(),s.snapshot());
});
