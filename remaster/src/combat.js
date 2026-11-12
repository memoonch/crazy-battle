import { AchievementTracker } from './achievements.js';
import { paintedContains } from './sprite-layout.js';
// Simulation uses the original 640x480 world, independent of screen resolution.
export const STEP_MS = 25;
export const DEATH_MS = 350; // Death poses finish before wave completion.
export function simToDesign({ x, y }) { return { x: 145 + (x - 100) * (815 / 540), y: 240 + (y - 122) * (48 / 55) }; }
export function designToSim({ x, y }) { return { x: 100 + (x - 145) / (815 / 540), y: 122 + (y - 240) / (48 / 55) }; }

export function seededRandom(seed) {
  let value = seed >>> 0;
  return () => { value += 0x6D2B79F5; let n = value; n = Math.imul(n ^ n >>> 15, n | 1); n ^= n + Math.imul(n ^ n >>> 7, n | 61); return ((n ^ n >>> 14) >>> 0) / 4294967296; };
}

export class FixedStepClock {
  constructor() { this.accumulator = 0; }
  reset() { this.accumulator = 0; }
  advance(seconds, update) {
    this.accumulator += Math.min(Math.max(seconds * 1000, 0), 250);
    let steps = 0;
    while (this.accumulator + 1e-7 >= STEP_MS) {
      this.accumulator = Math.max(0, this.accumulator - STEP_MS); steps++;
      if (update() === false) { this.reset(); break; }
    }
    return steps;
  }
}

