import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalogo } from '../services/catalogo';
import { CarrinhoService } from '../services/carrinho';
import { ToastController, AlertController, IonicSafeString } from '@ionic/angular';

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

  abaAtiva: string = 'composicao'; 
  lojaSelecionada: string = '';
  mensagemStock: string = '';
  corStock: string = 'medium';
  mensagemQtdStock: string = '';
  mensagemHorarioLoja: string = '';

  lojaSugerida: string = '';
  nomeLojaSugerida: string = '';
  distanciaSugerida: number = 0;


  readonly LOJAS_GPS = [
    { id: 'braga', nome: 'Loja Braga Parque', lat: 41.5503, lng: -8.4200 },
    { id: 'coimbra', nome: 'Loja Coimbra Dolce Vita', lat: 40.2056, lng: -8.4195 },
    { id: 'lisboa', nome: 'Loja Lisboa Colombo', lat: 38.7223, lng: -9.1393 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

    if (typeof window !== 'undefined') {
      const locationPermitted = localStorage.getItem('quickdresskids_location_permitted');
      if (locationPermitted === 'true' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.calcularLojaMaisProxima(position.coords.latitude, position.coords.longitude);
          },
          (err) => {
            localStorage.setItem('quickdresskids_location_permitted', 'false');
          }
        );
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

  obterStockLoja(loja: string): number {
    if (!loja || !this.produto) return 999;
    
    const id = this.produto.id;
    if (loja === 'lisboa') {
      if (id === 1) return 0;
      return (id * 3) % 5 + 2;
    } else if (loja === 'braga') {
      return (id * 4) % 7 + 3;
    } else if (loja === 'coimbra') {
      return (id * 2) % 4 + 1;
    }
    return 999;
  }

  async adicionarAoCarrinho() {
    if (!this.produto) return;

    if (this.lojaSelecionada) {
      const stock = this.obterStockLoja(this.lojaSelecionada);
      if (this.quantidade > stock) {
        const alert = await this.alertController.create({
          header: 'Stock Insuficiente',
          message: `Só existem ${stock} unidades em stock na loja selecionada. Por favor, ajuste a quantidade ou selecione outra loja.`,
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
    }

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
      categoria: this.produto.categoria 
    };

    if (!this.carrinhoService.getLojaLevantamento() && this.lojaSelecionada) {
      this.carrinhoService.setLojaLevantamento(this.lojaSelecionada);
    }

    this.carrinhoService.adicionarItem(pacoteProduto, this.quantidade);

    const toast = await this.toastController.create({
      message: `${this.quantidade}x ${this.produto.nome} adicionado(s) ao carrinho!`,
      duration: 4000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle',
      buttons: [
        {
          text: 'Ver Carrinho',
          handler: () => {
            this.router.navigate(['/tabs/carrinho']);
          }
        }
      ]
    });
    await toast.present();
  }

  verificarStock(event: any) {
    const loja = event.detail.value;
    if (!loja) {
      this.mensagemQtdStock = '';
      this.mensagemHorarioLoja = '';
      return;
    }
    
    const qtdStock = this.obterStockLoja(loja);
    let horario = '';
    
    if (loja === 'lisboa') {
      horario = 'Todos os dias das 10h00 às 00h00';
    } else if (loja === 'braga') {
      horario = 'Todos os dias das 10h00 às 23h00';
    } else if (loja === 'coimbra') {
      horario = 'Todos os dias das 10h00 às 22h00';
    }

    if (qtdStock === 0) {
      this.mensagemQtdStock = '0 unidades (Esgotado)';
      this.corStock = 'danger';
    } else {
      this.mensagemQtdStock = `${qtdStock} unidades em stock`;
      this.corStock = 'success';
    }
    this.mensagemHorarioLoja = horario;
  }

  pedirLocalizacao() {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('quickdresskids_location_permitted', 'true');
          this.calcularLojaMaisProxima(position.coords.latitude, position.coords.longitude);
          this.apresentarToastMsg('Localização ativada com sucesso!', 'success');
        },
        (error) => {
          this.apresentarToastMsg('Não foi possível obter a sua localização.', 'warning');
        }
      );
    } else {
      this.apresentarToastMsg('A geolocalização não é suportada por este dispositivo.', 'danger');
    }
  }

  calcularLojaMaisProxima(userLat: number, userLng: number) {
    let menorDistancia = Infinity;
    let lojaMaisProxima = '';
    let nomeLoja = '';

    for (const loja of this.LOJAS_GPS) {
      const dist = this.calcularDistanciaHaversine(userLat, userLng, loja.lat, loja.lng);
      if (dist < menorDistancia) {
        menorDistancia = dist;
        lojaMaisProxima = loja.id;
        nomeLoja = loja.nome;
      }
    }

    this.lojaSugerida = lojaMaisProxima;
    this.nomeLojaSugerida = nomeLoja;
    this.distanciaSugerida = Math.round(menorDistancia * 10) / 10; 
  }

  calcularDistanciaHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  selecionarLojaSugerida() {
    if (this.lojaSugerida) {
      this.lojaSelecionada = this.lojaSugerida;
      this.verificarStock({ detail: { value: this.lojaSelecionada } });
      this.apresentarToastMsg(`Loja ${this.nomeLojaSugerida} selecionada automaticamente!`, 'success');
    }
  }

  private async apresentarToastMsg(mensagem: string, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2500,
      color: cor,
      position: 'bottom'
    });
    await toast.present();
  }
}