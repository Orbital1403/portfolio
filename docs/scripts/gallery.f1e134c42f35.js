(()=>{
 if(window.__portfolioGallery)return;window.__portfolioGallery=true;
 const selector='main img[data-index]:not([data-nozoom]), main img[data-group="cover"]:not([data-nozoom])';
 const icon=name=>`<svg class="technical-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="/portfolio/icons.svg#${name}"/></svg>`;
 const overlay=document.createElement('div');overlay.className='gg-lightbox';overlay.setAttribute('aria-hidden','true');
 overlay.innerHTML=`<div class="gg-lb-stage" role="dialog" aria-modal="true" aria-label="Image gallery"><div class="gg-lb-backdrop" data-close></div><header class="gg-gallery-heading"><div><span class="gg-gallery-label">PROJECT PHOTOGRAPHS</span><p class="gallery-caption" aria-live="polite"></p></div><span class="gg-gallery-count"></span></header><div class="gg-photo-window"><img class="gg-lb-img" alt="" draggable="false"></div><button class="gg-lb-btn gg-lb-prev" aria-label="Previous image">${icon('left')}</button><button class="gg-lb-btn gg-lb-next" aria-label="Next image">${icon('right')}</button><button class="gg-lb-btn gg-lb-close" aria-label="Close image">${icon('close')}</button><div class="gg-gallery-footer"><div class="gg-gallery-thumbnails" role="group" aria-label="Choose a photograph"></div><p class="gg-gallery-hint">← → Browse · Click photo to zoom · Esc to close</p></div></div>`;
 document.body.appendChild(overlay);
 const image=overlay.querySelector('img'),previous=overlay.querySelector('.gg-lb-prev'),next=overlay.querySelector('.gg-lb-next'),closeButton=overlay.querySelector('.gg-lb-close'),caption=overlay.querySelector('.gallery-caption'),counter=overlay.querySelector('.gg-gallery-count'),thumbnails=overlay.querySelector('.gg-gallery-thumbnails');
 let items=[],index=0,origin=null,scale=1,x=0,y=0,drag=null,locked=[],bodyOverflow='';
 const reset=()=>{scale=1;x=y=0;image.style.transform='';image.style.cursor='zoom-in';};
 function show(i){
  index=(i+items.length)%items.length;const item=items[index];
  image.src=item.dataset.src||item.currentSrc||item.src;image.alt=item.alt;
  caption.textContent=item.dataset.title||item.alt;counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
  previous.hidden=next.hidden=items.length<2;
  [...thumbnails.children].forEach((button,n)=>{button.setAttribute('aria-pressed',String(n===index));button.tabIndex=n===index?0:-1;});
  thumbnails.children[index]?.scrollIntoView({block:'nearest',inline:'center'});reset();
 }
 function buildThumbnails(){
  thumbnails.replaceChildren();
  items.forEach((item,n)=>{
   const button=document.createElement('button');button.type='button';button.className='gg-gallery-thumb';button.setAttribute('aria-label',`Photo ${n+1}: ${item.dataset.title||item.alt}`);
   const thumb=document.createElement('img');thumb.src=item.currentSrc||item.src;thumb.alt='';thumb.loading='lazy';thumb.decoding='async';button.appendChild(thumb);
   button.addEventListener('click',()=>{show(n);thumbnails.children[index].focus({preventScroll:true});});thumbnails.appendChild(button);
  });
 }
 function open(item){
  const source=el=>el.dataset.src||el.getAttribute('src');const seen=new Set();items=[...document.querySelectorAll(selector)].filter(el=>{const src=source(el);if(seen.has(src))return false;seen.add(src);return true;});index=items.findIndex(el=>source(el)===source(item));if(index<0)return;origin=item;
  bodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';locked=[...document.querySelectorAll('body > header,body > main,body > footer')].map(el=>[el,el.inert]);locked.forEach(([el])=>el.inert=true);
  overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');buildThumbnails();show(index);closeButton.focus();
 }
 function close(restore=true){if(!overlay.classList.contains('open'))return;overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow=bodyOverflow;locked.forEach(([el,was])=>el.inert=was);locked=[];reset();if(restore&&origin?.isConnected)origin.focus({preventScroll:true});}
 function prepare(){document.querySelectorAll(selector).forEach(el=>{el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',`Enlarge ${el.alt||'image'}`);});}
 document.addEventListener('click',e=>{const item=e.target.closest(selector);if(item){e.preventDefault();open(item);}});
 document.addEventListener('keydown',e=>{
  if(!overlay.classList.contains('open')){if((e.key==='Enter'||e.key===' ')&&e.target.matches(selector)){e.preventDefault();open(e.target);}return;}
  if(e.key==='Escape'){e.preventDefault();close();}
  if(e.key==='ArrowRight'){e.preventDefault();const thumb=thumbnails.contains(document.activeElement);show(index+1);if(thumb)thumbnails.children[index].focus({preventScroll:true});}
  if(e.key==='ArrowLeft'){e.preventDefault();const thumb=thumbnails.contains(document.activeElement);show(index-1);if(thumb)thumbnails.children[index].focus({preventScroll:true});}
  if(e.key==='Tab'){const buttons=[...overlay.querySelectorAll('button')].filter(el=>!el.hidden&&el.tabIndex>=0);const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
 });
 window.addEventListener('resize',()=>{if(overlay.classList.contains('open'))thumbnails.children[index]?.scrollIntoView({block:'nearest',inline:'center'});});
 previous.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));closeButton.addEventListener('click',()=>close());overlay.querySelector('[data-close]').addEventListener('click',()=>close());
 image.addEventListener('click',()=>{if(drag?.moved)return;scale=scale===1?2.4:1;x=y=0;image.style.transform=`scale(${scale})`;image.style.cursor=scale===1?'zoom-in':'grab';});
 image.addEventListener('wheel',e=>{e.preventDefault();scale=Math.max(1,Math.min(5,scale-e.deltaY*.002));if(scale===1)x=y=0;image.style.transform=`translate(${x}px,${y}px) scale(${scale})`;image.style.cursor=scale===1?'zoom-in':'grab';},{passive:false});
 image.addEventListener('pointerdown',e=>{drag={sx:e.clientX,sy:e.clientY,x,y,moved:false};image.setPointerCapture(e.pointerId);});
 image.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(Math.abs(dx)+Math.abs(dy)>10)drag.moved=true;if(scale>1){x=drag.x+dx;y=drag.y+dy;image.style.transform=`translate(${x}px,${y}px) scale(${scale})`;}});
 image.addEventListener('pointerup',e=>{if(drag&&scale===1&&Math.abs(e.clientX-drag.sx)>60){show(index+(e.clientX<drag.sx?1:-1));}setTimeout(()=>{drag=null;},0);});
 image.addEventListener('pointercancel',()=>{drag=null;});
 document.addEventListener('swup:willReplaceContent',()=>close(false));document.addEventListener('swup:contentReplaced',prepare);document.addEventListener('astro:page-load',prepare);prepare();
 new MutationObserver(prepare).observe(document.querySelector('main'),{childList:true,subtree:true});
})();
