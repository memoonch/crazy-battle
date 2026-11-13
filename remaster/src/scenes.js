import { shopHint, repairHint, supportHint, hintedControl } from './control-hints.js';
import { equipmentArt, ammoArt } from './equipment-art.js';
import { ACHIEVEMENTS } from './achievements.js';
import { DEFAULT_SETTINGS } from './save.js';
import { Combat, FixedStepClock, designToSim } from './combat.js';

const icons = {
  shield: '<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  muted: '<path d="m4 9 5 0 5-4v14l-5-4H4zM18 9l5 6m0-6-5 6"/>',
  sound: '<path d="m4 9 5 0 5-4v14l-5-4H4zM18 8c3 2 3 6 0 8"/>',
  supply: '<path d="m3 8 9-5 9 5v9l-9 4-9-4zM3 8l9 5 9-5M12 13v8"/>',
  weapon: '<path d="M3 8h16v4H8l-2 6H3l2-7M19 9h3M10 12v5h4v-5"/>',
  mine: '<ellipse cx="12" cy="14" rx="9" ry="5"/><path d="M8 10V8h8v2M12 6V3"/>',
  plane: '<path d="m12 3 2 7 7 4v2l-7-2v5l3 2-5-1-5 1 3-2v-5l-7 2v-2l7-4z"/>',
  atom: '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  cross: '<path d="M12 4v16M4 12h16"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>'
};
export const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.shield}</svg>`;

export class Scenes {
  constructor(ui, store, audio, input, assets, notify) {
    Object.assign(this, { ui, store, audio, input, assets, notify });
    this.name = 'menu'; this.campaign = store.campaign; this.settingsDraft = null; this.returnScene = 'menu';
    this.combat = null; this.clock = new FixedStepClock();
    this.selectedSlot = 0; this.shopTab = 'defenses';
    ui.addEventListener('click', event => this.action(event));
    ui.addEventListener('input', event => this.changeSetting(event));
    ui.addEventListener('change', event => this.changeSetting(event));
    ui.addEventListener('keydown', event => this.key(event));
    this.render(false);
  }
  go(name) {
    if (name !== 'combat') this.combat?.pause();
    if (name === 'combat') this.combat?.resume();
    this.clock.reset();
    this.input.clear(); this.name = name; this.render();
  }
  async action(event) {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if(action==='toggle-mute'){
      const settings={...this.store.settings,muted:!this.store.settings.muted};
      this.store.saveSettings(settings);this.audio.apply(settings);await this.audio.unlock().catch(()=>{});
      this.updateMuteControl();this.notify(settings.muted?'All sounds muted':'All sounds unmuted');return;
    }
    await this.audio.unlock().catch(() => {}); this.audio.click();
    if (action === 'new') {
      if (this.store.campaign) this.go('confirm');
      else this.startNew();
    } else if (action === 'confirm-new') this.startNew();
    else if (action === 'continue') { this.combat = null; this.campaign = this.store.campaign; if (this.campaign) this.prepare(); }
    else if (action === 'menu') { this.combat?.pause(); this.combat = null; this.go('menu'); }
    else if (action === 'help' || action === 'medals') {this.panelReturn=this.name==='combat'?'pause':this.name;this.go(action);}
    else if (action === 'back-panel') this.go(this.panelReturn || 'menu');
    else if (action === 'start') this.startCombat();
    else if (action === 'pause') this.go('pause');
    else if (action === 'defenses' && this.combat?.canShop) { this.shopTab='defenses'; this.go('defenses'); }
    else if (action === 'shop' && this.combat?.canShop) { this.shopTab=button.dataset.tab;this.go('defenses'); }
    else if (action === 'shop-buy') {
      const c=this.combat,kind=button.dataset.kind,name=button.dataset.name;
      const changed=kind==='weapon'?c.buyWeapon(name):kind==='equip'?c.equip(name):kind==='support'?c.buySupport(name):c.placeDefense(this.selectedSlot,name);
      if(changed)this.persistPreparation();this.render();
    }
    else if (action === 'repair-base') {if(this.combat.repairBase())this.persistPreparation();this.render();}
    else if (action === 'arm') {this.combat.arm(button.dataset.name);this.combatScreen();}
    else if (action === 'back-pause') this.go(this.combat.status==='ready'?'preparation':'pause');
    else if (action === 'select-slot') { this.selectedSlot = Number(button.dataset.slot); this.render(); }
    
    else if (action === 'repair-maxim') { if(this.combat.repairDefense(this.selectedSlot))this.persistPreparation(); this.render(); }
    else if (action === 'sell-maxim') { if(this.combat.sellDefense(this.selectedSlot))this.persistPreparation(); this.render(); }
    else if (action === 'resume') this.go('combat');
    else if (action === 'retry') { this.campaign = structuredClone(this.combat.checkpoint); this.startCombat(); }
    else if (action === 'replay') { this.startNew(); this.startCombat(); }
    else if (action === 'outpost') { this.combat = null; this.campaign = this.store.campaign; this.prepare(); }
    else if (action === 'settings') { this.returnScene = this.name === 'combat' ? 'pause' : this.name; this.settingsDraft = this.store.settings; this.go('settings'); }
    else if (action === 'apply-settings') { this.store.saveSettings(this.settingsDraft); this.audio.apply(this.store.settings); this.settingsDraft = null; if(this.store.status!=='Saved on this browser')this.notify(this.store.status); this.go(this.returnScene); }
    else if (action === 'cancel-settings') { this.audio.apply(this.store.settings); this.settingsDraft = null; this.go(this.returnScene); }
    else if (action === 'reset-settings') { this.settingsDraft = { ...DEFAULT_SETTINGS }; this.audio.apply(this.settingsDraft); this.render(); }
    else if (action === 'test-audio') {
      if (this.settingsDraft?.muted) this.notify('All sounds muted · return to the battlefield and use the speaker to unmute');
      else if (!this.settingsDraft?.master || !this.settingsDraft?.effects) this.notify('Raise Master volume and Effects above 0% to hear the preview');
      else this.audio.combatEvent('shot',{weapon:this.campaign?.activeWeapon||'Cannon'});
    }
    else if (action === 'save') { this.store.saveCheckpoint(this.campaign); if(this.store.status!=='Saved on this browser')this.notify(this.store.status); this.updateDiagnostics(); }
  }
  startNew() { this.combat = null; this.campaign = this.store.startNew(); if(this.store.status!=='Saved on this browser')this.notify(this.store.status); this.prepare(); }
  prepare() {
    this.combat=this.campaign.wave<=20?new Combat(this.assets.balance,this.campaign,undefined,this.assets.art):null;
    this.go('preparation');
  }
  persistPreparation() {
    if(this.combat.status!=='ready')return;
    this.campaign=this.combat.snapshot();this.combat.checkpoint=structuredClone(this.campaign);
    this.store.saveCheckpoint(this.campaign);if(this.store.status!=='Saved on this browser')this.notify(this.store.status);
  }
  startCombat() {
    if(this.combat?.status!=='ready')this.combat = new Combat(this.assets.balance, this.campaign,undefined,this.assets.art);
    this.combat.start(); this.go('combat');
  }
  pause(reason) {
    if (this.name !== 'combat') return;
    this.go('pause');
    if (reason) this.notify(reason);
  }
  advance(seconds) {
    if (this.name !== 'combat') { this.clock.reset(); return; }
    this.clock.advance(seconds, () => {
      this.combat.tick({ aim: designToSim(this.input.state), shots: this.input.drainShots().map(designToSim), held: this.input.state.pressed });
      for (const event of this.combat.drainEvents()) {this.audio.combatEvent(event.type,event);if(event.type==='reload-start')this.input.release();if(event.type==='achievement')this.notify('Award earned · '+ACHIEVEMENTS.find(a=>a.id===event.id).name);}
      if (this.combat.status === 'victory') {
        this.campaign = this.combat.victoryCheckpoint();
        this.store.saveCheckpoint(this.campaign);if(this.store.status!=='Saved on this browser')this.notify(this.store.status); this.go('victory'); return false;
      }
      if (this.combat.status === 'defeat') { this.go('defeat'); return false; }
    });
    this.updateHud();
  }
  handleKey(event) {
    if (event.repeat || (event.key !== 'Escape' && /INPUT|SELECT|TEXTAREA/.test(event.target.tagName))) return false;
    if (event.key.toLowerCase() === 'p' || event.key === 'Escape') {
      if (this.name === 'combat') { this.pause(); return true; }
      if (this.name === 'pause') { this.go('combat'); return true; }
      if (this.name === 'defenses' && event.key === 'Escape') { this.go(this.combat.status==='ready'?'preparation':'pause'); return true; }
      if (event.key === 'Escape') {
        if(['help','medals'].includes(this.name)){this.go(this.panelReturn||'menu');return true;}
        const back = this.ui.querySelector('[data-action="cancel-settings"], [data-action="menu"]');
        if (back) { back.click(); return true; }
      }
    }
    return false;
  }
  changeSetting(event) {
    const field = event.target;
    if (!this.settingsDraft || !field.name) return;
    this.settingsDraft[field.name] = field.type === 'checkbox' ? field.checked : field.type === 'range' ? Number(field.value) : field.value;
    if (field.type === 'range') this.ui.querySelector(`[data-value="${field.name}"]`).textContent = field.value + '%';
    this.audio.apply(this.settingsDraft);
  }
  key(event) {
    // Modal scene keyboard focus stays within the scene, not behind its overlay.
    if (event.key === 'Tab' && ['settings', 'confirm', 'pause', 'defenses', 'help', 'medals', 'victory', 'defeat'].includes(this.name)) {
      const scope = this.ui.querySelector('[role="dialog"]') || this.ui;
      const nodes = [...scope.querySelectorAll('button:not(:disabled), input, select, .control-hint[tabindex="0"]')];
      const first = nodes[0], last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }
  updateDiagnostics() {
    document.querySelector('#save-info').textContent = this.store.status;
    document.querySelector('#scene-info').textContent = this.name;
    if (!this.combat) document.querySelector('#combat-info').textContent = 'Not started';
  }
  render(focus = true) {
    this.ui.dataset.scene = this.name;
    if (this.name === 'menu') this.menu();
    if(this.name==='help')this.help();
    if(this.name==='medals')this.medals();
    if (this.name === 'preparation') this.preparation();
    if (this.name === 'settings') this.settings();
    if (this.name === 'confirm') this.confirm();
    if (this.name === 'combat') this.combatScreen();
    if (this.name === 'pause') this.pauseScreen();
    if (this.name === 'defenses') this.defensesScreen();
    if (this.name === 'victory' || this.name === 'defeat') this.result();
    this.updateDiagnostics();
    const scope = this.ui.querySelector('[role="dialog"]') || this.ui;
    if (focus && this.name !== 'combat') (scope.querySelector('[data-initial-focus]') || scope.querySelector('button:not(:disabled)'))?.focus({ preventScroll: true });
  }
  menu() {
    const c = this.store.campaign;
    this.ui.innerHTML = `<section class="menu-card" aria-labelledby="menu-title"><h1 id="menu-title">CRAZY<br><span>BATTLE</span></h1><p class="menu-description">Hold the line.<br>Build your defenses. Protect the outpost.</p><div class="menu-actions"><button class="primary" data-action="continue" ${c ? 'data-initial-focus' : 'disabled'}>Continue ${icon('arrow')}</button><button data-action="new" ${c ? '' : 'data-initial-focus'}>New campaign</button><div class="menu-utility"><button class="quiet" data-action="help">How to play</button><button class="quiet" data-action="medals">Medals</button><button class="quiet" data-action="settings">Settings</button></div></div></section><div class="menu-insignia" aria-hidden="true"><div class="menu-commander"></div><span>OUTPOST COMMAND</span></div><div class="outpost-caption"><strong>FOREST OUTPOST</strong></div>`;
  }
  preparation() {
    const c = this.campaign, wave = Math.min(c.wave, 20), count = Object.values(this.assets.balance.levels[wave - 1]).reduce((a, n) => a + n, 0);
    const cleared=c.wave>20;
    this.ui.innerHTML=this.hud(c)+`<section class="briefing" aria-labelledby="briefing-title"><p class="eyebrow">${cleared?'CAMPAIGN COMPLETE':'OUTPOST BRIEFING'}</p><h2 id="briefing-title">${cleared?'All 20 waves secured.':'Prepare the line.'}</h2><p>${cleared?`Final total: ${(c.score+c.money).toLocaleString()}`:`Wave ${wave}`}</p><div class="briefing-rule"></div><p class="briefing-copy">${cleared?'The outpost stands. Your final checkpoint is saved.':`${count} incoming enemies`}</p><button class="primary" data-action="${cleared?'new':'start'}" data-initial-focus>${cleared?'New campaign':'Start wave'} ${icon('arrow')}</button><div class="briefing-tools"><button class="quiet" data-action="save">Save checkpoint</button><button class="quiet" data-action="${cleared?'medals':'help'}">${cleared?'View honors':'Field manual'}</button></div></section>`;
  }

  hud(c) {
    c=this.combat?this.combat.snapshot():c;
    const wave=this.combat?.wave||Math.min(c.wave,20);
    const name = { Cannon: 'Cannon', MashineGun: 'Machine gun', Bazooka: 'Bazooka', Rocket: 'Rocket' }[c.activeWeapon];
    const magazine = this.assets.balance.weapons.find(w => w.name === c.activeWeapon).magazine;
    const inEncounter = this.combat?.status!=='ready' && ['combat', 'pause', 'defenses'].includes(this.name), pauseAction = this.name === 'combat' ? 'pause' : inEncounter ? 'resume' : 'menu';
    const canPrepare=this.combat?.canShop;
    return `<div class="top-hud"><div class="hud-brand">${icon('shield')}<strong>CRAZY BATTLE</strong></div><div class="hud-stats"><span><small>WAVE</small><b>${String(wave).padStart(2, '0')} <em>/ 20</em></b></span><span><small>SCORE</small><b data-live="score">${c.score.toLocaleString()}</b></span><span class="money">${icon('supply')}<b data-live="money">${c.money}</b></span></div>${this.muteControl()}<button class="icon-button" data-action="${pauseAction}" aria-label="${inEncounter ? this.name === 'pause' ? 'Resume' : 'Pause' : 'Main menu'}">${icon('pause')}</button></div>
    <div class="bottom-hud"><div class="base-health"><div class="commander-portrait" aria-hidden="true"></div><div><div class="health-caption"><strong>BASE</strong><b data-live="health">${Math.round(c.health / 8)}%</b></div><div class="health-bar" role="meter" aria-label="Base health" aria-valuemin="0" aria-valuemax="800" aria-valuenow="${c.health}"><span data-live="health-bar" style="width:${c.health / 8}%"></span></div></div>${hintedControl(`<button class="icon-button" data-action="repair-base" ${canPrepare&&c.health>0&&c.health<800&&c.money>4?'':'disabled'} aria-label="Repair base">${icon('cross')}</button>`,repairHint({health:c.health,money:c.money,canShop:canPrepare}),'repair-hint',!(canPrepare&&c.health>0&&c.health<800&&c.money>4))}</div><div class="weapon-hud">${equipmentArt(this.assets.art,c.activeWeapon)}<div><strong>${name.toUpperCase()}</strong><span>${ammoArt(this.assets.art,c.activeWeapon)}<b data-live="ammo">${magazine}</b> <em>/ ${magazine}</em></span><small data-live="reload" class="reload-label">READY</small></div></div><div class="supply-hud">${['Mine','Avia','Atom'].map(key=>hintedControl(`<button data-action="arm" data-name="${key}" ${this.name==='combat'&&c.supplies[key]>0?'':'disabled'} aria-pressed="${this.combat?.armed===key}" class="supply" aria-label="${key}, ${c.supplies[key]} available">${equipmentArt(this.assets.art,key)}<b>${c.supplies[key]}</b></button>`,supportHint(this.assets.balance.omps.find(i=>i.name===key),c.supplies[key],this.name==='combat',this.combat?.armed===key),'support-hint-'+key,!(this.name==='combat'&&c.supplies[key]>0))).join('')}</div><div class="shop-nav">${['Defenses','Support','Weapons'].map(label=>hintedControl(`<button ${label==='Defenses'?'data-action="defenses" aria-label="Open defenses"':`data-action="shop" data-tab="${label.toLowerCase()}"`} ${canPrepare?'':'disabled'}>${label}</button>`,shopHint(canPrepare,this.combat?.status),'shop-hint-'+label.toLowerCase(),!canPrepare)).join('')}</div></div>`;
  }
  updateHint(button,message) {
    const wrapper=button.closest('.control-hint'),tooltip=wrapper.querySelector('.control-tooltip');
    if(tooltip.textContent!==message)tooltip.textContent=message;
    if(button.disabled){if(!wrapper.hasAttribute('tabindex'))wrapper.setAttribute('tabindex','0');}
    else if(wrapper.hasAttribute('tabindex'))wrapper.removeAttribute('tabindex');
  }
  muteControl() {
    const muted=this.store.settings.muted,label=muted?'Unmute all sounds':'Mute all sounds';
    return `<button class="icon-button" data-action="toggle-mute" aria-label="${label}" title="${label}" aria-pressed="${muted}">${icon(muted?'muted':'sound')}</button>`;
  }
  updateMuteControl() {
    const button=this.ui.querySelector('[data-action="toggle-mute"]');if(!button)return;
    const muted=this.store.settings.muted,label=muted?'Unmute all sounds':'Mute all sounds';
    button.setAttribute('aria-label',label);button.setAttribute('title',label);button.setAttribute('aria-pressed',String(muted));button.innerHTML=icon(muted?'muted':'sound');
  }
  combatScreen() {
    this.ui.innerHTML = this.hud(this.combat.checkpoint) + `<div class="wave-status"><span data-live="progress">0 / ${this.combat.total} eliminated</span><div class="wave-bar"><span data-live="progress-bar"></span></div></div><p class="combat-tip">${this.combat.armed?'Click battlefield to deploy '+this.combat.armed:'Click to fire · Hold machine gun · P to pause'}</p>`;
    this.updateHud();
  }
  updateHud() {
    if (!this.combat || !['combat', 'pause', 'defenses', 'victory', 'defeat'].includes(this.name)) return;
    const s = this.combat, text = (key, value) => { const node = this.ui.querySelector(`[data-live="${key}"]`); if (node && node.textContent !== String(value)) node.textContent = value; };
    text('score', s.score.toLocaleString()); text('money', s.money); text('health', Math.round(s.health / 8) + '%'); text('ammo', s.reloading ? 0 : s.ammo);
    text('reload', s.reloading ? 'RELOADING' : 'READY'); text('progress', `${s.kills} / ${s.total} eliminated`);
    this.ui.querySelector('[data-live="health-bar"]').style.width = s.health / 8 + '%';
    this.ui.querySelector('[role="meter"]').setAttribute('aria-valuenow', s.health);
    this.ui.querySelector('.base-health').classList.toggle('critical', s.health <= 200);
    const progress = this.ui.querySelector('[data-live="progress-bar"]'); if (progress) progress.style.width = s.kills / s.total * 100 + '%';
    for (const button of this.ui.querySelectorAll('[data-action="arm"]')) {
      const name=button.dataset.name,count=s.supplies[name];
      button.querySelector('b').textContent=count;
      button.disabled=this.name!=='combat'||count===0;
      button.setAttribute('aria-pressed',String(s.armed===name));
      button.setAttribute('aria-label',`${name}, ${count} available`);
      this.updateHint(button,supportHint(this.assets.balance.omps.find(i=>i.name===name),count,this.name==='combat',s.armed===name));
    }
    const repair=this.ui.querySelector('[data-action="repair-base"]');
    repair.disabled=!s.canShop||s.health<=0||s.health>=800||s.money<5;
    this.updateHint(repair,repairHint({health:s.health,money:s.money,canShop:s.canShop}));
    const tip=this.ui.querySelector('.combat-tip');
    if(tip){tip.textContent=s.armed?'Click battlefield to deploy '+s.armed:'Click to fire · Hold machine gun · P to pause';tip.classList.toggle('faded',s.elapsedMs>6000&&!s.armed);}
    document.querySelector('#combat-info').textContent = `${s.kills}/${s.total} kills · ${s.enemies.length} active · ${s.queue.length} queued · ${(s.elapsedMs / 1000).toFixed(2)}s`;
  }
  pauseScreen() {
    this.combatScreen();
    this.ui.insertAdjacentHTML('beforeend', `<section class="modal encounter-modal" role="dialog" aria-modal="true" aria-labelledby="pause-title"><p class="eyebrow">HOLD POSITION</p><h2 id="pause-title">Battle paused.</h2><p>The outpost will wait for you.</p><div class="stack-actions"><button class="primary" data-action="resume" data-initial-focus>Resume ${icon('arrow')}</button><button data-action="defenses">Defenses</button><button class="quiet" data-action="retry">Restart wave</button><div class="pause-utility"><button class="quiet" data-action="help">How to play</button><button class="quiet" data-action="medals">Medals</button><button class="quiet" data-action="settings">Settings</button></div><button class="quiet" data-action="menu">Quit to menu</button></div></section>`);
  }
  defensesScreen() {
    const s=this.combat,d=s.defenses[this.selectedSlot],live=d?.health>0;
    const labels={MashineGun:'Machine gun',CannonSmall:'Light cannon',CannonNormal:'Field cannon',CannonBig:'Heavy cannon',Avia:'Air strike',Atom:'Atomic strike'};
    const label=n=>labels[n]||n;
    const card=(item,kind)=>{
      const owned=kind==='weapon'&&s.weapons.includes(item.name),active=owned&&s.activeWeapon===item.name;
      return `<article class="shop-item">${kind==='defense'?`<span class="defense-thumb" data-type="${item.name}" aria-hidden="true"></span>`:equipmentArt(this.assets.art,item.name)}<div><strong>${label(item.name)}</strong><small>${kind==='weapon'?`${item.damage} damage · ${item.magazine} rounds`:kind==='support'?`${item.damage} damage · stock ${s.supplies[item.name]}`:`${item.health} HP · ${item.damage} damage · ${item.range} range`}</small></div><button data-action="shop-buy" data-kind="${owned?'equip':kind}" data-name="${item.name}" ${active||(!owned&&s.money<item.cost)?'disabled':''}>${active?'Equipped':owned?'Equip':item.cost+' supplies'}</button></article>`;
    };
    const defense=this.shopTab==='defenses';
    this.ui.innerHTML=this.hud(s.snapshot())+`<section class="modal campaign-shop" role="dialog" aria-modal="true" aria-labelledby="defense-title"><div class="shop-heading"><div><p class="eyebrow">OUTPOST WORKSHOP · ${s.money} SUPPLIES</p><h2 id="defense-title">${defense?'Fortify the line.':this.shopTab==='weapons'?'Choose your firepower.':'Call in support.'}</h2></div><button data-action="back-pause" data-initial-focus>Back</button></div><div class="shop-tabs">${['defenses','weapons','support'].map(t=>`<button data-action="shop" data-tab="${t}" aria-pressed="${t===this.shopTab}">${t}</button>`).join('')}</div>${defense?`<div class="slot-controls">${s.defenses.map((gun,i)=>`<button data-action="select-slot" data-slot="${i}" aria-pressed="${i===this.selectedSlot}">Position ${i+1} · ${gun?.health>0?label(gun.name):'empty'}</button>`).join('')}</div>${live?`<div class="placed-defense"><strong>${label(d.name)} · ${d.health} / ${d.maxHealth} HP</strong><button data-action="repair-maxim" ${d.health>=d.maxHealth||s.money<=5||s.money<Math.round(d.maxHealth/10)?'disabled':''}>Repair · ${Math.round(d.maxHealth/10)}</button><button data-action="sell-maxim">Sell · +${d.costSale}</button></div>`:'<div class="shop-catalog">'+this.assets.balance.inventory.map(i=>card(i,'defense')).join('')+'</div>'}`:'<div class="shop-catalog">'+(this.shopTab==='weapons'?this.assets.balance.weapons:this.assets.balance.omps).map(i=>card(i,this.shopTab==='weapons'?'weapon':'support')).join('')+'</div>'}<p class="cost-note">${s.status==='ready'?'Preparation purchases save immediately.':'Wave purchases save at victory. Retry restores the checkpoint.'} Select owned support during battle, then click to deploy.</p></section>`;
    this.updateHud();
  }

  result() {
    const s = this.combat, won = this.name === 'victory';
    this.ui.innerHTML = this.hud(s.checkpoint) + `<section class="modal encounter-modal result-card ${won ? 'won' : 'lost'}" role="dialog" aria-modal="true" aria-labelledby="result-title"><p class="eyebrow">WAVE ${String(s.wave).padStart(2,'0')} / ${won ? 'SECURED' : 'BASE LOST'}</p><h2 id="result-title">${won ? s.wave===20?'Campaign secured.':'Line held.' : 'Outpost overrun.'}</h2><div class="result-grid"><span>Eliminated<strong>${s.kills} / ${s.total}</strong></span><span>Points earned<strong>+${s.earnedScore}</strong></span><span>Supplies earned<strong>+${s.earnedMoney}</strong></span><span>Base condition<strong>${Math.round(s.health / 8)}%</strong></span></div>${won?(s.wave===20?`<p>Campaign complete. Final total: ${(s.score+s.money).toLocaleString()}</p>`:''):'<p>Your checkpoint is intact. Regroup and try again.</p>'}${won?this.awardSummary(s):''}<div class="stack-actions"><button class="primary" data-action="${won ? 'outpost' : 'retry'}" data-initial-focus>${won ? 'Continue' : 'Retry wave'} ${icon('arrow')}</button><button class="quiet" data-action="menu">Main menu</button></div></section>`;
    this.updateHud();
  }
  briefingText(wave) {
    const threats=Object.entries(this.assets.balance.levels[wave-1]).filter(([,n])=>n>0);
    const names={SoldatAK:'riflemen',SoldatBazooka:'bazooka infantry',BTRLite:'light machine-gun jeeps',BTR:'machine-gun jeeps',TankLite:'light tanks',Tank:'heavy tanks',RocketLite:'rocket carriers',Rocket:'heavy rocket carriers'};
    return threats.map(([name,n])=>`${n} ${names[name]}`).join(' · ');
  }
  awardSummary(s) {
    const earned=ACHIEVEMENTS.filter(a=>s.achievements.owned.has(a.id)&&!s.checkpoint.achievements.includes(a.id));
    return earned.length?`<p class="earned-awards">NEW HONORS · ${earned.map(a=>a.name).join(' · ')}</p>`:'';
  }
  help() {
    const tips=[['weapon','Aim & fire','Click enemies. Hold for the machine gun. Empty magazines reload automatically; release and press again afterward.'],['shield','Build the line','Open Defenses while preparing or paused. Choose one of five positions, then a defense. Select placed guns to repair or sell.'],['plane','Deploy support','Buy stock in Support. In battle select Mine, Air strike or Atomic strike, then click the battlefield. Click the item again to cancel.'],['cross','Keep the base standing','Repair the base for 3 supplies while preparing or paused. Each repair restores 80 HP and requires 5 supplies in reserve.'],['pause','Take command','P pauses and resumes. F expands the game; Escape returns. Pause to open shops. The speaker toggles all sounds.'],['supply','Save your campaign','Preparation purchases save immediately. Victory saves the next wave. Retry or reloading restores the whole wave checkpoint.']];
    this.ui.innerHTML=`<section class="modal guide-panel" role="dialog" aria-modal="true" aria-labelledby="guide-title"><div class="shop-heading"><div><p class="eyebrow">FIELD MANUAL</p><h2 id="guide-title">Your outpost. Your orders.</h2></div><button data-action="back-panel" data-initial-focus>Back</button></div><div class="guide-grid">${tips.map(([glyph,title,copy])=>`<article>${icon(glyph)}<div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}</div></section>`;
  }
  medals() {
    const c=this.combat?.snapshot()||this.store.campaign,owned=new Set(c?.achievements||[]);
    this.ui.innerHTML=`<section class="modal medal-panel" role="dialog" aria-modal="true" aria-labelledby="medal-title"><div class="shop-heading"><div><p class="eyebrow">CAMPAIGN HONORS · ${ACHIEVEMENTS.filter(a=>owned.has(a.id)).length} / 6</p><h2 id="medal-title">Service remembered.</h2></div><button data-action="back-panel" data-initial-focus>Back</button></div><div class="medal-grid">${ACHIEVEMENTS.map(a=>`<article class="medal-card ${owned.has(a.id)?'unlocked':'locked'}"><span class="medallion ${a.tone||'gold'}" aria-hidden="true">${a.mark}</span><div><h3>${a.name}</h3><p>${a.description}</p><small>${owned.has(a.id)?'EARNED':'LOCKED'}</small></div></article>`).join('')}</div><p class="panel-note">Honors belong to this campaign. Awards earned during a wave are saved at victory.</p></section>`;
  }
  settings() {
    const s = this.settingsDraft;
    this.ui.innerHTML = `<section class="modal settings-card" role="dialog" aria-modal="true" aria-labelledby="settings-title"><p class="eyebrow">OUTPOST SETTINGS</p><h2 id="settings-title">Make it yours.</h2><div class="settings-body">${[['master','Master volume'],['music','Music & ambience'],['effects','Effects']].map(([key,label]) => `<label class="range-label" for="${key}"><span>${label}</span><output data-value="${key}" for="${key}">${s[key]}%</output><input id="${key}" name="${key}" type="range" min="0" max="100" value="${s[key]}" ${key === 'master' ? 'data-initial-focus' : ''}></label>`).join('')}<div class="setting-row"><label for="reducedMotion">Reduced motion</label><input id="reducedMotion" name="reducedMotion" type="checkbox" ${s.reducedMotion ? 'checked' : ''}></div><div class="setting-row"><label for="shake">Screen shake</label><select id="shake" name="shake"><option value="off" ${s.shake === 'off' ? 'selected' : ''}>Off</option><option value="low" ${s.shake === 'low' ? 'selected' : ''}>Low</option></select></div><button class="quiet test-audio" data-action="test-audio">${icon('sound')} Test effects volume</button></div><div class="modal-actions"><button class="primary" data-action="apply-settings">Apply settings</button><button data-action="cancel-settings">Cancel</button><button class="quiet reset-button" data-action="reset-settings">Defaults</button></div></section>`;
  }
  confirm() {
    this.ui.innerHTML = `<section class="modal confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><p class="eyebrow">A FRESH START</p><h2 id="confirm-title">Start a new campaign?</h2><p>Your current checkpoint will be replaced. One previous checkpoint is retained in the local save backup.</p><div class="modal-actions"><button data-action="menu" data-initial-focus>Keep campaign</button><button class="primary" data-action="confirm-new">Start new</button></div></section>`;
  }
}
