import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Catalogo } from '../services/catalogo'; 
import { Favoritos } from '../services/favoritos'; // <-- Importámos o teu serviço

@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.page.html',
  styleUrls: ['./produto-detalhe.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProdutoDetalhePage implements OnInit {
  produto: any;
  isFavorito: boolean = false; // Começa por assumir que não é favorito

  constructor(
    private route: ActivatedRoute,
    private catalogoService: Catalogo,
    private favoritosService: Favoritos // <-- Injetámos o serviço aqui
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const produtoId = Number(idParam);

    this.catalogoService.getProdutos().subscribe(async (produtos: any[]) => {
      this.produto = produtos.find(p => p.id === produtoId);
      
      // Assim que encontra o produto, vai perguntar à Base de Dados se tem um coração!
      if (this.produto) {
        this.isFavorito = await this.favoritosService.isFavorito(this.produto.id);
      }
    });
  }

  // Função que é ativada quando clicas no coração
  async toggleCoracao() {
    await this.favoritosService.toggleFavorito(this.produto.id);
    this.isFavorito = !this.isFavorito; // Muda o estado do ícone
  }
}