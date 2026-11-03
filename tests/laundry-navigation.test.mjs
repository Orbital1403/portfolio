import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {test} from 'node:test';
const context=vm.createContext({});
vm.runInContext(readFileSync(new URL('../public/demos/praonica/navigation.js',import.meta.url),'utf8'),context);
const classify=context.LaundryNavigation.classify;
const rest={id:'one',state:'IDLE',usable:true,simulated:true};
const collection={active:false,collected_at:1000};
test('collection, power-only samples, open doors and finished cycles have distinct meanings',()=>{
  assert.equal(classify(rest,{fresh:true}).key,'unknown');
  assert.equal(classify({...rest,door:'Otvorena'},{fresh:true}).key,'unknown');
  assert.equal(classify({...rest,state:'END_OF_CYCLE'},{fresh:true}).key,'waiting');
  assert.equal(classify(rest,{fresh:true,usage:collection}).key,'available');
  for(const state of ['RUNNING','PAUSED','DELAYED_START']) assert.equal(classify({...rest,state},{fresh:true,usage:collection}).key,'busy');
  assert.equal(classify({...rest,usable:false,state:null},{fresh:true,usage:collection}).key,'unknown');
  assert.equal(classify(rest,{fresh:false,usage:collection}).key,'unknown');
  assert.equal(classify(rest,{fresh:true,usage:collection,lastBusyAt:1001}).key,'unknown');
  assert.equal(classify(rest,{fresh:true,usage:collection,pending:true}).key,'unknown');
  assert.equal(classify(rest,{fresh:true,usage:{active:true}}).key,'busy');
});
test('fictional confirmed pickup only works in the explicitly permitted demo context',()=>{
  const sample={...rest,pickup_confirmed:true};
  assert.equal(classify(sample,{fresh:true}).key,'unknown');
  assert.equal(classify(sample,{fresh:true,simulatedPickup:true}).key,'available');
  assert.equal(classify({...sample,simulated:false},{fresh:true,simulatedPickup:true}).key,'unknown');
  assert.equal(classify(sample,{fresh:true,simulatedPickup:true,language:'en'}).label,'Available');
});

vm.runInContext(readFileSync(new URL('../public/demos/praonica/fixtures.js',import.meta.url),'utf8'),context);
test('public demo offers all four states without declaring every finished cycle available',()=>{
 const devices=context.PraonicaDemoFixtures.createDevices(1000,'END_OF_CYCLE','en');
 const states=devices.map(d=>classify(d,{fresh:d.usable,simulatedPickup:true}).key);
 assert.deepEqual(Array.from(states),['busy','waiting','busy','available','unknown','waiting','available','busy']);
});
