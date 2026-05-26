import { Injectable } from '@angular/core';
import { CarrinhoService } from './carrinho';

export const PORTE_GRATIS_A_PARTIR_DE = 50;
export const VALOR_PORTE = 3.99;

@Injectable({
  providedIn: 'root'
})
export class CustosService {

  constructor(private carrinhoService: CarrinhoService) {}

  getSubtotal(): number {
    return this.carrinhoService
      .getItens()
      .reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  getPorte(): number {
    return this.getSubtotal() >= PORTE_GRATIS_A_PARTIR_DE ? 0 : VALOR_PORTE;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getPorte();
  }

  getFaltaParteGratis(): number {
    const falta = PORTE_GRATIS_A_PARTIR_DE - this.getSubtotal();
    return falta > 0 ? falta : 0;
  }
}