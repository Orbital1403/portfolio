import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_HEADER, t as decodeKey } from './chunks/astro/server_CZ9E4fRZ.mjs';
import 'clsx';
import 'cookie';
import './chunks/shared_9gEenf6c.mjs';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/","cacheDir":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/.astro/","outDir":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/","srcDir":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/src/","publicDir":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/public/","buildClientDir":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/client/","buildServerDir":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/server/","adapterName":"","routes":[{"file":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/archive/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/archive","isIndex":false,"type":"page","pattern":"^\\/archive\\/?$","segments":[[{"content":"archive","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/archive.astro","pathname":"/archive","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/atom.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/atom.xml","isIndex":false,"type":"endpoint","pattern":"^\\/atom\\.xml\\/?$","segments":[[{"content":"atom.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/atom.xml.ts","pathname":"/atom.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/categories/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/categories","isIndex":true,"type":"page","pattern":"^\\/categories\\/?$","segments":[[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/categories/index.astro","pathname":"/categories","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/project/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/project","isIndex":false,"type":"page","pattern":"^\\/project\\/?$","segments":[[{"content":"project","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/project.astro","pathname":"/project","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/skills/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/skills","isIndex":false,"type":"page","pattern":"^\\/skills\\/?$","segments":[[{"content":"skills","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/skills.astro","pathname":"/skills","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://gordan.grgic.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/[...page].astro",{"propagation":"in-tree","containsHead":true}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/about.astro",{"propagation":"in-tree","containsHead":true}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/archive.astro",{"propagation":"in-tree","containsHead":true}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/categories/[...category].astro",{"propagation":"in-tree","containsHead":true}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/categories/index.astro",{"propagation":"in-tree","containsHead":true}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/contact.astro",{"propagation":"in-tree","containsHead":true}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/posts/[...id].astro",{"propagation":"in-tree","containsHead":true}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/project.astro",{"propagation":"in-tree","containsHead":true}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/skills.astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/about@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/contact@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/posts/[...id]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/project@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/skills@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/utils/index.ts",{"propagation":"in-tree","containsHead":false}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/PostCategory.astro",{"propagation":"in-tree","containsHead":false}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/PostMeta.astro",{"propagation":"in-tree","containsHead":false}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/layouts/LayoutPost.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/archive@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/atom.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/atom.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/categories/[...category]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/categories/index@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/archive@_@astro":"pages/archive.astro.mjs","\u0000@astro-page:src/pages/atom.xml@_@ts":"pages/atom.xml.astro.mjs","\u0000@astro-page:src/pages/categories/index@_@astro":"pages/categories.astro.mjs","\u0000@astro-page:src/pages/categories/[...category]@_@astro":"pages/categories/_---category_.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/posts/[...id]@_@astro":"pages/posts/_---id_.astro.mjs","\u0000@astro-page:src/pages/project@_@astro":"pages/project.astro.mjs","\u0000@astro-page:src/pages/skills@_@astro":"pages/skills.astro.mjs","\u0000@astro-page:src/pages/[...page]@_@astro":"pages/_---page_.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_DQ-tGiG0.mjs","/Users/orbital/Desktop/html/my-web/gordan-portfolio/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/Users/orbital/Desktop/html/my-web/gordan-portfolio/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_B6za3_xo.mjs","/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_C6EuHGZU.mjs","/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/layouts/LayoutDefault.astro?astro&type=script&index=0&lang.ts":"_astro/LayoutDefault.astro_astro_type_script_index_0_lang.CM0qLWI7.js","/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/@swup/astro/dist/client/SwupPreloadPlugin.js":"_astro/SwupPreloadPlugin.BFr0xV-N.js","/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/@swup/astro/dist/client/SwupBodyClassPlugin.js":"_astro/SwupBodyClassPlugin.DU0ijZyF.js","/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/@swup/astro/dist/client/SwupHeadPlugin.js":"_astro/SwupHeadPlugin.DvOZNxAa.js","/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/@swup/astro/dist/client/SwupScriptsPlugin.js":"_astro/SwupScriptsPlugin.DeeT9ppa.js","/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/@swup/astro/dist/client/SwupA11yPlugin.js":"_astro/SwupA11yPlugin.BIyElFLX.js","/Users/orbital/Desktop/html/my-web/gordan-portfolio/node_modules/@swup/astro/dist/client/SwupScrollPlugin.js":"_astro/SwupScrollPlugin.DTcbGiCQ.js","/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/posts/[...id].astro?astro&type=script&index=0&lang.ts":"_astro/_...id_.astro_astro_type_script_index_0_lang.CpKCxvke.js","astro:scripts/page.js":"_astro/page.DW5GzRsZ.js","/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/comments/Giscus.astro?astro&type=script&index=0&lang.ts":"_astro/Giscus.astro_astro_type_script_index_0_lang.CBnQuka3.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/layouts/LayoutDefault.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"animationend\",e,!1);function e(){document.documentElement.classList.remove(\"animation-prepared\"),document.removeEventListener(\"animationend\",e,!1)}"],["/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/posts/[...id].astro?astro&type=script&index=0&lang.ts","function u(e){const t=document.createElement(\"pre\");return t.style.width=\"1px\",t.style.height=\"1px\",t.style.position=\"fixed\",t.style.top=\"5px\",t.textContent=e,t}function a(e){if(\"clipboard\"in navigator)return navigator.clipboard.writeText(e.textContent||\"\");const t=getSelection();if(t==null)return Promise.reject(new Error);t.removeAllRanges();const n=document.createRange();return n.selectNodeContents(e),t.addRange(n),document.execCommand(\"copy\"),t.removeAllRanges(),Promise.resolve()}function i(e){if(\"clipboard\"in navigator)return navigator.clipboard.writeText(e);const t=document.body;if(!t)return Promise.reject(new Error);const n=u(e);return t.appendChild(n),a(n),t.removeChild(n),Promise.resolve()}async function d(e){const t=e.getAttribute(\"for\"),n=e.getAttribute(\"value\");function o(){e.dispatchEvent(new CustomEvent(\"clipboard-copy\",{bubbles:!0}))}if(e.getAttribute(\"aria-disabled\")!==\"true\"){if(n)await i(n),o();else if(t){const r=\"getRootNode\"in Element.prototype?e.getRootNode():e.ownerDocument;if(!(r instanceof Document||\"ShadowRoot\"in window&&r instanceof ShadowRoot))return;const c=r.getElementById(t);c&&(await p(c),o())}}}function p(e){return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement?i(e.value):e instanceof HTMLAnchorElement&&e.hasAttribute(\"href\")?i(e.href):a(e)}function f(e){const t=e.currentTarget;t instanceof HTMLElement&&d(t)}function l(e){if(e.key===\" \"||e.key===\"Enter\"){const t=e.currentTarget;t instanceof HTMLElement&&(e.preventDefault(),d(t))}}function m(e){e.currentTarget.addEventListener(\"keydown\",l)}function y(e){e.currentTarget.removeEventListener(\"keydown\",l)}class h extends HTMLElement{static define(t=\"clipboard-copy\",n=customElements){return n.define(t,this),this}constructor(){super(),this.addEventListener(\"click\",f),this.addEventListener(\"focus\",m),this.addEventListener(\"blur\",y)}connectedCallback(){this.hasAttribute(\"tabindex\")||this.setAttribute(\"tabindex\",\"0\"),this.hasAttribute(\"role\")||this.setAttribute(\"role\",\"button\")}get value(){return this.getAttribute(\"value\")||\"\"}set value(t){this.setAttribute(\"value\",t)}}const s=typeof globalThis<\"u\"?globalThis:window;try{s.ClipboardCopyElement=h.define()}catch(e){if(!(s.DOMException&&e instanceof DOMException&&e.name===\"NotSupportedError\")&&!(e instanceof ReferenceError))throw e}document.addEventListener(\"clipboard-copy\",e=>{const n=e.target.querySelector(\".icon\");n.classList.replace(\"i-mdi-content-copy\",\"i-mdi-check\"),setTimeout(()=>{n.classList.replace(\"i-mdi-check\",\"i-mdi-content-copy\")},1500)});const b=Array.from(document.querySelectorAll(\"pre\")),g=\"<div class='i-mdi-content-copy icon text-white'></div>\";for(const e of b){const t=document.createElement(\"div\");t.className=\"code-container\";const n=document.createElement(\"clipboard-copy\"),o=e.querySelector(\"code\");n.value=o?.textContent??\"\",n.className=\"clipboard-copy\",n.innerHTML=g,e.appendChild(n),e.parentNode?.insertBefore(t,e),t.appendChild(e)}"]],"assets":["/_astro/page.DW5GzRsZ.js","/file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/about/index.html","/file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/archive/index.html","/file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/atom.xml","/file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/categories/index.html","/file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/contact/index.html","/file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/project/index.html","/file:///Users/orbital/Desktop/html/my-web/gordan-portfolio/dist/skills/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"qnMel4FQcKjtGW42TFBOcPJ+nUNGXskHEX1Y8n9X+l4="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
