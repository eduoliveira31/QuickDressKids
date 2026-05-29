import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  
  // Modos: 'login' ou 'registo'
  modo: 'login' | 'registo' = 'login';

  // Dados do formulário
  identifier: string = '';
  passwordLocal: string = '';

  // Dados do registo
  registoUsername: string = '';
  registoEmail: string = '';
  registoPasswordLocal: string = '';
  registoPrimeiroNome: string = '';
  registoUltimoNome: string = '';

  currentUser: Usuario | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  async efetuarLogin() {
    if (!this.identifier || !this.passwordLocal) {
      this.mostrarToast('Por favor, preenche todos os campos.', 'warning');
      return;
    }

    const sucesso = this.authService.login(this.identifier, this.passwordLocal);
    if (sucesso) {
      this.mostrarToast('Sessão iniciada com sucesso!', 'success');
      this.router.navigate(['/tabs/home']);
    } else {
      this.mostrarToast('Credenciais incorretas. Tenta novamente.', 'danger');
    }
  }

  async efetuarRegisto() {
    if (!this.registoUsername || !this.registoEmail || !this.registoPasswordLocal || !this.registoPrimeiroNome) {
      this.mostrarToast('Por favor, preenche todos os campos obrigatórios.', 'warning');
      return;
    }

    const novoUser: Usuario = {
      username: this.registoUsername,
      email: this.registoEmail,
      password: this.registoPasswordLocal,
      primeiroNome: this.registoPrimeiroNome,
      ultimoNome: this.registoUltimoNome
    };

    const sucesso = this.authService.register(novoUser);
    if (sucesso) {
      this.mostrarToast('Conta criada e sessão iniciada com sucesso!', 'success');
      this.router.navigate(['/tabs/home']);
    } else {
      this.mostrarToast('O utilizador ou email já existe.', 'danger');
    }
  }

  logout() {
    this.authService.logout();
    this.mostrarToast('Sessão terminada.', 'medium');
  }

  alterarModo(novoModo: 'login' | 'registo') {
    this.modo = novoModo;
  }

  private async mostrarToast(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2500,
      color: cor,
      position: 'bottom'
    });
    await toast.present();
  }
}
