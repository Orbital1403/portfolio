import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Publish the same reviewed static build as GitHub Pages, at the custom domain root.
const output = 'cloudflare-dist';
const site = 'https://gordangrgic.com/';
rmSync(output, { recursive: true, force: true });
cpSync('docs', output, { recursive: true });

function adapt(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) {
      adapt(path);
      continue;
    }
    if (!/\.(html|css|js|json|xml|txt)$/.test(name)) continue;
    const content = readFileSync(path, 'utf8')
      .replaceAll('https://orbital1403.github.io/portfolio/', site)
      .replace(/(["'`(=])\/portfolio(?=\/|["'`?#])/g, '$1');
    writeFileSync(path, content);
  }
}

adapt(output);
console.log(`Cloudflare publication prepared for ${site} in ${output}/`);
