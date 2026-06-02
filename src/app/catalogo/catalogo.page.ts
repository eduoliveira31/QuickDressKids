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

  /** Filtros selecionados */
  categoriaSelecionada: string = '';
  tipoSelecionado: string = '';
  faixaEtariaSelecionada: string = '';
  corSelecionada: string = '';
  lojaSelecionada: string = '';
  termoPesquisa: string = '';

  constructor(
    private catalogoService: Catalogo,
    private router: Router
  ) {}

  ngOnInit() {
    this.catalogoService.getProdutos().subscribe((data: any[]) => {
      this.produtosOriginais = data;
      this.produtosFiltrados = data;
    });
  }

  /**
   * Aplica todos os filtros ativos e atualiza produtosFiltrados.
   */
  aplicarFiltros() {
    this.produtosFiltrados = this.produtosOriginais.filter((produto: any) => {
      
      // 1. Filtro da Barra de Pesquisa
      const matchPesquisa = !this.termoPesquisa || 
        (produto.nome && produto.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase()));
      
      // 2. Filtro de Categoria (menino, menina, bebe)
      let matchCategoria = !this.categoriaSelecionada;
      if (!matchCategoria) {
        if (this.categoriaSelecionada === 'bebe') {
          matchCategoria = (produto.categoria === 'bebe' || produto.categoria === 'bebé');
        } else {
          matchCategoria = (produto.categoria === this.categoriaSelecionada);
        }
      }
      
      // 3. Filtro do Tipo de Peça (tshirt, casaco, etc)
      const matchTipo = !this.tipoSelecionado || produto.tipo === this.tipoSelecionado;
      
      // 4. Filtro da Faixa Etária (0-2, 3-5, etc)
      const matchFaixa = !this.faixaEtariaSelecionada || produto.faixaEtaria === this.faixaEtariaSelecionada;

      // 5. Filtro de Cor
      let matchCor = !this.corSelecionada;
      if (!matchCor && produto.cores && Array.isArray(produto.cores)) {
        matchCor = produto.cores.includes(this.corSelecionada);
      }

      // 6. Filtro de Loja Disponível (Braga/Coimbra = tudo em stock, Lisboa = apenas IDs pares em stock na simulação)
      let matchLoja = !this.lojaSelecionada;
      if (!matchLoja) {
        if (this.lojaSelecionada === 'braga' || this.lojaSelecionada === 'coimbra') {
          matchLoja = true;
        } else if (this.lojaSelecionada === 'lisboa') {
          matchLoja = (produto.id % 2 === 0);
        }
      }

      return matchPesquisa && matchCategoria && matchTipo && matchFaixa && matchCor && matchLoja;
    });
  }

  /**
   * Atualiza o termo de pesquisa e filtra.
   */
  pesquisar(event: any) {
    this.termoPesquisa = event.detail.value ?? '';
    this.aplicarFiltros();
  }

  /**
   * Seleciona um filtro e reaplica.
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
   * Remove um filtro selecionado.
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
   * Nome legível da categoria selecionada.
   */
  getNomeCategoria(): string {
    if (this.categoriaSelecionada === 'bebe') return 'Bebé';
    if (this.categoriaSelecionada === 'menina') return 'Menina';
    if (this.categoriaSelecionada === 'menino') return 'Menino';
    return '';
  }

  /**
   * Nome legível do tipo selecionado.
   */
  getNomeTipo(): string {
    const tiposMap: any = {
      tshirt: 'T-Shirt',
      casaco: 'Casaco',
      calcas: 'Calças',
      vestido: 'Vestido',
      body: 'Body',
      conjunto: 'Conjunto',
      calcado: 'Calçado',
      acessorio: 'Acessório'
    };
    return tiposMap[this.tipoSelecionado] || this.tipoSelecionado;
  }

  /**
   * Nome legível da loja selecionada.
   */
  getNomeLoja(): string {
    if (this.lojaSelecionada === 'braga') return 'Braga Parque';
    if (this.lojaSelecionada === 'coimbra') return 'Coimbra';
    if (this.lojaSelecionada === 'lisboa') return 'Lisboa Colombo';
    return '';
  }

  /**
   * Limpa todos os filtros ativos.
   */
  limparTodosFiltros() {
    this.categoriaSelecionada = '';
    this.tipoSelecionado = '';
    this.faixaEtariaSelecionada = '';
    this.corSelecionada = '';
    this.lojaSelecionada = '';
    this.termoPesquisa = '';
    this.aplicarFiltros();
  }

  /**
   * Navega para o detalhe do produto.
   */
  verDetalhe(id: number) {
    this.router.navigate(['/produto-detalhe', id]);
  }
}