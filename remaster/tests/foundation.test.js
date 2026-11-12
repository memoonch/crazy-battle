import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveStore, SAVE_KEY, newCampaign, validCampaign } from '../src/save.js';
import { measureViewport, clientToWorld } from '../src/viewport.js';

function memory() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('new campaign preserves the original starting balance', () => {
  assert.deepEqual(newCampaign(), { wave: 1, health: 800, score: 0, money: 0, weapons: ['Cannon'], activeWeapon: 'Cannon',
    supplies: { Mine: 0, Avia: 0, Atom: 0 }, achievements: [], checkpoint: 'preparation' });
});

test('campaign and settings round-trip together without clobbering each other', () => {
  const storage = memory(), first = new SaveStore(storage);
  const checkpoint = first.startNew(); checkpoint.wave = 2; checkpoint.money = 10; checkpoint.score = 100;
  first.saveCheckpoint(checkpoint);
  first.saveSettings({ ...first.settings, master: 0, reducedMotion: true });
  const restored = new SaveStore(storage);
  assert.deepEqual(restored.campaign, checkpoint);
  assert.equal(restored.settings.master, 0);
  assert.equal(restored.settings.reducedMotion, true);
  assert.equal(restored.data.revision, 3);
});

test('replacing a campaign keeps the previous checkpoint in the same atomic record', () => {
  const storage = memory(), store = new SaveStore(storage);
  const old = store.startNew(); old.wave = 7; old.money = 99; store.saveCheckpoint(old);
  store.startNew();
  const persisted = JSON.parse(storage.getItem(SAVE_KEY));
  assert.equal(persisted.previousCampaign.wave, 7);
  assert.equal(persisted.previousCampaign.money, 99);
  assert.deepEqual(persisted.campaign, newCampaign());
});

test('callers cannot mutate a stored checkpoint through a returned reference', () => {
  const store = new SaveStore(memory()); store.startNew();
  const copy = store.campaign; copy.weapons.push('Rocket'); copy.money = 9000;
  assert.deepEqual(store.campaign.weapons, ['Cannon']); assert.equal(store.campaign.money, 0);
});

test('malformed and unsupported saves remain intact, with session-only fallback', () => {
  for (const raw of ['{broken', '{"version":9,"important":"future data"}', 'null', JSON.stringify({ version: 1, revision: 0, campaign: { wave: -1 } })]) {
    const storage = memory(); storage.setItem(SAVE_KEY, raw);
    const store = new SaveStore(storage); store.startNew();
    assert.equal(store.writable, false); assert.equal(storage.getItem(SAVE_KEY), raw);
    assert.deepEqual(store.campaign, newCampaign());
  }
});

test('storage failures preserve playable in-memory state', () => {
  const storage = { getItem: () => null, setItem: () => { throw new Error('Quota exceeded'); } };
  const store = new SaveStore(storage); store.startNew();
  assert.equal(store.writable, false); assert.equal(store.campaign.health, 800);
  assert.match(store.status, /session only/);
});

test('invalid economy/inventory checkpoints are rejected before persistence', () => {
  const store = new SaveStore(memory()); store.startNew();
  for (const patch of [{ money: -1 }, { health: 900 }, { wave: 0 }, { money: NaN }, { weapons: ['Unknown'] }, { activeWeapon: 'Rocket' }, { supplies: { Mine: -1, Avia: 0, Atom: 0 } }]) {
    const invalid = { ...newCampaign(), ...patch };
    assert.equal(validCampaign(invalid), false);
    assert.throws(() => store.saveCheckpoint(invalid));
    assert.deepEqual(store.campaign, newCampaign());
  }
});

test('native, narrow, fullscreen and ultrawide pointer mapping is invertible', () => {
  for (const [width, height] of [[960,540],[768,432],[1680,1050],[2560,1080],[540,960]]) {
    const v = measureViewport(width, height, 3), rect = { left: 57, top: 83 };
    assert.ok(v.scale > 0); assert.equal(v.dpr, 2);
    for (const [x,y] of [[0,0],[960,540],[500,300],[145,145]]) {
      const point = clientToWorld(rect.left+v.offsetX+x*v.scale, rect.top+v.offsetY+y*v.scale, rect, v);
      assert.ok(Math.abs(point.x-x)<1e-9); assert.ok(Math.abs(point.y-y)<1e-9);
    }
  }
});

test('fullscreen scenery extension does not grant extra battlefield input', () => {
  const v = measureViewport(2560,1080), rect = { left: 0, top: 0 };
  const extension = clientToWorld(10, 500, rect, v);
  assert.equal(extension.inside, false); assert.equal(extension.battlefield, false);
  const target = clientToWorld(v.offsetX+500*v.scale, v.offsetY+300*v.scale, rect, v);
  assert.equal(target.battlefield, true);
});

test('viewport rejects zero dimensions instead of producing broken aim coordinates', () => {
  assert.throws(() => measureViewport(0,540), RangeError);
  assert.throws(() => measureViewport(960,0), RangeError);
});
