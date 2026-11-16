import test from 'node:test';
import assert from 'node:assert/strict';
import {MedalQueue,MEDAL_SHOW_SECONDS,MEDAL_GAP_SECONDS} from '../src/medal-reveal.js';
test('simultaneous honors display in order with a blank gap and no duplicates',()=>{
  const q=new MedalQueue();
  for(const id of ['honorFirstBlood','achivementsCombo2','honorBlitz','honorBlitz','invalid'])q.enqueue(id);
  assert.equal(q.advance(0),'honorFirstBlood');
  assert.equal(q.advance(MEDAL_SHOW_SECONDS),null);
  assert.equal(q.advance(MEDAL_GAP_SECONDS/2),null);
  assert.equal(q.advance(MEDAL_GAP_SECONDS/2),'achivementsCombo2');
  assert.equal(q.advance(MEDAL_SHOW_SECONDS),null);
  assert.equal(q.advance(MEDAL_GAP_SECONDS),'honorBlitz');
  assert.equal(q.advance(MEDAL_SHOW_SECONDS+MEDAL_GAP_SECONDS),null);
  assert.equal(q.pending.length,0);
});
test('leaving a campaign clears active and queued reveals; a retry can earn them again',()=>{
  const q=new MedalQueue();q.enqueue('honorFirstBlood');q.enqueue('honorBlitz');q.advance(0);q.clear();
  assert.equal(q.advance(10),null);assert.equal(q.pending.length,0);
  q.enqueue('honorFirstBlood');assert.equal(q.advance(0),'honorFirstBlood');
});
