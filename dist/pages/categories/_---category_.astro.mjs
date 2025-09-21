/* empty css                                     */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_CZ9E4fRZ.mjs';
import 'kleur/colors';
import { t as themeConfig } from '../../chunks/index_BlF_e7rj.mjs';
import { $ as $$LayoutDefault } from '../../chunks/LayoutDefault_Dkmw84pU.mjs';
import { a as getCategories, b as getPathFromCategory, f as formatDate } from '../../chunks/index_Bd49nKCk.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://gordan.grgic.com");
async function getStaticPaths() {
  const categoryMap = await getCategories();
  return Array.from(categoryMap).map(([key, value]) => {
    const path = getPathFromCategory(key, themeConfig.site.categoryMap);
    return {
      params: { category: path },
      props: { posts: value, name: key }
    };
  });
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { posts, name } = Astro2.props;
  function getListItems(posts2) {
    const result = posts2.map((post) => ({
      title: post.data.title,
      href: `/posts/${post.id}/`,
      date: formatDate(post.data.pubDate)
    }));
    return result;
  }
  return renderTemplate`${renderComponent($$result, "LayoutDefault", $$LayoutDefault, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> <h2 class="post-title"># ${name}</h2> <ul class="pl-6 py-3" flex="~ col gap-4"> ${getListItems(posts).map(({ title, href, date }) => renderTemplate`<li> <h3 class="post-title"> <a${addAttribute(href, "href")}>${title}</a> </h3> <time>${date}</time> </li>`)} </ul> </section> ` })}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/categories/[...category].astro", void 0);

const $$file = "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/categories/[...category].astro";
const $$url = "/categories/[...category]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
