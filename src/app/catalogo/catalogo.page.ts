import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Catalogo } from '../services/catalogo';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false
})
export class CatalogoPage implements OnInit {

  /** Lista completa de produtos carregada do JSON */
  produtosOriginais: any[] = [];

  /** Lista de produtos a apresentar após aplicar todos os filtros */
  produtosFiltrados: any[] = [];

  /** Texto de pesquisa introduzido pelo utilizador */
  pesquisa: string = '';

  /** Filtro de categoria ativo */
  categoriaAtiva: string = 'todas';

  /** Filtro de faixa etária ativo */
  idadeAtiva: string = 'todas';

  /** Filtro de tipo de produto ativo */
  tipoAtivo: string = 'todos';

  /** Filtro de cor ativo */
  corAtiva: string = 'todas';

  /** Opções do dropdown Categoria */
  readonly categorias = [
    { valor: 'todas', label: 'Todas as categorias' },
    { valor: 'menino', label: 'Menino' },
    { valor: 'menina', label: 'Menina' },
    { valor: 'bebé', label: 'Bebé' }
  ];

  /** Opções do dropdown Faixa Etária */
  readonly idades = [
    { valor: 'todas', label: 'Todas as idades' },
    { valor: '0-2', label: '0-2 anos' },
    { valor: '3-5', label: '3-5 anos' },
    { valor: '6-8', label: '6-8 anos' },
    { valor: '9-12', label: '9-12 anos' }
  ];

  /** Opções do dropdown Tipo de Produto */
  readonly tipos = [
    { valor: 'todos', label: 'Todos os tipos' },
    { valor: 'casaco', label: 'Casacos' },
    { valor: 't-shirt', label: 'T-Shirts' },
    { valor: 'calças', label: 'Calças' },
    { valor: 'vestido', label: 'Vestidos' },
    { valor: 'sapatilhas', label: 'Sapatilhas' },
    { valor: 'acessório', label: 'Acessórios' }
  ];

  /** Opções do dropdown Cor */
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
   */
  constructor(
    private catalogoService: Catalogo,
    private router: Router
  ) {}

  // ─── CICLO DE VIDA ──────────────────────────────────────────────────────────

  /**
   * Carrega todos os produtos e inicializa a lista filtrada.
   */
  ngOnInit() {
    this.catalogoService.getProdutos().subscribe((data: any[]) => {
      this.produtosOriginais = data;
      this.produtosFiltrados = data;
    });
  }

  // ─── FILTROS ────────────────────────────────────────────────────────────────

  /**
   * Aplica todos os filtros ativos e atualiza produtosFiltrados.
   */
  aplicarFiltros() {
    this.produtosFiltrados = this.produtosOriginais.filter(produto => {
      if (this.categoriaAtiva !== 'todas' &&
          produto.categoria?.toLowerCase() !== this.categoriaAtiva.toLowerCase()) return false;
      if (this.idadeAtiva !== 'todas' && produto.faixaEtaria !== this.idadeAtiva) return false;
      if (this.tipoAtivo !== 'todos' &&
          produto.tipo?.toLowerCase() !== this.tipoAtivo.toLowerCase()) return false;
      if (this.corAtiva !== 'todas' &&
          !produto.cores?.includes(this.corAtiva)) return false;
      if (this.pesquisa &&
          !produto.nome?.toLowerCase().includes(this.pesquisa.toLowerCase())) return false;
      return true;
    });
  }

  /**
   * Atualiza o filtro de categoria e reaplica os filtros.
   * @param event - Evento do ion-select
   */
  onCategoriaChange(event: any) {
    this.categoriaAtiva = event.detail.value;
    this.aplicarFiltros();
  }

  /**
   * Atualiza o filtro de faixa etária e reaplica os filtros.
   * @param event - Evento do ion-select
   */
  onIdadeChange(event: any) {
    this.idadeAtiva = event.detail.value;
    this.aplicarFiltros();
  }

  /**
   * Atualiza o filtro de tipo e reaplica os filtros.
   * @param event - Evento do ion-select
   */
  onTipoChange(event: any) {
    this.tipoAtivo = event.detail.value;
    this.aplicarFiltros();
  }

  /**
   * Atualiza o filtro de cor e reaplica os filtros.
   * @param event - Evento do ion-select
   */
  onCorChange(event: any) {
    this.corAtiva = event.detail.value;
    this.aplicarFiltros();
  }

  /**
   * Atualiza o texto de pesquisa e reaplica os filtros.
   * @param event - Evento do ion-searchbar
   */
  onPesquisaChange(event: any) {
    this.pesquisa = event.detail.value ?? '';
    this.aplicarFiltros();
  }

  /**
   * Repõe todos os filtros para os valores padrão.
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
   * Navega para a página de detalhe do produto.
   * @param id - ID do produto selecionado
   */
  verDetalhe(id: number) {
    this.router.navigate(['/produto-detalhe', id]);
  }
}