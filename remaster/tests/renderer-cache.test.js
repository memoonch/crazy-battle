import test from 'node:test';
import assert from 'node:assert/strict';
import {Renderer} from '../src/renderer.js';
function cacheHarness(run){
 const previous=globalThis.OffscreenCanvas;let paints=0,draws=0;
 globalThis.OffscreenCanvas=class{constructor(width,height){this.width=width;this.height=height;}getContext(){return {setTransform(){},drawImage(){paints++;}};}};
 try{
  const viewport={view:{scale:1,dpr:1}},r=new Renderer({getContext:()=>({})},viewport);r.setAssets({images:{unit:{}}});
  const c={drawImage(){draws++;}},layout={key:'unit',b:{x:0,y:0,width:300,height:200},x:-30,y:-40,w:60,h:40};
  run({r,c,layout,viewport,stats:()=>({paints,draws})});
 }finally{if(previous===undefined)delete globalThis.OffscreenCanvas;else globalThis.OffscreenCanvas=previous;}
}
test('enemy edges/filters are baked once and reused across repeated frames and movement bob',()=>cacheHarness(({r,c,layout,stats})=>{
 const e={name:'Tank',health:85,healthMax:85};
 for(let i=0;i<60;i++)r.enemySprite(c,layout,e,i*25,false,Math.sin(i)*.45);
 assert.deepEqual(stats(),{paints:1,draws:60});
 e.health=40;r.enemySprite(c,layout,e,2000,false);assert.equal(stats().paints,2);
 e.hitAt=2000;r.enemySprite(c,layout,e,2000,false);assert.equal(stats().paints,3);
 r.enemySprite(c,layout,e,2200,false);assert.equal(stats().paints,3);
}));
test('changing display density refreshes cached pixels while preserving logical placement',()=>cacheHarness(({r,c,layout,viewport,stats})=>{
 const e={name:'SoldatAK',health:10,healthMax:10};r.enemySprite(c,layout,e,0,false);
 viewport.view={scale:2,dpr:2};r.enemySprite(c,layout,e,0,false);assert.equal(stats().paints,2);assert.equal(r.enemySpriteCache.size,2);
 const values=[...r.enemySpriteCache.values()];assert.equal(values[0].width,values[1].width);assert.equal(values[0].height,values[1].height);assert.ok(values[1].surface.width>values[0].surface.width);
}));
test('the enemy sprite cache stays bounded during repeated layout/density changes',()=>cacheHarness(({r,c,layout})=>{
 for(let i=0;i<160;i++)r.enemySprite(c,{...layout,b:{...layout.b,x:i}}, {name:'Tank',health:85,healthMax:85},0,false);
 assert.equal(r.enemySpriteCache.size,128);
}));
