import {equipmentArt} from './equipment-art.js';
import {simToDesign} from './combat.js';

// Presentation only: rewards are credited once by combat, never by animation callbacks.
export function supplyPickupFrames(from,to,reduced=false) {
  const at=(x,y,scale=1)=>`translate(${x}px,${y}px) scale(${scale})`;
  if(reduced)return [{transform:at(to.x,to.y),opacity:0},{transform:at(to.x,to.y),opacity:1,offset:.4},{transform:at(to.x,to.y),opacity:0}];
  return [
    {transform:at(from.x,from.y-15,.65),opacity:0},
    {transform:at(from.x,from.y-22,1.1),opacity:1,offset:.12},
    {transform:at(from.x,from.y,1),opacity:1,offset:.25},
    {transform:at(from.x,from.y-5,1),opacity:1,offset:.34},
    {transform:at(from.x+(to.x-from.x)*.35,from.y+(to.y-from.y)*.55-35,.85),opacity:1,offset:.65},
    {transform:at(to.x,to.y,.4),opacity:0}
  ];
}

export class SupplyPickups {
  constructor(ui,art){this.ui=ui;this.art=art;this.active=new Set();}
  clear(){for(const item of this.active){item.animation.cancel();item.node.remove();}this.active.clear();}
  drop(event,reduced=false){
    if(!(event.money>0))return;
    const viewport=this.ui.parentElement,target=this.ui.querySelector('.money>.equipment-art');
    if(!target)return;
    if(this.active.size>=32){const oldest=this.active.values().next().value;oldest.animation.cancel();oldest.node.remove();this.active.delete(oldest);}
    const rect=viewport.getBoundingClientRect(),goal=target.getBoundingClientRect(),style=getComputedStyle(viewport);
    const scale=parseFloat(style.getPropertyValue('--u'))||1,p=simToDesign(event);
    const from={x:(parseFloat(style.getPropertyValue('--field-x'))||0)+p.x*scale,y:(parseFloat(style.getPropertyValue('--field-y'))||0)+(p.y-8)*scale};
    const to={x:goal.left-rect.left+goal.width/2,y:goal.top-rect.top+goal.height/2};
    const node=document.createElement('div');node.className='supply-pickup';node.setAttribute('aria-hidden','true');node.innerHTML=equipmentArt(this.art,'Supplies');viewport.append(node);
    const animation=node.animate(supplyPickupFrames(from,to,reduced),{duration:reduced?240:1100,easing:'linear',fill:'forwards'}),item={node,animation};this.active.add(item);
    animation.onfinish=()=>{node.remove();this.active.delete(item);const current=this.ui.querySelector('.money>.equipment-art');current?.animate([{filter:'brightness(1)'},{filter:'brightness(1.8)',offset:.3},{filter:'brightness(1)'}],{duration:240});};
  }
}
