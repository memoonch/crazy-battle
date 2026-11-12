import test from 'node:test';
import assert from 'node:assert/strict';
import {SaveStore,newCampaign,SAVE_KEY} from '../src/save.js';
function storage(){const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};}
test('settings in an older tab preserve the latest campaign and backup',()=>{
 const mem=storage(),a=new SaveStore(mem);a.startNew();const b=new SaveStore(mem);
 a.saveCheckpoint({...newCampaign(),wave:8,money:50});a.startNew();a.saveCheckpoint({...newCampaign(),wave:2,money:10});
 b.saveSettings({...b.settings,muted:true});const restored=new SaveStore(mem);
 assert.equal(restored.campaign.wave,2);assert.equal(restored.data.previousCampaign.wave,8);assert.equal(restored.settings.muted,true);
});
test('a campaign save preserves newer sound settings from another tab',()=>{
 const mem=storage(),a=new SaveStore(mem);a.startNew();const b=new SaveStore(mem);
 b.saveSettings({...b.settings,master:33,muted:true});a.saveCheckpoint({...newCampaign(),wave:2});
 assert.equal(new SaveStore(mem).settings.master,33);assert.equal(new SaveStore(mem).settings.muted,true);
});
test('a stale campaign cannot overwrite another tab even after saving settings',()=>{
 const mem=storage(),a=new SaveStore(mem);a.startNew();const b=new SaveStore(mem);
 a.saveCheckpoint({...newCampaign(),wave:5});b.saveSettings({...b.settings,muted:true});
 b.saveCheckpoint({...newCampaign(),wave:2});
 assert.equal(new SaveStore(mem).campaign.wave,5);assert.equal(b.writable,false);assert.match(b.status,/another tab/);assert.equal(b.campaign.wave,2);
});
test('explicit new campaign retains the most recent checkpoint as backup',()=>{
 const mem=storage(),a=new SaveStore(mem);a.startNew();const b=new SaveStore(mem);
 a.saveCheckpoint({...newCampaign(),wave:10});b.startNew();assert.equal(new SaveStore(mem).data.previousCampaign.wave,10);
});
test('unexpectedly replaced save data is preserved rather than overwritten',()=>{
 for(const raw of ['{"version":99,"future":true}','null','{broken']){
  const mem=storage(),a=new SaveStore(mem);a.startNew();mem.setItem(SAVE_KEY,raw);
  a.saveSettings({...a.settings,muted:true});assert.equal(mem.getItem(SAVE_KEY),raw);assert.equal(a.writable,false);
 }
});
