import { Component, OnInit } from '@angular/core';
import { Catalogo } from '../services/catalogo';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false
})
export class CatalogoPage implements OnInit {
  produtos: any[] = [];
  produtosFiltrados: any[] = [];
  
  termoPesquisa: string = '';
  categoriaSelecionada: string = '';
  tipoSelecionado: string = '';
  faixaEtariaSelecionada: string = '';
  corSelecionada: string = '';
  lojaSelecionada: string = '';

  constructor(private catalogoService: Catalogo) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.catalogoService.getProdutos().subscribe((data: any) => {
      this.produtos = data;
      this.produtosFiltrados = data; 
    });
  }

  pesquisar(event: any) {
    this.termoPesquisa = event.detail.value || '';
    this.aplicarFiltros();
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
    this.selecionarFiltro(tipo, '');
  }

  limparTodosFiltros() {
    this.categoriaSelecionada = '';
    this.tipoSelecionado = '';
    this.faixaEtariaSelecionada = '';
    this.corSelecionada = '';
    this.lojaSelecionada = '';
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.produtosFiltrados = this.produtos.filter((produto: any) => {
      
      // 1. Filtro da Barra de Pesquisa
      const matchPesquisa = !this.termoPesquisa || 
        (produto.nome && produto.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase()));
      
      // 2. Filtro de Categoria (menino, menina, bebe)
      const matchCategoria = !this.categoriaSelecionada || produto.categoria === this.categoriaSelecionada;
      
      // 3. Filtro do Tipo de Peça (tshirt, casaco, etc)
      const matchTipo = !this.tipoSelecionado || produto.tipo === this.tipoSelecionado;
      
      // 4. Filtro da Faixa Etária (0-2, 3-5, etc)
      const matchFaixa = !this.faixaEtariaSelecionada || produto.faixaEtaria === this.faixaEtariaSelecionada;

      // 5. Filtro de Cor (Varre os arrays dentro do JSON)
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

  // Métodos auxiliares para renderizar texto amigável nas etiquetas de remoção célere
  getNomeCategoria(): string {
    if (this.categoriaSelecionada === 'bebe') return 'Bebé';
    if (this.categoriaSelecionada === 'menina') return 'Menina';
    if (this.categoriaSelecionada === 'menino') return 'Menino';
    return '';
  }

  getNomeTipo(): string {
    const dicionario: any = {
      'tshirt': 'T-Shirt', 'casaco': 'Casaco', 'calcas': 'Calças',
      'vestido': 'Vestido', 'body': 'Body', 'conjunto': 'Conjunto',
      'calcado': 'Calçado', 'acessorio': 'Acessório'
    };
    return dicionario[this.tipoSelecionado] || this.tipoSelecionado;
  }

  getNomeLoja(): string {
    if (this.lojaSelecionada === 'braga') return 'Braga Parque';
    if (this.lojaSelecionada === 'coimbra') return 'Coimbra Dolce Vita';
    if (this.lojaSelecionada === 'lisboa') return 'Lisboa Colombo';
    return '';
  }
}