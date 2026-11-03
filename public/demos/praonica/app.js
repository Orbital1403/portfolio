'use strict';
const devices = document.querySelector('#devices');
const banner = document.querySelector('#banner');
const refresh = document.querySelector('#refresh');
const overview = document.querySelector('#overview');
const announcement = document.querySelector('#status-announcement');
const query = new URLSearchParams(location.search);
const selectedMachine = query.get('machine');
const dashboard = LaundryNavigation.createDashboard(overview, {language:document.documentElement.lang,icon:machine,
  href:device => '?machine='+encodeURIComponent(device.id)+'&state='+encodeURIComponent(payload.devices.find(d=>d.id==='demo-dryer-1').state || 'OFFLINE')});
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
  // One presentation model keeps the overview and detail cards consistent.
  const readings = payload.devices.map(device => {
    const stale = device.age_seconds != null && device.age_seconds + elapsed > 180;
    const usable = device.usable && !stale && !serviceLost;
    const state = usable ? device.state : null;
    return {
      device, usable,
      availability: LaundryNavigation.classify(device,{fresh:usable,simulatedPickup:true,language:document.documentElement.lang}),
      modifier: {RUNNING:'running',PAUSED:'paused',END_OF_CYCLE:'ended'}[state] || '',
      label: snapshot ? 'Saved snapshot' : serviceLost ? 'Status unknown' : stale ? 'Outdated reading' : device.label,
      message: usable ? device.message : 'Machine availability is not confirmed.',
      door: usable ? device.door : 'Unknown',
      phase: usable ? device.phase : '—'
    };
  });
  if (!selectedMachine) dashboard.render(readings);
  overview.hidden = !!selectedMachine;
  devices.hidden = !selectedMachine;
  devices.className = 'devices single-machine';
  const navigation = document.querySelector('#machine-navigation');
  navigation.hidden = !selectedMachine;
  navigation.querySelector('a').href = './?state='+encodeURIComponent(payload.devices.find(d=>d.id==='demo-dryer-1').state || 'OFFLINE');
  const visibleReadings = selectedMachine ? readings.filter(r=>r.device.id===selectedMachine) : [];
  const cards = visibleReadings.map((reading, index) => {
    const {device, usable} = reading;
    const card = node('article', 'card tone-' + reading.availability.key + ' ' + reading.modifier);
    const top = node('div', 'card-top');
    const heading = node('div');
    heading.append(node('h2', '', device.name), node('p','model',`${device.model}`), node('p','model',device.detail));
    top.append(machine(), heading, node('span','number',String(payload.devices.findIndex(d=>d.id===device.id)+1).padStart(2,'0')));
    card.append(top, node('div','status', reading.availability.label));
    card.append(node('p','model',reading.label));
    if (reading.availability.hint) card.append(node('p','model',reading.availability.hint));
    card.append(node('p','message',reading.message));
    const facts = node('dl','facts');
    for (const [label,value] of [['Door',reading.door],['Cycle phase',reading.phase]]) {
      const item = node('div'); item.append(node('dt','',label),node('dd','',value)); facts.append(item);
    }
    card.append(facts);
    if (demo) PraonicaDemoEnergy.appendCard(card, device);
    if (!demo) card.append(node('p','timestamp',`${snapshot ? 'Snapshot time' : 'Last successful reading'}: ${date(device.received_at)}`));
    if (!demo && (snapshot || (!usable && device.received_at != null))) {
      const previous = device.previous || (device.usable ? device.label : 'Unknown');
      card.append(node('p','previous',`Previously recorded: ${previous}${snapshot ? ` · door: ${device.previous_door}` : ''}.`));
    }
    if (device.error) card.append(node('p','error',device.error));
    return card;
  });
  if (selectedMachine && !cards.length) cards.push(node('p','banner warning','Unknown appliance. Return to all machines.'));
  devices.replaceChildren(...cards);
  if (demo) PraonicaDemoEnergy.renderOverview(document.querySelector('#monthly-energy'), payload.devices);
  document.querySelector('#monthly-energy').hidden = !!selectedMachine;
  bookingView?.update();
  return readings;
}
const demo = document.querySelector('meta[name="praonica-mode"]')?.content === 'demo';
const bookingView=globalThis.LaundryBookings?.mount({root:document.querySelector('#reservations'),selectedMachine,getDevices:()=>payload?.devices||[],language:document.documentElement.lang,demo:true});
if (demo) {
  document.body.classList.add('demo');
  refresh.hidden = true;
  overview.hidden = false;
  banner.removeAttribute('role');
  const demoPanel = node('div', 'demo-panel');
  const label = node('label', '', 'Try dryer 1 status: ');
  const select = node('select');
  select.setAttribute('aria-label', 'Simulated dryer 1 status');
  for (const [value, text] of [['RUNNING','Running'],['PAUSED','Pause'],['END_OF_CYCLE','Cycle finished'],['OFFLINE','Offline']]) {
    const option = node('option','',text); option.value=value; select.append(option);
  }
  label.append(select); demoPanel.append(label);
  overview.after(demoPanel);
  demoPanel.hidden = !!selectedMachine;
  if (['RUNNING','PAUSED','END_OF_CYCLE','OFFLINE'].includes(query.get('state'))) select.value=query.get('state');
  let previousValue = null;
  function simulate() {
    const now = Date.now()/1000;
    const value = select.value;
    payload = {mode:'demo',server_at:now,next_at:null,busy:false,blocked:true,
      notice:'SIMULATION · 5 washers and 3 dryers. Example states, not real appliances.',
      devices: PraonicaDemoFixtures.createDevices(now, value, document.documentElement.lang)};
    arrival=performance.now(); failed=false;
    const readings = render();
    if (previousValue !== null && previousValue !== value) {
      const dryer = readings.find(reading => reading.device.id === 'demo-dryer-1');
      announcement.textContent = `${dryer.device.name}: ${dryer.label}. Door: ${dryer.door}. ${dryer.message}`;
    }
    previousValue = value;
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
