(function(root){
  'use strict';
  // Extra wine tones preserve the approved folder lighting; no rainbow/noise.
  const colors=['#963c43','#602831','#4c222c','#7d333c','#aa5057','#f2dfb7','#c4b38b','#416b91','#b9c66d','#000000'];
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
    const tones=[[28,22,24],[241,234,217]];
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