export class Combat {
  constructor(balance, checkpoint, seed = Date.now(), art = null) {
    this.art=art;
    if (!Number.isInteger(checkpoint.wave) || checkpoint.wave < 1 || checkpoint.wave > 20) throw new Error('No playable wave at this checkpoint.');
    if (!checkpoint.weapons.includes(checkpoint.activeWeapon)) throw new Error('Weapon is not owned.');
    this.balance = balance; this.activeWeapon = checkpoint.activeWeapon;
    this.weapons = [...checkpoint.weapons]; this.supplies = {...checkpoint.supplies};
    this.weaponStates = new Map();
    this.armed = null; this.projectiles = []; this.mines = []; this.airstrikes = [];
    this.checkpoint = structuredClone(checkpoint);
    this.achievements=new AchievementTracker(checkpoint.achievements);
    this.random = seededRandom(seed);
    this.wave = checkpoint.wave; this.health = checkpoint.health;
    this.score = checkpoint.score; this.money = checkpoint.money;
    this.weapon = { ...balance.weapons.find(w => w.name === this.activeWeapon) };
    this.enemyTypes = Object.fromEntries(balance.enemys.map(e => [e.name, e]));
    this.queue = Object.entries(balance.levels[this.wave - 1]).flatMap(([name, count]) => Array(count).fill(name === 'Rocket' ? 'RocketBig' : name));
    if (this.queue.some(name => !this.enemyTypes[name])) throw new Error('Unknown enemy type.');
    for (let i = this.queue.length - 1; i > 0; i--) { const j = Math.floor(this.random() * (i + 1)); [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]]; }
    this.total = this.queue.length; this.enemies = []; this.corpses = []; this.events = [];
    this.status = 'ready'; this.elapsedMs = 0; this.spawnTime = 0; this.nextId = 1;
    this.ammo = this.weapon.magazine; this.rateCounter = this.weapon.rate + 1; this.reloading = false; this.reloadTime = 0;
    this.roundReloadMs = Math.ceil(Math.floor(this.weapon.timeReload / this.weapon.magazine) / STEP_MS) * STEP_MS;
    this.kills = 0; this.shots = 0; this.hits = 0;
    this.helicopter = { x: -90, y: 100, tilt: 0 };
    this.effects = []; this.traces = [];
    this.defenses = (checkpoint.defenses || Array(5).fill(null)).map(d => d ? {...balance.inventory.find(t => t.name === d.name), ...d, maxHealth: balance.inventory.find(t => t.name === d.name).health, counter: 0, flash: 0} : null);
    this.maxim = { ...balance.inventory.find(item => item.name === 'Maxim') };
    this.rewardMoney = 0; this.spent = 0;
  }
  start() { if (this.status === 'ready') this.status = 'running'; }
  pause() { if (this.status === 'running') this.status = 'paused'; }
  resume() { if (this.status === 'paused') this.status = 'running'; }
  drainEvents() { return this.events.splice(0); }
  get remaining() { return this.total - this.kills; }
  get earnedMoney() { return this.rewardMoney; }
  get earnedScore() { return this.score - this.checkpoint.score; }
  tick({ aim = { x: 400, y: 250 }, shots = [], held = false } = {}) {
    if (this.status !== 'running') return;
    this.events = [];
    this.elapsedMs += STEP_MS;
    for (const list of [this.effects, this.traces, this.corpses]) {
      for (const item of list) item.ttl -= STEP_MS;
      for (let i = list.length - 1; i >= 0; i--) if (list[i].ttl <= 0) list.splice(i, 1);
    }
    if (this.rateCounter <= this.weapon.rate) this.rateCounter++;
    if (this.reloading) {
      this.reloadTime += STEP_MS;
      if (this.reloadTime >= this.roundReloadMs) {
        this.reloadTime -= this.roundReloadMs; this.ammo++;
        if (this.ammo === this.weapon.magazine) { this.reloading = false; this.events.push({ type: 'reload-complete' }); }
      }
    }
    this.spawnTime += STEP_MS;
    if (this.queue.length && this.spawnTime >= 1500) {
      this.spawnTime -= 1500;
      const name = this.queue.shift(), skin = this.enemyTypes[name];
      this.enemies.push({ ...skin, id: this.nextId++, x: 680, y: 120 + this.random() * 253, healthMax: skin.health,
        state: 'move', counter: skin.rate, attackFlash: 0 });
      this.events.push({ type: 'spawn' });
    }
    // A press is queued by input, so a quick down/up between frames still fires.
    // Cannon is semi-automatic: held input is deliberately not an autofire source.
    for (const point of shots) { if (this.armed) this.deploy(point); else this.fire(point); }
    if (held && !shots.length && this.activeWeapon === 'MashineGun' && !this.armed) this.fire(aim);
    for (const enemy of this.enemies) {
      enemy.attackFlash = Math.max(0, enemy.attackFlash - STEP_MS);
      if (enemy.state === 'move') {
        if (enemy.x > enemy.distance + this.random() * 50) enemy.x -= enemy.speed;
        else enemy.state = 'attack';
      } else {
        enemy.counter++;
        if (enemy.counter > enemy.rate) {
          enemy.counter = 0; enemy.attackFlash = 100;
          const slot = Math.min(4, Math.max(0, Math.floor((enemy.y - 120) / 53)));
          const defense = this.defenses[slot];
          if (['SoldatAK','BTR','BTRLite'].includes(enemy.name)) this.damageBaseOrDefense(defense?.health>0?defense:null, enemy.damage);
          else this.launch({x:enemy.x-10,y:enemy.y-25},{x:50,y:enemy.y-25},[],enemy.damage,enemy.name,defense?.health>0?defense:'base');
          this.traces.push({ from: { x: enemy.x - 8, y: enemy.y - 20 }, to: defense?.health > 0 ? { x: 74, y: 122 + slot * 55 - 14 } : { x: 50, y: enemy.y - 20 }, ttl: 75, enemy: true });
        }
      }
    }
    this.updateProjectiles(); this.updateSupport(); this.updateDefenses();
    this.helicopter.x = Math.min(130, this.helicopter.x + 7);
    if (aim.y > 100 && aim.y < 350) {
      const y = aim.y - 100, direction = Math.sign(y - this.helicopter.y);
      this.helicopter.tilt = Math.max(-10, Math.min(10, this.helicopter.tilt + direction));
      this.helicopter.y = y;
    }
    // Explicit terminal state: never award both a victory and a defeat.
    if (this.health <= 0) { this.status = 'defeat'; this.events.push({ type: 'defeat' }); }
    else if (!this.queue.length && !this.enemies.length && !this.corpses.length && !this.projectiles.length) {
      this.status = 'victory';this.emitAchievements(this.achievements.victory(this.wave)); this.events.push({ type: 'victory' });
    }
  }
  fire(point) {
    if (this.status !== 'running' || this.reloading || !this.ammo || this.rateCounter <= this.weapon.rate) return false;
    this.ammo--; this.shots++; this.rateCounter = 0;
    const target = [...this.enemies].sort((a, b) => b.y - a.y).find(e => this.contains(e,point));
    this.events.push({ type: 'shot' });
    this.traces.push({ from: { x: this.helicopter.x + 75, y: this.helicopter.y + 15 }, to: { ...point }, ttl: 65, enemy: false });
    this.effects.push({ ...point, ttl: 100, hit: !!target });
    if (this.weapon.radius) {
      // A direct click on tall painted armor must include that vehicle even
      // when its ground anchor lies outside the cursor's splash radius.
      const nearby=this.enemies.filter(e => Math.hypot(point.x-e.x,point.y-e.y)<this.weapon.radius);
      const targets=[...new Set([...nearby,...(target?[target]:[])])];
      if(targets.length)this.hits++;
      this.launch({x:this.helicopter.x+75,y:this.helicopter.y+15},targets[0] || point,targets,this.weapon.damage,this.activeWeapon);
    } else if (target) { this.hits++; this.damageEnemy(target, this.weapon.damage); }
    if (!this.ammo) { this.reloading = true; this.reloadTime = 0; this.events.push({ type: 'reload-start' }); }
    return true;
  }
  damageEnemy(target, damage) {
    if (!target || !this.enemies.includes(target) || target.health <= 0) return;
    target.hitAt=this.elapsedMs; // Presentation marker; no extra damage or simulation timer.
    target.health = Math.max(0, target.health - damage);
    if (!target.health) {
      this.enemies.splice(this.enemies.indexOf(target), 1);
      this.corpses.push({ ...target, ttl: DEATH_MS });
      this.emitAchievements(this.achievements.kill(this.elapsedMs));
      this.kills++; this.money += target.cost; this.rewardMoney += target.cost; this.score += target.healthMax;
      this.events.push({ type: 'kill', id: target.id, money: target.cost, score: target.healthMax });
    }
  }
  contains(enemy, point) {
    const vehicle = !enemy.name.startsWith('Soldat');
    const body=Math.abs(point.x-enemy.x) <= (vehicle?29:12) && point.y >= enemy.y-(vehicle?52:38) && point.y <= enemy.y;
    if(body||!this.art)return body;
    const origin=simToDesign(enemy),hit=simToDesign(point);
    return paintedContains(this.art,enemy,{x:hit.x-origin.x,y:hit.y-origin.y});
  }
  get canShop() { return ['ready','paused'].includes(this.status); }
  equip(name) {
    if(!this.canShop || !this.weapons.includes(name) || this.activeWeapon===name)return false;
    this.weaponStates.set(this.activeWeapon,{ammo:this.ammo,rateCounter:this.rateCounter,reloading:this.reloading,reloadTime:this.reloadTime});
    this.activeWeapon=name;this.weapon={...this.balance.weapons.find(w=>w.name===name)};
    this.ammo=this.weapon.magazine;this.rateCounter=this.weapon.rate+1;this.reloading=false;this.reloadTime=0;
    this.roundReloadMs=Math.ceil(Math.floor(this.weapon.timeReload/this.weapon.magazine)/STEP_MS)*STEP_MS;
    if(this.weaponStates.has(name))Object.assign(this,this.weaponStates.get(name));
    return true;
  }
  buyWeapon(name) {
    const item=this.balance.weapons.find(w=>w.name===name);
    if(!this.canShop || !item || this.weapons.includes(name) || this.money<item.cost)return false;
    this.money-=item.cost;this.spent+=item.cost;this.weapons.push(name);return this.equip(name);
  }
  buySupport(name) {
    const item=this.balance.omps.find(w=>w.name===name);
    if(!this.canShop || !item || this.money<item.cost || this.supplies[name]>=9999)return false;
    this.money-=item.cost;this.spent+=item.cost;this.supplies[name]++;return true;
  }
  repairBase() {
    if(!this.canShop || this.health>=800 || this.money<=4)return false;
    this.money-=3;this.spent+=3;this.health=Math.min(800,this.health+80);return true;
  }
  placeDefense(slot,name) {
    const item=this.balance.inventory.find(d=>d.name===name);
    if(!this.canShop || !item || !Number.isInteger(slot) || slot<0 || slot>4 || this.defenses[slot]?.health>0 || this.money<item.cost)return false;
    this.money-=item.cost;this.spent+=item.cost;
    this.defenses[slot]={...item,maxHealth:item.health,counter:item.rate,flash:0};return true;
  }
  placeMaxim(slot) { return this.placeDefense(slot,'Maxim'); }
  repairMaxim(slot) { return this.repairDefense(slot); }
  sellMaxim(slot) { return this.sellDefense(slot); }
  repairDefense(slot) {
    const d=this.defenses[slot];if(!d)return false;
    const cost=Math.round(d.maxHealth/10);
    if(!this.canShop || d.health<=0 || d.health>=d.maxHealth || this.money<=5 || this.money<cost)return false;
    this.money-=cost;this.spent+=cost;d.health=Math.min(d.maxHealth,Math.floor(d.health+d.maxHealth/3));return true;
  }
  sellDefense(slot) {
    const d=this.defenses[slot];if(!this.canShop || !d || d.health<=0)return false;
    this.money+=d.costSale;this.defenses[slot]=null;return true;
  }
  damageBaseOrDefense(defense, damage) {
    if(defense && defense !== 'base') {
      if(defense.health<=0)return;
      defense.health=Math.max(0,defense.health-damage);if(!defense.health)defense.destroyedAt=this.elapsedMs;
      this.events.push({type:'defense-hit',damage});
    }else {this.achievements.baseDamage+=Math.min(this.health,damage);this.health=Math.max(0,this.health-damage);this.events.push({type:'base-hit',damage});}
  }
  launch(from,to,targets,damage,type,baseTarget=null) {
    this.projectiles.push({x:from.x,y:from.y,from:{...from},to:{x:to.x,y:to.y},targets:[...new Set(targets)],damage,type,baseTarget});
  }
  updateProjectiles() {
    for(const p of [...this.projectiles]) {
      const dx=p.to.x-p.x,dy=p.to.y-p.y;
      if(Math.hypot(dx,dy)<24 || (p.to.x-p.from.x)*(p.to.x-p.x)<=0) {
        if(p.baseTarget)this.damageBaseOrDefense(p.baseTarget,p.damage);
        else for(const target of p.targets)this.damageEnemy(target,p.damage);
        this.effects.push({...p.to,ttl:250,hit:true,blast:true});this.events.push({type:'explosion'});
        this.projectiles.splice(this.projectiles.indexOf(p),1);continue;
      }
      const step=p.type==='Mortar'?10:16;
      const direction=Math.sign(p.to.x-p.from.x);
      if(!direction){p.y+=Math.sign(dy)*Math.min(step,Math.abs(dy));continue;}
      p.x+=direction*Math.min(step,Math.abs(dx));
      const t=Math.min(1,Math.abs((p.x-p.from.x)/(p.to.x-p.from.x)));
      const arc=p.type==='Mortar'?100:p.type==='CannonBig'?50:10;
      p.y=p.from.y+(p.to.y-p.from.y)*t-4*arc*t*(1-t);
    }
  }
  arm(name) {
    if(this.status!=='running' || !Object.hasOwn(this.supplies,name) || !this.supplies[name])return false;
    this.armed=this.armed===name?null:name;return true;
  }
  deploy(point) {
    const name=this.armed;this.armed=null;
    if(this.status!=='running' || !this.supplies[name])return false;
    this.supplies[name]--;
    if(name==='Atom') {for(const enemy of [...this.enemies])this.damageEnemy(enemy,100);this.effects.push({...point,ttl:600,hit:true,blast:true});}
    else if(name==='Mine')this.mines.push({...point});
    else this.airstrikes.push({x:-200,y:point.y,targetX:point.x});
    this.events.push({type:'explosion'});return true;
  }
  updateSupport() {
    for(const mine of [...this.mines]) {
      const target=this.enemies.find(e=>Math.abs(e.x-mine.x)<(e.name.startsWith('Soldat')?15:32)&&Math.abs(e.y-mine.y)<18);
      if(target){this.damageEnemy(target,100);this.effects.push({...mine,ttl:250,hit:true,blast:true});this.mines.splice(this.mines.indexOf(mine),1);this.events.push({type:'explosion'});}
    }
    for(const plane of [...this.airstrikes]) {
      plane.x+=20;
      if(plane.x>plane.targetX && plane.x<plane.targetX+150){
        for(const enemy of [...this.enemies])if(Math.hypot(enemy.x-plane.x,enemy.y-plane.y)<80)this.damageEnemy(enemy,100);
        this.effects.push({...plane,ttl:250,hit:true,blast:true});
      }
      if(plane.x>840)this.airstrikes.splice(this.airstrikes.indexOf(plane),1);
    }
  }
  updateDefenses() {
    for(let slot=0;slot<5;slot++) {
      const d=this.defenses[slot];if(!d || d.health<=0)continue;
      d.flash=Math.max(0,d.flash-STEP_MS);const origin={x:74,y:122+slot*55};
      const band=['Maxim','CannonBig'].includes(d.name)?90:50;
      const target=this.enemies.find(e=>Math.abs(e.y-origin.y)<band && Math.hypot(e.x-origin.x,e.y-origin.y)<d.range);
      if(d.counter<=d.rate)d.counter++;
      if(!target || d.counter<=d.rate)continue;
      d.counter=0;d.flash=100;
      this.traces.push({from:{x:origin.x+12,y:origin.y-14},to:{x:target.x,y:target.y-18},ttl:70,enemy:false});
      if(d.name==='Maxim')this.damageEnemy(target,d.damage);
      else {const targets=d.radius?this.enemies.filter(e=>Math.hypot(e.x-target.x,e.y-target.y)<d.radius):[target];this.launch({x:origin.x+32,y:origin.y-20},target,targets,d.damage,d.name);}
      this.events.push({type:'defense-shot'});
    }
  }
  emitAchievements(ids) {for(const id of ids)this.events.push({type:'achievement',id});}
  snapshot(wave=this.wave) {
    return {...structuredClone(this.checkpoint),wave,health:this.health,score:this.score,money:this.money,
      weapons:[...this.weapons],activeWeapon:this.activeWeapon,supplies:{...this.supplies},achievements:[...this.achievements.owned],
      defenses:this.defenses.map(d=>d?.health>0?{name:d.name,health:d.health}:null)};
  }
  victoryCheckpoint() {
    if (this.status !== 'victory') throw new Error('Checkpoint requires victory');
    this.emitAchievements(this.achievements.victory(this.wave));
    return this.snapshot(this.wave+1);
  }
}
