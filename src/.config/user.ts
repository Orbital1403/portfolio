import type { UserConfig } from '~/types'

export const userConfig: Partial<UserConfig> = {
  // 🔹 1) Osnovno — naslov i meta
  site: {
    title: 'Gordan Grgić',
    subtitle: 'Problem Solver',
    author: 'Gordan Grgić',
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
    ],
  },
  // 🔹 5) Jezik i tema (ostalo uzmi iz defaulta)
  appearance: {
    locale: 'en-us',
    theme: 'system',
    colorsDark: { primary: '#e7ecf3', background: '#24313b' },
    /* fonts: {
      header: '"MyFont","Source Sans Pro","Inter","Roboto","Helvetica Neue",sans-serif',
      ui: '"MyFont","Source Sans Pro","Inter","Roboto","Helvetica Neue",sans-serif', */
  },
}
