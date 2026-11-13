import {loadAssets} from '../src/assets.js';
import {Combat,designToSim} from '../src/combat.js';
import {newCampaign} from '../src/save.js';
import {Renderer} from '../src/renderer.js';
import {helicopterPose,helicopterGun} from '../src/muzzle-layout.js';
const assets=await loadAssets(),weapons=['Cannon','MashineGun','Bazooka','Rocket'];
const stages=[['Ready',0],['Firing',65],['Settling',20]];
const controls=document.querySelector('#controls');
for(const [label,ttl]of stages){const button=document.createElement('button');button.textContent=label;controls.append(button);button.onclick=()=>paint(ttl);}
function paint(ttl){document.querySelector('#grid').replaceChildren();for(let direction=0;direction<8;direction++)for(const weapon of weapons){
 const angle=direction*Math.PI/4,s=new Combat(assets.balance,{...newCampaign(),weapons,activeWeapon:weapon},42,assets.art);s.start();s.helicopter={x:130,y:160,tilt:8};
 const pose=helicopterPose(s,false),target={x:pose.x+45+Math.cos(angle)*180,y:pose.y+36+Math.sin(angle)*180};s.aim=designToSim(target);s.fire(s.aim);s.pause();
 if(ttl===0)s.traces=[];else for(const t of s.traces)t.ttl=ttl;
 const card=document.createElement('figure'),title=document.createElement('figcaption');title.textContent=`${weapon} · ${direction*45}° · ${ttl?'shot':'ready'}`;card.append(title);
 const canvas=document.createElement('canvas');canvas.width=600;canvas.height=320;canvas.style.width='300px';canvas.style.height='160px';card.append(canvas);document.querySelector('#grid').append(card);
 const r=new Renderer(canvas,{view:{scale:2,dpr:1}});r.setAssets(assets);r.seenMuzzles=new WeakSet();r.muzzleSmoke=[];r.projectileVisuals=new WeakMap();r.seenEffects=new WeakSet();r.seenBlasts=new WeakSet();r.blastClouds=[];r.particles=[];r.helicopterAim=target;
 const c=r.ctx,p=helicopterPose(s,false);c.fillStyle='#82917b';c.fillRect(0,0,600,320);c.translate(280-p.x*2,150-p.y*2);c.scale(2,2);
 r.effects(c,s,{reducedMotion:false});c.save();c.translate(p.x,p.y);c.rotate(p.angle);r.helicopter(c,0,0,1,helicopterGun(assets.art,s,false,target));c.restore();
 }document.querySelector('#status').textContent=`32 production-renderer views · ${ttl?'flash/recoil':'ready'} · all four actual weapons`;
}
paint(65);
