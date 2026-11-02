'use strict';
const devices = document.querySelector('#devices');
const banner = document.querySelector('#banner');
const refresh = document.querySelector('#refresh');
let payload = null;
let arrival = 0;
let failed = false;
const headers = {'X-Praonica': '1'};
const date = value => value == null ? 'No reading yet' : new Date(value * 1000).toLocaleString('en-GB');
function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text != null) element.textContent = text;
  return element;
}
function machine() {
  const icon = node('div', 'machine');
  icon.innerHTML = '<svg viewBox="0 0 68 76" fill="none" aria-hidden="true"><rect x="6" y="2" width="56" height="71" rx="7" fill="#edf2eb" stroke="#829d8a"/><path d="M6 19h56" stroke="#829d8a"/><path d="M13 11h15" stroke="#829d8a" stroke-width="2" stroke-linecap="round"/><circle cx="53" cy="11" r="2" fill="#547a63"/><circle cx="34" cy="44" r="18" stroke="#829d8a" stroke-width="2"/><circle cx="34" cy="44" r="13" fill="#d4e2d4"/><path d="M23 46c7-7 15 7 23-1" stroke="#829d8a" stroke-width="2"/><path d="M15 74v2m38-2v2" stroke="#829d8a" stroke-width="3"/></svg>';
  return icon;
}
function render() {
  if (!payload) return;
  const elapsed = Math.max(0, (performance.now() - arrival) / 1000);
  const now = payload.server_at + elapsed;
  const snapshot = payload.mode === 'snapshot';
  const serviceLost = failed || elapsed > 20;
  banner.className = 'banner' + (snapshot || serviceLost || payload.notice ? ' warning' : '');
  banner.textContent = snapshot ? 'SAVED SNAPSHOT · Historical readings, not current status. No appliance connection.' :
    serviceLost ? 'The local service is unavailable. Current appliance status is unknown.' :
    payload.notice || (payload.busy ? 'Fetching appliance status…' : 'Integration service · automatic updates approximately every minute.');
  refresh.disabled = snapshot || serviceLost || payload.blocked || payload.busy || now < payload.next_at;
  refresh.querySelector('span').textContent = !snapshot && payload.next_at > now ? `Refresh in ${Math.ceil(payload.next_at-now)} s` : 'Refresh';
  const cards = payload.devices.map((device, index) => {
    const stale = device.age_seconds != null && device.age_seconds + elapsed > 180;
    const usable = device.usable && !stale && !serviceLost;
    const state = usable ? device.state : null;
    const card = node('article', 'card ' + ({RUNNING:'running',PAUSED:'paused',END_OF_CYCLE:'ended'}[state] || ''));
    const top = node('div', 'card-top');
    const heading = node('div');
    heading.append(node('h2', '', device.name), node('p','model',`${device.model}`), node('p','model',device.detail));
    top.append(machine(), heading, node('span','number',`0${index+1}`));
    card.append(top, node('div','status', snapshot ? 'Saved snapshot' : serviceLost ? 'Status unknown' : stale ? 'Outdated reading' : device.label));
    card.append(node('p','message',usable ? device.message : 'Machine availability is not confirmed.'));
    const facts = node('dl','facts');
    for (const [label,value] of [['Door',usable ? device.door : 'Unknown'],['Cycle phase',usable ? device.phase : '—']]) {
      const item = node('div'); item.append(node('dt','',label),node('dd','',value)); facts.append(item);
    }
    card.append(facts,node('p','timestamp',`${snapshot ? 'Snapshot time' : 'Last successful reading'}: ${date(device.received_at)}`));
    if (snapshot || (!usable && device.received_at != null)) {
      const previous = device.previous || (device.usable ? device.label : 'Unknown');
      card.append(node('p','previous',`Previously recorded: ${previous}${snapshot ? ` · door: ${device.previous_door}` : ''}.`));
    }
    if (device.error) card.append(node('p','error',device.error));
    return card;
  });
  devices.replaceChildren(...cards);
}
const demo = document.querySelector('meta[name="praonica-mode"]')?.content === 'demo';
if (demo) {
  const demoPanel = node('div', 'demo-panel');
  const label = node('label', '', 'Try a dryer status: ');
  const select = node('select');
  select.setAttribute('aria-label', 'Simulated dryer status');
  for (const [value, text] of [['RUNNING','Running'],['PAUSED','Pause'],['END_OF_CYCLE','Cycle finished'],['OFFLINE','Offline']]) {
    const option = node('option','',text); option.value=value; select.append(option);
  }
  label.append(select); demoPanel.append(label, node('p','','SIMULATION · Not connected to real appliances.'));
  banner.before(demoPanel);
  function simulate() {
    const now = Date.now()/1000;
    const value = select.value;
    const running = value === 'RUNNING';
    payload = {mode:'demo',server_at:now,next_at:null,busy:false,blocked:true,
      notice:'SIMULATED MOBILE PROTOTYPE · Example states. This preview is not connected to real appliances.',
      devices:[
        {name:'Washer',model:'Prototype 01',detail:'Test appliance',state:'END_OF_CYCLE',usable:true,label:'Cycle finished',message:'The cycle has finished. Check whether the laundry has been collected.',door:'Closed',phase:'—',received_at:now,age_seconds:0},
        {name:'Dryer',model:'Prototype 02',detail:'Test appliance',state:value==='OFFLINE'?null:value,usable:value!=='OFFLINE',label:running?'Running':value==='PAUSED'?'Paused':value==='END_OF_CYCLE'?'Cycle finished':'Connection unavailable',message:running?'The cycle is running.':value==='PAUSED'?'The cycle is paused. The machine is still occupied.':value==='END_OF_CYCLE'?'The cycle has finished. Check whether the laundry has been collected.':'Machine availability is not confirmed.',door:value==='PAUSED'?'Open':'Closed',phase:running?'Drying':'—',received_at:now,age_seconds:0}
      ]};
    arrival=performance.now(); failed=false; render();
    document.querySelectorAll('.timestamp').forEach(element => {element.textContent='Simulated example · not an appliance reading';});
    refresh.disabled=true;
  }
  select.addEventListener('change',simulate);
  simulate();
}
let fetching = false;
async function update() {
  if (fetching) return;
  fetching = true;
  try {
    const response = await fetch('/api/status', {headers,cache:'no-store',signal:AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error('status');
    const data = await response.json();
    if (!Array.isArray(data.devices) || data.devices.length !== 2) throw new Error('schema');
    payload = data; arrival = performance.now(); failed = false;
  } catch {
    failed = true;
    if (!payload) {banner.textContent = 'The local service is unavailable. Start the application in Terminal.'; banner.className='banner warning'; refresh.disabled=true;}
  } finally {fetching=false; render();}
}
refresh.addEventListener('click', async () => {
  if (demo) return;
  refresh.disabled = true;
  try {
    const response = await fetch('/api/refresh', {method:'POST', headers,signal:AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error('refresh');
  } catch {failed = true;}
  await update();
});
if (!demo) {
  update();
  setInterval(update,5000);
  setInterval(render,1000);
}
