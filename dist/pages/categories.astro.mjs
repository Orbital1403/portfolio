/* empty css                                  */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_CZ9E4fRZ.mjs';
import 'kleur/colors';
import { t as themeConfig } from '../chunks/index_BlF_e7rj.mjs';
import { $ as $$LayoutDefault } from '../chunks/LayoutDefault_Dkmw84pU.mjs';
import { a as getCategories, b as getPathFromCategory } from '../chunks/index_Bd49nKCk.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://gordan.grgic.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { translate: t } = Astro2.locals;
  const categoryMap = await getCategories();
  const list = getListFromMap(categoryMap);
  function getListFromMap(map) {
    return Array.from(map).map(([key, value]) => ({
      title: key,
      href: `/categories/${getPathFromCategory(key, themeConfig.site.categoryMap)}`,
      size: t("categories_count", value.length)
    }));
  }
  return renderTemplate`${renderComponent($$result, "LayoutDefault", $$LayoutDefault, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> <h2 class="post-title">${t("Categories")}</h2> <ul class="pl-6" flex="~ col gap-4"> ${list.map(({ title, href, size }) => renderTemplate`<li> <h3 class="post-title"> <a${addAttribute(href, "href")}># ${title}</a> </h3> <p>${size}</p> </li>`)} </ul> </section> ` })}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/categories/index.astro", void 0);

const $$file = "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/categories/index.astro";
const $$url = "/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
