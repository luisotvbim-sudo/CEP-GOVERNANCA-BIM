import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {readFile,readdir,mkdir,writeFile,unlink} from 'node:fs/promises';
import {loadEnvFile} from 'node:process';
try{loadEnvFile('.env')}catch{}
await mkdir('.local/files',{recursive:true});
const db=new DatabaseSync('.local/catalog.sqlite');
db.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY)');
for(const name of (await readdir('drizzle')).filter(n=>n.endsWith('.sql')).sort()){
 if(db.prepare('SELECT name FROM local_migrations WHERE name = ?').get(name))continue;
 const legacyInitial=name==='0000_curious_rage.sql'&&db.prepare("SELECT name FROM sqlite_master WHERE name='assets'").get();
 db.exec('BEGIN');try{if(!legacyInitial)db.exec(await readFile('drizzle/'+name,'utf8'));db.prepare('INSERT INTO local_migrations (name) VALUES (?)').run(name);db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}
}
const bind=(sql,args=[])=>({bind:(...a)=>bind(sql,a),first:async()=>db.prepare(sql).get(...args),all:async()=>({results:db.prepare(sql).all(...args)}),run:async()=>db.prepare(sql).run(...args)});
const files={put:async(key,stream)=>{await writeFile('.local/files/'+key.replaceAll('/','_'),Buffer.from(await new Response(stream).arrayBuffer()))},get:async key=>{try{return {body:await readFile('.local/files/'+key.replaceAll('/','_'))}}catch{return null}},delete:async key=>{try{await unlink('.local/files/'+key.replaceAll('/','_'))}catch{}}};
const {default:worker}=await import('../dist/server/index.js');
createServer(async(req,res)=>{try{const chunks=[];let bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>27*1024*1024){res.writeHead(413);res.end('Arquivo muito grande');return}chunks.push(chunk)}const request=new Request('http://127.0.0.1:4173'+req.url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});const response=await worker.fetch(request,{DB:{prepare:sql=>bind(sql)},FILES:files,EDITOR_KEY:process.env.EDITOR_KEY});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}catch(e){console.error(e);res.writeHead(500);res.end('Erro local')}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
