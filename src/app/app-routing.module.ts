import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

/**
 * Rotas principais da aplicação QuickDressKids.
 *
 * Estrutura de routing:
 * - ''                    → TabsPageModule (Catálogo, Carrinho, Perfil)
 * - 'produto-detalhe/:id' → ProdutoDetalhePageModule (detalhe de um produto)
 *
 * O parâmetro :id é o identificador numérico do produto,
 * lido pelo ProdutoDetalhePage através do ActivatedRoute.
 */
const routes: Routes = [
  {
    // Rota raiz — carrega o módulo das tabs (lazy loading)
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    // Rota de detalhe — recebe o ID do produto como parâmetro de URL
    path: 'produto-detalhe/:id',
    loadChildren: () =>
      import('./produto-detalhe/produto-detalhe.module').then(
        m => m.ProdutoDetalhePageModule
      )
  }
];

/**
 * Módulo de routing raiz da aplicação.
 *
 * Usa PreloadAllModules para pré-carregar os módulos lazy em segundo plano,
 * melhorando a velocidade de navegação após o carregamento inicial.
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}