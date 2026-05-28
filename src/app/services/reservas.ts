import { Injectable } from '@angular/core';

// Definimos como é uma Reserva
export interface Reserva {
  numero: number;
  data: string;
  total: number;
  qtdArtigos: number;
  loja: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private reservas: Reserva[] = []; // A nossa lista em memória

  constructor() {}

  adicionarReserva(reserva: Reserva) {
    // unshift coloca a reserva mais recente no topo da lista!
    this.reservas.unshift(reserva); 
  }

  getReservas() {
    return this.reservas;
  }
}