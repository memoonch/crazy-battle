import {ACHIEVEMENTS} from './achievements.js';
import {medalArt} from './equipment-art.js';

export const MEDAL_SHOW_SECONDS=2.5, MEDAL_GAP_SECONDS=.35;
export class MedalQueue {
  constructor(){this.clear();}
  clear(){this.pending=[];this.seen=new Set();this.current=null;this.age=0;this.gap=0;}
  enqueue(id){if(!ACHIEVEMENTS.some(a=>a.id===id)||this.seen.has(id))return;this.seen.add(id);this.pending.push(id);}
  advance(seconds){
    let remaining=Math.max(0,seconds);
    if(this.current){const used=Math.min(remaining,MEDAL_SHOW_SECONDS-this.age);this.age+=used;remaining-=used;if(this.age>=MEDAL_SHOW_SECONDS){this.current=null;this.age=0;this.gap=MEDAL_GAP_SECONDS;}}
    if(!this.current){const used=Math.min(remaining,this.gap);this.gap-=used;remaining-=used;if(this.gap<=0&&this.pending.length){this.current=this.pending.shift();this.age=Math.min(remaining,MEDAL_SHOW_SECONDS);}}
    return this.current;
  }
}

export class MedalReveals {
  constructor(viewport,art,onShow){
    this.art=art;this.onShow=onShow;this.queue=new MedalQueue();this.shown=null;
    this.element=document.createElement('div');this.element.className='medal-reveals';this.element.setAttribute('role','status');this.element.setAttribute('aria-live','polite');this.element.setAttribute('aria-atomic','true');viewport.append(this.element);
  }
  enqueue(id){this.queue.enqueue(id);}
  clear(){this.queue.clear();this.shown=null;this.element.replaceChildren();}
  update(seconds,enabled,reduced){
    this.element.hidden=!enabled;
    this.element.classList.toggle('reveal-reduced',!!reduced);
    this.element.style.setProperty('--reveal-play',enabled?'running':'paused');
    if(!enabled)return;
    const id=this.queue.advance(seconds);
    if(id===this.shown)return;
    this.shown=id;this.element.replaceChildren();
    if(!id)return;
    const award=ACHIEVEMENTS.find(a=>a.id===id);
    this.element.innerHTML=`<div class="medal-reveal"><div class="reveal-medal"><span class="medal-halo" aria-hidden="true"></span>${medalArt(this.art,award)}<span class="medal-glint" aria-hidden="true"></span></div><div class="reveal-copy"><small>HONOR EARNED</small><strong>${award.name}</strong><p>${award.description}</p></div></div>`;
    this.onShow?.(id);
  }
}
