# Dependency security status

The application and build integrations are upgraded to Astro 7.3.8 and compatible current releases. Navigation uses Astro's built-in client router instead of the old Swup integration and its legacy build dependencies.

The remaining full-install audit finding is GHSA-vfj7-8cjw-p6xm in `braces`, reached through `astro-eslint-parser → fast-glob → micromatch`. The advisory has no published patched version as of 13 October 2026. It can exhaust the stack when processing deeply nested, attacker-controlled glob patterns. Here this chain is used by the development linter, with repository-controlled configuration; it is not included in the static website or browser assets.

Do not process untrusted glob patterns through the development tools. Recheck `npm audit` when the upstream parser or glob dependency changes. Keep the full audit finding visible rather than forcing an incompatible dependency override.

Advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
