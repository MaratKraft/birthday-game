'use strict';
const $=id=>document.getElementById(id),canvas=$('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
let H=320,G=243,PX=150,W=960,mode='ready',elapsed=0,time=30,score=0,best=0,y=0,vy=0,duck=false;
let invincible=0,spawn=1.8,objects=[],last=0,sound=true,audio,land=0,player='Гость',ready=false,reason='deadline',notice='',noticeTime=0,travel=0,phoneTime=0;
let projectTotal=0,projectCounts={},effects=[],dust=[],dustClock=0,needsDraw=true;
const images={},frames=window.SPRITE_FRAMES,spriteCache=new Map();
try{best=Number(localStorage.getItem('marat19-beta-best'))||0;$('name').value=localStorage.getItem('marat19-name')||''}catch{}
$('best').textContent=best;
Promise.all(Object.keys(window.GAME_IMAGES).map(key=>new Promise((resolve,reject)=>{
  const im=new Image();im.onload=()=>{images[key]=prepareImage(im,key);resolve()};im.onerror=reject;im.src=window.GAME_IMAGES[key];
}))).then(()=>{ready=true;needsDraw=true;$('closeMenu').disabled=false;$('start').disabled=false;$('start').textContent='ПОГНАЛИ →'}).catch(()=>{$('assetError').textContent='Не загрузились материалы. Обнови страницу.'});
function resize(){
  needsDraw=true;spriteCache.clear();
  H=canvas.clientWidth<650?390:320;G=Math.round(H*.76);
  canvas.width=Math.round(canvas.clientWidth/2);canvas.height=Math.round(canvas.clientHeight/2);
  W=H*canvas.clientWidth/canvas.clientHeight;PX=Math.max(56,Math.min(190,W*.22));
  if(window.PixelGrid)window.PixelGrid.configure(canvas.width/W,canvas.height/H);
  if(mode==='running')pause();
}
addEventListener('resize',resize);resize();
if(document.fonts)document.fonts.ready.then(()=>{window.PixelGrid.configure(canvas.width/W,canvas.height/H);needsDraw=true});
function prepareImage(im,key){
  // Keep the user's shared icon canvas and alpha: trimming would alter relative sizes.
  if(key.startsWith('coin-'))return im;
  const character=key in frames||key==='phone-idle';
  if(!im.naturalWidth)return im;
  const layer=document.createElement('canvas');layer.width=im.naturalWidth;layer.height=im.naturalHeight;
  const lc=layer.getContext('2d',{willReadFrequently:true});lc.imageSmoothingEnabled=false;lc.drawImage(im,0,0);
  const data=lc.getImageData(0,0,layer.width,layer.height);

  if(character)window.PixelPalette.monochrome(data.data);
  let left=layer.width,top=layer.height,right=-1,bottom=-1;
  for(let i=0;i<data.data.length;i+=4){
    if(data.data[i+3]===0)continue;

    const x=(i/4)%layer.width,y=Math.floor(i/4/layer.width);
    left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);
  }
  lc.putImageData(data,0,0);
  if(key==='phone-idle')frames[key]=[[left,top,right-left+1,bottom-top+1]];
  if(character||right<0)return layer;
  const cut=document.createElement('canvas');cut.width=right-left+1;cut.height=bottom-top+1;
  cut.getContext('2d').drawImage(layer,left,top,cut.width,cut.height,0,0,cut.width,cut.height);return cut;
}
function tone(freq){
  if(!sound)return;
  try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=freq;g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);o.start();o.stop(audio.currentTime+.12)}catch{}
}
function show(top,title,message,button){
  needsDraw=true;$('overline').textContent=top;$('title').textContent=title;$('message').textContent=message;
  $('start').textContent=button;$('nameLabel').hidden=true;$('overlay').hidden=false;$('start').focus();
}
function start(){
  if(!ready)return;
  needsDraw=true;
  if(mode==='paused'){mode='running';last=0}else{
    player=$('name').value.trim()||'Гость';try{localStorage.setItem('marat19-name',player)}catch{}
    mode='running';elapsed=0;time=30;score=0;y=0;vy=0;invincible=0;spawn=1.8;objects=[];land=0;last=0;reason='deadline';notice='';noticeTime=0;travel=0;phoneTime=0;projectTotal=0;projectCounts={};effects=[];dust=[];dustClock=0;window.SceneLayout.reset();
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
$('sound').onclick=()=>{sound=!sound;$('sound').style.setProperty('--key-face','url(assets/v2/key-sound-'+(sound?'on':'off')+'.png)');$('sound').setAttribute('aria-label',sound?'Выключить звук':'Включить звук');$('sound').setAttribute('aria-pressed',String(sound));tone(660)};
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
 if(Math.abs(dy)>=28&&Math.abs(dy)>Math.abs(dx)*1.2){duck=dy>0;return}
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
function text(s,x,y,size=13,color='#f2dfb7'){ctx.fillStyle=color;ctx.font='bold '+size+'px Courier New';ctx.fillText(s,Math.round(x),Math.round(y))}
function sprite(key,index,height,bottom=G){
  const f=frames[key]?.[index],im=images[key];if(!im||!f)return;
  const width=height*f[2]/f[3];
  ctx.imageSmoothingEnabled=false;
  if(!document.createElement){ctx.drawImage(im,...f,Math.round(PX-width/2),Math.round(bottom-height),Math.round(width),Math.round(height));return}
  const sx=canvas.width/W,sy=canvas.height/H,dw=Math.max(1,Math.round(width*sx)),dh=Math.max(1,Math.round(height*sy));
  const cacheKey=[key,index,dw,dh].join(':');
  let tile=spriteCache.get(cacheKey);
  if(!tile){
    tile=document.createElement('canvas');tile.width=dw+2;tile.height=dh+2;
    const tc=tile.getContext('2d',{willReadFrequently:true});tc.imageSmoothingEnabled=false;
    tc.drawImage(im,...f,1,1,dw,dh);
    const pixels=tc.getImageData(0,0,tile.width,tile.height);
    window.PixelPalette.softenInteriorCorners(pixels.data,tile.width,tile.height);
    window.PixelPalette.softenCorners(pixels.data,tile.width,tile.height,48);
    tc.putImageData(pixels,0,0);spriteCache.set(cacheKey,tile);
  }
  const left=Math.round((PX-width/2)*sx)-1,top=Math.round((bottom-height)*sy)-1;
  ctx.drawImage(tile,left/sx,top/sy,tile.width/sx,tile.height/sy);
}
function objectY(o){
  return o.y+Math.sin(elapsed*2.2+(o.phase||0))*(1.5/(canvas.height/H));
}
function drawObjects(){
  for(const o of objects){
    if(o.used)continue;
    const oy=objectY(o),coin=['clock','project','rkn','tiktok'].includes(o.type);
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
  window.LevelArt.background(ctx,W,H,G,travel,images);rect(0,G,W,H-G,'#f1ead9');
  if(images.floor)ctx.drawImage(images.floor,0,G,W,H-G);rect(0,G,W,2,'#241a20');
  window.LevelArt.groundShadows(ctx,W,G,travel);
  window.LevelArt.shadow(ctx,PX,G,Math.max(24,48-y*.13),4,Math.max(.09,.32-y/650));
  drawEffects(false);drawObjects();
  if(phoneTime>0||(mode==='over'&&reason==='tiktok')){
    sprite('phone-idle',0,114);
  }else if(mode==='over')sprite('states-4',2,83,G+4);
  else if(invincible>1.2)sprite('states-4',1,116,G-y);
  else if(invincible<=0||Math.floor(invincible*12)%2===0){
    if(mode==='ready')sprite('states-4',0,114);
    else if(y>0)sprite('jump-4',vy>220?1:2,vy>220?112:91,G-y);
    else if(duck)sprite('duck-4',1+Math.floor(elapsed*8)%2,80,G+3);
    else if(land>0)sprite('jump-4',3,96);
    else sprite('run-8',Math.floor(elapsed*10)%8,114);
  }
  window.LevelArt.foreground(ctx,W,H,G,travel,images);
  drawEffects(true);
}
function update(dt){
  tickEffects(dt);
  if(phoneTime>0){phoneTime=Math.max(0,phoneTime-dt);sync();return}
  if(y===0){dustClock+=dt;if(dustClock>.055){dustClock=0;dust.push({x:PX-12,y:G+2,vx:-30-Math.random()*30,vy:-15-Math.random()*20,life:.4,size:2+Math.floor(Math.random()*2)})}}
  elapsed+=dt;time=Math.max(0,time-dt);noticeTime=Math.max(0,noticeTime-dt);invincible=Math.max(0,invincible-dt);land=Math.max(0,land-dt);
  const wasAir=y>0;vy-=1800*dt;y=Math.max(0,y+vy*dt);if(y===0){vy=0;if(wasAir)land=.1}
  const speed=window.SpawnRules.speed(elapsed,W<400);travel+=speed/250*dt;spawn-=dt;
  if(spawn<=0){const wave=window.SpawnRules.makeWave(W,G,elapsed);objects.push(wave.hazard,...wave.items);spawn=wave.interval}
  const ph=duck&&y===0?72:103,p={x:PX-17,y:G-y-ph,w:34,h:ph};
  for(const o of objects){
    o.x-=speed*dt;
    const pickup=['clock','project','rkn','tiktok'].includes(o.type),ox=pickup?o.x-o.w/2:o.x,oy=objectY(o)-(pickup?o.h/2:0);
    if(o.used||p.x>=ox+o.w||p.x+p.w<=ox||p.y>=oy+o.h||p.y+p.h<=oy)continue;
    if(o.type==='rkn'){o.used=true;finish('rkn');return}
    if(o.type==='tiktok'){o.used=true;time*=.5;phoneTime=1.8;y=0;vy=0;duck=false;tell('ЗАЛИП В TIKTOK · ПОЛОВИНА ВРЕМЕНИ');tone(150);sync();return}
    if(pickup){
      o.used=true;
      if(o.type==='clock'){time=Math.min(45,time+3);tell('+3 СЕКУНДЫ');effects.push({x:o.x,y:objectY(o),text:'+3 СЕК',life:.8});tone(900)}
      else{const points=window.SpawnRules.awardPoints();score+=points;projectTotal++;const app=o.app||'photoshop';projectCounts[app]=(projectCounts[app]||0)+1;effects.push({x:o.x,y:objectY(o),text:'+'+points,life:.8});tell('+1 ПРОЕКТ · '+app.toUpperCase()+' · +'+points);tone(700)}
    }else if(invincible<=0){
      o.used=true;time=Math.max(0,time-10);invincible=1.5;
      tell((o.label||'ПРАВКИ')+': −10 СЕК');tone(150);
      if(time<=0){finish(o.type==='rkn'?'rkn':'deadline');return}
    }
  }
  objects=objects.filter(o=>o.x>-100&&!o.used);
  sync();if(time<=0)finish();
}
function tickEffects(dt){
 for(const p of dust){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=65*dt}
 dust=dust.filter(p=>p.life>0).slice(-40);
 for(const p of effects){p.life-=dt;p.y-=23*dt;p.x-=25*dt}
 effects=effects.filter(p=>p.life>0).slice(-20);
}
function drawEffects(labels){
 ctx.save();
 if(labels){const sx=canvas.width/W,sy=canvas.height/H;ctx.setTransform(1,0,0,1,0,0);ctx.font='10px MaratPixel,monospace';ctx.textAlign='center';ctx.fillStyle='#f1ead9';
  for(const p of effects){ctx.globalAlpha=Math.min(1,p.life*5);ctx.fillText(p.text,Math.round(p.x*sx),Math.round((p.y-8)*sy))}
 }else for(const p of dust){ctx.globalAlpha=p.life/.4*.65;rect(p.x,p.y,p.size,p.size,'#c3ab9a')}
 ctx.restore();
}
function loop(t){
 const dt=last?Math.min((t-last)/1000,.05):0;last=t;
 if(mode==='running')update(dt);
 if($('intro').hidden&&(mode==='running'||needsDraw)){draw();needsDraw=false}
 requestAnimationFrame(loop);
}requestAnimationFrame(loop);

