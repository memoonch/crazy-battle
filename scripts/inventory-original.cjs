// Read-only SWF audit. Generates reference documents without changing the game.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/reference');
fs.mkdirSync(path.join(out,'balance'),{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]).sort();
const relative=f=>path.relative(root,f).replaceAll('\\','/');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const csv=(rows,keys)=>[keys,...rows.map(r=>keys.map(k=>r[k]??''))].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
const table=(rows,keys)=>'| '+keys.join(' | ')+' |\n| '+keys.map(()=> '---').join(' | ')+' |\n'+rows.map(r=>'| '+keys.map(k=>r[k]??'').join(' | ')+' |').join('\n')+'\n';
const balance={};
for(const [name,tag] of Object.entries({weapons:'weapon',inventory:'inventory',levels:'level',omps:'omp',enemys:'enemy'})){
 const file=walk(path.join(root,'decompiled/game/binaryData')).find(f=>f.includes('__'+name+'Class.bin'));
 const xml=fs.readFileSync(file,'utf8'); fs.writeFileSync(path.join(out,'balance',name+'.xml'),xml);
 balance[name]=[...xml.matchAll(new RegExp('<'+tag+'>([\\s\\S]*?)</'+tag+'>','g'))].map(m=>Object.fromEntries([...m[1].matchAll(/<(\w+)>([^<]*)<\/\1>/g)].map(x=>[x[1],/^-?\d+$/.test(x[2])?Number(x[2]):x[2]])));
}
const classes=new Map([...read('decompiled/game/symbolClass/symbols.csv').matchAll(/^(\d+);"([^"]+)"/gm)].map(m=>[+m[1],m[2]]));
const original=fs.readFileSync(path.join(root,'original/game.swf'));
const data=original.toString('ascii',0,3)==='CWS'?Buffer.concat([original.subarray(0,8),zlib.inflateSync(original.subarray(8))]):original;
const rectBytes=Math.ceil((5+4*(data[8]>>3))/8),header=8+rectBytes;
const timelines=[],definitions=new Map(),histogram={};
function tags(start,end,id=0){
 let p=start,frame=1;const labels=[];
 while(p+2<=end){const packed=data.readUInt16LE(p);p+=2;const code=packed>>6;let len=packed&63;if(len===63){len=data.readUInt32LE(p);p+=4;}const next=p+len;if(next>end)throw Error('Malformed SWF tag');
 histogram[code]=(histogram[code]||0)+1;
 if([2,6,7,10,11,14,20,21,22,32,33,34,35,36,37,39,46,48,60,75,83,84,87,90,91].includes(code)&&len>=2)definitions.set(data.readUInt16LE(p),code);
 if(code===43)labels.push({frame,label:data.subarray(p,data.indexOf(0,p)).toString()});
 if(code===1)frame++;
 if(code===39){const sid=data.readUInt16LE(p),frames=data.readUInt16LE(p+2);const nested=tags(p+4,next,sid);timelines.push({id:sid,class:classes.get(sid)||'',frames,labels:nested});}
 p=next;if(code===0)break;
 }return labels;
}
const mainLabels=tags(header+4,data.length);
timelines.sort((a,b)=>a.id-b.id);
const inventory=[];
for(const category of ['images','shapes','sounds','fonts','texts','binaryData']){
 for(const file of walk(path.join(root,'decompiled/game',category))){const bytes=fs.readFileSync(file),id=+path.basename(file).split(/[_\.]/)[0];let dimensions='';
 if(path.extname(file)==='.png')dimensions=bytes.readUInt32BE(16)+'x'+bytes.readUInt32BE(20);
 if(path.extname(file)==='.svg'){const v=bytes.toString().match(/viewBox="([^"]+)"/);dimensions=v?v[1]:'';}
 inventory.push({category,id,class:classes.get(id)||'',path:relative(file),bytes:bytes.length,dimensions,sha256:hash(bytes)});
 }}
fs.writeFileSync(path.join(out,'asset-inventory.csv'),csv(inventory,['category','id','class','path','bytes','dimensions','sha256']));
const symbols=[...classes].map(([id,name])=>({id,class:name,tag:definitions.get(id)||'',frames:timelines.find(t=>t.id===id)?.frames||'',labels:timelines.find(t=>t.id===id)?.labels.map(l=>l.frame+':'+l.label).join('; ')||''}));
fs.writeFileSync(path.join(out,'symbol-inventory.csv'),csv(symbols,['id','class','tag','frames','labels']));
fs.writeFileSync(path.join(out,'timeline-inventory.json'),JSON.stringify({frameRate:data.readUInt16LE(header)/256,mainFrameCount:data.readUInt16LE(header+2),mainLabels,timelines,tagHistogram:histogram},null,2));
fs.writeFileSync(path.join(out,'balance.json'),JSON.stringify(balance,null,2));
const enemyMap=Object.fromEntries(balance.enemys.map(e=>[e.name,e]));
const waves=balance.levels.map((w,i)=>({wave:i+1,...w,total:Object.values(w).reduce((a,b)=>a+b,0),money:Object.entries(w).reduce((a,[k,n])=>a+n*enemyMap[k==='Rocket'?'RocketBig':k].cost,0),points:Object.entries(w).reduce((a,[k,n])=>a+n*enemyMap[k==='Rocket'?'RocketBig':k].health,0)}));
fs.writeFileSync(path.join(out,'wave-inventory.csv'),csv(waves,Object.keys(waves[0])));
const totals=Object.fromEntries(['images','shapes','sounds','fonts','texts','binaryData'].map(k=>[k,inventory.filter(i=>i.category===k).length]));
let md='# Original balance reference\n\nGenerated from the five embedded XML resources by `node scripts/inventory-original.cjs`. Values are original internal units; they are not rescaled screen pixels.\n\n';
md+='## Player weapons\n\n'+table(balance.weapons,['name','cost','damage','magazine','radius','rate','timeReload']);
md+='\n`Cannon` is granted free at new game despite its data cost of 3. `rate` is a simulation-tick threshold, not milliseconds. Reload values are milliseconds. See GAMEPLAY-SPEC.md for actual timing semantics.\n\n## Defenses\n\n'+table(balance.inventory,['name','cost','costSale','health','damage','range','radius','rate']);
md+='\n## Enemies\n\n'+table(balance.enemys,['name','health','damage','cost','speed','distance','rate']);
md+='\nEnemy `cost` is the money reward; score reward equals maximum health. Speed is internal pixels per simulation tick.\n\n## Consumables\n\n'+table(balance.omps,['name','cost','damage']);
md+='\n## All 20 waves\n\n'+table(waves,['wave','SoldatAK','SoldatBazooka','BTRLite','BTR','TankLite','Tank','RocketLite','Rocket','total','money','points']);
md+='\n`Rocket` in the wave XML maps to enemy `RocketBig`. Money and points are calculated potential kill rewards, excluding spending; wave order is shuffled when InfoObject initializes. Total campaign enemies: '+waves.reduce((a,w)=>a+w.total,0)+'. Total potential money: '+waves.reduce((a,w)=>a+w.money,0)+'. Total potential kill points: '+waves.reduce((a,w)=>a+w.points,0)+'.\n';
fs.writeFileSync(path.join(out,'BALANCE-TABLES.md'),md);
fs.writeFileSync(path.join(out,'audit-summary.json'),JSON.stringify({files:totals,scriptFiles:walk(path.join(root,'decompiled/game/scripts')).length,symbols:classes.size,timelines:timelines.length,swf:{version:data[3],frameRate:data.readUInt16LE(header)/256,mainFrames:data.readUInt16LE(header+2)},hashes:Object.fromEntries(['original/crazy-battle.swf','original/game.swf','standalone/build/crazy-battle.swf'].map(f=>[f,hash(fs.readFileSync(path.join(root,f)))]))},null,2));
const previewDir=path.join(out,'previews');
if(fs.existsSync(previewDir)){
 const previews=walk(previewDir).filter(f=>f.endsWith('.png'));
 const rows=previews.map(f=>{const id=+path.basename(path.dirname(f)).match(/^DefineSprite_(\d+)/)[1];const t=timelines.find(t=>t.id===id);return {symbol:classes.get(id)||id,id,frames:t?.frames||'',preview:'[First frame]('+relative(f).replace('docs/','')+')',states:t?.labels.map(l=>l.label).join(', ')||'Nested animation/static composition'};});
 fs.writeFileSync(path.join(root,'docs/ASSET-PREVIEWS.md'),'# Original asset previews\n\nThirty first-frame reference exports from the untouched embedded SWF. These are composition/silhouette references, not complete animation sequences. Blank/partial first frames are possible for effects; consult the timeline inventory for animation labels and nested clips.\n\n'+table(rows,['symbol','id','frames','preview','states'])+'\n## Selected unit references\n\n'+previews.filter(f=>/UnitSoldatAK_|UnitBTRLite_|UnitTank_|UnitHeli_|UnitMaxim_/.test(f)).map(f=>'### '+classes.get(+path.basename(path.dirname(f)).match(/^DefineSprite_(\d+)/)[1])+'\n\n!['+path.basename(path.dirname(f))+']('+relative(f).replace('docs/','')+')\n').join('\n'));
}
console.log(JSON.stringify({files:totals,symbols:classes.size,timelines:timelines.length,waves:waves.length,campaignEnemies:waves.reduce((a,w)=>a+w.total,0)}));
