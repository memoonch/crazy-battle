export function enemyAttackFeedback(enemy,now,reducedMotion=false){
 const heavy=/^(Tank|Rocket)/.test(enemy.name),age=now-enemy.lastAttackAt;
 const aiming=heavy&&enemy.state==='attack'&&enemy.health>0;
 const windup=aiming?Math.max(0,Math.min(1,(enemy.counter-(enemy.rate-15))/16)):0;
 const recovery=heavy&&enemy.health>0&&Number.isFinite(age)&&age>=0&&age<220?1-age/220:0;
 return {windup,recovery,recoil:reducedMotion?0:recovery*recovery*(enemy.name.startsWith('Rocket')?1.1:2.2)};
}
