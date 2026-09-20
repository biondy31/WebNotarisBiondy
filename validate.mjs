import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import vm from 'node:vm';
const root=resolve('.'),errors=[];
async function walk(path){const result=[];for(const name of await readdir(path)){const p=resolve(path,name);if((await stat(p)).isDirectory())result.push(...await walk(p));else result.push(p);}return result;}
const files=[...['index.html','tentang.html','layanan.html','artikel.html','kontak.html','robots.txt','sitemap.xml'].map(p=>resolve(root,p)),...await walk(resolve(root,'assets')),...await walk(resolve(root,'panduan')),...await walk(resolve(root,'wawasan'))],pages=files.filter(p=>p.endsWith('.html'));
for(const file of pages){
 const html=await readFile(file,'utf8');
 if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(file+': jumlah h1');
 for(const required of ['<title>','name="description"','rel="canonical"','lang="id"'])if(!html.includes(required))errors.push(file+': metadata '+required);
 for(const match of html.matchAll(/type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(match[1]);}catch{errors.push(file+': JSON-LD tidak valid');}}
 for(const [,value] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(/^(https?:|tel:|data:|mailto:)/.test(value))continue;
  const [path,fragment]=value.split('#');
  let target=path?(path.startsWith('/')?resolve(root,'.'+path):resolve(file,'..',path)):file;
  if(!extname(target))target=resolve(target,'index.html');
  try{const data=await readFile(target,'utf8');if(fragment&&!data.includes('id="'+fragment+'"'))errors.push(file+': jangkar '+value);}catch{errors.push(file+': sasaran tidak ada '+value);}
 }
}
for(const file of files.filter(p=>p.endsWith('.js'))){try{new vm.Script(await readFile(file,'utf8'));}catch(error){errors.push(file+': '+error.message);}}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(JSON.stringify({halaman:pages.length,berkas:files.length,tautanLokal:'valid',metadata:'valid',javascript:'valid'},null,2));
