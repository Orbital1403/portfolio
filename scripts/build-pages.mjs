import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,readdirSync,statSync,cpSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const result=spawnSync(process.execPath,['node_modules/astro/astro.js','build'],{stdio:'inherit'});
if(result.status!==0)process.exit(result.status??1);
const base='/portfolio/';
function walk(dir){for(const name of readdirSync(dir)){const file=join(dir,name);if(statSync(file).isDirectory()){walk(file);continue;}if(!/\.(html|css|js|json|xml|txt)$/.test(name))continue;let text=readFileSync(file,'utf8');
if(name.endsWith('.html'))text=text.replace(/(\b(?:href|src|action)=["'])\/(?!\/|portfolio\/)/g,(_,start)=>start+base);
if(name.endsWith('.css'))text=text.replace(/(url\(["']?)\/(?!\/|portfolio\/)/g,(_,start)=>start+base);
if(name.endsWith('.js'))text=text.replace(/(["'`])\/(?!\/|portfolio\/)(?=(?:icons\.svg|scripts\/|images\/|fonts\/))/g,(_,quote)=>quote+base);
text=text.replace(/https:\/\/orbital1403\.github\.io\/(?!portfolio(?:\/|$))/g,'https://orbital1403.github.io/portfolio/');
writeFileSync(file,text);}}
walk('dist');
const gallery=readFileSync('dist/scripts/gallery.js');
const galleryName='gallery.'+createHash('sha256').update(gallery).digest('hex').slice(0,12)+'.js';
writeFileSync(join('dist/scripts',galleryName),gallery);
function versionGallery(dir){for(const name of readdirSync(dir)){const file=join(dir,name);if(statSync(file).isDirectory()){versionGallery(file);continue;}if(!name.endsWith('.html'))continue;writeFileSync(file,readFileSync(file,'utf8').replace(/\/portfolio\/scripts\/gallery\.js(?:\?[^"']*)?/g,base+'scripts/'+galleryName));}}
versionGallery('dist');
rmSync('docs',{recursive:true,force:true});cpSync('dist','docs',{recursive:true});writeFileSync('docs/.nojekyll','');
console.log('GitHub Pages output prepared in docs/ for '+base);
