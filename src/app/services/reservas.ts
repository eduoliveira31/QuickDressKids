import { Injectable } from '@angular/core';

export interface Reserva {
  numero: number;
  dataCriacao: string;
  dataValidade: string;
  total: number;
  qtdArtigos: number;
  loja: string;
  itens: any[]; 
  status?: 'ativa' | 'concluida'; // <-- Novo: Para sabermos onde mostrar o cartão
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private reservas: Reserva[] = [];

  constructor() {}

  adicionarReserva(reserva: Reserva) {
    reserva.status = 'ativa'; // Quando crias, vai logo para as "Ativas"
    this.reservas.unshift(reserva); 
  }

  getReservas() {
    return this.reservas;
  }

  // NOVA FUNÇÃO: Passar para o histórico
  marcarComoConcluida(numero: number) {
    const reserva = this.reservas.find(r => r.numero === numero);
    if (reserva) {
      reserva.status = 'concluida';
    }
  }

  // NOVA FUNÇÃO: Apagar a reserva
  cancelarReserva(numero: number) {
    this.reservas = this.reservas.filter(r => r.numero !== numero);
  }
}