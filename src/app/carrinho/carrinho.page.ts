import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { AlertController, IonicSafeString, ToastController } from '@ionic/angular';
import { CarrinhoService, ItemCarrinho } from '../services/carrinho';
import { CustosService, PORTE_GRATIS_A_PARTIR_DE } from '../services/custos';
=======
import { ToastController } from '@ionic/angular';
>>>>>>> 0b54999dc983e3a979a248298f372d2f71276ddb
import { Router } from '@angular/router';
import { CarrinhoService } from '../services/carrinho'; // Confirma o teu caminho

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: false
})
export class CarrinhoPage implements OnInit {
  itens: any[] = [];
  total: number = 0;
  lojaSelecionada: string = '';

  lojaSelecionada: string = '';

  constructor(
    private carrinhoService: CarrinhoService,
<<<<<<< HEAD
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
=======
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarCarrinho();
>>>>>>> 0b54999dc983e3a979a248298f372d2f71276ddb
  }

  ionViewWillEnter() {
    this.carregarCarrinho();
  }

  carregarCarrinho() {
    // Vai buscar os itens ao serviço (ajusta o método se o teu se chamar de outra forma)
    this.itens = this.carrinhoService.getItens ? this.carrinhoService.getItens() : [];
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.itens.reduce((acc, item) => acc + (item.preco * (item.quantidade || 1)), 0);
  }

  removerItem(item: any) {
    // Remove o item e recalcula o total automaticamente
    if(this.carrinhoService.removerItem) {
      this.carrinhoService.removerItem(item.id);
    } else {
      this.itens = this.itens.filter(i => i.id !== item.id); // Fallback
    }
    this.carregarCarrinho();
  }

  // LÓGICA DO CENÁRIO DO JOÃO
  verificarStockItem(item: any): boolean {
    if (!this.lojaSelecionada) return true;

    // Se a loja escolhida for Lisboa e o artigo for o Casaco de Inverno -> Indisponível
    if (this.lojaSelecionada === 'lisboa' && item.nome && item.nome.includes('Casaco de Inverno')) {
      return false; 
    }
    return true; 
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
    const semStock = this.itens.some(item => !this.verificarStockItem(item));
    
    if (semStock) {
      const toast = await this.toastController.create({
        message: 'Atenção: Remova os artigos indisponíveis antes de reservar.',
        duration: 2500,
        color: 'danger',
        icon: 'warning'
      });
      await toast.present();
      return;
    }

<<<<<<< HEAD
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
=======
    if (this.itens.length === 0) {
      const toast = await this.toastController.create({
        message: 'O seu carrinho está vazio.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }
>>>>>>> 0b54999dc983e3a979a248298f372d2f71276ddb

    if (!this.lojaSelecionada) {
      const toast = await this.toastController.create({
        message: 'Por favor, selecione uma loja para levantamento.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // Sucesso na Reserva!
    const toast = await this.toastController.create({
      message: 'Reserva criada com sucesso!',
      duration: 2000,
      color: 'success',
      icon: 'checkmark-circle'
    });
    await toast.present();
    
<<<<<<< HEAD
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
=======
    // Limpa o carrinho e redireciona (ajusta se necessário)
    if(this.carrinhoService.limparCarrinho) this.carrinhoService.limparCarrinho();
    this.carregarCarrinho();
    this.router.navigate(['/tabs/reservas']);
>>>>>>> 0b54999dc983e3a979a248298f372d2f71276ddb
  }
}