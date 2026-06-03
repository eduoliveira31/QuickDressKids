import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Catalogo } from '../services/catalogo';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false
})
export class CatalogoPage implements OnInit {

  produtosOriginais: any[] = [];
  produtosFiltrados: any[] = [];
  currentUser: Usuario | null = null;

  pesquisa: string = '';
  categoriaSelecionada: string = '';
  faixaEtariaSelecionada: string = '';
  tipoSelecionado: string = '';
  corSelecionada: string = '';
  lojaSelecionada: string = '';

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

  constructor(
    private catalogoService: Catalogo,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.catalogoService.getProdutos().subscribe((data: any[]) => {
      this.produtosOriginais = data;
      this.produtosFiltrados = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    this.produtosFiltrados = this.produtosOriginais.filter((produto: any) => {
      const matchPesquisa = !this.pesquisa || 
        (produto.nome && produto.nome.toLowerCase().includes(this.pesquisa.toLowerCase()));
      
      let matchCategoria = !this.categoriaSelecionada;
      if (!matchCategoria) {
        matchCategoria = (produto.categoria === this.categoriaSelecionada || 
                         (this.categoriaSelecionada === 'bebé' && produto.categoria === 'bebe') ||
                         (this.categoriaSelecionada === 'bebe' && produto.categoria === 'bebé'));
      }
      
      const matchTipo = !this.tipoSelecionado || produto.tipo === this.tipoSelecionado;
      const matchFaixa = !this.faixaEtariaSelecionada || produto.faixaEtaria === this.faixaEtariaSelecionada;

      let matchCor = !this.corSelecionada;
      if (!matchCor && produto.cores && Array.isArray(produto.cores)) {
        matchCor = produto.cores.includes(this.corSelecionada);
      } else if (!matchCor && produto.cor) {
        matchCor = produto.cor === this.corSelecionada;
      }

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

  selecionarFiltro(tipo: string, valor: string) {
    if (tipo === 'categoria') this.categoriaSelecionada = valor;
    if (tipo === 'tipoProduto') this.tipoSelecionado = valor;
    if (tipo === 'faixaEtaria') this.faixaEtariaSelecionada = valor;
    if (tipo === 'cor') this.corSelecionada = valor;
    if (tipo === 'loja') this.lojaSelecionada = valor;
    this.aplicarFiltros();
  }

  removerFiltro(tipo: string) {
    if (tipo === 'categoria') this.categoriaSelecionada = '';
    if (tipo === 'tipoProduto') this.tipoSelecionado = '';
    if (tipo === 'faixaEtaria') this.faixaEtariaSelecionada = '';
    if (tipo === 'cor') this.corSelecionada = '';
    if (tipo === 'loja') this.lojaSelecionada = '';
    this.aplicarFiltros();
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
    this.lojaSelecionada = '';
    this.produtosFiltrados = this.produtosOriginais;
  }

  verDetalhe(id: number) {
    this.router.navigate(['/produto-detalhe', id]);
  }

  getNomeCategoria(): string {
    if (this.categoriaSelecionada === 'bebe' || this.categoriaSelecionada === 'bebé') return 'Bebé';
    const found = this.categorias.find(c => c.valor === this.categoriaSelecionada);
    return found ? found.label : this.categoriaSelecionada;
  }

  getNomeTipo(): string {
    const found = this.tipos.find(t => t.valor === this.tipoSelecionado);
    return found ? found.label : this.tipoSelecionado;
  }

  getNomeLoja(): string {
    if (this.lojaSelecionada === 'braga') return 'Braga Parque';
    if (this.lojaSelecionada === 'coimbra') return 'Coimbra';
    if (this.lojaSelecionada === 'lisboa') return 'Lisboa Colombo';
    return '';
  }
}