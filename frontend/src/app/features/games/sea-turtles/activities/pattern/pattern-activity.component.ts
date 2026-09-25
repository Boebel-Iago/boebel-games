import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatternOption, PatternPhaseConfig, PatternRound } from '../../content/phase.model';

@Component({
  selector: 'app-pattern-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pattern-activity.component.html'
})
export class PatternActivityComponent implements OnChanges {
  @Input({ required: true }) phase!: PatternPhaseConfig;
  @Output() completed = new EventEmitter<boolean>();

  roundIndex = 0;
  wrongOptionId: string | null = null;
  justCorrect = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['phase']) {
      this.roundIndex = 0;
      this.wrongOptionId = null;
      this.justCorrect = false;
    }
  }

  get currentRound(): PatternRound {
    return this.phase.rounds[this.roundIndex];
  }

  get isLastRound(): boolean {
    return this.roundIndex === this.phase.rounds.length - 1;
  }

  selectOption(option: PatternOption): void {
    if (this.justCorrect) return; // já acertou essa rodada, esperando avançar

    if (option.isCorrect) {
      this.wrongOptionId = null;
      this.justCorrect = true;
      setTimeout(() => this.advance(), 500);
    } else {
      this.wrongOptionId = option.id;
      this.completed.emit(false); // Reporta erro para o orquestrador contabilizar
    }
  }

  private advance(): void {
    this.justCorrect = false;
    if (this.isLastRound) {
      this.completed.emit(true);
    } else {
      this.roundIndex++;
      this.wrongOptionId = null;
    }
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}