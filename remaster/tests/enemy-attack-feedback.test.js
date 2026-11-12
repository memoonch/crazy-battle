import test from 'node:test';
import assert from 'node:assert/strict';
import {enemyAttackFeedback} from '../src/enemy-attack-feedback.js';
const tank={name:'Tank',health:100,state:'attack',counter:90,rate:100};
test('heavy aiming cue appears only near the existing firing threshold',()=>{
 assert.equal(enemyAttackFeedback({...tank,counter:70},1000).windup,0);
 assert.ok(enemyAttackFeedback(tank,1000).windup>0);
 assert.ok(enemyAttackFeedback({...tank,counter:100},1000).windup>enemyAttackFeedback(tank,1000).windup);
 for(const patch of [{state:'move'},{health:0},{name:'BTR'},{name:'SoldatAK'}])assert.equal(enemyAttackFeedback({...tank,...patch},1000).windup,0);
});
test('gun recovery follows a real shot timestamp, freezes with combat time and respects reduced motion',()=>{
 assert.equal(enemyAttackFeedback({...tank,counter:0},1000).recoil,0);
 const e={...tank,counter:0,lastAttackAt:1000},copy={...e},first=enemyAttackFeedback(e,1000);
 assert.equal(first.recoil,2.2);assert.deepEqual(enemyAttackFeedback(e,1000),first);
 assert.ok(enemyAttackFeedback(e,1100).recoil<first.recoil);assert.equal(enemyAttackFeedback(e,1220).recoil,0);
 assert.equal(enemyAttackFeedback(e,1000,true).recoil,0);assert.deepEqual(e,copy);
 assert.equal(enemyAttackFeedback({...e,health:0},1000).recoil,0);
});
