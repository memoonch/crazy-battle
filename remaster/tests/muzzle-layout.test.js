import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HELICOPTER_GUN_ARC,helicopterGun,helicopterPose,muzzlePoint,projectileDisplay,muzzleDirection,VEHICLE_MUZZLES} from '../src/muzzle-layout.js';
import {vehicleLayout} from '../src/sprite-layout.js';
import {simToDesign} from '../src/combat.js';
const art=JSON.parse(fs.readFileSync(new URL('../assets/art/manifest.json',import.meta.url)));
const combat=()=>({elapsedMs:1000,helicopter:{x:130,y:170,tilt:10},traces:[{player:true,ttl:40,weapon:'Cannon'}],enemies:[],corpses:[],defenses:[]});
test('helicopter rotating mount shares the muzzle endpoint for every weapon and aim',()=>{
 const c=combat();
 for(const weapon of ['Cannon','MashineGun','Bazooka','Rocket'])for(const aim of [{x:900,y:400},{x:10,y:450},{x:500,y:100}])for(const reduced of [false,true]){
  c.activeWeapon=weapon;const gun=helicopterGun(art,c,reduced,aim),p=muzzlePoint(art,c,{player:true},reduced,{},aim);
  assert.deepEqual(p,gun.tip);
  assert.ok(Math.abs(Math.atan2(p.y-gun.world.y,p.x-gun.world.x)-gun.angle)<1e-9);
  assert.ok(Math.abs(Math.hypot(p.x-gun.world.x,p.y-gun.world.y)-gun.length)<1e-9);
 }
 assert.equal(new Set(['Cannon','MashineGun','Bazooka','Rocket'].map(activeWeapon=>helicopterGun(art,{...c,activeWeapon}).index)).size,4);
});
test('vehicle barrel tips are inside their atlas frame and project from the painted sprite',()=>{
 for(const [name,tip]of Object.entries(VEHICLE_MUZZLES)){
  const c=combat(),e={name,id:1,x:420,y:230,state:'attack'};c.enemies=[e];
  const l=vehicleLayout(art,e),p=simToDesign(e),m=muzzlePoint(art,c,{enemyId:1},true);
  assert.ok(tip[0]>=l.b.x&&tip[0]<=l.b.x+l.b.width&&tip[1]>=l.b.y&&tip[1]<=l.b.y+l.b.height);
  assert.ok(Math.abs(m.x-(p.x+l.x+(tip[0]-l.b.x)*l.w/l.b.width))<1e-9);
  assert.ok(Math.abs(m.y-(p.y+l.y+(tip[1]-l.b.y)*l.h/l.b.height))<1e-9);
 }
});
test('tank muzzle and recoiling gun share the same offset',()=>{
 const c=combat();c.enemies=[{name:'Tank',id:1,x:420,y:230,state:'attack',health:100,counter:0,lastAttackAt:1000}];
 const recoil=muzzlePoint(art,c,{enemyId:1},false),still=muzzlePoint(art,c,{enemyId:1},true);
 assert.ok(Math.abs(recoil.x-still.x-2.2)<1e-9);assert.equal(recoil.y,still.y);
});
test('projectile presentation starts at the barrel and ends at the original impact without mutation',()=>{
 const shot={x:200,y:200,from:{x:200,y:200},to:{x:400,y:250}},before=structuredClone(shot),origin={x:333,y:111};
 assert.deepEqual(projectileDisplay(shot,origin),origin);
 assert.deepEqual(projectileDisplay({...shot,...shot.to},origin),simToDesign(shot.to));assert.deepEqual(shot,before);
});
test('every muzzle flame follows the actual shot direction including mortar and tilted helicopter',()=>{
 for(const source of [{player:true},{enemyId:1,weapon:'Tank'},{slot:1}])for(const reduced of [false,true]){
  for(const to of [{x:90,y:10},{x:10,y:90},{x:-90,y:-10}]){
   assert.equal(muzzleDirection(combat(),source,reduced,{x:0,y:0},to),Math.atan2(to.y,to.x));
  }
 }
});
test('mortar muzzle follows the rising projectile segment rather than an instant horizontal tracer',()=>{
 const c=combat();c.projectiles=[{x:110,y:150,from:{x:100,y:200},to:{x:400,y:200},source:{slot:1}}];
 const from=simToDesign(c.projectiles[0].from),to=simToDesign(c.projectiles[0].to),p=projectileDisplay(c.projectiles[0],from);
 assert.equal(muzzleDirection(c,{slot:1},false,from,to),Math.atan2(p.y-from.y,p.x-from.x));
 assert.ok(muzzleDirection(c,{slot:1},false,from,to)<0);
 c.projectiles[0]={...c.projectiles[0],...c.projectiles[0].from,type:'Mortar'};
 assert.ok(muzzleDirection(c,{slot:1},false,from,to)<-.5);
});

test('helicopter mount recoil settles and reduced motion disables it',()=>{
 const c=combat();c.activeWeapon='Rocket';c.traces=[{player:true,ttl:65,weapon:'Rocket',to:{x:500,y:250}}];
 const kick=helicopterGun(art,c),quiet=helicopterGun(art,c,true);
 assert.equal(kick.recoil,1.6);assert.equal(quiet.recoil,0);
 c.traces[0].ttl=20;assert.ok(helicopterGun(art,c).recoil<kick.recoil);
 c.traces=[];assert.equal(helicopterGun(art,c).recoil,0);
});
test('visible launch locks to its shot target while cursor moves, then follows cursor',()=>{
 const c=combat();c.traces=[{player:true,ttl:65,to:{x:500,y:250}}];
 assert.equal(helicopterGun(art,c,false,{x:5,y:5}).angle,helicopterGun(art,c,false,{x:900,y:450}).angle);
 c.traces=[];assert.notEqual(helicopterGun(art,c,false,{x:5,y:5}).angle,helicopterGun(art,c,false,{x:900,y:450}).angle);
});

test('chin gun stays in its forward firing arc with only a small rearward allowance',()=>{
 const c=combat();c.traces=[];
 for(const activeWeapon of ['Cannon','MashineGun','Bazooka','Rocket'])for(let i=0;i<360;i++){
  const aim={x:400+Math.cos(i*Math.PI/180)*1000,y:200+Math.sin(i*Math.PI/180)*1000};
  const gun=helicopterGun(art,{...c,activeWeapon},false,aim);
  assert.ok(gun.localAngle>=HELICOPTER_GUN_ARC.min&&gun.localAngle<=HELICOPTER_GUN_ARC.max);
  assert.ok(Math.hypot(gun.pivot.x-gun.anchor.x,gun.pivot.y-gun.anchor.y)<3);
  assert.ok(gun.length>0);
 }
 assert.equal(HELICOPTER_GUN_ARC.max,105*Math.PI/180);
});
