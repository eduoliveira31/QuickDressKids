import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProdutoDetalhePageRoutingModule } from './produto-detalhe-routing.module';
import { ProdutoDetalhePage } from './produto-detalhe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutoDetalhePageRoutingModule
  ],
  declarations: [ProdutoDetalhePage] 
})
export class ProdutoDetalhePageModule {}