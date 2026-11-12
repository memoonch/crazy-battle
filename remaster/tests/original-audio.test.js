import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {AudioManager} from '../src/audio.js';
const manifest=JSON.parse(fs.readFileSync(new URL('../assets/audio/manifest.json',import.meta.url)));
test('shipped original audio matches exported files and excludes the old helicopter',()=>{
 assert.equal(Object.keys(manifest).length,38);assert.ok(!manifest.sndChop);
 for(const file of Object.values(manifest)){
  const hash=url=>createHash('sha256').update(fs.readFileSync(url)).digest('hex');
  assert.equal(hash(new URL('../assets/audio/'+file,import.meta.url)),hash(new URL('../../decompiled/game/sounds/'+file,import.meta.url)));
 }
});
test('music transitions preserve battle track through pause and settings',()=>{
 const a=new AudioManager({});a.context={currentTime:0};a.rotorLevel={gain:{setTargetAtTime(){}}};
 const tracks=[];a.playMusic=key=>{a.trackKey=key;tracks.push(key);};
 a.setScene('menu',true);a.setScene('preparation');a.setScene('combat');a.setScene('pause');a.setScene('settings');
 assert.deepEqual(tracks,['menuMusic','fonMusic','fonMusic','fonMusic','fonMusic']);
 a.setScene('menu');assert.equal(tracks.at(-1),'menuMusic');
});
