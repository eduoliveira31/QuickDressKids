import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  tamanho: string;
  cor: string;
  quantidade: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {

  private itensSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  itens$ = this.itensSubject.asObservable();

  getItens(): ItemCarrinho[] {
    return this.itensSubject.getValue();
  }

  adicionarItem(item: Omit<ItemCarrinho, 'quantidade'>, quantidade: number = 1): void {
    const itens = this.getItens();
    const existente = itens.find(
      i => i.id === item.id && i.tamanho === item.tamanho && i.cor === item.cor
    );
    if (existente) {
      existente.quantidade += quantidade;
      this.itensSubject.next([...itens]);
    } else {
      this.itensSubject.next([...itens, { ...item, quantidade }]);
    }
  }

  removerItem(index: number): void {
    const itens = this.getItens();
    itens.splice(index, 1);
    this.itensSubject.next([...itens]);
  }

  alterarQuantidade(index: number, quantidade: number): void {
    if (quantidade <= 0) {
      this.removerItem(index);
      return;
    }
    const itens = this.getItens();
    itens[index].quantidade = quantidade;
    this.itensSubject.next([...itens]);
  }

  getSubtotal(): number {
    return this.getItens().reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  getPorte(): number {
    const subtotal = this.getSubtotal();
    return subtotal >= 50 ? 0 : 3.99;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getPorte();
  }

  getTotalItens(): number {
    return this.getItens().reduce((total, item) => total + item.quantidade, 0);
  }

  limparCarrinho(): void {
    this.itensSubject.next([]);
  }
}