import type { UserConfig } from '~/types'

export const userConfig: Partial<UserConfig> = {
  // 🔹 1) Osnovno — naslov i meta
  site: {
    title: 'Gordan Grgić',
    subtitle: 'Java Developer & Webmaster',
    author: 'Gordan Grgic',
    description: 'Portfolio and blog of Gordan Grgić, Java Developer & Webmaster.',
    website: 'https://gordan.grgic.com',

    // 🔹 2) Navigacija (možeš dodati/skinuti stavke po želji)
    navLinks: [
      { name: 'ABOUT', href: '/about' },
      { name: 'SKILLS', href: '/skills' },
      { name: 'PROJECT', href: '/project' },
      { name: 'Hobbies', href: '/hobbies' },
      { name: 'CONTACT', href: 'mailto:gordan.grgic@gmail.com' },
    ],

    // 🔹 3) Social (samo one koje želiš prikazati)
    socialLinks: [
      { name: 'github', href: 'https://github.com/Orbital1403' },
      { name: 'linkedin', href: 'https://www.linkedin.com/in/gordan-grgic-0ba40a354/' },
      { name: 'twitter', href: 'https://x.com/orbital1403' },
    ],

    // 🔹 4) Kategorije (uređeni URL-ovi)
    categoryMap: [
      { name: 'Core Java', path: 'core-java' },
      { name: 'Advanced Java', path: 'advanced-java' },
      { name: 'HTML', path: 'html' },
      { name: 'CSS', path: 'css' },
      { name: 'JavaScript', path: 'javascript' },
      { name: 'MySQL', path: 'mysql' },
      { name: 'Java Desktop Application Development', path: 'java-desktop-application-development' },
    ],
  },
  // 🔹 5) Jezik i tema (ostalo uzmi iz defaulta)
  appearance: {
    locale: 'en-us',
    theme: 'system',
    /* fonts: {
      header: '"MyFont","Source Sans Pro","Inter","Roboto","Helvetica Neue",sans-serif',
      ui: '"MyFont","Source Sans Pro","Inter","Roboto","Helvetica Neue",sans-serif', */
  },
}

// (po potrebi, kasnije)
// seo: { twitter: '@tvoj_handle' },
