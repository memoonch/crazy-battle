export class Preloader {
  constructor(element){
    this.element=element;this.bar=element.querySelector('[role="progressbar"]');
    this.counter=element.querySelector('#loading-percent');this.message=element.querySelector('#loading-message');this.retry=element.querySelector('#retry');this.percent=0;
  }
  reset(){
    this.percent=0;this.element.hidden=false;this.element.classList.remove('load-failed');this.element.setAttribute('aria-busy','true');
    this.retry.hidden=true;this.message.textContent='Preparing the outpost…';this.setProgress(0,1);
  }
  setProgress(done,total){
    const value=Number.isFinite(done)&&Number.isFinite(total)&&total>0?Math.floor(done/total*100):0;
    this.percent=Math.min(100,Math.max(this.percent,value,0));
    this.element.style.setProperty('--loading-progress',String(this.percent));
    this.bar.setAttribute('aria-valuenow',String(this.percent));this.counter.textContent=this.percent+'%';
  }
  finish(){this.setProgress(1,1);this.element.setAttribute('aria-busy','false');this.element.hidden=true;}
  fail(){
    this.element.classList.add('load-failed');this.element.setAttribute('aria-busy','false');
    this.message.textContent='Unable to load the outpost. Please try again.';this.retry.hidden=false;
  }
}
