'use strict';
// A fixed fictional month. No telemetry, storage or network requests are used.
(() => {
  const MONTH = PraonicaDemoFixtures.energy;
  const COPY = {
    en: {compact: 'Monthly', title: 'Monthly energy use', month: 'Simulated month', total: 'Laundry room total',
      simulated: 'SIMULATED DATA', note: 'Example values, not electricity meter readings.',
      incomplete: 'Incomplete data · the total is unavailable.'},
    hr: {compact: 'Mjesečno', title: 'Mjesečna potrošnja', month: 'Simulirani mjesec', total: 'Ukupno za praonicu',
      simulated: 'SIMULIRANI PODACI', note: 'Primjeri vrijednosti, nisu očitanja mjerača električne energije.',
      incomplete: 'Nepotpuni podaci · ukupna potrošnja nije dostupna.'}
  };
  function summarize(devices, readings = MONTH.readings) {
    const seen = new Set();
    const entries = devices.map(device => {
      const id = device.id;
      const value = Object.hasOwn(readings, id) ? readings[id] : null;
      const valid = typeof id === 'string' && !seen.has(id) && Number.isSafeInteger(value) && value >= 0;
      seen.add(id);
      return {id, wh: valid ? value : null};
    });
    const knownWh = entries.reduce((sum, entry) => sum + (entry.wh ?? 0), 0);
    const safeSum = Number.isSafeInteger(knownWh);
    const complete = entries.length > 0 && entries.every(entry => entry.wh !== null) && safeSum;
    return {month: MONTH.month, entries, complete, totalWh: complete ? knownWh : null,
      knownWh: safeSum ? knownWh : null};
  }
  function locale() { return document.documentElement.lang === 'hr' ? 'hr-HR' : 'en-GB'; }
  function copy() { return COPY[document.documentElement.lang === 'hr' ? 'hr' : 'en']; }
  function formatWh(wh, language = locale()) {
    return wh === null ? '—' : new Intl.NumberFormat(language, {
      minimumFractionDigits: 1, maximumFractionDigits: 1
    }).format(wh / 1000);
  }
  function monthLabel() {
    return new Intl.DateTimeFormat(locale(), {month: 'long', year: 'numeric', timeZone: 'Europe/Brussels'})
      .format(new Date(MONTH.month + '-01T12:00:00Z'));
  }
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function metric(wh) {
    const value = node('strong', 'energy-value');
    value.append(node('span', 'energy-number', formatWh(wh)), node('span', 'energy-unit', 'kWh'));
    return value;
  }
  function monthLine() {
    const line = node('p', 'energy-month');
    const date = node('time', '', monthLabel());
    date.setAttribute('datetime', MONTH.month);
    line.append(node('span', '', copy().month + ': '), date);
    return line;
  }
  function renderOverview(container, devices) {
    if (!container) return;
    const result = summarize(devices);
    const labels = copy();
    const description = node('div', 'energy-summary-copy');
    const heading = node('h2', '', labels.title);
    heading.id = 'monthly-energy-title';
    description.append(node('span', 'energy-badge', labels.simulated), heading, monthLine(),
      node('p', 'energy-note', result.complete ? labels.note : labels.incomplete));
    const total = node('div', 'energy-summary-total');
    total.append(node('p', 'energy-total-label', labels.total), metric(result.totalWh));
    container.replaceChildren(description, total);
    container.hidden = false;
  }
  function appendCard(card, device) {
    const result = summarize([device]);
    const section = node('section', 'energy-card');
    section.setAttribute('aria-label', copy().title + ': ' + device.name);
    const description = node('div');
    description.append(node('h3', '', copy().title), monthLine(), node('span', 'energy-card-mark', copy().simulated));
    section.append(description, metric(result.totalWh));
    if (!result.complete) section.append(node('p', 'energy-note', copy().incomplete));
    card.append(section);
  }
  function appendCompact(container, device) {
    const value = summarize([device]).totalWh;
    const line = node('p', 'overview-energy');
    line.append(node('span', '', copy().compact + ': '), node('strong', '', formatWh(value) + ' kWh'));
    container.append(line);
  }
  globalThis.PraonicaDemoEnergy = Object.freeze({summarize, formatWh, renderOverview, appendCard, appendCompact});
})();
