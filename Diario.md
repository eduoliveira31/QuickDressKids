# Diário de Desenvolvimento - QuickDressKids

## Sessão 1 - 11 de maio de 2026
**Responsável:** Eduardo Oliveira (33137)

**Objetivo:**
Configuração do ambiente e documentação obrigatória.

**Atividades realizadas:**
- **Setup de Colaboração:** Adição dos elementos do grupo ao repositório e configuração do quadro Kanban com as 4 Sprints do enunciado.
- **Documentação de Controlo:** Criação e estruturação dos ficheiros `IA_Usage.md` e `DIARIO.md`.
- **Gestão de Branches:** Criação da branch `develop` para fluxos de trabalho e proteção da branch `main`.

**Problemas:**
- Nenhum problema encontrado

**Decisões:**
- Manter o repositório **Público** para facilitar a avaliação contínua.
- Utilizar apenas a branch `develop` para código, mantendo a `main` como espelho da documentação validada e versões estáveis.

## Sessão 4 – 15 de maio de 2026
**Responsável:** Rodrigo Malheiro (33103)
**Objetivo:** Estruturação e organização dos módulos, services e assets do projeto Ionic.
**Atividades:**

Gerei as páginas principais da aplicação (Catálogo, Carrinho e Perfil) com o CLI do Ionic;
Criei os services para a gestão de produtos e do carrinho;
Criei as pastas de assets (data/ e images/);
Adicionei o HttpClientModule ao AppModule;
Atualizei as rotas dos tabs para as novas páginas;
Atualizei a tab bar com os ícones e labels corretos;
Fiz commit das alterações e submeti um pull request no GitHub.

**Problemas:**

O comando ionic generate não funcionava por estar a correr fora da pasta correta do projeto;
A dependência @ionic/angular-toolkit não estava instalada;
Erro de ligação de rede (ECONNRESET) durante o npm install;
As páginas foram geradas como standalone components, causando erros de declaração nos módulos.

**Soluções:**

Naveguei até à pasta com o angular.json antes de correr os comandos;
Instalei a dependência em falta com npm install --save-dev @ionic/angular-toolkit;
Repeti o npm install após instabilidade de rede;
Importei cada página no array imports do módulo correspondente (em vez de declarations) e adicionei IonicModule, CommonModule e FormsModule diretamente no decorador @Component de cada página.

**Decisões:**

O trabalho foi feito diretamente no branch main; para seguir boas práticas de equipa, as alterações foram movidas para um branch dedicado (sprint/estrutura-modulos) antes de fazer push e pull request.

## Sessão 3 – 19 de maio de 2026
**Responsável:** Rodrigo Malheiro (33103)
**Objetivo:** Implementação de um Service para consumo dos ficheiros JSON e apresentação dos produtos no catálogo.
**Atividades:**

Implementei o Service do catálogo com métodos para obter produtos, categorias, tipos e faixas etárias a partir dos ficheiros JSON;
Implementei o método para obter um produto por ID;
Implementei o método para filtrar produtos por categoria;
Implementei o método para obter os produtos em destaque;
Injetei o Service na página do catálogo;
Atualizei o HTML da página do catálogo para apresentar a lista de produtos com imagem, nome, categoria, faixa etária e preço.

**Problemas:**

A página do catálogo é um standalone component, pelo que o HttpClientModule tinha de ser importado diretamente no componente.

**Solução:**

Adição do HttpClientModule ao array de imports do decorador @Component da página do catálogo.

**Decisões:**

O Service foi implementado no ficheiro já existente catalogo.ts, mantendo a convenção de nomes do projeto.

## Sessão 4 – 25 de maio de 2026
**Responsável:** Eduardo Oliveira (33137)
**Objetivo:** Implementação e conclusão das funcionalidades centrais da Sprint 2 (Interface Visual, Navegação, Detalhes, Filtros Dinâmicos e Persistência de Favoritos).

