import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SequenceCard, SequenceOrderPhaseConfig } from '../../content/phase.model';

@Component({
  selector: 'app-sequence-order-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sequence-order-activity.component.html'
})
export class SequenceOrderActivityComponent implements OnChanges {
  @Input({ required: true }) phase!: SequenceOrderPhaseConfig;
  @Output() completed = new EventEmitter<boolean>();

  pool: SequenceCard[] = [];
  placedSequence: SequenceCard[] = [];
  wrongCardId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['phase']) {
      this.reset();
    }
  }

  private reset(): void {
    this.pool = [...this.phase.cards];
    
    // Algoritmo Fisher-Yates verdadeiro para embaralhamento e trava contra a ordem correta
    let isPerfectlyOrdered = true;
    while (isPerfectlyOrdered && this.pool.length > 1) {
      // Fisher-Yates Shuffle
      for (let i = this.pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.pool[i], this.pool[j]] = [this.pool[j], this.pool[i]];
      }
      
      // Checa se, por azar, as cartas caíram na ordem exata da resposta
      isPerfectlyOrdered = this.pool.every((card, index) => card.correctOrder === index);
    }
    
    this.placedSequence = [];
    this.wrongCardId = null;
  }

  selectCard(card: SequenceCard): void {
    const expectedNextIndex = this.placedSequence.length;

    if (card.correctOrder === expectedNextIndex) {
      this.wrongCardId = null;
      this.placedSequence.push(card);
      this.pool = this.pool.filter(c => c.id !== card.id);

      if (this.placedSequence.length === this.phase.cards.length) {
        setTimeout(() => this.completed.emit(true), 500);
      }
    } else {
      this.wrongCardId = card.id;
    }
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}