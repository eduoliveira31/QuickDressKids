import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProdutoDetalhePage } from './produto-detalhe.page';

const routes: Routes = [
  {
    path: '',
    component: ProdutoDetalhePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutoDetalhePageRoutingModule {}
