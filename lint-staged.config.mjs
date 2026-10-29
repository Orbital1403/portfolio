// Keep generated publications and binary assets out of pre-commit formatting.
export default {
  '{src,scripts,tests}/**/*.{astro,ts,js,mjs,css,md,mdx}': 'eslint --fix',
  'public/!(demos)/**/*.js': 'eslint --fix',
  '{package.json,package-lock.json,README.md,astro.config.ts,uno.config.js,eslint.config.mjs,lint-staged.config.mjs,tsconfig.json}': 'eslint --fix',
}
