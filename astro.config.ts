import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import devtoolsJson from 'vite-plugin-devtools-json'
import bilingualPortfolio from './scripts/localize.mjs'
import { themeConfig } from './src/.config'

const notFoundPath = /\/404(?:\.html|\/)?$/
const formerGardenPath = /\/projects\/smart-lawn\/?$/
const formerLaundryPath = /\/projects\/praonica\/?$/

// https://astro.build/config
export default defineConfig({
  site: themeConfig.site.website,
  compressHTML: true,
  prefetch: true,
  base: '/',
  vite: {
    plugins: [
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      devtoolsJson(),
    ],
  },
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
  },
  integrations: [
    UnoCSS({ injectReset: true }),
    mdx({}),
    robotsTxt({ sitemap: new URL('sitemap-index.xml', themeConfig.site.website).href }),
    sitemap({ filter: page => !notFoundPath.test(page) && !formerGardenPath.test(page) && !formerLaundryPath.test(page) }),
    bilingualPortfolio(),
  ],
})
