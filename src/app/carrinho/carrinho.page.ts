import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
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

  constructor(
    private carrinhoService: CarrinhoService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarCarrinho();
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

    if (this.itens.length === 0) {
      const toast = await this.toastController.create({
        message: 'O seu carrinho está vazio.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

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
    
    // Limpa o carrinho e redireciona (ajusta se necessário)
    if(this.carrinhoService.limparCarrinho) this.carrinhoService.limparCarrinho();
    this.carregarCarrinho();
    this.router.navigate(['/tabs/reservas']);
  }
}