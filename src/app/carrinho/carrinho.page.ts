import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // <-- Importamos o AlertController
import { CarrinhoService, ItemCarrinho } from '../services/carrinho';
import { CustosService, PORTE_GRATIS_A_PARTIR_DE } from '../services/custos';

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
    private alertController: AlertController // <-- Injetamos aqui
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

  // NOVA FUNÇÃO PARA CRIAR A RESERVA E MOSTRAR O QR CODE
  async criarReserva() {
    // Geramos um número de reserva aleatório
    const numeroReserva = Math.floor(Math.random() * 90000) + 10000;

    const alert = await this.alertController.create({
      header: 'Reserva Criada!',
      subHeader: `Validade: 24 horas`,
      // Usamos uma API gratuita e direta para gerar o QR Code com o número da reserva!
      message: `
        <div class="ion-text-center">
          <p>A sua reserva <strong>#${numeroReserva}</strong> está confirmada.</p>
          <p style="font-size: 12px; color: gray;">Mostre este código na loja:</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva_QDK_${numeroReserva}" 
               alt="QR Code" 
               style="margin-top: 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        </div>
      `,
      buttons: [
        {
          text: 'Concluir',
          handler: () => {
            // Quando o utilizador clica em concluir, limpamos o carrinho
            this.limparCarrinho();
          }
        }
      ]
    });

    await alert.present();
  }
}