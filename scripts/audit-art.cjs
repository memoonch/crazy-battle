// Inspect PNG alpha and sprite source bounds. Does not alter image pixels.
const fs=require('node:fs'),zlib=require('node:zlib'),path=require('node:path'),crypto=require('node:crypto');
const dir=path.resolve(__dirname,'../remaster/assets/art');
function png(bytes){
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20),type=bytes[25],channels=type===6?4:3;
 if(bytes[24]!==8||![2,6].includes(type)||bytes[28])throw Error('Unsupported PNG layout');
 let pos=8;const parts=[];while(pos<bytes.length){const n=bytes.readUInt32BE(pos),tag=bytes.toString('ascii',pos+4,pos+8);if(tag==='IDAT')parts.push(bytes.subarray(pos+8,pos+8+n));pos+=n+12;}
 const raw=zlib.inflateSync(Buffer.concat(parts)),stride=width*channels,pixels=Buffer.alloc(stride*height);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const filter=raw[y*(stride+1)];for(let x=0;x<stride;x++){const a=x>=channels?pixels[y*stride+x-channels]:0,b=y?pixels[(y-1)*stride+x]:0,c=y&&x>=channels?pixels[(y-1)*stride+x-channels]:0;const v=raw[y*(stride+1)+1+x];pixels[y*stride+x]=(v+(filter===0?0:filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):paeth(a,b,c)))&255;}}
 return {width,height,channels,pixels};
}
function bounds(image,region){const {x=0,y=0,width=image.width,height=image.height}=region||{};let minX=width,minY=height,maxX=-1,maxY=-1,transparent=0;
 for(let yy=0;yy<height;yy++)for(let xx=0;xx<width;xx++){const a=image.channels===4?image.pixels[((y+yy)*image.width+x+xx)*4+3]:255;if(a===0)transparent++;if(a>24){minX=Math.min(minX,xx);minY=Math.min(minY,yy);maxX=Math.max(maxX,xx);maxY=Math.max(maxY,yy);}}
 return {x:x+minX,y:y+minY,width:Math.max(0,maxX-minX+1),height:Math.max(0,maxY-minY+1),transparentFraction:transparent/(width*height)};
}
const manifest={};
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.png'))){const bytes=fs.readFileSync(path.join(dir,file)),image=png(bytes);const item={file,width:image.width,height:image.height,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),...bounds(image)};
 item.imageWidth=image.width;item.imageHeight=image.height;
 const grid=file.includes('vehicles-painted')?[2,3]:file.includes('defenses-painted')||file.includes('equipment')||file.includes('fortifications')?[2,2]:file.includes('atlas')?[4,2]:null;
 if(grid){[item.columns,item.rows]=grid;item.frames=[];for(let i=0;i<item.columns*item.rows;i++){
  const col=i%item.columns,row=Math.floor(i/item.columns),x=Math.floor(col*image.width/item.columns),y=Math.floor(row*image.height/item.rows);
  const frame=bounds(image,{x,y,width:Math.floor((col+1)*image.width/item.columns)-x,height:Math.floor((row+1)*image.height/item.rows)-y});
  if((file.includes('soldier-atlas')&&i<6)||file.includes('vehicles-painted')){
   const size=32,mask=Array.from({length:size},()=>Array(size).fill('0'));
   for(let yy=0;yy<frame.height;yy++)for(let xx=0;xx<frame.width;xx++){
    const alpha=image.pixels[((frame.y+yy)*image.width+frame.x+xx)*image.channels+3];
    if(alpha>24)mask[Math.floor(yy/frame.height*size)][Math.floor(xx/frame.width*size)]='1';
   }
   frame.hitMask=mask.map(row=>row.join(''));
  }
  item.frames.push(frame);
 }}
 manifest[file.replace('.png','')]=item;
 console.log(file,`${image.width}x${image.height}`,'transparent',item.transparentFraction.toFixed(3),'bounds',item.x,item.y,item.width,item.height);
}
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2));
