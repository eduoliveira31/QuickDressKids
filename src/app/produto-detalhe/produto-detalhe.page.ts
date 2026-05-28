import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Catalogo } from '../services/catalogo';
import { CarrinhoService } from '../services/carrinho';
import { ToastController } from '@ionic/angular';

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
    private toastController: ToastController
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
    if (this.produto) {
      const pacoteProduto: any = {
        id: this.produto.id,
        nome: this.produto.nome,
        preco: this.produto.preco,
        imagem: this.produto.imagem,
        cor: this.corSelecionada,
        tamanho: this.tamanhoSelecionado
      };

      this.carrinhoService.adicionarItem(pacoteProduto, this.quantidade);

      const toast = await this.toastController.create({
        message: `${this.quantidade}x ${this.produto.nome} adicionado(s) ao carrinho!`,
        duration: 2000,
        position: 'bottom',
        color: 'success',
        icon: 'checkmark-circle'
      });
      await toast.present();
    }
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