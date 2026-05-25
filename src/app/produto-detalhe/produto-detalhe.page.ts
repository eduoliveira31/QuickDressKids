import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Catalogo } from '../services/catalogo'; 
import { Favoritos } from '../services/favoritos'; 

@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.page.html',
  styleUrls: ['./produto-detalhe.page.scss'],
  standalone: false
})
export class ProdutoDetalhePage implements OnInit {
  produto: any;
  isFavorito: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private catalogoService: Catalogo,
    private favoritosService: Favoritos 
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const produtoId = Number(idParam);

    this.catalogoService.getProdutos().subscribe(async (produtos: any[]) => {
      this.produto = produtos.find(p => p.id === produtoId);
      
      if (this.produto) {
        this.isFavorito = await this.favoritosService.isFavorito(this.produto.id);
      }
    });
  }

  async toggleCoracao() {
    await this.favoritosService.toggleFavorito(this.produto.id);
    this.isFavorito = !this.isFavorito; 
  }
}