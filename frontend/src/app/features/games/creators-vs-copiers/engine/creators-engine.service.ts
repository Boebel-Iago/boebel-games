import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreatorsContentService } from '../content/creators-content.service';
import { CreatorsMission, LicenseTask, PlagiarismTask, DragDropItem, AuditTask } from '../content/models';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  currentMissionIndex: number;
  currentTaskIndex: number; // Also acts as phase level for drag-drop
  displayMode: 'briefing' | 'gameplay' | 'mission-complete' | 'finished';
  currentDialogueIndex: number;
  gameFinished: boolean;

  showFeedbackModal: boolean;
  feedbackText: string;
  isCorrectGuess: boolean;

  currentOptions: string[];

  // Drag Drop State
  showDragError: boolean;
  unassignedItems: DragDropItem[];
  freeCol: DragDropItem[];
  creditsCol: DragDropItem[];
  plagiarismCol: DragDropItem[];
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

    currentOptions: [],

    showDragError: false,
    unassignedItems: [],
    freeCol: [],
    creditsCol: [],
    plagiarismCol: []
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
  get dragDropData(): DragDropItem[][] { return this.contentData.dragDropData; }
  get auditTasks(): AuditTask[] { return this.contentData.auditTasks; }

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

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private startMission(isRestore = false) {
    if (!isRestore) this.updateState({ currentTaskIndex: 0 });
    this.loadCurrentTask();
  }

  private loadCurrentTask() {
    if (this.currentMission.type === 'license-cards') {
      if (this.state.currentTaskIndex < this.licenseTasks.length) {
        const task = this.licenseTasks[this.state.currentTaskIndex];
        const opts = this.shuffleArray([task.correctAnswer, ...task.wrongAnswers]);
        this.updateState({ currentOptions: opts });
      }
    } else if (this.currentMission.type === 'drag-drop') {
      const lvl = Math.min(this.state.currentTaskIndex, this.dragDropData.length - 1);
      const items = this.shuffleArray([...this.dragDropData[lvl]]);
      this.updateState({
        freeCol: [], creditsCol: [], plagiarismCol: [],
        showDragError: false, unassignedItems: items
      });
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

  updateDragState(unassigned: DragDropItem[], free: DragDropItem[], credits: DragDropItem[], plagiarism: DragDropItem[]) {
    this.updateState({
      unassignedItems: unassigned,
      freeCol: free,
      creditsCol: credits,
      plagiarismCol: plagiarism
    });
  }

  checkDragDropAnswers() {
    if (this.state.unassignedItems.length > 0) return;

    const freeOk = this.state.freeCol.every(i => i.category === 'LIVRE');
    const creditsOk = this.state.creditsCol.every(i => i.category === 'CREDITOS');
    const plagioOk = this.state.plagiarismCol.every(i => i.category === 'PLAGIO');

    if (freeOk && creditsOk && plagioOk) {
      this.updateState({
        isCorrectGuess: true,
        feedbackText: 'Perfeito! Tudo classificado corretamente. A Delegacia agradece.',
        showFeedbackModal: true
      });
    } else {
      this.updateState({ showDragError: true });
    }
  }

  voteAudit(voteForApproved: boolean) {
    if (this.currentMission.type !== 'audit') return;

    const task = this.auditTasks[this.state.currentTaskIndex];
    
    if (voteForApproved === task.isApproved) {
      this.updateState({
        isCorrectGuess: true,
        feedbackText: task.feedback,
        showFeedbackModal: true
      });
    } else {
      this.updateState({
        isCorrectGuess: false,
        feedbackText: voteForApproved 
          ? 'Auditoria Falhou! Você aprovou algo que pode render um processo para a escola!' 
          : 'Calma, Auditor! Você reprovou um recurso que estava sendo usado de forma perfeitamente legal.',
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

    const oldStage = this.getAbsoluteStage();
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
    } else if (this.currentMission.type === 'drag-drop') {
      if (this.state.currentTaskIndex < this.dragDropData.length - 1) {
        this.updateState({ currentTaskIndex: this.state.currentTaskIndex + 1 });
        this.loadCurrentTask();
      } else {
        isMissionComplete = true;
      }
    } else if (this.currentMission.type === 'audit') {
      if (this.state.currentTaskIndex < this.auditTasks.length - 1) {
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

    this.reportProgress('success', this.state.gameFinished, oldStage);
  }

  private reportProgress(result: 'success' | 'failure', isFinished: boolean, overrideFase?: number) {
    const fase = overrideFase !== undefined ? overrideFase : this.getAbsoluteStage();
    
    this.progressReporter.report({
      levelId: `creators-vs-copiers-m${this.state.currentMissionIndex}-t${this.state.currentTaskIndex}`,
      fase: fase,
      result: result,
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: isFinished
    });
  }

  getAbsoluteStage(): number {
    const m1 = this.licenseTasks.length;
    const m2 = this.plagiarismTasksModule2.length;
    const m3 = this.plagiarismTasksModule3.length;
    const m4 = this.dragDropData.length;
    switch (this.state.currentMissionIndex) {
      case 0: return this.state.currentTaskIndex;
      case 1: return m1 + this.state.currentTaskIndex;
      case 2: return m1 + m2 + this.state.currentTaskIndex;
      case 3: return m1 + m2 + m3 + this.state.currentTaskIndex;
      case 4: return m1 + m2 + m3 + m4 + this.state.currentTaskIndex;
      default: return 0;
    }
  }

  getTotalStages(): number {
    return this.licenseTasks.length + 
           this.plagiarismTasksModule2.length + 
           this.plagiarismTasksModule3.length + 
           this.dragDropData.length + 
           this.auditTasks.length;
  }
}
