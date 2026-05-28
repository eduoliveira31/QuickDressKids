import { Component, OnInit } from '@angular/core';
import { Catalogo } from '../services/catalogo';

/**
 * Página principal do catálogo de produtos QuickDressKids.
 *
 * Responsabilidades:
 * - Carregar a lista de produtos a partir do CatalogoService
 * - Filtrar os produtos por categoria através do segmento no topo
 * - Apresentar os produtos filtrados em grelha
 */
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false
})
export class CatalogoPage implements OnInit {

  /**
   * Lista completa de produtos carregada do JSON.
   * Serve como fonte de dados original para os filtros.
   */
  produtosOriginais: any[] = [];

  /**
   * Lista de produtos a apresentar na grelha após aplicar o filtro ativo.
   * É atualizada sempre que o utilizador muda de categoria.
   */
  produtosFiltrados: any[] = [];

  /**
   * @param catalogoService - Service que fornece os dados do catálogo via JSON
   */
  constructor(private catalogoService: Catalogo) {}

  // ─── CICLO DE VIDA ──────────────────────────────────────────────────────────

  /**
   * Inicializa a página carregando todos os produtos do catálogo.
   * Chamado automaticamente pelo Angular após a criação do componente.
   */
  ngOnInit() {
    this.catalogoService.getProdutos().subscribe((data: any) => {
      // Guarda a lista completa para ser usada nos filtros
      this.produtosOriginais = data;
      // Por defeito, mostra todos os produtos sem filtro
      this.produtosFiltrados = data;
      console.log('Produtos carregados:', data);
    });
  }

  // ─── FILTROS ────────────────────────────────────────────────────────────────

  /**
   * Filtra os produtos pela categoria selecionada no segmento.
   *
   * Se a categoria for 'todos', repõe a lista completa.
   * Caso contrário, filtra comparando o campo categoria do produto
   * com o valor selecionado (sem distinção de maiúsculas/minúsculas).
   *
   * @param event - Evento emitido pelo ion-segment com o valor selecionado
   */
  filtrarCategoria(event: any) {
    const categoriaSelecionada = event.detail.value;

    if (categoriaSelecionada === 'todos') {
      // Mostra todos os produtos sem filtro
      this.produtosFiltrados = this.produtosOriginais;
    } else {
      // Filtra apenas os produtos da categoria selecionada
      this.produtosFiltrados = this.produtosOriginais.filter(
        produto => produto.categoria.toLowerCase() === categoriaSelecionada.toLowerCase()
      );
    }
  }
}