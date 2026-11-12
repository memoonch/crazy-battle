export async function loadAssets(signal, onProgress = () => {}) {
  const entries = [
    ['tokens', '/docs/art-direction/design-tokens.json'],
    ['balance', '/docs/reference/balance.json'],
    ['art', '/remaster/assets/art/manifest.json']
  ];
  let done = 0;
  const loaded = await Promise.all(entries.map(async ([key, url]) => {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Could not load ${key} (${response.status})`);
    const value = await response.json();
    done++;
    return [key, value];
  }));
  const assets = Object.fromEntries(loaded);
  if (assets.balance.levels?.length !== 20 || !assets.tokens.colors?.surface) throw new Error('Reference data is incomplete.');
  assets.images = {};
  const total=entries.length+Object.keys(assets.art).length;
  onProgress(done,total);
  await Promise.all(Object.entries(assets.art).map(async ([name, item]) => {
    const response = await fetch('/remaster/assets/art/' + item.file, { signal });
    if (!response.ok) throw new Error('Could not load artwork: ' + name);
    assets.images[name] = await createImageBitmap(await response.blob());
    onProgress(++done, total);
  }));
  return assets;
}
