'use strict';
(() => {
 const C=globalThis.LaundryReservationCore;
 const COPY={
 hr:{title:'Rezervacije',reserve:'Rezerviraj',close:'Zatvori',mine:'Moje rezervacije',empty:'Nemaš nadolazećih rezervacija.',cancel:'Otkaži',date:'Datum',time:'Početak',duration:'Trajanje',confirm:'Potvrdi rezervaciju',retry:'Ponovi potvrdu',window:'Do 7 dana unaprijed · vrijeme Bruxellesa',rule:'Jedan termin po uređaju dok ne završi ili ga otkažeš.',separate:'Rezervacija čuva termin; provjeri i trenutačno stanje uređaja.',demo:'SIMULACIJA · Rezervacije se spremaju samo u ovom pregledniku.',saving:'Spremam rezervaciju…',loading:'Dohvaćam rezervacije…',unavailable:'Rezervacije trenutačno nisu dostupne. Pokušaj ponovno.',refresh:'Osvježi rezervacije',busy:'Zauzeto',none:'Nema slobodnih početaka za ovaj datum i trajanje.',limit:'Već imaš termin za ovaj uređaj. Možeš ga otkazati u svojim rezervacijama.',conflict:'Termin se preklapa ili već imaš rezervaciju za ovaj uređaj. Odaberi drugi termin.',invalid:'Termin mora biti u sljedećih 7 dana, uz trajanje od 30 minuta do 3 sata.',forbidden:'Možeš otkazati samo svoju rezervaciju.',unknown:'Potvrda nije stigla. Ponovi isti zahtjev kako bismo provjerili rezultat.',saved:'Rezervacija je potvrđena.',cancelled:'Rezervacija je otkazana.',alreadyCancelled:'Ova rezervacija je već otkazana.',today:'danas',tomorrow:'sutra',next:'Sljedeći termin',active:'Rezervirano do',min:'min',open:'Otvori uređaj'},
 en:{title:'Reservations',reserve:'Reserve',close:'Close',mine:'My reservations',empty:'You have no upcoming reservations.',cancel:'Cancel',date:'Date',time:'Start time',duration:'Duration',confirm:'Confirm reservation',retry:'Retry confirmation',window:'Up to 7 days ahead · Brussels time',rule:'One booking per appliance until it ends or you cancel it.',separate:'A reservation holds a time slot; also check the current appliance status.',demo:'SIMULATION · Reservations are saved only in this browser.',saving:'Saving reservation…',loading:'Loading reservations…',unavailable:'Reservations are currently unavailable. Please try again.',refresh:'Refresh reservations',busy:'Booked',none:'No start times are available for this date and duration.',limit:'You already have a booking for this appliance. You can cancel it in your reservations.',conflict:'This slot overlaps or you already have a booking for this appliance. Choose another time.',invalid:'The slot must be within the next 7 days and last 30 minutes to 3 hours.',forbidden:'You can only cancel your own reservation.',unknown:'Confirmation did not arrive. Retry the same request to check the result.',saved:'Reservation confirmed.',cancelled:'Reservation cancelled.',alreadyCancelled:'This reservation was already cancelled.',today:'today',tomorrow:'tomorrow',next:'Next booking',active:'Reserved until',min:'min',open:'Open appliance'}
 };
 function el(tag,cls,value){const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;}
 function uuid(){if(globalThis.crypto?.randomUUID)return crypto.randomUUID();const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=[...b].map(v=>v.toString(16).padStart(2,'0')).join('');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);}
 const problem=(status)=>Object.assign(new Error('Reservation request failed'),{status});
 function httpAdapter(selected){
  async function call(body){let response;try{response=await fetch('/api/reservations'+(!body&&selected?'?machine='+encodeURIComponent(selected):''),{method:body?'POST':'GET',headers:{'X-Praonica':'1',...(body?{'Content-Type':'application/json'}:{})},cache:'no-store',signal:AbortSignal.timeout(8000),...(body?{body:JSON.stringify(body)}:{})});}catch{throw problem(0);}
   if(!response.ok)throw problem(response.status);try{return await response.json();}catch{throw problem(0);}}
  return {read:()=>call(),write:body=>call(body)};
 }
 function demoAdapter(getDevices,selected){
  const key='praonica.demo.reservations.v1';
  const locked=fn=>globalThis.navigator?.locks? navigator.locks.request(key,fn):Promise.resolve().then(fn);
  function readStore(){const raw=localStorage.getItem(key);if(raw){const v=JSON.parse(raw);if(v.version!==1||!Array.isArray(v.bookings)||v.bookings.length>3000)throw problem(503);return v.bookings.map(C.booking);}
   const ids=getDevices().map(d=>d.id);const stamp=Math.ceil((Date.now()/1000+7200)/C.STEP)*C.STEP;
   const candidates=[ids.find(id=>id.includes('washer-2')),ids.find(id=>id.includes('dryer-1'))].filter(Boolean);
   return candidates.map((id,i)=>({id:'20000000-0000-4000-8000-'+String(i+1).padStart(12,'0'),machine_id:id,starts_at:stamp+i*3600,ends_at:stamp+(i+1)*3600,is_mine:false,cancelled:false}));
  }
  function save(rows){localStorage.setItem(key,JSON.stringify({version:1,bookings:rows}));}
  return {
   read:()=>locked(()=>{const now=Date.now()/1000;const ids=new Set(getDevices().map(d=>d.id));const rows=readStore().filter(r=>r.ends_at>now&&ids.has(r.machine_id));save(rows);const active=rows.filter(r=>!r.cancelled);const next=[];for(const id of ids){const first=active.filter(r=>r.machine_id===id).sort((a,b)=>a.starts_at-b.starts_at)[0];if(first)next.push(first);}
    return {schema_version:1,server_at:now,window_end:now+C.WINDOW,timezone:C.TZ,reservations:active.filter(r=>r.machine_id===selected),mine:active.filter(r=>r.is_mine),next};}),
   write:body=>locked(()=>{if(!C.validRequest(body)||!getDevices().some(d=>d.id===body.machine_id))throw problem(400);const now=Date.now()/1000;const rows=readStore();let r;let status='accepted';
    if(body.operation==='cancel'){r=rows.find(r=>r.id===body.reservation_id&&r.machine_id===body.machine_id);if(!r)throw problem(404);if(!r.is_mine)throw problem(403);if(r.cancelled)status='duplicate';r.cancelled=true;}
    else{r=rows.find(r=>r.id===body.request_id);if(r){if(!r.is_mine||r.machine_id!==body.machine_id||r.starts_at!==body.starts_at||r.ends_at!==body.ends_at)throw problem(409);status='duplicate';}
     else{if(body.starts_at<=now||body.ends_at>now+C.WINDOW)throw problem(400);const current=rows.filter(r=>r.machine_id===body.machine_id&&!r.cancelled&&r.ends_at>now);if(current.some(r=>r.is_mine)||current.some(r=>C.overlaps(r,body)))throw problem(409);r={id:body.request_id,machine_id:body.machine_id,starts_at:body.starts_at,ends_at:body.ends_at,is_mine:true,cancelled:false};rows.push(r);}}
    save(rows);return {status,server_at:now,reservation:{...r}};})
  };
 }
 function mount({root,selectedMachine=null,getDevices,language='hr',demo=false,enabled=true,adapter,onChange}={}){
  if(!root||!enabled)return null;
  const l=COPY[language==='en'?'en':'hr'];const locale=language==='en'?'en-GB':'hr-HR';
  const dayKeyFormat=new Intl.DateTimeFormat('en-CA',{timeZone:C.TZ,year:'numeric',month:'2-digit',day:'2-digit'});
  const timeFormat=new Intl.DateTimeFormat(locale,{timeZone:C.TZ,hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const dayFormat=new Intl.DateTimeFormat(locale,{timeZone:C.TZ,weekday:'short',day:'numeric',month:'short'});
  const dayKey=t=>dayKeyFormat.format(new Date(t*1000));const time=t=>timeFormat.format(new Date(t*1000));
  let data=null,arrival=0,failed=false,loading=false,busy=false,pending=null,selectedDay='',selectedDuration=60,notice='',formError='';
  const api=adapter||(demo?demoAdapter(getDevices,selectedMachine):httpAdapter(selectedMachine));
  const now=()=>data?data.server_at+Math.max(0,(performance.now()-arrival)/1000):Date.now()/1000;
  const fresh=()=>!!data&&!failed&&(performance.now()-arrival)<60000;
  const names=id=>getDevices().find(d=>d.id===id)?.name||id;
  const tomorrowKey=()=>{const parts=dayKeyFormat.formatToParts(new Date(now()*1000));const part=k=>Number(parts.find(p=>p.type===k).value);return new Date(Date.UTC(part('year'),part('month')-1,part('day')+1)).toISOString().slice(0,10);};
  const when=t=>dayKey(t)===dayKey(now())?l.today:dayKey(t)===tomorrowKey()?l.tomorrow:dayFormat.format(new Date(t*1000));
  const slotText=r=>when(r.starts_at)+' · '+time(r.starts_at)+'–'+(dayKey(r.starts_at)!==dayKey(r.ends_at)?when(r.ends_at)+' ':'')+time(r.ends_at);
  root.className='booking-section';root.hidden=false;
  const header=el('div','booking-heading');header.append(el('h2','',l.title));
  const reserve=el('button','booking-primary',l.reserve);reserve.type='button';reserve.hidden=!selectedMachine;header.append(reserve);
  const info=el('p','booking-info',demo?l.demo:l.window);
  const feedback=el('p','booking-feedback');feedback.setAttribute('role','status');
  const reload=el('button','booking-link',l.refresh);reload.type='button';reload.hidden=true;
  const nextText=el('p','booking-next');nextText.hidden=!selectedMachine;
  const mine=el('details','booking-mine');const summary=el('summary','',l.mine);const list=el('div','booking-list');mine.append(summary,list);
  const empty=el('p','booking-empty',l.empty);list.append(empty);const myRefs=new Map();
  root.append(header,info,nextText,feedback,reload,mine);
  const dialog=el('dialog','booking-dialog');dialog.setAttribute('aria-labelledby','booking-dialog-title');
  const dialogHead=el('div','booking-dialog-head');const title=el('h2');title.id='booking-dialog-title';const close=el('button','booking-close','×');close.type='button';close.setAttribute('aria-label',l.close);dialogHead.append(title,close);
  const form=el('form');const daysLabel=el('p','booking-field-title',l.date);const days=el('div','booking-days');days.setAttribute('role','group');days.setAttribute('aria-label',l.date);
  const startLabel=el('label','booking-field',l.time);const start=el('select');start.required=true;start.setAttribute('aria-label',l.time);startLabel.append(start);
  const durationLabel=el('label','booking-field',l.duration);const duration=el('select');duration.setAttribute('aria-label',l.duration);for(const value of C.DURATIONS){const option=el('option','',value+' '+l.min);option.value=String(value);duration.append(option);}duration.value='60';durationLabel.append(duration);
  const fields=el('div','booking-fields');fields.append(startLabel,durationLabel);
  const preview=el('p','booking-next');preview.setAttribute('aria-live','polite');
  const warning=el('p','booking-warning');warning.setAttribute('role','status');
  const submit=el('button','booking-primary',l.confirm);submit.type='submit';
  form.append(el('p','booking-info',l.window),daysLabel,days,fields,preview,el('p','booking-info',l.rule),el('p','booking-info',l.separate),warning,submit);
  dialog.append(dialogHead,form);document.body.append(dialog);
  const tileRefs=new Map();let daySignature='';const dayButtons=new Map();
  function repaint(){
   const valid=fresh();reserve.disabled=busy||!getDevices().some(d=>d.id===selectedMachine);
   reload.hidden=!failed;reload.disabled=loading||busy;
   if(!pending&&!busy)feedback.textContent=failed?l.unavailable:loading&&!data?l.loading:notice;
   if(data){
    const next=data.next.find(r=>r.machine_id===selectedMachine&&r.ends_at>now());nextText.textContent=next?l.next+': '+slotText(next):'';nextText.hidden=!next||!selectedMachine;
    const mineRows=data.mine.filter(r=>r.ends_at>now());summary.textContent=l.mine+(mineRows.length?' · '+mineRows.length:'');empty.hidden=mineRows.length>0;
    const ids=new Set(mineRows.map(r=>r.id));for(const [id,refs]of myRefs)if(!ids.has(id)){refs.item.remove();myRefs.delete(id);}
    for(const r of mineRows){let refs=myRefs.get(r.id);if(!refs){const item=el('article','booking-item');const text=el('div');const name=el('a','booking-appliance');name.href='?machine='+encodeURIComponent(r.machine_id);const date=el('p');text.append(name,date);const cancel=el('button','booking-link',l.cancel);cancel.type='button';cancel.addEventListener('click',()=>cancelBooking(r));item.append(text,cancel);list.append(item);refs={item,name,date,cancel};myRefs.set(r.id,refs);}refs.name.textContent=names(r.machine_id);refs.date.textContent=slotText(r);refs.cancel.disabled=busy||!valid;}
   }
   for(const link of document.querySelectorAll('.machine-tile[data-machine-id]')){
    const id=link.getAttribute('data-machine-id');let text=tileRefs.get(link);const r=valid?data.next.find(r=>r.machine_id===id&&r.ends_at>now()):null;
    if(r){if(!text){text=el('span','tile-booking');link.append(text);tileRefs.set(link,text);}text.textContent=r.starts_at<=now()?l.active+' '+time(r.ends_at):l.next+': '+when(r.starts_at)+' '+time(r.starts_at);text.hidden=false;}
    else if(text)text.hidden=true;
    const name=link.querySelector('.tile-name')?.textContent||id;const state=link.querySelector('.tile-state')?.textContent||'';
    link.setAttribute('aria-label',name+' · '+state+' · '+(language==='en'?'Open details':'Otvori detalje')+(r?' · '+text.textContent:''));
   }
  }
  function paintForm(){
   if(!dialog.open)return;
   title.textContent=l.reserve+' · '+names(selectedMachine);const valid=fresh();
   const own=data?.mine.some(r=>r.machine_id===selectedMachine&&r.ends_at>now());
   const limit=now()+C.WINDOW;const all=[];for(let t=Math.ceil((now()+1)/C.STEP)*C.STEP;t+selectedDuration*60<=limit;t+=C.STEP)all.push(t);
   const groups=new Map();for(const t of all){const key=dayKey(t);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(t);}
   if(!groups.has(selectedDay))selectedDay=groups.keys().next().value||'';
   const signature=[...groups.keys()].join('|');if(signature!==daySignature){days.replaceChildren();dayButtons.clear();for(const [key,values]of groups){const button=el('button','booking-day',dayFormat.format(new Date(values[0]*1000)));button.type='button';button.addEventListener('click',()=>{selectedDay=key;formError='';paintForm();});days.append(button);dayButtons.set(key,button);}daySignature=signature;}
   for(const [key,button]of dayButtons){button.setAttribute('aria-pressed',String(key===selectedDay));button.disabled=busy||!!pending;}
   const old=start.value;const options=[];for(const t of groups.get(selectedDay)||[]){const conflict=data?.reservations.some(r=>C.overlaps(r,{starts_at:t,ends_at:t+selectedDuration*60}));const option=el('option','',time(t)+(conflict?' · '+l.busy:''));option.value=String(t);option.disabled=!!conflict;options.push(option);}
   if(pending&&!options.some(o=>o.value===String(pending.starts_at))){const option=el('option','',time(pending.starts_at));option.value=String(pending.starts_at);options.unshift(option);}
   start.replaceChildren(...options);const choice=(pending?options.find(o=>o.value===String(pending.starts_at)):null)||options.find(o=>o.value===old&&!o.disabled)||options.find(o=>!o.disabled);if(choice)start.value=choice.value;preview.textContent=pending?slotText(pending):choice?slotText({starts_at:Number(start.value),ends_at:Number(start.value)+selectedDuration*60}):'';
   start.disabled=duration.disabled=busy||!!pending||!valid||!!own;
   submit.textContent=busy?l.saving:pending?l.retry:l.confirm;submit.disabled=busy||!valid||!!own||!choice;
   if(pending){submit.disabled=busy;warning.textContent=busy?l.saving:l.unknown;}
   else warning.textContent=formError||(!valid?(failed?l.unavailable:l.loading):own?l.limit:!choice?l.none:'');
  }
  async function load(){
   if(loading)return;loading=true;repaint();
   try{const value=C.publicRead(await api.read());data=value;arrival=performance.now();failed=false;
    if(pending&&data.mine.some(r=>r.id===pending.request_id)){pending=null;notice=l.saved;formError='';if(dialog.open)dialog.close();}}
   catch{failed=true;}finally{loading=false;repaint();paintForm();onChange?.();}
  }
  const message=e=>e.status===409?l.conflict:e.status===400?l.invalid:e.status===403?l.forbidden:l.unavailable;
  async function send(body){
   let last;for(let attempt=0;attempt<2;attempt++){try{return await api.write(body);}catch(e){last=e;if(e.status>=400&&e.status<500)throw e;}}throw last;
  }
  async function reserveBooking(event){
   event.preventDefault();if(busy||!fresh())return;
   if(!pending){const t=Number(start.value);const body={operation:'reserve',machine_id:selectedMachine,request_id:uuid(),starts_at:t,ends_at:t+selectedDuration*60};if(!C.validRequest(body)){warning.textContent=l.invalid;return;}pending=body;}
   busy=true;repaint();paintForm();
   try{const result=await send(pending);const r=C.booking(result.reservation);if(r.id!==pending.request_id||!r.is_mine||r.machine_id!==selectedMachine||r.starts_at!==pending.starts_at||r.ends_at!==pending.ends_at)throw problem(0);pending=null;formError='';dialog.close();notice=r.cancelled?l.alreadyCancelled:l.saved;}
   catch(e){if(e.status>=400&&e.status<500){pending=null;formError=message(e);}else warning.textContent=l.unknown;}
   finally{busy=false;await load();repaint();paintForm();}
  }
  async function cancelBooking(r){if(busy||!fresh())return;busy=true;repaint();try{const result=await send({operation:'cancel',machine_id:r.machine_id,reservation_id:r.id});const item=C.booking(result.reservation);if(item.id!==r.id||!item.is_mine||!item.cancelled)throw problem(0);notice=l.cancelled;}catch(e){notice=message(e);}finally{busy=false;await load();}}
  reserve.addEventListener('click',()=>{if(!dialog.open){dialog.showModal();selectedDay='';daySignature='';formError='';paintForm();load();}});
  close.addEventListener('click',()=>dialog.close());form.addEventListener('submit',reserveBooking);
  start.addEventListener('change',()=>{formError='';paintForm();});duration.addEventListener('change',()=>{selectedDuration=Number(duration.value);formError='';paintForm();});reload.addEventListener('click',load);
  load();const interval=setInterval(()=>{if(!busy)load();},30000);
  return {update:repaint,refresh:load,current(id){const r=fresh()?data.next.find(r=>r.machine_id===id):null;return r&&r.starts_at<=now()&&r.ends_at>now()?r:null;},destroy(){clearInterval(interval);dialog.remove();}};
 }
 globalThis.LaundryBookings=Object.freeze({mount,demoAdapter,httpAdapter});
})();
