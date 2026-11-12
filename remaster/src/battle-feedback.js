export function blastFeedback(blast,reducedMotion=false) {
  const duration=blast.duration||250,progress=Math.max(0,Math.min(1,1-blast.ttl/duration));
  return {progress,fade:1-progress,radius:duration>300?52:24,
    travel:reducedMotion?.25:1};
}
export function battleShake(combat,settings) {
  if(!combat||settings.reducedMotion||settings.shake!=='low')return {x:0,y:0};
  let strength=0;
  for(const effect of combat.effects){if(!effect.blast)continue;
    const age=(effect.duration||250)-effect.ttl;
    strength=Math.max(strength,Math.max(0,1-age/140)*(effect.duration>300?1.4:.8));
  }
  if(!strength)return {x:0,y:0};
  return {x:Math.sin(combat.elapsedMs*.15)*strength,y:Math.cos(combat.elapsedMs*.19)*strength*.6};
}
