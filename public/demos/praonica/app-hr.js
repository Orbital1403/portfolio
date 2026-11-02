'use strict';
const devices = document.querySelector('#devices');
const banner = document.querySelector('#banner');
const refresh = document.querySelector('#refresh');
const overview = document.querySelector('#overview');
const announcement = document.querySelector('#status-announcement');
let payload = null;
let arrival = 0;
let failed = false;
const headers = {'X-Praonica': '1'};
const date = value => value == null ? 'Još nema očitanja' : new Date(value * 1000).toLocaleString('hr-HR');
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
  banner.textContent = snapshot ? 'SPREMLJENA SNIMKA · Stvarni raniji podaci, nisu aktualno stanje. Nema veze s uređajima.' :
    serviceLost ? 'Lokalni servis nije dostupan. Aktualno stanje uređaja nije poznato.' :
    payload.notice || (payload.busy ? 'Dohvaćam stanje uređaja…' : 'Integracijski servis · automatski dohvat približno svake minute.');
  refresh.disabled = snapshot || serviceLost || payload.blocked || payload.busy || now < payload.next_at;
  refresh.querySelector('span').textContent = !snapshot && payload.next_at > now ? `Osvježi za ${Math.ceil(payload.next_at-now)} s` : 'Osvježi';
  // One presentation model keeps the overview and detail cards consistent.
  const readings = payload.devices.map(device => {
    const stale = device.age_seconds != null && device.age_seconds + elapsed > 180;
    const usable = device.usable && !stale && !serviceLost;
    const state = usable ? device.state : null;
    return {
      device, usable,
      modifier: {RUNNING:'running',PAUSED:'paused',END_OF_CYCLE:'ended'}[state] || '',
      label: snapshot ? 'Spremljena snimka' : serviceLost ? 'Stanje nepoznato' : stale ? 'Zastarjelo očitanje' : device.label,
      message: usable ? device.message : 'Dostupnost stroja nije potvrđena.',
      door: usable ? device.door : 'Nepoznato',
      phase: usable ? device.phase : '—'
    };
  });
  if (demo) {
    const items = readings.map(reading => {
      const item = node('article', 'overview-item ' + reading.modifier);
      const text = node('div', 'overview-text');
      const line = node('div', 'overview-line');
      line.append(node('h2', '', reading.device.name), node('span', 'status', reading.label));
      text.append(line, node('p', '', reading.message));
      item.append(machine(), text);
      return item;
    });
    overview.replaceChildren(...items);
  }
  const cards = readings.map((reading, index) => {
    const {device, usable} = reading;
    const card = node('article', 'card ' + reading.modifier);
    const top = node('div', 'card-top');
    const heading = node('div');
    heading.append(node('h2', '', device.name), node('p','model',`${device.model}`), node('p','model',device.detail));
    top.append(machine(), heading, node('span','number',`0${index+1}`));
    card.append(top, node('div','status', reading.label));
    card.append(node('p','message',reading.message));
    const facts = node('dl','facts');
    for (const [label,value] of [['Vrata',reading.door],['Faza programa',reading.phase]]) {
      const item = node('div'); item.append(node('dt','',label),node('dd','',value)); facts.append(item);
    }
    card.append(facts);
    if (!demo) card.append(node('p','timestamp',`${snapshot ? 'Vrijeme snimke' : 'Zadnje uspješno očitanje'}: ${date(device.received_at)}`));
    if (!demo && (snapshot || (!usable && device.received_at != null))) {
      const previous = device.previous || (device.usable ? device.label : 'Nepoznato');
      card.append(node('p','previous',`Ranije zabilježeno: ${previous}${snapshot ? ` · vrata: ${device.previous_door}` : ''}.`));
    }
    if (device.error) card.append(node('p','error',device.error));
    return card;
  });
  devices.replaceChildren(...cards);
  return readings;
}
const demo = document.querySelector('meta[name="praonica-mode"]')?.content === 'demo';
if (demo) {
  document.body.classList.add('demo');
  refresh.hidden = true;
  overview.hidden = false;
  banner.removeAttribute('role');
  const demoPanel = node('div', 'demo-panel');
  const label = node('label', '', 'Isprobaj prikaz sušilice: ');
  const select = node('select');
  select.setAttribute('aria-label', 'Simulirano stanje sušilice');
  for (const [value, text] of [['RUNNING','U radu'],['PAUSED','Pauza'],['END_OF_CYCLE','Program završen'],['OFFLINE','Bez veze']]) {
    const option = node('option','',text); option.value=value; select.append(option);
  }
  label.append(select); demoPanel.append(label);
  banner.after(demoPanel);
  let previousValue = null;
  function simulate() {
    const now = Date.now()/1000;
    const value = select.value;
    const running = value === 'RUNNING';
    payload = {mode:'demo',server_at:now,next_at:null,busy:false,blocked:true,
      notice:'SIMULACIJA · Primjeri stanja. Nema veze sa stvarnim uređajima.',
      devices:[
        {name:'Perilica',model:'Prototip 01',detail:'Testni uređaj',state:'END_OF_CYCLE',usable:true,label:'Program završen',message:'Program je završio. Potrebno je provjeriti je li rublje preuzeto.',door:'Zatvorena',phase:'—',received_at:now,age_seconds:0},
        {name:'Sušilica',model:'Prototip 02',detail:'Testni uređaj',state:value==='OFFLINE'?null:value,usable:value!=='OFFLINE',label:running?'U radu':value==='PAUSED'?'Pauzirano':value==='END_OF_CYCLE'?'Program završen':'Veza nedostupna',message:running?'Program je u tijeku.':value==='PAUSED'?'Program je pauziran. Stroj je i dalje zauzet.':value==='END_OF_CYCLE'?'Program je završio. Potrebno je provjeriti je li rublje preuzeto.':'Dostupnost stroja nije potvrđena.',door:value==='PAUSED'?'Otvorena':'Zatvorena',phase:running?'Sušenje':'—',received_at:now,age_seconds:0}
      ]};
    arrival=performance.now(); failed=false;
    const readings = render();
    if (previousValue !== null && previousValue !== value) {
      const dryer = readings[1];
      announcement.textContent = `${dryer.device.name}: ${dryer.label}. Vrata: ${dryer.door}. ${dryer.message}`;
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
    if (!payload) {banner.textContent = 'Lokalni servis nije dostupan. Pokreni aplikaciju u Terminalu.'; banner.className='banner warning'; refresh.disabled=true;}
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
