import {STEP_MS} from './combat.js';
import {equipmentArt} from './equipment-art.js';
export const weaponName=name=>({MashineGun:'Machine gun',CannonSmall:'Light cannon',CannonNormal:'Cannon',CannonBig:'Heavy cannon',Maxim:'Machine gun'}[name]||name);
export function supportControls(art,combat,active){
 return `<div class="support-direct">${['Mine','Avia','Atom'].map(name=>{
  const cost=combat.supportPrice(name),label={Mine:'Mine',Avia:'Air strike',Atom:'Atomic strike'}[name];
  return `<button class="support-price" data-action="arm" data-name="${name}" aria-label="${label}, ${cost} supplies" title="${label}" aria-pressed="${combat.armed===name}" ${!active||combat.money<cost?'disabled':''}>${equipmentArt(art,name)}<b data-live-price="${name}">${cost}</b></button>`;
 }).join('')}</div>`;
}
export function emplacementControls(combat,interactive){
 if(!interactive)return '';
 return `<button class="chopper-target" data-action="weapon-tray" aria-label="Chopper weapons tray" title="Weapons"></button><div class="emplacements">${combat.defenses.map((d,slot)=>`<button class="emplacement-target" data-action="emplacement" data-slot="${slot}" style="--slot:${slot}" aria-label="Position ${slot+1}${d?.health>0?', '+weaponName(d.name):', empty'}" title="Position ${slot+1}"></button>`).join('')}</div>`;
}
const seconds=ms=>Number((ms/1000).toFixed(2));
export const weaponReloadSeconds=item=>seconds(Math.ceil(Math.floor(item.timeReload/item.magazine)/STEP_MS)*STEP_MS*item.magazine);
const supplyCost=(art,value)=>`<span class="upgrade-cost" aria-label="${value} supplies">${equipmentArt(art,'Supplies')}<span>${value}</span></span>`;
export function liveUpgradePanel(art,s,kind,slot){
 if(!kind)return '';
 if(kind==='weapons')return `<section class="live-upgrade weapon-tray" role="region" aria-label="Chopper weapons"><header><strong>Weapons</strong><button data-action="close-upgrade" aria-label="Close weapons">×</button></header><div class="weapon-options">${s.balance.weapons.map(item=>{
  const owned=s.weapons.includes(item.name),active=s.activeWeapon===item.name;
  return `<button data-action="live-weapon" data-name="${item.name}" aria-pressed="${active}" ${active||!owned&&s.money<item.cost?'disabled':''}>${equipmentArt(art,item.name)}<strong>${weaponName(item.name)}</strong><div class="upgrade-stats"><span>${item.damage} DMG · ${item.magazine} rounds</span></div><small>${active?'Equipped':owned?'Equip':supplyCost(art,item.cost)}</small></button>`;
 }).join('')}</div></section>`;
 const d=s.defenses[slot],alive=d?.health>0,cost=alive?Math.round(d.maxHealth/10):0;
 return `<section class="live-upgrade emplacement-panel" role="region" aria-label="Position ${slot+1} upgrades" style="--panel-y:${Math.min(alive?90:140,Math.max(64,90+slot*15))}"><header><strong>Position ${slot+1}</strong><button data-action="close-upgrade" aria-label="Close position">×</button></header>${alive?`<div class="position-health"><strong>${weaponName(d.name)}</strong><span>${Math.ceil(d.health)}/${d.maxHealth}</span></div><button class="position-repair" data-action="live-repair" ${d.health>=d.maxHealth||s.money<=5||s.money<cost?'disabled':''}>Repair <b>${supplyCost(art,cost)}</b></button>`:''}<div class="defense-options">${s.balance.inventory.map(item=>{
  const current=alive&&item.name===d.name,price=s.replacementPrice(slot,item.name);
  return `<button data-action="live-defense" data-name="${item.name}" ${current||s.money<price?'disabled':''}><span class="defense-thumb" data-type="${item.name}" aria-hidden="true"></span><div class="defense-copy"><strong>${weaponName(item.name)}</strong><small>${item.damage} DMG · ${item.health} HP</small><small>Range ${item.range}</small></div><b>${current?'Equipped':supplyCost(art,price<0?'+'+Math.abs(price):price)}</b></button>`;
 }).join('')}</div></section>`;
}