**Atividades realizadas:**
- **Refatoração Visual:** Evolução da interface do catálogo (`catalogo.page.html`) de uma lista linear simples para um layout moderno em grelha responsiva (`ion-grid`, `ion-row`, `ion-col`) estruturada com cartões interativos (`ion-card`).
- **Navegação Dinâmica (Router):** Configuração do `app-routing.module.ts` para suportar rotas com parâmetros dinâmicos (`produto-detalhe/:id`) e amarração da diretiva `[routerLink]` nos botões do catálogo.
- **Interceção de Parâmetros:** Integração do serviço `ActivatedRoute` no controlador de detalhes para capturar o ID do produto diretamente a partir do URL do navegador.
- **Consumo de Detalhes:** Subscrição assíncrona do serviço `Catalogo` combinada com o método `.find()` em JavaScript para isolar e exibir a informação individualizada do artigo correspondente.
- **Sistema de Filtros:** Implementação de uma barra de segmentos interativa (`ion-segment`) no topo do catálogo, permitindo a filtragem imediata em tempo de execução através do método `.filter()`.
- **Persistência de Dados Locais:** Instalação e configuração do motor `@ionic/storage-angular` no módulo principal (`app.module.ts`).
- **Gestão de Favoritos:** Criação da lógica de persistência no ficheiro `favoritos.ts` e criação do botão de coração (`heart` / `heart-outline`) reativo na página de detalhes, garantindo o salvamento permanente das preferências do utilizador.

**Problemas:**
- Erro crítico `NG8001` no template de catálogo: a diretiva `routerLink` não era reconhecida pela aplicação.
- Erro de arquitetura híbrida: a página `produto-detalhe` foi gerada como componente standalone, quebrando a compilação ao ser incorretamente adicionada ao array de `declarations` do seu módulo.
- Erros em cascata no template de detalhes indicando que elementos core (como `ion-header` e `ion-content`) eram desconhecidos para o Angular.
- Erro silencioso de ecrã em branco na aplicação após a introdução inicial do módulo de armazenamento.

**Soluções:**
- Importação manual do `RouterModule` na propriedade `imports` do decorador `@Component` dentro de `catalogo.page.ts`.
- Remoção da página do bloco `declarations` e recolocação no array `imports` dentro de `produto-detalhe.module.ts`.
- Injeção explícita do `IonicModule` na lista de `imports` do próprio metadado do componente standalone em `produto-detalhe.page.ts`.
- Substituição e saneamento completo do código do `app.module.ts`, retificando o posicionamento das vírgulas e adicionando corretamente o `HttpClientModule` e o `IonicStorageModule.forRoot()`.

**Decisões:**
- Manter o padrão de *Standalone Components* introduzido nativamente pelo ecossistema moderno do Angular e Ionic para as novas páginas, ajustando manualmente os ficheiros de suporte necessários.
- Guardar de forma otimizada apenas a coleção de IDs numéricos dos produtos favoritos no Ionic Storage para economizar memória e acelerar o processamento local.

## Sessão 5 – 26 de maio de 2026
**Responsável:** Rodrigo Fernandes Malheiro [cite: 56, 154]
**Objetivo:** Implementação e otimização da lógica do carrinho de compras com simulação de custos e início do Sprint 3 para a redesign visual completa baseada no Figma em tons verde pastel.

**Atividades realizadas:**
**Implementação da Lógica do Carrinho:** Criação e integração do `CarrinhoService` com recurso a um `BehaviorSubject` reativo para gerir o estado global dos itens adicionados (controlando ID, nome, preço, tamanho, cor e quantidade).
**Ligação da Página de Detalhes:** Vinculação do botão "Adicionar ao Carrinho" na página de detalhes do produto (`produto-detalhe.page.ts`), passando a validar as opções de tamanho e cor selecionadas através de chips dinâmicos (`ion-chip`) e emitindo notificações com `ToastController`.
**Construção da Interface do Carrinho:** Desenvolvimento da estrutura visual em `carrinho.page.html` para exibição de miniaturas de produtos, detalhes dos atributos, controlo manual de incrementação/decrementação de quantidades e esvaziamento total do carrinho.
**Arquitetura de Serviços Dedicados (Otimização):** Refatoração da lógica de custos através da criação de um novo serviço independente (`CustosService`), isolando o cálculo do subtotal, validação do limiar de portes grátis (estipulado nos €50) e apuramento do valor total da encomenda.
**Indicadores de Progresso de Envio:** Incorporação de um componente `ion-progress-bar` dinâmico na página do carrinho para ilustrar visualmente ao utilizador o valor em falta para obter a isenção dos portes de envio.
**Padronização com Ícones Oficiais:** Atualização dos elementos de navegação global (`tabs.page.html`) e dos seletores de categoria do catálogo (`catalogo.page.html`) recorrendo exclusivamente a glifos nativos da biblioteca *Ionicons*.
**Configuração de Cores Globais:** Estruturação avançada do ficheiro `variables.scss` para criar mapeamentos personalizados da marca, incluindo classes CSS injetáveis (`.ion-color-menino`, `.ion-color-menina`, `.ion-color-bebe`) e definições explícitas de tipografia e palete de cores.
**Desenvolvimento da Redesign Verde Pastel:** Substituição da identidade visual antiga para adotar tons pastel baseados em verde menta e sálvia (`#4a9b6f`, `#a8d5b5`), ajustando os estilos globais de cartões, botões e barras de ferramentas (`global.scss`) para simular o protótipo.

