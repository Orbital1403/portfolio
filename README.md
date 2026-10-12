# Gordan Grgić - personal portfolio

A personal portfolio retaining the Typography theme's technical-paper background and distinctive display font. It presents practical technical experience, MILA* (an audio streamer in development), other hands-on projects and this website as a web project.

## Development

Install dependencies with npm ci, then run npm run dev.

## GitHub Pages

Run npm run build:pages to generate the static publication in docs/. GitHub Pages serves main /docs at https://orbital1403.github.io/portfolio/.

The publishing helper adjusts root-relative HTML, CSS and gallery asset paths for /portfolio/. The source remains usable in a local root-path preview.

## Cloudflare Pages

The existing Cloudflare Pages project `portfolio` serves https://gordangrgic.com/ and its www variant. Its build command is `node scripts/prepare-cloudflare.mjs` and output directory is `cloudflare-dist`. This publishes the reviewed static build from `docs/`, adapting asset paths, canonical URLs and sitemaps for the custom domain. Regenerate `docs/` with `npm run build:pages` and commit it when changing the website. GitHub Pages remains available at its existing address.

## Photographs and share images

After adding photographs under `public/images/hobbies/`, run `npm run optimize:images`. It removes camera metadata (including GPS location), limits photographs to 1600 px and writes the 800 px `-800` copies used by cards and photo grids.

Link previews use the 1200×630 images in `public/og/`: `default.jpg` for most pages and one per hobby page.

`public/_redirects` sends the former blog, category and archive addresses to Skills or Contact on Cloudflare Pages.

## Contact form

The form keeps the recipient address outside the public website. Set PUBLIC_CONTACT_FORM_ENDPOINT to the form-ID endpoint from a verified Formspree account before building. The approved Formspree form-ID endpoint is configured in the contact page; the environment variable can override it. No API key or email password belongs in this repository.

## Theme credit

Based on https://github.com/moeyua/astro-theme-typography. Original licence retained.
