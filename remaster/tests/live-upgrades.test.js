import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Combat,designToSim} from '../src/combat.js';
import {newCampaign} from '../src/save.js';
import {supportControls,liveUpgradePanel,emplacementControls} from '../src/live-upgrades.js';
const balance=JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json',import.meta.url)));
const art=JSON.parse(fs.readFileSync(new URL('../assets/art/manifest.json',import.meta.url)));
const game=(patch={})=>new Combat(balance,{...newCampaign(),money:300,...patch},42,art);
const point={x:400,y:250};
test('support selection and cancellation cost nothing; valid placement charges once',()=>{
 for(const name of ['Mine','Avia','Atom']){
  const s=game();s.start();const cost=s.supportPrice(name);assert.ok(s.arm(name));assert.equal(s.money,300);
  assert.ok(s.arm(name));assert.equal(s.armed,null);assert.equal(s.money,300);
  s.arm(name);assert.ok(s.deploy(point));assert.equal(s.money,300-cost);assert.equal(s.supplies[name],0);
  assert.equal(s.deploy(point),false);assert.equal(s.money,300-cost);
 }
});
test('placement rechecks funds, bounds and state without charging for rejected input',()=>{
 const s=game({money:20});s.start();s.arm('Avia');s.money=19;assert.equal(s.deploy(point),false);assert.equal(s.money,19);
 s.money=20;for(const p of [{x:NaN,y:250},{x:20,y:250},designToSim({x:960.1,y:300}),designToSim({x:500,y:169})])assert.equal(s.deploy(p),false);
 assert.equal(s.money,20);s.pause();assert.equal(s.deploy(point),false);s.resume();assert.ok(s.deploy(point));assert.equal(s.money,0);
 assert.equal(s.arm('Mine'),false);assert.equal(s.arm('invalid'),false);
});
test('prepaid support from old saves is consumed without charging twice',()=>{
 const s=game({money:0,supplies:{Mine:1,Avia:0,Atom:0}});s.start();assert.equal(s.supportPrice('Mine'),0);assert.ok(s.arm('Mine'));assert.ok(s.deploy(point));assert.equal(s.money,0);assert.equal(s.supportPrice('Mine'),10);assert.equal(s.arm('Mine'),false);
});
test('live building, repair and replacement are atomic and preserve running state',()=>{
 const s=game();s.start();assert.ok(s.placeDefense(0,'Maxim'));s.defenses[0].health=1;
 assert.ok(s.repairDefense(0));const before=s.money,price=s.replacementPrice(0,'CannonNormal');assert.equal(price,29);
 assert.ok(s.replaceDefense(0,'CannonNormal'));assert.equal(s.money,before-price);assert.equal(s.defenses[0].name,'CannonNormal');assert.equal(s.status,'running');
 const d=structuredClone(s.defenses[0]);s.money=0;assert.equal(s.replaceDefense(0,'CannonBig'),false);assert.deepEqual(s.defenses[0],d);assert.equal(s.money,0);
 for(const slot of [-1,.5,5])assert.equal(s.replaceDefense(slot,'Maxim'),false);
});
test('live weapon changes preserve partial magazines and reload state without pausing',()=>{
 const s=game();s.start();s.fire(point);const ammo=s.ammo;assert.ok(s.buyWeapon('MashineGun'));assert.ok(s.equip('Cannon'));assert.equal(s.ammo,ammo);assert.equal(s.status,'running');
 s.equip('MashineGun');s.ammo=1;s.fire(point);assert.equal(s.reloading,true);s.equip('Cannon');s.equip('MashineGun');assert.equal(s.ammo,0);assert.equal(s.reloading,true);
});
test('compact controls show direct prices and never advertise inventory stock or a pause requirement',()=>{
 const s=game();s.start();const html=supportControls(art,s,true);
 assert.match(html,/data-live-price="Mine">10/);assert.match(html,/data-live-price="Avia">20/);assert.match(html,/data-live-price="Atom">50/);
 assert.doesNotMatch(html,/stock|available|shop|Pause/);assert.equal((emplacementControls(s,true).match(/data-action="emplacement"/g)||[]).length,5);
 assert.match(liveUpgradePanel(art,s,'weapons',0),/Chopper weapons/);assert.match(liveUpgradePanel(art,s,'defense',0),/Position 1/);
});
test('in-flight enemy attacks still hit an emplacement after its defense is replaced',()=>{
 const s=game();s.start();s.placeDefense(0,'Maxim');const old=s.defenses[0];
 s.projectiles.push({baseTarget:old});s.replaceDefense(0,'Mortar');
 assert.equal(s.projectiles[0].baseTarget,s.defenses[0]);assert.notEqual(s.projectiles[0].baseTarget,old);
});
test('support clicks never also fire the chopper or charge twice in one tick',()=>{
 const s=game({weapons:['Cannon','MashineGun'],activeWeapon:'MashineGun'});s.start();s.arm('Mine');
 s.tick({shots:[point,point],held:true,aim:point});assert.equal(s.mines.length,1);assert.equal(s.money,290);assert.equal(s.ammo,10);assert.equal(s.shots,0);
});
