import {readFile,mkdir,writeFile} from 'node:fs/promises';
const origin='https://cep-governanca-bim.blue-book-5770.chatgpt.site';
const source=await readFile('src/index.html','utf8');
if(!source.includes("const API_BASE='';"))throw new Error('Configuração da API não encontrada');
await mkdir('docs/pages',{recursive:true});
await writeFile('docs/pages/index.html',source.replace("const API_BASE='';",`const API_BASE='${origin}';`));
await writeFile('docs/pages/.nojekyll','');
console.log('Interface GitHub Pages preparada em docs/pages');
