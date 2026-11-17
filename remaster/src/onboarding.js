import {designToSim} from './combat.js';
import {tutorialCardPosition} from './tutorial-layout.js';

export const STORY_PANELS=[
  {title:'EVACUATE',caption:'Families are leaving their homes. The last evacuation trucks need this mountain road to reach safety.'},
  {title:'ENEMY ADVANCING',caption:'Enemy tanks and infantry are pushing toward the pass. If they reach the road, the evacuation stops.'},
  {title:'HOLD THE LINE',caption:'Your helicopter and outpost are the final defense. Hold the line until everyone is clear.'}
];
const LESSONS={
  position:['Prepare the line.','Click the first defense position.'],
  build:['Cover the road.','Place a machine gun. This one is free.'],
  mine:['Lay a trap.','Select the mine below. Your first mine is free.'],
  place:['Choose your ground.','Click the highlighted ground to place your mine.'],
  weapons:['Know your gunship.','Open the weapons tray below.'],
  ready:['Your arsenal is here.','You can buy and switch weapons here during battle.'],
  repair:['Keep the base standing.','Click + to repair your base. This first repair is free.']
};
export class Onboarding {
  constructor(scenes){this.scenes=scenes;this.step=null;}
  begin(){this.step=null;this.scenes.campaign.introStage='story';this.save();this.scenes.go('story');}
  save(){this.scenes.store.saveCheckpoint(this.scenes.campaign);}
  finishStory(){this.scenes.campaign.introStage='tutorial';this.save();this.scenes.prepare();this.scenes.startCombat();}
  story(){return `<section class="story-screen story-triptych" role="dialog" aria-modal="true" aria-labelledby="story-title"><div class="story-art" role="img" aria-label="Civilians evacuate the valley, enemy armor advances, and the helicopter defends the last outpost."><span style="--beat:0"></span><span style="--beat:1"></span><span style="--beat:2"></span></div><div class="story-shade"></div><h2 class="story-brand" id="story-title">HELICOPTER: LAST STAND</h2><div class="story-beats">${STORY_PANELS.map((panel,i)=>`<div style="--beat:${i}"><strong>${panel.title}</strong><p>${panel.caption}</p></div>`).join('')}</div><div class="story-action"><button class="primary" data-action="story-deploy" data-initial-focus>Defend the outpost <span aria-hidden="true">→</span></button></div></section>`;}
  start(){
    const s=this.scenes;if(s.campaign.introStage!=='tutorial'||s.combat.wave!==1)return;
    this.step='position';s.combat.helicopter={x:130,y:160,tilt:0};s.combat.tutorialDefenseAvailable=true;s.combat.tutorialMineAvailable=true;
  }
  allowed(action,button){
    if(!this.step||this.scenes.name!=='combat')return true;
    if(['tutorial-skip','toggle-mute'].includes(action))return true;
    return this.step==='position'&&action==='emplacement'&&button.dataset.slot==='0'
      ||this.step==='build'&&action==='live-defense'&&button.dataset.name==='Maxim'
      ||this.step==='mine'&&action==='arm'&&button.dataset.name==='Mine'
      ||this.step==='weapons'&&action==='weapon-tray'
      ||this.step==='repair'&&action==='repair-base'
      ||this.step==='ready'&&action==='tutorial-finish';
  }
  sync(){
    const s=this.scenes;
    if(this.step==='position'&&s.livePanel?.kind==='defense')this.step='build';
    else if(this.step==='build'&&s.combat.defenses[0]?.name==='Maxim'){this.step='mine';s.livePanel=null;s.panelSignature=null;}
    else if(this.step==='mine'&&s.combat.armed==='Mine')this.step='place';
    else if(this.step==='weapons'&&s.livePanel?.kind==='weapons')this.step='ready';
  }
  capture(event){
    if(!this.step||this.scenes.name!=='combat')return false;
    const button=event.target.closest('[data-action]');
    if(button&&this.allowed(button.dataset.action,button))return false;
    if(this.step==='place'&&event.target.id==='world'&&event.button===0){
      const viewport=this.scenes.ui.parentElement,rect=viewport.getBoundingClientRect(),style=getComputedStyle(viewport),scale=parseFloat(style.getPropertyValue('--u'))||1;
      const p={x:(event.clientX-rect.left-(parseFloat(style.getPropertyValue('--field-x'))||0))/scale,y:(event.clientY-rect.top-(parseFloat(style.getPropertyValue('--field-y'))||0))/scale};
      if(p.x>=260&&p.x<=875&&p.y>=270&&p.y<=450&&this.scenes.combat.deploy(designToSim(p))){this.scenes.combat.drainEvents();this.scenes.audio.click();this.step='weapons';this.scenes.render(false);}
    }
    this.scenes.input.clear();event.preventDefault();event.stopPropagation();return true;
  }
  finish(){
    if(this.step==='repair'){
      const s=this.scenes;this.step=null;s.combat.tutorialRepairAvailable=false;s.combat.checkpoint.repairTutorialSeen=true;
      s.campaign=structuredClone(s.combat.checkpoint);this.save();s.input.clear();s.clock.reset();s.render(false);return;
    }
    const s=this.scenes;this.step=null;s.combat.tutorialDefenseAvailable=false;s.combat.tutorialMineAvailable=false;s.combat.armed=null;s.livePanel=null;s.panelSignature=null;
    s.campaign=s.combat.snapshot();s.campaign.introStage='done';s.combat.checkpoint=structuredClone(s.campaign);this.save();s.input.clear();s.clock.reset();s.render(false);
  }
  update(seconds){
    const s=this.scenes;
    if(s.name==='story')return true;
    this.maybeRepairLesson();
    if(this.step&&s.name==='combat'){this.positionArrow();this.positionCard();this.positionArrow();s.input.clear();s.clock.reset();return true;}
    return false;
  }
  maybeRepairLesson(){
    const s=this.scenes,c=s.combat;
    if(this.step||s.name!=='combat'||c?.status!=='running'||c.health<=0||c.health>720||c.checkpoint.introStage!=='done'||c.checkpoint.repairTutorialSeen)return false;
    this.step='repair';c.tutorialRepairAvailable=true;c.armed=null;s.livePanel=null;s.panelSignature=null;s.input.clear();s.render(false);return true;
  }
  decorate(){
    const s=this.scenes;s.ui.dataset.tutorial=this.step&&s.name==='combat'?this.step:'';
    if(!this.step||s.name!=='combat')return;
    const [title,copy]=LESSONS[this.step];
    s.ui.insertAdjacentHTML('beforeend',`${this.step==='place'?'<div class="tutorial-ground" aria-hidden="true"></div>':''}<aside class="tutorial-card" aria-labelledby="tutorial-title"><div class="tutorial-commander" aria-hidden="true"></div><div class="tutorial-copy"><small>COMMANDER · TRAINING</small><h3 id="tutorial-title">${title}</h3><p>${copy}</p>${this.step==='ready'?'<button class="primary" data-action="tutorial-finish" data-initial-focus>Hold the line →</button>':''}<button class="quiet tutorial-skip" data-action="tutorial-skip">Skip tutorial</button></div></aside>`);
    const focus={repair:'[data-action="repair-base"]',position:'[data-action="emplacement"][data-slot="0"]',build:'[data-action="live-defense"][data-name="Maxim"]',mine:'[data-action="arm"][data-name="Mine"]',weapons:'.weapon-tray-toggle',ready:'[data-action="tutorial-finish"]'}[this.step];
    if(focus)s.ui.querySelector(focus)?.focus({preventScroll:true});
    s.ui.insertAdjacentHTML('beforeend','<div class="tutorial-arrow" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><path class="arrow-shadow" d="M32 8v43M17 36l15 15 15-15"/><path class="arrow-gold" d="M32 8v43M17 36l15 15 15-15"/></svg></div>');
    this.positionCard();this.positionArrow();
  }
  positionCard(){
    const ui=this.scenes.ui,card=ui.querySelector('.tutorial-card');if(!card)return;
    const selectors={repair:'[data-action="repair-base"]',position:'[data-action="emplacement"][data-slot="0"]',build:'[data-action="live-defense"][data-name="Maxim"]',mine:'[data-action="arm"][data-name="Mine"]',place:'.tutorial-ground',weapons:'.weapon-tray-toggle',ready:'.weapon-tray'};
    const target=ui.querySelector(selectors[this.step]);if(!target)return;
    const parent=ui.getBoundingClientRect(),u=parseFloat(getComputedStyle(ui).getPropertyValue('--u'))||1;
    const rect=(node,pad=0)=>{const r=node.getBoundingClientRect();return {left:(r.left-parent.left)/u-pad,top:(r.top-parent.top)/u-pad,right:(r.right-parent.left)/u+pad,bottom:(r.bottom-parent.top)/u+pad};};
    const obstacles=[...ui.querySelectorAll('.top-hud,.bottom-hud,.wave-status,.live-upgrade,.emplacement-target,.chopper-target,.tutorial-ground')].map(node=>rect(node,node.classList.contains('chopper-target')?22:8));
    if(this.step!=='ready'){const arrow=ui.querySelector('.tutorial-arrow');if(arrow)obstacles.push(rect(arrow,4));}
    const point=tutorialCardPosition(rect(target),{width:card.offsetWidth/u,height:card.offsetHeight/u},{left:18,top:48,right:parent.width/u-18,bottom:parent.height/u-18},obstacles,['position','build'].includes(this.step)?'right':'above',this.step==='place'||this.step==='ready'?14:64);
    card.style.left=`${point.left*u}px`;card.style.top=`${point.top*u}px`;
  }
  positionArrow(){
    const ui=this.scenes.ui,arrow=ui.querySelector('.tutorial-arrow');if(!arrow)return;
    const selector={repair:'[data-action="repair-base"]',position:'[data-action="emplacement"][data-slot="0"]',build:'[data-action="live-defense"][data-name="Maxim"]',mine:'[data-action="arm"][data-name="Mine"]',place:'.tutorial-ground',weapons:'.weapon-tray-toggle',ready:'[data-action="tutorial-finish"]'}[this.step];
    const target=ui.querySelector(selector);if(!target)return;
    const r=target.getBoundingClientRect(),parent=ui.getBoundingClientRect(),u=parseFloat(getComputedStyle(ui).getPropertyValue('--u'))||1;
    let x=r.left+r.width/2,y=r.top-32*u,angle=0;
    if(['position','build'].includes(this.step)){x=r.right+34*u;y=r.top+r.height/2;angle=90;}
    if(this.step==='place'){x=r.left+r.width/2;y=r.top+r.height/2-34*u;}
    if(this.step==='ready'){x=r.left-34*u;y=r.top+r.height/2;angle=-90;}
    arrow.style.left=`${x-parent.left-24*u}px`;arrow.style.top=`${y-parent.top-24*u}px`;arrow.style.transform=`rotate(${angle}deg)`;
  }
}