**Problemas:**
**Eliminação Acidental de Template:** Perda total de conteúdo da página de catálogo (exibindo ecrã em branco e sem renderizar produtos) após uma substituição indevida que manteve unicamente o componente `<ion-segment>` e apagou a grelha de cartões.
**Problema de Inicialização de Filtros:** Falha na renderização assíncrona da lista devido ao estado inicial vazio da propriedade `produtosFiltrados` antes do disparo do evento `(ionChange)` no arranque da aplicação.
**Sobreposição Indesejada do Modo Escuro:** Descaracterização estética da palete verde pastel provocada pela diretiva de sistema `@media (prefers-color-scheme: dark)`, que forçava um fundo escuro em contraste com os cartões e desajustava o visual limpo pretendido.
**Divergência Estrutural com o Protótipo:** Constatação de que a disposição nativa por abas inferiores (*Tab Bar*) e barras padrão do Ionic impossibilitava a correspondência exata a 100% com o layout profissional desenhado no Figma.

**Soluções:**
**Limpeza e Colagem Integral:** Execução de um comando global de seleção e remoção (`Ctrl+A`), seguido da reinserção completa do ficheiro estruturado com as cerca de 70 linhas de código previstas.
**Restauro Completo do Template:** Reconstituição integral do ficheiro `catalogo.page.html`, integrando a barra de cabeçalho, os segmentos com ícones atualizados e a grelha responsiva `ion-grid`.
**Depuração via Consola do Navegador:** Injeção de pontos de controlo com `console.log` no método `ngOnInit` para aferir o correto carregamento dos 15 produtos a partir do serviço JSON e garantir a atribuição imediata do array nativo.
**Desativação de Estilos Dark Mode:** Remoção integral do bloco condicional de media query de cores escuras no final do ficheiro `variables.scss`, forçando o ecossistema a renderizar o fundo suave (`#f0f7f2`) e os elementos opacos de forma estável.
**Planeamento do Sprint 3 (Figma):** Formulação e abertura de uma nova meta de desenvolvimento para reestruturar completamente a navegação da aplicação através de uma barra horizontal superior, painel lateral esquerdo de filtros e ocultação definitiva da barra inferior.

**Decisões:**
**Segregação de Responsabilidades (Princípio SOLID):** Divisão estrita da lógica de negócio do ecossistema do carrinho, delegando a gestão estrita da coleção de itens ao `CarrinhoService` e todos os cálculos matemáticos e financeiros ao `CustosService`.

## Sessão 6 – 28 de maio de 2026
**Responsável:** Rodrigo Fernandes Malheiro
**Objetivo:** Comentar devidamente todo o código TypeScript da aplicação, cumprindo o requisito obrigatório do enunciado (classes, métodos e variáveis).
**Atividades realizadas:**

