import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // <-- Necessário para a confirmação de Cancelar
import { ReservasService, Reserva } from '../services/reservas';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  standalone: false 
})
export class ReservasPage implements OnInit {
  
  reservasAtivas: Reserva[] = [];
  historico: Reserva[] = [];
  
  abaAtiva: string = 'ativas'; // Diz qual é a aba aberta
  reservaSelecionada: Reserva | null = null;
  modalAberto = false;

  constructor(
    private reservasService: ReservasService,
    private alertController: AlertController // Injetado
  ) {}
  
  ngOnInit() {}

  ionViewWillEnter() {
    this.carregarListas();
  }

  carregarListas() {
    const todas = this.reservasService.getReservas();
    this.reservasAtivas = todas.filter(r => r.status === 'ativa');
    this.historico = todas.filter(r => r.status === 'concluida');
  }

  abrirQR(reserva: Reserva) {
    this.reservaSelecionada = reserva;
    this.modalAberto = true;
  }

  fecharQR() {
    this.modalAberto = false;
  }

  // LIGAÇÃO AO BOTÃO DE CONCLUIR
  marcarConcluida(reserva: Reserva) {
    this.reservasService.marcarComoConcluida(reserva.numero);
    this.carregarListas(); // Atualiza os números nas abas na hora!
    this.abaAtiva = 'historico'; // Salta automaticamente para a aba do histórico
  }

  // LIGAÇÃO AO BOTÃO DE CANCELAR
  async cancelarReserva(reserva: Reserva) {
    const alert = await this.alertController.create({
      header: 'Cancelar Reserva',
      message: 'Tens a certeza que queres cancelar esta reserva? Esta ação não pode ser desfeita.',
      buttons: [
        { text: 'Não', role: 'cancel' },
        { 
          text: 'Sim, Cancelar', 
          role: 'destructive',
          handler: () => {
            this.reservasService.cancelarReserva(reserva.numero);
            this.carregarListas();
          }
        }
      ]
    });
    await alert.present();
  }
}