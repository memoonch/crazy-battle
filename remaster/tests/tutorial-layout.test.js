import test from 'node:test';
import assert from 'node:assert/strict';
import {tutorialCardPosition} from '../src/tutorial-layout.js';
const r=(left,top,right,bottom)=>({left,top,right,bottom});
const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
test('commander cards stay clear of the target, HUD, defenses and active panels for all lessons',()=>{
  const common=[r(0,0,960,48),r(0,468,960,540),r(387,43,573,93),r(110,132,320,226),...Array.from({length:5},(_,i)=>r(53,216+i*48,151,273+i*48))];
  const cases=[
    {step:'repair',target:r(195,484,225,525),size:{width:320,height:155},extra:[r(182,420,238,476)],side:'above',gap:64},
    {step:'position',target:r(61,224,143,265),size:{width:320,height:140},extra:[r(153,220,207,274)],side:'right',gap:64},
    {step:'build',target:r(161,140,445,190),size:{width:320,height:140},extra:[r(143,82,463,413),r(455,138,509,192)],side:'right',gap:64},
    {step:'mine',target:r(760,484,800,525),size:{width:320,height:155},extra:[r(752,420,808,476)],side:'above',gap:64},
    {step:'place',target:r(260,270,875,450),size:{width:320,height:155},extra:[r(252,262,883,458)],side:'above',gap:14},
    {step:'weapons',target:r(377,484,583,530),size:{width:320,height:155},extra:[r(452,420,508,476)],side:'above',gap:64},
    {step:'ready',target:r(215,255,745,458),size:{width:360,height:141},extra:[r(207,247,753,466)],side:'above',gap:14}
  ];
  for(const c of cases){
    const obstacles=[...common,...c.extra],p=tutorialCardPosition(c.target,c.size,r(18,48,942,522),obstacles,c.side,c.gap),box=r(p.left,p.top,p.left+c.size.width,p.top+c.size.height);
    assert.ok(box.left>=18&&box.right<=942&&box.top>=48&&box.bottom<=522,c.step+' stays in bounds');
    for(const obstacle of obstacles)assert.equal(overlaps(box,obstacle),false,c.step+' avoids '+JSON.stringify(obstacle));
  }
});
test('a resized viewport moves the card while keeping its protected target clear',()=>{
  const target=r(760,484,800,525),size={width:320,height:145},bounds=r(18,48,942,800),obstacles=[target,r(0,740,960,820)];
  const p=tutorialCardPosition(target,size,bounds,obstacles,'above',64);
  assert.ok(p.left>=18&&p.left+size.width<=942);assert.ok(p.top+size.height<target.top);
});
