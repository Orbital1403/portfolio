import type { UserConfig } from '~/types'

export const userConfig: Partial<UserConfig> = {
  // 🔹 1) Osnovno — naslov i meta
  site: {
    title: 'Gordan Grgic',
    subtitle: 'Problem Solver',
    author: 'Gordan Grgic',
    description:
      'Portfolio of Gordan Grgić: practical technical experience, computers and electronics, and MILA*, a personal audio streamer in development. Based in Brussels.',
    website: 'https://orbital1403.github.io/portfolio/',

    // 🔹 2) Navigacija (možeš dodati/skinuti stavke po želji)
    navLinks: [
      { name: 'HOME', href: '/' },
      { name: 'ABOUT', href: '/about/' },
      { name: 'PROJECTS', href: '/projects/' },
      { name: 'SKILLS', href: '/skills/' },
      { name: 'HOBBIES', href: '/hobbies/' },
      { name: 'CONTACT', href: '/contact/' },
    ],

    // 🔹 3) Social (samo one koje želiš prikazati)
    socialLinks: [
      { name: 'github', href: 'https://github.com/Orbital1403' },
      {
        name: 'linkedin',
        href: 'https://www.linkedin.com/in/gordan-grgic-0ba40a354/',
      },
      { name: 'twitter', href: 'https://x.com/orbital1403' },
    ],
  },
  // 🔹 5) Jezik i tema (ostalo uzmi iz defaulta)
  seo: { twitter: '@orbital1403' },
  appearance: {
    locale: 'en-us',
    theme: 'system',
    colorsDark: { primary: '#e7ecf3', background: '#24313b' },
    /* fonts: {
      header: '"MyFont","Source Sans Pro","Inter","Roboto","Helvetica Neue",sans-serif',
      ui: '"MyFont","Source Sans Pro","Inter","Roboto","Helvetica Neue",sans-serif', */
  },
}

// (po potrebi, kasnije)
// seo: { twitter: '@tvoj_handle' },
