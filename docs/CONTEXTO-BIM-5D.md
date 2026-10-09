# Contexto de trabalho — BIM 5D e orçamentação

Registro da conversa com o usuário em 9 de outubro de 2026. Este documento orienta a continuidade do trabalho; não implementa novas funcionalidades nem substitui documentação técnica do SINAPI.

## Foco

O foco solicitado é BIM 5D e orçamentação: conectar os elementos do modelo, seus quantitativos e especificações aos serviços, composições e custos do orçamento.

## Insumos não modelados

Usar o termo **insumos não modelados** para materiais necessários à execução que não estão representados geometricamente no modelo BIM. Exemplo: argamassa para fixação de uma caixa elétrica.

A quantidade desses insumos pode ser calculada pelos coeficientes das composições vinculadas aos serviços. Não atribuir coeficientes sem consultar a referência e verificar as condições de execução.

## Material e serviço

O insumo representa um recurso, como uma caixa elétrica. A composição representa o serviço, como o fornecimento e a instalação dessa caixa, incluindo os recursos e as composições auxiliares aplicáveis.

Exemplos discutidos, **pendentes de conferência na CAIXA para a referência adotada**:

| Tipo | Código SINAPI | Descrição discutida |
|---|---|---|
| Insumo | 00001873 | CAIXA DE PASSAGEM, EM PVC, DE 4" X 4", PARA ELETRODUTO FLEXIVEL CORRUGADO |
| Composição | 91944 | CAIXA RETANGULAR 4" X 4" BAIXA (0,30 M DO PISO), PVC, INSTALADA EM PAREDE - FORNECIMENTO E INSTALAÇÃO. AF_03/2023 |

Na conversa, foram identificadas como componentes da composição a caixa 00001873 e as composições auxiliares 88629 (argamassa), 88247 (auxiliar de eletricista) e 88264 (eletricista). Conferir descrição, vigência, componentes e coeficientes na base oficial antes de usar em orçamento. Não foram definidos preços ou coeficientes neste contexto.

Fontes consultadas na conversa:

- Portal oficial e relatórios de manutenção: https://www.caixa.gov.br/poder-publico/modernizacao-gestao/sinapi/Paginas/default.aspx
- Notas e retificações: https://www.caixa.gov.br/Downloads/sinapi-historico-de-encargos-e-notas/Notas_SINAPI.pdf
- Consulta secundária da composição, sem equivaler à validação oficial: https://www.datasin.com.br/sinapi/91944

## Quantitativos, especificações e orçamento

É comum manter uma lista de quantitativos de materiais e uma planilha de orçamento separadas, desde que exista rastreabilidade entre elas.

- A lista de materiais pode detalhar dimensões, características técnicas, unidade, quantidade e, quando definido, marca e modelo.
- O orçamento pode agrupar os custos por serviço, com unidade, quantidade, preço unitário e total. A composição detalha os recursos necessários.
- A especificação completa pode estar no projeto, memorial ou tabela vinculada, sem ser repetida integralmente em cada linha do orçamento.
- Quando houver marca ou modelo especificado, verificar se o preço usado corresponde ao produto e às condições especificadas. Uma referência genérica não garante essa correspondência.

Relação conceitual: **elemento BIM → especificação → quantitativo do serviço → composição → recursos e custo**. Um elemento pode exigir mais de um serviço, conforme o escopo.

## Identificação e histórico

Códigos e descrições SINAPI não devem ser tratados como referências imutáveis. Descrições podem ser retificadas mantendo o código, e a base recebe manutenções.

Recomendação discutida: manter identificador interno estável e registrar separadamente o tipo de referência (insumo ou composição), código SINAPI, descrição, unidade, mês/ano e UF. Preservar os dados usados em cada versão do orçamento, em vez de sobrescrever seu histórico ao atualizar a base.

O GUID do elemento identifica o cadastro BIM; o código SINAPI identifica uma referência de custo. Aprovar o cadastro do elemento não valida automaticamente seus vínculos SINAPI.

## Continuidade

Este registro documenta conceitos e dúvidas discutidas. Novas telas, cálculos, importações, preços ou alterações no catálogo dependem de uma solicitação de implementação. Manter as regras do AGENTS.md e os vínculos manuais pendentes de conferência na CAIXA.
