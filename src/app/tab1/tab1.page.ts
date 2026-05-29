import { Component, OnInit } from '@angular/core';
import { Catalogo } from '../services/catalogo';
import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  featuredProducts: any[] = [];
  currentUser: Usuario | null = null;

  exploracaoCards = [
    {
      title: 'Cerimónia',
      subtitle: 'Looks elegantes para ocasiões especiais.',
      icon: 'sparkles-outline',
      color: '#2563eb'
    },
    {
      title: 'Bebé Conforto',
      subtitle: 'Peças suaves e práticas para o dia a dia.',
      icon: 'heart-outline',
      color: '#ec4899'
    },
    {
      title: 'Denim & Essenciais',
      subtitle: 'Básicos cheios de estilo e conforto.',
      icon: 'shirt-outline',
      color: '#0ea5e9'
    }
  ];

  constructor(
    private catalogoService: Catalogo,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.catalogoService.getProdutosDestaque().subscribe((produtos: any[]) => {
      this.featuredProducts = produtos.slice(0, 4);
    });
  }

}
