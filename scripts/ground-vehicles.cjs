// Rebuild crops and matching hit masks at the actual tyre/track contact line.
// Source PNG pixels remain unchanged. Run with node scripts/ground-vehicles.cjs.
const fs=require('node:fs'),path=require('node:path');
const {png}=require('./png-alpha.cjs');
const root=path.resolve(__dirname,'..'),file=path.join(root,'remaster/assets/art/manifest.json');
const manifest=JSON.parse(fs.readFileSync(file)),atlas=manifest['vehicles-painted'];
const image=png(fs.readFileSync(path.join(root,'remaster/assets/art',atlas.file)));
const ground=[304,315,632,633,1003,1005],sourceHeights=[290,329,292,341,317,329],names=['BTRLite','BTR','TankLite','Tank','RocketLite','RocketBig'];
const report=atlas.frames.map((frame,i)=>{
 const beforeHeight=frame.height,height=ground[i]+2-frame.y,mask=Array.from({length:32},()=>Array(32).fill('0'));
 let transparent=0;
 for(let y=0;y<height;y++)for(let x=0;x<frame.width;x++){
  const alpha=image.pixels[((frame.y+y)*image.width+frame.x+x)*4+3];
  if(alpha===0)transparent++;
  if(alpha>24)mask[Math.floor(y/height*32)][Math.floor(x/frame.width*32)]='1';
 }
 Object.assign(frame,{height,sourceHeight:sourceHeights[i],groundY:ground[i],hitMask:mask.map(row=>row.join('')),transparentFraction:transparent/(height*frame.width)});
 return {name:names[i],groundY:ground[i],beforeHeight,height};
});
fs.writeFileSync(file,JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/vehicle-grounding-audit.json'),JSON.stringify(report,null,2)+'\n');
console.table(report);
