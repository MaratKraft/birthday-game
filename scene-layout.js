(function(root){
 'use strict';
 const span=1000,cache=new Map();let seed=19;
 function rng(value){let state=value>>>0;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296}}
 function build(index,sceneSeed=seed){
  const random=rng((sceneSeed^Math.imul(index+11003,2654435761))>>>0),range=(a,b)=>a+(b-a)*random();
  const blue=random()<.72?Math.floor(random()*3):-1,folders=[];
  let x=range(12,24);
  for(let i=0;i<3;i++){
   const w=blue===i?range(140,160):range(170,205);
   if(i)x=folders[i-1].x+folders[i-1].w-Math.min(w,folders[i-1].w)*range(.12,.22);
   folders.push({key:blue===i?'folder-blue':'folder-user-red',x,w,angle:range(-2,2),shade:i===0?.12:i===1?.06:0});
  }
  let monitor=null;
  if(random()<.86){
   const side=['left','right','none'][Math.floor(random()*3)];
   monitor={key:random()<.5?'monitor-blender':'monitor-photoshop',x:range(585,610),w:range(215,235),angle:0,shade:0,coverSide:side};
   if(side==='left')folders[2].x=monitor.x+range(28,45)-folders[2].w;
   const cover=side==='right'?range(28,48):-range(12,25);
   const x=monitor.x+monitor.w-cover;
   folders.push({key:'folder-user-red',x,w:Math.min(range(135,155),span-18-x),angle:range(-1.5,1.5),shade:0});
  }else{
   folders.push({key:'folder-user-red',x:range(585,605),w:range(165,180),angle:range(-2,2),shade:.03});
   folders.push({key:blue<0?'folder-blue':'folder-user-red',x:range(785,800),w:range(150,170),angle:range(-2,2),shade:0});
  }
  const parent=folders[1].key==='folder-user-red'?1:2;
  const papers=[{key:'back-note',parent,x:folders[parent].x+folders[parent].w*.23,w:range(130,155),exposed:range(55,70),angle:range(-4,4)}];
  if(random()<.72){const parent=0;papers.push({key:'note-small',parent,x:folders[parent].x+folders[parent].w*.58,w:range(62,78),exposed:range(30,40),angle:range(-3,3)})}
  const rear=[-35,310,685].map((x,i)=>({key:i===2&&blue<0?'bg-blue':'bg-red',x:x+range(-15,15),w:range(285,335),lift:range(25,45),angle:range(-2,2),shade:.28}));
  const foreground=[['folder-user-red',-40,270,30],
   [random()<.5?'folder-open':'paperclip',140,range(210,245),range(20,30)],
   ['folder-blue',355+range(-15,15),range(210,235),range(20,30)],
   [random()<.5?'paperclip':'folder-open',555,range(230,265),range(20,30)]];
  return {folders,papers,monitor,rear,foreground};
 }
 function layout(index){
  if(!cache.has(index)){if(cache.size>=40)cache.delete(cache.keys().next().value);cache.set(index,build(index))}
  return cache.get(index);
 }
 function reset(value=Math.floor(Math.random()*4294967296)){seed=value>>>0;cache.clear()}
 root.SceneLayout={span,build,layout,reset};
 if(typeof module!=='undefined')module.exports=root.SceneLayout;
})(typeof window==='undefined'?globalThis:window);
