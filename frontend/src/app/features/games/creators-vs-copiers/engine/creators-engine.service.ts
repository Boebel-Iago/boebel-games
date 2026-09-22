import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreatorsContentService } from '../content/creators-content.service';
import { CreatorsMission, LicenseTask, PlagiarismTask } from '../content/models';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  currentMissionIndex: number;
  currentTaskIndex: number;
  displayMode: 'briefing' | 'gameplay' | 'mission-complete' | 'finished';
  currentDialogueIndex: number;
  gameFinished: boolean;

  showFeedbackModal: boolean;
  feedbackText: string;
  isCorrectGuess: boolean;

  currentOptions: string[];
}

@Injectable({ providedIn: 'root' })
export class CreatorsEngineService {
  private contentData: ReturnType<typeof CreatorsContentService.prototype.getFilteredData>;
  private missions: CreatorsMission[];

  private state: GameState = {
    currentMissionIndex: 0,
    currentTaskIndex: 0,
    displayMode: 'briefing',
    currentDialogueIndex: 0,
    gameFinished: false,

    showFeedbackModal: false,
    feedbackText: '',
    isCorrectGuess: false,

    currentOptions: []
  };

  private stateSubject = new BehaviorSubject<GameState>({ ...this.state });

  constructor(
    private content: CreatorsContentService,
    private progressReporter: ProgressReporter
  ) {
    const isDemo = sessionStorage.getItem('isDemoMode') === 'true';
    this.contentData = this.content.getFilteredData(isDemo);
    this.missions = this.content.missions;
  }

  get state$(): Observable<GameState> {
    return this.stateSubject.asObservable();
  }

  get stateValue(): GameState {
    return this.state;
  }

  get currentMission(): CreatorsMission {
    return this.missions[this.state.currentMissionIndex];
  }

  get licenseTasks(): LicenseTask[] { return this.contentData.licenseTasks; }
  get plagiarismTasksModule2(): PlagiarismTask[] { return this.contentData.plagiarismTasksModule2; }
  get plagiarismTasksModule3(): PlagiarismTask[] { return this.contentData.plagiarismTasksModule3; }

  private updateState(updates: Partial<GameState>) {
    this.state = { ...this.state, ...updates };
    this.stateSubject.next({ ...this.state });
  }

  restoreProgress(savedState: Partial<GameState>) {
    this.updateState(savedState);
    if (this.state.displayMode === 'gameplay') {
      this.startMission(true);
    }
  }

  advanceDialogue() {
    if (this.state.displayMode === 'briefing') {
      if (this.state.currentDialogueIndex < this.currentMission.briefing.length - 1) {
        this.updateState({ currentDialogueIndex: this.state.currentDialogueIndex + 1 });
      } else {
        this.updateState({ currentDialogueIndex: 0, displayMode: 'gameplay' });
        this.startMission();
      }
    } else if (this.state.displayMode === 'mission-complete') {
      if (this.state.currentDialogueIndex < this.currentMission.debriefing.length - 1) {
        this.updateState({ currentDialogueIndex: this.state.currentDialogueIndex + 1 });
      } else {
        const nextIdx = this.state.currentMissionIndex + 1;
        if (nextIdx >= this.missions.length) {
          this.updateState({ currentDialogueIndex: 0, currentMissionIndex: nextIdx, currentTaskIndex: 0, gameFinished: true, displayMode: 'finished' });
        } else {
          this.updateState({ currentDialogueIndex: 0, currentMissionIndex: nextIdx, currentTaskIndex: 0, displayMode: 'briefing' });
        }
      }
    }
  }

  private startMission(isRestore = false) {
    if (!isRestore) this.updateState({ currentTaskIndex: 0 });
    this.loadCurrentTask();
  }

  private loadCurrentTask() {
    if (this.currentMission.type === 'license-cards') {
      if (this.state.currentTaskIndex < this.licenseTasks.length) {
        const task = this.licenseTasks[this.state.currentTaskIndex];
        const opts = [task.correctAnswer, ...task.wrongAnswers].sort(() => Math.random() - 0.5);
        this.updateState({ currentOptions: opts });
      }
    }
  }

