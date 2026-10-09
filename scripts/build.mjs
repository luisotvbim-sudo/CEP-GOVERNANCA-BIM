import { build } from 'esbuild';
import {mkdir} from 'node:fs/promises';
await mkdir('dist/server',{recursive:true});
await build({entryPoints:['src/worker.js'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',loader:{'.html':'text'},minify:true});
