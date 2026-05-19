import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Catalogo } from '../services/catalogo';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class CatalogoPage implements OnInit {

  produtos: any[] = [];

  constructor(private catalogoService: Catalogo) {}

  ngOnInit() {
    this.catalogoService.getProdutos().subscribe(data => {
      this.produtos = data;
      console.log('Produtos carregados:', this.produtos);
    });
  }
}