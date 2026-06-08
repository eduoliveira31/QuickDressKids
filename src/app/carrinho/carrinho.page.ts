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

  constructor(
    public carrinhoService: CarrinhoService,
    private custosService: CustosService,
    private alertController: AlertController,
    private toastController: ToastController, 
    private router: Router,                      
    private reservasService: ReservasService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens;
    });
  }

  // ==========================================
  // NOVAS FUNÇÕES PARA O TEU NOVO DESIGN HTML
  // ==========================================

  // 1. Verifica se o utilizador tem sessão iniciada
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  // 2. Controla a seleção da loja com o [ngModel]
  get lojaSelecionada(): string {
    return this.carrinhoService.getLojaLevantamento() || '';
  }
  set lojaSelecionada(valor: string) {
    this.carrinhoService.setLojaLevantamento(valor);
  }

  // 3. Botão de voltar atrás no topo do ecrã
  voltar() {
    this.router.navigate(['/tabs/catalogo']);
  }

  // 4. Deteta quando mudas a loja na caixa de seleção
  aoMudarLoja(event: any) {
    this.carrinhoService.setLojaLevantamento(event.detail.value);
  }

  // 5. Simula o número de artigos em stock (Cenário do Casaco em Lisboa = 0)
  obterStockItem(item: ItemCarrinho, loja: string): number {
    if (!loja) return 10; // Stock padrão se não houver loja escolhida
    
    if (loja === 'lisboa' && item.nome && item.nome.includes('Casaco de Inverno')) {
      return 0; // Sem stock
    }
    return 10; // Outros artigos têm 10 disponíveis
  }

  // 6. Atualizado para validar através do número de stock
  verificarStockItem(item: ItemCarrinho): boolean {
    return this.obterStockItem(item, this.lojaSelecionada) > 0;
  }

  // ==========================================

  removerItem(index: number) {
    this.carrinhoService.removerItem(index);
  }

  async alterarQuantidade(index: number, delta: number) {
    const novaQtd = this.itens[index].quantidade + delta;
    if (novaQtd <= 0) {
      this.removerItem(index);
    } else {
      this.carrinhoService.alterarQuantidade(index, novaQtd);
    }
  }

  async limparCarrinho() {
    this.carrinhoService.limparCarrinho();
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

  async criarReserva() {
    if (!this.authService.isLoggedIn()) {
      const alert = await this.alertController.create({
        header: 'Iniciar Sessão',
        message: 'Necessita de ter sessão iniciada para criar a sua reserva.',
        buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Iniciar Sessão', handler: () => this.router.navigate(['/login']) }]
      });
      await alert.present();
      return;
    }

    const loja = this.carrinhoService.getLojaLevantamento();
    if (!loja || loja.trim() === '') {
      const toast = await this.toastController.create({
        message: 'Por favor, selecione uma loja para levantamento.',
        duration: 2500, color: 'warning'
      });
      await toast.present();
      return;
    }

    const semStock = this.itens.some(item => !this.verificarStockItem(item));
    if (semStock) {
      const toast = await this.toastController.create({
        message: 'Atenção: Remova os artigos indisponíveis antes de reservar.',
        duration: 2500, color: 'danger', icon: 'warning'
      });
      await toast.present();
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

    const alert = await this.alertController.create({
      header: 'Reserva Criada!',
      message: mensagemSegura,
      buttons: [{ 
        text: 'Ver Minhas Reservas', 
        handler: () => { 
          this.carrinhoService.limparCarrinho(); 
          this.router.navigate(['/tabs/perfil']); 
        } 
      }]
    });

    await alert.present();
  }
}