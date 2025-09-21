const defaultConfig = {
  site: {
    title: "Gordan Grgic",
    subtitle: "Typography",
    author: "Gordan Grgic",
    description: "Rediscory the beauty of typography",
    website: "https://astro-theme-typography.vercel.app/",
    pageSize: 5,
    socialLinks: [
      {
        name: "github",
        href: "https://github.com/Orbital1403"
      },
      {
        name: "twitter",
        href: "https://x.com/orbital1403"
      }
    ],
    navLinks: [
      {
        name: "Posts",
        href: "/"
      },
      {
        name: "Archive",
        href: "/archive"
      },
      {
        name: "Categories",
        href: "/categories"
      },
      {
        name: "About",
        href: "/about"
      }
    ],
    categoryMap: [{ name: "Gordan", path: "hu-shi" }],
    footer: [
      '© %year <a target="_blank" href="%website">%author</a>',
      'Theme <a target="_blank" href="https://github.com/Orbital1403">Typography</a> by <a target="_blank" href="https://gordangrgic.com">Grga</a>',
      'Proudly published with <a target="_blank" href="https://astro.build/">Astro</a>'
    ]
  },
  appearance: {
    theme: "system",
    locale: "en-US",
    colorsLight: {
      primary: "#2e405b",
      background: "#ffffff"
    },
    colorsDark: {
      primary: "#FFFFFF",
      background: "#232222"
    },
    fonts: {
      header: '"HiraMinProN-W6","Source Han Serif CN","Source Han Serif SC","Source Han Serif TC",serif',
      ui: '"Source Sans Pro","Roboto","Helvetica","Helvetica Neue","Source Han Sans SC","Source Han Sans TC","PingFang SC","PingFang HK","PingFang TC",sans-serif'
    }
  },
  seo: {
    twitter: "@moeyua13",
    meta: [],
    link: []
  },
  rss: {
    fullText: true
  },
  comment: {
    // disqus: { shortname: "typography-astro" },
  },
  analytics: {
    googleAnalyticsId: "",
    umamiAnalyticsId: ""
  },
  latex: {
    katex: false
  }
};

const userConfig = {
  // 🔹 1) Osnovno — naslov i meta
  site: {
    title: "Gordan Grgić",
    subtitle: "Java Developer & Webmaster",
    author: "Gordan Grgic",
    description: "Portfolio and blog of Gordan Grgić, Java Developer & Webmaster.",
    website: "https://gordan.grgic.com",
    // 🔹 2) Navigacija (možeš dodati/skinuti stavke po želji)
    navLinks: [
      { name: "ABOUT", href: "/about" },
      { name: "SKILLS", href: "/skills" },
      { name: "PROJECT", href: "/project" },
      { name: "CONTACT", href: "mailto:gordan.grgic@gmail.com" }
    ],
    // 🔹 3) Social (samo one koje želiš prikazati)
    socialLinks: [
      { name: "github", href: "https://github.com/Orbital1403" },
      { name: "linkedin", href: "https://www.linkedin.com/in/gordan-grgic-0ba40a354/" },
      { name: "twitter", href: "https://x.com/orbital1403" },
      { name: "facebook", href: "https://www.facebook.com/gordan.grgic/" }
    ],
    // 🔹 4) Kategorije (uređeni URL-ovi)
    categoryMap: [
      { name: "Core Java", path: "core-java" },
      { name: "Advanced Java", path: "advanced-java" },
      { name: "HTML", path: "html" },
      { name: "CSS", path: "css" },
      { name: "JavaScript", path: "javascript" },
      { name: "MySQL", path: "mysql" },
      { name: "Java Desktop Application Development", path: "java-desktop-application-development" }
    ]
  },
  // 🔹 5) Jezik i tema (ostalo uzmi iz defaulta)
  appearance: {
    locale: "en-us",
    theme: "system"
    /* fonts: {
      header: '"MyFont","Source Sans Pro","Inter","Roboto","Helvetica Neue",sans-serif',
      ui: '"MyFont","Source Sans Pro","Inter","Roboto","Helvetica Neue",sans-serif', */
  }
};

const themeConfig = deepMerge(defaultConfig, userConfig);
function deepMerge(target, source) {
  const output = { ...target };
  for (const [key, sourceValue] of Object.entries(source)) {
    const typedKey = key;
    const targetValue = output[typedKey];
    if (sourceValue !== void 0) {
      if (typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
        output[typedKey] = deepMerge(
          targetValue,
          sourceValue
        );
      } else {
        output[typedKey] = sourceValue;
      }
    }
  }
  return output;
}

export { themeConfig as t };
