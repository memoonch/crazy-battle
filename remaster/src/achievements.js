export const ACHIEVEMENTS = Object.freeze([
  {id:'achivementsCombo2',name:'Rapid assault',medal:0,description:'Defeat 4 enemies within 2 seconds.'},
  {id:'achivementsCombo5',name:'Overwhelming force',medal:1,description:'Defeat 8 enemies within 3 seconds.'},
  {id:'achivementsDefender',name:'Defender',medal:2,description:'Clear a wave without the base taking damage.'},
  {id:'achivementsBronze',name:'Bronze service',medal:3,description:'Complete wave 5.'},
  {id:'achivementsSilver',name:'Silver service',medal:4,description:'Complete wave 10.'},
  {id:'achivementsGold',name:'Gold service',medal:5,description:'Complete all 20 waves.'},
  {id:'honorFirstBlood',name:'First blood',medal:6,description:'Defeat your first enemy.'},
  {id:'honorBlitz',name:'Blitz',medal:7,description:'Defeat 10 enemies within 3 seconds.'},
  {id:'honorFrontline',name:'Frontline veteran',medal:8,description:'Defeat 25 enemies in one wave.'},
  {id:'honorArmorHunter',name:'Armor hunter',medal:9,description:'Destroy 5 enemy vehicles in one wave.'},
  {id:'honorFortress',name:'Iron fortress',medal:10,description:'Clear wave 10 or later without base damage.'},
  {id:'honorLastStand',name:'Last stand',medal:11,description:'Clear a wave with 25% base health or less.'}
]);
export class AchievementTracker {
  constructor(owned=[]) {this.owned=new Set(owned);this.kills=[];this.baseDamage=0;this.waveKills=0;this.vehicleKills=0;}
  award(id) {if(this.owned.has(id))return [];this.owned.add(id);return [id];}
  kill(time,enemy) {
    this.kills=this.kills.filter(t=>time-t<3000);this.kills.push(time);this.waveKills++;
    if(enemy&&!enemy.name.startsWith('Soldat'))this.vehicleKills++;
    const ids=this.award('honorFirstBlood');
    if(this.kills.filter(t=>time-t<2000).length>=4)ids.push(...this.award('achivementsCombo2'));
    if(this.kills.length>=8)ids.push(...this.award('achivementsCombo5'));
    if(this.kills.length>=10)ids.push(...this.award('honorBlitz'));
    if(this.waveKills>=25)ids.push(...this.award('honorFrontline'));
    if(this.vehicleKills>=5)ids.push(...this.award('honorArmorHunter'));
    return ids;
  }
  victory(wave,health=800) {
    const ids=this.baseDamage===0?this.award('achivementsDefender'):[];
    const medal={5:'achivementsBronze',10:'achivementsSilver',20:'achivementsGold'}[wave];
    if(medal)ids.push(...this.award(medal));
    if(wave>=10&&this.baseDamage===0)ids.push(...this.award('honorFortress'));
    if(health>0&&health<=200)ids.push(...this.award('honorLastStand'));
    return ids;
  }
}
