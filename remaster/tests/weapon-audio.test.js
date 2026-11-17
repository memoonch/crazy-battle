import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioManager} from '../src/audio.js';
function capture(){const a=new AudioManager({});a.context={currentTime:1};const calls=[];
 a.sample=(...args)=>calls.push(args);return {a,calls};}
test('all four weapon sound profiles differ and unknown weapons safely use cannon',()=>{
 const profiles=['Cannon','MashineGun','Bazooka','Rocket'].map(weapon=>{const {a,calls}=capture();a.combatEvent('shot',{weapon});return JSON.stringify(calls);});
 assert.equal(new Set(profiles).size,4);
 const {a,calls}=capture();a.combatEvent('shot',{weapon:'unknown'});assert.equal(JSON.stringify(calls),profiles[0]);
});
test('mass impacts are rate limited and destroyed armor adds a low body sound',()=>{
 const {a,calls}=capture();a.combatEvent('enemy-hit',{vehicle:true,destroyed:true});assert.equal(calls.length,2);
 a.combatEvent('enemy-hit',{vehicle:true});assert.equal(calls.length,2);
 a.context.currentTime+=.04;a.combatEvent('enemy-hit',{vehicle:false});assert.equal(calls.length,3);
});
test('reload completion has a different short cue from reload start',()=>{
 const start=capture(),end=capture();start.a.combatEvent('reload-start');end.a.combatEvent('reload-complete');
 assert.notDeepEqual(start.calls,end.calls);
 assert.equal(start.calls[0][0],'sndVistrelPreload');assert.equal(end.calls[0][0],'sndImpMet3');
});


test('wave results use distinct priority cues and leave the medal gong unchanged',()=>{
 const {a,calls}=capture();
 a.combatEvent('victory');a.combatEvent('defeat');a.combatEvent('achievement');
 assert.deepEqual(calls,[['waveVictory',.6,true],['waveDefeat',.6,true],['sndGong',.18]]);
});

test('result screens lower background music and returning to battle restores it',()=>{
 const a=new AudioManager({}),levels=[];
 a.context={currentTime:0};a.rotorLevel={gain:{setTargetAtTime(){}}};
 a.track={gain:{gain:{setTargetAtTime(value){levels.push(value);}}}};a.playMusic=()=>{};
 a.setScene('victory');a.setScene('preparation');a.setScene('defeat');a.setScene('combat');
 assert.deepEqual(levels,[.16,.55,.16,.55]);
});

test('wave-result cues can play over a full effects pool through the master-controlled effects bus',()=>{
 const a=new AudioManager({}),connections=[],starts=[];
 a.context={state:'running',createBufferSource:()=>({connect:node=>connections.push(node),start:()=>starts.push(1),disconnect(){}}),createGain:()=>({gain:{value:0},connect:node=>connections.push(node),disconnect(){}})};
 a.effects={};a.buffers.set('waveVictory',{});a.voices=24;
 a.sample('waveVictory');assert.equal(starts.length,0);
 a.combatEvent('victory');assert.equal(starts.length,1);assert.equal(connections.at(-1),a.effects);
});
