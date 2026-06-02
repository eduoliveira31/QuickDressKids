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

  produtosOriginais: any[] = [];
  produtosFiltrados: any[] = [];

<<<<<<< HEAD
  /** Filtros selecionados */
  categoriaSelecionada: string = '';
  tipoSelecionado: string = '';
  faixaEtariaSelecionada: string = '';
  corSelecionada: string = '';
  lojaSelecionada: string = '';
  termoPesquisa: string = '';

=======
  pesquisa: string = '';
  categoriaSelecionada: string = '';
  faixaEtariaSelecionada: string = '';
  tipoSelecionado: string = '';
  corSelecionada: string = '';

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

>>>>>>> 0b54999dc983e3a979a248298f372d2f71276ddb
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

<<<<<<< HEAD
  /**
   * Aplica todos os filtros ativos e atualiza produtosFiltrados.
   */
=======
>>>>>>> 0b54999dc983e3a979a248298f372d2f71276ddb
  aplicarFiltros() {
    this.produtosFiltrados = this.produtosOriginais.filter((produto: any) => {
      
      const matchPesquisa = !this.pesquisa || 
        (produto.nome && produto.nome.toLowerCase().includes(this.pesquisa.toLowerCase()));
      
      let matchCategoria = !this.categoriaSelecionada;
      if (!matchCategoria) {
        matchCategoria = (produto.categoria === this.categoriaSelecionada || 
                         (this.categoriaSelecionada === 'bebé' && produto.categoria === 'bebe'));
      }
      
      const matchTipo = !this.tipoSelecionado || produto.tipo === this.tipoSelecionado;
      const matchFaixa = !this.faixaEtariaSelecionada || produto.faixaEtaria === this.faixaEtariaSelecionada;

<<<<<<< HEAD
      // 5. Filtro de Cor
=======
>>>>>>> 0b54999dc983e3a979a248298f372d2f71276ddb
      let matchCor = !this.corSelecionada;
      if (!matchCor && produto.cores && Array.isArray(produto.cores)) {
        matchCor = produto.cores.includes(this.corSelecionada);
      } else if (!matchCor && produto.cor) {
        matchCor = produto.cor === this.corSelecionada;
      }

<<<<<<< HEAD
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
=======
      return matchPesquisa && matchCategoria && matchTipo && matchFaixa && matchCor;
    });
  }

  selecionarFiltro(tipo: string, valor: string) {
    if (tipo === 'categoria') this.categoriaSelecionada = valor;
    if (tipo === 'tipoProduto') this.tipoSelecionado = valor;
    if (tipo === 'faixaEtaria') this.faixaEtariaSelecionada = valor;
    if (tipo === 'cor') this.corSelecionada = valor;
    this.aplicarFiltros();
  }

  removerFiltro(tipo: string) {
    this.selecionarFiltro(tipo, '');
  }

  onPesquisaChange(event: any) {
    this.pesquisa = event.detail.value || '';
    this.aplicarFiltros();
  }

  limparTodosFiltros() {
    this.pesquisa = '';
    this.categoriaSelecionada = '';
    this.faixaEtariaSelecionada = '';
    this.tipoSelecionado = '';
    this.corSelecionada = '';
    this.produtosFiltrados = this.produtosOriginais;
  }

>>>>>>> 0b54999dc983e3a979a248298f372d2f71276ddb
  verDetalhe(id: number) {
    this.router.navigate(['/produto-detalhe', id]);
  }

  getNomeCategoria(): string {
    const found = this.categorias.find(c => c.valor === this.categoriaSelecionada);
    return found ? found.label : this.categoriaSelecionada;
  }

  getNomeTipo(): string {
    const found = this.tipos.find(t => t.valor === this.tipoSelecionado);
    return found ? found.label : this.tipoSelecionado;
  }
}