import { Injectable } from '@angular/core';
import { CarrinhoService } from './carrinho';

/**
 * Valor mínimo do subtotal (em euros) para que o porte seja gratuito.
 * Quando o subtotal iguala ou ultrapassa este valor, o custo de envio é 0€.
 */
export const PORTE_GRATIS_A_PARTIR_DE = 50;

/**
 * Custo fixo de envio (em euros) aplicado quando o subtotal
 * não atinge o limiar de porte gratuito.
 */
export const VALOR_PORTE = 3.99;

/**
 * Service responsável por todos os cálculos de custos da compra.
 *
 * Centraliza a lógica de:
 * - Subtotal (soma dos artigos no carrinho)
 * - Custo de envio (gratuito acima de PORTE_GRATIS_A_PARTIR_DE)
 * - Total final (subtotal + envio)
 * - Valor em falta para atingir porte gratuito
 */
@Injectable({
  providedIn: 'root'
})
export class CustosService {

  /**
   * @param carrinhoService - Service do carrinho, usado para aceder aos itens
   */
  constructor(private carrinhoService: CarrinhoService) {}

  // ─── CÁLCULOS ───────────────────────────────────────────────────────────────

  /**
   * Calcula o subtotal da compra.
   * Soma o produto do preço pela quantidade de cada item no carrinho.
   *
   * @returns Subtotal em euros (sem custos de envio e sem descontos)
   */
  getSubtotal(): number {
    return this.carrinhoService
      .getItens()
      .reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  /**
   * Calcula o valor do desconto da campanha "Leve 3, Pague 2" em artigos de bebé.
   * Por cada conjunto de 3 artigos de bebé, o mais barato é oferecido (descontado).
   */
  getDescontoCampanha(): number {
    const babyItems = this.carrinhoService.getItens().filter(item => item.categoria === 'bebé' || item.categoria === 'bebe');
    const prices: number[] = [];
    
    // Desdobra os preços conforme a quantidade de cada item
    for (const item of babyItems) {
      for (let i = 0; i < item.quantidade; i++) {
        prices.push(item.preco);
      }
    }
    
    if (prices.length < 3) return 0;

    // Ordena os preços por ordem crescente
    prices.sort((a, b) => a - b);
    
    // Ganha 1 artigo grátis por cada grupo de 3
    const numFree = Math.floor(prices.length / 3);
    
    // Soma o preço dos N artigos mais baratos
    let discount = 0;
    for (let i = 0; i < numFree; i++) {
      discount += prices[i];
    }
    return discount;
  }

  /**
   * Calcula o subtotal final após deduzir o desconto de campanha.
   */
  getFinalSubtotal(): number {
    return Math.max(0, this.getSubtotal() - this.getDescontoCampanha());
  }

  /**
   * Determina o custo de envio com base no subtotal líquido (após descontos).
   *
   * Regra:
   * - Subtotal Líquido >= PORTE_GRATIS_A_PARTIR_DE → envio gratuito (0€)
   * - Subtotal Líquido < PORTE_GRATIS_A_PARTIR_DE  → VALOR_PORTE (3,99€)
   *
   * @returns Custo de envio em euros
   */
  getPorte(): number {
    return this.getFinalSubtotal() >= PORTE_GRATIS_A_PARTIR_DE ? 0 : VALOR_PORTE;
  }

  /**
   * Calcula o total final da compra (subtotal líquido + custo de envio).
   * @returns Total em euros
   */
  getTotal(): number {
    return this.getFinalSubtotal() + this.getPorte();
  }

  /**
   * Calcula o valor em falta para o utilizador atingir o porte gratuito.
   * Retorna 0 se o porte já for gratuito.
   *
   * @returns Valor em falta em euros, ou 0 se já atingiu o limiar
   */
  getFaltaParteGratis(): number {
    const falta = PORTE_GRATIS_A_PARTIR_DE - this.getFinalSubtotal();
    return falta > 0 ? falta : 0;
  }
}