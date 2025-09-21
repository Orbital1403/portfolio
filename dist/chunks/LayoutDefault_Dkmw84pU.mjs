import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, b as renderTemplate, c as createAstro, d as addAttribute, s as spreadAttributes, r as renderComponent, e as defineScriptVars, g as renderSlot, h as renderHead, f as renderScript } from './astro/server_CZ9E4fRZ.mjs';
import 'kleur/colors';
import { t as themeConfig } from './index_BlF_e7rj.mjs';
import 'clsx';
/* empty css                          */
import { g as getImage } from './_astro_assets_BDYn1TAA.mjs';

const $$SiteFooter = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const { website, author, footer } = themeConfig.site;
  function parseFooter(str) {
    str = str.replace(/%author/g, author);
    str = str.replace(/%website/g, website);
    str = str.replace(/%year/g, year.toString());
    return str;
  }
  return renderTemplate`${footer.length && footer.map((str) => renderTemplate`${maybeRenderHead()}<p data-astro-cid-gcn2mc3v>${unescapeHTML(parseFooter(str))}</p>`)}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/SiteFooter.astro", void 0);

const $$Astro$b = createAstro("https://gordan.grgic.com");
const $$SiteNavigation = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$SiteNavigation;
  const site = themeConfig?.site ?? { navLinks: [], socialLinks: [] };
  const navLinks = site.navLinks ?? [];
  const socialLinks = site.socialLinks ?? [];
  const t = Astro2.locals?.translate ?? ((k) => k);
  const current = new URL(Astro2.url).pathname;
  return renderTemplate`${maybeRenderHead()}<nav class="text-center font-bold" flex="~ col gap-4"> <ul lg="flex-col items-start text-4" class="text-3.5" flex="~ row gap-2 justify-center"> ${navLinks.map((nav) => renderTemplate`<li> <a${addAttribute(nav.href, "href")}${addAttribute(["nav-link", { underline: current === nav.href }], "class:list")}> ${t(nav.name)} </a> </li>`)} </ul> <ul class="social" flex="~ row gap-1 justify-center"> ${socialLinks.map(({ href, name }) => renderTemplate`<li> <a${addAttribute(href, "href")} target="_blank" rel="noopener noreferrer"${addAttribute(name, "title")} data-no-swup class="nav-link not-underline-hover inline-flex items-center"> <span${addAttribute([`i-mdi-${name}`, "w-6 h-6"], "class:list")}></span> </a> </li>`)} </ul> </nav>`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/SiteNavigation.astro", void 0);

const $$SiteTitle = createComponent(($$result, $$props, $$slots) => {
  const { title, subtitle } = themeConfig.site;
  return renderTemplate`${maybeRenderHead()}<hgroup lg="write-vertical-right items-start b-l-2px b-l-primary text-left" flex="~ col gap-2.5" class="cursor-pointer text-center duration-800 ease-in-out"> <a class="not-underline-hover duration-800 ease-in-out" lg:p="x-2.5 b-12 hover:t-3.75 hover:b-8.75" hover:lg=" bg-primary color-background" href="/"> <h3 class="text-5 font-extrabold font-header">${subtitle}</h3> <h1 class="text-8 font-extrabold font-header">${title}</h1> </a> </hgroup>`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/SiteTitle.astro", void 0);

const $$Astro$a = createAstro("https://gordan.grgic.com");
const $$OpenGraphArticleTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$OpenGraphArticleTags;
  const { publishedTime, modifiedTime, expirationTime, authors, section, tags } = Astro2.props.openGraph.article;
  return renderTemplate`${publishedTime ? renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>` : null}${modifiedTime ? renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>` : null}${expirationTime ? renderTemplate`<meta property="article:expiration_time"${addAttribute(expirationTime, "content")}>` : null}${authors ? authors.map((author) => renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`) : null}${section ? renderTemplate`<meta property="article:section"${addAttribute(section, "content")}>` : null}${tags ? tags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`) : null}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/astro-seo/src/components/OpenGraphArticleTags.astro", void 0);

const $$Astro$9 = createAstro("https://gordan.grgic.com");
const $$OpenGraphBasicTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$OpenGraphBasicTags;
  const { openGraph } = Astro2.props;
  return renderTemplate`<meta property="og:title"${addAttribute(openGraph.basic.title, "content")}><meta property="og:type"${addAttribute(openGraph.basic.type, "content")}><meta property="og:image"${addAttribute(openGraph.basic.image, "content")}><meta property="og:url"${addAttribute(openGraph.basic.url || Astro2.url.href, "content")}>`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/astro-seo/src/components/OpenGraphBasicTags.astro", void 0);

