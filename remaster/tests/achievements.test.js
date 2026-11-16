import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AchievementTracker, ACHIEVEMENTS } from '../src/achievements.js';
import { Combat } from '../src/combat.js';
import { newCampaign, SaveStore } from '../src/save.js';
const balance=JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json',import.meta.url)));

test('rapid honors require four in two seconds and eight in three seconds, once each',()=>{
 const t=new AchievementTracker();assert.deepEqual(t.kill(0),['honorFirstBlood']);
 t.kill(200);t.kill(400);assert.deepEqual(t.kill(600),['achivementsCombo2']);
 for(const time of [800,1000,1200])t.kill(time);
 assert.deepEqual(t.kill(1400),['achivementsCombo5']);t.kill(1600);
 assert.deepEqual(t.kill(1800),['honorBlitz']);assert.deepEqual(t.kill(1900),[]);
});
test('rapid honor windows exclude their exact two and three second boundaries',()=>{
 const a=new AchievementTracker();[0,500,1000,2000].forEach(t=>a.kill(t));assert.equal(a.owned.has('achivementsCombo2'),false);
 const b=new AchievementTracker();[0,400,800,1200,1600,2000,2400,3000].forEach(t=>b.kill(t));assert.equal(b.owned.has('achivementsCombo5'),false);
 b.kill(3100);assert.ok(b.owned.has('achivementsCombo5'));
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
 s.enemies=Array.from({length:4},(_,i)=>({...s.enemies[0],id:i+100,health:10,healthMax:10}));const enemies=[...s.enemies];s.damageEnemy(enemies[0],10);s.pause();const time=s.elapsedMs;for(let i=0;i<100;i++)s.tick();assert.equal(s.elapsedMs,time);
 for(const enemy of enemies.slice(1))s.damageEnemy(enemy,10);assert.ok(s.achievements.owned.has('achivementsCombo2'));
 const retry=new Combat(balance,s.checkpoint,1);assert.equal(retry.achievements.owned.has('achivementsCombo2'),false);
});
test('earned honors persist once with victory and do not change combat rewards',()=>{
 const s=new Combat(balance,{...newCampaign(),wave:20},1);s.status='victory';
 const checkpoint=s.victoryCheckpoint();assert.equal(checkpoint.money,0);assert.equal(checkpoint.score,0);
 assert.ok(checkpoint.achievements.includes('achivementsGold'));assert.ok(checkpoint.achievements.includes('achivementsDefender'));
 assert.deepEqual(s.victoryCheckpoint(),checkpoint);
 let raw;const storage={getItem:()=>raw,setItem:(k,v)=>raw=v};new SaveStore(storage).saveCheckpoint(checkpoint);
 assert.deepEqual(new SaveStore(storage).campaign,checkpoint);
 assert.equal(new Set(ACHIEVEMENTS.map(a=>a.id)).size,12);
});

test('new wave honors count vehicles separately and reset on retry while preserving earned medals',()=>{
 const t=new AchievementTracker(['achivementsBronze']);
 for(let i=0;i<24;i++)t.kill(i*4000,{name:i<4?'Tank':'SoldatAK'});
 assert.equal(t.owned.has('honorArmorHunter'),false);assert.equal(t.owned.has('honorFrontline'),false);
 const ids=t.kill(100000,{name:'BTRLite'});assert.ok(ids.includes('honorArmorHunter')&&ids.includes('honorFrontline'));
 const fresh=new AchievementTracker(['achivementsBronze']);assert.equal(fresh.waveKills,0);assert.ok(fresh.owned.has('achivementsBronze'));
});
test('survival medals respect real damage and health bounds',()=>{
 const clean=new AchievementTracker();assert.ok(clean.victory(10,800).includes('honorFortress'));
 const damaged=new AchievementTracker();damaged.baseDamage=600;assert.ok(damaged.victory(3,200).includes('honorLastStand'));
 assert.equal(new AchievementTracker().victory(3,201).includes('honorLastStand'),false);
 assert.equal(new AchievementTracker().victory(3,0).includes('honorLastStand'),false);
});
test('all twelve honors can be saved and restored with the existing campaign format',()=>{
 let raw;const storage={getItem:()=>raw,setItem:(k,v)=>raw=v};const store=new SaveStore(storage);
 const c={...newCampaign(),achievements:ACHIEVEMENTS.map(a=>a.id)};store.saveCheckpoint(c);
 assert.deepEqual(new SaveStore(storage).campaign,c);
});
