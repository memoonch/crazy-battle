import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AchievementTracker, ACHIEVEMENTS } from '../src/achievements.js';
import { Combat } from '../src/combat.js';
import { newCampaign, SaveStore } from '../src/save.js';
const balance=JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json',import.meta.url)));

test('combo awards include same-tick kills and award each threshold once',()=>{
 const t=new AchievementTracker();assert.deepEqual(t.kill(0),[]);
 assert.deepEqual(t.kill(0),['achivementsCombo2']);t.kill(25);t.kill(50);
 assert.deepEqual(t.kill(75),['achivementsCombo5']);assert.deepEqual(t.kill(100),[]);
});
test('combo window excludes exactly 300ms and requires all five kills inside the window',()=>{
 const t=new AchievementTracker();t.kill(0);assert.deepEqual(t.kill(300),[]);
 t.kill(400);t.kill(500);t.kill(600);assert.equal(t.owned.has('achivementsCombo5'),false);
 t.kill(625);assert.equal(t.owned.has('achivementsCombo5'),false);
 t.kill(650);assert.ok(t.owned.has('achivementsCombo5'));
});
test('service medals unlock after waves 5, 10 and 20 rather than the original early-wave bug',()=>{
 const t=new AchievementTracker();t.baseDamage=1;
 for(let wave=1;wave<=20;wave++){
  const got=t.victory(wave);assert.deepEqual(got,({5:['achivementsBronze'],10:['achivementsSilver'],20:['achivementsGold']})[wave]||[]);
 }
 assert.deepEqual(t.victory(20),[]);
});
test('base repairs cannot conceal damage from Defender; emplacement hits do not count as base hits',()=>{
 const s=new Combat(balance,{...newCampaign(),money:20},1);s.start();s.damageBaseOrDefense(null,80);s.pause();s.repairBase();assert.equal(s.health,800);
 assert.equal(s.achievements.victory(1).includes('achivementsDefender'),false);
 const clean=new Combat(balance,{...newCampaign(),money:20},1);clean.placeMaxim(0);clean.damageBaseOrDefense(clean.defenses[0],5);
 assert.ok(clean.achievements.victory(1).includes('achivementsDefender'));
});
test('achievement state pauses with combat and is discarded by retry before victory',()=>{
 const s=new Combat(balance,newCampaign(),1);s.start();for(let i=0;i<120;i++)s.tick();
 const enemies=[...s.enemies];s.damageEnemy(enemies[0],10);s.pause();const time=s.elapsedMs;for(let i=0;i<100;i++)s.tick();assert.equal(s.elapsedMs,time);
 s.damageEnemy(enemies[1],10);assert.ok(s.achievements.owned.has('achivementsCombo2'));
 const retry=new Combat(balance,s.checkpoint,1);assert.equal(retry.achievements.owned.has('achivementsCombo2'),false);
});
test('earned honors persist once with victory and do not change combat rewards',()=>{
 const s=new Combat(balance,{...newCampaign(),wave:20},1);s.status='victory';
 const checkpoint=s.victoryCheckpoint();assert.equal(checkpoint.money,0);assert.equal(checkpoint.score,0);
 assert.ok(checkpoint.achievements.includes('achivementsGold'));assert.ok(checkpoint.achievements.includes('achivementsDefender'));
 assert.deepEqual(s.victoryCheckpoint(),checkpoint);
 let raw;const storage={getItem:()=>raw,setItem:(k,v)=>raw=v};new SaveStore(storage).saveCheckpoint(checkpoint);
 assert.deepEqual(new SaveStore(storage).campaign,checkpoint);
 assert.equal(new Set(ACHIEVEMENTS.map(a=>a.id)).size,6);
});
