import {validateAsset} from './validation.js';
import products from './sinapi-products.json' with {type:'json'};
const familyVariants=['MODELO GERAL','DOCUMENTAÇÃO','COORDENAÇÃO','DETALHAMENTO','QUANTIFICAÇÃO','APRESENTAÇÃO','COMPATIBILIZAÇÃO'];
const cadVariants=['PLANTA','VISTA FRONTAL','VISTA LATERAL','CORTE','DETALHE DE INSTALAÇÃO'];
export function demoAssets(){
 let index=0;
 const create=(kind,p,variant,v)=>{
  const id=`00000000-0000-4000-8000-${String(++index).padStart(12,'0')}`;
  const title=p.description.split(',')[0].slice(0,85);
  const data=validateAsset({name:`CEP-${title} ${p.code} · ${variant}`.toLocaleUpperCase('pt-BR'),kind,discipline:p.discipline,category:p.category,
   version:kind==='Família BIM'?`1.${v} · Revit 2025`:`1.${v} · CAD 2024`,status:'Em revisão',
   links:[{type:'Insumo',code:p.code,description:p.description,unit:p.unit,uf:p.uf,reference:p.reference}],
   description:`${p.description}. Representação para ${variant.toLocaleLowerCase('pt-BR')}. Referência SINAPI ${p.code}, ${p.uf}, ${p.reference}. Conferir especificação e compatibilidade antes de aprovar o elemento.`});
  return {id,...data};
 };
 const families=products.flatMap(p=>familyVariants.map((variant,v)=>create('Família BIM',p,variant,v)));
 const blocks=products.filter((_,i)=>i%5<3).flatMap(p=>cadVariants.map((variant,v)=>create('Bloco CAD',p,variant,v)));
 return [...families,...blocks];
}
