/* empty css                                  */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CZ9E4fRZ.mjs';
import 'kleur/colors';
import { g as getEntry, r as renderEntry } from '../chunks/_astro_content_CSmP2T4k.mjs';
import { $ as $$LayoutDefault } from '../chunks/LayoutDefault_Dkmw84pU.mjs';
import { f as formatDate } from '../chunks/index_Bd49nKCk.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://gordan.grgic.com");
const $$Project = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Project;
  const { translate: t } = Astro2.locals;
  const projectPost = await getEntry("spec", "project");
  if (!projectPost) {
    throw new Error("No project post found");
  }
  const { Content } = await renderEntry(projectPost);
  return renderTemplate`${renderComponent($$result, "LayoutDefault", $$LayoutDefault, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<header flex="~ col gap-2"> <h1 class="post-title"> <a class="not-prose">${projectPost.data.title}</a> </h1> <div class="text-3.5"> <span>${t("posted_at")}</span> <time>${formatDate(projectPost.data.pubDate)}</time> </div> </header> <article class="prose"> ${renderComponent($$result2, "Content", Content, {})} </article> ` })}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/project.astro", void 0);

const $$file = "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/project.astro";
const $$url = "/project";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Project,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
