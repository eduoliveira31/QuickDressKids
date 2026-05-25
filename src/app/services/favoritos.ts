import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class Favoritos {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa a base de dados local
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Lê a lista de favoritos (se não houver nada, devolve uma lista vazia)
  async getFavoritos(): Promise<number[]> {
    const favoritos = await this._storage?.get('lista_favoritos');
    return favoritos || [];
  }

  // Verifica se um produto específico já é favorito
  async isFavorito(produtoId: number): Promise<boolean> {
    const favoritos = await this.getFavoritos();
    return favoritos.includes(produtoId);
  }

  // Adiciona se não for favorito, ou remove se já for (o tal botão "Ligar/Desligar")
  async toggleFavorito(produtoId: number) {
    let favoritos = await this.getFavoritos();
    
    if (favoritos.includes(produtoId)) {
      // Já é favorito? Então remove.
      favoritos = favoritos.filter(id => id !== produtoId);
    } else {
      // Não é favorito? Então adiciona.
      favoritos.push(produtoId);
    }
    
    // Guarda a nova lista atualizada
    await this._storage?.set('lista_favoritos', favoritos);
    return favoritos;
  }
}