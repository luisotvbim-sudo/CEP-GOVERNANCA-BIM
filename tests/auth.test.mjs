import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
import {database} from './database.mjs';
test('aguarda cinco segundos para chave correta, incorreta ou ausente',async()=>{
 const {sqlite,DB}=database();
 await Promise.all(['test-key','wrong-key',null].map(async key=>{
  const started=performance.now();
  const response=await worker.fetch(new Request('https://example.test/api/session',{headers:key?{Authorization:'Bearer '+key}:{}}),{EDITOR_KEY:'test-key',DB});
  assert.ok(performance.now()-started>=4900,'A validação não pode responder imediatamente');
  assert.equal(response.status,key==='test-key'?200:401);
 }));
 sqlite.close();
});
test('limita tentativas paralelas, mantém a espera e deixa consultas públicas livres',async()=>{
 const {sqlite,DB}=database();
 const responses=await Promise.all(Array.from({length:8},()=>worker.fetch(new Request('https://example.test/api/session',{headers:{Authorization:'Bearer wrong'}}),{EDITOR_KEY:'test-key',DB})));
 assert.equal(responses.filter(r=>r.status===401).length,5);
 assert.equal(responses.filter(r=>r.status===429).length,3);
 const blocked=await worker.fetch(new Request('https://example.test/api/session',{headers:{Authorization:'Bearer test-key'}}),{EDITOR_KEY:'test-key',DB});
 assert.equal(blocked.status,429);assert.ok(Number(blocked.headers.get('Retry-After'))>800);
 const publicRead=await worker.fetch(new Request('https://example.test/api/assets'),{DB});assert.equal(publicRead.status,200);
 sqlite.close();
});
