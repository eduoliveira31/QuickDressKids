import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Catalogo } from '../services/catalogo';
import { AuthService, Usuario } from '../services/auth.service';

/**
 * Página principal do catálogo de produtos QuickDressKids.
 *
 * Responsabilidades:
 * - Carregar todos os produtos do CatalogoService via JSON
 * - Aplicar filtros combinados: categoria, faixa etária, tipo e cor
 * - Pesquisa por nome em tempo real
 * - Navegar para o detalhe do produto ao clicar num card
 */
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false
})
export class CatalogoPage implements OnInit {

  currentUser: Usuario | null = null;
  filtrosAberto: boolean = false;

  /** Lista completa de produtos carregada do JSON — fonte de dados para os filtros */
  produtosOriginais: any[] = [];

  /** Lista de produtos a apresentar após aplicar todos os filtros ativos */
  produtosFiltrados: any[] = [];

  /** Texto de pesquisa introduzido pelo utilizador */
  pesquisa: string = '';

  /** Filtro de categoria ativo ('todas' mostra todos) */
  categoriaAtiva: string = 'todas';

  /** Filtro de faixa etária ativo ('todas' mostra todas) */
  idadeAtiva: string = 'todas';

  /** Filtro de tipo de produto ativo ('todos' mostra todos) */
  tipoAtivo: string = 'todos';

  /** Filtro de cor ativo ('todas' mostra todas) */
  corAtiva: string = 'todas';

  /** Opções de categoria para o dropdown */
  readonly categorias = [
    { valor: 'todas', label: 'Todas as categorias' },
    { valor: 'menino', label: 'Menino' },
    { valor: 'menina', label: 'Menina' },
    { valor: 'bebé', label: 'Bebé' }
  ];

  /** Opções de faixa etária para o dropdown */
  readonly idades = [
    { valor: 'todas', label: 'Todas as idades' },
    { valor: '0-2', label: '0-2 anos' },
    { valor: '3-5', label: '3-5 anos' },
    { valor: '6-8', label: '6-8 anos' },
    { valor: '9-12', label: '9-12 anos' }
  ];

  /** Opções de tipo de produto para o dropdown */
  readonly tipos = [
    { valor: 'todos', label: 'Todos os tipos' },
    { valor: 'casaco', label: 'Casacos' },
    { valor: 't-shirt', label: 'T-Shirts' },
    { valor: 'calças', label: 'Calças' },
    { valor: 'vestido', label: 'Vestidos' },
    { valor: 'sapatilhas', label: 'Sapatilhas' },
    { valor: 'acessório', label: 'Acessórios' }
  ];

  /** Opções de cor para o dropdown */
  readonly cores = [
    { valor: 'todas', label: 'Todas as cores' },
    { valor: 'Azul', label: 'Azul' },
    { valor: 'Rosa', label: 'Rosa' },
    { valor: 'Verde', label: 'Verde' },
    { valor: 'Vermelho', label: 'Vermelho' },
    { valor: 'Amarelo', label: 'Amarelo' },
    { valor: 'Branco', label: 'Branco' },
    { valor: 'Preto', label: 'Preto' },
    { valor: 'Cinzento', label: 'Cinzento' }
  ];

  /**
   * @param catalogoService - Service que fornece os dados do catálogo via JSON
   * @param router          - Router Angular para navegar para o detalhe do produto
   * @param route           - ActivatedRoute para ler os parâmetros da rota (queryParams)
   * @param authService     - Service de Autenticação simulada
   */
  constructor(
    private catalogoService: Catalogo,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  // ─── CICLO DE VIDA ──────────────────────────────────────────────────────────

  /**
   * Carrega todos os produtos, subscreve os queryParams e gere o estado de autenticação do utilizador.
   */
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.catalogoService.getProdutos().subscribe((data: any[]) => {
      this.produtosOriginais = data;
      
      // Detetar parâmetros vindos da HOME ou de links externos
      this.route.queryParams.subscribe(params => {
        this.categoriaAtiva = 'todas';
        this.idadeAtiva = 'todas';
        this.tipoAtivo = 'todos';
        this.corAtiva = 'todas';
        this.pesquisa = '';

        if (params['categoria']) {
          this.categoriaAtiva = params['categoria'];
        }
        if (params['tipo']) {
          this.tipoAtivo = params['tipo'];
        }

        if (params['campanha'] === 'verao') {
          // Filtragem especial para campanha de verão: T-Shirts, Vestidos e Calções
          this.produtosFiltrados = this.produtosOriginais.filter(produto => {
            const tipo = produto.tipo?.toLowerCase() ?? '';
            return tipo === 't-shirt' || tipo === 'vestido' || tipo === 'calcoes' || tipo === 'calções';
          });
        } else {
          this.aplicarFiltros();
        }
      });
    });
  }

