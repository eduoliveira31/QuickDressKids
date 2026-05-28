import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // <-- Importar o Storage

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
  private reservas: Reserva[] = [];
  private _storage: Storage | null = null;
  private readonly CHAVE_STORAGE = 'minhas_reservas';

  constructor(private storage: Storage) {
    this.iniciarStorage();
  }

  // Prepara o disco rígido e carrega o histórico
  async iniciarStorage() {
    const storage = await this.storage.create();
    this._storage = storage;
    
    // Tenta ir buscar as reservas que lá estavam de antes
    const dadosGuardados = await this._storage.get(this.CHAVE_STORAGE);
    if (dadosGuardados) {
      this.reservas = dadosGuardados;
    }
  }

  // Função para gravar no disco sempre que há novidades
  private guardarNoDisco() {
    if (this._storage) {
      this._storage.set(this.CHAVE_STORAGE, this.reservas);
    }
  }

  adicionarReserva(reserva: Reserva) {
    reserva.status = 'ativa';
    this.reservas.unshift(reserva); 
    this.guardarNoDisco(); // <-- Grava nova reserva
  }

  // Usamos async/Promise porque o disco pode demorar um bocadinho a responder
  async getReservas(): Promise<Reserva[]> {
    if (!this._storage) {
      await this.iniciarStorage();
    }
    return this.reservas;
  }

  marcarComoConcluida(numero: number) {
    const reserva = this.reservas.find(r => r.numero === numero);
    if (reserva) {
      reserva.status = 'concluida';
      this.guardarNoDisco(); // <-- Atualiza no disco
    }
  }

  cancelarReserva(numero: number) {
    this.reservas = this.reservas.filter(r => r.numero !== numero);
    this.guardarNoDisco(); // <-- Atualiza no disco (apaga)
  }
}