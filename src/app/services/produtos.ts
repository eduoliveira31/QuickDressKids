import { Injectable } from '@angular/core';

/**
 * Service auxiliar de produtos.
 *
 * Serve como ponto de extensão para lógica adicional relacionada com produtos
 * que não pertença ao CatalogoService (ex: cálculos de desconto, validações).
 *
 * A leitura dos dados do catálogo é feita pelo CatalogoService (catalogo.ts).
 */
@Injectable({
  providedIn: 'root',
})
export class Produtos {

}