import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProdutoDetalhePageRoutingModule } from './produto-detalhe-routing.module';

// O Angular precisa de importar a página em vez de a declarar
import { ProdutoDetalhePage } from './produto-detalhe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutoDetalhePageRoutingModule,
    ProdutoDetalhePage 
  ]
})
export class ProdutoDetalhePageModule {}