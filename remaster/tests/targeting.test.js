import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Combat, simToDesign, designToSim } from '../src/combat.js';
import { soldierLayout, vehicleLayout } from '../src/sprite-layout.js';
import { newCampaign } from '../src/save.js';
import { measureViewport, clientToWorld } from '../src/viewport.js';
const balance=JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json',import.meta.url)));
const art=JSON.parse(fs.readFileSync(new URL('../assets/art/manifest.json',import.meta.url)));
function setup(name,state='attack',weapon='Cannon') {
 const c={...newCampaign(),weapons:weapon==='Cannon'?['Cannon']:['Cannon',weapon],activeWeapon:weapon};
 const s=new Combat(balance,c,42,art);s.start();
 const skin=balance.enemys.find(e=>e.name===name);
 const enemy={...skin,id:1,x:400,y:250,state,healthMax:skin.health,counter:0,attackFlash:0};
 s.enemies=[enemy];return {s,enemy};
}
function upperPaint(enemy) {
 const l=enemy.name.startsWith('Soldat')?soldierLayout(art,enemy,enemy.state==='move'?0:4):vehicleLayout(art,enemy);
 const limit=enemy.name.startsWith('Soldat')?-38*48/55:-52*48/55;
 let topPaint=null;
 for(let row=0;row<32;row++)for(let col=0;col<32;col++){
  const p={x:l.x+(col+.5)/32*l.w,y:l.y+(row+.5)/32*l.h};
  if(l.b.hitMask[row][col]==='1'&&!topPaint)topPaint=p;
  if(l.b.hitMask[row][col]==='1'&&p.y<limit)return p;
 }
 // Grounded tank crops now fit within the old tall body rectangle. Their
 // upper painted armor must remain targetable without requiring artificial height.
 if(topPaint)return topPaint;
 throw Error('Expected painted helmet/armor above legacy target: '+enemy.name);
}
for(const name of balance.enemys.map(e=>e.name))test(`${name}: painted helmet/upper armor accepts the normal shot and reward rules`,()=>{
 const {s,enemy}=setup(name),p=upperPaint(enemy),origin=simToDesign(enemy);
 const aim=designToSim({x:origin.x+p.x,y:origin.y+p.y});
 assert.ok(aim.y<enemy.y-20);
 assert.ok(s.fire(aim));assert.equal(s.hits,1);assert.equal(s.ammo,5);assert.equal(enemy.health,Math.max(0,enemy.healthMax-10));
 assert.equal(s.score,enemy.health===0?enemy.healthMax:0);assert.equal(s.money,enemy.health===0?enemy.cost:0);
 assert.equal(s.fire(aim),false);assert.equal(s.ammo,5);
});
test('area weapons capture a directly clicked tall vehicle outside the cursor-to-feet radius',()=>{
 for(const name of ['Bazooka','Rocket']){
  const {s,enemy}=setup('RocketBig','attack',name),p=upperPaint(enemy),origin=simToDesign(enemy);
  const aim=designToSim({x:origin.x+p.x,y:origin.y+p.y});
  assert.ok(Math.hypot(aim.x-enemy.x,aim.y-enemy.y)>s.weapon.radius);
  assert.ok(s.fire(aim));assert.equal(enemy.health,105);assert.equal(s.projectiles[0].targets.filter(t=>t===enemy).length,1);
  for(let i=0;i<40;i++)s.tick();assert.equal(enemy.health,105-s.weapon.damage);
 }
});
test('all legacy body targets remain accepted; distant empty terrain misses',()=>{
 for(const name of balance.enemys.map(e=>e.name)){
  const {s,enemy}=setup(name);
  for(const x of [-10,0,10])assert.ok(s.contains(enemy,{x:enemy.x+x,y:enemy.y-20}));
  assert.equal(s.contains(enemy,{x:enemy.x+100,y:enemy.y-100}),false);
 }
});
test('transparent upper corners do not become rectangular bonus targets',()=>{
 const {s,enemy}=setup('Tank');const l=vehicleLayout(art,enemy),origin=simToDesign(enemy);
 assert.equal(l.b.hitMask[0][0],'0');
 assert.equal(s.contains(enemy,designToSim({x:origin.x+l.x+.01,y:origin.y+l.y+.01})),false);
});
test('moving infantry helmets stay targetable across animation poses and reduced motion',()=>{
 for(const name of ['SoldatAK','SoldatBazooka']){
  const {s,enemy}=setup(name,'move');const p=upperPaint(enemy),origin=simToDesign(enemy);
  for(const elapsed of [0,25,100,350,500]){s.elapsedMs=elapsed;assert.ok(s.contains(enemy,designToSim({x:origin.x+p.x,y:origin.y+p.y})));}
 }
});
test('enlarged soldiers accept painted helmet clicks above their former sprite height',()=>{
 for(const name of ['SoldatAK','SoldatBazooka']){
  const {s,enemy}=setup(name),p=upperPaint(enemy),origin=simToDesign(enemy);
  assert.ok(p.y < -38,'helmet must extend visibly above the old roughly 37px sprite');
  assert.ok(s.fire(designToSim({x:origin.x+p.x,y:origin.y+p.y})));
  assert.equal(s.kills,1);assert.equal(s.score,10);assert.equal(s.money,1);assert.equal(s.ammo,5);
 }
});
test('hit feedback timestamps freeze during pause and never change damage/reward amounts',()=>{
 const {s,enemy}=setup('Tank');s.tick();s.damageEnemy(enemy,10);
 assert.equal(enemy.health,75);assert.equal(enemy.hitAt,25);assert.equal(s.score,0);
 s.pause();for(let i=0;i<100;i++)s.tick();assert.equal(s.elapsedMs,25);assert.equal(enemy.hitAt,25);
});
test('highest-lane upper armor is clickable at native, narrow and fullscreen sizes',()=>{
 const {s,enemy}=setup('RocketBig');enemy.y=120;
 const p=upperPaint(enemy),origin=simToDesign(enemy),target={x:origin.x+p.x,y:origin.y+p.y};
 assert.ok(target.y<185&&target.y>=170);
 for(const [w,h]of [[960,540],[768,432],[1680,1050],[2560,1080]]){
  const view=measureViewport(w,h),rect={left:20,top:50};
  const pointer=clientToWorld(rect.left+view.offsetX+target.x*view.scale,rect.top+view.offsetY+target.y*view.scale,rect,view);
  assert.ok(pointer.battlefield);assert.ok(s.contains(enemy,designToSim(pointer)));
  assert.equal(clientToWorld(rect.left+view.offsetX+500*view.scale,rect.top+view.offsetY+100*view.scale,rect,view).battlefield,false);
 }
});
