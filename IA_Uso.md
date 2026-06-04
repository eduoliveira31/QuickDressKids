# Registo de Co-Criação: Decisões Humanas vs. Uso de Modelos de IA

Este documento discrimina de forma clara, enumerada e sucinta o esforço de desenvolvimento do grupo (Fator Humano) e as tarefas suportadas por modelos de Inteligência Artificial (Fator IA) durante o Sprint 2 e 3 do projeto QuickDressKids.

## 1. Atividades e Decisões de Autoria Humana (Grupo)
* **Definição de Requisitos e Regras de Negócio:** Determinação manual de que o "Casaco de Inverno" estaria esgotado em Lisboa e a simulação de stock por algoritmos matemáticos baseados nos IDs dos produtos.
* **Validações do Fluxo de Reserva:** Planeamento lógico de segurança para bloquear a reserva caso o utilizador não tenha sessão iniciada, o carrinho esteja vazio, não haja loja selecionada ou exista uma quebra de stock local.
* **Cenários de Interação e Design Visual:** Conceção dos storyboards, cenários da Carla e do João (Etapa 2) e escolha manual da paleta de cores (verde pastel e cinza claro) para corresponder à identidade da marca QuickDressKids.
* **Gestão de Repositório e Resolução de Conflitos:** Execução manual de comandos Git, tomada de decisão durante a limpeza de "Merge Conflicts" complexos e reestruturação física das pastas do projeto no disco.
* **Testes em Dispositivo Físico:** Lançamento, compilação do projeto e validação da usabilidade móvel em ambiente real.

## 2. Tarefas Desenvolvidas com Recurso a Modelos de IA
* **Refatorização de Componentes com Diretivas Reativas:** Auxílio na transição da lógica antiga baseada em `[value]` e `(ionChange)` para uma abordagem limpa e centralizada com `[(ngModel)]` no Catálogo, respeitando as restrições técnicas impostas.
* **Correção de Erros de Compilação (Debugging):** Diagnóstico e resolução imediata de erros críticos do ecossistema Angular/Ionic, tais como o `NullInjectorError` (adicionando o decorator `@Injectable` com `providedIn: 'root'`) e erros de propriedades `undefined` através de guardas lógicas de segurança.
* **Estilização e Alinhamento Flexbox:** Geração de CSS/SCSS para centralizar rigorosamente a secção Hero da página principal (Hero Portrait da menina), ajustar a escala visual da imagem, aplicar gradientes e converter elementos geométricos decorativos azulados para os tons verde pastel pretendidos.
* **Documentação de Código (Padrão JSDoc):** Geração automática de blocos de comentários estruturados nos ficheiros controladores (`catalogo.page.ts` e `carrinho.page.ts`) e comentários descritivos semânticos nas tags do template (`carrinho.page.html`).
* **Cruzamento Teórico e Mapeamento de Heurísticas:** Apoio na verificação do cumprimento dos requisitos do guião de IHM, mapeando o código fonte atual com as 10 Heurísticas de Nielsen (Prevenção de Erros, Controlo do Utilizador e Visibilidade do Estado do Sistema).