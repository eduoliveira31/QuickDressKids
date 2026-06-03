import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicSafeString, ToastController } from '@ionic/angular';
import { CarrinhoService, ItemCarrinho } from '../services/carrinho';
import { CustosService } from '../services/custos';
import { ReservasService } from '../services/reservas';
import { AuthService, Usuario } from '../services/auth.service';

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
  currentUser: Usuario | null = null;

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
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens;
      this.calcularTotal();
    });
    this.carrinhoService.lojaLevantamento$.subscribe(loja => {
      this.lojaSelecionada = loja || '';
    });
  }

  ionViewWillEnter() {
    this.carregarCarrinho();
  }

  carregarCarrinho() {
    this.itens = this.carrinhoService.getItens();
    this.calcularTotal();
  }

  voltar() {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }

  calcularTotal() {
    this.total = this.custosService.getTotal();
  }

  alterarQuantidade(index: number, delta: number) {
    const item = this.itens[index];
    const novaQtd = item.quantidade + delta;
    if (novaQtd >= 1) {
      this.carrinhoService.alterarQuantidade(index, novaQtd);
      this.calcularTotal();
    }
  }

  removerItem(index: number) {
    this.carrinhoService.removerItem(index);
    this.carregarCarrinho();
  }

  obterStockItem(item: any, loja: string): number {
    if (!loja) return 999;
    const id = item.id;
    if (loja === 'lisboa') {
      if (id === 1 || (item.nome && item.nome.toLowerCase().includes('casaco de inverno'))) {
        return 0;
      }
      return (id * 3) % 5 + 2;
    } else if (loja === 'braga') {
      return (id * 4) % 7 + 3;
    } else if (loja === 'coimbra') {
      return (id * 2) % 4 + 1;
    }
    return 999;
  }

  verificarStockItem(item: any): boolean {
    if (!this.lojaSelecionada) return true;
    const stock = this.obterStockItem(item, this.lojaSelecionada);
    return item.quantidade <= stock;
  }

  isItemDisponivel(item: any): boolean {
    return this.verificarStockItem(item);
  }

  aoMudarLoja(event: any) {
    const loja = event.detail.value;
    this.lojaSelecionada = loja;
    this.carrinhoService.setLojaLevantamento(loja ? loja : null);
  }

  get nomeLojaCompleto(): string {
    if (this.lojaSelecionada === 'braga') return 'Loja Braga Parque';
    if (this.lojaSelecionada === 'lisboa') return 'Loja Lisboa Colombo (Loja mais próxima)';
    if (this.lojaSelecionada === 'coimbra') return 'Loja Coimbra Dolce Vita';
    return '';
  }

  async criarReserva() {
    if (this.itens.length === 0) {
      const toast = await this.toastController.create({
        message: 'O seu carrinho está vazio.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    if (!this.currentUser) {
      const toast = await this.toastController.create({
        message: 'Inicie a sua sessão para concluir a reserva.',
        duration: 2500,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      this.router.navigate(['/login'], { queryParams: { redirect: '/tabs/carrinho' } });
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

    const semStock = this.itens.some(item => !this.verificarStockItem(item));
    if (semStock) {
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

    await this.reservasService.adicionarReserva({
      numero: numeroReserva,
      dataCriacao: dataCriacao,
      dataValidade: dataValidade,
      total: this.total,
      qtdArtigos: qtdTotal,
      loja: this.nomeLojaCompleto,
      itens: [...this.itens] 
    });

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

    // Limpar o carrinho imediatamente
    this.carrinhoService.limparCarrinho();
    this.carregarCarrinho();

    // Avançar diretamente para a finalização da compra (Encomendas)
    this.router.navigate(['/reservas']);
  }
}