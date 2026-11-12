export const SAVE_KEY = 'crazy-battle.remaster.v1';
export const DEFAULT_SETTINGS = Object.freeze({ master: 75, music: 45, effects: 70, reducedMotion: false, shake: 'low', muted: false });
const weaponNames = new Set(['Cannon', 'MashineGun', 'Bazooka', 'Rocket']);
const integer = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;

export function newCampaign() {
  return { wave: 1, health: 800, score: 0, money: 0, weapons: ['Cannon'], activeWeapon: 'Cannon',
    supplies: { Mine: 0, Avia: 0, Atom: 0 }, achievements: [], checkpoint: 'preparation' };
}
export function validCampaign(c) {
  return !!c && integer(c.wave, 1, 21) && integer(c.health, 0, 800) && integer(c.score, 0, 1e9)
    && integer(c.money, 0, 1e9) && Array.isArray(c.weapons) && c.weapons.length > 0 && c.weapons.length <= 4
    && new Set(c.weapons).size === c.weapons.length && c.weapons.every(w => weaponNames.has(w))
    && c.weapons.includes('Cannon') && c.weapons.includes(c.activeWeapon)
    && !!c.supplies && ['Mine', 'Avia', 'Atom'].every(k => integer(c.supplies[k], 0, 9999))
    && Array.isArray(c.achievements) && c.achievements.length <= 6 && c.achievements.every(a => typeof a === 'string')
    && (c.defenses === undefined || (Array.isArray(c.defenses) && c.defenses.length === 5 && c.defenses.every(d => d === null || ({Maxim:35,Mortar:45,CannonSmall:65,CannonNormal:120,CannonBig:150}[d.name] && integer(d.health,1,{Maxim:35,Mortar:45,CannonSmall:65,CannonNormal:120,CannonBig:150}[d.name])))))
    && c.checkpoint === 'preparation';
}
export function validSettings(s) {
  return !!s && ['master', 'music', 'effects'].every(k => integer(s[k], 0, 100))
    && typeof s.reducedMotion === 'boolean' && ['off', 'low'].includes(s.shake)
    && (s.muted===undefined||typeof s.muted==='boolean');
}
const empty = () => ({ version: 1, revision: 0, campaign: null, previousCampaign: null, settings: { ...DEFAULT_SETTINGS } });
const validRecord=d=>!!d&&d.version===1&&validSettings(d.settings)
  &&(d.campaign===null||validCampaign(d.campaign))
  &&(d.previousCampaign==null||validCampaign(d.previousCampaign))&&integer(d.revision,0,1e9);

export class SaveStore {
  constructor(storage, now = () => new Date().toISOString()) {
    this.storage = storage;
    this.now = now;
    this.data = empty();
    this.status = 'No checkpoint yet';
    this.writable = true;
    this.load();
    this.campaignStamp=JSON.stringify(this.data.campaign);
  }
  load() {
    try {
      const raw = this.storage.getItem(SAVE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.version !== 1) { this.writable = false; this.status = 'Save from another version preserved; session only'; return; }
      if (!validSettings(d.settings) || (d.campaign !== null && !validCampaign(d.campaign))
        || (d.previousCampaign != null && !validCampaign(d.previousCampaign)) || !integer(d.revision, 0, 1e9)) {
        throw new Error('Invalid save structure');
      }
      this.data = d;
      this.status = d.campaign ? 'Local checkpoint restored' : 'Settings restored';
    } catch {
      // Preserve unreadable data in place. Never destroy it just by opening the game.
      this.writable = false;
      this.status = 'Save unavailable or unreadable; session only';
    }
  }
  commit(next,kind) {
    let latest=this.data;
    if(this.writable){
      try{
        const raw=this.storage.getItem(SAVE_KEY);latest=raw?JSON.parse(raw):empty();
        if(!validRecord(latest))throw new Error('Save changed or unreadable');
        if(kind==='checkpoint'&&JSON.stringify(latest.campaign)!==this.campaignStamp){
          this.writable=false;this.status='Campaign changed in another tab; reload to save. Session only';
        }
      }catch{this.writable=false;this.status='Save changed or unavailable; session only';}
    }
    // Settings writes preserve the newest campaign; campaign writes preserve
    // the newest settings. A stale running campaign may never roll back another.
    let merged=next;
    if(this.writable){
      merged=kind==='settings'?{...latest,settings:next.settings}
        :kind==='new'?{...latest,campaign:next.campaign,previousCampaign:latest.campaign}
        :{...latest,campaign:next.campaign};
    }
    const record = { ...structuredClone(merged), version: 1, revision: Math.max(this.data.revision,latest?.revision||0) + 1, updatedAt: this.now() };
    if (this.writable) {
      try { this.storage.setItem(SAVE_KEY, JSON.stringify(record)); this.status = 'Saved on this browser'; }
      catch { this.writable = false; this.status = 'Storage unavailable; session only'; }
    }
    this.data = record;
    if(kind!=='settings')this.campaignStamp=JSON.stringify(record.campaign);
  }
  startNew() {
    const c = newCampaign();
    this.commit({ ...this.data, previousCampaign: this.data.campaign, campaign: c },'new');
    return structuredClone(c);
  }
  get campaign() { return this.data.campaign ? structuredClone(this.data.campaign) : null; }
  get settings() { return { ...DEFAULT_SETTINGS,...this.data.settings }; }
  saveCheckpoint(campaign) {
    if (!validCampaign(campaign)) throw new Error('Invalid checkpoint');
    this.commit({ ...this.data, campaign },'checkpoint');
  }
  saveSettings(settings) {
    if (!validSettings(settings)) throw new Error('Invalid settings');
    this.commit({ ...this.data, settings },'settings');
  }
}
