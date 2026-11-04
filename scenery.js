(function(root){
 'use strict';
 const C={red:'#602831',dark:'#4c222c',paper:'#f1ead9',black:'#171319'};
 function prop(c,images,key,x,bottom,width,angle=0,shade=0){
  const im=images[key];if(!im)return;
  const height=width*(im.height||im.naturalHeight||100)/(im.width||im.naturalWidth||100);
  c.save();c.translate(Math.round(x+width/2),Math.round(bottom));c.rotate(angle*Math.PI/180);
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
  const s=g/243,camera=t*speed/s,span=root.SceneLayout.span;
  for(let index=Math.floor(camera/span)-1;index<=Math.floor((camera+w/s)/span)+1;index++)draw(root.SceneLayout.layout(index),(index*span-camera)*s,s);
 }
 function placed(c,images,item,a,g,s){
  const width=item.w*s,bottom=g-width/2*Math.abs(Math.sin(item.angle*Math.PI/180));
  prop(c,images,item.key,a+item.x*s,bottom,width,item.angle,item.shade||0);
 }
 function background(c,w,h,g,t,images){
  c.fillStyle=C.red;c.fillRect(0,0,w,h);
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
  const s=g/243,tw=800*s,camera=t*95;
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
