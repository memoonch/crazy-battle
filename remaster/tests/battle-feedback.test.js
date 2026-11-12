import test from 'node:test';
import assert from 'node:assert/strict';
import {blastFeedback,battleShake} from '../src/battle-feedback.js';
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
