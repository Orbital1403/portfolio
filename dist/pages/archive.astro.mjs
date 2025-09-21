/* empty css                                  */
import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_CZ9E4fRZ.mjs';
import 'kleur/colors';
import { $ as $$LayoutDefault } from '../chunks/LayoutDefault_Dkmw84pU.mjs';
import { g as getPosts, f as formatDate } from '../chunks/index_Bd49nKCk.mjs';
export { renderers } from '../renderers.mjs';

const $$Archive = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await getPosts(true);
  const yearMap = getYearMap(posts);
  function getYearMap(posts2) {
    const result = /* @__PURE__ */ new Map();
    for (const post of posts2) {
      const year = (post.data.pubDate ?? /* @__PURE__ */ new Date()).getFullYear();
      const posts3 = result.get(year) ?? [];
      posts3.push(getListItem(post));
      result.set(year, posts3);
    }
    return Array.from(result.entries());
  }
  function getListItem(post) {
    return {
      title: post.data.title,
      href: `/posts/${post.id}/`,
      date: formatDate(post.data.pubDate, "MM-DD")
    };
  }
  return renderTemplate`${renderComponent($$result, "LayoutDefault", $$LayoutDefault, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div flex="~ col gap-4"> ${yearMap.map(([year, posts2]) => renderTemplate`<section> <h2 class="post-title">${year}</h2> <ul class="pl-6" flex="~ col gap-4"> ${posts2.map(({ title, href, date }) => renderTemplate`<li> <h3 class="post-title"> <a${addAttribute(href, "href")}>${title}</a> </h3> <time>${date}</time> </li>`)} </ul> </section>`)} </div> ` })}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/archive.astro", void 0);

const $$file = "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/archive.astro";
const $$url = "/archive";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Archive,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
