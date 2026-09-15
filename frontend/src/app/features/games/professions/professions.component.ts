import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/progress/progress-reporter';
import { ProfessionsRepository } from './content/professions-repository.service';
import { Tool } from './content/professions.model';

@Component({
  selector: 'app-professions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professions.component.html',
  styleUrl: './professions.component.scss'
})
export class ProfessionsComponent implements OnInit {

  gameStage: 1 | 2 = 1;
  currentIndex: number = 0;
  currentOptions: Tool[] = [];
  
  showFeedbackModal: boolean = false;
  feedbackText: string = '';
  feedbackHardware: string = '';
  feedbackSoftware: string = '';
  isCorrectGuess: boolean = false;
  gameFinished: boolean = false;

  constructor(
    private progressReporter: ProgressReporter,
    private repository: ProfessionsRepository
  ) {}

  ngOnInit() {
    this.restoreProgress();
    this.loadProfession();
  }

  get currentProfession() {
    return this.repository.getProfession(this.currentIndex);
  }

  get currentScenario() {
    return this.repository.getScenario(this.currentIndex);
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
    
    const phase1Total = this.repository.getTotalProfessions();
    
    if (stage > this.repository.getTotalPhases()) {
      this.gameFinished = true;
    } else if (stage > phase1Total) {
      this.gameStage = 2;
      this.currentIndex = stage - phase1Total - 1;
    } else {
      this.gameStage = 1;
      this.currentIndex = stage - 1;
    }
  }

  private getAbsoluteStage(): number {
    return this.gameStage === 1
      ? this.currentIndex + 1
      : this.repository.getTotalProfessions() + this.currentIndex + 1;
  }

  loadProfession() {
    if (this.gameStage === 1) {
      const prof = this.currentProfession;
      if (prof) {
        this.currentOptions = [prof.correctTool, ...prof.wrongTools].sort(() => Math.random() - 0.5);
      }
    }
  }

  checkTool(tool: Tool) {
    const prof = this.currentProfession;
    if (!prof) return;

    if (tool.name === prof.correctTool.name) {
      this.isCorrectGuess = true;
      this.feedbackText = prof.feedback;
      this.feedbackHardware = prof.hardwareDesc;
      this.feedbackSoftware = prof.softwareDesc;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ops! Essa tecnologia não pertence a este profissional. Tente de novo!';
      this.feedbackHardware = '';
      this.feedbackSoftware = '';
    }
    this.showFeedbackModal = true;
  }

  checkScenario(answer: 'TRABALHO' | 'LAZER') {
    const scenario = this.currentScenario;
    if (!scenario) return;

    if (scenario.type === answer) {
      this.isCorrectGuess = true;
      this.feedbackText = scenario.feedback;
      this.feedbackHardware = scenario.hardwareDesc;
      this.feedbackSoftware = scenario.softwareDesc;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = `Na verdade, essa atividade é um momento de ${scenario.type.toLowerCase()}.`;
      this.feedbackHardware = '';
      this.feedbackSoftware = '';
    }
    this.showFeedbackModal = true;
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

    this.currentIndex++;
    if (this.gameStage === 1 && this.currentIndex >= this.repository.getTotalProfessions()) {
      this.gameStage = 2;
      this.currentIndex = 0;
    } else if (this.gameStage === 1) {
      this.loadProfession();
    }
  }
}