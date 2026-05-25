import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.page.html',
  styleUrls: ['./produto-detalhe.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProdutoDetalhePage implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Aqui vamos ler o ID que vem no link!
    const id = this.route.snapshot.paramMap.get('id');
    console.log('O ID do produto que clicaste é:', id);
  }

}