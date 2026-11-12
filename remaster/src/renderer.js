import { soldierLayout, vehicleLayout, SOLDIER_HEIGHT } from './sprite-layout.js';
import { simToDesign, DEATH_MS } from './combat.js';
import { enemyFeedback } from './enemy-feedback.js';
import { explosionPresentation, battleShake } from './battle-feedback.js';
import {vehicleMotion,VEHICLE_WHEELS,wheelAngle} from './vehicle-motion.js';
import {helicopterGun,helicopterPose,muzzlePoint,projectileDisplay,muzzleDirection,VEHICLE_MUZZLES} from './muzzle-layout.js';
import {BattleAftermath,wreckEnvelope} from './battle-aftermath.js';
import {enemyAttackFeedback} from './enemy-attack-feedback.js';

export class Renderer {
  constructor(canvas, viewport) { this.ctx=canvas.getContext('2d');this.viewport=viewport;this.assets=null;this.lastCombat=null; }
  setAssets(assets) { this.assets=assets;this.enemySpriteCache=new Map(); }
  sprite(c,key,b,x,y,w,h) { c.drawImage(this.assets.images[key],b.x,b.y,b.width,b.height,x,y,w,h); }
  vfx(c,index,x,y,w,h=w,angle=0,anchorX=.5,anchorY=.5) {
    c.save();c.translate(x,y);c.rotate(angle);
    this.sprite(c,'battlefield-vfx',this.assets.art['battlefield-vfx'].frames[index],-w*anchorX,-h*anchorY,w,h);c.restore();
  }
  draw({time,scene,settings,pointer,combat,selectedSlot}) {
    const c=this.ctx,v=this.viewport.view;if(!c||!this.assets)return;
    this.reducedMotion=settings.reducedMotion;
    c.setTransform(v.dpr,0,0,v.dpr,0,0);c.clearRect(0,0,v.width,v.height);
    c.translate(v.offsetX,v.offsetY);c.scale(v.scale,v.scale);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const left=-v.offsetX/v.scale,top=-v.offsetY/v.scale,width=v.width/v.scale,height=v.height/v.scale;
    const image=this.assets.images['forest-battlefield'],cover=Math.max(width/image.width,height/image.height);
    c.drawImage(image,left+(width-image.width*cover)/2,top+(height-image.height*cover)/2,image.width*cover,image.height*cover);
    c.save();c.beginPath();c.rect(0,40,960,428);c.clip();
    const encounter=combat&&!['menu','confirm','preparation'].includes(scene);
    if(this.lastCombat!==combat){this.lastCombat=combat;this.aftermath=new BattleAftermath();this.particles=[];this.seenEffects=new WeakSet();this.seenBlasts=new WeakSet();this.blastClouds=[];this.muzzleSmoke=[];this.seenMuzzles=new WeakSet();this.projectileVisuals=new WeakMap();this.lastHealth=combat?.health??800;this.damageAt=null;}
    const shake=battleShake(encounter?combat:null,settings);c.translate(shake.x,shake.y);
    if(encounter){this.aftermath.update(combat);this.groundScars(c,combat.elapsedMs);}
    this.base(c,combat&&scene!=='menu'?combat:null);
    const motion=settings.reducedMotion?0:encounter?combat.elapsedMs/1000:time;
    if(encounter){
      this.wrecks(c,combat.elapsedMs,settings);
      for(const corpse of combat.corpses)this.soldier(c,corpse,motion,true,combat.elapsedMs);
      for(const enemy of [...combat.enemies].sort((a,b)=>a.y-b.y))this.soldier(c,enemy,motion,false,combat.elapsedMs);
      this.helicopterAim=pointer.inside&&pointer.battlefield?{x:pointer.x,y:pointer.y}:undefined;
      const heli=helicopterPose(combat,settings.reducedMotion);
      c.save();c.translate(heli.x,heli.y);c.rotate(heli.angle);this.helicopter(c,0,0,motion,helicopterGun(this.assets.art,combat,settings.reducedMotion,this.helicopterAim));c.restore();
      this.effects(c,combat,settings);
    }else this.helicopter(c,265,153+Math.sin(motion*1.4)*2,motion);
    c.restore();
    if(scene==='combat'&&pointer.inside&&pointer.battlefield){
      const hit=combat.effects.some(e=>e.hit&&e.ttl>25&&Math.hypot(simToDesign(e).x-pointer.x,simToDesign(e).y-pointer.y)<24);c.save();c.translate(pointer.x,pointer.y);
      c.strokeStyle='#17231b';c.lineWidth=3;c.beginPath();c.arc(0,0,13,0,Math.PI*2);c.stroke();
      c.strokeStyle=hit?'#fff6d4':'#f3b544';c.lineWidth=1.5;
      for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){c.beginPath();c.moveTo(Math.cos(a)*5,Math.sin(a)*5);c.lineTo(Math.cos(a)*15,Math.sin(a)*15);c.stroke();}
      if(hit){c.beginPath();c.arc(0,0,19,0,Math.PI*2);c.stroke();}c.restore();
    }
    if(!['preparation','combat'].includes(scene)){
      const shade=c.createLinearGradient(left,0,left+width,0);shade.addColorStop(0,scene==='defenses'?'rgba(9,19,19,.30)':'rgba(9,19,19,.94)');shade.addColorStop(.47,'rgba(9,19,19,.73)');shade.addColorStop(1,'rgba(9,19,19,.15)');c.fillStyle=shade;c.fillRect(left,top,width,height);
    }
    if(scene==='defenses'&&Number.isInteger(selectedSlot)){c.save();c.strokeStyle='#f3b544';c.lineWidth=1.8;c.beginPath();c.ellipse(103,246+selectedSlot*48,42,22,0,0,Math.PI*2);c.stroke();c.restore();}
  }
  base(c,combat) {
    const kit=this.assets.art['outpost-fortifications'],equipment=this.assets.art['outpost-equipment'];
    const [bunker,pit,trench,supplies]=kit.frames;
    // All five positions stay on their original lane centers. The service
    // trench is scenery behind them; it never enlarges the combat rectangle.
    c.fillStyle='rgba(51,39,22,.13)';c.beginPath();c.ellipse(62,342,59,125,0,0,Math.PI*2);c.fill();
    const trenchWidth=54,trenchHeight=trenchWidth*trench.height/trench.width;
    for(let y=216;y<468;y+=trenchHeight-5)this.sprite(c,'outpost-fortifications',trench,22,y,trenchWidth,trenchHeight);
    c.fillStyle='rgba(35,34,23,.23)';c.beginPath();c.ellipse(48,223,53,10,0,0,Math.PI*2);c.fill();
    c.save();if(combat&&combat.health<400)c.filter='saturate(.65) brightness(.82)';
    const bunkerWidth=116,bunkerHeight=bunkerWidth*bunker.height/bunker.width;
    this.sprite(c,'outpost-fortifications',bunker,-7,224-bunkerHeight,bunkerWidth,bunkerHeight);c.restore();
    // A small sign and supply cache make the rear lane read as a command post.
    c.fillStyle='#26382f';c.fillRect(9,225,35,11);c.strokeStyle='#a99a6e';c.lineWidth=.6;c.strokeRect(9,225,35,11);
    c.font='7px Bahnschrift, sans-serif';c.textAlign='center';c.fillStyle='#e9d8ac';c.fillText('COMMAND',26.5,232.8);
    this.sprite(c,'outpost-fortifications',supplies,4,432,34,34*supplies.height/supplies.width);
    for(let slot=0;slot<5;slot++){
      const y=240+slot*48,x=61,w=82,h=w*pit.height/pit.width,top=y-16;
      c.fillStyle='rgba(43,36,23,.22)';c.beginPath();c.ellipse(103,y+17,39,9,0,0,Math.PI*2);c.fill();
      this.sprite(c,'outpost-fortifications',pit,x,top,w,h);
      const gun=combat?.defenses?.[slot];
      if(gun&&gun.health>0){
        const b=equipment.frames[1],operatorWidth=46,operatorHeight=operatorWidth*b.height/b.width;
        if(gun.name==='Maxim')this.sprite(c,'outpost-equipment',b,80-(gun.flash>0?1:0),y+8-operatorHeight,operatorWidth,operatorHeight);
        else this.emplacement(c,gun,104,y+8);
        // Repaint the near sandbag lip over wheels/feet for a grounded mount.
        c.save();c.beginPath();c.rect(x,y+8,w,h);c.clip();this.sprite(c,'outpost-fortifications',pit,x,top,w,h);c.restore();
        if(gun.health<gun.maxHealth*.8){c.fillStyle='#172820';c.fillRect(84,y-23,40,3);c.fillStyle=gun.health<gun.maxHealth*.3?'#dd8059':'#e4b957';c.fillRect(84,y-23,40*gun.health/gun.maxHealth,3);}
      }
      c.fillStyle='#25382ee8';c.beginPath();c.roundRect(64,y+20,19,10,2);c.fill();
      c.font='7px Bahnschrift, sans-serif';c.fillStyle='#eddfba';c.textAlign='center';c.fillText(String(slot+1).padStart(2,'0'),73.5,y+27.3);
      c.fillStyle=gun?.health>0?'#a4bd73':gun?'#cf855b':'#83795e';c.beginPath();c.arc(87,y+25,1.7,0,Math.PI*2);c.fill();
    }
    c.textAlign='start';
    if(combat&&combat.health<400){
      const t=combat.elapsedMs/1000;c.save();for(let i=0;i<4;i++){const phase=(t*.4+i*.26)%1;c.globalAlpha=(1-phase)*.2;c.fillStyle='#363b32';c.beginPath();c.ellipse(42+Math.sin(i*5+phase)*7,178-phase*60,4+phase*9,6+phase*14,0,0,Math.PI*2);c.fill();}c.restore();
    }
  }
  soldier(c,enemy,time,dead=false,elapsedMs=0) {
    if(!enemy.name.startsWith('Soldat')){this.vehicle(c,enemy,time,dead,elapsedMs);return;}
    const p=simToDesign(enemy);
    const index=dead?(enemy.ttl>DEATH_MS*.5?6:7):enemy.state==='move'?Math.floor(time*9+enemy.id)%4:enemy.attackFlash>0?5:4;
    const layout=soldierLayout(this.assets.art,enemy,index),{h}=layout;
    c.save();c.translate(p.x,p.y);this.contactShadow(c,15,4);
    const reaction=enemyFeedback(enemy,elapsedMs,dead,this.reducedMotion);
    if(dead)this.destruction(c,enemy,reaction,17);
    c.translate(0,reaction.sink);c.rotate(reaction.lean);
    if(dead)c.globalAlpha=Math.min(1,enemy.ttl/110);
    this.enemySprite(c,layout,enemy,elapsedMs,dead);
    if(!dead)this.hitFeedback(c,enemy,elapsedMs,0,-h*.55);
    c.restore();
  }
  vehicle(c,e,time,dead,elapsedMs=0) {
    const p=simToDesign(e),layout=vehicleLayout(this.assets.art,e),{w,h}=layout;
    c.save();c.translate(p.x,p.y);if(dead)c.globalAlpha=.28+.4*Math.max(0,Math.min(1,e.ttl/DEATH_MS));
    const drive=vehicleMotion(e,dead,this.reducedMotion);
    if(drive.moving)this.vehicleDust(c,e,drive,layout);
    this.vehicleContactShadow(c,e,layout);
    const reaction=enemyFeedback(e,elapsedMs,dead,this.reducedMotion);
    if(dead)this.destruction(c,e,reaction,w*.45);
    c.translate(0,reaction.sink);c.rotate(reaction.lean);
    this.enemySprite(c,layout,e,elapsedMs,dead,drive.bob);
    const attack=enemyAttackFeedback(e,elapsedMs,this.reducedMotion);
    if(!dead&&attack.windup>0){
      const tip=VEHICLE_MUZZLES[e.name],mx=layout.x+(tip[0]-layout.b.x)*w/layout.b.width,my=layout.y+(tip[1]-layout.b.y)*h/layout.b.height;
      c.save();c.globalAlpha=.25+attack.windup*.45;c.strokeStyle='#edba64';c.lineWidth=1.1;c.beginPath();
      c.arc(mx,my,6,Math.PI*.15,Math.PI*.15+attack.windup*Math.PI*1.7);c.stroke();c.restore();
    }
    if(!dead&&!this.reducedMotion)this.runningGear(c,e,layout,drive,elapsedMs);
    if(e.health<e.healthMax&&!dead){c.fillStyle='#10251fe8';c.fillRect(-25,-h-9,50,5);c.fillStyle=e.health/e.healthMax<.3?'#ef995d':'#e6c879';c.fillRect(-24,-h-8,48*e.health/e.healthMax,3);}
    if(e.health/e.healthMax<.3||dead){for(let i=0;i<3;i++){c.globalAlpha=.25;this.vfx(c,4,i*8-5,-h-((time*28+i*15)%35),20+i*6);}c.globalAlpha=dead?Math.min(1,e.ttl/150):1;this.vfx(c,2,8,-h*.55,24,28);}
    if(!dead)this.hitFeedback(c,e,elapsedMs,0,-h*.5);c.restore();
  }
  contactShadow(c,width,height) {
    c.fillStyle='rgba(25,31,21,.17)';c.beginPath();c.ellipse(0,1,width,height,0,0,Math.PI*2);c.fill();
    c.fillStyle='rgba(24,30,20,.30)';c.beginPath();c.ellipse(0,1,width*.65,height*.48,0,0,Math.PI*2);c.fill();
  }
  vehicleContactShadow(c,enemy,layout){
    const scale=layout.w/layout.b.width,tracked=!enemy.name.startsWith('BTR');
    c.save();
    for(const [cx,cy,rx,,radius]of VEHICLE_WHEELS[enemy.name]||[]){
      const x=layout.x+(cx-layout.b.x)*scale,y=layout.y+(cy+radius+(tracked?7:0)-layout.b.y)*scale;
      c.fillStyle='rgba(24,29,18,.15)';c.beginPath();c.ellipse(x,y+.2,rx*scale*2,1.7,0,0,Math.PI*2);c.fill();
      c.fillStyle='rgba(20,25,16,.28)';c.beginPath();c.ellipse(x,y+.1,rx*scale*1.35,.7,0,0,Math.PI*2);c.fill();
    }
    c.restore();
  }
  groundScars(c,now){
    const atlas=this.assets.art['battlefield-scars'];c.save();
    for(const scar of this.aftermath.scars){
      const b=atlas.frames[scar.frame],h=scar.width*b.height/b.width*.75;
      c.globalAlpha=Math.min(1,(scar.life-(now-scar.born))/5000)*.6;
      this.sprite(c,'battlefield-scars',b,scar.x-scar.width/2,scar.y-h/2,scar.width,h);
    }
    c.restore();
  }
  wrecks(c,now,settings){
    for(const wreck of [...this.aftermath.wrecks].sort((a,b)=>a.unit.y-b.unit.y)){
      const age=now-wreck.born,envelope=wreckEnvelope(age);if(!envelope.visible)continue;
      const e=wreck.unit,p=simToDesign(e),layout=vehicleLayout(this.assets.art,e);
      c.save();c.translate(p.x,p.y+3);c.globalAlpha=envelope.alpha*.28;this.vehicleContactShadow(c,e,layout);
      for(let i=0;i<3;i++)this.vfx(c,i%2?13:12,-layout.w*.3+i*layout.w*.28,4+(i%2)*3,6+i*2,undefined,e.id+i);
      c.save();c.rotate(.025);this.enemySprite(c,layout,e,now,true);c.restore();
      if(envelope.fire>0){c.globalAlpha=envelope.fire*envelope.alpha*(settings.reducedMotion?.18:.35);
        this.vfx(c,2,5,-layout.h*.45,24,30);}
      for(let i=0;i<3;i++){
        const phase=settings.reducedMotion?.5:((age/1900+i*.32)%1);
        c.globalAlpha=envelope.smoke*envelope.alpha*(1-phase)*.22;
        this.vfx(c,4,i*5-5,-layout.h*.65-phase*30,22+phase*22,26+phase*26);
      }
      c.restore();
    }
  }
  runningGear(c,enemy,layout,drive,elapsedMs) {
    const {b,w,h,x,y}=layout,scale=w/b.width;
    c.save();
    if(this.recentHit(enemy,elapsedMs))c.filter='brightness(1.48) saturate(.7)';
    else if(enemy.health/enemy.healthMax<.8)c.filter='saturate(.7) brightness(.9)';
    // Rotate only audited inner hubs; the painted tire and track silhouette stay fixed.
    for(const [cx,cy,rx,ry,radius]of VEHICLE_WHEELS[enemy.name]||[]){
      const px=x+(cx-b.x)*scale,py=y+(cy-b.y)*scale+drive.bob;
      c.save();c.translate(px,py);c.scale(rx*scale,ry*scale);
      c.beginPath();c.arc(0,0,1,0,Math.PI*2);c.clip();c.rotate(wheelAngle(-drive.roll,radius,scale));
      this.sprite(c,'vehicles-painted',{x:cx-rx,y:cy-ry,width:rx*2,height:ry*2},-1,-1,2,2);
      c.globalAlpha*=.24;c.strokeStyle='#d2bc86';c.lineWidth=.13;c.beginPath();
      c.moveTo(-.65,0);c.lineTo(.65,0);c.moveTo(0,-.65);c.lineTo(0,.65);c.stroke();c.restore();
    }
    if(drive.tracked){
      // Short tread highlights travel inside the lower belt, not over the armor.
      c.beginPath();c.ellipse(w*.13,-h*.075+drive.bob,w*.29,h*.045,0,0,Math.PI*2);c.clip();
      c.strokeStyle='#b5a27b';c.globalAlpha*=.3;c.lineWidth=.7;
      const phase=((drive.distance%5)+5)%5;
      for(let dx=-w*.16+phase;dx<w*.43;dx+=5){c.beginPath();c.moveTo(dx,-h*.11+drive.bob);c.lineTo(dx-1,-h*.025+drive.bob);c.stroke();}
    }
    c.restore();
  }
  vehicleDust(c,enemy,drive,layout) {
    const [cx,cy,,,radius]=VEHICLE_WHEELS[enemy.name].at(-1),scale=layout.w/layout.b.width;
    const rearX=layout.x+(cx-layout.b.x)*scale,rearY=layout.y+(cy+radius+(drive.tracked?7:0)-layout.b.y)*scale;
    c.save();
    for(let i=0;i<5;i++){
      const f=((drive.distance/45+i*.2+enemy.id*.13)%1+1)%1;
      c.globalAlpha=(1-f)*.12;c.fillStyle=i%2?'#cbb084':'#b99566';c.beginPath();
      c.ellipse(rearX+f*22,rearY-f*7,3+f*10,1.5+f*4,0,0,Math.PI*2);c.fill();
    }
    c.restore();
  }
  destruction(c,enemy,reaction,radius) {
    const f=reaction.death,m=this.reducedMotion?.25:1;
    c.save();c.globalAlpha*=Math.max(0,1-f)*.55;
    c.strokeStyle='#d0aa70';c.lineWidth=2;c.beginPath();c.ellipse(0,1,radius*(.6+f*m),4+f*8*m,0,0,Math.PI*2);c.stroke();
    const count=reaction.vehicle?9:5;
    for(let i=0;i<count;i++){
      const a=i*2.399+enemy.id,travel=(5+f*(reaction.vehicle?34:15))*m;
      c.fillStyle=reaction.vehicle&&i%3===0?'#ffce78':'#a88b61';
      this.vfx(c,reaction.vehicle?12:13,Math.cos(a)*travel,-5-Math.abs(Math.sin(a))*travel+f*f*18,4+i%3,4+i%3,a+f*3);
    }
    if(reaction.vehicle){
      c.globalAlpha*=.7;c.fillStyle='#30382e';
      for(let i=0;i<3;i++)this.vfx(c,4,i*9-8,-18-f*30*m-i*7,20+f*25,25+f*25);
      if(f<.45&&!this.reducedMotion){c.globalAlpha*=1-f/.45;this.vfx(c,1,0,-18,40);}
    }
    c.restore();
  }
  recentHit(enemy,elapsedMs) {return Number.isFinite(enemy.hitAt)&&elapsedMs>=enemy.hitAt&&elapsedMs-enemy.hitAt<100;}
  enemySprite(c,layout,enemy,elapsedMs,dead,bob=0) {
    const {key,b,x,y,w,h}=layout;
    const hit=this.recentHit(enemy,elapsedMs);
    const filter=dead&&!enemy.name.startsWith('Soldat')?'saturate(.12) brightness(.45)':hit?(this.reducedMotion?'brightness(1.12)':'brightness(1.48) saturate(.7)')
      :!enemy.name.startsWith('Soldat')&&enemy.health/enemy.healthMax<.8?'saturate(.7) brightness(.9)':'none';
    const density=Math.min(4,Math.max(2,Math.ceil(this.viewport.view.scale*this.viewport.view.dpr))),pad=4;
    const id=[key,b.x,b.y,w,h,density,filter,dead].join(':');
    let cached=this.enemySpriteCache.get(id);
    if(!cached){
      const width=Math.ceil((w+pad*2)*density),height=Math.ceil((h+pad*2)*density);
      const surface=typeof OffscreenCanvas==='function'?new OffscreenCanvas(width,height):Object.assign(document.createElement('canvas'),{width,height});
      const paint=surface.getContext('2d');paint.setTransform(density,0,0,density,0,0);paint.imageSmoothingEnabled=true;paint.imageSmoothingQuality='high';
      // Bake costly alpha edges and damage filters once at display density,
      // rather than making the browser filter each atlas every frame.
      if(!dead){paint.shadowColor='rgba(14,29,20,.82)';paint.shadowBlur=2.2*density;paint.shadowOffsetY=.7*density;}
      paint.filter=filter;paint.drawImage(this.assets.images[key],b.x,b.y,b.width,b.height,pad,pad,w,h);
      cached={surface,width:width/density,height:height/density};
      if(this.enemySpriteCache.size>=128)this.enemySpriteCache.delete(this.enemySpriteCache.keys().next().value);
      this.enemySpriteCache.set(id,cached);
    }
    const recoil=dead?0:enemyAttackFeedback(enemy,elapsedMs,this.reducedMotion).recoil;
    if(recoil>0){
      const top=y-pad+bob,cut=y+h*(enemy.name.startsWith('Rocket')?.4:.48)+bob;
      c.save();c.beginPath();c.rect(x-pad,cut,cached.width,cached.height-(cut-top));c.clip();c.drawImage(cached.surface,x-pad,top,cached.width,cached.height);c.restore();
      c.save();c.beginPath();c.rect(x-pad+recoil,top,cached.width,cut-top);c.clip();c.drawImage(cached.surface,x-pad+recoil,top,cached.width,cached.height);c.restore();
    }else c.drawImage(cached.surface,x-pad,y-pad+bob,cached.width,cached.height);
  }
  hitFeedback(c,enemy,elapsedMs,x,y) {
    if(!this.recentHit(enemy,elapsedMs))return;
    c.save();c.globalAlpha*=.85*(1-(elapsedMs-enemy.hitAt)/100);c.translate(x,y);
    c.strokeStyle='#ffe4a3';c.lineWidth=1.4;c.beginPath();
    for(const [dx,dy]of [[-1,-1],[1,-1],[-1,1],[1,1]]){c.moveTo(dx*4,dy*4);c.lineTo(dx*8,dy*8);}c.stroke();c.restore();
  }
  emplacement(c,d,x,y) {
    const atlas=this.assets.art['defenses-painted'],b=atlas.frames[{Mortar:0,CannonSmall:1,CannonNormal:2,CannonBig:3}[d.name]];
    const scale=Math.min(65/b.width,40/b.height),w=b.width*scale,h=b.height*scale;
    c.save();if(d.health/d.maxHealth<.8)c.filter='saturate(.55) brightness(.8)';
    this.sprite(c,'defenses-painted',b,x-w/2-(d.flash>0?1:0),y-h,w,h);c.restore();
  }
  helicopter(c,x,y,time,gun) {
    const b=this.assets.art['helicopter-body'];c.save();c.translate(x,y);
    c.fillStyle='rgba(35,38,25,.13)';c.beginPath();c.ellipse(0,94,53,7,0,0,Math.PI*2);c.fill();
    // Exclude the old fixed chin barrel while preserving the fuselage and skids.
    c.save();const s=151/b.width;
    if(gun){c.beginPath();c.rect(-92,-24,151,(638-b.y)*s);c.rect(-92,-24+(638-b.y)*s,(1450-b.x)*s,62);c.rect(-92+(1450-b.x)*s,-24+(705-b.y)*s,151,25);c.clip();}
    this.sprite(c,'helicopter-body',b,-92,-24,151,151*b.height/b.width);c.restore();
    if(gun){c.save();c.translate(gun.pivot.x,gun.pivot.y);c.rotate(gun.localAngle);
      if(Math.cos(gun.angle)<0)c.scale(1,-1);
      this.sprite(c,'weapons-equipment',gun.b,-gun.w*.2,gun.drawY,gun.w,gun.h);c.restore();
      c.fillStyle='#514e32';c.beginPath();c.arc(gun.pivot.x,gun.pivot.y,2.5,0,Math.PI*2);c.fill();}
    c.strokeStyle='rgba(43,45,31,.20)';c.lineWidth=3;c.beginPath();c.ellipse(-1,-28,85,8,0,0,Math.PI*2);c.stroke();
    c.save();c.translate(-1,-28);c.scale(1,.10);c.rotate(time*23);c.strokeStyle='rgba(40,43,30,.58)';c.lineWidth=7;c.beginPath();c.moveTo(-86,0);c.lineTo(86,0);c.moveTo(0,-86);c.lineTo(0,86);c.stroke();c.restore();c.restore();
  }
  flash(c,x,y,size) {
    c.save();c.translate(x,y);const glow=c.createRadialGradient(0,0,0,0,0,size*2);glow.addColorStop(0,'#fff8c5');glow.addColorStop(.25,'#ffc04b');glow.addColorStop(1,'#ffab3300');c.fillStyle=glow;c.beginPath();c.arc(0,0,size*2,0,Math.PI*2);c.fill();c.restore();
  }
  effects(c,combat,settings) {
    c.save();c.lineWidth=1.1;
    for(const trace of combat.traces){
      const from=muzzlePoint(this.assets.art,combat,trace,settings.reducedMotion,simToDesign(trace.from),this.helicopterAim),to=simToDesign(trace.to),fade=Math.min(1,trace.ttl/65);
      // Explosive rounds already have moving projectiles; only show their launch flash.
      const explosive=trace.weapon&&!['Cannon','MashineGun','Maxim','SoldatAK','BTR','BTRLite'].includes(trace.weapon);
      c.globalAlpha=fade*(trace.enemy?.4:.65);c.strokeStyle=trace.enemy?'#eeb56e':'#ffd578';c.lineWidth=trace.player?2:1;
      if(!explosive){c.beginPath();c.moveTo(from.x,from.y);c.lineTo(to.x,to.y);c.stroke();
        if(trace.player){c.strokeStyle='#fff6d9';c.lineWidth=.7;c.stroke();}}
      {
        const heavy=!['MashineGun','Maxim','SoldatAK','BTR','BTRLite'].includes(trace.weapon),size=settings.reducedMotion?3:heavy?9:5;
        if(!this.seenMuzzles.has(trace)){this.seenMuzzles.add(trace);this.muzzleSmoke.push({...from,born:combat.elapsedMs,life:heavy?480:220,trail:false});}
        this.flash(c,from.x,from.y,size*(trace.player?.5:1));
        const angle=muzzleDirection(combat,trace,settings.reducedMotion,from,to),scale=(settings.reducedMotion?.65:1)*(trace.player?.5:1);
        this.vfx(c,heavy?7:6,from.x,from.y,(heavy?70:42)*scale,(heavy?48:34)*scale,angle,heavy?.14:.27,.56);
      }
    }
    c.globalAlpha=1;
    // Confirm the impact where it happened, even after the cursor has moved on.
    for(const impact of combat.effects){if(!impact.hit||impact.blast||impact.ttl>100)continue;
      const p=simToDesign(impact);c.save();c.translate(p.x,p.y);c.globalAlpha=Math.min(1,impact.ttl/75);c.strokeStyle='#fff2c4';c.lineWidth=1.5;c.beginPath();
      for(const [x,y]of [[-1,-1],[1,-1],[-1,1],[1,1]]){c.moveTo(x*5,y*5);c.lineTo(x*9,y*9);}c.stroke();c.restore();}
    for(const mine of combat.mines){const p=simToDesign(mine),b=this.assets.art['support-equipment'].frames[0],w=17,h=w*b.height/b.width;this.sprite(c,'support-equipment',b,p.x-w/2,p.y-h,w,h);}
    for(const plane of combat.airstrikes){const p=simToDesign(plane),b=this.assets.art['support-equipment'].frames[1],w=95,h=w*b.height/b.width;this.sprite(c,'support-equipment',b,p.x-w/2,p.y-80-h/2,w,h);}
    for(const shot of combat.projectiles){
      let visual=this.projectileVisuals.get(shot);
      if(!visual){visual={origin:muzzlePoint(this.assets.art,combat,shot.source||{},settings.reducedMotion,simToDesign(shot.from),this.helicopterAim),last:null};this.projectileVisuals.set(shot,visual);}
      const p=projectileDisplay(shot,visual.origin),last=visual.last||visual.origin;
      if(visual.previous&&combat.elapsedMs!==visual.previousTime)visual.angle=Math.atan2(p.y-visual.previous.y,p.x-visual.previous.x);
      const angle=visual.angle??Math.atan2(p.y-last.y,p.x-last.x);visual.previous=p;visual.previousTime=combat.elapsedMs;
      const rocket=['Rocket','Bazooka','RocketBig','RocketLite','SoldatBazooka'].includes(shot.type);
      const hostile=!!shot.baseTarget;
      if((rocket||hostile)&&!settings.reducedMotion&&(!visual.last||Math.hypot(p.x-last.x,p.y-last.y)>5)){
        for(let i=0;i<3;i++)this.muzzleSmoke.push({x:last.x+(p.x-last.x)*i/3,y:last.y+(p.y-last.y)*i/3,born:combat.elapsedMs,life:hostile&&!rocket?300:550,trail:true});visual.last=p;
      }
      c.save();c.translate(p.x,p.y);c.rotate(angle);
      if(rocket){c.globalAlpha=.85;this.vfx(c,10,-13,0,30,20);c.globalAlpha=1;}
      else if(hostile){c.globalAlpha=.65;this.vfx(c,14,-5,0,9,6);c.globalAlpha=1;}
      this.vfx(c,rocket?9:8,0,0,rocket?26:shot.type==='Mortar'?22:15);c.restore();
    }
    this.muzzleSmoke=this.muzzleSmoke.filter(p=>combat.elapsedMs-p.born<p.life).slice(-180);
    for(const puff of this.muzzleSmoke){const f=(combat.elapsedMs-puff.born)/puff.life,m=settings.reducedMotion?.2:1;
      c.save();c.globalAlpha=(1-f)*(puff.trail?.38:.28);
      this.vfx(c,15,puff.x+f*5*m,puff.y-f*(puff.trail?10:17)*m,10+f*(puff.trail?22:30),8+f*(puff.trail?16:22));c.restore();}
    for(const blast of combat.effects){if(!blast.blast||this.seenBlasts.has(blast))continue;this.seenBlasts.add(blast);
      this.blastClouds.push({...blast,born:combat.elapsedMs-((blast.duration||250)-blast.ttl)});}
    this.blastClouds=this.blastClouds.filter(b=>combat.elapsedMs-b.born<explosionPresentation(b.kind,0).life).slice(-18);
    for(const blast of this.blastClouds)this.blast(c,blast,settings,combat.elapsedMs-blast.born);
    for(const impact of combat.effects){if(!impact.baseImpact)continue;const p=simToDesign(impact),f=1-impact.ttl/220;
      c.save();c.globalAlpha=(1-f)*.75;this.vfx(c,0,p.x,p.y,impact.damage>=25?32:20);
      c.globalAlpha=(1-f)*.35;this.vfx(c,5,p.x,p.y+5,28+f*20,18+f*10);c.restore();}
    for(const impact of combat.effects){if(impact.hit||impact.blast)continue;
      const p=simToDesign(impact),f=1-Math.min(1,impact.ttl/100);c.save();c.globalAlpha=(1-f)*.35;
      this.vfx(c,5,p.x,p.y+3,14+f*22,10+f*12);c.restore();}
    for(const effect of combat.effects){if(this.seenEffects.has(effect))continue;this.seenEffects.add(effect);const p=simToDesign(effect);for(let i=0;i<7;i++){const a=i*2.399+effect.x;this.particles.push({x:p.x,y:p.y,dx:Math.cos(a)*(5+i*2),dy:-7-Math.abs(Math.sin(a))*18,born:combat.elapsedMs,life:280+i*35,hit:effect.hit});}}
    this.particles=this.particles.filter(p=>combat.elapsedMs-p.born<p.life).slice(-120);
    for(const p of this.particles){const age=combat.elapsedMs-p.born,f=age/p.life,m=settings.reducedMotion ? 0.35 : 1;c.globalAlpha=(1-f)*.7;this.vfx(c,p.hit&&f<.3?14:13,p.x+p.dx*f*m,p.y+p.dy*f*m+f*f*12,Math.max(2,6-f*3),undefined,f*3);}
    if(combat.health<this.lastHealth)this.damageAt=combat.elapsedMs;
    this.lastHealth=combat.health;
    if(this.damageAt!=null&&combat.elapsedMs-this.damageAt<120){c.globalAlpha=.05*(1-(combat.elapsedMs-this.damageAt)/120);c.fillStyle='#db4a32';c.fillRect(0,150,150,318);}
    c.restore();
  }
  blast(c,blast,settings,age=0) {
    const p=simToDesign(blast),{radius:r,t,fire,smoke,travel:m}=explosionPresentation(blast.kind,age,settings.reducedMotion);
    c.save();c.translate(p.x,p.y);
    const wave=Math.min(1,t/.6),growth=1-Math.exp(-t*14);
    c.globalAlpha=Math.max(0,1-t)*.5;c.strokeStyle='#d9b47b';c.lineWidth=3;c.beginPath();c.ellipse(0,8,r*(.3+wave*m),r*(.09+wave*.3*m),0,0,Math.PI*2);c.stroke();
    const size=r*(1+growth*.8),rise=t*r*.16*m;
    // Crossfade painted ignition, fireball and smoke stages instead of gradient balls.
    const frame=Math.min(3,t<.12?t/.12:t<.32?1+(t-.12)/.2:t<.7?2+(t-.32)/.38:3),index=Math.floor(frame),mix=frame-index;
    const opacity=(fire>0?.95:smoke*.75)*(settings.reducedMotion?.65:1);
    c.globalAlpha=opacity*(1-mix);
    this.vfx(c,index,0,-r*.3-rise,size,size,0,.5,.65);
    if(index<3&&mix>0){c.globalAlpha=opacity*mix;this.vfx(c,index+1,0,-r*.3-rise,size,size,0,.5,.65);}
    for(let i=0;i<3;i++){const a=i*2.4+blast.x;c.globalAlpha=smoke*.18;
      this.vfx(c,5,Math.cos(a)*r*wave*.55,8+r*.08*Math.sin(a),r*(.7+wave*.6),r*(.25+wave*.12));}
    if(t<.12&&!settings.reducedMotion){c.globalAlpha=(1-t/.12)*.5;this.flash(c,0,-r*.15,r*.55);}
    if(t<.9&&!settings.reducedMotion)for(let i=0;i<14;i++){
      const a=i*2.399+blast.x,speed=r*(.7+(i%4)*.22),x=Math.cos(a)*speed*t,y=-Math.abs(Math.sin(a))*speed*t+t*t*r*.9;
      c.globalAlpha=Math.max(0,1-t/.9)*.85;this.vfx(c,t<.2?14:i%2?12:13,x,y,5+(i%3)*2,undefined,a+t*5);}
    c.restore();
  }
}
