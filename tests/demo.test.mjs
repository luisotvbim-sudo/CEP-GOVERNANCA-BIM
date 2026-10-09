import {test} from 'node:test';
import assert from 'node:assert/strict';
import {demoAssets} from '../src/demo-data.js';
import products from '../src/sinapi-products.json' with {type:'json'};
test('509 cadastros CEP em maiúsculas com referências SINAPI consultadas',()=>{
 const items=demoAssets();assert.equal(items.length,509);
 assert.equal(items.filter(a=>a.kind==='Família BIM').length,351);
 assert.equal(items.filter(a=>a.kind==='Bloco CAD').length,158);
 assert.equal(new Set(items.map(a=>a.id)).size,509);
 assert.equal(new Set(items.map(a=>a.name)).size,509);
 assert.equal(new Set(items.map(a=>a.discipline)).size,6);
 assert.equal(items.filter(a=>a.links.length).length,413);
 assert.equal(new Set(items.flatMap(a=>a.links.map(l=>l.code))).size,50);
 for(const a of items){
  assert.ok(a.name.startsWith('CEP-'));
  assert.equal(a.name,a.name.toLocaleUpperCase('pt-BR'));
  assert.ok(!a.fileKey&&!/demonstração|fictício/i.test(a.description));
  if(!a.links.length)continue;
  const p=products.find(p=>p.code===a.links[0].code);
  assert.equal(a.links[0].description,p.description);
  assert.equal(a.links[0].reference,p.reference);
  assert.equal(a.links[0].verification,'Pendente de conferência');
  assert.ok(p.source.startsWith('https://orse.cehop.se.gov.br/'));
 }
 assert.deepEqual(demoAssets(),items);
});
