import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Catalogo } from '../services/catalogo'; 

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule, RouterModule]
})
export class CatalogoPage implements OnInit {
  produtosOriginais: any[] = []; // Guarda TODOS os produtos
  produtosFiltrados: any[] = []; // Guarda apenas os que estão a ser mostrados

  constructor(private catalogoService: Catalogo) {}

  ngOnInit() {
    this.catalogoService.getProdutos().subscribe((data: any) => {
      this.produtosOriginais = data;
      this.produtosFiltrados = data; // Inicialmente, mostra todos
    });
  }

  // A função que faz a magia do filtro acontecer
  filtrarCategoria(event: any) {
    const categoriaSelecionada = event.detail.value;

    if (categoriaSelecionada === 'todos') {
      // Se escolheu "Todos", volta a meter a lista completa
      this.produtosFiltrados = this.produtosOriginais;
    } else {
      // Caso contrário, procura só os que têm a categoria escolhida
      this.produtosFiltrados = this.produtosOriginais.filter(
        produto => produto.categoria.toLowerCase() === categoriaSelecionada.toLowerCase()
      );
    }
  }
}