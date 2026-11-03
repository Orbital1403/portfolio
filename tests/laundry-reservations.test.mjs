import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash,webcrypto} from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../public/demos/praonica/',import.meta.url);
const storage=new Map();const context=vm.createContext({Date,Intl,JSON,crypto:webcrypto,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}});
for(const file of ['reservation-core.js','reservations.js'])vm.runInContext(readFileSync(new URL(file,root),'utf8'),context);
test('HR and EN entries load versioned calendar assets before the demo app',()=>{
 for(const [file,prefix,app]of [['index.html','./','app.js'],['hr/index.html','../','app-hr.js']]){
  const html=readFileSync(new URL(file,root),'utf8');assert.match(html,/<section id="reservations" hidden><\/section>/);
  assert.ok(html.indexOf('reservations.js')<html.indexOf(app));
  for(const name of ['reservation-core.js','reservations.js','reservations.css']){
   const hash=createHash('sha256').update(readFileSync(new URL(name,root))).digest('hex').slice(0,12);assert.ok(html.includes(prefix+name+'?v='+hash));
  }
 }
});
test('demo persists a booking across language entries and can cancel it without changing other demo data',async()=>{
 const devices=['demo-washer-4','demo-washer-2','demo-dryer-1'].map(id=>({id,name:id}));
 const api=context.LaundryBookings.demoAdapter(()=>devices,'demo-washer-4');await api.read();
 const start=Math.ceil((Date.now()/1000+3600)/900)*900;
 const body={operation:'reserve',machine_id:'demo-washer-4',request_id:'30000000-0000-4000-8000-000000000001',starts_at:start,ends_at:start+5400};
 assert.equal((await api.write(body)).status,'accepted');assert.equal((await api.write(body)).status,'duplicate');
 const otherLanguage=context.LaundryBookings.demoAdapter(()=>devices,'demo-washer-4');assert.equal((await otherLanguage.read()).mine.length,1);
 await assert.rejects(api.write({...body,request_id:'30000000-0000-4000-8000-000000000002',starts_at:start+7200,ends_at:start+10800}),e=>e.status===409);
 await api.write({operation:'cancel',machine_id:body.machine_id,reservation_id:body.request_id});assert.equal((await otherLanguage.read()).mine.length,0);
});