  // ==== ACTIONS ====

  checkLicense(selectedAnswer: string) {
    if (this.currentMission.type !== 'license-cards') return;
    
    const task = this.licenseTasks[this.state.currentTaskIndex];
    if (selectedAnswer === task.correctAnswer) {
      this.updateState({
        isCorrectGuess: true,
        feedbackText: task.feedback,
        showFeedbackModal: true
      });
    } else {
      this.updateState({
        isCorrectGuess: false,
        feedbackText: 'Cuidado! Leia o símbolo novamente. Lembre-se do que conversamos sobre Direitos Autorais e Creative Commons.',
        showFeedbackModal: true
      });
    }
  }

  votePlagiarism(voteForCorrectUse: boolean) {
    if (this.currentMission.type !== 'plagiarism-court') return;

    let task: PlagiarismTask;
    if (this.state.currentMissionIndex === 1) {
      task = this.plagiarismTasksModule2[this.state.currentTaskIndex];
    } else {
      task = this.plagiarismTasksModule3[this.state.currentTaskIndex];
    }
    
    if (voteForCorrectUse === task.isCorrectUse) {
      this.updateState({
        isCorrectGuess: true,
        feedbackText: task.feedback,
        showFeedbackModal: true
      });
    } else {
      this.updateState({
        isCorrectGuess: false,
        feedbackText: voteForCorrectUse 
          ? 'Atenção, Juiz! Você deixou um plágio passar despercebido. Leia a atitude do aluno novamente.' 
          : 'Opa! Você penalizou um aluno que fez tudo certo. Lembre-se: se há créditos ou uso apropriado, está correto!',
        showFeedbackModal: true
      });
    }
  }

  nextStep() {
    this.updateState({ showFeedbackModal: false });

    if (!this.state.isCorrectGuess) {
      this.reportProgress('failure', false);
      return;
    }

    let isMissionComplete = false;

    if (this.currentMission.type === 'license-cards') {
      if (this.state.currentTaskIndex < this.licenseTasks.length - 1) {
        this.updateState({ currentTaskIndex: this.state.currentTaskIndex + 1 });
        this.loadCurrentTask();
      } else {
        isMissionComplete = true;
      }
    } else if (this.currentMission.type === 'plagiarism-court') {
      const taskArray = this.state.currentMissionIndex === 1 ? this.plagiarismTasksModule2 : this.plagiarismTasksModule3;
      if (this.state.currentTaskIndex < taskArray.length - 1) {
        this.updateState({ currentTaskIndex: this.state.currentTaskIndex + 1 });
      } else {
        isMissionComplete = true;
      }
    }

    if (isMissionComplete) {
      this.updateState({
        displayMode: 'mission-complete',
        currentDialogueIndex: 0
      });
    }

    this.reportProgress('success', this.state.gameFinished);
  }

  private reportProgress(result: 'success' | 'failure', isFinished: boolean) {
    const m1 = this.licenseTasks.length;
    const m2 = this.plagiarismTasksModule2.length;
    let absoluteFase = 0;
    
    switch (this.state.currentMissionIndex) {
      case 0: absoluteFase = this.state.currentTaskIndex; break;
      case 1: absoluteFase = m1 + this.state.currentTaskIndex; break;
      case 2: absoluteFase = m1 + m2 + this.state.currentTaskIndex; break;
    }
    
    this.progressReporter.report({
      levelId: `creators-vs-copiers-m${this.state.currentMissionIndex}-t${this.state.currentTaskIndex}`,
      fase: absoluteFase,
      result: result,
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: isFinished
    });
  }

  getAbsoluteStage(): number {
    const m1 = this.licenseTasks.length;
    const m2 = this.plagiarismTasksModule2.length;
    switch (this.state.currentMissionIndex) {
      case 0: return this.state.currentTaskIndex;
      case 1: return m1 + this.state.currentTaskIndex;
      case 2: return m1 + m2 + this.state.currentTaskIndex;
      default: return 0;
    }
  }

  getTotalStages(): number {
    return this.licenseTasks.length + this.plagiarismTasksModule2.length + this.plagiarismTasksModule3.length;
  }
}
