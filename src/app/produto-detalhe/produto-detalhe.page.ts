import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Catalogo } from '../services/catalogo';
import { CarrinhoService } from '../services/carrinho';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.page.html',
  styleUrls: ['./produto-detalhe.page.scss'],
  standalone: false
})
export class ProdutoDetalhePage implements OnInit {
  
  produto: any;
  corSelecionada: string = '';
  tamanhoSelecionado: string = '';
  quantidade: number = 1;

  // NOVAS VARIÁVEIS PARA AS ABAS E LOJAS
  abaAtiva: string = 'composicao'; // Define a aba de Composição como padrão
  lojaSelecionada: string = '';
  mensagemStock: string = '';
  corStock: string = 'medium';

  constructor(
    private route: ActivatedRoute,
    private catalogo: Catalogo,
    private carrinhoService: CarrinhoService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const fetched = this.catalogo.getProdutoById(Number(id));
      
      if (fetched && typeof fetched.subscribe === 'function') {
        fetched.subscribe((dados: any) => this.prepararProduto(dados));
      } else {
        this.prepararProduto(fetched);
      }
    }
  }

  prepararProduto(dados: any) {
    this.produto = dados;
    if (this.produto) {
      if (this.produto.cores && this.produto.cores.length > 0) {
        this.corSelecionada = this.produto.cores[0];
      }
      if (this.produto.tamanhos && this.produto.tamanhos.length > 0) {
        this.tamanhoSelecionado = this.produto.tamanhos[0];
      }
    }
  }

  aumentarQuantidade() { this.quantidade++; }
  
  diminuirQuantidade() {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  async adicionarAoCarrinho() {
    if (!this.produto) return;

    // 1. Verificar se o utilizador selecionou alguma loja
    if (!this.lojaSelecionada) {
      const toast = await this.toastController.create({
        message: 'Por favor, selecione uma loja para verificar o stock e levantar o artigo!',
        duration: 3000,
        position: 'bottom',
        color: 'warning',
        icon: 'warning'
      });
      await toast.present();
      return;
    }

    // 2. Verificar se a loja selecionada tem stock (lisboa não tem stock nesta simulação)
    if (this.lojaSelecionada === 'lisboa') {
      const alert = await this.alertController.create({
        header: 'Sem Stock Disponível',
        message: `Lamentamos, mas este artigo está esgotado na ${this.getNomeLoja(this.lojaSelecionada)}. Por favor, escolha outra loja com stock disponível.`,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // 3. Obter a loja que já está bloqueada/ativa no carrinho
    const lojaCarrinho = this.carrinhoService.getLojaLevantamento();

    if (lojaCarrinho && lojaCarrinho !== this.lojaSelecionada) {
      // O utilizador selecionou uma loja diferente da do carrinho!
      const alert = await this.alertController.create({
        header: 'Loja de Levantamento Diferente',
        message: `O seu carrinho já tem artigos para levantar na <strong>${this.getNomeLoja(lojaCarrinho)}</strong>.<br><br>Todos os artigos de uma reserva devem ser levantados na mesma loja. Deseja esvaziar o carrinho atual para mudar de loja ou manter a loja anterior?`,
        buttons: [
          {
            text: 'Manter anterior',
            role: 'cancel'
          },
          {
            text: 'Esvaziar e Alterar Loja',
            handler: () => {
              this.carrinhoService.limparCarrinho();
              this.executarAdicao();
            }
          }
        ]
      });
      await alert.present();
      return;
    }

    // Se estiver tudo correto, adiciona
    this.executarAdicao();
  }

  getNomeLoja(lojaId: string): string {
    if (lojaId === 'braga') return 'Loja Braga Parque';
    if (lojaId === 'coimbra') return 'Loja Coimbra Dolce Vita';
    if (lojaId === 'lisboa') return 'Loja Lisboa Colombo';
    return 'loja';
  }

  async executarAdicao() {
    const pacoteProduto: any = {
      id: this.produto.id,
      nome: this.produto.nome,
      preco: this.produto.preco,
      imagem: this.produto.imagem,
      cor: this.corSelecionada,
      tamanho: this.tamanhoSelecionado,
      categoria: this.produto.categoria // Muito importante para a campanha "Leve 3, Pague 2"!
    };

    // Bloquear a loja no carrinho se for o primeiro item
    if (!this.carrinhoService.getLojaLevantamento()) {
      this.carrinhoService.setLojaLevantamento(this.lojaSelecionada);
    }

    this.carrinhoService.adicionarItem(pacoteProduto, this.quantidade);

    const toast = await this.toastController.create({
      message: `${this.quantidade}x ${this.produto.nome} adicionado(s) ao carrinho para levantamento na ${this.getNomeLoja(this.lojaSelecionada)}!`,
      duration: 3000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle'
    });
    await toast.present();
  }

  // NOVA FUNÇÃO: VERIFICAR STOCK
  verificarStock(event: any) {
    const loja = event.detail.value;
    
    if (loja === 'lisboa') {
      this.mensagemStock = 'Artigo indisponível nesta loja.';
      this.corStock = 'danger'; // Fica vermelho
    } else if (loja === 'braga' || loja === 'coimbra') {
      this.mensagemStock = 'Em stock! Disponível para reserva.';
      this.corStock = 'success'; // Fica verde
    }
  }
}