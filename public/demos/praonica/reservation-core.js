'use strict';
// Shared wire contract and time rules. PostgreSQL owns atomic booking decisions.
(() => {
  const WINDOW=7*86400, STEP=900, DURATIONS=Object.freeze([30,60,90,120,150,180]), TZ='Europe/Brussels';
  const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const ID=/^[a-z0-9][a-z0-9_-]{0,63}$/;
  const finite=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
  const times=(a,b)=>finite(a)&&finite(b)&&a%STEP===0&&DURATIONS.includes((b-a)/60);
  function validRequest(v,actor=false) {
    if(!v||typeof v!=='object'||Array.isArray(v))return false;
    const keys={read:['operation','machine_id'],reserve:['operation','machine_id','request_id','starts_at','ends_at'],cancel:['operation','machine_id','reservation_id']}[v.operation];
    if(!keys)return false;
    const allowed=actor?[...keys,'actor_hash']:keys;
    if(Object.keys(v).length!==allowed.length||Object.keys(v).some(k=>!allowed.includes(k)))return false;
    if(actor&&(typeof v.actor_hash!=='string'||!/^[0-9a-f]{64}$/.test(v.actor_hash)))return false;
    if(v.operation==='read')return v.machine_id===null||(typeof v.machine_id==='string'&&ID.test(v.machine_id));
    if(typeof v.machine_id!=='string'||!ID.test(v.machine_id))return false;
    return v.operation==='cancel'?typeof v.reservation_id==='string'&&UUID.test(v.reservation_id):
      typeof v.request_id==='string'&&UUID.test(v.request_id)&&times(v.starts_at,v.ends_at);
  }
  function booking(v) {
    if(!v||typeof v.id!=='string'||!UUID.test(v.id)||typeof v.machine_id!=='string'||!ID.test(v.machine_id)||
       !times(v.starts_at,v.ends_at)||typeof v.is_mine!=='boolean'||typeof v.cancelled!=='boolean')throw Error('Invalid reservation');
    return {id:v.id,machine_id:v.machine_id,starts_at:v.starts_at,ends_at:v.ends_at,is_mine:v.is_mine,cancelled:v.cancelled};
  }
  function publicRead(v) {
    if(!v||v.schema_version!==1||!finite(v.server_at)||v.timezone!==TZ||!finite(v.window_end)||Math.abs(v.window_end-v.server_at-WINDOW)>1)throw Error('Invalid reservations');
    const out={schema_version:1,server_at:v.server_at,window_end:v.window_end,timezone:TZ};
    for(const key of ['reservations','mine','next']) {
      if(!Array.isArray(v[key])||v[key].length>(key==='reservations'?340:100))throw Error('Too many reservations');
      out[key]=v[key].map(booking);
      if(new Set(out[key].map(r=>r.id)).size!==out[key].length||out[key].some(r=>r.cancelled||r.ends_at<=v.server_at||r.ends_at>v.window_end+1||key==='mine'&&!r.is_mine))throw Error('Invalid active reservation');
    }
    if(new Set(out.next.map(r=>r.machine_id)).size!==out.next.length)throw Error('Duplicate next reservation');
    return out;
  }
  const overlaps=(a,b)=>a.starts_at<b.ends_at&&a.ends_at>b.starts_at;
  globalThis.LaundryReservationCore=Object.freeze({WINDOW,STEP,DURATIONS,TZ,UUID,validRequest,booking,publicRead,overlaps,times});
})();
