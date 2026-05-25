import { Component, OnInit } from '@angular/core';
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

  constructor(private catalogoService: Catalogo) {}

  ngOnInit() {
    this.catalogoService.getProdutos().subscribe((data: any) => {
      this.produtosOriginais = data;
      this.produtosFiltrados = data;
    });
  }

  filtrarCategoria(event: any) {
    const categoriaSelecionada = event.detail.value;

    if (categoriaSelecionada === 'todos') {
      this.produtosFiltrados = this.produtosOriginais;
    } else {
      this.produtosFiltrados = this.produtosOriginais.filter(
        produto => produto.categoria.toLowerCase() === categoriaSelecionada.toLowerCase()
      );
    }
  }
}