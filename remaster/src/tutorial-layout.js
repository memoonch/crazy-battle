const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
export function tutorialCardPosition(target,size,bounds,obstacles,preferred='right',gap=62){
  const {width:w,height:h}=size,cx=(target.left+target.right)/2,cy=(target.top+target.bottom)/2;
  const candidates={right:[target.right+gap,cy-h/2],left:[target.left-gap-w,cy-h/2],above:[cx-w/2,target.top-gap-h],below:[cx-w/2,target.bottom+gap]};
  const points=[candidates[preferred],...Object.values(candidates)];
  // Test adjacent clear-space edges as well: large panels may block the nearest side.
  const xs=[bounds.left,bounds.right-w,cx-w/2,...obstacles.flatMap(r=>[r.right+12,r.left-w-12])];
  const ys=[bounds.top,bounds.bottom-h,cy-h/2,...obstacles.flatMap(r=>[r.bottom+12,r.top-h-12])];
  for(const x of xs)for(const y of ys)points.push([x,y]);
  let best=null;
  for(const [px,py]of points){
    const left=clamp(px,bounds.left,bounds.right-w),top=clamp(py,bounds.top,bounds.bottom-h),box={left,top,right:left+w,bottom:top+h};
    const blocked=obstacles.reduce((sum,r)=>sum+overlap(box,r),0);
    const distance=Math.hypot(Math.max(target.left-box.right,box.left-target.right,0),Math.max(target.top-box.bottom,box.top-target.bottom,0));
    const preferredDistance=Math.hypot(left-candidates[preferred][0],top-candidates[preferred][1]);
    const score=blocked*100000+distance+preferredDistance*.15;
    if(!best||score<best.score)best={left,top,score};
  }
  return {left:best.left,top:best.top};
}
