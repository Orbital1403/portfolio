'use strict';
// The inventory and the October energy figures are fictional portfolio examples.
(() => {
  const energy = Object.freeze({month: '2026-10', readings: Object.freeze({
    'demo-washer-1': 18400, 'demo-washer-2': 22100, 'demo-washer-3': 15700,
    'demo-washer-4': 19800, 'demo-washer-5': 17000,
    'demo-dryer-1': 31600, 'demo-dryer-2': 28400, 'demo-dryer-3': 35000
  })});
  const labels = {
    en: {washer: 'Washer', dryer: 'Dryer', example: 'Example', detail: 'Simulated appliance',
      states: {RUNNING: 'Running', PAUSED: 'Paused', END_OF_CYCLE: 'Cycle finished', IDLE: 'Idle'},
      offline: 'Connection unavailable', open: 'Open', closed: 'Closed', unknown: 'Unknown',
      phases: {WASH: 'Washing', DRY: 'Drying', COOL: 'Cooling'},
      messages: {RUNNING: 'The cycle is running.', PAUSED: 'The cycle is paused. The machine is still occupied.',
        END_OF_CYCLE: 'The cycle has finished. Check whether the laundry has been collected.'},
      unavailable: 'Machine availability is not confirmed.'},
    hr: {washer: 'Perilica', dryer: 'Sušilica', example: 'Primjer', detail: 'Simulirani uređaj',
      states: {RUNNING: 'U radu', PAUSED: 'Pauzirano', END_OF_CYCLE: 'Program završen', IDLE: 'U mirovanju'},
      offline: 'Veza nedostupna', open: 'Otvorena', closed: 'Zatvorena', unknown: 'Nepoznato',
      phases: {WASH: 'Pranje', DRY: 'Sušenje', COOL: 'Hlađenje'},
      messages: {RUNNING: 'Program je u tijeku.', PAUSED: 'Program je pauziran. Stroj je i dalje zauzet.',
        END_OF_CYCLE: 'Program je završio. Potrebno je provjeriti je li rublje preuzeto.'},
      unavailable: 'Dostupnost stroja nije potvrđena.'}
  };
  function createDevices(now, dryerState = 'RUNNING', language = 'en') {
    const l = labels[language === 'hr' ? 'hr' : 'en'];
    const controlled = ['RUNNING', 'PAUSED', 'END_OF_CYCLE'].includes(dryerState) ? dryerState : null;
    const profiles = [
      ['washer', 1, 'RUNNING', 'WASH', 'CLOSED'],
      ['washer', 2, 'END_OF_CYCLE', null, 'CLOSED'],
      ['washer', 3, 'PAUSED', null, 'CLOSED'],
      ['washer', 4, 'IDLE', null, 'OPEN'],
      ['washer', 5, null, null, null],
      ['dryer', 1, controlled, controlled === 'RUNNING' ? 'DRY' : null, controlled === 'PAUSED' ? 'OPEN' : 'CLOSED'],
      ['dryer', 2, 'END_OF_CYCLE', null, 'CLOSED'],
      ['dryer', 3, 'RUNNING', 'COOL', 'CLOSED']
    ];
    return profiles.map(([type, number, state, phase, door], index) => ({
      id: `demo-${type}-${number}`, type, name: `${l[type]} ${number}`,
      model: `${l.example} ${String(index + 1).padStart(2, '0')}`, detail: l.detail,
      simulated:true, pickup_confirmed:(type==='washer' && number===4) || (type==='dryer' && number===2),
      state, usable: state !== null, label: l.states[state] || l.offline,
      message: ((type==='washer' && number===4) || (type==='dryer' && number===2)) ?
        (language==='hr' ? 'SIMULACIJA · Preuzimanje rublja je potvrđeno.' : 'SIMULATION · Laundry collection has been confirmed.') : l.messages[state] || l.unavailable,
      door: state === null ? l.unknown : door === 'OPEN' ? l.open : l.closed,
      phase: l.phases[phase] || '—', received_at: now, age_seconds: 0
    }));
  }
  globalThis.PraonicaDemoFixtures = Object.freeze({energy, createDevices});
})();
