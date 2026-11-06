window.SPRITE_FRAMES={"run-8":[[2,2,256,331],[275,2,252,332],[548,2,180,330],[821,2,257,325],[2,418,269,330],[275,418,235,331],[548,418,185,323],[821,418,258,324]],"jump-4":[[2,834,180,290],[275,834,202,322],[548,834,202,274],[821,834,169,284]],"duck-4":[[2,1250,172,287],[275,1250,208,241],[548,1250,204,246],[821,1250,196,280]],"states-4":[[2,1666,158,412],[275,1666,175,400],[548,1666,198,281],[821,1666,186,402]],"phone-idle":[[2,2082,130,410]]};window.CHARACTER_V4={"version":4,"standingVisibleHeight":412.0,"frames":{"run-8":[{"x":-147.5,"y":-338.5,"id":"run-8-01","footLift":8.0},{"x":-141.0,"y":-331.5,"id":"run-8-02","footLift":0.0},{"x":-87.5,"y":-333.0,"id":"run-8-03","footLift":3.0},{"x":-144.0,"y":-341.5,"id":"run-8-04","footLift":17.0},{"x":-145.0,"y":-337.5,"id":"run-8-05","footLift":8.0},{"x":-129.0,"y":-330.5,"id":"run-8-06","footLift":0.0},{"x":-92.5,"y":-325.5,"id":"run-8-07","footLift":3.0},{"x":-146.0,"y":-341.0,"id":"run-8-08","footLift":17.0}],"jump-4":[{"x":-87.5,"y":-289.5,"id":"jump-4-01","footLift":0.0},{"x":-70.5,"y":-321.5,"id":"jump-4-02","footLift":0.0},{"x":-95.5,"y":-273.0,"id":"jump-4-03","footLift":0.0},{"x":-76.5,"y":-283.0,"id":"jump-4-04","footLift":0.0}],"duck-4":[{"x":-51.0,"y":-286.5,"id":"duck-4-01","footLift":0.0},{"x":-88.0,"y":-240.5,"id":"duck-4-02","footLift":0.0},{"x":-84.0,"y":-245.0,"id":"duck-4-03","footLift":0.0},{"x":-75.0,"y":-280.0,"id":"duck-4-04","footLift":0.0}],"states-4":[{"x":-70.5,"y":-411.5,"id":"states-4-01","footLift":0.0},{"x":-71.0,"y":-399.5,"id":"states-4-02","footLift":0.0},{"x":-106.0,"y":-280.5,"id":"states-4-03","footLift":0.0},{"x":-55.5,"y":-401.5,"id":"states-4-04","footLift":0.0}],"phone-idle":[{"x":-41.0,"y":-410.0,"id":"phone-idle","footLift":0.0}]},"count":21,"atlasSize":[1092,2496]};
;
window.GAME_IMAGES={"monitor-blender":"assets/335dff0017af86f1ffe9.png","coin-rkn":"assets/7bce633852c61c1ab0a3.png","coin-blender":"assets/e44a10ec2a2339ef8cdc.png","coin-figma":"assets/68a94fe51e441d805cef.png","coin-illustrator":"assets/2e205381e0cb24298a6d.png","coin-photoshop":"assets/29156089556ee9dbb119.png","coin-tiktok":"assets/50dda55fdaa3eafc854e.png","bg-red":"assets/170582e86f45bd32741e.png","back-note":"assets/bb3615346f2ebed74813.png","folder-blue":"assets/4a7c09015c2811cc1393.png","folder-user-red":"assets/97922d127d9ab05f2cd1.png","character-v4":"assets/1f8ddae3ea7ba51b1aeb.png"};
;
window.GAME_IMAGES["monitor-photoshop"]="assets/0af6c3b5836cfea12fde.png";
window.GAME_IMAGES["paperclip"]="assets/f541bc0d0346d976e6f3.png";
window.GAME_IMAGES["floor"]="assets/fb6b272822ab8d1a391f.png";
window.GAME_IMAGES["folder-open"]="assets/14d3761d26be40a48bf5.png";
window.GAME_IMAGES["note-small"]="assets/6cdeb71dda1b66dde515.png";
window.GAME_IMAGES["folder-red-paper"]="assets/20c4785b1791cc555002.png";
window.GAME_IMAGES["folder-blue-cake"]="assets/85507d96ca617fa80572.png";
window.GAME_IMAGES["folder-minecraft"]="assets/57703edb9e336fa92f31.png";
window.GAME_IMAGES['bg-blue']='assets/6f5d3fd0b96f19bef239.png';
window.GAME_IMAGES['coin-clock']='assets/e1374bfa59534f6b6d03.png';
window.GAME_IMAGES['coin-indesign']='assets/5fa8f60fd9a8176bd1f2.png';

;
(function(root){
  'use strict';
  // Extra wine tones preserve the approved folder lighting; no rainbow/noise.
  const colors=['#963c43','#602831','#4c222c','#7d333c','#aa5057','#f2ecde','#c4b38b','#416b91','#b9c66d','#000000'];
  const rgb=colors.map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)));
  // RGB555 lookup keeps the per-frame pass small; no new output colors.
  const lookup=new Uint8Array(32768);
  for(let key=0;key<lookup.length;key++){
    const r=((key>>10)&31)*255/31,g=((key>>5)&31)*255/31,b=(key&31)*255/31;
    let nearest=0,distance=Infinity;
    rgb.forEach((c,i)=>{const d=(r-c[0])**2+(g-c[1])**2+(b-c[2])**2;if(d<distance){distance=d;nearest=i}});
    lookup[key]=nearest;
  }
  function quantize(data){
    for(let i=0;i<data.length;i+=4){
      if(data[i+3]===0)continue;
      const key=((data[i]>>3)<<10)|((data[i+1]>>3)<<5)|(data[i+2]>>3),c=rgb[lookup[key]];
      data[i]=c[0];data[i+1]=c[1];data[i+2]=c[2];
    }
    return data;
  }
  function monochrome(data){
    const tones=[[28,22,24],[242,236,222]];
    for(let i=0;i<data.length;i+=4){
      if(data[i+3]<128){data[i+3]=0;continue}
      const lum=data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722;
      const tone=tones[lum>=128?1:0];
      data[i]=tone[0];data[i+1]=tone[1];data[i+2]=tone[2];
      data[i+3]=255;
    }
    return data;
  }
  function softenCorners(data,width,height,strength=48,darkOnly=true){
    // Only exterior empty pixels can change, never ink or face details.
    const source=new Uint8ClampedArray(data),outside=new Uint8Array(width*height);
    const queue=new Int32Array(width*height);let head=0,tail=0;
    function visit(p){if(p<0||p>=outside.length||outside[p]||source[p*4+3]>16)return;outside[p]=1;queue[tail++]=p}
    for(let x=0;x<width;x++){visit(x);visit((height-1)*width+x)}
    for(let y=0;y<height;y++){visit(y*width);visit(y*width+width-1)}
    while(head<tail){const p=queue[head++],x=p%width;if(x>0)visit(p-1);if(x<width-1)visit(p+1);visit(p-width);visit(p+width)}
    for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
      const p=y*width+x;if(!outside[p])continue;
      const neighbors=[p-width,p+1,p+width,p-1],solid=neighbors.map(n=>source[n*4+3]>=224);
      if(solid.filter(Boolean).length!==2)continue;
      for(let k=0;k<4;k++){
        const next=(k+1)%4;if(!solid[k]||!solid[next])continue;
        const a=neighbors[k]*4,b=neighbors[next]*4,diagonal=(neighbors[k]+neighbors[next]-p)*4;
        if(source[diagonal+3]<224)continue;
        if(darkOnly&&(source[a]+source[a+1]+source[a+2]>240||source[b]+source[b+1]+source[b+2]>240))continue;
        if(Math.abs(source[a]-source[b])+Math.abs(source[a+1]-source[b+1])+Math.abs(source[a+2]-source[b+2])>60)continue;
        for(let c=0;c<3;c++)data[p*4+c]=Math.round((source[a+c]+source[b+c])/2);
        data[p*4+3]=Math.max(0,Math.min(64,strength));
      }
    }
    return data;
  }
  function softenInteriorCorners(data,width,height){
    const source=new Uint8ClampedArray(data);
    const luminance=i=>source[i]*.2126+source[i+1]*.7152+source[i+2]*.0722;
    // Clothing only: preserve the face, hair, glasses and outside contour.
    for(let y=Math.max(1,Math.floor(height*.4));y<height-1;y++)for(let x=1;x<width-1;x++){
      const p=(y*width+x)*4;if(source[p+3]<224)continue;
      const neighbors=[p-width*4,p+4,p+width*4,p-4];
      if(neighbors.some(i=>source[i+3]<224))continue;
      const light=luminance(p)>150,opposite=neighbors.map(i=>(luminance(i)>150)!==light);
      if(opposite.filter(Boolean).length!==2)continue;
      for(let k=0;k<4;k++){
        const next=(k+1)%4;if(!opposite[k]||!opposite[next])continue;
        const diagonal=neighbors[k]+neighbors[next]-p;
        if(source[diagonal+3]<224||(luminance(diagonal)>150)===light)continue;
        for(let c=0;c<3;c++){
          const other=(source[neighbors[k]+c]+source[neighbors[next]+c])/2;
          data[p+c]=Math.round(source[p+c]*.88+other*.12);
        }
      }
    }
    return data;
  }
  function softenColorCorners(data,width,height){
    const src=new Uint8ClampedArray(data);
    const distance=(a,b)=>Math.abs(src[a]-src[b])+Math.abs(src[a+1]-src[b+1])+Math.abs(src[a+2]-src[b+2]);
    for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
      const p=(y*width+x)*4;if(src[p+3]<224)continue;
      const n=[p-width*4,p+4,p+width*4,p-4];if(n.some(i=>src[i+3]<224))continue;
      for(let k=0;k<4;k++){
        const next=(k+1)%4,a=n[k],b=n[next],diagonal=a+b-p;
        if(distance(p,a)<40||distance(a,b)>25||src[diagonal+3]<224||distance(a,diagonal)>25)continue;
        if(distance(p,n[(k+2)%4])>25||distance(p,n[(k+3)%4])>25)continue;
        for(let c=0;c<3;c++)data[p+c]=Math.round(src[p+c]*.88+(src[a+c]+src[b+c])*.06);
        break;
      }
    }
    return data;
  }
  root.PixelPalette={colors,rgb,quantize,monochrome,softenCorners,softenInteriorCorners,softenColorCorners};
  if(typeof module!=='undefined')module.exports=root.PixelPalette;
})(typeof window==='undefined'?globalThis:window);

;
(function(root){
  'use strict';
  let sx=1,sy=1;
  const cache=new Map();
  function configure(x,y){sx=x;sy=y;cache.clear()}
  function draw(ctx,key,x,y,width,height,paint){
    const dw=Math.max(1,Math.round(width*sx)),dh=Math.max(1,Math.round(height*sy)),id=key+':'+dw+':'+dh;
    let tile=cache.get(id);
    if(!tile){
      tile=document.createElement('canvas');tile.width=dw+2;tile.height=dh+2;
      const tc=tile.getContext('2d',{willReadFrequently:true});tc.imageSmoothingEnabled=false;
      tc.setTransform(sx,0,0,sy,1,1);paint(tc);
      const p=tc.getImageData(0,0,tile.width,tile.height);
      root.PixelPalette.softenColorCorners(p.data,tile.width,tile.height);
      root.PixelPalette.softenCorners(p.data,tile.width,tile.height,48,false);
      tc.putImageData(p,0,0);if(cache.size>=384)cache.delete(cache.keys().next().value);cache.set(id,tile);
    }
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(tile,(Math.round(x*sx)-1)/sx,(Math.round(y*sy)-1)/sy,tile.width/sx,tile.height/sy);
  }
  root.PixelGrid={configure,draw};
})(window);

