import {DEATH_MS,simToDesign} from './combat.js';
export const SCAR_LIMIT=28,WRECK_LIMIT=8;
export function wreckEnvelope(age){
 return {visible:age>=DEATH_MS&&age<8000,alpha:Math.max(0,Math.min(1,(8000-age)/2000)),
  smoke:Math.max(0,1-age/6000),fire:Math.max(0,1-age/2200)};
}
export class BattleAftermath {
 constructor(){this.scars=[];this.wrecks=[];this.seenBlasts=new WeakSet();this.seenVehicles=new Set();}
 update(combat){
  const now=combat.elapsedMs;
  for(const blast of combat.effects){if(!blast.blast||this.seenBlasts.has(blast))continue;this.seenBlasts.add(blast);
   const p=simToDesign(blast);if(p.x<145||p.x>960)continue;
   this.scars.push({x:p.x,y:Math.max(235,Math.min(460,p.y+5)),born:now,life:30000,
    frame:['Atom','Avia'].includes(blast.kind)?2:blast.kind==='Mine'?0:1,
    width:({Atom:135,Avia:105,Rocket:82,Bazooka:68,Mine:50})[blast.kind]||60});
  }
  for(const unit of combat.corpses){if(unit.name.startsWith('Soldat')||this.seenVehicles.has(unit.id))continue;this.seenVehicles.add(unit.id);
   const born=now-Math.max(0,DEATH_MS-unit.ttl),p=simToDesign(unit);
   this.wrecks.push({unit:{...unit,attackFlash:0},born});
   if(p.x>=145&&p.x<=960)this.scars.push({x:p.x,y:Math.min(460,p.y+4),born,life:30000,frame:3,width:105});
  }
  this.scars=this.scars.filter(s=>now-s.born<s.life).slice(-SCAR_LIMIT);
  this.wrecks=this.wrecks.filter(w=>now-w.born<8000).slice(-WRECK_LIMIT);
 }
}
