import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Combat} from '../src/combat.js';
import {newCampaign} from '../src/save.js';
const balance=JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json',import.meta.url)));

test('each kill supplies its drop position and credits the reward only once',()=>{
  const s=new Combat(balance,newCampaign(),42),skin=balance.enemys.find(e=>e.cost>0);
  const enemy={...skin,id:1,x:420,y:260,healthMax:skin.health};s.enemies=[enemy];
  const before=s.money;s.damageEnemy(enemy,99999);s.damageEnemy(enemy,99999);
  const drops=s.drainEvents().filter(e=>e.type==='kill');
  assert.equal(drops.length,1);assert.equal(s.money,before+skin.cost);
  assert.equal(s.earnedMoney,skin.cost);assert.equal(drops[0].money,skin.cost);
  assert.equal(drops[0].x,420);assert.equal(drops[0].y,260);
});
