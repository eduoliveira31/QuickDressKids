import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicSafeString, ToastController } from '@ionic/angular';
import { CarrinhoService, ItemCarrinho } from '../services/carrinho';
import { CustosService } from '../services/custos';
import { ReservasService } from '../services/reservas';
import { AuthService, Usuario } from '../services/auth.service';

/**
 * Componente responsável pela gestão do Carrinho de Compras.
 * Permite ao utilizador visualizar itens selecionados, alterar quantidades, 
 * simular a verificação de stock local e concluir/agendar uma reserva.
 */
@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: false
})
export class CarrinhoPage implements OnInit {
  
  // ==========================================
  //      VARIÁVEIS DE ESTADO E DADOS
  // ==========================================

  /** Array dinâmico que armazena os produtos adicionados ao carrinho. */
  itens: any[] = [];
  
  /** Valor monetário total a pagar, atualizado em tempo real. */
  total: number = 0;
  
  /** String identificadora da loja física selecionada para levantamento (ex: 'lisboa'). */
  lojaSelecionada: string = '';
  
  /** Registo do utilizador atualmente autenticado. Necessário para concluir a reserva. */
  currentUser: Usuario | null = null;

  /**
   * Construtor da classe CarrinhoPage.
   * Injeta os serviços necessários para a gestão de estado e comunicação de interface (UI).
   */
  constructor(
    private carrinhoService: CarrinhoService,
    private custosService: CustosService,
    private alertController: AlertController,
    private router: Router,                      
    private reservasService: ReservasService,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  /**
   * Método do ciclo de vida (Angular). Executado ao inicializar a página.
   * Garante a sincronização reativa (via Observables) dos dados do utilizador, 
   * itens no carrinho e loja de levantamento previamente escolhida.
   */
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens;
      this.calcularTotal(); // Recalcula sempre que há uma emissão de novos dados
    });
    this.carrinhoService.lojaLevantamento$.subscribe(loja => {
      this.lojaSelecionada = loja || '';
      // Pré-selecionar a loja mais próxima (Braga) se nenhuma estiver selecionada
      if (!this.lojaSelecionada) {
        this.lojaSelecionada = 'BragaParque';
        this.carrinhoService.setLojaLevantamento('BragaParque');
      }
    });
  }

  /**
   * Método do ciclo de vida (Ionic). Executado sempre que a view entra em foco.
   * Força uma leitura atualizada dos itens para prevenir dados em cache.
   */
  ionViewWillEnter() {
    this.carregarCarrinho();
  }

  // ==========================================
  //         MÉTODOS DO CARRINHO
  // ==========================================

  /**
   * Lê sincronamente a lista de itens do serviço e atualiza o valor total.
   */
  carregarCarrinho() {
    this.itens = this.carrinhoService.getItens();
    this.calcularTotal();
  }

  /**
   * Navegação manual. Volta à página anterior se houver histórico, 
   * ou regressa à Home (catálogo) como fallback seguro.
   */
  voltar() {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }

  /**
   * Delega ao `CustosService` o cálculo matemático do valor total do carrinho.
   */
  calcularTotal() {
    this.total = this.custosService.getTotal();
  }

  /**
   * Aumenta ou diminui a quantidade de um produto específico no carrinho.
   * @param index Posição do artigo no array do carrinho.
   * @param delta Valor a somar/subtrair (+1 ou -1).
   */
  alterarQuantidade(index: number, delta: number) {
    const item = this.itens[index];
    const novaQtd = item.quantidade + delta;
    
    // Evita quantidades nulas ou negativas via interface
    if (novaQtd >= 1) {
      this.carrinhoService.alterarQuantidade(index, novaQtd);
      this.calcularTotal();
    }
  }

  /**
   * Elimina completamente um produto do array do carrinho.
   * @param index Posição do artigo a ser removido.
   */
  removerItem(index: number) {
    this.carrinhoService.removerItem(index);
    this.carregarCarrinho();
  }

  // ==========================================
  //        MÉTODOS DE STOCK E LOJA
  // ==========================================

  /**
   * Simula a quantidade de stock disponível de um produto em tempo real, 
   * com base num algoritmo matemático dependente do ID e da loja.
   * @param item Objeto do produto.
   * @param loja String identificadora da loja.
   * @returns Inteiro representando o stock virtual.
   */
  obterStockItem(item: any, loja: string): number {
    if (!loja) return 999; // Se não há loja escolhida, assume-se stock infinito por defeito
    
    const id = item.id;
    if (loja === 'lisboa') {
      // Regra de negócio: Casaco de Inverno (ID=1) está esgotado em Lisboa
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

  /**
   * Compara a quantidade desejada pelo utilizador com o stock virtual da loja selecionada.
   * @param item Objeto do produto no carrinho.
   * @returns Booleano indicando se há stock suficiente (`true`) ou rutura (`false`).
   */
  verificarStockItem(item: any): boolean {
    if (!this.lojaSelecionada) return true;
    const stock = this.obterStockItem(item, this.lojaSelecionada);
    return item.quantidade <= stock;
  }

  /**
   * Wrapper público utilizado pelo HTML (`*ngIf`) para exibir avisos de rutura de stock.
   */
  isItemDisponivel(item: any): boolean {
    return this.verificarStockItem(item);
  }

  /**
   * Acionado pelo dropdown `<ion-select>` quando o utilizador muda de loja.
   * @param event O evento de mudança do Ionic.
   */
  aoMudarLoja(event: any) {
    const loja = event.detail.value;
    this.lojaSelecionada = loja;
    this.carrinhoService.setLojaLevantamento(loja ? loja : null);
  }

  /**
   * Getter processado (Computed Property). 
   * Traduz a chave técnica da loja para a sua designação comercial completa.
   */
  get nomeLojaCompleto(): string {
    if (this.lojaSelecionada === 'braga') return 'Loja Braga Parque';
    if (this.lojaSelecionada === 'lisboa') return 'Loja Lisboa Colombo (Loja mais próxima)';
    if (this.lojaSelecionada === 'coimbra') return 'Loja Coimbra Dolce Vita';
    return '';
  }

  // ==========================================
  //             FLUXO DE RESERVA
  // ==========================================

  /**
   * Fluxo central de "Checkout". Efetua todas as validações de negócio e segurança 
   * (Carrinho vazio, Login, Loja Selecionada, Quebras de Stock) antes de despachar 
   * a encomenda para o serviço de `ReservasService`.
   */
  async criarReserva() {
    
    // Validação 1: O utilizador não pode reservar nada ("Ar livre")
    if (this.itens.length === 0) {
      const toast = await this.toastController.create({
        message: 'O seu carrinho está vazio.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // Validação 2: Requisito de Login para Checkout
    if (!this.currentUser) {
      const toast = await this.toastController.create({
        message: 'Inicie a sua sessão para concluir a reserva.',
        duration: 2500,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      // Envia o utilizador para o Login, com uma variável na rota para o forçar a voltar para aqui
      this.router.navigate(['/login'], { queryParams: { redirect: '/tabs/carrinho' } });
      return;
    }

    // Validação 3: Escolha obrigatória do ponto de recolha
    if (!this.lojaSelecionada) {
      const alert = await this.alertController.create({
        header: 'Selecionar Loja de Levantamento',
        message: 'Por favor, selecione uma loja no seletor do carrinho para efetuar o levantamento antes de criar a sua reserva.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Validação 4: Garantir que não há produtos sem stock na loja escolhida
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

    // Geração de metadados da reserva (Nº Encomenda aleatório e Datas)
    const numeroReserva = Math.floor(Math.random() * 900000000) + 100000000;
    const qtdTotal = this.itens.reduce((acc, item) => acc + item.quantidade, 0);

    const dataAtual = new Date();
    const dataCriacao = dataAtual.toLocaleDateString('pt-PT') + ' às ' + dataAtual.toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'});
    
    // Regra de Negócio: Reserva expira em 24h
    const dataAmanha = new Date(dataAtual.getTime() + 24 * 60 * 60 * 1000);
    const dataValidade = dataAmanha.toLocaleDateString('pt-PT') + ' às ' + dataAmanha.toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'});

    // Envio dos dados estruturados para a Persistent Storage
    await this.reservasService.adicionarReserva({
      numero: numeroReserva,
      dataCriacao: dataCriacao,
      dataValidade: dataValidade,
      total: this.total,
      qtdArtigos: qtdTotal,
      loja: this.nomeLojaCompleto,
      itens: [...this.itens] 
    });

    // Construção do Modal de Confirmação Persistente
    let fechoLoja = '23h00';
    if (this.lojaSelecionada === 'lisboa') fechoLoja = '00h00';
    if (this.lojaSelecionada === 'coimbra') fechoLoja = '22h00';

    const alertNotif = await this.alertController.create({
      header: 'Reserva Confirmada!',
      subHeader: `Reserva #${numeroReserva}`,
      message: `A sua reserva foi agendada com sucesso! Levante os artigos na ${this.nomeLojaCompleto} das 10h00 às ${fechoLoja} nas próximas 24 horas.`,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ver Minhas Reservas',
          handler: () => {
            // Esvazia a UI após sucesso e redireciona para as faturas/histórico
            this.carrinhoService.limparCarrinho();
            this.carregarCarrinho();
            this.router.navigate(['/reservas']);
          }
        }
      ]
    });
    await alertNotif.present();
  }
}