import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioManager} from '../src/audio.js';
function capture(){const a=new AudioManager({});a.context={currentTime:1};const calls=[];
 a.tone=(...args)=>calls.push(['tone',...args]);a.burst=(...args)=>calls.push(['burst',...args]);return {a,calls};}
test('all four weapon sound profiles differ and unknown weapons safely use cannon',()=>{
 const profiles=['Cannon','MashineGun','Bazooka','Rocket'].map(weapon=>{const {a,calls}=capture();a.combatEvent('shot',{weapon});return JSON.stringify(calls);});
 assert.equal(new Set(profiles).size,4);
 const {a,calls}=capture();a.combatEvent('shot',{weapon:'unknown'});assert.equal(JSON.stringify(calls),profiles[0]);
});
test('mass impacts are rate limited and destroyed armor adds a low body sound',()=>{
 const {a,calls}=capture();a.combatEvent('enemy-hit',{vehicle:true,destroyed:true});assert.equal(calls.length,4);
 a.combatEvent('enemy-hit',{vehicle:true});assert.equal(calls.length,4);
 a.context.currentTime+=.04;a.combatEvent('enemy-hit',{vehicle:false});assert.equal(calls.length,6);
});
test('reload completion has a different short cue from reload start',()=>{
 const start=capture(),end=capture();start.a.combatEvent('reload-start');end.a.combatEvent('reload-complete');
 assert.notDeepEqual(start.calls,end.calls);
 assert.ok(end.calls.every(c=>c[0]!=='tone'||c[3]<=.1));
});
