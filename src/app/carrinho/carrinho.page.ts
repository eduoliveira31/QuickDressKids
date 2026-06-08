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
  currentUser: Usuario | null = null;

  constructor(
    private carrinhoService: CarrinhoService,
    private custosService: CustosService,
    private alertController: AlertController,
    private router: Router,                      
    private reservasService: ReservasService,
    public authService: AuthService,
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
  }

  ionViewWillEnter() {
    this.carregarCarrinho();
  }

  // 1. Controla a seleção da loja (Resolve o erro do null)
  get lojaSelecionada(): string {
    return this.carrinhoService.getLojaLevantamento() || '';
  }
  set lojaSelecionada(valor: string) {
    this.carrinhoService.setLojaLevantamento(valor);
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

  // AQUI ADICIONÁMOS A VERIFICAÇÃO PARA NÃO ULTRAPASSAR O STOCK
  async alterarQuantidade(index: number, delta: number) {
    const item = this.itens[index];
    const novaQtd = item.quantidade + delta;
    
    if (delta > 0) {
      const stockMaximo = this.obterStockItem(item, this.lojaSelecionada);
      if (item.quantidade >= stockMaximo) {
        const toast = await this.toastController.create({
          message: `Stock limite atingido. Apenas ${stockMaximo} disponíveis nesta loja.`,
          duration: 2000,
          color: 'warning',
          position: 'bottom'
        });
        await toast.present();
        return; 
      }
    }

    if (novaQtd >= 1) {
      this.carrinhoService.alterarQuantidade(index, novaQtd);
      this.calcularTotal();
    } else {
      this.removerItem(index);
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
  }

  get nomeLojaCompleto(): string {
    if (this.lojaSelecionada === 'braga') return 'Loja Braga Parque';
    if (this.lojaSelecionada === 'lisboa') return 'Loja Lisboa Colombo';
    if (this.lojaSelecionada === 'coimbra') return 'Loja Coimbra Dolce Vita';
    return '';
  }

  async criarReserva() {
    if (this.itens.length === 0) return;

    if (!this.currentUser) {
      this.router.navigate(['/login'], { queryParams: { redirect: '/tabs/carrinho' } });
      return;
    }

    if (!this.lojaSelecionada) {
      const alert = await this.alertController.create({
        header: 'Selecionar Loja',
        message: 'Por favor, selecione uma loja para efetuar o levantamento.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const semStock = this.itens.some(item => !this.verificarStockItem(item));
    if (semStock) {
      const alert = await this.alertController.create({
        header: 'Artigos Indisponíveis',
        message: 'O seu carrinho contém artigos indisponíveis na loja selecionada.',
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

    const toastNotif = await this.toastController.create({
      header: 'Reserva Confirmada',
      message: `A sua reserva #${numeroReserva} está agendada!`,
      position: 'top',
      color: 'success',
      duration: 3000,
    });
    await toastNotif.present();

    this.carrinhoService.limparCarrinho();
    this.carregarCarrinho();
    this.router.navigate(['/tabs/perfil']);
  }
}