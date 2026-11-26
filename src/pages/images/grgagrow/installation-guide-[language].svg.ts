import type { APIRoute, GetStaticPaths } from 'astro'
import { readFile } from 'node:fs/promises'
import { thLiveGreen, thpLiveBlue } from '~/data/grgagrow-probes'

export const getStaticPaths: GetStaticPaths = () =>
  ['en', 'hr'].map(language => ({ params: { language } }))

const copy = {
  en: {
    title: 'Lawn monitoring system', supplyName: 'Power supply', fuses: 'Fuses', controller: 'Controller',
    readings: 'Sensor readings', steps: 'Installation',
    vent: 'Breather vent', thread: 'M12 × 1.5', enclosure: 'Enclosure air', soil: 'Soil', airReading: 'Air temperature and relative humidity',
    th: 'Soil moisture and temperature', thp: 'Soil moisture, temperature and pH',
    mounting: ['Dig', 'Lay flat', 'Backfill', 'Restore turf'],
    note: 'Both probes lie horizontally at the same depth.',
    compare: 'I compare how quickly the soil dries in sun and shade.',
    description: 'A breather vent on the left wall of the enclosure, an SHT31-D air sensor inside and two soil probes at 12 cm.',
  },
  hr: {
    title: 'Sustav za praćenje travnjaka', supplyName: 'Napajanje', fuses: 'Osigurači', controller: 'Kontroler',
    readings: 'Očitanja senzora', steps: 'Ugradnja',
    vent: 'Odzračnik', thread: 'M12 × 1,5', enclosure: 'Zrak u kućištu', soil: 'Tlo', airReading: 'Temperatura i relativna vlaga zraka',
    th: 'Vlaga i temperatura tla', thp: 'Vlaga, temperatura i pH tla',
    mounting: ['Iskop', 'Polaganje', 'Zatrpavanje', 'Obnova trave'],
    note: 'Obje sonde leže vodoravno na istoj dubini.',
    compare: 'Uspoređujem sušenje tla na suncu i u sjeni.',
    description: 'Odzračnik na lijevoj stijenci kućišta, senzor zraka SHT31-D u kućištu i dvije sonde na dubini od 12 cm.',
  },
}

// Inline the artwork so the same self-contained image works in the page and in the lightbox.
const artwork = Promise.all([
  readFile('src/assets/grgagrow-installation-cutaway.webp'),
  readFile('public/demos/my-garden/icon-192.png'),
  readFile('src/assets/grgagrow-installation-steps.webp'),
  readFile('public/fonts/ibm-plex/ibm-plex-sans-normal-400.woff2'),
  readFile('public/fonts/ibm-plex/ibm-plex-sans-normal-700.woff2'),
  readFile('public/fonts/ibm-plex/ibm-plex-mono-normal-500.woff2'),
]).then(parts => parts.map(part => part.toString('base64')))

