import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/progress/progress-reporter';
import { BrowserSearchRepository } from './content/browser-search-repository.service';

@Component({
  selector: 'app-browser-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browser-search.component.html',
  styleUrl: './browser-search.component.scss'
})
export class BrowserSearchComponent implements OnInit {
  
  gameStage: 1 | 2 = 1;
  currentTaskIndex: number = 0;
  
  availableWords: string[] = [];
  selectedWords: string[] = [];

  showFeedbackModal: boolean = false;
  feedbackText: string = '';
  isCorrectGuess: boolean = false;
  gameFinished: boolean = false;

  constructor(
    private progressReporter: ProgressReporter,
    private repository: BrowserSearchRepository
  ) {}

  ngOnInit() {
    this.restoreProgress();
    this.loadStage();
  }

  get currentBrowserTask() {
    return this.repository.getBrowserTask(this.currentTaskIndex);
  }

  get currentSearchTask() {
    return this.repository.getSearchTask(this.currentTaskIndex);
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
    
    // Convert 1-based absolute stage back to internal tracking
    const phase1Total = this.repository.getTotalBrowserTasks();
    
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
    // Retorna a fase de 1 a N para salvar no banco
    return this.gameStage === 1
      ? this.currentTaskIndex + 1
      : this.repository.getTotalBrowserTasks() + this.currentTaskIndex + 1;
  }

  loadStage() {
    if (this.gameStage === 2) {
      const task = this.currentSearchTask;
      if (task) {
        this.selectedWords = [];
        this.availableWords = [...task.correctKeywords, ...task.distractorWords].sort(() => Math.random() - 0.5);
      }
    }
  }

  checkBrowserPart(partId: string, event?: Event) {
    if (event) event.stopPropagation();
    
    if (this.gameStage !== 1) return;
    
    const task = this.currentBrowserTask;
    if (!task) return;

    if (partId === task.id) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ainda não é essa parte! Leia com atenção a instrução e toque no lugar correto do navegador.';
      this.showFeedbackModal = true;
    }
  }

  selectWord(word: string) {
    this.selectedWords.push(word);
    this.availableWords = this.availableWords.filter(w => w !== word);
  }

  removeWord(word: string) {
    this.availableWords.push(word);
    this.selectedWords = this.selectedWords.filter(w => w !== word);
  }

  checkKeywords() {
    const task = this.currentSearchTask;
    if (!task) return;

    const hasAllCorrect = task.correctKeywords.every(w => this.selectedWords.includes(w));
    const hasNoDistractors = this.selectedWords.every(w => task.correctKeywords.includes(w));

    if (hasAllCorrect && hasNoDistractors) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Sua pesquisa está confusa! Lembre-se: remova palavras como "eu", "o", "que", "como". Deixe apenas as palavras mais importantes!';
      this.showFeedbackModal = true;
    }
  }

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

    // Avançar internamente
    this.currentTaskIndex++;
    if (this.gameStage === 1 && this.currentTaskIndex >= this.repository.getTotalBrowserTasks()) {
      this.gameStage = 2;
      this.currentTaskIndex = 0;
    }
    
    this.loadStage();
  }
}