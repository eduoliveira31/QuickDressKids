import { Component, OnInit } from '@angular/core';
import { ReservasService, Reserva } from '../services/reservas';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  standalone: false 
})
export class ReservasPage implements OnInit {
  
  reservas: Reserva[] = [];
  reservaSelecionada: Reserva | null = null;
  modalAberto = false;

  constructor(private reservasService: ReservasService) {}
  
  ngOnInit() {}

  ionViewWillEnter() {
    this.reservas = this.reservasService.getReservas();
  }

  abrirQR(reserva: Reserva) {
    this.reservaSelecionada = reserva;
    this.modalAberto = true;
  }

  fecharQR() {
    this.modalAberto = false;
  }
}