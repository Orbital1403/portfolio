# Gordan Grgić - personal portfolio

A personal portfolio retaining the Typography theme's technical-paper background and distinctive display font. It presents practical technical experience, MILA\* (an audio streamer in development), other hands-on projects and this website as a web project.

## Development

Use Node.js 22.23.3 (see `.node-version`) or a newer compatible version and npm. Run `npm ci`, then `npm run dev`.
`npm run lint` checks source files, including gallery code in `public/`.
`npm run typecheck` synchronises Astro types and checks TypeScript.
Installation registers the pre-commit hook; it only formats supported source files.

Page transitions use Astro’s built-in client router.

## GitHub Pages

Run `npm run build:pages` to generate `docs/` for the `/portfolio/` path.
Commit the regenerated publication with source changes. GitHub Pages serves
`main /docs` at https://orbital1403.github.io/portfolio/.
Generated files are excluded from lint and pre-commit formatting.

## Cloudflare Pages

The existing Cloudflare Pages project `portfolio` serves https://gordangrgic.com/
and its www variant. Keep its build command `node scripts/prepare-cloudflare.mjs`
and output directory `cloudflare-dist`. This command now builds directly from
source at `/`, independently of `docs/`. Both publication commands check
TypeScript and Astro before building, and version the gallery script by content.

Both versions use canonical and share URLs on https://gordangrgic.com/;
sitemaps and robots.txt also advertise the primary domain.

## Photographs and share images

After adding photographs under `public/images/hobbies/`, run `npm run optimize:images`. It removes camera metadata (including GPS location), limits photographs to 1600 px and writes the 800 px `-800` copies used by cards and photo grids.

Link previews use the 1200×630 images in `public/og/`: `default.jpg` for most pages and one per hobby page.

`public/_redirects` sends the former blog, category and archive addresses to Skills or Contact on Cloudflare Pages.

## Contact form

The form keeps the recipient address outside the public website. Set PUBLIC_CONTACT_FORM_ENDPOINT to the form-ID endpoint from a verified Formspree account before building. The approved Formspree form-ID endpoint is configured in the contact page; the environment variable can override it. No API key or email password belongs in this repository.

## Theme credit

Based on https://github.com/moeyua/astro-theme-typography. Original licence retained.

## My Garden application

`public/demos/my-garden/` contains the v0.4 grgaGrow static application built from the separate Vrt project using `npm run build:hosted`. Its relative asset URLs support both Cloudflare at `/demos/my-garden/` and the GitHub Pages prefix. Copy only the build output when updating; never copy local environment files, sessions or server/device secrets. The browser bundle intentionally contains the Supabase project URL and publishable key; authenticated data access remains subject to RLS.

Demo mode is simulated. Live mode supports email/password login, assigned sensor records and Open-Meteo weather with city search and opt-in browser geolocation. History includes up to 30 days, metric/sensor filters, statistics and a quality-labelled measurement log. Alerts include an owner-scoped cloud event log and opt-in device push, backed by a five-minute Supabase worker. The service worker is push-only and caches no private data. Physical sensors/ingestion, actual phone push display and automatic irrigation still need verification. City preferences currently stay in the user's browser.