const $$Astro$8 = createAstro("https://gordan.grgic.com");
const $$OpenGraphImageTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$OpenGraphImageTags;
  const { image } = Astro2.props.openGraph.basic;
  const { secureUrl, type, width, height, alt } = Astro2.props.openGraph.image;
  return renderTemplate`<meta property="og:image:url"${addAttribute(image, "content")}>${secureUrl ? renderTemplate`<meta property="og:image:secure_url"${addAttribute(secureUrl, "content")}>` : null}${type ? renderTemplate`<meta property="og:image:type"${addAttribute(type, "content")}>` : null}${width ? renderTemplate`<meta property="og:image:width"${addAttribute(width, "content")}>` : null}${height ? renderTemplate`<meta property="og:image:height"${addAttribute(height, "content")}>` : null}${alt ? renderTemplate`<meta property="og:image:alt"${addAttribute(alt, "content")}>` : null}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/astro-seo/src/components/OpenGraphImageTags.astro", void 0);

const $$Astro$7 = createAstro("https://gordan.grgic.com");
const $$OpenGraphOptionalTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$OpenGraphOptionalTags;
  const { optional } = Astro2.props.openGraph;
  return renderTemplate`${optional.audio ? renderTemplate`<meta property="og:audio"${addAttribute(optional.audio, "content")}>` : null}${optional.description ? renderTemplate`<meta property="og:description"${addAttribute(optional.description, "content")}>` : null}${optional.determiner ? renderTemplate`<meta property="og:determiner"${addAttribute(optional.determiner, "content")}>` : null}${optional.locale ? renderTemplate`<meta property="og:locale"${addAttribute(optional.locale, "content")}>` : null}${optional.localeAlternate?.map((locale) => renderTemplate`<meta property="og:locale:alternate"${addAttribute(locale, "content")}>`)}${optional.siteName ? renderTemplate`<meta property="og:site_name"${addAttribute(optional.siteName, "content")}>` : null}${optional.video ? renderTemplate`<meta property="og:video"${addAttribute(optional.video, "content")}>` : null}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/astro-seo/src/components/OpenGraphOptionalTags.astro", void 0);

const $$Astro$6 = createAstro("https://gordan.grgic.com");
const $$ExtendedTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$ExtendedTags;
  const { props } = Astro2;
  return renderTemplate`${props.extend.link?.map((attributes) => renderTemplate`<link${spreadAttributes(attributes)}>`)}${props.extend.meta?.map(({ content, httpEquiv, media, name, property }) => renderTemplate`<meta${addAttribute(name, "name")}${addAttribute(property, "property")}${addAttribute(content, "content")}${addAttribute(httpEquiv, "http-equiv")}${addAttribute(media, "media")}>`)}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/astro-seo/src/components/ExtendedTags.astro", void 0);

const $$Astro$5 = createAstro("https://gordan.grgic.com");
const $$TwitterTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$TwitterTags;
  const { card, site, title, creator, description, image, imageAlt } = Astro2.props.twitter;
  return renderTemplate`${card ? renderTemplate`<meta name="twitter:card"${addAttribute(card, "content")}>` : null}${site ? renderTemplate`<meta name="twitter:site"${addAttribute(site, "content")}>` : null}${title ? renderTemplate`<meta name="twitter:title"${addAttribute(title, "content")}>` : null}${image ? renderTemplate`<meta name="twitter:image"${addAttribute(image, "content")}>` : null}${imageAlt ? renderTemplate`<meta name="twitter:image:alt"${addAttribute(imageAlt, "content")}>` : null}${description ? renderTemplate`<meta name="twitter:description"${addAttribute(description, "content")}>` : null}${creator ? renderTemplate`<meta name="twitter:creator"${addAttribute(creator, "content")}>` : null}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/astro-seo/src/components/TwitterTags.astro", void 0);

