import {readFile, readdir, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const docs=path.join(root,'docs');
async function walk(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const pages=(await walk(docs)).filter(p=>p.endsWith('.html'));
for(const file of pages){
  const html=await readFile(file,'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`Duplicate IDs in ${file}`);
  const checks=[...html.matchAll(/data-check="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(checks).size,checks.length,`Shared checklist IDs in ${file}`);
  for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    if (/^(https?:|data:|mailto:)/.test(ref)) continue;
    if(ref.startsWith('#')){assert(ids.includes(ref.slice(1)),`Missing anchor ${ref} in ${file}`);continue;}
    const pathname=ref.split('#')[0];
    const target=pathname.startsWith('/recipe-box/')?path.join(docs,pathname.slice('/recipe-box/'.length)):path.resolve(path.dirname(file),pathname);
    assert((await stat(target)).isFile() || (await stat(path.join(target,'index.html'))).isFile(),`Broken link ${ref} in ${file}`);
  }
}
console.log(`Checked ${pages.length} pages: local links, images, anchors, and independent checklist IDs are valid.`);