- Adição de comentários JSDoc (/** */) a todas as interfaces, documentando cada campo individualmente
- Comentário das classes de todos os services (CarrinhoService, CustosService, Catalogo, Favoritos, Produtos), descrevendo a responsabilidade de cada um
- Documentação de todos os métodos com @param e @returns, incluindo descrição do comportamento e casos especiais (ex: remoção automática quando quantidade chega a 0)
- Comentário das variáveis e constantes (PORTE_GRATIS_A_PARTIR_DE, VALOR_PORTE, itensSubject, basePath, etc.)
- Adição de comentários inline nos blocos lógicos menos óbvios (if/else, subscrições de Observables, pré-seleção de tamanho e cor)
- Documentação dos módulos AppModule e AppRoutingModule, explicando o papel de cada import
- Commit realizado: docs: comentar classes, métodos e variáveis de todos os ficheiros TypeScript

**Problemas:** Nenhum.
**Soluções:** N/A
**Decisões:**

- Comentários escritos em português para manter consistência com o resto da documentação do projeto
- Utilização do padrão JSDoc em vez de comentários simples, permitindo que o VS Code mostre a documentação ao passar o rato sobre os métodos
- Separação visual dos blocos de métodos com divisórias (// ─── LEITURA ───) para facilitar a navegação no código

## Sessão 7 – 28 de maio de 2026
**Responsável:** Eduardo Oliveira (33137)

**Objetivo:** Implementação do sistema de gestão dinâmica de reservas, melhoria da interface (UI/UX) das tabs e persistência definitiva dos dados recorrendo ao Ionic Storage, cumprindo requisitos avançados da Sprint 3.

**Atividades realizadas:**
- **Sistema e Serviço de Reservas:** Criação do serviço `ReservasService` (`src/app/services/reservas.ts`) para gestão do estado e ciclo de vida das reservas. Implementação de lógica para categorização de estado entre reservas 'ativas' e 'concluídas'.
- **Gestão de Datas e Validade:** Implementação de cálculo automático para gerar a data de criação e a data de validade (24 horas após a criação) para exibição nos cartões de reserva.
- **Redesign Fiel ao Figma (Minha Conta):** Reestruturação total do HTML da página `reservas.page.html` (`src/app/reservas/reservas.page.html`) com a implementação de um design premium para os cartões (fundo branco, bordas arredondadas, tipografia e espaçamentos otimizados), alinhado com o protótipo `Img 23`. Adição da visualização individualizada dos itens (incluindo fotografia da peça de roupa, cor, tamanho e quantidade).
- **QR Codes Dinâmicos e Modal:** Modificação da lógica de encerramento da compra no carrinho (`criarReserva()`) para gerar números aleatórios únicos por reserva (`#R...`). Criação de um Modal Deslizante (Bottom Sheet a 75% da altura) com fundo branco forçado para apresentar o QR Code construído com a API pública *QRServer*, garantindo a leitura por leitores óticos e o correto funcionamento em *Dark Mode*.
- **Ações e Histórico:** Lógica implementada nos botões dos cartões das reservas ativas: 
    * Botão "Marcar Concluída" que altera o status da reserva e a move automaticamente para o separador Histórico.
    * Botão "Cancelar" com implementação do `AlertController` para dupla validação/confirmação antes da eliminação permanente do registo.
- **Persistência de Reservas (Ionic Storage):** Integração final do módulo `@ionic/storage-angular` no serviço de reservas. Configuração dos métodos assíncronos (`async/await`) no serviço e na página do controlador para garantir a leitura e gravação no sistema de ficheiros do dispositivo, tornando as reservas imunes ao fecho da app ou refreshes (F5).
- **Correção da Leitura do JSON (Catálogo):** Adição e injeção do `HttpClientModule` no ficheiro root `app.module.ts` para permitir que o serviço aceda aos produtos locais e resolver o erro que deixava o ecrã em branco na rota inicial.
- **Melhorias de UI na Barra de Navegação:** Refatoração do `tabs.page.html` substituindo atributos incorretos por `tab="..."` para corrigir a ativação dos estados (highlighting). Criação de CSS avançado (`tabs.page.scss`) para gerar transições suaves e fundos estilo *bolha colorida semi-transparente* na aba ativa.

**Problemas:**
- A página do Carrinho dava erro de compilação por tentar importar o ficheiro gerado do serviço de reservas usando a extensão `.ts` no caminho e sem indicar o sufixo correto que a CLI do Angular exigia, apresentando o erro genérico de módulo não encontrado.
- Os botões "Marcar Concluída" e "Cancelar" do cartão de reservas não tinham funcionalidades associadas (comportamento de 'fachada').
- O sistema de reservas original dependia exclusivamente de variáveis gravadas na RAM, provocando perda irremediável de dados a cada atualização da página.
- Catálogo não carregava, registando um erro estrutural severo de consola (`NG0201: No provider found for HttpClient`) que bloqueava o Angular.
- A navegação pelas tabs não preenchia o ícone da página ativa nem demonstrava fundos coloridos, gerando uma má perceção de contexto e localização por parte do utilizador.

**Soluções:**
- Limpeza dos *imports* mal declarados na página do carrinho e nas reservas, suprimindo extensões forçadas e ajustando as vias de diretório.
- Refatoração da arquitetura lógica do controlador para suportar gestão de estados (ativa/concluída).
- Refatoração total do serviço com injeção do objeto assíncrono do Storage, com chamadas subsequentes e obrigatórias de `this.guardarNoDisco()` para garantir integridade.
- Intervenção cirúrgica nos `imports` principais do `app.module.ts` para injetar o `HttpClientModule` nativo, devolvendo estabilidade à árvore de componentes.
- Correção do mapeamento de rotas trocando o standard routerLink pela propriedade interna `tab` e integração de regras customizadas no `SCSS` das *Tabs*.

**Decisões:**
- Estruturar os painéis de reserva recorrendo à estratégia *Model-View-ViewModel (MVVM)*, centralizando todo o poder de estado, alteração, consulta e deleção no nível do serviço em detrimento da página.
- Optar por agrupar subcommits e gerir as ramificações garantindo que as implementações vitais (Storage e HttpClient) fossem agrupadas logicamente como *Features* para a `develop`, simplificando as entregas de *Pull Requests*.

## Sessão 8 – 29 de maio de 2026
**Responsável:** Rodrigo Fernandes Malheiro   
**Objetivo:** Redesenho completo da interface do catálogo alinhado com o Figma, implementação de um sistema de autenticação local via JSON e padronização dos dados de produtos.  

**Atividades realizadas:**
- Redesign do Catálogo (Figma): Reestruturação visual e funcional da página de catálogo (catalogo.page.html e .scss) para replicar o protótipo. Implementação de uma grelha de 3 colunas para exibição dos produtos com imagens integradas, tags de identificação e preços posicionados na base do card.  
- Customização do Painel de Filtros: Otimização do menu lateral de filtros (Categoria, Faixa Etária, Tipo de Produto e Cor). - - - - Configuração de tipografia sem serifa (sans-serif), estilização dos textos e dos elementos internos em negrito e na cor preta, além da inclusão de bordas arredondadas nos cartões.  
- Estilização Avançada com Web Components: Utilização do seletor ::part do Ionic no ficheiro catalogo.page.scss para contornar limitações de encapsulamento. Forçou-se a exibição dos textos internos dos selects em preto e estilizou-se o botão "Limpar Filtros" com uma moldura vermelha semitransparente e bordas definidas.  
- Padronização Genérica do Inventário: Revisão e modificação completa do ficheiro local src/assets/data/produtos.json. -Removeram-se nomenclaturas específicas de cores presentes nos títulos das peças de vestuário, substituindo-as por descrições genéricas focadas na tipologia do produto e público-alvo.  
- Sistema de Autenticação Simulado: Criação e estruturação de uma base de dados local de utilizadores em src/assets/data/utilizadores.json. Implementação da lógica de validação de credenciais no AuthService com recurso exclusivo a diretivas [(ngModel)] no formulário da página de login, garantindo o redirecionamento automático para a página de perfil após o sucesso da sessão.  
- Gestão de Versões e Commits: Organização e execução sequencial de commits isolados no Git para cada bloco de tarefas concluído na sessão (otimização do carrinho com services dedicados, correção do layout do catálogo e atualização do catálogo de produtos em formato JSON).  

**Problemas:**
- Incompatibilidade de interatividade e quebra de fluxo nos componentes de filtragem após a aplicação de propriedades nativas de inversão de direção (flex-direction: row-reverse) diretamente nas pseudo-elements do Ionic.  
- Omissão de dados textuais e placeholders invisíveis nos menus dropdown do catálogo causados pela ausência de herança de cor explícita nas variáveis utilitárias do componente ion-select.  
- Erro de compilação na diretiva estrutural de repetição do Angular (*ngFor) no ficheiro catalogo.page.html devido a uma incorreção na sintaxe descritiva.  

**Soluções:**
- Refatoração do ficheiro catalogo.page.scss com a remoção dos blocos de posicionamento que bloqueavam a execução do clique, devolvendo a funcionalidade nativa estável às caixas de seleção.  
- Injeção das propriedades ::part(placeholder) e ::part(text) com a marcação !important para anular os estilos padrão e garantir o contraste visual do texto em preto puro.  Correção ortográfica e sintática imediata no template HTML de let produto de ... para let produto of ..., restabelecendo o ciclo de renderização correto dos produtos na tela.  

**Decisões:**
- Manter as setas de seleção dos filtros na sua posição original padrão à direita devido às restrições técnicas e instabilidades encontradas na manipulação direta da estrutura interna do componente do Ionic.  
- Substituir a integração de APIs externas de autenticação por uma simulação local controlada via JSON devido a falhas de autorização na API anterior, otimizando o fluxo de testes e garantindo total conformidade pedagógica com os requisitos de entrega do projeto.

## Sessão 9 – 29 de maio de 2026
**Responsável:** Luis Miguel (Grupo 10)  
**Objetivo:** Reestruturação visual de contraste do tema, implementação de regras de checkout seguras, controlo de stock por loja única e correção das regras de fidelização.

**Atividades realizadas:**
- **Reestruturação Visual de Contraste:** Redesenho e alteração de todos os cabeçalhos (`ion-toolbar` e `.navbar`) e da barra de navegação inferior (`ion-tab-bar`) para um azul bebé mais carregado e vibrante (`#4b8ae0`), garantindo conformidade de acessibilidade e excelente contraste com texto e ícones brancos (`#ffffff`).
- **Enquadramento de Sessão Obrigatória:** Integração de regras de segurança no carrinho que bloqueiam a criação de reservas para visitantes não autenticados, apresentando diálogos interativos do `AlertController` para encaminhamento direto para a página de Login.
- **Validação de Stock e Loja Única de Levantamento:** Desenvolvimento de uma robusta lógica de checkout onde todos os produtos de uma encomenda têm de ser associados à mesma loja de levantamento. Caso o utilizador tente selecionar uma loja divergente da que já está ativa no carrinho, a aplicação exibe uma janela de resolução interativa para esvaziar o carrinho ou reverter. Adicionalmente, impede a reserva de artigos sem stock (ex: na loja de Lisboa).
- **Correção da Campanha "Leve 3, Pague 2"**: Otimização do `CustosService` para deduzir automaticamente o valor do artigo de menor valor em grupos de 3 artigos da categoria "bebé" adicionados ao carrinho, exibindo o desconto de forma explícita e transparente na fatura do ecrã de checkout.
- **Compilação e Estabilização:** Ajuste de encapsulamento de estilos e imports do Angular para garantir que todo o projeto compila com absoluto sucesso, sem quaisquer erros ou falhas de tempo de execução.

**Problemas:**
- Inconsistência na aplicação do desconto "Leve 3, Pague 2" devido à ausência do campo de categoria nos dados passados ao carrinho.
- Erros de contraste com azul bebé muito claro que dificultava a leitura geral no ecrã.
- Permissão de reserva de produtos fora de stock ou levantamento em múltiplas lojas na mesma transação.

**Soluções:**
- Criação de mapeamento de categoria e desdobramento dos preços no carrinho, aplicando o desconto ordenado de forma crescente.
- Adoção do azul médio `#4b8ae0` e uso do seletor `!important` para sobrescrever variáveis locais antigas.
- Criação de BehaviorSubject de loja no `CarrinhoService` para rastreio e bloqueio de loja no primeiro artigo adicionado.

**Decisões:**
- Forçar uma única loja física por reserva para simplificar o levantamento logístico na loja física pelo cliente.
- Apresentar a discriminação visual detalhada de todos os custos e descontos no ecrã final do carrinho para otimizar o UX.