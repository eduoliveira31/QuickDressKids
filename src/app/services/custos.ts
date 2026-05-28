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
   * @returns Subtotal em euros (sem custos de envio)
   */
  getSubtotal(): number {
    return this.carrinhoService
      .getItens()
      .reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  /**
   * Determina o custo de envio com base no subtotal atual.
   *
   * Regra:
   * - Subtotal >= PORTE_GRATIS_A_PARTIR_DE → envio gratuito (0€)
   * - Subtotal < PORTE_GRATIS_A_PARTIR_DE  → VALOR_PORTE (3,99€)
   *
   * @returns Custo de envio em euros
   */
  getPorte(): number {
    return this.getSubtotal() >= PORTE_GRATIS_A_PARTIR_DE ? 0 : VALOR_PORTE;
  }

  /**
   * Calcula o total final da compra (subtotal + custo de envio).
   * @returns Total em euros
   */
  getTotal(): number {
    return this.getSubtotal() + this.getPorte();
  }

  /**
   * Calcula o valor em falta para o utilizador atingir o porte gratuito.
   * Retorna 0 se o porte já for gratuito.
   *
   * @returns Valor em falta em euros, ou 0 se já atingiu o limiar
   */
  getFaltaParteGratis(): number {
    const falta = PORTE_GRATIS_A_PARTIR_DE - this.getSubtotal();
    return falta > 0 ? falta : 0;
  }
}