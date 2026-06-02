import { Component, OnInit } from '@angular/core';
import { AlertController, IonicSafeString, ToastController } from '@ionic/angular';
import { CarrinhoService, ItemCarrinho } from '../services/carrinho';
import { CustosService, PORTE_GRATIS_A_PARTIR_DE } from '../services/custos';
import { Router } from '@angular/router';
import { ReservasService } from '../services/reservas';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: false
})
export class CarrinhoPage implements OnInit {

  itens: ItemCarrinho[] = [];
  readonly limitePorteGratis = PORTE_GRATIS_A_PARTIR_DE;

  lojaSelecionada: string = '';

  constructor(
    private carrinhoService: CarrinhoService,
    private custosService: CustosService,
    private alertController: AlertController,
    private router: Router,                      
    private reservasService: ReservasService,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens;
    });
    this.carrinhoService.lojaLevantamento$.subscribe(loja => {
      this.lojaSelecionada = loja || '';
    });
  }

  removerItem(index: number) {
    this.carrinhoService.removerItem(index);
  }

  async alterarQuantidade(index: number, delta: number) {
    const novaQtd = this.itens[index].quantidade + delta;
    if (novaQtd <= 0) {
      const alert = await this.alertController.create({
        header: 'Confirmar Remoção',
        message: `Tem a certeza que deseja remover o artigo "${this.itens[index].nome}" do seu carrinho?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Remover',
            handler: () => {
              this.carrinhoService.removerItem(index);
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.carrinhoService.alterarQuantidade(index, novaQtd);
    }
  }

  async limparCarrinho() {
    const alert = await this.alertController.create({
      header: 'Esvaziar Carrinho',
      message: 'Tem a certeza que deseja remover todos os artigos do seu carrinho?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Esvaziar',
          handler: () => {
            this.carrinhoService.limparCarrinho();
          }
        }
      ]
    });
    await alert.present();
  }

  get subtotal(): number { return this.custosService.getSubtotal(); }
  get descontoCampanha(): number { return this.custosService.getDescontoCampanha(); }
  get subtotalFinal(): number { return this.custosService.getFinalSubtotal(); }
  get porte(): number { return this.custosService.getPorte(); }
  get total(): number { return this.custosService.getTotal(); }
  get faltaParteGratis(): number { return this.custosService.getFaltaParteGratis(); }

  get nomeLojaCompleto(): string {
    const loja = this.carrinhoService.getLojaLevantamento();
    if (loja === 'braga') return 'Loja Braga Parque';
    if (loja === 'coimbra') return 'Loja Coimbra Dolce Vita';
    if (loja === 'lisboa') return 'Loja Lisboa Colombo';
    return 'Nenhuma loja selecionada';
  }

  aoMudarLoja(event: any) {
    const loja = event.detail.value;
    this.lojaSelecionada = loja;
    this.carrinhoService.setLojaLevantamento(loja ? loja : null);
  }

  isItemDisponivel(item: ItemCarrinho): boolean {
    // Na nossa simulação, se a loja for 'lisboa' (Lisboa Colombo), os artigos com id ímpar estão indisponíveis (como o casaco que tem ID 1)
    if (this.lojaSelecionada === 'lisboa' && item.id % 2 !== 0) {
      return false;
    }
    return true;
  }

  async criarReserva() {
    if (!this.authService.isLoggedIn()) {
      const alert = await this.alertController.create({
        header: 'Iniciar Sessão Necessário',
        message: 'Para criar a sua reserva e encomendar os seus artigos favoritos, necessita de ter sessão iniciada.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Iniciar Sessão',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }
        ]
      });
      await alert.present();
      return;
    }

    if (!this.lojaSelecionada) {
      const alert = await this.alertController.create({
        header: 'Selecionar Loja de Levantamento',
        message: 'Por favor, selecione uma loja no seletor do carrinho para efetuar o levantamento antes de criar a sua reserva.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.itens.some(item => !this.isItemDisponivel(item))) {
      const alert = await this.alertController.create({
        header: 'Artigos Indisponíveis',
        message: 'O seu carrinho contém artigos indisponíveis na loja selecionada. Por favor, remova-os ou selecione outra loja antes de prosseguir.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const numeroReserva = Math.floor(Math.random() * 900000000) + 100000000;
    const qtdTotal = this.itens.reduce((acc, item) => acc + item.quantidade, 0);

    const dataAtual = new Date();
    const dataCriacao = dataAtual.toLocaleDateString('pt-PT') + ' às ' + dataAtual.toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'});
    
    const dataAmanha = new Date(dataAtual.getTime() + 24 * 60 * 60 * 1000);
    const dataValidade = dataAmanha.toLocaleDateString('pt-PT') + ' às ' + dataAmanha.toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'});

    this.reservasService.adicionarReserva({
      numero: numeroReserva,
      dataCriacao: dataCriacao,
      dataValidade: dataValidade,
      total: this.total,
      qtdArtigos: qtdTotal,
      loja: this.nomeLojaCompleto,
      itens: [...this.itens] 
    });

    const mensagemSegura = new IonicSafeString(`
      <div class="ion-text-center">
        <p>A sua reserva <strong>#${numeroReserva}</strong> está confirmada.</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva_QDK_${numeroReserva}" 
             alt="QR Code" style="margin-top: 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      </div>
    `);

    // Mostrar Notificação Push simulada com horários
    let fechoLoja = '23h00';
    if (this.lojaSelecionada === 'lisboa') fechoLoja = '00h00';
    if (this.lojaSelecionada === 'coimbra') fechoLoja = '22h00';

    const toastNotif = await this.toastController.create({
      header: 'QuickDressKids • Notificação de Reserva',
      message: `A sua reserva #${numeroReserva} está agendada! Levante na ${this.nomeLojaCompleto} das 10h00 às ${fechoLoja} nas próximas 24 horas.`,
      position: 'top',
      color: 'success',
      duration: 6000,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toastNotif.present();

    const alert = await this.alertController.create({
      header: 'Reserva Criada!',
      message: mensagemSegura,
      buttons: [
        {
          text: 'Ver Minhas Reservas',
          handler: () => {
            this.carrinhoService.limparCarrinho();
            this.router.navigate(['/reservas']);
          }
        }
      ]
    });

    await alert.present();
  }
}