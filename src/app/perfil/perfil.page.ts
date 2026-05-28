import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {
  
  utilizador = {
    nome: 'Carla',
    email: 'carla@email.com',
    foto: 'https://ionicframework.com/docs/img/demos/avatar.svg'
  };

  constructor(
    private toastController: ToastController,
    private router: Router // <-- Injetamos o Router para conseguir navegar
  ) {}

  ngOnInit() {}

  async abrirOpcao(nomeOpcao: string) {
    if (nomeOpcao === 'Reservas Ativas') {
      // Se a opção for as Reservas, navega diretamente para a nova página!
      this.router.navigate(['/reservas']);
    } else {
      // Para as outras opções, mantém o feedback de construção
      const toast = await this.toastController.create({
        message: `A abrir ${nomeOpcao}... (Página em construção)`,
        duration: 2000,
        position: 'bottom',
        color: 'dark'
      });
      await toast.present();
    }
  }

  async terminarSessao() {
    const toast = await this.toastController.create({
      message: 'Sessão terminada com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle'
    });
    await toast.present();
  }
}