import test from 'node:test';
import assert from 'node:assert/strict';
import {blastFeedback,battleShake,explosionPresentation} from '../src/battle-feedback.js';
test('blast size remains stable as support effects expire',()=>{
 const a=blastFeedback({ttl:600,duration:600}),b=blastFeedback({ttl:200,duration:600});
 assert.equal(a.radius,b.radius);assert.ok(b.progress>a.progress);
 assert.equal(blastFeedback({ttl:0,duration:600}).fade,0);
 assert.equal(blastFeedback({ttl:200,duration:600},true).travel,.25);
});
test('camera shake is bounded, freezes with simulation and respects both settings',()=>{
 const c={elapsedMs:25,effects:Array.from({length:40},()=>({blast:true,ttl:575,duration:600}))};
 const settings={shake:'low',reducedMotion:false},a=battleShake(c,settings);
 assert.ok(Math.abs(a.x)<=1.4&&Math.abs(a.y)<=.84);
 assert.deepEqual(battleShake(c,settings),a);
 assert.deepEqual(battleShake(c,{...settings,shake:'off'}),{x:0,y:0});
 assert.deepEqual(battleShake(c,{...settings,reducedMotion:true}),{x:0,y:0});
 assert.deepEqual(battleShake({...c,effects:[{blast:true,ttl:400,duration:600}]},settings),{x:0,y:0});
});
test('large explosions have staged fire and lingering smoke without changing combat lifetime',()=>{
 const rocket=explosionPresentation('Rocket',100),bomb=explosionPresentation('Avia',100),atomic=explosionPresentation('Atom',100);
 assert.ok(rocket.radius>52&&bomb.radius>rocket.radius&&atomic.radius>bomb.radius);
 assert.ok(explosionPresentation('Rocket',900).smoke>0);
 assert.equal(explosionPresentation('Rocket',900).fire,0);
 for(const kind of ['Rocket','Avia','Atom','Mine','Bazooka']){
  const first=explosionPresentation(kind,100),last=explosionPresentation(kind,first.life);
  assert.equal(last.fire,0);assert.equal(last.smoke,0);
  assert.deepEqual(explosionPresentation(kind,100),first);
  const reduced=explosionPresentation(kind,100,true);assert.ok(reduced.radius<first.radius&&reduced.travel<first.travel);
 }
});
