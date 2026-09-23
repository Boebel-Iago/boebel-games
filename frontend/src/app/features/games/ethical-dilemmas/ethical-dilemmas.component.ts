import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthicalDilemmasEngineService } from './engine/ethical-dilemmas-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

@Component({
  selector: 'app-ethical-dilemmas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ethical-dilemmas.component.html',
  styleUrls: ['./ethical-dilemmas.component.scss']
})
/**
 * EthicalDilemmasComponent
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class EthicalDilemmasComponent implements OnInit {
  engine = inject(EthicalDilemmasEngineService);
  progress = inject(ProgressReporter);

  get state() {
    return this.engine.state();
  }

  ngOnInit() {
    this.engine.reset();
  }

  completePhase(isLastLevel: boolean) {
    this.progress.report({
      levelId: `fase-${this.state.fase}`,
      fase: this.state.fase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });
    if (!isLastLevel) {
      this.engine.setFase(this.state.fase + 1);
    }
  }

  reportMistake() {
    this.progress.report({
      levelId: `fase-${this.state.fase}`,
      fase: this.state.fase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });
    alert('Oops! Tente novamente.');
  }

  selectOption(correct: boolean) {
    if (correct) {
      this.completePhase(false);
    } else {
      this.reportMistake();
    }
  }

  selectCard(cardId: number, category: 'good' | 'bad' | null) {
    this.engine.setCardCategory(cardId, category);
  }

  checkPhase3() {
    const allAssigned = this.state.cards.every(c => c.category !== null);
    if (!allAssigned) {
      alert('Coloque todos os cards em alguma categoria!');
      return;
    }
    const allCorrect = this.state.cards.every(c => c.category === c.correctCategory);
    if (allCorrect) {
      this.completePhase(true);
      alert('Parabéns! Você concluiu o jogo com sucesso e é um ótimo Cidadão Digital!');
    } else {
      this.reportMistake();
    }
  }
}
