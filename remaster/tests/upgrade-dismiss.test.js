import test from 'node:test';
import assert from 'node:assert/strict';
import {Scenes} from '../src/scenes.js';
test('outside primary press dismisses either upgrade panel and consumes the shot gesture',()=>{
  for(const name of ['combat','preparation'])for(const kind of ['weapons','defense']){
    let clears=0,refreshes=0,prevented=0,stopped=0;
    const scene={name,livePanel:{kind},panelSignature:'old',input:{clear(){clears++;}},refreshLivePanel(){refreshes++;}};
    const event={button:0,target:{closest:()=>null},preventDefault(){prevented++;},stopPropagation(){stopped++;}};
    assert.equal(Scenes.prototype.dismissUpgradeOutside.call(scene,event),true);
    assert.equal(scene.livePanel,null);assert.equal(scene.panelSignature,null);
    assert.deepEqual([clears,refreshes,prevented,stopped],[1,1,1,1]);
  }
});
test('inside controls, panel switches and secondary clicks remain usable',()=>{
  const panel={kind:'weapons'},scene={name:'combat',livePanel:panel};
  for(const event of [{button:0,target:{closest:()=>({})}},{button:2,target:{closest:()=>null}}]){
    assert.equal(Scenes.prototype.dismissUpgradeOutside.call(scene,event),false);assert.equal(scene.livePanel,panel);
  }
});
