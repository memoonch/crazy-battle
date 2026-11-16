import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Combat,STEP_MS} from '../src/combat.js';
import {newCampaign} from '../src/save.js';
import {Scenes} from '../src/scenes.js';
const balance=JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json',import.meta.url)));
test('reticle progress fills smoothly across every reload round for all four weapons',()=>{
  for(const weapon of balance.weapons){
    const s=new Combat(balance,{...newCampaign(),weapons:[weapon.name],activeWeapon:weapon.name},42);
    s.start();s.spawnTime=-100000;s.total=999;s.ammo=1;s.fire({x:400,y:250});
    assert.equal(s.reloading,true);assert.equal(s.reloadProgress,0);
    let previous=0,ticks=0;
    while(s.reloading){s.tick();assert.ok(s.reloadProgress>=previous);assert.ok(s.reloadProgress-previous<=STEP_MS/(s.roundReloadMs*s.weapon.magazine)+1e-9);previous=s.reloadProgress;assert.ok(++ticks<5000);}
    assert.equal(s.reloadProgress,1);assert.equal(s.ammo,s.weapon.magazine);
  }
});
test('manual reload fills only missing rounds, cannot restart, and survives weapon switching',()=>{
  for(const weapon of balance.weapons){
    const s=new Combat(balance,{...newCampaign(),weapons:balance.weapons.map(w=>w.name),activeWeapon:weapon.name},42);
    assert.equal(s.reload(),false);s.start();assert.equal(s.reload(),false);
    s.spawnTime=-100000;s.ammo=weapon.magazine-2;
    assert.equal(s.reload(),true);assert.equal(s.reloadProgress,0);s.tick();
    const progress=s.reloadProgress;assert.ok(progress>0);assert.equal(s.reload(),false);assert.equal(s.reloadProgress,progress);
    const other=balance.weapons.find(w=>w.name!==weapon.name).name;s.equip(other);s.equip(weapon.name);assert.equal(s.reloadProgress,progress);
    for(let i=1;i<s.roundReloadMs*2/STEP_MS;i++)s.tick();
    assert.equal(s.reloading,false);assert.equal(s.ammo,weapon.magazine);assert.equal(s.reloadProgress,1);
    s.ammo--;s.pause();assert.equal(s.reload(),false);
  }
});
test('R reload shortcut is limited to gameplay and ignores typing, repeats and browser modifiers',()=>{
  let reloads=0,sounds=0,clears=0;
  const scene={name:'combat',combat:{reload(){reloads++;return true;}},input:{clear(){clears++;}},audio:{combatEvent(){sounds++;}},updateHud(){}};
  const key={key:'r',target:{tagName:'BODY'}};
  assert.equal(Scenes.prototype.handleKey.call(scene,key),true);
  assert.deepEqual([reloads,sounds,clears],[1,1,1]);
  for(const patch of [{repeat:true},{ctrlKey:true},{metaKey:true},{altKey:true},{target:{tagName:'INPUT'}}])assert.equal(Scenes.prototype.handleKey.call(scene,{...key,...patch}),false);
  scene.name='pause';assert.equal(Scenes.prototype.handleKey.call(scene,key),false);assert.equal(reloads,1);
});
