import type { UserConfig } from '~/types'

export const userConfig: Partial<UserConfig> = {
  // Identity and primary domain.
  site: {
    title: 'Gordan Grgić',
    subtitle: 'Problem Solver',
    author: 'Gordan Grgić',
    description:
      'Portfolio of Gordan Grgić: practical technical experience, computers and electronics, and MILA*, a personal audio streamer in development. Based in Brussels.',
    website: 'https://gordangrgic.com/',

    // Main navigation.
    navLinks: [
      { name: 'HOME', href: '/' },
      { name: 'ABOUT', href: '/about/' },
      { name: 'PROJECTS', href: '/projects/' },
      { name: 'SKILLS', href: '/skills/' },
      { name: 'HOBBIES', href: '/hobbies/' },
      { name: 'CONTACT', href: '/contact/' },
    ],

    // Public profiles.
    socialLinks: [
      { name: 'github', href: 'https://github.com/Orbital1403' },
      {
        name: 'linkedin',
        href: 'https://www.linkedin.com/in/gordan-grgic-0ba40a354/',
      },
    ],
  },
  // Language and appearance.
  appearance: {
    locale: 'en-us',
    theme: 'system',
    colorsDark: { primary: '#e7ecf3', background: '#24313b' },

  },
}
