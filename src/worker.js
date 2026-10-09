import html from './index.html';
import {validateAsset} from './validation.js';
import {reserveAttempt,finishAttempt,clientHash} from './rate-limit.js';
import {demoAssets} from './demo-data.js';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const decode=row=>({...row,links:JSON.parse(row.links),fileName:row.file_name,updatedAt:row.updated_at,file_key:undefined,file_name:undefined,updated_at:undefined});
const authorized=async(r,e)=>{
 const delay=new Promise(resolve=>setTimeout(resolve,5000));
 const ipHash=await clientHash(r);
 const reservation=await reserveAttempt(e.DB,ipHash);
 await delay;
 if(!reservation.allowed)return {limited:true,retryAfter:reservation.retryAfter};
 const correct=Boolean(e.EDITOR_KEY&&r.headers.get('Authorization')===`Bearer ${e.EDITOR_KEY}`);
 await finishAttempt(e.DB,ipHash,correct);
 return {correct};
};
const limitedResponse=result=>Response.json({error:`Muitas tentativas. Tente novamente em ${result.retryAfter} segundos.`},{status:429,headers:{'Retry-After':String(result.retryAfter),'Cache-Control':'no-store'}});
const pagesOrigin='https://luisotvbim-sudo.github.io';
const handler={async fetch(request,env){
 const url=new URL(request.url);
 try{
  if(url.pathname==='/api/session'){
   const result=await authorized(request,env);
   return result.limited?limitedResponse(result):result.correct?json({editor:true}):json({error:'Chave de administração inválida.'},401);
  }
  if(url.pathname==='/api/assets'&&request.method==='GET'){
   const result=await env.DB.prepare('SELECT * FROM assets ORDER BY updated_at DESC').all();
   return json(result.results.map(decode));
  }
  if(url.pathname==='/api/demo-data'&&request.method==='POST'){
   const result=await authorized(request,env);
   if(result.limited)return limitedResponse(result);
   if(!result.correct)return json({error:'Acesso de gestão necessário.'},401);
   const origin=request.headers.get('Origin');if(origin&&origin!==url.origin&&origin!==pagesOrigin)return json({error:'Origem inválida.'},403);
   const items=demoAssets(),timestamp=new Date().toISOString();
   for(let start=0;start<items.length;start+=50){
    await env.DB.batch(items.slice(start,start+50).map(a=>env.DB.prepare('INSERT INTO assets (id,name,kind,discipline,category,version,status,description,links,file_key,file_name,updated_at) VALUES (?,?,?,?,?,?,?,?,?,NULL,NULL,?) ON CONFLICT(id) DO NOTHING').bind(a.id,a.name,a.kind,a.discipline,a.category,a.version,a.status,a.description,JSON.stringify(a.links),timestamp)));
   }
   return json({families:350,blocks:150,total:500});
  }
  const match=url.pathname.match(/^\/api\/assets\/([a-f0-9-]{36})(\/file)?$/);
  if(match&&match[2]&&request.method==='GET'){
   const row=await env.DB.prepare('SELECT file_key, file_name FROM assets WHERE id = ?').bind(match[1]).first();
   if(!row?.file_key)return json({error:'Arquivo não encontrado.'},404);
   const file=await env.FILES.get(row.file_key);if(!file)return json({error:'Arquivo indisponível.'},404);
   return new Response(file.body,{headers:{'Content-Type':'application/octet-stream','Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(row.file_name)}`,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'}});
  }
  if((url.pathname==='/api/assets'&&request.method==='POST')||(match&&!match[2]&&request.method==='PUT')){
   const result=await authorized(request,env);
   if(result.limited)return limitedResponse(result);
   if(!result.correct)return json({error:'Entre como administrador para salvar.'},401);
   const origin=request.headers.get('Origin');if(origin&&origin!==url.origin&&origin!==pagesOrigin)return json({error:'Origem inválida.'},403);
   if(Number(request.headers.get('Content-Length'))>27*1024*1024)return json({error:'O limite do arquivo é 25 MB.'},413);
   const form=await request.formData();let data;
   try{data=validateAsset(JSON.parse(form.get('data')))}catch(e){return json({error:e.message},400)}
   const id=match?.[1]||crypto.randomUUID();
   const previous=match?await env.DB.prepare('SELECT * FROM assets WHERE id = ?').bind(id).first():null;
   if(match&&!previous)return json({error:'Cadastro não encontrado.'},404);
   const file=form.get('file');let fileKey=previous?.file_key||null,fileName=previous?.file_name||null,newKey=null;
   if(file&&file.size){
    if(file.size>25*1024*1024)return json({error:'O limite do arquivo é 25 MB.'},413);
    if(!(data.kind==='Família BIM'?/\.(rfa|rvt|ifc)$/i:/\.(dwg|dxf)$/i).test(file.name))return json({error:'O formato do arquivo não corresponde ao tipo selecionado.'},400);
    newKey=`assets/${id}/${crypto.randomUUID()}`;await env.FILES.put(newKey,file.stream());fileKey=newKey;fileName=file.name;
   }
   if(!fileKey)return json({error:'Anexe o arquivo da família ou do bloco.'},400);
   const updatedAt=new Date().toISOString();
   try{await env.DB.prepare('INSERT INTO assets (id,name,kind,discipline,category,version,status,description,links,file_key,file_name,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,kind=excluded.kind,discipline=excluded.discipline,category=excluded.category,version=excluded.version,status=excluded.status,description=excluded.description,links=excluded.links,file_key=excluded.file_key,file_name=excluded.file_name,updated_at=excluded.updated_at').bind(id,data.name,data.kind,data.discipline,data.category,data.version,data.status,data.description,JSON.stringify(data.links),fileKey,fileName,updatedAt).run();}
   catch(e){if(newKey)await env.FILES.delete(newKey);throw e}
   if(newKey&&previous?.file_key)try{await env.FILES.delete(previous.file_key)}catch(e){console.error('Falha na limpeza do anexo anterior')}
   return json({id,...data,fileName,updatedAt},match?200:201);
  }
  if(url.pathname.startsWith('/api/'))return json({error:'Rota não encontrada.'},404);
  if(url.pathname!=='/')return new Response('Página não encontrada',{status:404});
  return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"}});
 }catch(e){console.error('Falha na operação do catálogo:',e.message);return json({error:'Não foi possível concluir. Seus dados no formulário foram preservados. Tente novamente.'},503)}
}};
export default {async fetch(request,env){
 const origin=request.headers.get('Origin');
 const isApi=new URL(request.url).pathname.startsWith('/api/');
 if(isApi&&request.method==='OPTIONS'){
  if(origin!==pagesOrigin)return json({error:'Origem inválida.'},403);
  return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':pagesOrigin,'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'}});
 }
 const response=await handler.fetch(request,env);
 if(isApi&&origin===pagesOrigin){
  const headers=new Headers(response.headers);headers.set('Access-Control-Allow-Origin',pagesOrigin);headers.set('Vary','Origin');
  return new Response(response.body,{status:response.status,headers});
 }
 return response;
}};
