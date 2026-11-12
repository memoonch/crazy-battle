export function shopHint(canShop,status='running') {return canShop?'Open this shop.':status==='running'?'Pause to open the shop.':'Shops are available before a wave or while paused.';}
export function repairHint({health,money,canShop}) {
  if(health<=0)return 'The base has been lost. Retry the wave to restore your checkpoint.';
  if(health>=800)return 'Base health is full. No repair is needed.';
  if(!canShop)return 'Pause to repair the base.';
  if(money<5)return 'Repair unavailable: need at least 5 supplies available. Each repair costs 3 supplies and restores 80 HP.';
  return 'Repair base: restore up to 80 HP for 3 supplies. Requires at least 5 supplies available.';
}
export function supportHint(item,stock,active,armed=false) {
  const names={Mine:'Mine',Avia:'Air strike',Atom:'Atomic strike'};
  const effects={Mine:'Deals 100 damage to the first enemy that crosses it.',Avia:'Bombs the selected strip for 100 damage per hit.',Atom:'Deals 100 damage to every currently spawned enemy.'};
  const instruction=stock===0?'Buy stock in the Support shop while preparing or paused.':!active?'Deploy during active combat.':armed?'Click the battlefield to deploy, or select this item again to cancel.':'Select this item, then click the battlefield to deploy.';
  return `${names[item.name]} — ${effects[item.name]} Price: ${item.cost} supplies. Available stock: ${stock}. ${instruction}`;
}
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function hintedControl(button,text,id,disabled) {
  return `<span class="control-hint" ${disabled?'tabindex="0"':''} data-hint-for="${id}">${button.replace('<button ',`<button aria-describedby="${id}" `)}<span class="control-tooltip" role="tooltip" id="${id}">${escape(text)}</span></span>`;
}