const $$Astro$4 = createAstro("https://gordan.grgic.com");
const $$LanguageAlternatesTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$LanguageAlternatesTags;
  const { languageAlternates } = Astro2.props;
  return renderTemplate`${languageAlternates.map((alternate) => renderTemplate`<link rel="alternate"${addAttribute(alternate.hrefLang, "hreflang")}${addAttribute(alternate.href, "href")}>`)}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/astro-seo/src/components/LanguageAlternatesTags.astro", void 0);

const $$Astro$3 = createAstro("https://gordan.grgic.com");
const $$SEO = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$SEO;
  Astro2.props.surpressWarnings = true;
  function validateProps(props) {
    if (props.openGraph) {
      if (!props.openGraph.basic || (props.openGraph.basic.title ?? void 0) == void 0 || (props.openGraph.basic.type ?? void 0) == void 0 || (props.openGraph.basic.image ?? void 0) == void 0) {
        throw new Error(
          "If you pass the openGraph prop, you have to at least define the title, type, and image basic properties!"
        );
      }
    }
    if (props.title && props.openGraph?.basic.title) {
      if (props.title == props.openGraph.basic.title && !props.surpressWarnings) {
        console.warn(
          "WARNING(astro-seo): You passed the same value to `title` and `openGraph.optional.title`. This is most likely not what you want. See docs for more."
        );
      }
    }
    if (props.openGraph?.basic?.image && !props.openGraph?.image?.alt && !props.surpressWarnings) {
      console.warn(
        "WARNING(astro-seo): You defined `openGraph.basic.image`, but didn't define `openGraph.image.alt`. This is strongly discouraged.'"
      );
    }
  }
  validateProps(Astro2.props);
  let updatedTitle = "";
  if (Astro2.props.title) {
    updatedTitle = Astro2.props.title;
    if (Astro2.props.titleTemplate) {
      updatedTitle = Astro2.props.titleTemplate.replace(/%s/g, updatedTitle);
    }
  } else if (Astro2.props.titleDefault) {
    updatedTitle = Astro2.props.titleDefault;
  }
  const baseUrl = Astro2.site ?? Astro2.url;
  const defaultCanonicalUrl = new URL(Astro2.url.pathname + Astro2.url.search, baseUrl);
  return renderTemplate`${updatedTitle ? renderTemplate`<title>${unescapeHTML(updatedTitle)}</title>` : null}${Astro2.props.charset ? renderTemplate`<meta${addAttribute(Astro2.props.charset, "charset")}>` : null}<link rel="canonical"${addAttribute(Astro2.props.canonical || defaultCanonicalUrl.href, "href")}>${Astro2.props.description ? renderTemplate`<meta name="description"${addAttribute(Astro2.props.description, "content")}>` : null}<meta name="robots"${addAttribute(`${Astro2.props.noindex ? "noindex" : "index"}, ${Astro2.props.nofollow ? "nofollow" : "follow"}`, "content")}>${Astro2.props.openGraph && renderTemplate`${renderComponent($$result, "OpenGraphBasicTags", $$OpenGraphBasicTags, { ...Astro2.props })}`}${Astro2.props.openGraph?.optional && renderTemplate`${renderComponent($$result, "OpenGraphOptionalTags", $$OpenGraphOptionalTags, { ...Astro2.props })}`}${Astro2.props.openGraph?.image && renderTemplate`${renderComponent($$result, "OpenGraphImageTags", $$OpenGraphImageTags, { ...Astro2.props })}`}${Astro2.props.openGraph?.article && renderTemplate`${renderComponent($$result, "OpenGraphArticleTags", $$OpenGraphArticleTags, { ...Astro2.props })}`}${Astro2.props.twitter && renderTemplate`${renderComponent($$result, "TwitterTags", $$TwitterTags, { ...Astro2.props })}`}${Astro2.props.extend && renderTemplate`${renderComponent($$result, "ExtendedTags", $$ExtendedTags, { ...Astro2.props })}`}${Astro2.props.languageAlternates && renderTemplate`${renderComponent($$result, "LanguageAlternatesTags", $$LanguageAlternatesTags, { ...Astro2.props })}`}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/astro-seo/src/SEO.astro", void 0);

