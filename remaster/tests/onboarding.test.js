import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Onboarding,STORY_PANELS} from '../src/onboarding.js';
import {Combat,designToSim} from '../src/combat.js';
import {newCampaign,SaveStore,validCampaign} from '../src/save.js';
const balance=JSON.parse(fs.readFileSync(new URL('../../docs/reference/balance.json',import.meta.url)));
function setup(){
  const values=new Map(),store=new SaveStore({getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)});
  const s={ui:{querySelector:()=>null},store,campaign:store.startNew(),name:'menu',input:{clear(){}},clock:{reset(){}},render(){},go(name){this.name=name;},prepare(){this.combat=new Combat(balance,this.campaign,42);this.name='preparation';},startCombat(){this.combat.start();this.name='combat';this.onboarding.start();}};
  s.onboarding=new Onboarding(s);return s;
}
test('triptych stays on screen until its single button starts the guided first wave',()=>{
  const s=setup(),o=s.onboarding;o.begin();assert.equal(STORY_PANELS.length,3);
  assert.equal(s.name,'story');assert.equal(s.store.campaign.introStage,'story');
  o.update(60);assert.equal(s.name,'story');
  const markup=o.story();assert.equal((markup.match(/<button/g)||[]).length,1);assert.ok(!markup.includes('Skip story'));
  o.finishStory();assert.equal(s.name,'combat');assert.equal(o.step,'position');assert.equal(s.store.campaign.introStage,'tutorial');
  assert.ok(validCampaign(s.store.campaign));assert.ok(validCampaign(newCampaign()));
});
test('guided defense and mine are free once, freeze the wave, and save completion',()=>{
  const s=setup(),o=s.onboarding;o.begin();o.finishStory();s.name='combat';s.combat.start();o.start();
  const c=s.combat,elapsed=c.elapsedMs;assert.equal(o.step,'position');assert.equal(o.update(10),true);assert.equal(c.elapsedMs,elapsed);
  assert.equal(o.allowed('emplacement',{dataset:{slot:'1'}}),false);assert.equal(o.allowed('emplacement',{dataset:{slot:'0'}}),true);
  s.livePanel={kind:'defense',slot:0};o.sync();assert.equal(o.step,'build');
  assert.equal(c.replacementPrice(0,'Maxim'),0);assert.equal(c.replacementPrice(1,'Maxim'),5);
  assert.equal(c.replaceDefense(0,'Maxim'),true);assert.equal(c.tutorialDefenseAvailable,false);assert.equal(c.money,0);assert.equal(c.spent,0);
  o.sync();assert.equal(o.step,'mine');assert.equal(c.supportPrice('Mine'),0);
  c.arm('Mine');o.sync();assert.equal(o.step,'place');assert.equal(c.deploy(designToSim({x:600,y:350})),true);
  assert.equal(c.mines.length,1);assert.equal(c.money,0);assert.equal(c.spent,0);assert.equal(c.supportPrice('Mine'),10);
  o.step='weapons';s.livePanel={kind:'weapons'};o.sync();assert.equal(o.step,'ready');
  assert.equal(o.allowed('live-weapon',{dataset:{name:'Rocket'}}),false);
  o.finish();assert.equal(o.step,null);assert.equal(s.store.campaign.introStage,'done');assert.equal(c.checkpoint.introStage,'done');assert.equal(o.update(.1),false);
  assert.equal(c.defenses[0].name,'Maxim');assert.equal(c.tutorialMineAvailable,false);
});
test('existing campaigns bypass training; grants never make later waves free',()=>{
  const s=setup();s.prepare();s.name='combat';s.combat.start();s.onboarding.start();assert.equal(s.onboarding.step,null);
  const c=new Combat(balance,{...newCampaign(),wave:2},42);c.tutorialMineAvailable=true;c.tutorialDefenseAvailable=true;
  assert.equal(c.supportPrice('Mine'),10);assert.equal(c.replacementPrice(0,'Maxim'),5);
});
test('tutorial can be skipped cleanly and does not block the pause menu after focus loss',()=>{
  const s=setup(),o=s.onboarding;o.begin();o.finishStory();s.name='combat';s.combat.start();o.start();
  s.name='pause';assert.equal(o.allowed('resume',{dataset:{}}),true);s.name='combat';o.finish();
  assert.equal(s.combat.tutorialDefenseAvailable,false);assert.equal(s.combat.tutorialMineAvailable,false);assert.equal(s.store.campaign.introStage,'done');
});
