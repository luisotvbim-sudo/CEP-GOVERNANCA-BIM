import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateAsset} from '../src/validation.js';
const base=()=>({name:'Porta',kind:'Família BIM',discipline:'Arquitetura',category:'Portas',version:'1.0',status:'Em revisão',description:'',links:[]});
const link=()=>({type:'Insumo',code:'00123',description:'Referência de teste',unit:'UN',uf:'SP',reference:'2026-10'});
test('mantém zeros do código e exige conferência independente da aprovação',()=>{const a=base();a.status='Aprovado';a.links=[link()];const v=validateAsset(a);assert.equal(v.links[0].code,'00123');assert.equal(v.links[0].verification,'Pendente de conferência')});
test('rejeita referências incompletas e mês ou UF inválidos',()=>{for(const invalid of [{uf:'ZZ'},{reference:'2026-13'},{code:'abc'},{description:''},{unit:''}]){const a=base();a.links=[{...link(),...invalid}];assert.throws(()=>validateAsset(a))}});
test('evita duplicação do mesmo vínculo',()=>{const a=base();a.links=[link(),link()];assert.throws(()=>validateAsset(a),/repetidos/)});
test('permite cadastro sem SINAPI e rejeita tipo desconhecido',()=>{assert.deepEqual(validateAsset(base()).links,[]);assert.throws(()=>validateAsset({...base(),kind:'Qualquer arquivo'}))});
