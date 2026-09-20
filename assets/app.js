(() => {
  'use strict';
  const button = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!button || !menu) return;
  const close = () => {button.setAttribute('aria-expanded', 'false'); menu.hidden = true;};
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => {if(event.key === 'Escape' && !menu.hidden){close();button.focus();}});
  if(!document.body.classList.contains('scrolly-home'))return;
  const body=document.body,sequence=document.querySelector('.story-sequence'),stage=document.querySelector('.story-stage');
  const panels=[...document.querySelectorAll('.story-panel')],chapterButtons=[...document.querySelectorAll('[data-go-chapter]')];
  const words=[...document.querySelectorAll('.read-reveal span')],opening=document.querySelector('.opening-story');
  const art=document.querySelector('.cinema-art'),progress=document.querySelector('.reading-progress span'),motionButton=document.querySelector('.motion-toggle');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),wide=matchMedia('(min-width: 761px) and (min-height: 660px)');
  let userReduced=null,scheduled=false,enabled=false,lastStep=-1;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function setStep(index){
    if(index===lastStep)return;
    lastStep=index;stage.dataset.step=String(index);
    document.querySelector('.story-counter').textContent='0'+(index+1)+' / 03';
    panels.forEach((panel,i)=>{panel.classList.toggle('is-active',i===index);panel.inert=enabled&&i!==index;if(enabled&&i!==index)panel.setAttribute('aria-hidden','true');else panel.removeAttribute('aria-hidden');});
    chapterButtons.forEach((item,i)=>{if(i===index)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});
  }
  function update(){
    scheduled=false;
    const off=userReduced??reduced.matches,max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform='scaleX('+clamp(scrollY/Math.max(max,1),0,1)+')';
    art.style.setProperty('--hero-shift',off?'0px':clamp(scrollY*.13,0,110)+'px');
    const rect=opening.getBoundingClientRect(),amount=clamp((innerHeight*.8-rect.top)/(rect.height*.72),0,1);
    words.forEach((word,i)=>{word.style.opacity=off?'1':String(clamp((amount*words.length-i)*2,.2,1));});
    if(enabled){const bounds=sequence.getBoundingClientRect(),distance=sequence.offsetHeight-stage.offsetHeight,p=clamp((86-bounds.top)/Math.max(distance,1),0,1);setStep(Math.min(2,Math.floor(p*3)));}
  }
  function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
  function configure(){
    const off=userReduced??reduced.matches;
    body.classList.toggle('motion-off',off);enabled=wide.matches&&!off;body.classList.toggle('scrolly-enabled',enabled);
    motionButton.setAttribute('aria-pressed',String(off));motionButton.querySelector('span').textContent=off?'minimal':'aktif';
    motionButton.setAttribute('aria-label',off?'Aktifkan efek gerak':'Kurangi efek gerak');
    lastStep=-1;setStep(0);queue();
  }
  motionButton.addEventListener('click',()=>{userReduced=!(userReduced??reduced.matches);configure();});
  chapterButtons.forEach((item,index)=>item.addEventListener('click',()=>{if(!enabled)return;const start=sequence.getBoundingClientRect().top+scrollY-86,distance=sequence.offsetHeight-stage.offsetHeight;scrollTo({top:start+distance*((index+.45)/3),behavior:'smooth'});}));
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',configure,{passive:true});
  reduced.addEventListener('change',configure);wide.addEventListener('change',configure);configure();
})();
