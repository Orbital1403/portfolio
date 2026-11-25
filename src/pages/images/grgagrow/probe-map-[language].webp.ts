import type { APIRoute, GetStaticPaths } from 'astro'
import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import symbols from '~/assets/grgagrow-icons.svg?raw'
import { growProbes } from '~/data/grgagrow-probes'

export const getStaticPaths: GetStaticPaths = () =>
  ['en', 'hr'].map(language => ({ params: { language } }))

export const GET: APIRoute = async ({ params }) => {
  const markers = growProbes.map(({ x, y, ink, icon }) => `
    <g transform="translate(${x} ${y})">
      <circle r="37" fill="#faf9f0" stroke="${ink}" stroke-width="4"/>
      <use xlink:href="#${icon}" x="-28" y="-28" width="56" height="56"
        fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`)
  const layer = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1600" height="1200">
    <defs>${symbols}</defs>${markers.join('')}
  </svg>`
  const photo = await sharp(`public/images/projects/smart-lawn/build/lawn-probe-map-${params.language}.webp`)
    .composite([{ input: Buffer.from(layer) }])
    .webp({ quality: 92 })
    .toBuffer()
  return new Response(new Uint8Array(photo), { headers: { 'Content-Type': 'image/webp' } })
}
