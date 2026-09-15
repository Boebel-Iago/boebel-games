import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-free-games',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './free-games.component.html'
})
export class FreeGamesComponent {
  games = [
    {
      id: 'sea-turtles',
      title: 'Das Areias ao Mar',
      description: 'Ajude as tartarugas a chegarem ao mar desviando dos obstáculos. Aprenda sobre algoritmos, padrões e lógica computacional!',
      icon: '🐢',
      color: 'bg-emerald-500',
      route: '/free/sea-turtles'
    },
    {
      id: 'emergency-escape',
      title: 'Fuga de Emergência',
      description: 'Programe os movimentos do robô usando blocos para escapar da sala antes que o tempo acabe. Desafios intensos de lógica!',
      icon: '🚨',
      color: 'bg-red-500',
      route: '/free/emergency-escape'
    }
  ];
}
