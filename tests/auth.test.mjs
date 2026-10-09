import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
test('aguarda cinco segundos para chave correta, incorreta ou ausente',async()=>{
 await Promise.all(['test-key','wrong-key',null].map(async key=>{
  const started=performance.now();
  const response=await worker.fetch(new Request('https://example.test/api/session',{headers:key?{Authorization:'Bearer '+key}:{}}),{EDITOR_KEY:'test-key'});
  assert.ok(performance.now()-started>=4900,'A validação não pode responder imediatamente');
  assert.equal(response.status,key==='test-key'?200:401);
 }));
});
