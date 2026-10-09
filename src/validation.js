export const disciplines=['Arquitetura','Estrutura','Hidrossanitário','Elétrica','Climatização','Prevenção contra incêndio','Outros'];
export const states='AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
export function validateAsset(data){
 const clean={};
 for(const [key,max] of Object.entries({name:160,category:100,version:40,description:3000})){
  if(typeof data[key]!=='string'||data[key].trim().length>max)throw new Error('Verifique os campos do cadastro.');
  clean[key]=data[key].trim();
 }
 if(!clean.name||!clean.category||!clean.version)throw new Error('Preencha nome, categoria e versão.');
 if(!['Família BIM','Bloco CAD'].includes(data.kind)||!disciplines.includes(data.discipline)||!['Em revisão','Aprovado','Arquivado'].includes(data.status))throw new Error('Classificação inválida.');
 Object.assign(clean,{kind:data.kind,discipline:data.discipline,status:data.status});
 if(!Array.isArray(data.links)||data.links.length>30)throw new Error('Vínculos SINAPI inválidos.');
 clean.links=data.links.map(l=>{
  if(!['Insumo','Composição'].includes(l.type)||!/^\d{1,12}$/.test(l.code)||typeof l.description!=='string'||!l.description.trim()||l.description.length>1000||typeof l.unit!=='string'||!l.unit.trim()||l.unit.length>20||!states.includes(l.uf)||!/^\d{4}-(0[1-9]|1[0-2])$/.test(l.reference))throw new Error('Preencha tipo, código, descrição, unidade, UF e referência de cada vínculo SINAPI.');
  return {type:l.type,code:l.code,description:l.description.trim(),unit:l.unit.trim(),uf:l.uf,reference:l.reference,verification:'Pendente de conferência'};
 });
 if(new Set(clean.links.map(l=>[l.type,l.code,l.uf,l.reference].join('|'))).size!==clean.links.length)throw new Error('Há vínculos SINAPI repetidos.');
 return clean;
}
