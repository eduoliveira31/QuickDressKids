import { Component, OnInit } from '@angular/core';
import { AlertController, IonicSafeString } from '@ionic/angular';
import { CarrinhoService, ItemCarrinho } from '../services/carrinho';
import { CustosService, PORTE_GRATIS_A_PARTIR_DE } from '../services/custos';
import { Router } from '@angular/router';
import { ReservasService } from '../services/reservas';

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
    private carrinhoService: CarrinhoService,
    private custosService: CustosService,
    private alertController: AlertController,
    private router: Router,                      
    private reservasService: ReservasService     
  ) {}

  ngOnInit() {
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens;
    });
  }

  removerItem(index: number) {
    this.carrinhoService.removerItem(index);
  }

  alterarQuantidade(index: number, delta: number) {
    const novaQtd = this.itens[index].quantidade + delta;
    this.carrinhoService.alterarQuantidade(index, novaQtd);
  }

  limparCarrinho() {
    this.carrinhoService.limparCarrinho();
  }

  get subtotal(): number { return this.custosService.getSubtotal(); }
  get porte(): number { return this.custosService.getPorte(); }
  get total(): number { return this.custosService.getTotal(); }
  get faltaParteGratis(): number { return this.custosService.getFaltaParteGratis(); }

  async criarReserva() {
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
      loja: 'Loja Lisboa Colombo - Lisboa',
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
      buttons: [
        {
          text: 'Ver Minhas Reservas',
          handler: () => {
            this.limparCarrinho();
            this.router.navigate(['/reservas']);
          }
        }
      ]
    });

    await alert.present();
  }
}