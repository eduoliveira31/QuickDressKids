import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular'; // Adicionado AlertController aqui
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
    private route: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController // Injetado aqui o controlador de alertas!
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // NOVA FUNÇÃO: Recuperar Palavra-passe
  async recuperarPalavraPasse() {
    const alert = await this.alertController.create({
      header: 'Recuperar Palavra-passe',
      message: 'Por favor, insere o teu email para enviarmos um link de recuperação.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'ex: carla@email.com'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: (data) => {
            if (data.email) {
              this.mostrarToast('Email enviado com sucesso para: ' + data.email, 'success');
            } else {
              this.mostrarToast('Por favor, insere um email válido.', 'warning');
              return false; // Impede que o popup feche se o campo estiver vazio
            }
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async efetuarLogin() {
    if (!this.identifier || !this.passwordLocal) {
      this.mostrarToast('Por favor, preenche todos os campos.', 'warning');
      return;
    }

    const sucesso = this.authService.login(this.identifier, this.passwordLocal);
    if (sucesso) {
      this.mostrarToast('Sessão iniciada com sucesso!', 'success');
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/tabs/home';
      this.router.navigateByUrl(redirect);
    } else {
      this.mostrarToast('Credenciais incorretas. Tenta novamente.', 'danger');
    }
  }

  async efetuarRegisto() {
    if (!this.registoUsername || !this.registoEmail || !this.registoPasswordLocal || !this.registoPrimeiroNome) {
      this.mostrarToast('Por favor, preenche todos os campos obrigatórios.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registoEmail)) {
      this.mostrarToast('Por favor, introduz um endereço de e-mail válido.', 'warning');
      return;
    }

    if (this.registoPasswordLocal.length < 8) {
      this.mostrarToast('A palavra-passe tem de conter pelo menos 8 caracteres.', 'warning');
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
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/tabs/home';
      this.router.navigateByUrl(redirect);
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