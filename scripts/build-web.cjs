const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const esbuild=require('esbuild');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'web-build');
const read=p=>fs.readFile(path.join(root,p),'utf8');
async function write(p,data){const target=path.join(out,p);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,data);}
async function copy(src,dest){await write(dest,await fs.readFile(path.join(root,src)));}
async function build(){
  // Only replace this script's generated output, never source or arbitrary paths.
  if(out!==path.join(root,'web-build')||path.dirname(out)!==root)throw Error('Invalid build target');
  await fs.rm(out,{recursive:true,force:true});
  const manifest=JSON.parse(await read('remaster/assets/art/manifest.json'));
  const replacements=new Map();let sourceBytes=0,artBytes=0;
  for(const item of Object.values(manifest)){
    const source=path.join(root,'remaster/assets/art',item.file),dest=item.file.replace(/\.png$/,'.webp');
    const original=await fs.readFile(source);
    const encoded=await sharp(original).webp({lossless:true,effort:6}).toBuffer();
    const metadata=await sharp(encoded).metadata(),before=await sharp(original).metadata();
    if(metadata.width!==before.width||metadata.height!==before.height)throw Error('Artwork dimensions changed');
    // Keep alpha and every visible pixel intact: frame geometry and hit masks stay valid.
    const a=await sharp(original).ensureAlpha().raw().toBuffer(),b=await sharp(encoded).ensureAlpha().raw().toBuffer();
    for(let i=0;i<a.length;i+=4)if(a[i+3]!==b[i+3]||(a[i+3]&&(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2])))throw Error('Lossless artwork check failed: '+item.file);
    sourceBytes+=original.length;artBytes+=encoded.length;
    replacements.set(item.file,dest);item.file=dest;item.sha256=crypto.createHash('sha256').update(encoded).digest('hex');
    await write('game/assets/art/'+dest,encoded);
  }
  await write('game/assets/art/manifest.json',JSON.stringify(manifest));
  for(const [src,dest]of [['docs/art-direction/design-tokens.json','game/data/design-tokens.json'],['docs/reference/balance.json','game/data/balance.json']])await write(dest,JSON.stringify(JSON.parse(await read(src))));
  const audio=JSON.parse(await read('remaster/assets/audio/manifest.json'));
  await write('game/assets/audio/manifest.json',JSON.stringify(audio));
  for(const file of [...Object.values(audio),'wave-victory.ogg','wave-defeat.ogg','credits.html'])await copy('remaster/assets/audio/'+file,'game/assets/audio/'+file);
  for(const file of ['forest-loading.jpg','soldier-run.png'])await copy('remaster/assets/preloader/'+file,'game/assets/preloader/'+file);
  await write('game/assets/icon.png',await sharp(path.join(root,'remaster/assets/art/game-icon-v1.png')).resize(256,256).png({compressionLevel:9}).toBuffer());
  await copy('remaster/assets/marketing/game-logo-640.png','logo.png');
  await copy('remaster/assets/marketing/helicopter-last-stand-197x150-v2.png','banner.png');
  const remap=s=>{
    s=s.replaceAll('/remaster/assets/marketing/game-logo-640.png','./logo.png')
      .replaceAll('/docs/art-direction/design-tokens.json','./game/data/design-tokens.json')
      .replaceAll('/docs/reference/balance.json','./game/data/balance.json')
      .replaceAll('/remaster/assets/','./game/assets/');
    for(const [from,to]of replacements)s=s.replaceAll(from,to);
    return s;
  };
  await esbuild.build({entryPoints:[path.join(root,'remaster/src/main.js')],outfile:path.join(out,'game/game.js'),bundle:true,minify:true,format:'esm',target:['chrome100','firefox100','safari15.4'],legalComments:'none',plugins:[{name:'production-paths',setup(build){build.onLoad({filter:/\.js$/},async args=>{
    let contents=remap(await fs.readFile(args.path,'utf8'));
    // Development diagnostics have no place in the upload page.
    contents=contents.replace(/^.*document\.querySelector\('#(?:display|pointer|save|scene|combat)-info'\).*\r?\n/gm,'');
    contents=contents.replace("new URL('../assets/audio/',import.meta.url)","new URL('./assets/audio/',import.meta.url)");
    return {contents,loader:'js'};
  });}}]});
  let css=await read('remaster/styles.css');for(const [from,to]of replacements)css=css.replaceAll(from,to);
  css+='\nhtml,body{width:100%;height:100%;overflow:hidden}main{width:100%;height:100%;max-width:none;margin:0;padding:0}#viewport{width:100%;height:100%;max-width:none;aspect-ratio:auto;margin:0;box-shadow:none}';
  await write('game/game.css',(await esbuild.transform(css,{loader:'css',minify:true,target:'es2020'})).code);
  let html=remap(await read('remaster/index.html'))
    .replace(/\s*<header class="page-header">[\s\S]*?<\/header>/,'')
    .replace(/\s*<footer class="preview-info">[\s\S]*?<\/footer>/,'')
    .replace('href="styles.css"','href="./game/game.css"')
    .replace('src="src/main.js"','src="./game/game.js"')
    .replaceAll('./game/assets/art/game-icon-v1.png','./game/assets/icon.png')
    .replace('<main>','<button id="fullscreen" type="button" hidden aria-label="Fullscreen"></button><main>')
    .replaceAll('aria-label="Crazy Battle','aria-label="Helicopter: Last Stand');
  await write('index.html',html.replace(/>\s+</g,'><').trim()+'\n');
  const files=[];async function walk(dir){for(const item of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isDirectory())await walk(p);else files.push({file:path.relative(out,p).replaceAll('\\','/'),bytes:(await fs.stat(p)).size});}}await walk(out);
  const report={files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0),artSourceBytes:sourceBytes,artBuildBytes:artBytes,artReduction:Math.round((1-artBytes/sourceBytes)*100)+'%'};
  console.log(JSON.stringify(report,null,2));
}
build().catch(error=>{console.error(error);process.exitCode=1;});
