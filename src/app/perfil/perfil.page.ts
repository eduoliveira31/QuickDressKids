import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false // <-- Corrigido para estar de acordo com o enunciado
})
export class PerfilPage implements OnInit {
  
  // Dados de simulação para a interface
  utilizador = {
    nome: 'Maria Silva',
    email: 'maria.silva@email.com',
    foto: 'https://ionicframework.com/docs/img/demos/avatar.svg'
  };

  constructor() {}

  ngOnInit() {}
}