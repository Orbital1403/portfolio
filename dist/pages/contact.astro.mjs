/* empty css                                  */
import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CZ9E4fRZ.mjs';
import 'kleur/colors';
import { $ as $$LayoutDefault } from '../chunks/LayoutDefault_Dkmw84pU.mjs';
import { g as getEntry, r as renderEntry } from '../chunks/_astro_content_CSmP2T4k.mjs';
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const entry = await getEntry("spec", "contact");
  if (!entry) throw new Error("No contact content");
  const { Content } = await renderEntry(entry);
  return renderTemplate`${renderComponent($$result, "LayoutDefault", $$LayoutDefault, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="prose"> ${renderComponent($$result2, "Content", Content, {})} </article> ` })}`;
}, "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/contact.astro", void 0);

const $$file = "/Users/orbital/Desktop/html/my-web/gordan-portfolio/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
