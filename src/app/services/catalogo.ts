import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Catalogo {

  private basePath = 'assets/data';

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/produtos.json`);
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/categorias.json`);
  }

  getTipos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/tipos.json`);
  }

  getFaixasEtarias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/faixas-etarias.json`);
  }

  getProdutoById(id: number): Observable<any> {
    return this.getProdutos().pipe(
      map(produtos => produtos.find(p => p.id === id))
    );
  }

  getProdutosPorCategoria(categoria: string): Observable<any[]> {
    return this.getProdutos().pipe(
      map(produtos => produtos.filter(p => p.categoria === categoria))
    );
  }

  getProdutosDestaque(): Observable<any[]> {
    return this.getProdutos().pipe(
      map(produtos => produtos.filter(p => p.destaque === true))
    );
  }
}