import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CarrinhoPageRoutingModule } from './carrinho-routing.module';
import { CarrinhoPage } from './carrinho.page';

// 1. Adicionamos o RouterModule aos imports lá em cima
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarrinhoPageRoutingModule,
    RouterModule // 2. E adicionamos aqui na lista de dependências
  ],
  declarations: [CarrinhoPage]
})
export class CarrinhoPageModule {}