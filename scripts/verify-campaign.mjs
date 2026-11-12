// Deterministic integration run using normal purchases, targeting and simulation ticks.
// No rewards, ammo or damage are injected into the model.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { Combat } from '../remaster/src/combat.js';
import { newCampaign, validCampaign } from '../remaster/src/save.js';
const balance=JSON.parse(fs.readFileSync(new URL('../docs/reference/balance.json',import.meta.url)));
const art=JSON.parse(fs.readFileSync(new URL('../remaster/assets/art/manifest.json',import.meta.url)));
let checkpoint=newCampaign();
const summary=[];
for(let wave=1;wave<=20;wave++){
 const s=new Combat(balance,checkpoint,500+wave,art);
 for(const name of ['MashineGun','Bazooka','Rocket'])s.buyWeapon(name);
 while(s.health<800&&s.money>4)s.repairBase();
 for(let slot=0;slot<5;slot++){
  while(s.defenses[slot]?.health<s.defenses[slot]?.maxHealth&&s.money>5){if(!s.repairDefense(slot))break;}
  if(!s.defenses[slot]&&s.weapons.includes('Rocket'))s.placeDefense(slot,'CannonBig');
 }
 checkpoint=s.snapshot();s.checkpoint=structuredClone(checkpoint);s.start();
 for(let tick=0;tick<30000&&s.status==='running';tick++){
  const enemy=s.enemies.filter(e=>e.x<=640).sort((a,b)=>a.x-b.x)[0];
  const aim=enemy?{x:enemy.x,y:enemy.y-18}:{x:500,y:240};
  s.tick({aim,shots:enemy?[aim]:[]});
 }
 assert.equal(s.status,'victory',`wave ${wave}: health ${s.health}, kills ${s.kills}/${s.total}`);
 checkpoint=s.victoryCheckpoint();assert.ok(validCampaign(checkpoint));
 summary.push({wave,kills:s.kills,health:s.health,money:s.money,weapon:s.activeWeapon});
}
assert.equal(checkpoint.wave,21);
for(const id of ['achivementsDefender','achivementsBronze','achivementsSilver','achivementsGold'])assert.ok(checkpoint.achievements.includes(id),`Missing campaign honor: ${id}`);
console.table(summary);
console.log(`Campaign complete: ${checkpoint.score} points + ${checkpoint.money} supplies = ${checkpoint.score+checkpoint.money}`);
