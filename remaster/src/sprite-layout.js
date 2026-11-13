export const VEHICLE_FRAMES = Object.freeze({BTRLite:0,BTR:1,TankLite:2,Tank:3,RocketLite:4,RocketBig:5});
export const SOLDIER_HEIGHT = 42.5; // About 15% larger; shared by drawing and targeting.

export function soldierLayout(art,enemy,index) {
  const bazooka=enemy.name==='SoldatBazooka',key=bazooka?'bazooka-soldier-atlas-v3':'rifle-soldier-atlas';
  const atlas=art[key],b=atlas.frames[index],cellW=atlas.imageWidth/4,cellH=atlas.imageHeight/2;
  const scale=SOLDIER_HEIGHT/(bazooka?Math.max(...atlas.frames.slice(0,6).map(f=>f.height)):329);
  const baseline=index>=6||bazooka?b.y%cellH+b.height:426;
  return {key,b,x:(b.x%cellW-cellW*.54)*scale,y:(b.y%cellH-baseline)*scale,w:b.width*scale,h:b.height*scale};
}
export function vehicleLayout(art,enemy) {
  const key=['BTR','BTRLite'].includes(enemy.name)&&art['machine-gun-jeep']?'machine-gun-jeep':'vehicles-painted',b=key==='machine-gun-jeep'?art[key].frames[0]:art[key].frames[VEHICLE_FRAMES[enemy.name]];
  const scale=Math.min(105/b.width,62/(b.sourceHeight??b.height)),w=b.width*scale,h=b.height*scale;
  const ground=b.groundY??b.y+b.height;
  return {key,b,x:-w/2,y:-(ground-b.y)*scale,w,h};
}
function maskContains(layout,point) {
  const {b,x,y,w,h}=layout;
  if(point.x<x||point.y<y||point.x>=x+w||point.y>=y+h)return false;
  const mask=b.hitMask;
  if(!mask)return false;
  const col=Math.floor((point.x-x)/w*mask[0].length),row=Math.floor((point.y-y)/h*mask.length);
  return mask[row][col]==='1';
}
export function paintedContains(art,enemy,point) {
  if(enemy.name.startsWith('Soldat')) {
    // Union the poses in this state: animation/reduced-motion settings and
    // a click between render frames must not make a visible limb untargetable.
    const poses=enemy.state==='move'?[0,1,2,3]:[4,5];
    return poses.some(index=>maskContains(soldierLayout(art,enemy,index),point));
  }
  // Include the renderer's sub-pixel movement bob, never its smoke or shadow.
  const layout=vehicleLayout(art,enemy);
  return [-.45,0,.45].some(bob=>maskContains({...layout,y:layout.y+bob},point));
}
