import { c as createAstro, a as createComponent, m as maybeRenderHead, b as renderTemplate, d as addAttribute, r as renderComponent, g as renderSlot } from './astro/server_CZ9E4fRZ.mjs';
import 'kleur/colors';
import 'clsx';
import { b as getPathFromCategory, d as formatYear } from './index_Bd49nKCk.mjs';
import { t as themeConfig } from './index_BlF_e7rj.mjs';

const $$Astro$3 = createAstro("https://gordan.grgic.com");
const $$Pagination = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Pagination;
  const { translate: t } = Astro2.locals;
  const {
    showLeft = true,
    showRight = true,
    leftTitle,
    rightTitle,
    leftUrl,
    rightUrl,
    showPageCount = true,
    currentPage,
    totalPage
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<footer class="mt-5"> ${showPageCount && renderTemplate`<div class="mb-2.5"> ${t("page_number", currentPage)} / ${t("page_count", totalPage)} </div>`} <div class="flex items-center gap-2"> ${showLeft && renderTemplate`<a${addAttribute(leftTitle, "title")}${addAttribute(leftUrl, "href")}> <span class="inline-block vertical-mid i-mdi-chevron-double-left w-4 h-4"></span> ${leftTitle} </a>`} ${showRight && renderTemplate`<a${addAttribute(rightTitle, "title")}${addAttribute(rightUrl, "href")}> ${rightTitle} <span class="inline-block vertical-mid i-mdi-chevron-double-right w-4 h-4"></span> </a>`} </div> </footer>`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/Pagination.astro", void 0);

const $$Astro$2 = createAstro("https://gordan.grgic.com");
const $$PostCategory = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PostCategory;
  const { category } = Astro2.props;
  function getCategoryUrl(category2) {
    return `/categories/${getPathFromCategory(category2, themeConfig.site.categoryMap)}`;
  }
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(getCategoryUrl(category), "href")}>
# ${category} </a>`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/PostCategory.astro", void 0);

const $$Astro$1 = createAstro("https://gordan.grgic.com");
const $$PostMeta = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PostMeta;
  const { post } = Astro2.props;
  const { translate: t } = Astro2.locals;
  const categoryList = post.data.categories ?? [];
  return renderTemplate`${maybeRenderHead()}<header flex="~ col gap-2"> <h1 class="post-title"> <a class="not-prose"${addAttribute(`/posts/${post.id}/`, "href")}>${post.data.title}</a> </h1> <div class="text-3.5"> <span>${t(post.data.modDate ? "updated_at" : "posted_at")}</span> <time>${formatYear(post.data.modDate ?? post.data.pubDate)}</time> ${categoryList.map((category) => renderTemplate`${renderComponent($$result, "PostCategory", $$PostCategory, { "category": category })}`)} </div> </header>`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/components/PostMeta.astro", void 0);

const $$Astro = createAstro("https://gordan.grgic.com");
const $$LayoutPost = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LayoutPost;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="prose"> ${renderComponent($$result, "PostMeta", $$PostMeta, { "post": post })} ${renderSlot($$result, $$slots["default"])} </article>`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/layouts/LayoutPost.astro", void 0);

export { $$LayoutPost as $, $$Pagination as a };
