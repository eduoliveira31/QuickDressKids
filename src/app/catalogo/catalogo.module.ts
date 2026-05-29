import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoPage } from './catalogo.page';
import { CatalogoPageRoutingModule } from './catalogo-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    CatalogoPageRoutingModule
  ],
  declarations: [CatalogoPage]
})
export class CatalogoPageModule {}