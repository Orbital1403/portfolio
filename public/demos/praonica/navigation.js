'use strict';
// Shared presentation policy for the private app and the public simulation.
(() => {
  const COPY = {
    hr: {washer:'Perilice',dryer:'Sušilice',other:'Ostali uređaji',available:'Slobodno',busy:'Zauzeto',
      waiting:'Čeka preuzimanje',unknown:'Nepoznato',confirmed:'Preuzimanje potvrđeno',
      confirmRule:'Slobodno = potvrđeno preuzimanje uz svježe stanje.',details:'Otvori detalje',empty:'Nema prijavljenih uređaja.'},
    en: {washer:'Washers',dryer:'Dryers',other:'Other appliances',available:'Available',busy:'Occupied',
      waiting:'Awaiting collection',unknown:'Unknown',confirmed:'Collection confirmed',
      confirmRule:'Available = collection confirmed and appliance status is current.',details:'Open details',empty:'No appliances registered.'}
  };
  const busyStates = ['RUNNING','PAUSED','DELAYED_START'];
  const restStates = ['IDLE','OFF','READY_TO_START','END_OF_CYCLE'];
  function classify(device, {fresh=false, usage=null, lastBusyAt=0, simulatedPickup=false, pending=false, language='hr'} = {}) {
    const l = COPY[language === 'en' ? 'en' : 'hr'];
    let key = 'unknown';
    if (fresh && device.usable === true && !device.error) {
      if (busyStates.includes(device.state) || usage?.active === true) key = 'busy';
      else {
        const collected = usage?.active === false && Number.isFinite(usage.collected_at) &&
          usage.collected_at > 0 && usage.collected_at >= lastBusyAt;
        const example = simulatedPickup && device.simulated === true && device.pickup_confirmed === true;
        if (!pending && restStates.includes(device.state) && (collected || example)) key = 'available';
        else if (device.state === 'END_OF_CYCLE') key = 'waiting';
      }
    }
    return {key, label:l[key], hint:key === 'available' ? l.confirmed : ''};
  }
  function node(tag, className, value) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value !== undefined) el.textContent = value;
    return el;
  }
  function set(el,value) { if (el.textContent !== value) el.textContent = value; }
  function createDashboard(root, {language='hr',href=device=>'?machine='+encodeURIComponent(device.id),icon}={}) {
    if (!root) return null;
    const l = COPY[language === 'en' ? 'en' : 'hr'];
    root.className = 'machine-dashboard';
    root.hidden = true;
    const legend = node('div','machine-legend');
    for (const key of ['available','busy','waiting','unknown']) legend.append(node('span','legend-item tone-'+key,l[key]));
    const rule = node('p','availability-rule',l.confirmRule);
    root.append(legend);
    const groups = new Map();
    for (const kind of ['washer','dryer','other']) {
      const section = node('section','machine-group');
      const heading = node('h2','machine-group-heading');
      const count = node('span','machine-group-count','0');
      heading.append(node('span','',l[kind]),count);
      const grid = node('div','machine-grid');
      const empty = node('p','machine-empty',l.empty);
      section.append(heading,grid,empty);
      root.append(section);
      groups.set(kind,{section,count,grid,empty});
    }
    root.append(rule);
    const tiles = new Map();
    function render(readings) {
      const ids = new Set(readings.map(r=>r.device.id));
      for (const [id,refs] of tiles) if (!ids.has(id)) { refs.link.remove();tiles.delete(id); }
      const counts={washer:0,dryer:0,other:0};
      for (const reading of readings) {
        const d=reading.device;
        const kind=['washer','dryer'].includes(d.kind || d.type) ? d.kind || d.type : 'other';
        counts[kind]++;
        let refs=tiles.get(d.id);
        if (!refs) {
          const link=node('a','machine-tile');
          const top=node('div','tile-top');
          if (icon) top.append(icon());
          const name=node('h3','tile-name');
          const status=node('span','tile-state');
          const hint=node('span','tile-hint');
          top.append(name);link.append(top,status,hint);
          refs={link,name,status,hint};tiles.set(d.id,refs);
        }
        const a=reading.availability;
        refs.link.className='machine-tile tone-'+a.key;
        refs.link.href=href(d);
        refs.link.setAttribute('aria-label',d.name+' · '+a.label+' · '+l.details);
        refs.link.setAttribute('data-machine-id',d.id);
        set(refs.name,d.name);set(refs.status,a.label);set(refs.hint,a.hint);refs.hint.hidden=!a.hint;
        if (refs.link.parentNode !== groups.get(kind).grid) groups.get(kind).grid.append(refs.link);
      }
      for (const [kind,g] of groups) { set(g.count,String(counts[kind]));g.empty.hidden=counts[kind]>0;g.section.hidden=kind==='other'&&counts.other===0; }
      root.hidden=false;
    }
    return {render,tiles,groups};
  }
  globalThis.LaundryNavigation=Object.freeze({classify,createDashboard});
})();
