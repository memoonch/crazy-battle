const fs=require('node:fs'),crypto=require('node:crypto'),{png,bounds}=require('./png-alpha.cjs');
const bytes=fs.readFileSync('remaster/assets/art/infantry-backward-rest-v1.png'),im=png(bytes),frames=[];
for(let row=0;row<2;row++){const y=Math.floor(row*im.height/2);frames.push(bounds(im,{x:0,y,width:im.width,height:Math.floor((row+1)*im.height/2)-y}));}
const file='remaster/assets/art/manifest.json',m=JSON.parse(fs.readFileSync(file));m['infantry-backward-rest']={file:'infantry-backward-rest-v1.png',imageWidth:im.width,imageHeight:im.height,columns:1,rows:2,transparentFraction:bounds(im).transparentFraction,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),frames};
for(const key of ['rifle-soldier-atlas','bazooka-soldier-atlas-v3'])delete m[key].frames[6].groundPoints;
fs.writeFileSync(file,JSON.stringify(m,null,2)+'\n');console.log(frames);
