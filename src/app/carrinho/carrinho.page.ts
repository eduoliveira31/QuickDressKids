import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService, ItemCarrinho } from '../services/carrinho';
import { CustosService, PORTE_GRATIS_A_PARTIR_DE } from '../services/custos';

/**
 * Página do Carrinho de Compras.
 *
 * Apresenta os artigos que o utilizador adicionou ao carrinho,
 * permite alterar quantidades, remover artigos e mostra o resumo
 * de custos com simulação de porte de envio.
 */
@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarrinhoPage implements OnInit {

  /**
   * Lista reativa de artigos presentes no carrinho.
   * Atualizada automaticamente quando o CarrinhoService emite mudanças.
   */
  itens: ItemCarrinho[] = [];

  /**
   * Valor a partir do qual o porte de envio é gratuito (50€).
   * Usado no template para calcular a barra de progresso de envio gratuito.
   * É readonly porque nunca deve ser alterado pela página.
   */
  readonly limitePorteGratis = PORTE_GRATIS_A_PARTIR_DE;

  /**
   * @param carrinhoService - Service que gere o estado do carrinho
   * @param custosService   - Service que calcula subtotal, porte e total
   */
  constructor(
    private carrinhoService: CarrinhoService,
    private custosService: CustosService
  ) {}

  // ─── CICLO DE VIDA ──────────────────────────────────────────────────────────

  /**
   * Subscreve o Observable do carrinho para manter a lista local sincronizada.
   * Chamado automaticamente pelo Angular após a criação do componente.
   */
  ngOnInit() {
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens;
    });
  }

  // ─── AÇÕES ──────────────────────────────────────────────────────────────────

  /**
   * Remove um artigo do carrinho pelo seu índice na lista.
   * @param index - Posição do artigo a remover
   */
  removerItem(index: number) {
    this.carrinhoService.removerItem(index);
  }

  /**
   * Altera a quantidade de um artigo somando um delta (+1 ou -1).
   * Se a nova quantidade chegar a 0, o CarrinhoService remove o artigo.
   *
   * @param index - Posição do artigo a alterar
   * @param delta - Valor a somar à quantidade atual (+1 incrementa, -1 decrementa)
   */
  alterarQuantidade(index: number, delta: number) {
    const novaQtd = this.itens[index].quantidade + delta;
    this.carrinhoService.alterarQuantidade(index, novaQtd);
  }

  /**
   * Esvazia completamente o carrinho, removendo todos os artigos.
   */
  limparCarrinho() {
    this.carrinhoService.limparCarrinho();
  }

  // ─── GETTERS DE CUSTOS ──────────────────────────────────────────────────────

  /**
   * Subtotal da compra: soma de (preço × quantidade) de todos os artigos.
   * @returns Subtotal em euros
   */
  get subtotal(): number {
    return this.custosService.getSubtotal();
  }

  /**
   * Custo de envio: 0€ se o subtotal atingir o limiar, caso contrário 3,99€.
   * @returns Custo de envio em euros
   */
  get porte(): number {
    return this.custosService.getPorte();
  }

  /**
   * Total final da compra (subtotal + porte de envio).
   * @returns Total em euros
   */
  get total(): number {
    return this.custosService.getTotal();
  }

  /**
   * Valor em falta para atingir o limiar de porte gratuito.
   * Retorna 0 se o envio já for gratuito.
   * @returns Valor em falta em euros
   */
  get faltaParteGratis(): number {
    return this.custosService.getFaltaParteGratis();
  }
}