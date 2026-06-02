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

      let matchCor = !this.corSelecionada;
      if (!matchCor && produto.cores && Array.isArray(produto.cores)) {
        matchCor = produto.cores.includes(this.corSelecionada);
      } else if (!matchCor && produto.cor) {
        matchCor = produto.cor === this.corSelecionada;
      }

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