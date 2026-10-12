import type { Link, Meta } from 'astro-seo'
import type { LANGUAGES } from '../i18n.ts'

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
  meta: Partial<Meta>[]
  link: Partial<Link>[]
}

interface Colors {
  primary: string
  background: string
}

interface Fonts {
  header: string
  ui: string
  // TODO: 未实现
  _article?: string
  _code?: string
}
