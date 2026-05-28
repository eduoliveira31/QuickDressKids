import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Catalogo } from '../services/catalogo';
import { Favoritos } from '../services/favoritos';
import { CarrinhoService } from '../services/carrinho';
import { ToastController } from '@ionic/angular';

/**
 * Página de detalhe de um produto.
 *
 * Recebe o ID do produto como parâmetro de rota (:id),
 * carrega os dados do produto, permite selecionar tamanho e cor,
 * adicionar ao carrinho e marcar como favorito.
 */
@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.page.html',
  styleUrls: ['./produto-detalhe.page.scss'],
  standalone: false
})
export class ProdutoDetalhePage implements OnInit {

  /** Dados completos do produto carregado (indefinido até o pedido HTTP terminar) */
  produto: any;

  /** Indica se o produto atual está marcado como favorito pelo utilizador */
  isFavorito: boolean = false;

  /** Tamanho selecionado pelo utilizador (ex: 'S', 'M', 'L') */
  tamanhoSelecionado: string = '';

  /** Cor selecionada pelo utilizador (ex: 'Azul', 'Rosa') */
  corSelecionada: string = '';

  /**
   * @param route            - Permite aceder aos parâmetros da rota atual (id do produto)
   * @param catalogoService  - Fornece os dados do catálogo via JSON
   * @param favoritosService - Gere a lista de favoritos persistida no Storage
   * @param carrinhoService  - Gere o estado do carrinho
   * @param toastCtrl        - Cria notificações temporárias (toasts) no ecrã
   */
  constructor(
    private route: ActivatedRoute,
    private catalogoService: Catalogo,
    private favoritosService: Favoritos,
    private carrinhoService: CarrinhoService,
    private toastCtrl: ToastController
  ) {}

  // ─── CICLO DE VIDA ──────────────────────────────────────────────────────────

  /**
   * Lê o parâmetro :id da rota, carrega o produto correspondente
   * e verifica se já é favorito.
   * Pré-seleciona o primeiro tamanho e cor disponíveis.
   */
  ngOnInit() {
    // Lê o parâmetro :id da URL e converte para número
    const idParam = this.route.snapshot.paramMap.get('id');
    const produtoId = Number(idParam);

    this.catalogoService.getProdutos().subscribe(async (produtos: any[]) => {
      // Encontra o produto pelo ID
      this.produto = produtos.find(p => p.id === produtoId);

      if (this.produto) {
        // Verifica se o produto já está nos favoritos
        this.isFavorito = await this.favoritosService.isFavorito(this.produto.id);

        // Pré-seleciona o primeiro tamanho e cor disponíveis
        this.tamanhoSelecionado = this.produto.tamanhos?.[0] || '';
        this.corSelecionada = this.produto.cores?.[0] || '';
      }
    });
  }

  // ─── AÇÕES ──────────────────────────────────────────────────────────────────

  /**
   * Alterna o estado de favorito do produto atual.
   * Chama o FavoritosService para adicionar ou remover dos favoritos
   * e atualiza o ícone de coração no ecrã.
   */
  async toggleCoracao() {
    await this.favoritosService.toggleFavorito(this.produto.id);
    this.isFavorito = !this.isFavorito;
  }

  /**
   * Adiciona o produto ao carrinho com o tamanho e cor selecionados.
   *
   * Validação: se o utilizador não tiver selecionado tamanho ou cor,
   * apresenta um toast de aviso e não prossegue.
   * Em caso de sucesso, apresenta um toast de confirmação.
   */
  async adicionarAoCarrinho() {
    // Valida se o utilizador selecionou tamanho e cor
    if (!this.tamanhoSelecionado || !this.corSelecionada) {
      const toast = await this.toastCtrl.create({
        message: 'Seleciona um tamanho e uma cor.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // Adiciona o produto ao carrinho com os atributos selecionados
    this.carrinhoService.adicionarItem({
      id: this.produto.id,
      nome: this.produto.nome,
      preco: this.produto.preco,
      imagem: this.produto.imagem,
      tamanho: this.tamanhoSelecionado,
      cor: this.corSelecionada
    });

    // Notifica o utilizador com um toast de sucesso
    const toast = await this.toastCtrl.create({
      message: `${this.produto.nome} adicionado ao carrinho!`,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}