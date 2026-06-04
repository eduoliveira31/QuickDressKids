import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Catalogo } from '../services/catalogo';
import { AuthService, Usuario } from '../services/auth.service';

/**
 * Componente responsável pela página principal do Catálogo.
 * Gere a exibição da lista de produtos, bem como a lógica de pesquisa
 * e o cruzamento dinâmico de múltiplos filtros (categoria, idade, cor, etc.).
 */
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false
})
export class CatalogoPage implements OnInit {

  // ==========================================
  //      VARIÁVEIS DE ESTADO E DADOS
  // ==========================================

  /** Array que guarda a lista original e completa de produtos vindos do JSON. Nunca é alterado. */
  produtosOriginais: any[] = [];
  
  /** Array dinâmico que guarda apenas os produtos que cumprem os filtros atuais. É este que o HTML renderiza. */
  produtosFiltrados: any[] = [];
  
  /** Objeto que guarda as informações do utilizador atualmente autenticado. */
  currentUser: Usuario | null = null;

  // --- Variáveis ligadas à interface de filtragem (ngModel) ---
  pesquisa: string = '';
  categoriaSelecionada: string = '';
  faixaEtariaSelecionada: string = '';
  tipoSelecionado: string = '';
  corSelecionada: string = '';
  lojaSelecionada: string = '';

  // ==========================================
  //   DICIONÁRIOS PARA OS MENUS DROPDOWN
  // ==========================================

  readonly categorias = [
    { valor: 'menino', label: 'Menino' },
    { valor: 'menina', label: 'Menina' },
    { valor: 'bebé', label: 'Bebé' }
  ];

  readonly idades = [
    { valor: '0-2', label: '0-2 anos' },
    { valor: '3-5', label: '3-5 anos' },
    { valor: '6-8', label: '6-8 anos' },
    { valor: '9-12', label: '9-12 anos' }
  ];

  readonly tipos = [
    { valor: 'casaco', label: 'Casacos' },
    { valor: 't-shirt', label: 'T-Shirts' },
    { valor: 'calças', label: 'Calças' },
    { valor: 'vestido', label: 'Vestidos' },
    { valor: 'sapatilhas', label: 'Sapatilhas' },
    { valor: 'acessório', label: 'Acessórios' }
  ];

  readonly cores = [
    { valor: 'Azul', label: 'Azul' },
    { valor: 'Rosa', label: 'Rosa' },
    { valor: 'Verde', label: 'Verde' },
    { valor: 'Vermelho', label: 'Vermelho' },
    { valor: 'Amarelo', label: 'Amarelo' },
    { valor: 'Branco', label: 'Branco' },
    { valor: 'Preto', label: 'Preto' },
    { valor: 'Cinzento', label: 'Cinzento' }
  ];

  readonly lojas = [
    { valor: 'braga', label: 'Loja Braga Parque' },
    { valor: 'coimbra', label: 'Loja Coimbra Dolce Vita' },
    { valor: 'lisboa', label: 'Loja Lisboa Colombo' }
  ];