const $$Astro$2 = createAstro("https://gordan.grgic.com");
const $$SiteSeo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SiteSeo;
  const props = Astro2.props;
  const configSEO = themeConfig.seo;
  const configSite = themeConfig.site;
  const title = props.title ?? configSite.title;
  const desc = props.desc ?? configSite.description;
  const canonical = configSite.website;
  const twitter = configSEO.twitter;
  const rss = new URL("/atom.xml", Astro2.site).toString();
  const optimizedImage = await getOptimizedImageURL();
  const seoLinks = [
    { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: themeConfig.site.title,
      href: rss
    },
    ...configSEO.link
  ];
  const seoMeta = [
    { name: "viewport", content: "width=device-width" },
    { name: "generator", content: Astro2.generator },
    { name: "twitter:image:src", content: optimizedImage },
    { name: "twitter:image:alt", content: desc },
    { name: "twitter:creator", content: twitter },
    { name: "twitter:site", content: twitter },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: desc },
    ...configSEO.meta
  ];
  const openGraph = {
    basic: {
      title,
      type: "article",
      image: optimizedImage,
      url: canonical
    }
  };
  async function getOptimizedImageURL() {
    const image = props.banner && await getImage({ src: props.banner, format: "jpeg" });
    return new URL(image?.src ?? "/placeholder.png", Astro2.url).toString();
  }
  return renderTemplate`${renderComponent($$result, "SEO", $$SEO, { "charset": "utf-8", "title": title, "description": desc, "extend": { link: seoLinks, meta: seoMeta }, "openGraph": openGraph })}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/SiteSeo.astro", void 0);

const $$LaTeX = createComponent(($$result, $$props, $$slots) => {
  const { latex } = themeConfig;
  const katex = latex.katex;
  return renderTemplate`${katex && renderTemplate`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css" crossorigin="anonymous">`}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/LaTeX.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$Astro$1 = createAstro("https://gordan.grgic.com");
const $$GoogleAnalytics = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$GoogleAnalytics;
  const { id } = Astro2.props;
  const gtagUrl = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  return renderTemplate(_a$2 || (_a$2 = __template$2(["<!-- Global site tag (gtag.js) - Google Analytics --><script async", "><\/script> <script>(function(){", "\n  window.dataLayer = window.dataLayer || []\n  function gtag() {\n    // eslint-disable-next-line prefer-rest-params\n    dataLayer.push(arguments)\n  }\n  gtag('js', new Date())\n  gtag('config', id)\n})();<\/script>"])), addAttribute(gtagUrl, "src"), defineScriptVars({ id }));
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/analytics/GoogleAnalytics.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro = createAstro("https://gordan.grgic.com");
const $$UmamiAnalytics = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$UmamiAnalytics;
  const { id } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<!-- Global site tag (script.js) - Umami Analytics --><script async defer src="https://analytics.umami.is/script.js"', "><\/script>"])), addAttribute(id, "data-website-id"));
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/analytics/UmamiAnalytics.astro", void 0);

