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