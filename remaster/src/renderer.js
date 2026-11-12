import { soldierLayout, vehicleLayout, SOLDIER_HEIGHT } from './sprite-layout.js';
import { simToDesign, DEATH_MS } from './combat.js';

export class Renderer {
  constructor(canvas, viewport) { this.ctx=canvas.getContext('2d');this.viewport=viewport;this.assets=null;this.lastCombat=null; }
  setAssets(assets) { this.assets=assets;this.enemySpriteCache=new Map(); }
  sprite(c,key,b,x,y,w,h) { c.drawImage(this.assets.images[key],b.x,b.y,b.width,b.height,x,y,w,h); }
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
    if(this.lastCombat!==combat){this.lastCombat=combat;this.particles=[];this.seenEffects=new WeakSet();this.lastHealth=combat?.health??800;this.damageAt=null;}
    this.base(c,combat&&scene!=='menu'?combat:null);
    const motion=settings.reducedMotion?0:encounter?combat.elapsedMs/1000:time;
    if(encounter){
      for(const corpse of combat.corpses)this.soldier(c,corpse,motion,true,combat.elapsedMs);
      for(const enemy of [...combat.enemies].sort((a,b)=>a.y-b.y))this.soldier(c,enemy,motion,false,combat.elapsedMs);
      const heli=simToDesign({x:combat.helicopter.x+40,y:combat.helicopter.y+100});
      c.save();c.translate(heli.x,heli.y-95);c.rotate(settings.reducedMotion?0:combat.helicopter.tilt*Math.PI/180*.4);this.helicopter(c,0,0,motion);c.restore();
      this.effects(c,combat,settings);
    }else this.helicopter(c,265,153+Math.sin(motion*1.4)*2,motion);
    c.restore();
    if(scene==='combat'&&pointer.inside&&pointer.battlefield){
      const hit=combat.effects.some(e=>e.hit&&e.ttl>25);c.save();c.translate(pointer.x,pointer.y);
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
        if(gun.flash>0)this.flash(c,137,y-11,6);
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
    if(dead)c.globalAlpha=Math.min(1,enemy.ttl/110);
    this.enemySprite(c,layout,enemy,elapsedMs,dead);
    if(enemy.attackFlash>0&&!dead){const scale=SOLDIER_HEIGHT/37;this.flash(c,-21*scale,-21*scale,5);}
    if(!dead)this.hitFeedback(c,enemy,elapsedMs,0,-h*.55);
    c.restore();
  }
  vehicle(c,e,time,dead,elapsedMs=0) {
    const p=simToDesign(e),layout=vehicleLayout(this.assets.art,e),{w,h}=layout;
    c.save();c.translate(p.x,p.y);if(dead)c.globalAlpha=Math.min(1,e.ttl/150);
    this.contactShadow(c,w*.43,6);
    const bob=e.state==='move'&&!dead?Math.sin(time*19+e.id)*.45:0;
    this.enemySprite(c,layout,e,elapsedMs,dead,bob);
    if(e.health<e.healthMax&&!dead){c.fillStyle='#10251fe8';c.fillRect(-25,-h-9,50,5);c.fillStyle=e.health/e.healthMax<.3?'#ef995d':'#e6c879';c.fillRect(-24,-h-8,48*e.health/e.healthMax,3);}
    if(e.health/e.healthMax<.3||dead){for(let i=0;i<3;i++){c.globalAlpha=.25;c.fillStyle='#343a33';c.beginPath();c.arc(i*8-5,-h-((time*28+i*15)%35),7+i*3,0,Math.PI*2);c.fill();}c.globalAlpha=dead?Math.min(1,e.ttl/150):1;this.flash(c,8,-h*.55,7);}
    if(e.attackFlash>0&&!dead)this.flash(c,-w/2,-h*.65,8);
    if(!dead)this.hitFeedback(c,e,elapsedMs,0,-h*.5);c.restore();
  }
  contactShadow(c,width,height) {
    c.fillStyle='rgba(25,31,21,.17)';c.beginPath();c.ellipse(0,1,width,height,0,0,Math.PI*2);c.fill();
    c.fillStyle='rgba(24,30,20,.30)';c.beginPath();c.ellipse(0,1,width*.65,height*.48,0,0,Math.PI*2);c.fill();
  }
  recentHit(enemy,elapsedMs) {return Number.isFinite(enemy.hitAt)&&elapsedMs>=enemy.hitAt&&elapsedMs-enemy.hitAt<100;}
  enemySprite(c,layout,enemy,elapsedMs,dead,bob=0) {
    const {key,b,x,y,w,h}=layout;
    const hit=this.recentHit(enemy,elapsedMs);
    const filter=hit?(this.reducedMotion?'brightness(1.12)':'brightness(1.48) saturate(.7)')
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
    c.drawImage(cached.surface,x-pad,y-pad+bob,cached.width,cached.height);
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
  helicopter(c,x,y,time) {
    const b=this.assets.art['helicopter-body'];c.save();c.translate(x,y);
    c.fillStyle='rgba(35,38,25,.13)';c.beginPath();c.ellipse(0,94,53,7,0,0,Math.PI*2);c.fill();
    this.sprite(c,'helicopter-body',b,-92,-24,151,151*b.height/b.width);
    c.strokeStyle='rgba(43,45,31,.20)';c.lineWidth=3;c.beginPath();c.ellipse(-1,-28,85,8,0,0,Math.PI*2);c.stroke();
    c.save();c.translate(-1,-28);c.scale(1,.10);c.rotate(time*23);c.strokeStyle='rgba(40,43,30,.58)';c.lineWidth=7;c.beginPath();c.moveTo(-86,0);c.lineTo(86,0);c.moveTo(0,-86);c.lineTo(0,86);c.stroke();c.restore();c.restore();
  }
  flash(c,x,y,size) {
    c.save();c.translate(x,y);const glow=c.createRadialGradient(0,0,0,0,0,size*2);glow.addColorStop(0,'#fff8c5');glow.addColorStop(.25,'#ffc04b');glow.addColorStop(1,'#ffab3300');c.fillStyle=glow;c.beginPath();c.arc(0,0,size*2,0,Math.PI*2);c.fill();c.restore();
  }
  effects(c,combat,settings) {
    c.save();c.lineWidth=1.1;
    for(const trace of combat.traces){const from=simToDesign(trace.from),to=simToDesign(trace.to);c.globalAlpha=Math.min(1,trace.ttl/65)*.5;c.strokeStyle=trace.enemy?'#eeb56e':'#ffe3a0';c.beginPath();c.moveTo(from.x,from.y);c.lineTo(to.x,to.y);c.stroke();if(!trace.enemy)this.flash(c,from.x,from.y,4);}
    c.globalAlpha=1;
    for(const mine of combat.mines){const p=simToDesign(mine),b=this.assets.art['support-equipment'].frames[0],w=17,h=w*b.height/b.width;this.sprite(c,'support-equipment',b,p.x-w/2,p.y-h,w,h);}
    for(const plane of combat.airstrikes){const p=simToDesign(plane),b=this.assets.art['support-equipment'].frames[1],w=95,h=w*b.height/b.width;this.sprite(c,'support-equipment',b,p.x-w/2,p.y-80-h/2,w,h);}
    for(const shot of combat.projectiles){const p=simToDesign(shot);this.flash(c,p.x,p.y,3);c.fillStyle='#f9dda3';c.fillRect(p.x-4,p.y-1,7,2);}
    for(const blast of combat.effects.filter(e=>e.blast)){const p=simToDesign(blast);c.globalAlpha=Math.min(1,blast.ttl/250)*.35;this.flash(c,p.x,p.y,blast.ttl>300?85:22);c.globalAlpha=1;}
    for(const effect of combat.effects){if(this.seenEffects.has(effect))continue;this.seenEffects.add(effect);const p=simToDesign(effect);for(let i=0;i<7;i++){const a=i*2.399+effect.x;this.particles.push({x:p.x,y:p.y,dx:Math.cos(a)*(5+i*2),dy:-7-Math.abs(Math.sin(a))*18,born:combat.elapsedMs,life:280+i*35,hit:effect.hit});}}
    this.particles=this.particles.filter(p=>combat.elapsedMs-p.born<p.life).slice(-120);
    for(const p of this.particles){const age=combat.elapsedMs-p.born,f=age/p.life,m=settings.reducedMotion ? 0.35 : 1;c.globalAlpha=(1-f)*.7;c.fillStyle=p.hit&&f<.3?'#fff3bc':'#d7b17c';c.beginPath();c.arc(p.x+p.dx*f*m,p.y+p.dy*f*m+f*f*12,Math.max(.5,2.3-f*1.5),0,Math.PI*2);c.fill();}
    if(combat.health<this.lastHealth&&settings.shake==='low'&&!settings.reducedMotion)this.damageAt=combat.elapsedMs;
    this.lastHealth=combat.health;
    if(this.damageAt!=null&&combat.elapsedMs-this.damageAt<120){c.globalAlpha=.05*(1-(combat.elapsedMs-this.damageAt)/120);c.fillStyle='#db4a32';c.fillRect(0,150,150,318);}
    c.restore();
  }
}
