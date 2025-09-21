/* empty css                                  */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CZ9E4fRZ.mjs';
import 'kleur/colors';
import { t as themeConfig } from '../chunks/index_BlF_e7rj.mjs';
import { $ as $$LayoutPost, a as $$Pagination } from '../chunks/LayoutPost_CvG0aew7.mjs';
import { $ as $$LayoutDefault } from '../chunks/LayoutDefault_Dkmw84pU.mjs';
import { g as getPosts, c as getPostDescription } from '../chunks/index_Bd49nKCk.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://gordan.grgic.com");
const getStaticPaths = (async ({ paginate }) => {
  const posts = await getPosts();
  posts.sort((a, b) => {
    if (a.data.pin && !b.data.pin) return -1;
    if (!a.data.pin && b.data.pin) return 1;
    return 0;
  });
  return paginate(posts, { pageSize: themeConfig.site.pageSize });
});
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { translate: t } = Astro2.locals;
  const { page } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "LayoutDefault", $$LayoutDefault, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section contain-layout flex="~ col gap-7.5"> ${page.data.map((post) => renderTemplate`${renderComponent($$result2, "LayoutPost", $$LayoutPost, { "post": post }, { "default": async ($$result3) => renderTemplate` <p class="line-clamp-4">${getPostDescription(post)}</p> ` })}`)} </section> ${renderComponent($$result2, "Pagination", $$Pagination, { "showLeft": Boolean(page.url.prev), "leftTitle": t("prev"), "leftUrl": page.url.prev, "showRight": Boolean(page.url.next), "rightTitle": t("next"), "rightUrl": page.url.next, "currentPage": page.currentPage, "totalPage": page.lastPage })} ` })}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/[...page].astro", void 0);

const $$file = "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/[...page].astro";
const $$url = "/[...page]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
