import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/progress/progress-reporter';
import { CreatorsVsCopiersRepository } from './content/creators-vs-copiers-repository.service';

@Component({
  selector: 'app-creators-vs-copiers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creators-vs-copiers.component.html',
  styleUrl: './creators-vs-copiers.component.scss'
})
export class CreatorsVsCopiersComponent implements OnInit {

  gameStage: 1 | 2 = 1;
  currentTaskIndex: number = 0;
  
  // Controle da Fase 1
  currentOptions: string[] = [];

  showFeedbackModal: boolean = false;
  feedbackText: string = '';
  isCorrectGuess: boolean = false;
  gameFinished: boolean = false;

  constructor(
    private progressReporter: ProgressReporter,
    private repository: CreatorsVsCopiersRepository
  ) {}

  ngOnInit() {
    this.restoreProgress();
    this.loadStage();
  }

  get currentLicenseTask() {
    return this.repository.getLicenseTask(this.currentTaskIndex);
  }

  get currentPlagiarismTask() {
    return this.repository.getPlagiarismTask(this.currentTaskIndex);
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
    
    const phase1Total = this.repository.getTotalLicenseTasks();
    
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
      : this.repository.getTotalLicenseTasks() + this.currentTaskIndex + 1;
  }

  loadStage() {
    if (this.gameStage === 1) {
      const task = this.currentLicenseTask;
      if (task) {
        this.currentOptions = [task.correctAnswer, ...task.wrongAnswers].sort(() => Math.random() - 0.5);
      }
    }
  }

  // --- LÓGICA FASE 1 ---
  checkLicense(selectedAnswer: string) {
    if (this.gameStage !== 1) return;
    
    const task = this.currentLicenseTask;
    if (!task) return;

    if (selectedAnswer === task.correctAnswer) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Cuidado! Leia o símbolo novamente. Lembre-se do que conversamos sobre Direitos Autorais e Creative Commons.';
    }
    this.showFeedbackModal = true;
  }

  // --- LÓGICA FASE 2 ---
  votePlagiarism(voteForCorrectUse: boolean) {
    const task = this.currentPlagiarismTask;
    if (!task) return;

    if (voteForCorrectUse === task.isCorrectUse) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = voteForCorrectUse 
        ? 'Atenção, Juiz! Você deixou um plágio passar despercebido. Leia a atitude do aluno novamente.' 
        : 'Opa! Você penalizou um aluno que fez tudo certo. Lembre-se: se há créditos ou licença livre, está correto!';
    }
    this.showFeedbackModal = true;
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
    if (this.gameStage === 1 && this.currentTaskIndex >= this.repository.getTotalLicenseTasks()) {
      this.gameStage = 2;
      this.currentTaskIndex = 0;
    }
    
    this.loadStage();
  }
}