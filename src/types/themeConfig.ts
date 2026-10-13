import type { SEOProps } from 'astro-seo'
import type { LANGUAGES } from '../i18n.ts'

type SEOExtensions = NonNullable<SEOProps['extend']>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

export interface ThemeConfig {
  site: ConfigSite
  appearance: ConfigAppearance
  seo: ConfigSEO
}

export type UserConfig = DeepPartial<ThemeConfig>

export interface ConfigSite {
  title: string
  subtitle: string
  author: string
  description: string
  website: string
  pageSize: number
  socialLinks: { name: string, href: string }[]
  navLinks: { name: string, href: string }[]
  categoryMap: { name: string, path: string }[]
  footer: string[]
}

export interface ConfigAppearance {
  theme: 'light' | 'dark' | 'system'
  locale: keyof typeof LANGUAGES
  colorsDark: Colors
  colorsLight: Colors
  fonts: Fonts
}

export interface ConfigSEO {
  meta: NonNullable<SEOExtensions['meta']>
  link: NonNullable<SEOExtensions['link']>
}

interface Colors {
  primary: string
  background: string
}

interface Fonts {
  header: string
  ui: string
  // Reserved for future article and code font overrides.
  _article?: string
  _code?: string
}
