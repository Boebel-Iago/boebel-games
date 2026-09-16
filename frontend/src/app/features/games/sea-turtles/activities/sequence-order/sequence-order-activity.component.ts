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
    // Embaralha só a ordem de exibição no "pool" — a ordem certa continua em correctOrder.
    this.pool = [...this.phase.cards].sort(() => Math.random() - 0.5);
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
}