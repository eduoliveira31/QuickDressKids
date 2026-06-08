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
 * validação de stock local por dados fixos e concluir/agendar uma reserva.
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
    public authService: AuthService,
    private toastController: ToastController
  ) {}

  /**
   * Método do ciclo de vida (Angular). Executado ao inicializar a página.
   * Garante a sincronização reativa (via Observables) dos dados do utilizador e itens no carrinho.
   */
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens;
<<<<<<< HEAD
      this.calcularTotal(); // Recalcula sempre que há uma emissão de novos dados
    });
    this.carrinhoService.lojaLevantamento$.subscribe(loja => {
      this.lojaSelecionada = loja || '';
      // Pré-selecionar a loja mais próxima (Braga) se nenhuma estiver selecionada
      if (!this.lojaSelecionada) {
        this.lojaSelecionada = 'BragaParque';
        this.carrinhoService.setLojaLevantamento('BragaParque');
      }
=======
      this.calcularTotal(); 
>>>>>>> c92acbdf72aa00293ee8dcbb809730d6dd0db539
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

  /** Controla a seleção da loja com tratamento de nulos */
  get lojaSelecionada(): string {
    return this.carrinhoService.getLojaLevantamento() || '';
  }
  set lojaSelecionada(valor: string) {
    this.carrinhoService.setLojaLevantamento(valor);
  }

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
   * Aplica a limitação de stock baseada nos dados fixos da loja selecionada.
   * @param index Posição do artigo no array do carrinho.
   * @param delta Valor a somar/subtrair (+1 ou -1).
   */
  async alterarQuantidade(index: number, delta: number) {
    const item = this.itens[index];
    const novaQtd = item.quantidade + delta;
    
    // Verificação de Limite de Stock ao tentar adicionar unidades (+)
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
   * Obtém a quantidade de stock disponível a partir de dados FIXOS mapeados por ID e Loja,
   * eliminando qualquer tipo de cálculo ou fórmula matemática arbitrária.
   * @param item Objeto do produto.
   * @param loja String identificadora da loja.
   * @returns Inteiro representando o stock fixo.
   */
  obterStockItem(item: any, loja: string): number {
    if (!loja) return 999; 
    
    const id = item.id;

    // Base de dados de Stock Fixo mapeada de forma determinística
    const tabelaStockFixa: { [key: string]: { [key: number]: number } } = {
      lisboa: {
        1: 0,  // Casaco de Inverno (ID=1) -> Esgotado em Lisboa (Cenário do João)
        2: 5,  // T-Shirt com Flores
        3: 3,  // Calças de Ganga
        4: 8,  // Vestido de Verão
        5: 12  // Body com Estrelas
      },
      braga: {
        1: 4,
        2: 3,
        3: 6,
        4: 2,
        5: 5
      },
      coimbra: {
        1: 2,
        2: 1,
        3: 4,
        4: 5,
        5: 3
      }
    };

    // Tenta encontrar o stock fixo definido na tabela, senão devolve um valor padrão seguro (ex: 5)
    if (tabelaStockFixa[loja] && tabelaStockFixa[loja][id] !== undefined) {
      return tabelaStockFixa[loja][id];
    }

    // Fallback para IDs adicionais que não estejam explicitamente na tabela
    if (loja === 'lisboa' && item.nome && item.nome.toLowerCase().includes('casaco de inverno')) {
      return 0;
    }
    return 5; 
  }

  /**
   * Compara a quantidade desejada pelo utilizador com o stock real fixo da loja selecionada.
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
  }

  /**
   * Getter processado (Computed Property). 
   * Traduz a chave técnica da loja para a sua designação comercial completa.
   */
  get nomeLojaCompleto(): string {
    if (this.lojaSelecionada === 'braga') return 'Loja Braga Parque';
    if (this.lojaSelecionada === 'lisboa') return 'Loja Lisboa Colombo';
    if (this.lojaSelecionada === 'coimbra') return 'Loja Coimbra Dolce Vita';
    return '';
  }

  // ==========================================
  //             FLUXO DE RESERVA
  // ==========================================

  /**
   * Fluxo de Checkout com redirecionamento correto para '/tabs/perfil'.
   */
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

<<<<<<< HEAD
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
=======
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
>>>>>>> c92acbdf72aa00293ee8dcbb809730d6dd0db539
  }
}