import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  
  abaAtiva: string = 'ativas'; 
  reservaSelecionada: Reserva | null = null;
  modalAberto = false;

  constructor(
    private reservasService: ReservasService,
    private alertController: AlertController 
  ) {}
  
  ngOnInit() {}

  ionViewWillEnter() {
    this.carregarListas();
  }

  // AGORA USA AWAIT PARA ESPERAR PELO DISCO RÍGIDO
  async carregarListas() {
    const todas = await this.reservasService.getReservas();
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

  async marcarConcluida(reserva: Reserva) {
    this.reservasService.marcarComoConcluida(reserva.numero);
    await this.carregarListas(); // Espera que a lista atualize
    this.abaAtiva = 'historico';
  }

  async cancelarReserva(reserva: Reserva) {
    const alert = await this.alertController.create({
      header: 'Cancelar Reserva',
      message: 'Tens a certeza que queres cancelar esta reserva? Esta ação não pode ser desfeita.',
      buttons: [
        { text: 'Não', role: 'cancel' },
        { 
          text: 'Sim, Cancelar', 
          role: 'destructive',
          handler: async () => {
            this.reservasService.cancelarReserva(reserva.numero);
            await this.carregarListas(); // Espera que a lista atualize
          }
        }
      ]
    });
    await alert.present();
  }
}