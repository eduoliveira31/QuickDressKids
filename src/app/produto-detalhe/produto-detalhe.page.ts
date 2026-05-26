import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Catalogo } from '../services/catalogo';
import { Favoritos } from '../services/favoritos';
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
  isFavorito: boolean = false;
  tamanhoSelecionado: string = '';
  corSelecionada: string = '';

  constructor(
    private route: ActivatedRoute,
    private catalogoService: Catalogo,
    private favoritosService: Favoritos,
    private carrinhoService: CarrinhoService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const produtoId = Number(idParam);

    this.catalogoService.getProdutos().subscribe(async (produtos: any[]) => {
      this.produto = produtos.find(p => p.id === produtoId);
      if (this.produto) {
        this.isFavorito = await this.favoritosService.isFavorito(this.produto.id);
        this.tamanhoSelecionado = this.produto.tamanhos?.[0] || '';
        this.corSelecionada = this.produto.cores?.[0] || '';
      }
    });
  }

  async toggleCoracao() {
    await this.favoritosService.toggleFavorito(this.produto.id);
    this.isFavorito = !this.isFavorito;
  }

  async adicionarAoCarrinho() {
    if (!this.tamanhoSelecionado || !this.corSelecionada) {
      const toast = await this.toastCtrl.create({
        message: 'Seleciona um tamanho e uma cor.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.carrinhoService.adicionarItem({
      id: this.produto.id,
      nome: this.produto.nome,
      preco: this.produto.preco,
      imagem: this.produto.imagem,
      tamanho: this.tamanhoSelecionado,
      cor: this.corSelecionada
    });

    const toast = await this.toastCtrl.create({
      message: `${this.produto.nome} adicionado ao carrinho!`,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}