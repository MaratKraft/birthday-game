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
