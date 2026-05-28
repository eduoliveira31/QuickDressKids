import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Página de Perfil do utilizador.
 *
 * Apresenta os dados da conta e as preferências do utilizador.
 * Futuramente integrará autenticação e persistência de dados no Storage.
 */
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {

  constructor() {}

  /**
   * Inicializa a página.
   * Ponto de entrada para carregamento de dados do utilizador (ex: Storage, API).
   */
  ngOnInit() {}
}