// Source rectangles come from real alpha bounds, so differently shaped PNG
// cutouts fit the same UI slot without stretching or showing adjacent cells.
export const EQUIPMENT_FRAMES = Object.freeze({
  Cannon:['weapons-equipment',0], MashineGun:['weapons-equipment',1],
  Bazooka:['weapons-equipment',2], Rocket:['weapons-equipment',3],
  Mine:['support-equipment',0], Avia:['support-equipment',1], Atom:['support-equipment',2]
});
export function equipmentArt(art,name) {
  const [key,index]=EQUIPMENT_FRAMES[name],atlas=art[key],b=atlas.frames[index];
  return `<span class="equipment-art" aria-hidden="true"><svg viewBox="${b.x} ${b.y} ${b.width} ${b.height}" preserveAspectRatio="xMidYMid meet" focusable="false"><image href="/remaster/assets/art/${atlas.file}" width="${atlas.imageWidth}" height="${atlas.imageHeight}"/></svg></span>`;
}

export function ammoArt(art,name) {
  const index={Cannon:0,MashineGun:1,Bazooka:2,Rocket:3}[name]??0,atlas=art['ammo-equipment'],b=atlas.frames[index];
  return `<i class="ammo-art" aria-hidden="true"><svg viewBox="${b.x} ${b.y} ${b.width} ${b.height}" preserveAspectRatio="xMidYMid meet" focusable="false"><image href="/remaster/assets/art/${atlas.file}" width="${atlas.imageWidth}" height="${atlas.imageHeight}"/></svg></i>`;
}
