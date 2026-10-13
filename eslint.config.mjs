import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['docs/**', 'cloudflare-dist/**'],
  formatters: true,
  unocss: true,
  astro: true,
  test: false, // Tests use Node's built-in runner.
}, {
  files: ['**/*.astro', '**/*.astro/**'],
  rules: {
    // The Astro formatter controls embedded script layout.
    'style/brace-style': 'off',
    'style/operator-linebreak': 'off',
  },
})