export const GET: APIRoute = async ({ params }) => {
  const l = copy[params.language === 'hr' ? 'hr' : 'en']
  const [scene, logo, steps, regular, bold, mono] = await artwork
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xml:lang="${params.language}" viewBox="0 0 1400 928" width="1400" height="928" role="img" aria-labelledby="title desc">
    <title id="title">grgaGrow · ${l.title}</title><desc id="desc">${l.description}</desc>
    <defs>
      <style>
        @font-face{font-family:Plex;src:url(data:font/woff2;base64,${regular})} @font-face{font-family:Plex;font-weight:700;src:url(data:font/woff2;base64,${bold})}
        @font-face{font-family:Notes;src:url(data:font/woff2;base64,${mono})}
        text{font-family:Plex,Arial,sans-serif;fill:#2e405b}
        .mono{font-family:Notes,monospace}
        .label{font-size:20px;font-weight:700}
        .section{font-size:29px;font-weight:700}
      </style>
      <pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" stroke="#647b8b" stroke-opacity=".12" fill="none"/></pattern>
      <clipPath id="scene"><rect width="800" height="800" rx="5"/></clipPath>
      <path id="leaders" d="M186 71V81L264 169 M402 71V95 M402 95H365V129 M402 95H410V129 M635 71V83L528 158 M74 181V198L132 232 M676 392V378L580 341"/>
      <image id="installation-strip" href="data:image/webp;base64,${steps}" width="479" height="87"/>
    </defs>
    <rect width="1400" height="928" fill="#f8faf7"/><rect width="1400" height="928" fill="url(#grid)"/>
    <image href="data:image/png;base64,${logo}" x="30" y="21" width="52" height="52"/>
    <text x="96" y="59" font-size="35" font-weight="700">grgaGrow</text>
    <path d="M292 24V70" stroke="#bdcbc6"/>
    <text x="321" y="60" font-size="37" font-weight="700">${l.title}</text>
    <path d="M30 90H1370" stroke="#a9b8b1"/>
    <g transform="translate(30 105)" clip-path="url(#scene)">
      <image href="data:image/webp;base64,${scene}" width="800" height="800"/>
      <use href="#leaders" fill="none" stroke="#19372d" stroke-width="6"/><use href="#leaders" fill="none" stroke="#f5f4db" stroke-width="2.5"/>
      <g fill="#f4f0cc" stroke="#32483c" stroke-width="2"><circle cx="264" cy="169" r="4"/><circle cx="365" cy="129" r="4"/><circle cx="410" cy="129" r="4"/><circle cx="528" cy="158" r="4"/><circle cx="132" cy="232" r="4"/><circle cx="580" cy="341" r="4"/></g>
      <g fill="#f8faf6" stroke="#526a58"><rect x="80" y="17" width="212" height="55" rx="5"/><rect x="300" y="17" width="205" height="55" rx="5"/><rect x="513" y="17" width="244" height="55" rx="5"/><rect x="8" y="125" width="133" height="57" rx="5"/><rect x="570" y="392" width="216" height="57" rx="5"/></g>
      <g text-anchor="middle">
        <g class="label"><text x="74" y="149">${l.vent}</text><text x="678" y="417">SHT31-D</text><text x="186" y="42">${l.supplyName}</text><text x="402" y="42">${l.fuses}</text><text x="635" y="42">${l.controller}</text></g>
        <g class="mono" font-size="18"><text x="74" y="173">${l.thread}</text><text x="678" y="440" font-size="16">${l.enclosure} · I²C</text><text x="186" y="64">12 V DC</text><text x="402" y="64">2 × T100 mA</text><text x="635" y="64">ESP32-S3</text></g>
      </g>
      <g fill="none" stroke="#fbf4db" stroke-width="2.5"><path d="M55 504V648 M42 504H71 M42 648H71"/></g>
      <rect x="10" y="553" width="94" height="37" rx="4" fill="#fbf4db"/>
      <text x="57" y="579" class="mono" font-size="22" text-anchor="middle">12 cm</text>
      <g class="label" text-anchor="middle" style="font-size:24px">
        <text x="185" y="658" style="fill:#f7fbf8">TH</text><text x="588" y="658" style="fill:#f7fbf8">THP</text>
      </g>
      <g fill="#fff" stroke-width="3"><rect x="32" y="721" width="354" height="57" rx="5" stroke="${thLiveGreen}"/><rect x="402" y="721" width="366" height="57" rx="5" stroke="${thpLiveBlue}"/></g>
      <path d="M185 677V721 M588 677V721" fill="none" stroke="#fff" stroke-width="2.5"/>
      <g text-anchor="middle" class="label"><text x="209" y="756">${l.th}</text><text x="585" y="756">${l.thp}</text></g>
    </g>
    <g transform="translate(855 105)">
      <rect width="515" height="800" rx="5" fill="#fff" stroke="#c4d1c9"/>
      <text x="25" y="51" class="section">${l.readings}</text>
      <path d="M25 71H490" stroke="#c9d5cd"/>
      <text x="25" y="108" class="mono" font-size="18" style="fill:#50616c">${l.soil} · RS485 / Modbus RTU</text>
      <circle cx="33" cy="141" r="7" fill="${thLiveGreen}"/><circle cx="33" cy="183" r="7" fill="${thpLiveBlue}"/>
      <text x="52" y="149" class="label">TH</text><text x="52" y="191" class="label">THP</text>
      <text x="119" y="149" font-size="21">${l.th}</text><text x="119" y="191" font-size="21">${l.thp}</text>
      <path d="M25 215H490" stroke="#dce5df"/>
      <text x="25" y="250" class="mono" font-size="18" style="fill:#50616c">${l.enclosure} · I²C / ESP32-S3</text>
      <text x="25" y="287" class="label">SHT31-D</text><text x="129" y="287" font-size="20">${l.airReading}</text>
      <path d="M0 321H515" stroke="#c9d5cd"/>
      <text x="25" y="371" class="section">${l.steps}</text>
      ${l.mounting.map((name, i) => `
        <g transform="translate(${25 + (i % 2) * 240} ${393 + Math.floor(i / 2) * 165})">
          <svg width="224" height="124" viewBox="${i * 120} 0 116 87" preserveAspectRatio="xMidYMin slice" overflow="hidden">
            <use href="#installation-strip"/>
          </svg>
          <text x="0" y="149" class="label">${name}</text>
        </g>`).join('')}
      <text x="25" y="754" font-size="19">${l.note}</text>
      <text x="25" y="782" font-size="18" style="fill:#54646b">${l.compare}</text>
    </g>
  </svg>`
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } })
}
