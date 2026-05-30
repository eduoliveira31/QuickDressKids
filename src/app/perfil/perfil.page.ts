import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {
  
  currentUser: Usuario | null = null;

  // Estados dos toggles
  notificacoesAtivas: boolean = true;
  localizacaoAtiva: boolean = false;

  // Modais
  modalAjudaAberto: boolean = false;
  modalPasswordAberto: boolean = false;

  // Formulário Centro de Ajuda
  ajudaOpcao: string = 'reserva';
  ajudaDescricao: string = '';
  ajudaEmail: string = '';

  // Formulário Alteração de Password
  pwAnterior: string = '';
  pwNova: string = '';
  pwConfirmar: string = '';

  constructor(
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.ajudaEmail = user.email;
      } else {
        this.ajudaEmail = '';
      }
    });

    if (typeof window !== 'undefined') {
      const locationPermitted = localStorage.getItem('quickdresskids_location_permitted');
      this.localizacaoAtiva = locationPermitted === 'true';
    }
  }

  async abrirOpcao(nomeOpcao: string) {
    if (!this.currentUser) {
      this.mostrarToast('Inicia sessão para aceder a esta funcionalidade.', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    if (nomeOpcao === 'Reservas Ativas') {
      this.router.navigate(['/reservas']);
    } else {
      this.mostrarToast(`A abrir ${nomeOpcao}... (Página em construção)`, 'dark');
    }
  }

  aoMudarLocalizacao(event: any) {
    const ativa = event.detail.checked;
    if (ativa) {
      if (typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            localStorage.setItem('quickdresskids_location_permitted', 'true');
            this.mostrarToast('Permissão de localização concedida com sucesso!', 'success');
          },
          (error) => {
            localStorage.setItem('quickdresskids_location_permitted', 'false');
            this.localizacaoAtiva = false;
            this.mostrarToast('Permissão de localização recusada pelo utilizador ou dispositivo.', 'warning');
          }
        );
      } else {
        this.localizacaoAtiva = false;
        this.mostrarToast('A geolocalização não é suportada por este dispositivo.', 'danger');
      }
    } else {
      localStorage.setItem('quickdresskids_location_permitted', 'false');
      this.mostrarToast('Localização desativada.', 'medium');
    }
  }

  // ─── CENTRO DE AJUDA ─────────────────────────────────────────────────────────
  abrirModalAjuda() {
    if (this.currentUser) {
      this.ajudaEmail = this.currentUser.email;
    }
    this.modalAjudaAberto = true;
  }

  fecharModalAjuda() {
    this.modalAjudaAberto = false;
    this.ajudaDescricao = '';
  }

  async submeterAjuda() {
    if (!this.ajudaEmail || !this.ajudaDescricao) {
      this.mostrarToast('Por favor, preenche todos os campos obrigatórios.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.ajudaEmail)) {
      this.mostrarToast('Por favor, introduz um endereço de e-mail válido.', 'warning');
      return;
    }

    // Simula o envio
    this.mostrarToast('Mensagem enviada com sucesso! Iremos responder em breve.', 'success');
    this.fecharModalAjuda();
  }

  // ─── ALTERAR PASSWORD ────────────────────────────────────────────────────────
  abrirModalPassword() {
    this.modalPasswordAberto = true;
  }

  fecharModalPassword() {
    this.modalPasswordAberto = false;
    this.pwAnterior = '';
    this.pwNova = '';
    this.pwConfirmar = '';
  }

  async submeterAlterarPassword() {
    if (!this.pwAnterior || !this.pwNova || !this.pwConfirmar) {
      this.mostrarToast('Preenche todos os campos da palavra-passe.', 'warning');
      return;
    }

    if (this.pwNova !== this.pwConfirmar) {
      this.mostrarToast('A nova palavra-passe e a confirmação não coincidem.', 'danger');
      return;
    }

    if (this.pwNova.length < 8) {
      this.mostrarToast('A nova palavra-passe deve ter pelo menos 8 caracteres.', 'warning');
      return;
    }

    if (this.currentUser) {
      const sucesso = this.authService.alterarPassword(
        this.currentUser.username,
        this.pwAnterior,
        this.pwNova
      );

      if (sucesso) {
        this.mostrarToast('Palavra-passe alterada com sucesso!', 'success');
        this.fecharModalPassword();
      } else {
        this.mostrarToast('A palavra-passe anterior está incorreta.', 'danger');
      }
    }
  }

  // ─── LOGOUT ──────────────────────────────────────────────────────────────────
  async terminarSessao() {
    this.authService.logout();
    const toast = await this.toastController.create({
      message: 'Sessão terminada com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle'
    });
    await toast.present();
    this.router.navigate(['/tabs/home']);
  }

  private async mostrarToast(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'bottom',
      color: cor
    });
    await toast.present();
  }
}