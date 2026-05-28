import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Interface que representa um artigo dentro do carrinho de compras.
 * Cada item corresponde a um produto com uma combinação específica de tamanho e cor.
 */
export interface ItemCarrinho {
  /** Identificador único do produto */
  id: number;

  /** Nome do produto */
  nome: string;

  /** Preço unitário do produto em euros */
  preco: number;

  /** Caminho ou URL da imagem do produto */
  imagem: string;

  /** Tamanho selecionado pelo utilizador (ex: 'S', 'M', 'L') */
  tamanho: string;

  /** Cor selecionada pelo utilizador (ex: 'Azul', 'Rosa') */
  cor: string;

  /** Número de unidades deste item no carrinho */
  quantidade: number;
}

/**
 * Service responsável pela gestão do estado do carrinho de compras.
 *
 * Utiliza um BehaviorSubject para manter o estado reativo da lista de itens,
 * permitindo que qualquer componente subscrito receba atualizações automáticas.
 */
@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {

  /**
   * Subject interno que guarda e emite a lista atual de itens no carrinho.
   * É privado para garantir que só este service pode alterar o estado.
   */
  private itensSubject = new BehaviorSubject<ItemCarrinho[]>([]);

  /**
   * Observable público da lista de itens.
   * Os componentes devem subscrever este Observable para reagir a mudanças.
   */
  itens$ = this.itensSubject.asObservable();

  // ─── LEITURA ────────────────────────────────────────────────────────────────

  /**
   * Retorna o valor atual da lista de itens (snapshot síncrono).
   * @returns Array de ItemCarrinho presentes no carrinho
   */
  getItens(): ItemCarrinho[] {
    return this.itensSubject.getValue();
  }

  /**
   * Calcula o número total de artigos no carrinho (soma de todas as quantidades).
   * @returns Número total de unidades no carrinho
   */
  getTotalItens(): number {
    return this.getItens().reduce((total, item) => total + item.quantidade, 0);
  }

  // ─── MODIFICAÇÃO ────────────────────────────────────────────────────────────

  /**
   * Adiciona um produto ao carrinho.
   *
   * Se já existir um item com o mesmo id, tamanho e cor, incrementa a quantidade.
   * Caso contrário, cria um novo item com a quantidade indicada.
   *
   * @param item - Dados do produto a adicionar (sem o campo quantidade)
   * @param quantidade - Número de unidades a adicionar (por defeito: 1)
   */
  adicionarItem(item: Omit<ItemCarrinho, 'quantidade'>, quantidade: number = 1): void {
    const itens = this.getItens();

    // Verifica se já existe o mesmo produto com o mesmo tamanho e cor
    const existente = itens.find(
      i => i.id === item.id && i.tamanho === item.tamanho && i.cor === item.cor
    );

    if (existente) {
      // Produto já existe — apenas incrementa a quantidade
      existente.quantidade += quantidade;
      this.itensSubject.next([...itens]);
    } else {
      // Produto novo — adiciona à lista com a quantidade indicada
      this.itensSubject.next([...itens, { ...item, quantidade }]);
    }
  }

  /**
   * Remove um item do carrinho pelo seu índice na lista.
   * @param index - Posição do item a remover
   */
  removerItem(index: number): void {
    const itens = this.getItens();
    itens.splice(index, 1);
    this.itensSubject.next([...itens]);
  }

  /**
   * Atualiza a quantidade de um item no carrinho.
   * Se a nova quantidade for 0 ou negativa, o item é removido automaticamente.
   *
   * @param index - Posição do item a atualizar
   * @param quantidade - Nova quantidade desejada
   */
  alterarQuantidade(index: number, quantidade: number): void {
    if (quantidade <= 0) {
      // Quantidade inválida — remove o item do carrinho
      this.removerItem(index);
      return;
    }

    const itens = this.getItens();
    itens[index].quantidade = quantidade;
    this.itensSubject.next([...itens]);
  }

  /**
   * Esvazia completamente o carrinho, removendo todos os itens.
   */
  limparCarrinho(): void {
    this.itensSubject.next([]);
  }
}