;
(function(root){
 'use strict';
 const span=1500,cache=new Map();let seed=19;
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
  const rear=[-35,310,685].map((x,i)=>({key:(i===1&&index%4===0)||random()<.18?'bg-blue':'bg-red',x:x+range(-15,15),w:range(285,335),lift:range(25,45),angle:range(-2,2),shade:.28}));
  const foreground=[['folder-user-red',-40,270,30],
   [random()<.5?'folder-open':'paperclip',140,range(210,245),range(20,30)],
   ['folder-blue',355+range(-15,15),range(210,235),range(20,30)],
   [random()<.5?'paperclip':'folder-open',555,range(230,265),range(20,30)]];
  for(let i=0;i<3;i++){const x=1000+i*150,w=Math.min(range(170,190),span-18-x);folders.push({key:i===1&&random()<.3?'folder-blue':'folder-user-red',x,w,angle:range(-2,2),shade:i===0?.1:0})}
  rear.push({key:random()<.3?'bg-blue':'bg-red',x:1030,w:330,lift:35,angle:range(-2,2),shade:.28});
  foreground.push(['folder-user-red',800,250,25],[random()<.5?'folder-open':'paperclip',1000,240,25]);
  if(random()<.5){for(const item of [...folders,...papers,...rear]){item.x=span-6-item.x-item.w;item.angle=-item.angle}for(const paper of papers){const parent=folders[paper.parent];paper.x=Math.max(parent.x,Math.min(paper.x,parent.x+parent.w-1))}if(monitor){monitor.x=span-6-monitor.x-monitor.w;monitor.coverSide=monitor.coverSide==='left'?'right':monitor.coverSide==='right'?'left':'none'}}
  for(const item of foreground){if(random()<.5)item[0]=['folder-user-red','folder-blue','folder-open','paperclip'][Math.floor(random()*4)];item[1]+=range(-22,22)}
  const rareCandidates=[];
  for(let i=0;i<folders.length;i++){const f=folders[i];if(!papers.some(p=>p.parent===i)){if(f.x+f.w/2>=span*.25&&f.x+f.w/2<=span*.75)rareCandidates.push(i);if(random()<.12)f.key='folder-red-paper'}f.flip=f.key.startsWith('folder-')&&random()<.22}
  // Equal outcomes per chunk; central placement keeps rare props apart across chunk edges.
  const rareRandom=rng((sceneSeed^Math.imul(index+937,2246822519))>>>0),rareKind=Math.floor(rareRandom()*3);
  if(rareKind&&rareCandidates.length){folders[rareCandidates[Math.floor(rareRandom()*rareCandidates.length)]].key=rareKind===1?'folder-blue-cake':'folder-minecraft'}
  return {folders,papers,monitor,rear,foreground};
 }
 function layout(index){
  if(!cache.has(index)){if(cache.size>=40)cache.delete(cache.keys().next().value);cache.set(index,build(index))}
  return cache.get(index);
 }
 function reset(value=Math.floor(Math.random()*4294967296)){seed=value>>>0;cache.clear();if(root.document)root.document.documentElement.dataset.sceneSeed=String(seed)}
 root.SceneLayout={span,build,layout,reset};
 if(typeof module!=='undefined')module.exports=root.SceneLayout;
})(typeof window==='undefined'?globalThis:window);

;
(function(root){
 'use strict';
 const C={red:'#602831',dark:'#4c222c',paper:'#f2ecde',black:'#171319'};
 function prop(c,images,key,x,bottom,width,angle=0,shade=0,flip=false){
  const im=images[key];if(!im)return;
  const height=width*(im.height||im.naturalHeight||100)/(im.width||im.naturalWidth||100);
  c.save();c.translate(Math.round(x+width/2),Math.round(bottom));c.rotate(angle*Math.PI/180);if(flip)c.scale(-1,1);
  if(typeof document!=='undefined'&&document.createElement&&root.PixelGrid){
   root.PixelGrid.draw(c,'prop:'+key+':shade:'+shade,-width/2,-height,width,height,tc=>{
    tc.drawImage(im,0,0,width,height);
    if(shade){tc.save();tc.globalCompositeOperation='source-atop';tc.fillStyle='rgba(20,10,19,'+shade+')';tc.fillRect(0,0,width,height);tc.restore()}
   });
  }else c.drawImage(im,-width/2,-height,width,height);
  c.restore();
 }
 function shadow(c,x,g,width,height=4,alpha=.18){
  c.save();c.fillStyle='rgba(24,15,25,'+alpha+')';c.beginPath();c.ellipse(Math.round(x),Math.round(g+9),Math.round(width/2),height,0,0,Math.PI*2);c.fill();c.restore();
 }
 function chunks(w,g,t,speed,draw){
  const s=g/243*(root.innerWidth<650?.82:1),camera=t*speed/s,span=root.SceneLayout.span;
  for(let index=Math.floor(camera/span)-1;index<=Math.floor((camera+w/s)/span)+1;index++)draw(root.SceneLayout.layout(index),(index*span-camera)*s,s);
 }
 function placed(c,images,item,a,g,s){
  const width=item.w*s,bottom=g-width/2*Math.abs(Math.sin(item.angle*Math.PI/180));
  prop(c,images,item.key,a+item.x*s,bottom,width,item.angle,item.shade||0,item.flip||false);
 }
 function background(c,w,h,g,t,images){
  if(root.UIBackdrop==='gradient'){const gradient=c.createLinearGradient(0,0,0,g);gradient.addColorStop(0,'#963c43');gradient.addColorStop(1,C.red);c.fillStyle=gradient}else c.fillStyle=C.red;c.fillRect(0,0,w,h);
  chunks(w,g,t,13,(scene,a,s)=>{for(const item of scene.rear)placed(c,images,item,a,g-item.lift*s,s)});
  chunks(w,g,t,42,(scene,a,s)=>{
   if(scene.monitor)placed(c,images,scene.monitor,a,g,s);
   for(const paper of scene.papers){
    const parent=scene.folders[paper.parent],im=images[parent.key];if(!im)continue;
    const folderHeight=parent.w*s*(im.height||100)/(im.width||100),note=images[paper.key];if(!note)continue;
    const noteHeight=paper.w*s*(note.height||100)/(note.width||100);
    prop(c,images,paper.key,a+paper.x*s,g-folderHeight-paper.exposed*s+noteHeight,paper.w*s,paper.angle,.02);
   }
   for(const item of scene.folders)placed(c,images,item,a,g,s);
  });
 }
 function foreground(c,w,h,g,t,images){
  const s=g/243*(root.innerWidth<650?.82:1),tw=1200*s,camera=t*95;
  c.fillStyle=C.dark;c.fillRect(0,h-8,w,8);
  for(let index=Math.floor(camera/tw)-1;index<=Math.floor((camera+w)/tw)+1;index++)for(const [key,x,desired,offset] of root.SceneLayout.layout(index+100003).foreground){
   const a=index*tw-camera;
   const im=images[key];if(!im)continue;
   const width=desired*s,height=width*(im.height||100)/(im.width||100),top=g+offset*s;
   prop(c,images,key,a+x*s,top+height,width);
  }
 }
 function groundShadows(c,w,g,t){
  chunks(w,g,t,42,(scene,a,s)=>{for(const item of [...scene.folders,...(scene.monitor?[scene.monitor]:[])])shadow(c,a+(item.x+item.w/2)*s,g,item.w*s*.78,3,.12)});
 }
 function errorWindow(c,x,y,w,h,title){
  if(typeof document!=='undefined'&&document.createElement&&root.PixelGrid){root.PixelGrid.draw(c,'window:'+title,x,y-5,w+6,h+10,tc=>rawWindow(tc,0,5,w,h,title));return}
  rawWindow(c,x,y,w,h,title);
 }
 function rawWindow(c,x,y,w,h,title){
  for(let i=2;i>=0;i--){c.fillStyle=C.black;c.fillRect(x+i*2,y-i*2,w,h);c.fillStyle=C.paper;c.fillRect(x+i*2+2,y-i*2+2,w-4,h-4)}
  c.fillStyle=C.black;c.fillRect(x+2,y+2,w-4,10);c.fillStyle=C.paper;c.font='12px MaratPixel,monospace';c.fillText('×',x+w-11,y+11);
  c.fillStyle=C.black;c.font='16px MaratPixel,monospace';c.fillText(title,x+5,y+h*.72);
 }
 root.LevelArt={background,foreground,errorWindow,prop,shadow,groundShadows};
})(window);

;
(function(root){'use strict';
const hazards={box:{w:72,h:44,offset:52},banner:{w:90,h:46,offset:134}},apps=['photoshop','figma','blender','illustrator'],rewards=[10,25,50,100];
const rows={low:56,middle:94,high:132};
const row=heights=>heights.map((height,i)=>({x:i*58,height})),referenceScale=53/34;
const formations=[
 {id:'low',points:row([56,56,56])},
 {id:'high',points:row([132,132,132])},
 {id:'rise',points:row([56,94,132])},
 {id:'arc-five',points:[[168,246],[241,162],[353,119],[466,161],[540,246]].map(([x,y],i)=>({x:(x-168)/referenceScale,height:i===0||i===4?56:132+(120-y)/referenceScale}))},
 {id:'arc-three',points:row([104,132,104])},
 {id:'fall',points:row([132,94,56])}
];
const patterns=formations.map(f=>f.points.map(p=>p.height));
function speed(elapsed,narrow=false){return Math.min(narrow?390:470,250+elapsed*3.2)}
function awardPoints(random=Math.random){return rewards[Math.floor(random()*4)]}
function makeWave(width,ground,elapsed,random=Math.random){const type=random()<.4?'banner':'box',d=hazards[type],x=width+60,phase=random()*Math.PI*2;const rare=random()<.07;const hazard={type,x,y:ground-d.offset,w:d.w,h:d.h,phase,label:rare?(random()<.5?'404':'ERROR'):(type==='banner'?['ДЕДЛАЙН','ОШИБКА']:['ПРАВКИ','ЛЕНЬ'])[phase<Math.PI?0:1]};const formation=formations[Math.floor(random()*formations.length)],points=formation.points,app=apps[Math.floor(random()*apps.length)],trap=elapsed>12&&random()<.30?(random()<.378?'rkn':'tiktok'):null,trapIndex=trap?Math.floor(random()*points.length):-1;
const meme=random()<.01;
const items=points.map((p,i)=>({type:i===trapIndex?trap:i===points.length-1?(meme?'indesign':'project'):'clock',app,x:x+d.w+130+p.x,y:ground-p.height,w:28,h:28,phase}));return {hazard,items,formation:formation.id,interval:Math.max(3.5,(d.w+130+points.at(-1).x+58+140)/speed(elapsed,width<400))+.35+random()*.35}}
root.SpawnRules={hazards,apps,rewards,rows,patterns,formations,speed,awardPoints,makeWave};if(typeof module!=='undefined')module.exports=root.SpawnRules;
})(typeof window==='undefined'?globalThis:window);