  // ─── FILTROS ────────────────────────────────────────────────────────────────

  /**
   * Aplica todos os filtros ativos à lista original e atualiza produtosFiltrados.
   * Chamado sempre que qualquer filtro ou a pesquisa é alterada.
   */
  aplicarFiltros() {
    this.produtosFiltrados = this.produtosOriginais.filter(produto => {
      // Filtro de categoria
      if (this.categoriaAtiva !== 'todas' &&
          produto.categoria?.toLowerCase() !== this.categoriaAtiva.toLowerCase()) return false;
      // Filtro de faixa etária
      if (this.idadeAtiva !== 'todas' && produto.faixaEtaria !== this.idadeAtiva) return false;
      // Filtro de tipo
      if (this.tipoAtivo !== 'todos' &&
          produto.tipo?.toLowerCase() !== this.tipoAtivo.toLowerCase()) return false;
      // Filtro de cor
      if (this.corAtiva !== 'todas' &&
          !produto.cores?.includes(this.corAtiva)) return false;
      // Filtro de pesquisa por nome
      if (this.pesquisa &&
          !produto.nome?.toLowerCase().includes(this.pesquisa.toLowerCase())) return false;
      return true;
    });
  }

  /**
   * Atualiza o filtro de categoria e reaplica todos os filtros.
   * @param event - Evento do ion-select com o valor selecionado
   */
  onCategoriaChange(event: any) {
    this.categoriaAtiva = event.detail.value;
    this.aplicarFiltros();
  }

  /**
   * Atualiza o filtro de faixa etária e reaplica todos os filtros.
   * @param event - Evento do ion-select com o valor selecionado
   */
  onIdadeChange(event: any) {
    this.idadeAtiva = event.detail.value;
    this.aplicarFiltros();
  }

  /**
   * Atualiza o filtro de tipo e reaplica todos os filtros.
   * @param event - Evento do ion-select com o valor selecionado
   */
  onTipoChange(event: any) {
    this.tipoAtivo = event.detail.value;
    this.aplicarFiltros();
  }

  /**
   * Atualiza o filtro de cor e reaplica todos os filtros.
   * @param event - Evento do ion-select com o valor selecionado
   */
  onCorChange(event: any) {
    this.corAtiva = event.detail.value;
    this.aplicarFiltros();
  }

  /**
   * Atualiza o texto de pesquisa e reaplica todos os filtros.
   * @param event - Evento do ion-searchbar com o texto introduzido
   */
  onPesquisaChange(event: any) {
    this.pesquisa = event.detail.value ?? '';
    this.aplicarFiltros();
  }

  /**
   * Repõe todos os filtros para os valores padrão (sem filtro).
   */
  limparFiltros() {
    this.categoriaAtiva = 'todas';
    this.idadeAtiva = 'todas';
    this.tipoAtivo = 'todos';
    this.corAtiva = 'todas';
    this.pesquisa = '';
    this.produtosFiltrados = this.produtosOriginais;
  }

  /**
   * Navega para a página de detalhe do produto selecionado.
   * @param id - Identificador numérico do produto
   */
  verDetalhe(id: number) {
    this.router.navigate(['/produto-detalhe', id]);
  }

  abrirFiltros() {
    this.filtrosAberto = true;
  }

  fecharFiltros() {
    this.filtrosAberto = false;
  }
}