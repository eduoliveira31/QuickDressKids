import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService, ItemCarrinho } from '../services/carrinho';
import { CustosService, PORTE_GRATIS_A_PARTIR_DE } from '../services/custos';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarrinhoPage implements OnInit {

  itens: ItemCarrinho[] = [];
  readonly limitePorteGratis = PORTE_GRATIS_A_PARTIR_DE;

  constructor(
    private carrinhoService: CarrinhoService,
    private custosService: CustosService
  ) {}

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

  limparCarrinho() {
    this.carrinhoService.limparCarrinho();
  }

  get subtotal(): number {
    return this.custosService.getSubtotal();
  }

  get porte(): number {
    return this.custosService.getPorte();
  }

  get total(): number {
    return this.custosService.getTotal();
  }

  get faltaParteGratis(): number {
    return this.custosService.getFaltaParteGratis();
  }
}