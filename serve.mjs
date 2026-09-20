import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('.');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.xml':'application/xml','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{
  try {
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (!/^\/(?:$|index\.html$|(?:tentang|layanan|artikel|kontak)\.html$|robots\.txt$|sitemap\.xml$|(?:assets|panduan|wawasan)\/)/.test(path)) {res.writeHead(404).end();return;}
    let file=resolve(root,'.'+path);
    if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
    if((await stat(file)).isDirectory())file=resolve(file,'index.html');
    const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);
  } catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Halaman tidak ditemukan');}
});
server.listen(0,'127.0.0.1',()=>process.stdout.write('Local: http://127.0.0.1:'+server.address().port+'\n'));
