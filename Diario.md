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
- Injeção das propriedades ::part(placeholder) e ::part(text) com a marcação.\n

## Sessão 9 – 30 de maio de 2026
**Responsável:** Luís Martinho Oliveira Lopes
**Objetivo:** Alteração do tema para Verde Pastel, validações de segurança nos formulários (e-mail e password) e preparação da app para testes no telemóvel Android.

**Atividades realizadas:**
- **Novo Tema Verde Pastel:** Alteração da palete de cores de azul para tons de verde pastel (#4e9a74, #e8f5ee, #2d5a43). Ajuste do contraste das toolbars para branco (#ffffff) para cumprir as normas de acessibilidade (WCAG).
- **Validações de Registo e Login:** Adição de validações nos formulários: a password agora exige pelo menos 8 caracteres e o e-mail tem de ter um formato válido (com "@").
- **Setas de Voltar Atrás:** Mudança da cor da seta de voltar atrás (`ion-back-button`) para preto sólido, resolvendo problemas de visibilidade nas páginas de detalhes e reservas.
- **Carrinho no Catálogo:** Colocação do ícone do carrinho de compras diretamente no cabeçalho da página do Catálogo para acesso rápido.
- **Filtro de Lojas:** Criação de um filtro para cruzar a pesquisa com o stock disponível em lojas específicas (Braga Parque, Coimbra Dolce Vita, Lisboa Colombo).
- **Atalho no Popup:** Adição do botão "Ver Carrinho" na notificação (Toast) que aparece quando se adiciona um produto.
- **Sincronização Android:** Acoplamento do projeto web à plataforma Android usando o Capacitor (`npx cap sync android`).
- **Build para Telemóvel:** Geração do APK de testes (`app-debug.apk`) e instalação via cabo USB para testar permissões nativas de GPS.
- **Bloqueio de Stock e Lojas:** Implementação de lógica para impedir reservas de artigos sem stock (ex: Lisboa) e obrigar a que toda a encomenda seja levantada numa única loja.
- **Correção "Leve 3, Pague 2":** Ajuste no `CustosService` para aplicar o desconto de forma correta na peça de bebé mais barata.
- **Aumento do Budget do Angular:** Ajuste do limite de tamanho dos estilos no `angular.json` para 20kB, permitindo compilar para produção sem erros.

**Problemas:**
- O desconto "Leve 3, Pague 2" não estava a funcionar porque faltava enviar a informação da categoria no carrinho.
- A antiga cor azul bebé era muito clara e dificultava a leitura da interface.
- O sistema deixava encomendar produtos de lojas diferentes ao mesmo tempo ou artigos que não tinham stock.
- Havia blocos `:root` duplicados e conflitos de herança de cores no ficheiro `variables.scss`.
- A compilação final falhava porque os ficheiros de CSS excediam o limite padrão de 4kB do Angular.
- Era possível remover artigos do carrinho acidentalmente, sem qualquer aviso.
- O formulário permitia a criação de contas com passwords demasiado curtas.

**Soluções:**
- Ajuste na lógica para mapear as categorias e aplicar o desconto no carrinho, ordenando os preços de forma crescente.
- Mudança global para o tema verde pastel para resolver a legibilidade.
- Uso de um `BehaviorSubject` no `CarrinhoService` para trancar a loja escolhida logo no primeiro artigo adicionado, alertando se houver divergências.
- Limpeza do ficheiro `variables.scss`, deixando apenas um bloco `:root` principal.
- Atualização do `angular.json` para suportar estilos até 20kB.
- Adição de popups do `AlertController` para confirmar a eliminação de artigos ou o esvaziamento do carrinho.
- Inclusão de validação simples (`.length < 8`) com exibição de mensagens de aviso ao tentar registar a conta.

**Decisões:**
- Limitar as reservas a uma única loja física para simplificar a logística para o cliente final.
- Mostrar a discriminação dos descontos diretamente no ecrã do carrinho para ser mais transparente.
- Fazer a app arrancar sempre com a sessão fechada (visitante) para facilitar os testes de login.
- Abandonar o tema azul e assumir definitivamente o verde pastel no protótipo móvel.

## Sessão 10 – 01 de junho de 2026
**Responsável:** Luís Martinho Oliveira Lopes
**Objetivo:** Melhorias na usabilidade mobile, correção de pequenos erros no checkout e ajuste de filtros.

**Atividades realizadas:**
- **Botão Repor Filtros:** Adição de um botão com contorno vermelho no final do painel de filtros do Catálogo para limpar imediatamente as escolhas de categoria, idade, cor e loja.
- **Ícone de Lixo no Carrinho:** Lógica dinâmica no carrinho: quando a quantidade de um artigo chega a `1`, o botão de subtrair muda para um ícone de caixote do lixo (`trash-outline`) e fica vermelho.
- **Checkout Automático:** O botão "Ver Minhas Reservas" no fim da compra agora limpa o carrinho automaticamente através do `CarrinhoService`, sem disparar a caixa que pergunta se queremos esvaziá-lo.
- **Correção de Tags HTML nos Alertas:** Uso do componente `IonicSafeString` no detalhe do produto para que as tags de HTML (`<strong>`, `<br>`) do alerta de divergência de loja funcionem corretamente em vez de aparecerem como texto cru.
- **Voltar Atrás no Carrinho:** Inserção de um `ion-back-button` no cabeçalho do carrinho. A seta só aparece se o utilizador chegar ao carrinho através da notificação de um artigo, ocultando-se se entrar pelo menu inferior normal.
- **Sincronização Final:** Nova compilação de produção (`npm run build`) e sincronização Android para testar os últimos ajustes no telemóvel.

**Problemas:**
- As tags de formatação HTML estavam a aparecer literalmente escritas nos textos dos alertas.
- A app abria um popup a perguntar para esvaziar o carrinho logo depois de concluir a reserva com sucesso.
- Faltava uma seta de voltar atrás no carrinho, o que dificultava o regresso ao artigo que estávamos a ver.
- Desmarcar os filtros na pesquisa um a um não era nada prático.

**Soluções:**
- Passagem do texto do alerta por uma `IonicSafeString` para o Ionic o interpretar corretamente.
- Chamada direta da função `limparCarrinho()` no código do checkout, saltando a validação do modal.
- Inclusão condicional da seta de voltar atrás no header do carrinho baseada no histórico de navegação.
- Criação da função `limparTodosFiltros()` associada ao novo botão vermelho.

**Decisões:**
- Evitar popups desnecessários depois de o utilizador já ter confirmado uma compra com sucesso.
- Colocar atalhos rápidos para limpeza de filtros de forma a tornar a navegação da app mais fluida.

## Sessão 11 – 02 de junho de 2026
**Responsável:** Luís Martinho Oliveira Lopes
**Objetivo:** Alinhamento da app com os requisitos das tarefas Mobile 1, 2 e 3 e resolução de conflitos de compilação no Catálogo.

**Atividades realizadas:**
- **Resolução de Conflitos no Catálogo:** Remoção dos marcadores de conflito de Git (`<<<<<<<`, `=======`, `>>>>>>>`) no ficheiro `catalogo.page.ts` e correção das propriedades e métodos para garantir a compilação e o funcionamento correto dos chips de filtragem.
- **Mobile 1 (Acesso Opcional e Horários de Stock):** Remoção do bloqueio de seleção de loja na página de detalhes de produto ao adicionar ao carrinho. Exibição de stock em unidades e horários de funcionamento (Braga Parque: 10h-23h; Coimbra: 10h-22h; Lisboa Colombo: 10h-00h) quando uma loja for selecionada.
- **Mobile 2 (Seletor de Loja no Carrinho & Borda de Indisponibilidade):** Introdução do seletor de loja de levantamento na página do carrinho. Aplicação automática de contorno vermelho e mensagem de indisponibilidade aos produtos sem stock na loja selecionada (ex: artigos de ID ímpar como o casaco de ID 1 na loja Lisboa Colombo). Implementação de recálculo dinâmico (com subtotal correto de 67,50€ para sapatilhas + jardineiras após a remoção do casaco) e bloqueio da reserva se houver itens indisponíveis.
- **Mobile 3 (Notificação de Agendamento de Reserva):** Integração de uma notificação push simulada (Toast) disparada no momento da criação da reserva, indicando o agendamento correto, prazo de validade de 24 horas e o horário de levantamento da loja selecionada.

**Problemas:**
- Havia marcas de conflito de merge remanescentes no controlador do catálogo (`catalogo.page.ts`), quebrando a compilação global da aplicação.
- A seleção de loja era exigida no detalhe do produto, impedindo o fluxo livre do utilizador.
- O carrinho não permitia escolher ou alterar a loja, validando a disponibilidade no momento errado.

**Soluções:**
- Limpeza dos blocos duplicados em `catalogo.page.ts` e ajuste dos métodos para usar chips e as variáveis corretas.
- Permissão de adição ao carrinho sem loja selecionada no detalhe do produto e transferência da validação reativa de stock para o ecrã do carrinho.
- Adição de seletor `<ion-select>` no carrinho e vinculação estilizada de classe condicional para artigos indisponíveis.

**Decisões:**
- Permitir que o utilizador simule a recolha e valide o stock a qualquer momento na própria página do carrinho.
- Disparar a notificação push simulada logo após a confirmação da reserva como reforço visual e de contexto das condições da loja.

## Sessão 12 – 04 de junho de 2026
**Responsável:** Rodrigo Fernandes Malheiro  
**Objetivo:** Sincronização do repositório, refatorização do Catálogo para o uso exclusivo de `[(ngModel)]`, correção do serviço de dados, documentação de código e ajustes estéticos na página principal.

### Atividades realizadas:
* **Sincronização e Limpeza de Conflitos:** Resolução de conflitos de merge críticos no ficheiro `catalogo.page.ts` provocados por marcadores do Git (`<<<<<<< HEAD`, `=======`) que quebravam a compilação do Angular. Limpeza física de diretórias duplicadas no espaço de trabalho do Windows para garantir uma única fonte de verdade no VS Code.
* **Refatorização com ngModel:** Adaptação total do template HTML e do controlador do Catálogo (`catalogo.page.html` e `catalogo.page.ts`) para cumprir os requisitos técnicos de utilização exclusiva da diretiva `[(ngModel)]`. Centralização da lógica de cruzamento de filtros (pesquisa, categoria, idade, tipo e cor) no método `filtrarProdutos()`.
* **Injeção de Dependências e Correção do Serviço:** Resolução do erro global `NullInjectorError: No provider for Catalogo!` através da introdução do decorator `@Injectable({ providedIn: 'root' })` no ficheiro `src/app/services/catalogo.ts`, garantindo a correta injeção do serviço na aplicação. Adição de uma proteção contra dados nulos (`if (!this.produtosOriginais)`) para corrigir a quebra da propriedade `filter` causada pela latência de carregamento do JSON.
* **Documentação do Código (Requisito 17):** Escrita e estruturação de documentação profissional no padrão JSDoc (`/** ... */`) para todas as variáveis, métodos e parâmetros dos controladores do Catálogo (`catalogo.page.ts`) e do Carrinho (`carrinho.page.ts`). Inserção de comentários semânticos (``) nas secções do template do Carrinho (`carrinho.page.html`).
* **Ajustes Estéticos na Home (Tab1):** Modificação do estilo do botão "Começar" para forçar as letras a branco (`--color: #ffffff`). Centralização vertical e horizontal absoluta do elemento de destaque utilizando Flexbox no contentor `.hero-card`. Substituição da forma geométrica rosa de fundo por um quadrado verde pastel suave (`#d1e5d8`), mantendo a mesma claridade e harmonizando a página com a identidade visual da marca.
* **Criação do Ficheiro de Co-Criação:** Redação e inclusão do ficheiro obrigatório `IA_Uso.md` na raiz do projeto, enumerando de forma sucinta e clara as tarefas desenvolvidas por autoria humana (regras de negócio, design e fluxos) e as suportadas por modelos de Inteligência Artificial (debugging, refatorização e comentários).

### Problemas Encontrados:
1. O Git inseriu marcadores de conflito no código do catálogo após um *hard reset*, impedindo o arranque da aplicação.
2. Existência de pastas duplicadas do projeto no disco do utilizador, fazendo com que o Angular lesse ficheiros desatualizados em cache.
3. Erro de runtime `NullInjectorError` no browser devido à falta de declaração do provider do serviço do catálogo.
4. Erro `Cannot read properties of undefined (reading 'filter')` com o ecrã a ficar em branco por causa do tempo de resposta na leitura do ficheiro JSON.
5. O botão "Começar" apresentava texto a preto com baixo contraste, e a imagem da menina na secção Hero encontrava-se desalinhada e com um fundo rosa fora da paleta de cores principal.

### Soluções Aplicadas:
* Limpeza manual do ficheiro TypeScript do catálogo, substituição pelas variáveis corretas mapeadas para o `ngModel` e reinicialização do processo `ionic serve` após a remoção da pasta duplicada.
* Configuração do metadado `providedIn: 'root'` no serviço `Catalogo` para o tornar disponível globalmente.
* Implementação de um escudo protetor (validação nula) no motor de filtragem do catálogo para aguardar a chegada dos dados.
* Ajuste das propriedades CSS/SCSS no ficheiro `tab1.page.scss` com `display: flex`, `align-items: center`, `justify-content: center` e alteração da variável `--background` para tons pastéis esverdeados.

### Decisões de Design:
* Unificar a interface de filtragem em torno de um modelo de dados bidirecional líquido (`ngModel`) para simplificar o código do template e evitar funções redundantes de input.
* Centralizar o foco visual do ecrã de entrada nos tons da marca (verde pastel) para garantir uma experiência imersiva e consistente desde o primeiro segundo de utilização da app.
* Manter o repositório do GitHub estritamente limpo e documentado nas horas que antecedem a entrega final da Etapa 3.

Sessão 13 – 08 de junho de 2026
Responsável: Eduardo Oliveira 33137

Objetivo: Implementação de funcionalidades de filtragem avançada (preço), correção de identidade visual em componentes críticos e sincronização de estado do repositório.

Atividades realizadas:
Filtro de Preço por Slider: Implementação de um componente ion-range no modal de filtros da página de catálogo. Refatorização da lógica de filtragem em catalogo.page.ts para incluir a comparação dinâmica produto.preco <= this.precoMaximo e atualização do contador de filtros ativos (filtrosAtivosCount).

Correção de Identidade Visual (UI): Ajuste estético no botão "Adicionar ao Carrinho" dentro da página de detalhe do produto. Alteração do atributo --background do componente ion-button para a cor verde corporativa #4e9a74, garantindo consistência com a paleta de cores definida nas sessões anteriores.

Manutenção do Código e UX: Atualização da interface de utilizador do modal de filtros para permitir a visualização em tempo real do preço máximo selecionado através de data binding ({{ precoMaximo | currency:'EUR' }}).

Gestão de Repositório: Documentação das alterações no diário de bordo e preparação das instruções de commit relativas às novas funcionalidades de filtragem e ajustes de estilo.

Problemas Encontrados:
Necessidade de filtrar produtos por uma gama de preços variável sem comprometer a performance da lista de produtos original.

Inconsistência na cor do botão principal de ação ("Adicionar ao Carrinho") na página de detalhe, que utilizava uma cor cinzenta (#78909c) divergente da identidade visual da aplicação.

Necessidade de atualizar o contador de filtros ativos para refletir corretamente a seleção do preço máximo.

Soluções Aplicadas:
Inclusão da variável precoMaximo no controlador do catálogo e adição do filtro correspondente no pipe de filtragem de dados.

Aplicação de estilos CSS (--background: #4e9a74) diretamente no template produto-detalhe.page.html para unificar o design.

Atualização do método limparTodosFiltros() para incluir o reset do valor do slider de preço para o valor inicial de 500€.

Decisões de Design:
Garantir que a filtragem por preço seja intuitiva, utilizando um componente slider nativo do Ionic com feedback visual imediato do valor.

Priorizar a utilização de tons de verde (#4e9a74) em todos os botões de ação principal para fortalecer o reconhecimento da marca QuickDressKids.

Manter a estrutura do código modular, permitindo a escalabilidade de novos filtros futuros sem necessidade de reestruturação do serviço de catálogo.

# Sessão 14 – 08 de junho de 2026
Responsável: Rodrigo Fernandes Malheiro 33103

Objetivo: Implementação do fluxo de recuperação de credenciais, refatorização estética e centralização da interface de autenticação, uniformização terminológica do sistema de reservas e gestão de ramificações do repositório.

## Atividades realizadas:
* **Fluxo de Recuperação de Palavra-passe:** Inclusão de um link interativo no formulário de login acoplado ao método `recuperarPalavraPasse()` no controlador. Configuração de uma janela nativa via `AlertController` para recolha de e-mail e validação de campo com feedback imediato por `ToastController`.
* **Otimização e Centralização da UI de Autenticação:** Ajuste estético na folha de estilos (`login.page.scss`) reduzindo proporcionalmente o tamanho das fontes (`rem`) e centralizando as etiquetas (*labels*) e caixas de texto (`--text-align: center`) para maximizar a ergonomia mobile.
* **Uniformização Terminológica ("Reservas Ativas"):** Substituição global do termo "Encomendas" para "Reservas Ativas" no ecrã de Perfil e no cabeçalho fixo da página de listagem (`reservas.page.html`), alinhando o vocabulário ao modelo de negócio da plataforma.
* **Refatorização de Componentes de Modais:** Substituição de classes de estilo genéricas por classes específicas (`btn-ajuda-submit` e `btn-password-submit`) nos modais de suporte e segurança, aplicando o tom verde corporativo escuro da marca.
* **Sincronização e Gestão de Ramos:** Execução de rotinas locais do Git para integração dos commits na branch principal (`main`) e posterior atualização e resolução de conflitos na branch de desenvolvimento local (`rodrigo-malheiro`).

## Problemas Encontrados:
* **Erros de Tags Órfãs na Compilação:** Interrupção temporária do build do Angular devido a uma incorreção de fecho sintático no cabeçalho do template (`</Toolbar>` em vez de `</ion-toolbar>`).
* **Falha de Escopo em Variáveis de Notificação:** Erro de compilação detetado no método utilitário `mostrarToast` do perfil devido ao mapeamento de uma variável inexistente (`message` em vez de `mensagem`).
* **Quebra na Consistência de Elementos da Lista:** Desalinhamento estético e variação tonal cromática ao tentar isolar as opções de topo em cartões independentes, divergindo do padrão de blocos unificados das secções inferiores do Perfil.
* **Erro Crítico de Conexão com Host Remoto:** Falha do Git no comando de push (`Could not resolve host: github.com`) originada por instabilidade na rede local ou resolução de DNS do terminal.

## Soluções Aplicadas:
* Correção ortográfica e sintática imediata das tags do Ionic no cabeçalho, restabelecendo a compilação do módulo.
* Refatorização do método `mostrarToast` para consumir corretamente o argumento tipado `mensagem: string`.
* Reversão do HTML do Perfil para a estrutura de lista em bloco nativa (`inset="true"`), preservando as cores e raios de curvatura de borda originais para uniformizar a interface.
* Diagnóstico de rede e execução de rotinas de sincronização sequencial pós-restabelecimento da ligação de rede.

## Decisões de Design:
* Priorizar uma experiência de login minimalista, compactando títulos e centralizando dados para guiar o foco visual do utilizador em ecrãs de menores dimensões.
* Abandonar o termo comercial "Encomendas" em prol de "Reservas Ativas" para consolidar a aplicação como uma plataforma focada no catálogo rotativo e sustentável de vestuário infantil.
* Centralizar o comportamento e a paleta cromática dos botões de ação principal dos modais, aplicando o verde corporativo (#2d5a43) para fixar a identidade visual.