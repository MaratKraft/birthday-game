(function(root){
 'use strict';
 const hazards={box:{w:72,h:44,offset:52},banner:{w:90,h:46,offset:134}};
 const apps=['photoshop','figma','blender','illustrator'];
 const rewards=[10,25,50,100];
 function awardPoints(random=Math.random){return rewards[Math.floor(random()*rewards.length)]}
 const patterns=[[0,0,0],[0,-38,0],[0,-30,-60,-30,0],[0,-34,-68]];
 function speed(elapsed,narrow=false){return Math.min(narrow?390:470,250+elapsed*3.2)}
 function makeWave(width,ground,elapsed,random=Math.random){
  const type=random()<.4?'banner':'box',d=hazards[type],x=width+60;
  const hazard={type,x,y:ground-d.offset,w:d.w,h:d.h,phase:random()*Math.PI*2};
  hazard.label=(type==='banner'?['ДЕДЛАЙН','ОШИБКА']:['ПРАВКИ','ЛЕНЬ'])[hazard.phase<Math.PI?0:1];
  const offsets=patterns[Math.floor(random()*patterns.length)],app=apps[Math.floor(random()*apps.length)];
  const trap=elapsed>12&&random()<.27?(random()<.42?'rkn':'tiktok'):null;
  const trapIndex=trap?Math.floor(random()*offsets.length):-1;
  const items=offsets.map((offset,i)=>({type:i===trapIndex?trap:i===offsets.length-1?'project':'clock',app,x:x+d.w+130+i*58,y:ground-53+offset,w:28,h:28,phase:i*.6}));
  return {hazard,items,interval:Math.max(3.1, (d.w+130+offsets.length*58+140)/speed(elapsed,width<400))+.35+random()*.35};
 }
 root.SpawnRules={makeWave,hazards,apps,patterns,speed,rewards,awardPoints};
 if(typeof module!=='undefined')module.exports=root.SpawnRules;
})(typeof window==='undefined'?globalThis:window);
