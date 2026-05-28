import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Módulo do Ionic Storage para persistência local de dados
import { IonicStorageModule } from '@ionic/storage-angular';

/**
 * Módulo raiz da aplicação QuickDressKids.
 *
 * Declara o componente principal (AppComponent) e importa os módulos
 * essenciais para o funcionamento da aplicação:
 * - IonicModule        → componentes e funcionalidades do Ionic
 * - HttpClientModule   → necessário para os services que leem ficheiros JSON
 * - IonicStorageModule → persistência local (favoritos, carrinho, etc.)
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot()   // inicializa o Storage para toda a aplicação
  ],
  providers: [
    // Usa a estratégia de routing do Ionic em vez da do Angular padrão
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}