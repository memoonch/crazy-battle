import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { Combat } from '../src/combat.js';
import { newCampaign } from '../src/save.js';

const balance=JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json',import.meta.url)));
function prepared(money=10){const s=new Combat(balance,{...newCampaign(),money},42);s.start();s.pause();return s;}
function ticks(s,n){for(let i=0;i<n;i++)s.tick();}

test('Maxim placement charges original price once and rejects active/occupied/invalid placement',()=>{
 const s=prepared(10);assert.equal(s.placeMaxim(0),true);assert.equal(s.money,5);assert.equal(s.defenses[0].health,35);
 assert.equal(s.placeMaxim(0),false);assert.equal(s.placeMaxim(-1),false);assert.equal(s.placeMaxim(5),false);assert.equal(s.placeMaxim(.5),false);
 s.resume();assert.equal(s.placeMaxim(1),false);assert.equal(s.money,5);
});
test('unaffordable defense placement cannot create negative money',()=>{
 const s=prepared(4);assert.equal(s.placeMaxim(0),false);assert.equal(s.money,4);assert.equal(s.defenses[0],null);
});
test('Maxim acquires targets in range and grants normal kill rewards without player ammo use',()=>{
 const s=prepared();s.resume();ticks(s,90);const e=s.enemies[0];s.pause();
 const slot=Math.max(0,Math.min(4,Math.round((e.y-122)/55)));assert.equal(s.placeMaxim(slot),true);s.resume();
 for(let i=0;i<300&&s.kills===0;i++)s.tick();assert.ok(s.kills>=1);assert.equal(s.money,6);assert.equal(s.earnedMoney,1);assert.equal(s.ammo,6);assert.equal(s.shots,0);
});
test('an emplacement absorbs lane damage before the base; destroyed positions expose the base',()=>{
 const s=prepared();assert.equal(s.placeMaxim(0),true);s.defenses[0].health=5;s.resume();ticks(s,60);
 const e=s.enemies[0];e.y=150;e.x=220;e.state='attack';e.counter=e.rate;s.tick();
 assert.equal(s.defenses[0].health,0);assert.equal(s.health,800);ticks(s,101);assert.equal(s.health,795);
});
test('Maxim repair uses original heal/cost and reserve guard',()=>{
 const s=prepared(15);s.placeMaxim(0);s.defenses[0].health=10;
 assert.equal(s.repairMaxim(0),true);assert.equal(s.defenses[0].health,21);assert.equal(s.money,6);
 assert.equal(s.repairMaxim(0),true);assert.equal(s.defenses[0].health,32);assert.equal(s.money,2);
 assert.equal(s.repairMaxim(0),false);assert.equal(s.money,2);
});
test('selling refunds the original value once; stopped defenses cannot farm refunds',()=>{
 const s=prepared();s.placeMaxim(0);assert.equal(s.sellMaxim(0),true);assert.equal(s.money,6);assert.equal(s.defenses[0],null);assert.equal(s.sellMaxim(0),false);assert.equal(s.money,6);
});
test('paused defense timers and flashes remain frozen',()=>{
 const s=prepared();s.placeMaxim(0);const before=JSON.stringify(s.defenses);ticks(s,400);assert.equal(JSON.stringify(s.defenses),before);
});

const manifest=JSON.parse(fs.readFileSync(new URL('../assets/art/manifest.json',import.meta.url)));
test('all production textures match the manifest and cutouts have real alpha',()=>{
 assert.equal(Object.keys(manifest).length,15);
 for(const [name,m]of Object.entries(manifest)){const b=fs.readFileSync(new URL('../assets/art/'+m.file,import.meta.url));assert.equal(crypto.createHash('sha256').update(b).digest('hex'),m.sha256);assert.equal(b.readUInt32BE(16),m.imageWidth);assert.equal(b.readUInt32BE(20),m.imageHeight);if(name!=='forest-battlefield'){assert.equal(b[25],6);assert.ok(m.transparentFraction>.4);}}
});
test('atlas frames stay within their declared cells and have usable painted bounds',()=>{
 for(const name of ['rifle-soldier-atlas','outpost-equipment','vehicles-painted','defenses-painted','bazooka-soldier-atlas-v3','weapons-equipment','support-equipment','outpost-fortifications','ammo-equipment']){const m=manifest[name],w=m.imageWidth/m.columns,h=m.imageHeight/m.rows;assert.equal(m.frames.length,m.columns*m.rows);for(const [i,b]of m.frames.entries()){assert.ok(b.width>0&&b.height>0);assert.ok(b.x>=Math.floor(i%m.columns*w));assert.ok(b.y>=Math.floor(Math.floor(i/m.columns)*h));assert.ok(b.x+b.width<=Math.floor((i%m.columns+1)*w));assert.ok(b.y+b.height<=Math.floor((Math.floor(i/m.columns)+1)*h));}}
});

test('bazooka animation leaves clear gutters around every complete launcher and death pose',()=>{
 const m=manifest['bazooka-soldier-atlas-v3'],w=m.imageWidth/4,h=m.imageHeight/2;
 assert.equal(m.frames.length,8);
 for(const [i,b]of m.frames.entries()){
  assert.ok(b.x-i%4*w>=25);assert.ok((i%4+1)*w-b.x-b.width>=25);
  assert.ok(b.y-Math.floor(i/4)*h>=25);assert.ok((Math.floor(i/4)+1)*h-b.y-b.height>=25);
 }
});
