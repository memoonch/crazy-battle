import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {vehicleMotion,VEHICLE_WHEELS,wheelAngle} from '../src/vehicle-motion.js';
import {vehicleLayout} from '../src/sprite-layout.js';
import {Renderer} from '../src/renderer.js';
const art=JSON.parse(fs.readFileSync(new URL('../assets/art/manifest.json',import.meta.url)));
test('running gear follows traveled distance and stays within targeting bob allowance',()=>{
 for(const name of Object.keys(VEHICLE_WHEELS)){
  const e={name,id:2,state:'move',x:500},copy={...e},a=vehicleMotion(e,false,false);
  assert.deepEqual(vehicleMotion(e,false,false),a);assert.deepEqual(e,copy);
  assert.notEqual(vehicleMotion({...e,x:499},false,false).roll,a.roll);
  for(let x=100;x<680;x+=.5)assert.ok(Math.abs(vehicleMotion({...e,x},false,false).bob)<=.4);
  const {b}=vehicleLayout(art,e);
  for(const [x,y,rx,ry]of VEHICLE_WHEELS[name])assert.ok(x-rx>=b.x&&x+rx<=b.x+b.width&&y-ry>=b.y&&y+ry<=b.y+b.height,name);
 }
});
test('stopped, destroyed and reduced-motion vehicles do not animate running gear',()=>{
 const e={name:'Tank',id:1,state:'move',x:420};
 for(const state of [vehicleMotion({...e,state:'attack'},false,false),vehicleMotion(e,true,false),vehicleMotion(e,false,true)]){
  assert.equal(state.moving,false);assert.equal(state.bob,0);
 }
 assert.equal(vehicleMotion({...e,state:'attack'},false,false).roll,vehicleMotion(e,false,false).roll);
 assert.equal(vehicleMotion(e,true,false).roll,0);assert.equal(vehicleMotion(e,false,true).roll,0);
});
test('running gear rotates only the audited inner hub patches at every phase',()=>{
 const renderer=new Renderer({getContext:()=>({})},{view:{scale:1,dpr:1}});
 let expected=[],draws=0;
 renderer.sprite=(c,key,b)=>{draws++;assert.ok(['vehicles-painted','machine-gun-jeep'].includes(key));assert.ok(expected.some(([x,y,rx,ry])=>b.x===x-rx&&b.y===y-ry&&b.width===rx*2&&b.height===ry*2));};
 const c={globalAlpha:1,save(){},restore(){},translate(){},scale(){},beginPath(){},arc(){},ellipse(){},clip(){},rotate(){},moveTo(){},lineTo(){},stroke(){}};
 for(const name of Object.keys(VEHICLE_WHEELS))for(const x of [510,509,495,470]){
  const enemy={name,x,id:1,state:'move',health:100,healthMax:100};
  expected=VEHICLE_WHEELS[name];
  renderer.runningGear(c,enemy,vehicleLayout(art,enemy),vehicleMotion(enemy,false,false),100);
 }
 assert.ok(draws>100);
});
test('painted tyre contact is the ground anchor and moving vehicles never lift their wheels',()=>{
 for(const name of Object.keys(VEHICLE_WHEELS)){
  const e={name,id:1,x:440,state:'move'},l=vehicleLayout(art,e),s=l.w/l.b.width;
  assert.ok(Math.abs(l.y+(l.b.groundY-l.b.y)*s)<1e-9);
  assert.equal(l.b.y+l.b.height,l.b.groundY+2);
  for(let x=100;x<680;x+=3)assert.equal(vehicleMotion({...e,x},false,false).bob,0);
 }
});
test('wheel rotation uses the outer tyre radius so one circumference gives one revolution',()=>{
 for(const name of Object.keys(VEHICLE_WHEELS)){
  const l=vehicleLayout(art,{name}),scale=l.w/l.b.width;
  for(const [,,,innerRadius,outerRadius]of VEHICLE_WHEELS[name]){
   assert.ok(outerRadius>innerRadius);
   assert.ok(Math.abs(wheelAngle(2*Math.PI*outerRadius*scale,outerRadius,scale)+2*Math.PI)<1e-9);
  }
 }
});

test('vehicle smoke animates from combat time and stays still when paused or reduced motion is enabled',()=>{
 const r=new Renderer({getContext:()=>({})},{view:{scale:1,dpr:1}}),enemy={name:'Tank',id:3,ttl:300},layout=vehicleLayout(art,enemy);
 function sample(time,reduced=false){const calls=[];r.reducedMotion=reduced;r.vfx=(...args)=>calls.push(args.slice(1));r.vehicleSmoke({globalAlpha:1,save(){},restore(){}},enemy,layout,time);return calls;}
 assert.deepEqual(sample(1000),sample(1000));assert.notDeepEqual(sample(1000),sample(1100));
 assert.deepEqual(sample(1000,true),sample(2000,true));assert.ok(sample(1000).every(call=>call[0]===4));
});

test('vehicle smoke rises vertically without flames or horizontal sway',()=>{
 const r=new Renderer({getContext:()=>({})},{view:{scale:1,dpr:1}}),enemy={name:'Tank',id:3,ttl:300},layout=vehicleLayout(art,enemy);
 function sample(time){const calls=[];r.vfx=(c,...args)=>calls.push(args);r.vehicleSmoke({globalAlpha:1,save(){},restore(){}},enemy,layout,time);return calls;}
 const a=sample(1000),b=sample(1100);
 assert.equal(a.length,b.length);
 for(let i=0;i<a.length;i++){assert.equal(a[i][1],b[i][1]);assert.equal(a[i][5],0);assert.equal(b[i][5],0);if(a[i][0]===2){assert.equal(a[i][3],b[i][3]);assert.equal(a[i][4],b[i][4]);}}
});
