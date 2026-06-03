import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // <-- Importar o Storage
import { AuthService } from './auth.service'; // <-- Importar AuthService para separar as reservas por conta

export interface Reserva {
  numero: number;
  dataCriacao: string;
  dataValidade: string;
  total: number;
  qtdArtigos: number;
  loja: string;
  itens: any[]; 
  status?: 'ativa' | 'concluida';
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private storage = inject(Storage);
  private authService = inject(AuthService);

  private _storage: Storage | null = null;
  private storagePromise: Promise<Storage> | null = null;
  private readonly BASE_CHAVE_STORAGE = 'minhas_reservas';

  constructor() {
    this.iniciarStorage();
  }

  // Prepara o disco rígido de forma segura
  async iniciarStorage(): Promise<Storage> {
    if (this.storagePromise) {
      return this.storagePromise;
    }

    this.storagePromise = (async () => {
      const storage = await this.storage.create();
      this._storage = storage;
      return storage;
    })();

    return this.storagePromise;
  }

  // Gera a chave de armazenamento com base no utilizador atual
  private getReservasKey(): string {
    const user = this.authService.getCurrentUser();
    const username = user ? user.username : 'anonimo';
    return `${this.BASE_CHAVE_STORAGE}_${username}`;
  }

  // Realiza a migração dinâmica se houver reservas na chave antiga global ou anónima
  private async migrarDadosSeNecessario(storage: Storage, username: string) {
    if (!username || username === 'anonimo') return;

    try {
      const chaveUsuario = `${this.BASE_CHAVE_STORAGE}_${username}`;
      let reservasUsuario: Reserva[] = [];
      let carregado = false;
      let alterado = false;

      // 1. Migração da chave global antiga 'minhas_reservas'
      const reservasGlobais = await storage.get(this.BASE_CHAVE_STORAGE);
      if (reservasGlobais && Array.isArray(reservasGlobais) && reservasGlobais.length > 0) {
        reservasUsuario = await storage.get(chaveUsuario) || [];
        carregado = true;
        for (const res of reservasGlobais) {
          if (!reservasUsuario.some((r: any) => r.numero === res.numero)) {
            reservasUsuario.unshift(res);
          }
        }
        await storage.remove(this.BASE_CHAVE_STORAGE);
        alterado = true;
        console.log('Migração concluída de "minhas_reservas" para:', chaveUsuario);
      }

      // 2. Migração da chave 'minhas_reservas_anonimo' (caso existam de uma sessão não autenticada)
      const chaveAnonimo = `${this.BASE_CHAVE_STORAGE}_anonimo`;
      const reservasAnonimo = await storage.get(chaveAnonimo);
      if (reservasAnonimo && Array.isArray(reservasAnonimo) && reservasAnonimo.length > 0) {
        if (!carregado) {
          reservasUsuario = await storage.get(chaveUsuario) || [];
          carregado = true;
        }
        for (const res of reservasAnonimo) {
          if (!reservasUsuario.some((r: any) => r.numero === res.numero)) {
            reservasUsuario.unshift(res);
          }
        }
        await storage.remove(chaveAnonimo);
        alterado = true;
        console.log('Migração concluída de "minhas_reservas_anonimo" para:', chaveUsuario);
      }

      if (alterado) {
        await storage.set(chaveUsuario, reservasUsuario);
      }
    } catch (e) {
      console.error('Erro na migração dinâmica:', e);
    }
  }

  async adicionarReserva(reserva: Reserva) {
    reserva.status = 'ativa';
    const storage = await this.iniciarStorage();
    const user = this.authService.getCurrentUser();
    const username = user ? user.username : 'anonimo';

    await this.migrarDadosSeNecessario(storage, username);

    const chave = `${this.BASE_CHAVE_STORAGE}_${username}`;
    const reservas: Reserva[] = (await storage.get(chave)) || [];
    // Evita duplicados
    if (!reservas.some(r => r.numero === reserva.numero)) {
      reservas.unshift(reserva); 
    }
    await storage.set(chave, reservas);
  }

  // Usamos async/Promise porque o disco pode demorar um bocadinho a responder
  async getReservas(): Promise<Reserva[]> {
    const storage = await this.iniciarStorage();
    const user = this.authService.getCurrentUser();
    const username = user ? user.username : 'anonimo';

    await this.migrarDadosSeNecessario(storage, username);

    const chave = `${this.BASE_CHAVE_STORAGE}_${username}`;
    return (await storage.get(chave)) || [];
  }

  async marcarComoConcluida(numero: number) {
    const storage = await this.iniciarStorage();
    const user = this.authService.getCurrentUser();
    const username = user ? user.username : 'anonimo';

    await this.migrarDadosSeNecessario(storage, username);

    const chave = `${this.BASE_CHAVE_STORAGE}_${username}`;
    const reservas: Reserva[] = (await storage.get(chave)) || [];
    const reserva = reservas.find(r => r.numero === numero);
    if (reserva) {
      reserva.status = 'concluida';
      await storage.set(chave, reservas);
    }
  }

  async cancelarReserva(numero: number) {
    const storage = await this.iniciarStorage();
    const user = this.authService.getCurrentUser();
    const username = user ? user.username : 'anonimo';

    await this.migrarDadosSeNecessario(storage, username);

    const chave = `${this.BASE_CHAVE_STORAGE}_${username}`;
    let reservas: Reserva[] = (await storage.get(chave)) || [];
    reservas = reservas.filter(r => r.numero !== numero);
    await storage.set(chave, reservas);
  }
}