;
window.GAME_MUSIC=[{"id":"cantina-shinkonet","ogg":"music/cantina-shinkonet.ogg","mp3":"music/cantina-shinkonet.mp3"},{"id":"cirno-ziassan","ogg":"music/cirno-ziassan.ogg","mp3":"music/cirno-ziassan.mp3"},{"id":"comptine-yourworstnightmare","ogg":"music/comptine-yourworstnightmare.ogg","mp3":"music/comptine-yourworstnightmare.mp3"},{"id":"dragonflies-dualschix","ogg":"music/dragonflies-dualschix.ogg","mp3":"music/dragonflies-dualschix.mp3"},{"id":"entertainer-joplin","ogg":"music/entertainer-joplin.ogg","mp3":"music/entertainer-joplin.mp3"},{"id":"happy-sthebomb","ogg":"music/happy-sthebomb.ogg","mp3":"music/happy-sthebomb.mp3"}];
;
(function(root){
 'use strict';
 const tunes={click:[[720,.035],[480,.035]],jump:[[330,.045],[494,.045],[740,.07]],crouch:[[280,.045],[140,.06]],clock:[[784,.05],[1047,.08]],project:[[988,.045],[1319,.075]],start:[[523,.045],[659,.045],[784,.09]],lose:[[392,.09],[330,.09],[262,.11],[131,.2]],hit:[[160,.045],[80,.07],[45,.09]],distract:[[660,.05],[440,.05],[220,.13]]};
 let ctx,master,musicGain,fxGain,media,bag=[],last=-1,enabled=true,running=false,freshPending=false,sourceFallback=false,failures=0,generation=0;
 const voices=new Set(),tracks=root.GAME_MUSIC||[];
 function setup(){
  if(ctx)return ctx;
  try{ctx=new(root.AudioContext||root.webkitAudioContext)();master=ctx.createGain();master.gain.value=.7;master.connect(ctx.destination);musicGain=ctx.createGain();musicGain.gain.value=.34;musicGain.connect(master);fxGain=ctx.createGain();fxGain.gain.value=.075;fxGain.connect(master);
   media=new root.Audio();media.preload='none';media.volume=1;media.hidden=true;media.setAttribute?.('aria-hidden','true');if(root.document?.body)root.document.body.append(media);
   ctx.createMediaElementSource(media).connect(musicGain);
   media.addEventListener('ended',()=>{if(running&&enabled){choose();play()}});
   media.addEventListener('error',()=>{if(!running||!enabled)return;const track=tracks[last];if(track&&!sourceFallback){sourceFallback=true;media.src=track.mp3;play()}else if(++failures<tracks.length){choose();play()}});
  }catch{ctx=null;return null}return ctx;
 }
 function unlock(){const c=setup();if(c&&c.state!=='running')c.resume().catch(()=>{});return c}
 function choose(){
  if(!tracks.length)return;
  if(!bag.length){bag=tracks.map((_,i)=>i);for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}if(bag.length>1&&bag[0]===last)[bag[0],bag[1]]=[bag[1],bag[0]]}
  last=bag.shift();sourceFallback=false;media.src=media.canPlayType('audio/ogg; codecs="vorbis"')?tracks[last].ogg:tracks[last].mp3;freshPending=false;
 }
 function play(){if(!running||!enabled||!unlock())return;if(freshPending||last<0)choose();if(last<0)return;generation++;const result=media.play();if(result&&result.then)result.then(()=>{if(!running||!enabled)media.pause()}).catch(()=>{});}
 function silence(){generation++;if(media)media.pause()}
 function sfx(name){if(!enabled||!unlock())return;const notes=tunes[name]||tunes.click;let when=ctx.currentTime;
  for(const [frequency,duration] of notes){while(voices.size>=12){const old=voices.values().next().value;try{old.stop()}catch{}voices.delete(old)}const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='square';osc.frequency.setValueAtTime(frequency,when);gain.gain.setValueAtTime(.001,when);gain.gain.linearRampToValueAtTime(.65,when+.003);gain.gain.setValueAtTime(.65,when+Math.max(.004,duration-.008));gain.gain.linearRampToValueAtTime(.001,when+duration);osc.connect(gain);gain.connect(fxGain);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect()};osc.start(when);osc.stop(when+duration+.002);when+=duration;
  }
 }
 root.GameAudio={sfx,startRun(fresh=true){running=true;failures=0;if(fresh){freshPending=true;silence()}play()},pause(){running=false;silence()},stop(){running=false;freshPending=true;silence();if(media)media.currentTime=0},setEnabled(value){enabled=!!value;if(!enabled){silence();for(const voice of voices){try{voice.stop()}catch{}}voices.clear()}else if(running)play()}};
})(window);