  /**
   * Construtor do componente.
   * @param catalogoService Serviço para obter os dados dos produtos.
   * @param authService Serviço para verificar o estado de autenticação do utilizador.
   * @param router Serviço de roteamento do Angular para navegação entre ecrãs.
   */
  constructor(
    private catalogoService: Catalogo,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Ciclo de vida do Angular (OnInit). Executa quando o ecrã é carregado.
   * Subscreve-se aos serviços para buscar o utilizador logado e a lista de produtos.
   */
  ngOnInit() {
    // Subscreve ao utilizador ativo
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Subscreve à base de dados de produtos (JSON)
    this.catalogoService.getProdutos().subscribe((data: any[]) => {
      this.produtosOriginais = data;
      this.produtosFiltrados = data;
      this.aplicarFiltros(); // Força a verificação inicial
    });
  }

  // ==========================================
  //           MÉTODOS DE FILTRAGEM
  // ==========================================

  /**
   * Motor principal de cruzamento de dados. 
   * Filtra o array `produtosOriginais` validando todas as condições ativas (pesquisa, cor, etc.).
   */
  aplicarFiltros() {
    this.produtosFiltrados = this.produtosOriginais.filter((produto: any) => {
      
      // 1. Filtro de Texto (Pesquisa)
      const matchPesquisa = !this.pesquisa || 
        (produto.nome && produto.nome.toLowerCase().includes(this.pesquisa.toLowerCase()));
      
      // 2. Filtro de Categoria (com tratamento para caracteres especiais 'bebé'/'bebe')
      let matchCategoria = !this.categoriaSelecionada;
      if (!matchCategoria) {
        matchCategoria = (produto.categoria === this.categoriaSelecionada || 
                         (this.categoriaSelecionada === 'bebé' && produto.categoria === 'bebe') ||
                         (this.categoriaSelecionada === 'bebe' && produto.categoria === 'bebé'));
      }
      
      // 3. Filtros Diretos (Tipo e Faixa Etária)
      const matchTipo = !this.tipoSelecionado || produto.tipo === this.tipoSelecionado;
      const matchFaixa = !this.faixaEtariaSelecionada || produto.faixaEtaria === this.faixaEtariaSelecionada;

      // 4. Filtro de Cor (verificação em arrays ou strings únicas)
      let matchCor = !this.corSelecionada;
      if (!matchCor && produto.cores && Array.isArray(produto.cores)) {
        matchCor = produto.cores.includes(this.corSelecionada);
      } else if (!matchCor && produto.cor) {
        matchCor = produto.cor === this.corSelecionada;
      }

      // 5. Filtro de Stock em Loja Física (simulação de lógica de negócio)
      let matchLoja = !this.lojaSelecionada;
      if (!matchLoja) {
        if (this.lojaSelecionada === 'braga' || this.lojaSelecionada === 'coimbra') {
          matchLoja = true; // Simula que Braga e Coimbra têm stock de tudo
        } else if (this.lojaSelecionada === 'lisboa') {
          matchLoja = (produto.id % 2 === 0); // Simula que Lisboa só tem stock de IDs pares
        }
      }

      // Produto só aparece se passar em todos os filtros simultaneamente
      return matchPesquisa && matchCategoria && matchTipo && matchFaixa && matchCor && matchLoja;
    });
  }

  /**
   * Define um filtro específico através da interface e reaplica o cruzamento de dados.
   * @param tipo A categoria do filtro (ex: 'cor').
   * @param valor O valor selecionado (ex: 'Azul').
   */
  selecionarFiltro(tipo: string, valor: string) {
    if (tipo === 'categoria') this.categoriaSelecionada = valor;
    if (tipo === 'tipoProduto') this.tipoSelecionado = valor;
    if (tipo === 'faixaEtaria') this.faixaEtariaSelecionada = valor;
    if (tipo === 'cor') this.corSelecionada = valor;
    if (tipo === 'loja') this.lojaSelecionada = valor;
    this.aplicarFiltros();
  }

  /**
   * Limpa um filtro individual quando o utilizador clica para remover um "Chip" ativo.
   * @param tipo A categoria do filtro a limpar.
   */
  removerFiltro(tipo: string) {
    if (tipo === 'categoria') this.categoriaSelecionada = '';
    if (tipo === 'tipoProduto') this.tipoSelecionado = '';
    if (tipo === 'faixaEtaria') this.faixaEtariaSelecionada = '';
    if (tipo === 'cor') this.corSelecionada = '';
    if (tipo === 'loja') this.lojaSelecionada = '';
    this.aplicarFiltros();
  }

  /**
   * Captura a entrada de texto na barra de pesquisa nativa.
   * @param event O evento de input do DOM.
   */
  onPesquisaChange(event: any) {
    this.pesquisa = event.detail.value || '';
    this.aplicarFiltros();
  }

  /**
   * Botão de emergência (Reset) que limpa absolutamente todos os estados ativos.
   */
  limparTodosFiltros() {
    this.pesquisa = '';
    this.categoriaSelecionada = '';
    this.faixaEtariaSelecionada = '';
    this.tipoSelecionado = '';
    this.corSelecionada = '';
    this.lojaSelecionada = '';
    this.produtosFiltrados = this.produtosOriginais;
  }

  // ==========================================
  //     MÉTODOS AUXILIARES E FORMATAÇÃO
  // ==========================================

  /**
   * Navega para a página de detalhes de um produto específico.
   * @param id O identificador do produto clicado.
   */
  verDetalhe(id: number) {
    this.router.navigate(['/produto-detalhe', id]);
  }

  /**
   * Formata a string de categoria para ser exibida nos "Chips" da interface de forma bonita.
   * @returns String devidamente formatada para apresentação.
   */
  getNomeCategoria(): string {
    if (this.categoriaSelecionada === 'bebe' || this.categoriaSelecionada === 'bebé') return 'Bebé';
    const found = this.categorias.find(c => c.valor === this.categoriaSelecionada);
    return found ? found.label : this.categoriaSelecionada;
  }

  /**
   * Obtém a label formatada correspondente ao valor interno do Tipo selecionado.
   * @returns String formatada.
   */
  getNomeTipo(): string {
    const found = this.tipos.find(t => t.valor === this.tipoSelecionado);
    return found ? found.label : this.tipoSelecionado;
  }

  /**
   * Obtém a designação comercial formatada correspondente à loja selecionada.
   * @returns String do nome da loja.
   */
  getNomeLoja(): string {
    if (this.lojaSelecionada === 'braga') return 'Braga Parque';
    if (this.lojaSelecionada === 'coimbra') return 'Coimbra';
    if (this.lojaSelecionada === 'lisboa') return 'Lisboa Colombo';
    return '';
  }
}