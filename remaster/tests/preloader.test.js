import test from 'node:test';
import assert from 'node:assert/strict';
import {Preloader} from '../src/preloader.js';
function setup(){
  const attributes=new Map(),classes=new Set(),styles=new Map();
  const bar={setAttribute:(k,v)=>attributes.set(k,v)},counter={},message={},retry={};
  const element={hidden:true,style:{setProperty:(k,v)=>styles.set(k,v)},classList:{add:k=>classes.add(k),remove:k=>classes.delete(k)},setAttribute:(k,v)=>attributes.set(k,v),querySelector:s=>({'[role="progressbar"]':bar,'#loading-percent':counter,'#loading-message':message,'#retry':retry}[s])};
  return {loader:new Preloader(element),element,attributes,classes,styles,counter,retry};
}
test('loading progress never moves backwards or exceeds 100 and finish hides the screen',()=>{
  const s=setup();s.loader.reset();assert.equal(s.counter.textContent,'0%');assert.equal(s.element.hidden,false);
  s.loader.setProgress(12,21);assert.equal(s.counter.textContent,'57%');assert.equal(s.attributes.get('aria-valuenow'),'57');
  s.loader.setProgress(1,21);assert.equal(s.counter.textContent,'57%');
  s.loader.setProgress(500,21);assert.equal(s.counter.textContent,'100%');s.loader.finish();assert.equal(s.element.hidden,true);assert.equal(s.attributes.get('aria-busy'),'false');
});
test('failure exposes retry and reset restarts progress and the running state',()=>{
  const s=setup();s.loader.reset();s.loader.setProgress(8,21);s.loader.fail();
  assert.equal(s.retry.hidden,false);assert.ok(s.classes.has('load-failed'));assert.equal(s.element.hidden,false);
  s.loader.reset();assert.equal(s.retry.hidden,true);assert.equal(s.counter.textContent,'0%');assert.equal(s.classes.has('load-failed'),false);assert.equal(s.attributes.get('aria-busy'),'true');
});
