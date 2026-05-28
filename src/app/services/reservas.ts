import { Injectable } from '@angular/core';

export interface Reserva {
  numero: number;
  dataCriacao: string;
  dataValidade: string;
  total: number;
  qtdArtigos: number;
  loja: string;
  itens: any[]; // Guarda a foto, cor e tamanho do produto
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private reservas: Reserva[] = [];

  constructor() {}

  adicionarReserva(reserva: Reserva) {
    this.reservas.unshift(reserva); 
  }

  getReservas() {
    return this.reservas;
  }
}