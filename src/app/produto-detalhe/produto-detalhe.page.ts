import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Catalogo } from '../services/catalogo'; 

@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.page.html',
  styleUrls: ['./produto-detalhe.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProdutoDetalhePage implements OnInit {
  // Variável para guardar o produto encontrado
  produto: any;

  constructor(
    private route: ActivatedRoute,
    private catalogoService: Catalogo // O teu serviço que lê os JSON
  ) { }

  ngOnInit() {
    // 1. Lê o ID do URL e converte para número
    const idParam = this.route.snapshot.paramMap.get('id');
    const produtoId = Number(idParam);

    // 2. Pede todos os produtos ao Service e filtra apenas o que queremos
    this.catalogoService.getProdutos().subscribe((produtos: any[]) => {
      this.produto = produtos.find(p => p.id === produtoId);
      console.log('Produto encontrado:', this.produto);
    });
  }
}