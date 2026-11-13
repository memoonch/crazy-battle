import {simToDesign} from './combat.js';
import {vehicleLayout,SOLDIER_HEIGHT} from './sprite-layout.js';
import {enemyFeedback} from './enemy-feedback.js';
import {vehicleMotion} from './vehicle-motion.js';
import {enemyAttackFeedback} from './enemy-attack-feedback.js';
export const VEHICLE_MUZZLES={BTRLite:[338,166],BTR:[338,166],TankLite:[48,423],Tank:[780,425],RocketLite:[301,712],RocketBig:[1069,696]};
const rotate=(p,a)=>({x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)});
export const HELICOPTER_GUN_ARC={min:-18*Math.PI/180,max:105*Math.PI/180};
export function helicopterGun(art,combat,reducedMotion=false,aim){
 const pose=helicopterPose(combat,reducedMotion),body=art['helicopter-body'],s=151/body.width;
 const anchor={x:-92+(1480-body.x)*s,y:-24+(655-body.y)*s};
 const pivot={x:anchor.x+2,y:anchor.y+1};
 const offset=rotate(pivot,pose.angle),world={x:pose.x+offset.x,y:pose.y+offset.y};
 const shot=combat.traces.findLast(t=>t.player&&t.ttl>0),target=shot?.to?simToDesign(shot.to):aim??simToDesign(combat.aim??{x:500,y:250});
 const requested=Math.atan2(target.y-world.y,target.x-world.x)-pose.angle;
 const localAngle=Math.max(HELICOPTER_GUN_ARC.min,Math.min(HELICOPTER_GUN_ARC.max,requested)),angle=localAngle+pose.angle,index={Cannon:0,MashineGun:1,Bazooka:2,Rocket:3}[combat.activeWeapon]??0;
 // Aircraft barrels use the weapon cores, excluding handheld grips and tall shop-display mounts.
 const original=art['weapons-equipment'].frames[index],regions=[[155,135,658,250],[1000,134,755,112],[44,553,801,180],[968,570,704,262]][index];
 const b={...original,x:regions[0],y:regions[1],width:regions[2],height:regions[3]},w=[19,23,24,23][index],h=w*b.height/b.width;
 const tipY=[270,190,645,650][index],drawY=-(tipY-b.y)*w/b.width;
 const recoil=reducedMotion?0:Math.max(0,Math.min(1,(shot?.ttl??0)/65))*[1.1,.65,1.4,1.6][index],length=w*.68-recoil;
 return {anchor,pivot,world,angle,localAngle,index,b,w,h,drawY,recoil,length,tip:{x:world.x+Math.cos(angle)*length,y:world.y+Math.sin(angle)*length}};
}
export function helicopterPose(combat,reducedMotion){
 const p=simToDesign({x:combat.helicopter.x+40,y:combat.helicopter.y+100}),shot=combat.traces.findLast(t=>t.player);
 const kick=shot&&!reducedMotion?Math.max(0,shot.ttl/65)*(shot.weapon==='MashineGun'?1:2.4):0;
 return {x:p.x-kick,y:p.y-95+kick*.25,angle:reducedMotion?0:combat.helicopter.tilt*Math.PI/180*.4-kick*.003};
}
export function muzzlePoint(art,combat,source,reducedMotion=false,fallback={x:0,y:0},aim){
 if(source.player){
  return helicopterGun(art,combat,reducedMotion,aim).tip;
 }
 if(source.enemyId!=null){
  const e=[...combat.enemies,...combat.corpses].find(e=>e.id===source.enemyId);if(!e)return fallback;
  const p=simToDesign(e);let local;
  if(e.name.startsWith('Soldat'))local={x:-21*SOLDIER_HEIGHT/37,y:-21*SOLDIER_HEIGHT/37};
  else {const l=vehicleLayout(art,e),tip=VEHICLE_MUZZLES[e.name];
    local={x:l.x+(tip[0]-l.b.x)*l.w/l.b.width+enemyAttackFeedback(e,combat.elapsedMs,reducedMotion).recoil,y:l.y+(tip[1]-l.b.y)*l.h/l.b.height+vehicleMotion(e,false,reducedMotion).bob};}
  local=rotate(local,enemyFeedback(e,combat.elapsedMs,false,reducedMotion).lean);
  return {x:p.x+local.x,y:p.y+local.y};
 }
 if(source.slot!=null){
  const d=combat.defenses[source.slot];if(!d)return fallback;const y=240+source.slot*48;
  if(d.name==='Maxim'){const b=art['outpost-equipment'].frames[1],s=46/b.width;
    return {x:80-(d.flash>0?1:0)+(1228-b.x)*s,y:y+8-b.height*s+(264-b.y)*s};}
  const index={Mortar:0,CannonSmall:1,CannonNormal:2,CannonBig:3}[d.name],b=art['defenses-painted'].frames[index],s=Math.min(65/b.width,40/b.height);
  const tip=[[466,100],[1358,219],[687,665],[1488,630]][index];
  return {x:104-b.width*s/2-(d.flash>0?1:0)+(tip[0]-b.x)*s,y:y+8-b.height*s+(tip[1]-b.y)*s};
 }
 return fallback;
}
// Visual-only correction tapers to zero at impact; simulation trajectories stay intact.
export function projectileDisplay(shot,origin){
 const p=simToDesign(shot),from=simToDesign(shot.from),distance=Math.hypot(shot.to.x-shot.from.x,shot.to.y-shot.from.y);
 const progress=distance?Math.min(1,Math.hypot(shot.x-shot.from.x,shot.y-shot.from.y)/distance):1;
 return {x:p.x+(origin.x-from.x)*(1-progress),y:p.y+(origin.y-from.y)*(1-progress)};
}
export function muzzleDirection(combat,source,reducedMotion,from,to){
 const shot=combat.projectiles?.findLast(p=>p.source&&(
  source.player&&p.source.player||source.enemyId!=null&&p.source.enemyId===source.enemyId||source.slot!=null&&p.source.slot===source.slot));
 if(shot){const p=projectileDisplay(shot,from);if(Math.hypot(p.x-from.x,p.y-from.y)>.01)return Math.atan2(p.y-from.y,p.x-from.x);
  const dx=shot.to.x-shot.from.x,dy=shot.to.y-shot.from.y,arc=shot.type==='Mortar'?100:shot.type==='CannonBig'?50:10;
  return Math.atan2((dy-(dx?4*arc:0))*48/55,dx*815/540);
 }
 return Math.atan2(to.y-from.y,to.x-from.x);
}
