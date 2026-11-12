export const ACHIEVEMENTS = Object.freeze([
  {id:'achivementsCombo2',name:'Double strike',mark:'II',description:'Defeat 2 enemies within 300 ms.'},
  {id:'achivementsCombo5',name:'Overwhelming force',mark:'V',description:'Defeat 5 enemies within 300 ms.'},
  {id:'achivementsDefender',name:'Defender',mark:'◇',description:'Clear a wave without the base taking damage.'},
  {id:'achivementsBronze',name:'Bronze service',mark:'5',description:'Complete wave 5.',tone:'bronze'},
  {id:'achivementsSilver',name:'Silver service',mark:'10',description:'Complete wave 10.',tone:'silver'},
  {id:'achivementsGold',name:'Gold service',mark:'20',description:'Complete all 20 waves.',tone:'gold'}
]);
export class AchievementTracker {
  constructor(owned=[]) {this.owned=new Set(owned);this.kills=[];this.baseDamage=0;}
  award(id) {if(this.owned.has(id))return [];this.owned.add(id);return [id];}
  kill(time) {
    this.kills=this.kills.filter(t=>time-t<300);this.kills.push(time);
    return [...(this.kills.length>=2?this.award('achivementsCombo2'):[]),...(this.kills.length>=5?this.award('achivementsCombo5'):[])];
  }
  victory(wave) {
    const ids=this.baseDamage===0?this.award('achivementsDefender'):[];
    const medal={5:'achivementsBronze',10:'achivementsSilver',20:'achivementsGold'}[wave];
    if(medal)ids.push(...this.award(medal));return ids;
  }
}
