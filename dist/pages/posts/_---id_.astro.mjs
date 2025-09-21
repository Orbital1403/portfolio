/* empty css                                     */
import { c as createAstro, a as createComponent, b as renderTemplate, e as defineScriptVars, m as maybeRenderHead, r as renderComponent, f as renderScript } from '../../chunks/astro/server_CZ9E4fRZ.mjs';
import 'kleur/colors';
import { t as themeConfig } from '../../chunks/index_BlF_e7rj.mjs';
import 'clsx';
/* empty css                                   */
import { $ as $$LayoutPost, a as $$Pagination } from '../../chunks/LayoutPost_CvG0aew7.mjs';
import { $ as $$LayoutDefault, a as $$SiteSeo } from '../../chunks/LayoutDefault_Dkmw84pU.mjs';
import { g as getPosts } from '../../chunks/index_Bd49nKCk.mjs';
import { r as renderEntry } from '../../chunks/_astro_content_CSmP2T4k.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$3 = createAstro("https://gordan.grgic.com");
const $$Disqus = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Disqus;
  const { identifier, url, title } = Astro2.props;
  const { comment } = themeConfig;
  if (!comment || !comment.disqus) {
    throw new Error("Disqus comments are not configured");
  }
  const shortname = comment.disqus.shortname;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div id="disqus_thread"></div> <script>(function(){', "\n  window.disqus_config = function () {\n    this.page.url = url\n    this.page.identifier = identifier\n    this.page.title = title\n  }\n  ;(function () {\n    const d = document\n    const s = d.createElement('script')\n    s.src = `https://${shortname}.disqus.com/embed.js`\n    s.setAttribute('data-timestamp', new Date().toString())\n    ;(d.head || d.body).appendChild(s)\n  })()\n})();<\/script> <noscript>Please enable JavaScript to view the <a href=\"https://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>"], ["", '<div id="disqus_thread"></div> <script>(function(){', "\n  window.disqus_config = function () {\n    this.page.url = url\n    this.page.identifier = identifier\n    this.page.title = title\n  }\n  ;(function () {\n    const d = document\n    const s = d.createElement('script')\n    s.src = \\`https://\\${shortname}.disqus.com/embed.js\\`\n    s.setAttribute('data-timestamp', new Date().toString())\n    ;(d.head || d.body).appendChild(s)\n  })()\n})();<\/script> <noscript>Please enable JavaScript to view the <a href=\"https://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>"])), maybeRenderHead(), defineScriptVars({ shortname, identifier, url, title }));
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/comments/Disqus.astro", void 0);

const $$Giscus = createComponent(($$result, $$props, $$slots) => {
  const { comment } = themeConfig;
  if (!comment || !comment.giscus) {
    throw new Error("Giscus comments are not configured");
  }
  const giscus = comment.giscus;
  return renderTemplate`${renderComponent($$result, "giscus-widget", "giscus-widget", { "id": "comments", "repo": giscus.repo, "repoId": giscus.repoId, "category": giscus.category, "categoryId": giscus.categoryId, "mapping": giscus.mapping, "term": giscus.term, "strict": giscus.strict, "reactionsEnabled": giscus.reactionsEnabled, "emitMetadata": giscus.emitMetadata, "inputPosition": giscus.inputPosition, "theme": giscus.theme, "lang": giscus.lang, "loading": giscus.loading })} ${renderScript($$result, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/comments/Giscus.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/comments/Giscus.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$2 = createAstro("https://gordan.grgic.com");
const $$Twikoo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Twikoo;
  const twikooConfig = {
    ...themeConfig.comment?.twikoo,
    el: "#tcomment",
    path: Astro2.props.path
  };
  return renderTemplate(_a || (_a = __template(["", '<div id="tcomment"></div> <script src="https://cdn.staticfile.org/twikoo/1.6.32/twikoo.all.min.js"><\/script> <script>(function(){', "\n  twikoo.init(config)\n})();<\/script> "])), maybeRenderHead(), defineScriptVars({ config: twikooConfig }));
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/comments/Twikoo.astro", void 0);

const $$Astro$1 = createAstro("https://gordan.grgic.com");
const $$Comments = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Comments;
  const { id, data } = Astro2.props.post;
  const path = `/posts/${id}`;
  const url = `${Astro2.site?.href}${path}`;
  const provider = getProvider();
  function getProvider() {
    const result = Object.keys(themeConfig.comment)[0];
    return result || "";
  }
  return renderTemplate`${provider !== "" && renderTemplate`${maybeRenderHead()}<div py-16>${provider === "disqus" && renderTemplate`${renderComponent($$result, "Disqus", $$Disqus, { "identifier": id, "url": url, "title": data.title })}`}${provider === "giscus" && renderTemplate`${renderComponent($$result, "Giscus", $$Giscus, {})}`}${provider === "twikoo" && renderTemplate`${renderComponent($$result, "Twikoo", $$Twikoo, { "path": path })}`}</div>`}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/Comments.astro", void 0);

const $$Astro = createAstro("https://gordan.grgic.com");
const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post, idx) => {
    const prev = posts[idx - 1];
    const next = posts[idx + 1];
    return {
      params: { id: post.id },
      props: { entry: post, next, prev }
    };
  });
});
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { entry, prev, next } = Astro2.props;
  const { Content } = await renderEntry(entry);
  const { translate: t } = Astro2.locals;
  function getUrl(id) {
    return `/posts/${id}`;
  }
  return renderTemplate`${renderComponent($$result, "LayoutDefault", $$LayoutDefault, {}, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "LayoutPost", $$LayoutPost, { "post": entry }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Content", Content, {})} ` })} ${renderComponent($$result2, "Pagination", $$Pagination, { "showLeft": Boolean(prev), "leftTitle": `${t("prev_post")}: ${prev?.data.title}`, "leftUrl": getUrl(prev?.id), "showRight": Boolean(next), "rightTitle": `${t("next_post")}: ${next?.data.title}`, "rightUrl": getUrl(next?.id), "showPageCount": false })}  ${renderComponent($$result2, "Comments", $$Comments, { "post": entry })} `, "seo": async ($$result2) => renderTemplate`${renderComponent($$result2, "SiteSeo", $$SiteSeo, { "slot": "seo", "title": entry.data.title, "desc": entry.data.description, "banner": entry.data.banner })}` })} ${renderScript($$result, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/posts/[...id].astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/posts/[...id].astro", void 0);

const $$file = "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/posts/[...id].astro";
const $$url = "/posts/[...id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
