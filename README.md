# CEP Governança BIM · Biblioteca

Biblioteca pública da Conceito Engenharia para cadastrar famílias BIM e blocos CAD, com múltiplos vínculos SINAPI por elemento.

## Recursos

- Cadastro e edição com disciplina, categoria, versão, situação e orientações.
- Famílias RFA/RVT/IFC e blocos DWG/DXF, anexos de até 25 MB, download público.
- Referências SINAPI manuais: insumo/composição, código, descrição, unidade, UF e mês.
- Busca por nome, categoria e código, filtros por tipo, disciplina e situação.
- Persistência D1 e arquivos R2. Nenhum catálogo fictício ou código SINAPI pré-carregado.
- Consulta pública, cadastro/edição protegidos por chave de administração mantida apenas em memória no navegador.
- Toda validação da chave, correta ou incorreta, espera cinco segundos no servidor. A espera também se aplica às gravações protegidas; não limita tentativas simultâneas.

## Desenvolvimento

Node.js 24+. Execute `npm ci`, `npm run db:generate` apenas quando houver mudança de schema, `npm run build`, `npm test` e `npm run dev`.
O servidor local atende somente 127.0.0.1:4173, usa SQLite e arquivos em `.local/`, e lê EDITOR_KEY de `.env`.
No Sites, configure EDITOR_KEY como segredo. O arquivo local `admin-access.txt` é ignorado pelo Git.

## Publicação

Worker ESM em dist/server/index.js, manifesto em .openai/hosting.json e migrações Drizzle em drizzle/.
O repositório GitHub preserva o código. O Sites mantém uma origem de publicação separada.
Página pública: https://luisotvbim-sudo.github.io/CEP-GOVERNANCA-BIM/
Backend e interface alternativa: https://cep-governanca-bim.blue-book-5770.chatgpt.site
GitHub Pages é publicado automaticamente pela workflow .github/workflows/pages.yml. A interface é gerada por scripts/build-pages.mjs, que configura a origem da API sem incluir credenciais. O Worker permite CORS exclusivamente para https://luisotvbim-sudo.github.io; autenticação continua obrigatória para gravações.

## Limites da primeira versão

Sem importação automática da base SINAPI, cálculo de preços, visualizador 3D ou integração com a autenticação do CEP Horas. As referências são informadas manualmente e identificadas como pendentes de conferência. A aprovação do elemento não valida automaticamente o vínculo SINAPI.
Todos os registros e anexos cadastrados ficam públicos; não cadastrar material confidencial.
A chave dá acesso de gestão completo; a versão inicial não identifica cada editor nem fornece histórico de auditoria.
Regras visuais permanentes em AGENTS.md e docs/IDENTIDADE-VISUAL.md.
