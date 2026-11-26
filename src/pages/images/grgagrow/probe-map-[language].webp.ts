import type { APIRoute, GetStaticPaths } from 'astro'
import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import symbols from '~/assets/grgagrow-icons.svg?raw'
import { growProbes, thpLiveBlue } from '~/data/grgagrow-probes'

export const getStaticPaths: GetStaticPaths = () =>
  ['en', 'hr'].map(language => ({ params: { language } }))

export const GET: APIRoute = async ({ params }) => {
  const markers = growProbes.map(({ x, y, ink, icon }) => `
    <g transform="translate(${x} ${y})">
      <circle r="37" fill="${ink}" stroke="#faf9f0" stroke-width="4"/>
      <use xlink:href="#${icon}" x="-28" y="-28" width="56" height="56"
        fill="none" stroke="${icon === 'probe-thp' ? '#122439' : '#faf9f0'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`)
  const layer = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1600" height="1200">
    <defs>${symbols}</defs>${markers.join('')}
  </svg>`
  const base = sharp(`public/images/projects/smart-lawn/build/lawn-probe-map-${params.language}.webp`)
  // The callout and its translated text are already printed on the source photograph.
  const bounds = { left: 576, top: 512, width: 382, height: 112 }
  const calloutMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="382" height="112">
    <rect x="1" y="1" width="380" height="110" rx="15" fill="white"/>
  </svg>`)
  const callout = await base.clone().extract(bounds).tint(thpLiveBlue)
    .composite([{ input: calloutMask, blend: 'dest-in' }]).png().toBuffer()
  const photo = await base
    .composite([
      { input: callout, left: bounds.left, top: bounds.top },
      { input: Buffer.from(layer) },
    ])
    .webp({ quality: 92 })
    .toBuffer()
  return new Response(new Uint8Array(photo), { headers: { 'Content-Type': 'image/webp' } })
}