const $$Analytics = createComponent(($$result, $$props, $$slots) => {
  const PUBLIC_GOOGLE_ANALYTICS_ID = undefined                                          ;
  const googleAnalyticsId = themeConfig.analytics.googleAnalyticsId || PUBLIC_GOOGLE_ANALYTICS_ID;
  const PUBLIC_UMAMI_ANALYTICS_ID = undefined                                         ;
  const umamiAnalyticsId = themeConfig.analytics.umamiAnalyticsId || PUBLIC_UMAMI_ANALYTICS_ID;
  return renderTemplate`${googleAnalyticsId && renderTemplate`${renderComponent($$result, "GoogleAnalytics", $$GoogleAnalytics, { "id": googleAnalyticsId })}`}${umamiAnalyticsId && renderTemplate`${renderComponent($$result, "UmamiAnalytics", $$UmamiAnalytics, { "id": umamiAnalyticsId })}`}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/Analytics.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$ThemeScript = createComponent(($$result, $$props, $$slots) => {
  const configTheme = themeConfig.appearance.theme ?? "system";
  return renderTemplate(_a || (_a = __template(["<script>(function(){", "\n  // Globalna funkcija \u2013 koristi je i toggle\n  window.applyTheme = function (theme) {\n    if (theme === 'system') {\n      const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches\n      document.documentElement.classList.toggle('dark', prefers)\n    } else {\n      document.documentElement.classList.toggle('dark', theme === 'dark')\n    }\n  }\n  ;(function initTheme() {\n    try {\n      // 1) uzmi korisni\u010Dki izbor ili konfiguraciju\n      const saved = localStorage.getItem('theme') || configTheme\n      window.applyTheme(saved)\n\n      // 2) ako je 'system', prati promjene OS-a\n      const mq = window.matchMedia('(prefers-color-scheme: dark)')\n      mq.addEventListener?.('change', () => {\n        if ((localStorage.getItem('theme') || configTheme) === 'system') {\n          window.applyTheme('system')\n        }\n      })\n\n      // 3) SWUP: nakon svake zamjene sadr\u017Eaja ponovno primijeni trenutno stanje\n      document.addEventListener('swup:contentReplaced', () => {\n        const current = localStorage.getItem('theme') || configTheme\n        window.applyTheme(current)\n      })\n    } catch (_) {}\n  })()\n})();<\/script>"])), defineScriptVars({ configTheme }));
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/ThemeScript.astro", void 0);

const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<button id="theme-toggle" type="button" aria-label="Toggle theme" class="w-7 h-7 cursor-pointer inline-flex items-center justify-center" title="Toggle theme" onclick="(function(){
    const d = document.documentElement;
    const next = d.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    if (window.applyTheme) window.applyTheme(next);
  })()" data-astro-cid-x3pjskd3> <!-- Sun (vidljiv u light) --> <svg class="w-7 h-7 dark:hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-x3pjskd3> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m16.95 6.95l-1.414-1.414M6.464 6.464L5.05 5.05m13.9 0l-1.414 1.414M6.464 17.536L5.05 18.95M16 12a4 4 0 11-8 0 4 4 0 018 0z" data-astro-cid-x3pjskd3></path> </svg> <!-- Moon (vidljiv u dark) --> <svg class="w-7 h-7 hidden dark:block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-x3pjskd3> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" data-astro-cid-x3pjskd3></path> </svg> </button> `;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/ThemeToggle.astro", void 0);

const $$LayoutDefault = createComponent(($$result, $$props, $$slots) => {
  const lang = themeConfig.appearance.locale ?? "en-us";
  themeConfig.appearance.theme === "dark";
  return renderTemplate`<html${addAttribute(lang, "lang")}${addAttribute(["animation-prepared"], "class:list")} data-astro-cid-e5lvscu2> <head>${renderSlot($$result, $$slots["seo"], renderTemplate`${renderComponent($$result, "SiteSeo", $$SiteSeo, { "data-astro-cid-e5lvscu2": true })}`)}${renderComponent($$result, "LaTeX", $$LaTeX, { "data-astro-cid-e5lvscu2": true })}${renderComponent($$result, "Analytics", $$Analytics, { "data-astro-cid-e5lvscu2": true })}${renderComponent($$result, "ThemeScript", $$ThemeScript, { "data-astro-cid-e5lvscu2": true })}${renderHead()}</head> <body class="h-100vh max-w-1200px min-w-390px mx-a" p="7.5 lg:y-0 lg:x-20" lg="grid gap-x-6 cols-[3fr_1fr] rows-[1fr_9rem]" data-astro-cid-e5lvscu2> <header class="transition-swup-header flex flex-col gap-2.5 relative" m="7.5 lg:x-0 lg:t-20 lg:b-4" lg="row-1-2 col-2-3 justify-between items-start" data-astro-cid-e5lvscu2> <div class="absolute top-2 right-0 lg:top-0 lg:right-0 z-[10000]" style="isolation:isolate" data-astro-cid-e5lvscu2> ${renderComponent($$result, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-e5lvscu2": true })} </div> ${renderComponent($$result, "SiteTitle", $$SiteTitle, { "data-astro-cid-e5lvscu2": true })} ${renderComponent($$result, "SiteNavigation", $$SiteNavigation, { "data-astro-cid-e5lvscu2": true })} </header> <main class="transition-swup-main overflow-y-scroll scrollbar-hide outline-none" lg="row-1-3 col-1-2 py-20 " data-astro-cid-e5lvscu2> ${renderSlot($$result, $$slots["default"])} </main> <footer class="transition-swup-footer py-7.5" lg="row-2-3 col-2-3" data-astro-cid-e5lvscu2> ${renderComponent($$result, "SiteFooter", $$SiteFooter, { "data-astro-cid-e5lvscu2": true })} </footer> ${renderScript($$result, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/layouts/LayoutDefault.astro?astro&type=script&index=0&lang.ts")}  </body> </html>`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/layouts/LayoutDefault.astro", void 0);

export { $$LayoutDefault as $, $$SiteSeo as a };
