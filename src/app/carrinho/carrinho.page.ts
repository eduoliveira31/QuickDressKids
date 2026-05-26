import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService, ItemCarrinho } from '../services/carrinho';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarrinhoPage implements OnInit {

  itens: ItemCarrinho[] = [];

  constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit() {
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens;
    });
  }

  removerItem(index: number) {
    this.carrinhoService.removerItem(index);
  }

  alterarQuantidade(index: number, delta: number) {
    const novaQtd = this.itens[index].quantidade + delta;
    this.carrinhoService.alterarQuantidade(index, novaQtd);
  }

  get subtotal(): number {
    return this.carrinhoService.getSubtotal();
  }

  get porte(): number {
    return this.carrinhoService.getPorte();
  }

  get total(): number {
    return this.carrinhoService.getTotal();
  }

  limparCarrinho() {
    this.carrinhoService.limparCarrinho();
  }
}