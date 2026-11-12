import { DEATH_MS } from './combat.js';

// Presentation only: simulation time freezes these envelopes during pause.
export function enemyFeedback(enemy, elapsedMs, dead, reducedMotion) {
  const vehicle=!enemy.name.startsWith('Soldat'),age=elapsedMs-enemy.hitAt;
  const hit=Number.isFinite(age)&&age>=0&&age<140?1-age/140:0;
  const death=dead?Math.max(0,Math.min(1,1-enemy.ttl/DEATH_MS)):0;
  return {vehicle,hit,death,
    lean:reducedMotion?0:dead?(vehicle?.025:.13)*Math.sin(death*Math.PI/2):hit*(vehicle?.012:.035),
    sink:reducedMotion?0:dead?death*(vehicle?3:5):0};
}
