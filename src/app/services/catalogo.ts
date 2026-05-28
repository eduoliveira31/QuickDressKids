import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service responsável por fornecer os dados do catálogo de produtos.
 *
 * Lê a informação a partir de ficheiros JSON localizados em assets/data/:
 * - produtos.json        → lista completa de produtos
 * - categorias.json      → categorias disponíveis (menino, menina, bebé)
 * - tipos.json           → tipos de produto (casacos, t-shirts, calças...)
 * - faixas-etarias.json  → faixas etárias disponíveis (0-2, 3-5, 6-8, 9-12)
 */
@Injectable({
  providedIn: 'root',
})
export class Catalogo {

  /**
   * Caminho base para os ficheiros JSON de dados.
   * Todos os métodos constroem os URLs a partir deste prefixo.
   */
  private basePath = 'assets/data';

  /**
   * @param http - Cliente HTTP do Angular, usado para ler os ficheiros JSON
   */
  constructor(private http: HttpClient) {}

  // ─── PRODUTOS ───────────────────────────────────────────────────────────────

  /**
   * Obtém a lista completa de produtos do catálogo.
   * @returns Observable com array de todos os produtos
   */
  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/produtos.json`);
  }

  /**
   * Obtém um produto específico pelo seu identificador numérico.
   * @param id - ID do produto a procurar
   * @returns Observable com o produto encontrado, ou undefined se não existir
   */
  getProdutoById(id: number): Observable<any> {
    return this.getProdutos().pipe(
      map(produtos => produtos.find(p => p.id === id))
    );
  }

  /**
   * Filtra e devolve apenas os produtos de uma determinada categoria.
   * @param categoria - Nome da categoria (ex: 'menino', 'menina', 'bebé')
   * @returns Observable com array de produtos da categoria indicada
   */
  getProdutosPorCategoria(categoria: string): Observable<any[]> {
    return this.getProdutos().pipe(
      map(produtos => produtos.filter(p => p.categoria === categoria))
    );
  }

  /**
   * Obtém os produtos marcados como destaque no JSON.
   * @returns Observable com array de produtos em destaque
   */
  getProdutosDestaque(): Observable<any[]> {
    return this.getProdutos().pipe(
      map(produtos => produtos.filter(p => p.destaque === true))
    );
  }

  // ─── METADADOS ──────────────────────────────────────────────────────────────

  /**
   * Obtém a lista de categorias disponíveis para filtro.
   * @returns Observable com array de categorias
   */
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/categorias.json`);
  }

  /**
   * Obtém a lista de tipos de produto disponíveis para filtro.
   * @returns Observable com array de tipos (ex: casacos, t-shirts...)
   */
  getTipos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/tipos.json`);
  }

  /**
   * Obtém as faixas etárias disponíveis para filtro.
   * @returns Observable com array de faixas etárias (ex: 0-2, 3-5...)
   */
  getFaixasEtarias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/faixas-etarias.json`);
  }
}