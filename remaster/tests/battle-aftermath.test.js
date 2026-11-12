import test from 'node:test';
import assert from 'node:assert/strict';
import {BattleAftermath,wreckEnvelope,SCAR_LIMIT,WRECK_LIMIT} from '../src/battle-aftermath.js';
const battle=()=>({elapsedMs:100,effects:[{x:440,y:260,blast:true,kind:'Rocket'}],corpses:[{name:'Tank',id:1,x:420,y:240,ttl:300,health:0}]});
test('aftermath survives expired combat effects without mutation or duplicate records',()=>{
 const c=battle(),original=structuredClone(c),a=new BattleAftermath();a.update(c);a.update(c);
 assert.equal(a.scars.length,2);assert.equal(a.wrecks.length,1);assert.deepEqual(c,original);
 c.effects=[];c.corpses=[];c.elapsedMs=1000;a.update(c);
 assert.equal(a.wrecks.length,1);assert.ok(wreckEnvelope(c.elapsedMs-a.wrecks[0].born).visible);
 c.elapsedMs=8100;a.update(c);assert.equal(a.wrecks.length,0);assert.equal(a.scars.length,2);
 c.elapsedMs=30101;a.update(c);assert.equal(a.scars.length,0);
});
test('crowded aftermath is bounded and ignores infantry wrecks and off-field blast scars',()=>{
 const a=new BattleAftermath(),c=battle();
 c.effects=Array.from({length:50},()=>({x:440,y:260,blast:true}));
 c.effects.push({x:50,y:200,blast:true});
 c.corpses=Array.from({length:30},(_,id)=>({name:'Tank',id,x:400,y:220,ttl:300}));
 c.corpses.push({name:'SoldatAK',id:100,x:400,y:220,ttl:300});a.update(c);
 assert.equal(a.wrecks.length,WRECK_LIMIT);assert.equal(a.scars.length,SCAR_LIMIT);
 assert.ok(a.wrecks.every(w=>w.unit.name==='Tank'));assert.ok(a.scars.every(s=>s.x>=145));
});
test('wreck envelopes freeze with combat time and fade before expiry; new encounters start clean',()=>{
 assert.equal(wreckEnvelope(300).visible,false);assert.equal(wreckEnvelope(350).visible,true);
 assert.deepEqual(wreckEnvelope(1500),wreckEnvelope(1500));
 assert.ok(wreckEnvelope(7000).alpha<wreckEnvelope(1000).alpha);
 assert.equal(wreckEnvelope(8000).visible,false);assert.equal(wreckEnvelope(6000).smoke,0);
 assert.equal(new BattleAftermath().wrecks.length,0);
});