;
window.KEY_SOUNDS={"on":"url(\"assets/badfd2c147e569d2486c.png\")","off":"url(\"assets/bb6fdcaa3bacc7ced3ba.png\")"};
'use strict';
const $=id=>document.getElementById(id),canvas=$('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
let H=320,G=243,PX=150,W=960,mode='ready',elapsed=0,time=30,score=0,best=0,y=0,vy=0,duck=false;
let invincible=0,spawn=1.8,objects=[],last=0,sound=true,audio,land=0,player='Гость',ready=false,reason='deadline',notice='',noticeTime=0,travel=0,phoneTime=0;
let lastTimePenalty=null;
let projectTotal=0,projectCounts={},effects=[],dust=[],dustClock=0,needsDraw=true;
const images={},frames=window.SPRITE_FRAMES,spriteCache=new Map();
try{best=Number(localStorage.getItem('marat19-beta-best'))||0;$('name').value=localStorage.getItem('marat19-name')||''}catch{}
$('best').textContent=best;
Promise.all(Object.keys(window.GAME_IMAGES).map(key=>new Promise((resolve,reject)=>{
  const im=new Image();im.onload=()=>{images[key]=prepareImage(im,key);resolve()};im.onerror=reject;im.src=window.GAME_IMAGES[key];
}))).then(()=>{ready=true;needsDraw=true;$('closeMenu').disabled=false;$('start').disabled=false;$('start').textContent='ПОГНАЛИ →'}).catch(()=>{$('assetError').textContent='Не загрузились материалы. Обнови страницу.'});
function resize(){
  needsDraw=true;spriteCache.clear();
  H=canvas.clientWidth<650?500:320;G=Math.round(H*(canvas.clientWidth<650?.70:.76));
  canvas.width=Math.round(canvas.clientWidth/2);canvas.height=Math.round(canvas.clientHeight/2);
  W=H*canvas.clientWidth/canvas.clientHeight;PX=Math.max(canvas.clientWidth<650?48:56,Math.min(190,W*(canvas.clientWidth<650?.19:.22)));
  if(window.PixelGrid)window.PixelGrid.configure(canvas.width/W,canvas.height/H);
  if(mode==='running')pause();
}
addEventListener('resize',resize);resize();
if(document.fonts)document.fonts.ready.then(()=>{window.PixelGrid.configure(canvas.width/W,canvas.height/H);needsDraw=true});
function prepareImage(im,key){
  // Keep the user's shared icon canvas and alpha: trimming would alter relative sizes.
  if(key.startsWith('coin-'))return im;
  const character=key==='character-v4'||key in frames||key==='phone-idle';
  if(!im.naturalWidth)return im;
  const layer=document.createElement('canvas');layer.width=im.naturalWidth;layer.height=im.naturalHeight;
  const lc=layer.getContext('2d',{willReadFrequently:true});lc.imageSmoothingEnabled=false;lc.drawImage(im,0,0);
  const data=lc.getImageData(0,0,layer.width,layer.height);

  if(character)window.PixelPalette.monochrome(data.data);
  let left=layer.width,top=layer.height,right=-1,bottom=-1;
  for(let i=0;i<data.data.length;i+=4){
    if(data.data[i+3]===0)continue;
    if(!character){const d=data.data,r=d[i],g=d[i+1],b=d[i+2];if((r===241&&g===234&&b===217)||(r===242&&g===236&&b===223)){d[i]=242;d[i+1]=236;d[i+2]=222}else if(r===242&&g===223&&b===183){d[i]=243;d[i+1]=232;d[i+2]=208}}

    const x=(i/4)%layer.width,y=Math.floor(i/4/layer.width);
    left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);
  }
  lc.putImageData(data,0,0);
  if(key==='phone-idle')frames[key]=[[left,top,right-left+1,bottom-top+1]];
  if(character||right<0)return layer;
  const cut=document.createElement('canvas');cut.width=right-left+1;cut.height=bottom-top+1;
  cut.getContext('2d').drawImage(layer,left,top,cut.width,cut.height,0,0,cut.width,cut.height);return cut;
}
function tone(freq){if(!sound)return;if(window.GameAudio)window.GameAudio.sfx(({550:'start',170:'lose',440:'jump',660:'click',150:'distract',900:'clock',700:'project'})[freq]||'click')}
function show(top,title,message,button){
  needsDraw=true;$('overline').textContent=top;$('title').textContent=title;$('message').textContent=message;
  $('start').textContent=button;$('nameLabel').hidden=true;$('overlay').hidden=false;$('start').focus();
}
function start(){
  if(!ready)return;
  needsDraw=true;
  if(mode==='paused'){mode='running';last=0}else{
    player=$('name').value.trim()||'Гость';try{localStorage.setItem('marat19-name',player)}catch{}
    mode='running';elapsed=0;time=30;score=0;y=0;vy=0;invincible=0;spawn=1.8;objects=[];land=0;last=0;reason='deadline';notice='';noticeTime=0;travel=0;phoneTime=0;projectTotal=0;lastTimePenalty=null;projectCounts={};effects=[];dust=[];dustClock=0;duckVisual=false;duckChangedAt=-10;window.SceneLayout.reset();
  }
  duck=false;$('overlay').hidden=true;$('pause').disabled=false;$('start').blur();$('name').blur();$('closeMenu').blur();sync();tone(550);
}
function sync(){
  $('projects').textContent=projectTotal;
  for(const app of window.SpawnRules.apps)$('count-'+app).textContent=projectCounts[app]||0;
  $('time').textContent='00:'+String(Math.ceil(Math.max(0,time))).padStart(2,'0');
  $('score').textContent=String(score+Math.floor(elapsed*10)).padStart(4,'0');
  $('status').textContent=noticeTime>0?notice:elapsed<5?'↑ ПРЫЖОК · ↓ ПРИСЕСТЬ':'ЕЩЁ НЕМНОГО — И ВЫЛОЖУ';
}
function tell(message){notice=message;noticeTime=2.3}
function finish(cause='deadline'){
  mode='over';reason=cause;duck=false;time=0;$('pause').disabled=true;
  const total=score+Math.floor(elapsed*10);
  if(total>best){best=total;try{localStorage.setItem('marat19-beta-best',best)}catch{}$('best').textContent=best}
  sync();
    const tik=cause==='tiktok',rkn=cause==='rkn';
  $('status').textContent=tik?'ВЫ ЗАЛИПЛИ В TIKTOK':rkn?'ВАШ VPN ЗАБЛОКИРОВАН':'ДЕДЛАЙН НАСТУПИЛ';
  show(tik?'ОДНО ВИДЕО И ВСЁ…':rkn?'РКН ПЕРЕДАЁТ ПРИВЕТ':'ПРОЕКТЫ ЕСТЬ. ВРЕМЕНИ НЕТ.',
    tik?'Вы залипли в TikTok':rkn?'Ваш VPN заблокирован':player+', дедлайн!',
    (tik?'Телефон победил. ':rkn?'РКН завершил забег. ':'')+'Счёт: '+total+'. Продержался '+Math.floor(elapsed)+' сек.',
    'ЕЩЁ ПОПЫТКУ →');tone(170);
}
function pause(){if(mode!=='running')return;mode='paused';duck=false;$('status').textContent='ПАУЗА';show('ВЫДОХНИ','Даже дедлайн подождёт.','Продолжим с того же места.','ПРОДОЛЖИТЬ →')}
function jump(){if(mode==='running'&&phoneTime<=0&&y===0){duck=false;vy=650;land=0;tone(440)}}
$('start').onclick=start;$('closeMenu').onclick=start;$('pause').onclick=pause;
function enterGame(){$('intro').hidden=true;$('gameMain').inert=false;document.body.classList.remove('intro-on');needsDraw=true;resize();$('name').focus()}
$('introEnter').onclick=enterGame;
$('sound').onclick=()=>{sound=!sound;$('sound').style.setProperty('--key-face',window.KEY_SOUNDS[sound?'on':'off']);$('sound').setAttribute('aria-label',sound?'Выключить звук':'Включить звук');$('sound').setAttribute('aria-pressed',String(sound));tone(660)};
function setKey(id,value){$(id).classList.toggle('pressed',value)}
function hold(id,down,up){
  const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture(e.pointerId);setKey(id,true);down()});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,()=>{setKey(id,false);up()});
  el.addEventListener('contextmenu',e=>e.preventDefault());
}
for(const id of ['jump','space'])hold(id,jump,()=>{});
for(const id of ['duck','shift'])hold(id,()=>{if(mode==='running'&&phoneTime<=0)duck=true},()=>duck=false);
// Gestures act only on the playfield; menus and controls keep their own clicks.
let gesture=null;
function applyGesture(dx,dy,duration){
 if(mode!=='running'||phoneTime>0)return;
 if(Math.abs(dy)>=24&&Math.abs(dy)>Math.abs(dx)*1.15){if(dy>0){duck=true;if(window.GameSound)window.GameSound.crouch()}else jump();return}
 if(Math.hypot(dx,dy)<=12&&duration<=450)jump();
}
canvas.addEventListener('pointerdown',e=>{
 if(e.isPrimary===false||e.button>0||mode!=='running')return;
 e.preventDefault();canvas.setPointerCapture(e.pointerId);gesture={id:e.pointerId,x:e.clientX,y:e.clientY,time:e.timeStamp};
});
canvas.addEventListener('pointerup',e=>{
 if(!gesture||gesture.id!==e.pointerId)return;
 const start=gesture;gesture=null;applyGesture(e.clientX-start.x,e.clientY-start.y,e.timeStamp-start.time);
});
for(const event of ['pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>gesture=null);
const keyBindings={Space:'space',ArrowUp:'jump',ArrowDown:'duck',ShiftLeft:'shift',ShiftRight:'shift'};
addEventListener('keydown',e=>{
 if(!$('intro').hidden){if(['Space','Enter'].includes(e.code)){e.preventDefault();enterGame()}return}
 if(e.target.tagName==='INPUT'){if(e.code==='Enter'){e.preventDefault();start()}return}
 const id=keyBindings[e.code];if(id){e.preventDefault();setKey(id,true);if(e.repeat||mode!=='running')return;if(id==='duck'||id==='shift'){if(phoneTime<=0)duck=true}else jump()}
 if(e.code==='Escape')pause();
});
addEventListener('keyup',e=>{const id=keyBindings[e.code];if(id){setKey(id,false);if(id==='duck'||id==='shift')duck=$('duck').classList.contains('pressed')||$('shift').classList.contains('pressed')}});
addEventListener('blur',()=>{for(const id of Object.values(keyBindings))setKey(id,false);pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function text(s,x,y,size=13,color='#f2ecde'){ctx.fillStyle=color;ctx.font='bold '+size+'px Courier New';ctx.fillText(s,Math.round(x),Math.round(y))}
// Every pose uses one scale and the registered floor pivot, including airborne feet.
let duckVisual=false,duckChangedAt=-10;
function characterHitboxHeight(){
 const key=y>0?'jump-4':duck?'duck-4':'run-8';
 const index=y>0?(vy>530?0:vy>80?1:2):duck?1+Math.floor(elapsed*8)%2:Math.floor(elapsed*10)%8;
 const pose=window.CHARACTER_V4.frames[key][index];
 return Math.min(103,-(pose.bodyY??pose.y)*114/window.CHARACTER_V4.standingVisibleHeight-2);
}
function sprite(key,index,height,bottom=G){
 const f=frames[key]?.[index],registration=window.CHARACTER_V4.frames[key]?.[index],im=images['character-v4'];
 if(!f||!registration||!im)return;
 const scale=114/window.CHARACTER_V4.standingVisibleHeight,sx=canvas.width/W,sy=canvas.height/H;
 const width=f[2]*scale,heightV4=f[3]*scale,dw=Math.max(1,Math.round(width*sx)),dh=Math.max(1,Math.round(heightV4*sy));
 const cacheKey=['v4',key,index,dw,dh].join(':');let tile=spriteCache.get(cacheKey);
 if(!tile&&document.createElement){
  tile=document.createElement('canvas');tile.width=dw+2;tile.height=dh+2;
  const tc=tile.getContext('2d',{willReadFrequently:true});tc.imageSmoothingEnabled=false;
  tc.drawImage(im,...f,1,1,dw,dh);const pixels=tc.getImageData(0,0,tile.width,tile.height);
  window.PixelPalette.softenInteriorCorners(pixels.data,tile.width,tile.height);
  window.PixelPalette.softenCorners(pixels.data,tile.width,tile.height,48);tc.putImageData(pixels,0,0);
  spriteCache.set(cacheKey,tile);
 }
 // Two render pixels place the feet over the floor's dark top edge.
 const left=Math.round((PX+registration.x*scale)*sx),top=Math.round((bottom+registration.y*scale)*sy)+2;
 ctx.imageSmoothingEnabled=false;
 if(tile)ctx.drawImage(tile,(left-1)/sx,(top-1)/sy,tile.width/sx,tile.height/sy);
 else ctx.drawImage(im,...f,left/sx,top/sy,width,heightV4);
}
function drawCharacterV4(){
 if(duck!==duckVisual){duckVisual=duck;duckChangedAt=elapsed}
 if(phoneTime>0||(mode==='over'&&reason==='tiktok'))sprite('phone-idle',0,114);
 else if(mode==='over')sprite('states-4',2,114);
 else if(invincible>1.2)sprite('states-4',1,114,G-y);
 else if(invincible<=0||Math.floor(invincible*12)%2===0){
  if(mode==='ready')sprite('states-4',0,114);
  else if(y>0)sprite('jump-4',vy>530?0:vy>80?1:2,114,G-y);
  else if(duck){const age=elapsed-duckChangedAt;sprite('duck-4',age<.1?0:1+Math.floor((age-.1)*8)%2,114)}
  else if(elapsed-duckChangedAt<.1)sprite('duck-4',3,114);
  else if(land>0)sprite('jump-4',3,114);
  else sprite('run-8',Math.floor(elapsed*10)%8,114);
 }
}

function objectY(o){
  if(o.row)return o.y;return o.y+Math.sin(elapsed*2.2+(o.phase||0))*(1.5/(canvas.height/H));
}
function drawObjects(){
  for(const o of objects){
    if(o.used)continue;
    const oy=objectY(o),coin=['clock','project','rkn','tiktok','indesign'].includes(o.type);
    const cx=coin?o.x:o.x+o.w/2,above=G-(coin?oy+o.h/2:oy+o.h);
    if(above<145)window.LevelArt.shadow(ctx,cx,G,coin?24:o.w*.85,3,Math.max(.07,.29-above/700));
    if(coin){
      const key='coin-'+(o.type==='project'?(o.app||'photoshop'):o.type);
      const im=images[key],width=im?34*(im.width||im.naturalWidth||256)/(im.height||im.naturalHeight||256):34;
      window.LevelArt.prop(ctx,images,key,o.x-width/2,oy+17,width);continue;
    }
    window.LevelArt.errorWindow(ctx,o.x,oy,o.w,o.h,o.label||(o.type==='banner'?'ДЕДЛАЙН':'ПРАВКИ'));
  }
}
function draw(){
  ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.imageSmoothingEnabled=false;
  window.LevelArt.background(ctx,W,H,G,travel,images);rect(0,G,W,H-G,'#f3e8d0');
  if(images.floor){const fh=(H-G)*(canvas.clientWidth<650?.75:1.12),fw=fh*images.floor.width/images.floor.height;for(let fx=0;fx<W;fx+=fw)ctx.drawImage(images.floor,Math.round(fx),G,fw,fh)}
  // Background props do not cast shadows on the running lane.
  window.LevelArt.shadow(ctx,PX,G-4,Math.max(24,48-y*.13),4,Math.max(.09,.32-y/650));
  drawEffects(false);drawObjects();
  drawCharacterV4();
  window.LevelArt.foreground(ctx,W,H,G,travel,images);
  drawEffects(true);
}
const projectPhrases={figma:['Ещё один кейс готов','Теперь вёрстка','Фигма фигма бой'],blender:['Так, теперь шейдинг','Осталось отрендерить','Чёт зависло…'],photoshop:['Опять вылетел','Ща зафотошопим','Файл, Сохранить как...'],illustrator:['Осталось сохранить в SVG','Трассировка изображения...','Ща шрифт подберём']};
const generalPhrases=['Steb by Steb','Нужна концепция','Iron Size','Сквозь тернии\nк звёздам','Face op table','От количества\nк качеству','Бегущий Марат\nмхом не зарастёт','Мне уже 19 лет...','У меня всё получится','Спасибо, что играешь <3'];
function projectPhrase(app,random=Math.random){const roll=random(),list=projectPhrases[app];if(!list||roll<.60)return null;const choices=roll<.85?list:generalPhrases;return choices[Math.min(choices.length-1,Math.floor(random()*choices.length))]}
const tiktokCommon=['Залип в тиктоке','Надо репостнуть'],tiktokRare=['Я тебя могну','Учу танец аэрогриля','Блин, ещё дизпроект делать…','Учу лезгинку','Инста лучше','[Стикер]','ВАЙБКОДЕРЫЫЫЫ','beta 0.8.0'];
function tiktokPhrase(random=Math.random){const roll=random(),list=roll<.6?tiktokCommon:tiktokRare,fraction=roll<.6?roll/.6:(roll-.6)/.4;return list[Math.min(list.length-1,Math.floor(fraction*list.length))]}
function update(dt){
  tickEffects(dt);
  if(phoneTime>0){phoneTime=Math.max(0,phoneTime-dt);sync();return}
  if(y===0){dustClock+=dt;if(dustClock>.075){dustClock=0;dust.push({x:PX-22+Math.random()*34,y:G+1+Math.random()*2,vx:-30-Math.random()*30,vy:-15-Math.random()*20,life:.4,size:1+Math.floor(Math.random()*2)})}}
  elapsed+=dt;time=Math.max(0,time-dt);noticeTime=Math.max(0,noticeTime-dt);invincible=Math.max(0,invincible-dt);land=Math.max(0,land-dt);
  const wasAir=y>0;vy-=1800*dt;y=Math.max(0,y+vy*dt);if(y===0){vy=0;if(wasAir)land=.1}
  const speed=window.SpawnRules.speed(elapsed,W<400);travel+=speed/250*dt;spawn-=dt;
  if(spawn<=0){const wave=window.SpawnRules.makeWave(W,G,elapsed);objects.push(wave.hazard,...wave.items);spawn=wave.interval}
  const ph=characterHitboxHeight(),p={x:PX-17,y:G-y-ph,w:34,h:ph};
  for(const o of objects){
    o.x-=speed*dt;
    const pickup=['clock','project','rkn','tiktok','indesign'].includes(o.type),ox=pickup?o.x-o.w/2:o.x,oy=objectY(o)-(pickup?o.h/2:0);
    if(o.used||p.x>=ox+o.w||p.x+p.w<=ox||p.y>=oy+o.h||p.y+p.h<=oy)continue;
    if(o.type==='rkn'){o.used=true;finish('rkn');return}
    if(o.type==='tiktok'){o.used=true;time*=.5;lastTimePenalty='tiktok';phoneTime=1.8;y=0;vy=0;duck=false;effects.push({x:PX+32,y:G-115,text:tiktokPhrase(),kind:'tiktok',life:2.2});tell('ЗАЛИП В TIKTOK · −½ ВРЕМЕНИ');tone(150);sync();return}
    if(o.type==='indesign'){o.used=true;effects.push({x:PX+32,y:G-y-145,text:'Кто им вообще пользуется?',kind:'indesign',life:2.2});tell('Кто им вообще пользуется?');tone(700);continue}
    if(pickup){
      o.used=true;
      if(o.type==='clock'){time=Math.min(45,time+3);tell('+3 СЕКУНДЫ');effects.push({x:o.x,y:objectY(o),text:'+3 СЕК',life:.8});tone(900)}
      else{const points=window.SpawnRules.awardPoints();score+=points;projectTotal++;const app=o.app||'photoshop';projectCounts[app]=(projectCounts[app]||0)+1;effects.push({x:o.x,y:objectY(o),text:'+'+points,life:.8});const phrase=projectPhrase(app);if(phrase&&!effects.some(p=>p.kind==='project'))effects.push({x:PX+32,y:G-y-145,text:phrase,kind:'project',life:1.8});tell('+1 ПРОЕКТ · '+app.toUpperCase()+' · +'+points);tone(700)}
    }else if(invincible<=0){
      o.used=true;lastTimePenalty='deadline';time=Math.max(0,time-10);invincible=1.5;
      tell((o.label||'ПРАВКИ')+': −10 СЕК');if(window.GameSound)window.GameSound.hit();else tone(150);
      if(time<=0){finish(o.type==='rkn'?'rkn':'deadline');return}
    }
  }
  objects=objects.filter(o=>o.x>-100&&!o.used);
  sync();if(time<=0)finish(lastTimePenalty==='tiktok'?'tiktok':'deadline');
}
function tickEffects(dt){
 for(const p of dust){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=65*dt}
 dust=dust.filter(p=>p.life>0).slice(-40);
 for(const p of effects){p.life-=dt;p.y-=23*dt;p.x-=25*dt}
 effects=effects.filter(p=>p.life>0).slice(-20);
}
function drawEffects(labels){
 ctx.save();
 if(labels&&window.drawMockLabels){window.drawMockLabels(effects,W,H);ctx.restore();return}
 if(labels){const sx=canvas.width/W,sy=canvas.height/H;ctx.setTransform(1,0,0,1,0,0);ctx.font='10px Pixeloid,monospace';ctx.textAlign='center';ctx.fillStyle='#f2ecde';
  for(const p of effects){ctx.globalAlpha=Math.min(1,p.life*5);ctx.fillText(p.text,Math.round(p.x*sx),Math.round((p.y-8)*sy))}
 }else {const sx=canvas.width/W,sy=canvas.height/H;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#241a20';ctx.globalAlpha=1;for(const p of dust)ctx.fillRect(Math.round(p.x*sx),Math.round(p.y*sy),p.size,p.size)}
 ctx.restore();
}
function loop(t){
 const dt=last?Math.min((t-last)/1000,.05):0;last=t;
 if(mode==='running')update(dt);
 if($('intro').hidden&&(mode==='running'||needsDraw)){draw();needsDraw=false}
 requestAnimationFrame(loop);
}requestAnimationFrame(loop);


;
'use strict';
document.body.classList.remove('variant-b');
function setBackdrop(value){window.UIBackdrop=value==='gradient'?'gradient':'solid';document.body.classList.toggle('backdrop-gradient',window.UIBackdrop==='gradient');needsDraw=true}
setBackdrop('solid');
const labelLayer=document.createElement('div');labelLayer.className='score-labels';labelLayer.setAttribute('aria-hidden','true');document.querySelector('.track').append(labelLayer);
const labelPool=Array.from({length:20},()=>{const el=document.createElement('span');el.hidden=true;labelLayer.append(el);return el});
window.drawMockLabels=(items,w,h)=>{labelPool.forEach((el,i)=>{const p=items[i];el.hidden=!p;if(!p)return;if(el.textContent!==p.text)el.textContent=p.text;const note=['tiktok','project','indesign'].includes(p.kind);el.className=note?'pickup-note':'';el.style.left=note?'clamp(min(140px, 50%), '+(p.x/w*100)+'%, max(50%, calc(100% - 140px)))':(p.x/w*100)+'%';el.style.top=((p.y-8)/h*100)+'%';el.style.opacity=Math.min(1,p.life*5)})};
const oldIntro=document.querySelector('.intro-character'),introFigure=document.createElement('figure');introFigure.className='intro-avatar';
introFigure.innerHTML='<img src="assets/880bd48cb4c4e1dcbf51.png" width="151" height="256" alt="Марат в праздничном колпаке"><svg class="intro-blink" viewBox="0 0 151 256" aria-hidden="true" shape-rendering="crispEdges"><path fill="#f2ecde" d="M75 60h6v4h-6zM92 60h6v4h-6z"/><path fill="#111111" d="M76 63h5v1h-5zM93 63h5v1h-5z"/></svg>';
oldIntro.replaceWith(introFigure);
const cake='<img class="cake" src="assets/d354a8a8f3f64b9855e7.png" alt="Торт">';
let mockDeaths=0,customScreen=false,savedScreen=null,endHeadline=null,endOverline=null;
function chooseEndTitle(cause,random=Math.random){
 const roll=random();
 if(cause==='rkn'){const list=roll<.6?['Ваш VPN заблокировали','Опять VPN не работает']:['Чат ГПТ опять не грузит(','Чёт не грузит мой VPN','Попробую поменять сервер'];const fraction=roll<.6?roll/.6:(roll-.6)/.4;return list[Math.min(list.length-1,Math.floor(fraction*list.length))]}
 const common=['Всё ещё успеем!','Всё получится!','Да ещё навайбкодим','Сквозь тернии\nк звёздам!'];
 if(cause==='tiktok'&&roll>=.8)return ['Это всё ваш Тикток','Да я всего 5 минут посидеть зашёл'][Math.min(1,Math.floor((roll-.8)/.2*2))];
 return common[Math.min(3,Math.floor((cause==='tiktok'?roll/.8:roll)*4))];
}
function chooseRknOverline(random=Math.random){return ['РКН передаёт привет','РКН заблокировал ваш VPN','Новая партия блокировочек от РКН','Придётся в Гигачате вайбкодить('][Math.min(3,Math.floor(random()*4))]}
const card=document.querySelector('.card'),helpButton=document.createElement('button');
helpButton.className='mock-help key key-help';helpButton.setAttribute('aria-label','Как играть');document.querySelector('.controls').append(helpButton);
const controls=document.querySelector('.controls');for(const el of [helpButton,$('sound'),$('duck'),$('jump')])controls.append(el);
const slogans=['Проектов много, времени мало.','Ты всё успеешь!','Ещё нужно на Behance выложить','Дедлайн уже близко!'];document.querySelector('header a').textContent=slogans[Math.floor(Math.random()*slogans.length)];document.querySelector('header span').textContent='';
const extra=document.createElement('div');extra.id='mock-extra';card.insertBefore(extra,$('help'));
function clearExtra(){extra.innerHTML='';extra.classList.remove('help-actions');$('start').hidden=false;$('help').hidden=false;customScreen=false}
const originalShow=show;show=function(...args){clearExtra();originalShow(...args);if(mode==='over')renderEnd()};
const originalFinish=finish;finish=function(...args){if(mode==='over')return;endHeadline=chooseEndTitle(args[0]||'deadline');endOverline=args[0]==='rkn'?chooseRknOverline():null;mockDeaths++;originalFinish(...args);if(window.GameAudio)window.GameAudio.stop();saveResult()};
const originalStart=start;start=function(){const resumed=mode==='paused';if(!resumed){endHeadline=null;endOverline=null}clearExtra();originalStart();if(mode==='running'&&window.GameAudio)window.GameAudio.startRun(!resumed)};$('start').onclick=start;$('closeMenu').onclick=start;
const beforeAudioPause=pause;pause=function(){beforeAudioPause();if(window.GameAudio)window.GameAudio.pause()};$('pause').onclick=pause;
const beforeAudioToggle=$('sound').onclick;$('sound').onclick=()=>{beforeAudioToggle();if(window.GameAudio){window.GameAudio.setEnabled(sound);if(sound)window.GameAudio.sfx('click')}};
function menu(){mode='ready';clearExtra();$('overline').textContent='';$('title').innerHTML='<span class="mock-intro">Проектов много, а времени мало.<br><strong>Нужно всё успеть!</strong></span>';$('message').innerHTML='Собирай <strong>проекты</strong> — они дают очки.<br><strong>Часы</strong> добавят время.<br>Остальное — в меню с кубком.';$('nameLabel').hidden=false;$('nameLabel').firstChild.textContent='Как тебя зовут?';$('name').placeholder='Твой ник';$('start').textContent=ready?'ПОГНАЛИ ›':'ЗАГРУЗКА…';$('overlay').hidden=false;setHelp()}
function setHelp(){$('help').innerHTML=matchMedia('(max-width:650px)').matches?'Свайп ↑ — прыжок · свайп ↓ — присесть':'Пробел / ↑ — прыжок · Shift / ↓ — присесть'}
function renderEnd(){$('overline').textContent=reason==='rkn'?(endOverline||(endOverline=chooseRknOverline())):'ЗАБЕГ ЗАВЕРШЁН';if(!endHeadline)endHeadline=chooseEndTitle(reason);$('title').textContent=endHeadline;$('message').innerHTML='<div class="mock-result"><div><strong>'+$('score').textContent+'</strong><span>ОЧКОВ</span></div><div><strong>'+$('projects').textContent+'</strong><span>ПРОЕКТОВ</span></div></div>';$('start').textContent='ЕЩЁ ПОПЫТКУ';setHelp();if(mockDeaths>=2){$('start').hidden=true;extra.innerHTML='<div class="mock-gift"><button class="mock-button" id="retryMock">Ещё раз</button><button class="mock-button" id="giftMock">'+cake+'Поздравить</button></div><p class="gift-note">Мне 19. Твоё поздравление — уже подарок.</p>';$('retryMock').onclick=start;$('giftMock').onclick=gift}}
function saveScreen(){savedScreen={mode};if(mode==='running')pause()}
function restoreScreen(){if(!savedScreen){menu();return}const prior=savedScreen;savedScreen=null;customScreen=false;extra.innerHTML='';if(prior.mode==='running'||prior.mode==='paused'){show('ВЫДОХНИ','Даже дедлайн подождёт.','Продолжим с того же места.','ПРОДОЛЖИТЬ ›');mode='paused';setHelp()}else if(prior.mode==='over'){mode='over';show('','Всё ещё успеем.','','ЕЩЁ ПОПЫТКУ');renderEnd()}else menu();$('closeMenu').onclick=start}
function custom(title,html){customScreen=true;$('overline').textContent='';$('title').textContent=title;$('message').innerHTML=html;$('nameLabel').hidden=true;$('start').hidden=true;$('help').hidden=true;$('overlay').hidden=false;extra.innerHTML='';$('closeMenu').onclick=restoreScreen}
function gift(){saveScreen();custom('С днём рождения меня!',cake+'<p>Если хочешь поздравить —<br>можно оставить подарок.</p><div class="banklinks"><a class="mock-button" href="https://messenger.sbrf.ru/sl/bfmVTvNxY1a8VskrP" target="_blank" rel="noopener noreferrer">Сбер &gt;</a><a class="mock-button" href="https://t.tb.ru/pm_short/6dgwuLH4A2f" target="_blank" rel="noopener noreferrer">Т-Банк &gt;</a></div><p class="gift-note">Откроется страница банка.<br>Сумму выбираешь сам.</p>');extra.innerHTML='<button class="mock-button" id="backMock">Вернуться в игру</button>';$('backMock').onclick=restoreScreen}
helpButton.onclick=()=>{saveScreen();custom('Как всё успеть?', '<div class="gesture-card"><div><strong>↑</strong>прыжок</div><div><strong>↓</strong>присесть</div></div><div class="rules"><div class="rule"><img src="assets/3f75302e56df81228124.png" alt="Часы"><span><strong>Часы</strong> · +3 секунды</span></div><div class="rule"><img src="assets/bc5a893bfd0e9688a2e4.png" alt="Проект"><span><strong>Проекты</strong> · +10–100 очков</span></div><div class="rule"><img src="assets/6dd8b91952b87b923ae9.png" alt="TikTok"><span><strong>TikTok</strong> · − половина времени</span></div><div class="rule"><svg class="mini-window" viewBox="0 0 32 24" aria-label="Окно ошибки" shape-rendering="crispEdges"><path fill="#191719" d="M0 0h30v22H0zM2 22h30v2H2z"/><path fill="#f2ecde" d="M2 7h26v13H2zM23 2h4v3h-4z"/></svg><span><strong>Окна</strong> · −10 секунд</span></div><div class="rule"><img src="assets/4e6a010eebe88da4fffa.png" alt="РКН"><span><strong>РКН</strong> · конец забега</span></div></div><hr><p class="gift-note">На телефоне: свайп вверх — прыжок,<br>вниз — присесть. Тап тоже прыжок.</p>');extra.innerHTML='<button class="mock-button" id="backMock">Понятно ›</button>';$('backMock').onclick=restoreScreen};
// Prevent browser gestures on the playfield; native fields and buttons retain clicks.
document.addEventListener('touchmove',e=>{if(!e.target.closest('input,.history-list,.card,.progress-shell .content'))e.preventDefault()},{passive:false});
const historyKey='marat19-history-v1';let runHistory=[],storageWorks=true,bestProjects=0;
try{bestProjects=Number(localStorage.getItem('marat19-best-projects'))||0;const loaded=JSON.parse(localStorage.getItem(historyKey)||'[]');if(Array.isArray(loaded))runHistory=loaded.filter(r=>Number.isFinite(r.score)&&Number.isFinite(r.projects)&&Number.isFinite(r.seconds)).slice(0,10)}catch{storageWorks=false}
bestProjects=Math.max(bestProjects,...runHistory.map(r=>r.projects),0);
function saveResult(){bestProjects=Math.max(bestProjects,projectTotal);try{localStorage.setItem('marat19-best-projects',String(bestProjects))}catch{}updateRecord();const row={score:score+Math.floor(elapsed*10),projects:projectTotal,seconds:Math.floor(elapsed),date:Date.now()};runHistory.unshift(row);runHistory=runHistory.slice(0,10);try{localStorage.setItem(historyKey,JSON.stringify(runHistory));storageWorks=true}catch{storageWorks=false}}
function updateRecord(){const el=document.querySelector('footer span:last-child');if(el)el.textContent='Рекорд на устройстве: '+best+' очков · максимум '+bestProjects+' проектов'}
updateRecord();
function openHistory(){custom('Мои результаты','<p>Рекорд на этом устройстве: <strong>'+best+'</strong> очков<br>Максимум проектов: <strong>'+bestProjects+'</strong></p><div class="history-list">'+(runHistory.length?runHistory.map(r=>'<div><b>'+r.score+'</b> очков · '+r.projects+' проектов · '+r.seconds+' сек.</div>').join(''):'Пока нет завершённых забегов.')+'</div><p class="gift-note">'+(storageWorks?'Последние 10 забегов сохраняются в этом браузере.':'Браузер запретил сохранение. Результаты доступны до закрытия страницы.')+'</p>');extra.innerHTML='<button class="mock-button" id="backMock">Назад &gt;</button>';$('backMock').onclick=restoreScreen}
const openRules=helpButton.onclick;helpButton.onclick=()=>{openRules();const results=document.createElement('button');results.className='mock-button';results.textContent='Результаты';results.onclick=openHistory;extra.classList.add('help-actions');extra.append(results)};
window.GameSound={hit:()=>window.GameAudio?.sfx('hit'),click:()=>window.GameAudio?.sfx('click'),crouch:()=>window.GameAudio?.sfx('crouch')};
document.addEventListener('click',e=>{const b=e.target.closest('button,a');if(b&&!['start','retryMock','sound','jump','space','duck','shift'].includes(b.id))window.GameSound.click()},true);
document.addEventListener('pointerdown',e=>{if(e.target.closest('#duck,#shift'))window.GameSound.crouch()},true);
document.addEventListener('keydown',e=>{if(!e.repeat&&['ArrowDown','ShiftLeft','ShiftRight'].includes(e.code))window.GameSound.crouch()},true);
function showIntro(){if(window.GameAudio)window.GameAudio.stop();$('intro').hidden=false;$('gameMain').inert=true;document.body.classList.add('intro-on');mode='ready';labelPool.forEach(el=>el.hidden=true)}
function leaveIntro(){$('intro').hidden=true;$('gameMain').inert=false;document.body.classList.remove('intro-on');resize()}
function fitReadouts(){for(const key of document.querySelectorAll('.hud>span')){const label=key.querySelector('em'),digits=key.querySelector('b');if(!label||!digits)continue;const style=getComputedStyle(key),usable=key.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-10;for(const size of [18,16,14,12]){label.style.fontSize=digits.style.fontSize=size+'px';if(label.getBoundingClientRect().width+digits.getBoundingClientRect().width+parseFloat(style.gap)<=usable)break}}}
if(document.fonts)document.fonts.ready.then(fitReadouts);addEventListener('resize',fitReadouts);if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(fitReadouts);for(const key of document.querySelectorAll('.hud>span')){observer.observe(key);observer.observe(key.querySelector('b'))}}
$('introEnter').onclick=()=>{leaveIntro();menu()};
menu();resize();showIntro();

;
(function(root){'use strict';
 const APPS=[['photoshop','Photoshop'],['illustrator','Illustrator'],['figma','Figma'],['blender','Blender']];
 const RANKS=[[0,'Стажёр'],[1000,'Junior'],[5000,'Junior+'],[10000,'Middle'],[25000,'Senior'],[50000,'Lead'],[100000,'Арт-директор']];
 const RECORDS=[[100,'Первый дедлайн'],[500,'Состояние потока'],[1000,'Фрилансер'],[2500,'Все успел)'],[5000,'Двигатель прогресса'],[10000,'Невозможное возможно']];
 const TIERS=[[10,'Железный','iron'],[50,'Золотой','gold'],[100,'Алмазный','diamond']],HAT_RUN=2500,HAT_TOTAL=10000;
 const finite=n=>Number.isFinite(n)&&n>=0?Math.floor(n):0,clone=p=>JSON.parse(JSON.stringify(p));
 function empty(){return {version:1,revision:0,totalScore:0,bestScore:0,byApp:Object.fromEntries(APPS.map(([k])=>[k,0])),runs:0,claimedHat:false,skin:'base',history:[],seenRunIds:[]}}
 function hatReady(p){return p.bestScore>=HAT_RUN||p.totalScore>=HAT_TOTAL}
 function rank(p){let i=0;while(i+1<RANKS.length&&p.totalScore>=RANKS[i+1][0])i++;return {name:RANKS[i][1],start:RANKS[i][0],next:RANKS[i+1]||null}}
 function awards(p){const list=[];if(p.claimedHat)list.push('hat');for(const [n]of RECORDS)if(p.bestScore>=n)list.push('record-'+n);for(const [key]of APPS)for(const [n]of TIERS)if(p.byApp[key]>=n)list.push(key+'-'+n);return list}
 function normalize(raw){const p=empty();if(!raw||raw.version!==1)return p;for(const k of ['revision','totalScore','bestScore','runs'])p[k]=finite(raw[k]);for(const [key]of APPS)p.byApp[key]=finite(raw.byApp?.[key]);p.claimedHat=!!raw.claimedHat&&hatReady(p);p.skin=p.claimedHat&&raw.skin==='party'?'party':'base';p.history=Array.isArray(raw.history)?raw.history.slice(0,10).map(r=>({score:finite(r.score),projects:finite(r.projects),date:finite(r.date)})):[];p.seenRunIds=Array.isArray(raw.seenRunIds)?raw.seenRunIds.filter(s=>typeof s==='string').slice(-32):[];return p}
 function create(storage,key='marat19-progress-v1',seedBest=0){
  let storageWorks=true,p=empty();
  function refresh(){try{const raw=JSON.parse(storage.getItem(key));if(raw?.version===1){const fresh=normalize(raw);if(fresh.revision>=p.revision)p=fresh}}catch{storageWorks=false}p.bestScore=Math.max(p.bestScore,finite(seedBest));return p}
  function save(){p.revision++;try{storage.setItem(key,JSON.stringify(p));storageWorks=true}catch{storageWorks=false}}
  refresh();
  return {get(){return clone(refresh())},get storageWorks(){return storageWorks},
   recordRun(id,score,counts){refresh();if(!id||p.seenRunIds.includes(id))return {added:false};const before=awards(p),wasReady=hatReady(p),oldRank=rank(p).name,n=finite(score),projects=APPS.reduce((sum,[k])=>sum+finite(counts?.[k]),0);p.totalScore+=n;p.bestScore=Math.max(p.bestScore,n);for(const [k]of APPS)p.byApp[k]+=finite(counts?.[k]);p.runs++;p.seenRunIds.push(id);p.seenRunIds=p.seenRunIds.slice(-32);p.history.unshift({score:n,projects,date:Date.now()});p.history=p.history.slice(0,10);save();return {added:true,score:n,projects,newAwards:awards(p).filter(a=>!before.includes(a)).length,unlockedHat:!wasReady&&hatReady(p),rankUp:rank(p).name!==oldRank}},
   claimHat(){refresh();if(!hatReady(p))return false;p.claimedHat=true;p.skin='party';save();return true},
   selectSkin(skin){refresh();if(!['base','party'].includes(skin)||(skin==='party'&&!p.claimedHat))return false;p.skin=skin;save();return true}
  };
 }
 root.GameProgressModel={APPS,RANKS,RECORDS,TIERS,HAT_RUN,HAT_TOTAL,create,hatReady,rank,awards,normalize};if(typeof module!=='undefined')module.exports=root.GameProgressModel;
})(typeof window==='undefined'?globalThis:window);

;
window.GAME_PARTY={"atlas":"assets/39e1b398547c5558af9b.png","data":{"sourceFrames":{"run-8":[[2,2,256,386],[275,2,252,386],[548,2,180,385],[821,2,257,380],[2,473,269,385],[275,473,235,386],[548,473,185,378],[821,473,258,380]],"jump-4":[[2,944,180,344],[275,944,202,377],[548,944,202,328],[821,944,169,338]],"duck-4":[[2,1415,172,342],[275,1415,208,296],[548,1415,204,300],[821,1415,196,335]],"states-4":[[2,1886,158,466],[275,1886,175,455],[548,1886,198,336],[821,1886,186,447]],"phone-idle":[[2,2357,130,466]]},"version":4,"standingVisibleHeight":412,"frames":{"run-8":[{"x":-147.5,"y":-393.5,"id":"run-8-01","footLift":8,"bodyY":-338.5},{"x":-141,"y":-386,"id":"run-8-02","footLift":0,"bodyY":-331.5},{"x":-87.5,"y":-387.5,"id":"run-8-03","footLift":3,"bodyY":-333},{"x":-144,"y":-396.5,"id":"run-8-04","footLift":17,"bodyY":-341.5},{"x":-145,"y":-392.5,"id":"run-8-05","footLift":8,"bodyY":-337.5},{"x":-129,"y":-385,"id":"run-8-06","footLift":0,"bodyY":-330.5},{"x":-92.5,"y":-380.5,"id":"run-8-07","footLift":3,"bodyY":-325.5},{"x":-146,"y":-396,"id":"run-8-08","footLift":17,"bodyY":-341}],"jump-4":[{"x":-87.5,"y":-344,"id":"jump-4-01","footLift":0,"bodyY":-289.5},{"x":-70.5,"y":-376.5,"id":"jump-4-02","footLift":0,"bodyY":-321.5},{"x":-95.5,"y":-328,"id":"jump-4-03","footLift":0,"bodyY":-273},{"x":-76.5,"y":-338,"id":"jump-4-04","footLift":0,"bodyY":-283}],"duck-4":[{"x":-51,"y":-341,"id":"duck-4-01","footLift":0,"bodyY":-286.5},{"x":-88,"y":-295.5,"id":"duck-4-02","footLift":0,"bodyY":-240.5},{"x":-84,"y":-299.5,"id":"duck-4-03","footLift":0,"bodyY":-245},{"x":-75,"y":-334.5,"id":"duck-4-04","footLift":0,"bodyY":-280}],"states-4":[{"x":-70.5,"y":-466,"id":"states-4-01","footLift":0,"bodyY":-411.5},{"x":-71,"y":-454.5,"id":"states-4-02","footLift":0,"bodyY":-399.5},{"x":-106,"y":-335.5,"id":"states-4-03","footLift":0,"bodyY":-280.5},{"x":-55.5,"y":-446.5,"id":"states-4-04","footLift":0,"bodyY":-401.5}],"phone-idle":[{"x":-41,"y":-465,"id":"phone-idle","footLift":0,"bodyY":-410}]},"count":21,"atlasSize":[1092,2826]}};
;
(function(){'use strict';
 const M=window.GameProgressModel,{APPS,RANKS,RECORDS,TIERS,HAT_RUN,HAT_TOTAL}=M;
 const preview=location.pathname.includes('/ui-mock/'),store=M.create(localStorage,preview?'marat19-progress-local-v1':'marat19-progress-v1',best);
 const seenKey=preview?'marat19-progress-local-seen-v1':'marat19-progress-seen-v1';let seen=[];try{const saved=JSON.parse(localStorage.getItem(seenKey));if(Array.isArray(saved))seen=saved.filter(x=>typeof x==='string')}catch{}
 let profile=store.get(),activeTab='progress',lastRun=null,runId=null,committed=true,returnMode='ready',toastTimer,skinGeneration=0,partyImage=null;
 const shell=document.createElement('section');shell.className='progress-shell';shell.hidden=true;shell.setAttribute('role','dialog');shell.setAttribute('aria-modal','true');shell.setAttribute('aria-label','Прогресс и награды');
 shell.innerHTML='<section class="window"><header class="windowbar"><span>MARAT.EXE <small id="pg-window-caption">/ МОЙ ПРОГРЕСС</small></span><button id="pg-close" aria-label="Закрыть">×</button></header><nav class="tabs" role="tablist" aria-label="Разделы"><button role="tab" id="pg-tab-progress" data-tab="progress">Прогресс</button><button role="tab" id="pg-tab-rewards" data-tab="rewards">Награды <span id="pg-reward-count"></span></button><button role="tab" id="pg-tab-rules" data-tab="rules">Как играть</button></nav><div id="pg-content" class="content" role="tabpanel" tabindex="0"></div><footer class="window-footer"><span id="pg-footer-status"></span><button class="button primary" id="pg-continue">Продолжить &gt;</button></footer></section><div class="toast" id="pg-toast" role="status" hidden></div>';
 document.body.append(shell);const $=id=>shell.querySelector('#pg-'+id),content=$('content');
 const hatReady=()=>M.hatReady(profile),career=()=>M.rank(profile),earned=()=>M.awards(profile).length,totalProjects=()=>Object.values(profile.byApp).reduce((a,b)=>a+b,0);
 const PROGRESS_ASSETS={"award-blender-diamond":"assets/d7faa22fa03302f8a6b9.png","award-blender-gold":"assets/0eb5045bce0433af3d35.png","award-blender-iron":"assets/a37f08b0cb6ecd828d00.png","award-figma-diamond":"assets/f14f38e499d55239deda.png","award-figma-gold":"assets/a75114e4462bb7a6f695.png","award-figma-iron":"assets/0d344535a7d97269b1af.png","award-illustrator-diamond":"assets/7547c35fa0d6715e4d69.png","award-illustrator-gold":"assets/0f3433b4bea376ac7740.png","award-illustrator-iron":"assets/4007f7413f32664fc534.png","award-notification":"assets/3b0c1d1400c6328651ba.png","award-photoshop-diamond":"assets/e950e3b914e51469ba82.png","award-photoshop-gold":"assets/8000edac05cfa01ace62.png","award-photoshop-iron":"assets/5706a6c42d2661fbfb80.png","mini-blender":"assets/ce509296fc02ea162d93.png","mini-cake":"assets/d354a8a8f3f64b9855e7.png","mini-clock":"assets/3f75302e56df81228124.png","mini-figma":"assets/cc1589365e1ccfa6e9a5.png","mini-illustrator":"assets/04f46974ced934acb217.png","mini-photoshop":"assets/bc5a893bfd0e9688a2e4.png","mini-rkn":"assets/4e6a010eebe88da4fffa.png","mini-tiktok":"assets/6dd8b91952b87b923ae9.png","portrait-base":"assets/107f1d68c024daf3e713.png","portrait-party":"assets/880bd48cb4c4e1dcbf51.png"};
const safeText=text=>String(text).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const number=n=>Math.floor(n).toLocaleString('ru-RU'),percent=(n,max)=>Math.max(0,Math.min(100,n/max*100));
const cake='<img class="cake" src="assets/d354a8a8f3f64b9855e7.png" alt="Торт">';
const star='<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><path fill="#6863a5" d="M7 0h2v4h2v2h5v3h-4v3h1v4H9v-3H7v3H3v-4h1V9H0V6h5V4h2z"/></svg>';
const awardIcon=(app,tier,cls='mini-icon')=>'<img class="'+cls+'" src="'+PROGRESS_ASSETS['award-'+app+'-'+tier]+'" alt="">';
const mini=(app,cls='mini-icon')=>'<img class="'+cls+'" src="'+PROGRESS_ASSETS['mini-'+app]+'" alt="">';
const bar=(value,max)=>'<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+max+'" aria-valuenow="'+Math.min(value,max)+'" style="--fill:'+percent(value,max)+'%"><i></i></div>';
const portrait=(skin='party',cls='portrait')=>'<img class="'+cls+' pixel-avatar" src="'+PROGRESS_ASSETS['portrait-'+skin]+'" alt="Марат">';

function hatCard(){
 if(profile.claimedHat)return '<section class="hat-card"><div><span class="eyebrow">Главная цель выполнена</span><h2>Колпак получен!</h2><p>Теперь можно бежать в праздничной версии. Впереди — новые звания и коллекция инструментов.</p><button class="button small" data-action="skins">Персонаж &gt;</button></div>'+portrait('party')+'</section>';
 if(hatReady())return '<section class="hat-card"><div><span class="eyebrow">Награда доступна</span><h2>Ты всё успел!</h2><p>Условие выполнено. Праздничный колпак уже ждёт тебя.</p><button class="button primary small" data-action="claim">'+cake+'Забрать колпак</button></div>'+portrait('party')+'</section>';
 return '<section class="hat-card"><div><span class="eyebrow">Главная цель</span><h2>Колпак именинника</h2><p>Выполни любое условие и открой праздничный образ.</p><div class="goal-row"><div class="goal-label"><span>Рекорд за забег</span><b>'+number(profile.bestScore)+' / 2500</b></div>'+bar(profile.bestScore,2500)+'</div><span class="goal-or">ИЛИ</span><div class="goal-row"><div class="goal-label"><span>Очки за всё время</span><b>'+number(profile.totalScore)+' / 10 000</b></div>'+bar(profile.totalScore,HAT_TOTAL)+'</div></div>'+portrait('party','portrait locked')+'<span class="goal-note">Ещё '+number(Math.max(0,HAT_TOTAL-profile.totalScore))+' суммарных очков — и колпак твой.</span></section>';
}
function nextAward(){const candidates=[];for(const [key,name]of APPS)for(const [n,tier,cls]of TIERS)if(profile.byApp[key]<n)candidates.push({key,name,tier,cls,n,value:profile.byApp[key],ratio:profile.byApp[key]/n});candidates.sort((a,b)=>b.ratio-a.ratio);const n=candidates[0];if(!n)return '<span class="eyebrow">Коллекция инструментов</span><h2>Коллекция собрана!</h2><p>Железо, золото и алмазы — полный набор.</p><button class="button quiet" data-action="rewards">Награды &gt;</button>';return '<span class="eyebrow">Ближайшая награда <span aria-hidden="true">&gt;</span></span><div class="next-award">'+awardIcon(n.key,n.cls)+'<div><h3>'+n.tier+' '+n.name+'</h3><span>'+n.value+' из '+n.n+' проектов · осталось '+(n.n-n.value)+'</span></div></div><div style="margin-top:12px">'+bar(n.value,n.n)+'</div><p>Любой подобранный проект приближает награду.</p>'}
function progressView(){const rank=career(),max=rank.next?rank.next[0]-rank.start:1,value=rank.next?profile.totalScore-rank.start:1;return '<div class="page-heading"><div><h1>Мой прогресс</h1></div><span class="pill">'+star+rank.name+'</span></div>'+hatCard()+'<div class="stats"><div class="stat"><b>'+number(profile.bestScore)+'</b><span>ЛИЧНЫЙ РЕКОРД</span></div><div class="stat"><b>'+number(totalProjects())+'</b><span>ПРОЕКТОВ ВСЕГО</span></div><div class="stat"><b>'+number(profile.runs)+'</b><span>ЗАБЕГОВ</span></div></div><div class="grid-two">'+careerCard(rank,value,max)+'<section class="panel next-award-panel" role="button" tabindex="0" data-action="tools" aria-label="Открыть награды инструментов">'+nextAward()+'</section></div><details class="history"><summary>Последние забеги <span class="muted">'+profile.history.length+'/10</span></summary>'+(profile.history.length?profile.history.map((r,i)=>'<div class="history-row"><small>'+(i?'Забег '+(profile.runs-i):'Последний')+'</small><span>'+number(r.score)+' очков</span><span>'+r.projects+' проектов</span></div>').join(''):'<p class="empty">Твой первый результат появится здесь.</p>')+'</details>'}

function rewardsView(){
 const records=RECORDS.map(([n,title])=>{const yes=profile.bestScore>=n;return '<article class="record '+(yes?'earned':'')+'"><span class="check">'+(yes?'ПОЛУЧЕНО':'ЦЕЛЬ')+'</span><strong class="record-score">'+number(n)+'</strong><h3>'+title+'</h3>'+bar(profile.bestScore,n)+'</article>'}).join('');
 const tools=APPS.map(([key,name])=>'<section class="tool-row"><header class="tool-heading"><div>'+mini(key)+'<h3>'+name+'</h3></div><small>'+profile.byApp[key]+' проектов</small></header><div class="tool-tiers">'+TIERS.map(([n,tier,cls])=>'<div class="tier '+cls+(profile.byApp[key]>=n?' earned':'')+'"><div class="medal">'+awardIcon(key,cls,'')+'</div>'+tier+'<b>'+Math.min(profile.byApp[key],n)+' / '+n+'</b></div>').join('')+'</div></section>').join('');
 const toolCount=APPS.reduce((sum,[key])=>sum+TIERS.filter(([n])=>profile.byApp[key]>=n).length,0);
 return '<div class="page-heading"><div><h1>Мои награды</h1></div><span class="pill">'+earned()+' из 19</span></div><div class="section-title"><h2>Персонаж</h2><small>Выбери свой образ</small></div><div class="skin-grid">'+['base','party'].map(skin=>{const locked=skin==='party'&&!profile.claimedHat,selected=profile.skin===skin;return '<article class="skin '+(locked?'locked ':'')+(selected?'selected':'')+'">'+(selected?'<span class="selected-label">ВЫБРАН</span>':'')+portrait(skin,'')+'<h3>'+(skin==='base'?'Обычный Марат':'Именинник')+'</h3><span class="skin-state">'+(locked?'Откроется с колпаком':skin==='base'?'Доступен с начала игры':'Колпак получен')+'</span><button class="button small '+(selected?'primary':'')+'" data-action="'+(locked?'hat':selected?'selected':'skin')+'" data-skin="'+skin+'">'+(locked?(hatReady()?'Забрать колпак':'Как получить'):selected?'Выбран':'Выбрать')+'</button></article>'}).join('')+'</div><details class="award-group" id="record-awards"><summary><span>Рекорд за забег</span><small>'+RECORDS.filter(([n])=>profile.bestScore>=n).length+' / 6</small></summary><div class="record-grid">'+records+'</div></details><details class="award-group" id="tool-awards"><summary><span>Инструменты</span><small>'+toolCount+' / 12</small></summary>'+tools+'</details>';
}

function rulesView(){return '<div class="page-heading"><div><h1>Как всё успеть?</h1></div></div><div class="controls-guide"><div class="guide-key"><b>↑</b><span>Прыжок<br><small class="muted">Свайп вверх или тап</small></span></div><div class="guide-key"><b>↓</b><span>Присесть<br><small class="muted">Свайп вниз</small></span></div></div><div class="rule-list"><div class="rule">'+mini('clock')+'<p>Часы · +3 секунды<small>Больше времени на проекты.</small></p></div><div class="rule">'+mini('photoshop')+'<p>Проекты · +10–100 очков<small>Каждый идёт в личную коллекцию.</small></p></div><div class="rule">'+mini('tiktok')+'<p>TikTok · − половина времени<small>Одно видео — и снова дедлайн.</small></p></div><div class="rule"><svg class="mini-icon" viewBox="0 0 32 24" shape-rendering="crispEdges" aria-hidden="true"><path fill="#191719" d="M0 0h30v22H0zM2 22h30v2H2z"/><path fill="#f2ecde" d="M2 7h26v13H2zM23 2h4v3h-4z"/></svg><p>Окна · −10 секунд<small>Правки, дедлайны и другие радости.</small></p></div><div class="rule">'+mini('rkn')+'<p>РКН · конец забега<small>Лучше держаться подальше.</small></p></div></div><p class="rule-note">Пробел / ↑ — прыжок · Shift / ↓ — присесть.<br>Колпак: 2500 за забег или 10 000 всего.<br>Прогресс сохраняется в этом браузере.</p>'}
function claimView(){return '<div class="celebration">'+portrait('party')+'<span class="eyebrow">Главная цель выполнена</span><h1>Колпак — твой!</h1><p>Ты собрал праздничный релиз.<br>Колпак именинника теперь доступен — забирай и беги дальше в новом образе.</p><button class="button primary" data-action="take-hat">'+cake+'Забрать колпак</button><p class="muted" style="font-size:12px;margin-bottom:0">Награда останется с тобой после любого забега.</p></div>'}
function resultView(){const run=lastRun||{score:0,projects:0,newAwards:0},rank=career();return '<div class="result"><span class="eyebrow">'+safeText(reason==='rkn'?(endOverline||'РКН передаёт привет'):'ЗАБЕГ ЗАВЕРШЁН')+'</span><h1>'+safeText(endHeadline||'Всё ещё успеем!')+'</h1><div class="result-numbers"><div><b>'+number(run.score)+'</b><span>ОЧКОВ ЗА ЗАБЕГ</span></div><div><b>'+run.projects+'</b><span>ПРОЕКТОВ</span></div></div><section class="result-contribution"><b>+'+number(run.score)+' очков в карьеру · +'+run.projects+' проектов</b><p>'+rank.name+' · '+number(profile.totalScore)+' очков за всё время</p>'+(rank.next?'<div style="margin-top:10px">'+bar(profile.totalScore-rank.start,rank.next[0]-rank.start)+'</div><p>До '+rank.next[1]+' осталось '+number(rank.next[0]-profile.totalScore)+' очков.</p>':'')+'</section>'+(run.newAwards?'<p class="new-award">Новых наград: '+run.newAwards+'</p>':'')+'<span class="goal-note">'+(profile.claimedHat?'Ещё один забег в твою историю.':hatReady()?'Условие выполнено — колпак ждёт тебя!':'До колпака осталось '+number(HAT_TOTAL-profile.totalScore)+' суммарных очков.')+'</span><div class="result-actions"><button class="button" data-action="progress">Мой прогресс</button><button class="button gift-action" data-action="gift">'+cake+'Поздравить</button><button class="button primary" data-action="'+(hatReady()&&!profile.claimedHat?'claim':'retry')+'">'+(hatReady()&&!profile.claimedHat?'Забрать колпак':'Ещё попытку >')+'</button></div></div>'}

function careerCard(rank,value,max){return '<section class="panel career-panel"><details class="career-details"><summary aria-label="Все звания"><span class="career-heading"><span><span class="eyebrow">Карьера</span><strong class="rank-name">'+rank.name+'</strong></span></span>'+bar(value,max)+'<span class="rank-track"><span>'+number(profile.totalScore)+' очков всего</span><span>'+(rank.next?'до '+rank.next[1]+': '+number(rank.next[0]-profile.totalScore):'Высшее звание')+'</span></span></summary><div class="rank-ladder">'+RANKS.map(([n,name])=>'<span class="'+(profile.totalScore>=n?'reached':'')+'">'+name+' · '+number(n)+'</span>').join('')+'</div></details></section>'}
function giftView(){return '<div class="gift-view"><span class="eyebrow">Мне 19</span><h1>С днём рождения меня!</h1><div class="gift-cake">'+cake+'</div><p>Твоё поздравление — уже подарок.<br>Если хочешь, можно оставить подарок.</p><div class="gift-links"><a class="button" href="https://messenger.sbrf.ru/sl/bfmVTvNxY1a8VskrP" target="_blank" rel="noopener noreferrer">Сбер &gt;</a><a class="button" href="https://t.tb.ru/pm_short/6dgwuLH4A2f" target="_blank" rel="noopener noreferrer">Т-Банк &gt;</a></div><p class="muted">Откроется страница банка.<br>Сумму выбираешь сам.</p><button class="button" data-action="result">Назад &gt;</button></div>'}

 const baseCharacter={image:null,frames:JSON.parse(JSON.stringify(frames)),data:window.CHARACTER_V4};
 const rankBadge=document.createElement('span');rankBadge.className='career-rank';document.querySelector('.projectbar').append(rankBadge);
 function refresh(){profile=store.get();updateNotice();const rank=career();rankBadge.textContent=rank.name;rankBadge.title='Звание: '+rank.name+' · '+number(profile.totalScore)+' очков всего'}
 function updateNotice(){const fresh=M.awards(profile).some(id=>!seen.includes(id));helpButton.classList.toggle('has-notice',fresh);helpButton.setAttribute('aria-label',fresh?'Прогресс и награды: есть новые достижения':'Прогресс и награды')}
 function markSeen(){seen=M.awards(profile);try{localStorage.setItem(seenKey,JSON.stringify(seen))}catch{}updateNotice()}
 function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,2200)}
 function render(){refresh();$('reward-count').textContent='';shell.querySelector('.window').classList.toggle('result-window',['result','gift'].includes(activeTab));$('footer-status').textContent=store.storageWorks?career().name+' · '+number(profile.totalScore)+' очков всего':'Браузер не сохраняет прогресс';$('window-caption').textContent=activeTab==='claim'?'/ НАГРАДА ДОСТУПНА':'/ МОЙ ПРОГРЕСС';for(const b of shell.querySelectorAll('[data-tab]')){b.setAttribute('aria-selected',String(b.dataset.tab===activeTab));b.tabIndex=b.dataset.tab===activeTab?0:-1}content.dataset.view=activeTab;content.innerHTML=activeTab==='progress'?progressView():activeTab==='rewards'?rewardsView():activeTab==='claim'?claimView():activeTab==='result'?resultView():activeTab==='gift'?giftView():rulesView();$('continue').textContent=returnMode==='over'||returnMode==='ready'?'Вернуться >':'Продолжить >'}
 function open(tab='progress'){if(tab==='rewards')markSeen();if(shell.hidden){returnMode=mode;if(mode==='running')pause();document.getElementById('overlay').hidden=true}activeTab=tab;shell.hidden=false;render();content.scrollTop=0;$('close').focus()}
 function close(){shell.hidden=true;if(returnMode==='running'||returnMode==='paused'){document.getElementById('overlay').hidden=true;if(mode==='paused')start()}else if(returnMode==='over'){if(['result','gift'].includes(activeTab))menu();else open('result')}else menu()}
 async function applySkin(){const generation=++skinGeneration;refresh();try{if(!ready)return;if(!baseCharacter.image)baseCharacter.image=images['character-v4'];let data=baseCharacter.data,sourceFrames=baseCharacter.frames,image=baseCharacter.image;
  if(profile.skin==='party'&&profile.claimedHat){if(!partyImage){const im=new Image();im.src=window.GAME_PARTY.atlas;await im.decode();partyImage=prepareImage(im,'character-v4')}if(generation!==skinGeneration)return;data=window.GAME_PARTY.data;sourceFrames=data.sourceFrames;image=partyImage}
  window.CHARACTER_V4=data;Object.assign(frames,sourceFrames);images['character-v4']=image;spriteCache.clear();needsDraw=true;
 }catch{toast('Не удалось загрузить образ. Попробуй ещё раз.')}}
 function claim(){refresh();open(hatReady()?'claim':'progress')}
 function takeHat(){if(!store.claimHat())return;refresh();applySkin();activeTab='rewards';render();content.scrollTop=0;toast('Колпак получен. Праздничный образ выбран!');updateNotice()}
 function renderEndIfNeeded(){if(mode==='over')renderEnd()}
 content.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
  if(action==='tools'){open('rewards');const group=content.querySelector('#tool-awards');group.open=true;group.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
  else if(['progress','rewards','skins','gift','result'].includes(action)){open(action==='skins'?'rewards':action)}
  else if(action==='retry'){shell.hidden=true;start()}
  else if(action==='hat'||action==='claim')claim();else if(action==='take-hat')takeHat();else if(action==='skin'){if(store.selectSkin(b.dataset.skin)){refresh();applySkin();render();toast(profile.skin==='party'?'Выбран праздничный образ':'Выбран обычный образ')}}else if(action==='selected')toast('Этот персонаж уже выбран');
 });
 for(const b of shell.querySelectorAll('[data-tab]'))b.onclick=()=>open(b.dataset.tab);$('close').onclick=close;$('continue').onclick=close;
 shell.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}else if(e.key==='Tab'){const all=[...shell.querySelectorAll('button:not([disabled]),summary,[tabindex="0"]')].filter(el=>el.getClientRects().length);if(e.shiftKey&&document.activeElement===all[0]){e.preventDefault();all.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===all.at(-1)){e.preventDefault();all[0].focus()}}});
 content.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-action=tools]')){e.preventDefault();e.target.click()}});
 shell.addEventListener('keydown',e=>e.stopPropagation());
 helpButton.onclick=()=>open('progress');gift=function(){open('gift')};
 const soundButton=document.getElementById('sound'),soundSprites={};for(const state of ['on','off']){const im=new Image(),face=window.KEY_SOUNDS?.[state];im.src=face?face.slice(5,-2):'../assets/v2/key-sound-'+state+'.png';soundSprites[state]=im;im.decode().catch(()=>{})}const toggleSound=soundButton.onclick;soundButton.onclick=()=>{const previous=soundButton.style.getPropertyValue('--key-face')||getComputedStyle(soundButton).getPropertyValue('--key-face');toggleSound();const state=sound?'on':'off',next=soundButton.style.getPropertyValue('--key-face'),image=soundSprites[state];if(!image.complete||!image.naturalWidth){soundButton.style.setProperty('--key-face',previous);image.decode().then(()=>{if((sound?'on':'off')===state)soundButton.style.setProperty('--key-face',next)}).catch(()=>{})}};
 const beforeStart=start;start=function(){const resumed=mode==='paused';shell.hidden=true;beforeStart();if(mode==='running'&&!resumed){runId=globalThis.crypto?.randomUUID?.()||Date.now()+'-'+Math.random();committed=false;lastRun=null}applySkin()};document.getElementById('start').onclick=start;document.getElementById('closeMenu').onclick=start;
 const beforeRenderEnd=renderEnd;renderEnd=function(){beforeRenderEnd();refresh();if(lastRun)open('result')};
 const beforeFinish=finish;finish=function(...args){if(mode==='over')return;beforeFinish(...args);if(mode==='over'&&!committed){committed=true;lastRun=store.recordRun(runId||Date.now()+'-'+Math.random(),score+Math.floor(elapsed*10),projectCounts);refresh();renderEnd();if(lastRun.unlockedHat)open('claim')}};
 addEventListener('storage',e=>{if(e.key===null||e.key===seenKey||e.key===(preview?'marat19-progress-local-v1':'marat19-progress-v1')){try{const saved=JSON.parse(localStorage.getItem(seenKey));if(Array.isArray(saved))seen=saved}catch{}refresh();applySkin();if(!shell.hidden)render()}});
 function waitReady(){if(ready){applySkin();refresh()}else requestAnimationFrame(waitReady)}waitReady();refresh();
 window.ProgressGame={open,close,store,get profile(){return store.get()},get lastRun(){return lastRun},get activeTab(){return activeTab},get isOpen(){return !shell.hidden}};
})();
