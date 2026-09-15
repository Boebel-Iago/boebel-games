import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/progress/progress-reporter';
import { FactCheckerRepository } from './content/fact-checker-repository.service';

@Component({
  selector: 'app-fact-checker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fact-checker.component.html',
  styleUrl: './fact-checker.component.scss'
})
export class FactCheckerComponent implements OnInit {

  gameStage: 1 | 2 = 1;
  currentTaskIndex: number = 0;
  
  // Controle da Fase 2
  hasSearched: boolean = false; 

  showFeedbackModal: boolean = false;
  feedbackText: string = '';
  isCorrectGuess: boolean = false;
  gameFinished: boolean = false;

  constructor(
    private progressReporter: ProgressReporter,
    private repository: FactCheckerRepository
  ) {}

  ngOnInit() {
    this.restoreProgress();
  }

  get currentNewsTask() {
    return this.repository.getNewsTask(this.currentTaskIndex);
  }

  get currentFactCheckTask() {
    return this.repository.getFactCheckTask(this.currentTaskIndex);
  }

  private restoreProgress() {
    const saved = sessionStorage.getItem('currentStage');
    let stage = 1;
    
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        stage = parsed;
      }
    }
    
    const phase1Total = this.repository.getTotalNewsTasks();
    
    if (stage > this.repository.getTotalPhases()) {
      this.gameFinished = true;
    } else if (stage > phase1Total) {
      this.gameStage = 2;
      this.currentTaskIndex = stage - phase1Total - 1;
    } else {
      this.gameStage = 1;
      this.currentTaskIndex = stage - 1;
    }
  }

  private getAbsoluteStage(): number {
    return this.gameStage === 1
      ? this.currentTaskIndex + 1
      : this.repository.getTotalNewsTasks() + this.currentTaskIndex + 1;
  }

  // --- LÓGICA FASE 1 (PARTES DA NOTÍCIA) ---
  checkNewsPart(partId: string) {
    if (this.gameStage !== 1) return;
    
    const task = this.currentNewsTask;
    if (!task) return;

    if (partId === task.id) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ainda não é essa parte! Use sua lupa de detetive e leia com atenção a dica lá em cima.';
      this.showFeedbackModal = true;
    }
  }

  // --- LÓGICA FASE 2 (FATO OU FAKE) ---
  performSearch() {
    this.hasSearched = true;
  }

  voteFactOrFake(vote: boolean) {
    const task = this.currentFactCheckTask;
    if (!task) return;

    if (vote === task.isFact) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ops, detetive! Você foi enganado por essa informação. Leia novamente o que o buscador seguro (Google) disse.';
      this.showFeedbackModal = true;
    }
  }

  // --- NAVEGAÇÃO GERAL ---
  nextStep() {
    this.showFeedbackModal = false;

    if (!this.isCorrectGuess) {
      this.progressReporter.report({
        fase: this.getAbsoluteStage(),
        result: 'failure'
      });
      return;
    }

    const currentAbsolute = this.getAbsoluteStage();
    const isFinished = currentAbsolute >= this.repository.getTotalPhases();

    this.progressReporter.report({
      fase: currentAbsolute,
      result: 'success',
      isLastLevel: isFinished
    });

    if (isFinished) {
      this.gameFinished = true;
      return;
    }

    this.currentTaskIndex++;
    this.hasSearched = false;
    
    if (this.gameStage === 1 && this.currentTaskIndex >= this.repository.getTotalNewsTasks()) {
      this.gameStage = 2;
      this.currentTaskIndex = 0;
    }
  }
}