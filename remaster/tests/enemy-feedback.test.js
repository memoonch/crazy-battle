import test from 'node:test';
import assert from 'node:assert/strict';
import {enemyFeedback} from '../src/enemy-feedback.js';
import {DEATH_MS} from '../src/combat.js';

test('enemy presentation freezes at fixed combat time and never mutates targets',()=>{
 const enemy={name:'SoldatAK',hitAt:100,ttl:DEATH_MS,health:10,x:320,y:200};
 const original=structuredClone(enemy),a=enemyFeedback(enemy,125,false,false);
 assert.deepEqual(enemyFeedback(enemy,125,false,false),a);
 assert.ok(a.lean>0&&a.lean<.04);
 assert.equal(enemyFeedback(enemy,250,false,false).lean,0);
 assert.deepEqual(enemy,original);
});
test('death feedback stays within existing corpse lifetime and respects reduced motion',()=>{
 for(const name of ['SoldatAK','TankSmall']){
  const enemy={name,ttl:DEATH_MS/2};
  const normal=enemyFeedback(enemy,200,true,false),reduced=enemyFeedback(enemy,200,true,true);
  assert.equal(normal.death,.5);assert.ok(normal.sink>0);
  assert.equal(reduced.lean,0);assert.equal(reduced.sink,0);
  assert.equal(enemyFeedback({...enemy,ttl:-25},200,true,false).death,1);
 }
});

test('both infantry types preserve their original gentle death lean',()=>{
 for(const name of ['SoldatAK','SoldatBazooka']){
  const early=enemyFeedback({name,ttl:DEATH_MS*.8},100,true,false),late=enemyFeedback({name,ttl:DEATH_MS*.1},100,true,false);
  assert.ok(early.lean>0&&late.lean>early.lean);assert.ok(late.lean>.12&&late.lean<.14);
 }
 assert.ok(enemyFeedback({name:'Tank',ttl:0},100,true,false).lean<.03);
});
