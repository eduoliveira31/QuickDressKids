import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Chave usada para guardar e ler a lista de favoritos no Ionic Storage.
 */
const STORAGE_KEY = 'lista_favoritos';

/**
 * Service responsável pela gestão da lista de produtos favoritos do utilizador.
 *
 * Persiste os dados localmente através do Ionic Storage, garantindo que
 * os favoritos se mantêm mesmo após fechar a aplicação.
 */
@Injectable({
  providedIn: 'root'
})
export class Favoritos {

  /**
   * Instância do Storage inicializada de forma assíncrona.
   * Fica null até o método init() ser concluído.
   */
  private _storage: Storage | null = null;

  /**
   * @param storage - Serviço Ionic Storage injetado para persistência local
   */
  constructor(private storage: Storage) {
    // Inicializa o storage assim que o service é criado
    this.init();
  }

  // ─── INICIALIZAÇÃO ──────────────────────────────────────────────────────────

  /**
   * Inicializa a base de dados local do Ionic Storage.
   * Deve ser chamado antes de qualquer operação de leitura ou escrita.
   */
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // ─── LEITURA ────────────────────────────────────────────────────────────────

  /**
   * Lê e devolve a lista de IDs de produtos favoritos guardados.
   * Se ainda não houver favoritos guardados, devolve uma lista vazia.
   *
   * @returns Promise com array de IDs numéricos dos produtos favoritos
   */
  async getFavoritos(): Promise<number[]> {
    const favoritos = await this._storage?.get(STORAGE_KEY);
    return favoritos || [];
  }

  /**
   * Verifica se um produto específico está marcado como favorito.
   *
   * @param produtoId - ID do produto a verificar
   * @returns Promise com true se for favorito, false caso contrário
   */
  async isFavorito(produtoId: number): Promise<boolean> {
    const favoritos = await this.getFavoritos();
    return favoritos.includes(produtoId);
  }

  // ─── MODIFICAÇÃO ────────────────────────────────────────────────────────────

  /**
   * Alterna o estado de favorito de um produto (adiciona ou remove).
   *
   * - Se o produto já for favorito → remove da lista
   * - Se o produto não for favorito → adiciona à lista
   *
   * Após a alteração, guarda a lista atualizada no Storage.
   *
   * @param produtoId - ID do produto a adicionar ou remover dos favoritos
   * @returns Promise com a lista atualizada de IDs favoritos
   */
  async toggleFavorito(produtoId: number) {
    let favoritos = await this.getFavoritos();

    if (favoritos.includes(produtoId)) {
      // Produto já é favorito — remove da lista
      favoritos = favoritos.filter(id => id !== produtoId);
    } else {
      // Produto não é favorito — adiciona à lista
      favoritos.push(produtoId);
    }

    // Persiste a lista atualizada no Storage
    await this._storage?.set(STORAGE_KEY, favoritos);
    return favoritos;
  }
}