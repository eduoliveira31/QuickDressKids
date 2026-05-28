import { Component, OnInit } from '@angular/core';
import { ReservasService, Reserva } from '../services/reservas';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  standalone: false 
})
export class ReservasPage implements OnInit {
  
  constructor() {}
  
  ngOnInit() {}

  // Já não precisamos de funções para abrir o alerta! Tudo vai ser gerido no HTML.
}