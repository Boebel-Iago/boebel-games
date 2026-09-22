import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfessionsContentService } from '../content/professions-content.service';
import { AcademyMission, Profession, Tool, HwSwChallenge, SoftwareTask, Scenario, Phase3Item } from '../content/models';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  currentMissionIndex: number;
  currentTaskIndex: number;
  displayMode: 'briefing' | 'gameplay' | 'feedback' | 'mission-complete' | 'finished';
  currentDialogueIndex: number;
  gameFinished: boolean;

  // Feedback
  showFeedbackModal: boolean;
  feedbackText: string;
  feedbackHardware: string;
  feedbackSoftware: string;
  isCorrectGuess: boolean;

  // Fase 1
  isHwSwChallenge: boolean;
  hwSwChallengeIndex: number;
  currentOptions: Tool[];
  currentHwSwChallenge: HwSwChallenge | null;

  // Fase 2
  currentSoftwareOptions: string[];

  // Fase 3
  energyBlocks: number;

  // Fase 4
  phase3Level: number;
  showDragError: boolean;
  unassignedItems: Phase3Item[];
  workColumn: Phase3Item[];
  studyColumn: Phase3Item[];
  leisureColumn: Phase3Item[];
}

@Injectable({ providedIn: 'root' })
export class ProfessionsEngineService {
  private contentData: ReturnType<typeof ProfessionsContentService.prototype.getFilteredData>;
  private missions: AcademyMission[];

  private state: GameState = {
    currentMissionIndex: 0,
    currentTaskIndex: 0,
    displayMode: 'briefing',
    currentDialogueIndex: 0,
    gameFinished: false,

    showFeedbackModal: false,
    feedbackText: '',
    feedbackHardware: '',
    feedbackSoftware: '',
    isCorrectGuess: false,

    isHwSwChallenge: false,
    hwSwChallengeIndex: 0,
    currentOptions: [],
    currentHwSwChallenge: null,

    currentSoftwareOptions: [],

    energyBlocks: 0,

    phase3Level: 1,
    showDragError: false,
    unassignedItems: [],
    workColumn: [],
    studyColumn: [],
    leisureColumn: []
  };

  private stateSubject = new BehaviorSubject<GameState>({ ...this.state });

  constructor(
    private content: ProfessionsContentService,
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

  get currentMission(): AcademyMission {
    return this.missions[this.state.currentMissionIndex];
  }

  get totalEnergyBlocks(): number {
    return this.contentData.scenarios.length;
  }

  get professions(): Profession[] { return this.contentData.professions; }
  get hwSwChallenges(): HwSwChallenge[] { return this.contentData.hwSwChallenges; }
  get softwareTasks(): SoftwareTask[] { return this.contentData.softwareTasks; }
  get scenarios(): Scenario[] { return this.contentData.scenarios; }
  get phase3Data(): Phase3Item[][] { return this.contentData.phase3Data; }

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
    if (!isRestore) {
      this.updateState({ isHwSwChallenge: false, hwSwChallengeIndex: 0 });
    }
    switch (this.currentMission.type) {
      case 'tool-match':
        if (!isRestore) this.updateState({ currentTaskIndex: 0 });
        this.loadCurrentMission1Task();
        break;
      case 'software-identify':
        if (!isRestore) this.updateState({ currentTaskIndex: 0 });
        this.loadSoftwareTask();
        break;
      case 'category-sort':
        if (!isRestore) this.updateState({ currentTaskIndex: 0, energyBlocks: 0 });
        break;
      case 'drag-drop':
        if (!isRestore) this.updateState({ phase3Level: 1 });
        this.loadPhase3();
        break;
    }
  }

  private loadCurrentMission1Task() {
    if (this.state.currentTaskIndex < this.professions.length) {
      const prof = this.professions[this.state.currentTaskIndex];
      const opts = [prof.correctTool, ...prof.wrongTools].sort(() => Math.random() - 0.5);
      this.updateState({ currentOptions: opts });
    }
  }

  private loadSoftwareTask() {
    if (this.state.currentTaskIndex < this.softwareTasks.length) {
      const task = this.softwareTasks[this.state.currentTaskIndex];
      const opts = [task.correctAnswer, ...task.wrongAnswers].sort(() => Math.random() - 0.5);
      this.updateState({ currentSoftwareOptions: opts });
    }
  }

  loadPhase3() {
    const lvl = Math.min(this.state.phase3Level, this.phase3Data.length);
    const items = [...this.phase3Data[lvl - 1]].sort(() => Math.random() - 0.5);
    this.updateState({
      workColumn: [], studyColumn: [], leisureColumn: [],
      showDragError: false, unassignedItems: items
    });
  }

  // ==== ACTIONS ====

  checkTool(tool: Tool) {
    const prof = this.professions[this.state.currentTaskIndex];
    if (tool.name === prof.correctTool.name) {
      this.updateState({
        isCorrectGuess: true,
        feedbackText: prof.feedback,
        feedbackHardware: prof.hardwareDesc,
        feedbackSoftware: prof.softwareDesc,
        showFeedbackModal: true
      });
    } else {
      this.updateState({
        isCorrectGuess: false,
        feedbackText: 'Ops! Essa tecnologia não pertence a este profissional. Tente de novo!',
        feedbackHardware: '', feedbackSoftware: '', showFeedbackModal: true
      });
    }
  }

  checkHwSw(answer: 'HARDWARE' | 'SOFTWARE') {
    const challenge = this.state.currentHwSwChallenge!;
    if (answer === challenge.answer) {
      this.updateState({
        isCorrectGuess: true, feedbackText: challenge.explanation,
        feedbackHardware: '', feedbackSoftware: '', showFeedbackModal: true
      });
    } else {
      this.updateState({
        isCorrectGuess: false, feedbackText: `Não é bem assim... A resposta correta é ${challenge.answer}. ${challenge.explanation}`,
        feedbackHardware: '', feedbackSoftware: '', showFeedbackModal: true
      });
    }
  }

  checkSoftwareAnswer(answer: string) {
    const task = this.softwareTasks[this.state.currentTaskIndex];
    if (answer === task.correctAnswer) {
      this.updateState({
        isCorrectGuess: true, feedbackText: task.explanation,
        feedbackHardware: '', feedbackSoftware: '', showFeedbackModal: true
      });
    } else {
      this.updateState({
        isCorrectGuess: false, feedbackText: `Essa não é a resposta certa. Pense no que a ${task.professionName} faz no dia a dia...`,
        feedbackHardware: '', feedbackSoftware: '', showFeedbackModal: true
      });
    }
  }

  checkScenario(answer: 'TRABALHO' | 'ESTUDO' | 'LAZER') {
    const scenario = this.scenarios[this.state.currentTaskIndex];
    if (scenario.type === answer) {
      this.updateState({
        isCorrectGuess: true, feedbackText: scenario.feedback,
        feedbackHardware: scenario.hardwareDesc, feedbackSoftware: scenario.softwareDesc, showFeedbackModal: true
      });
    } else {
      this.updateState({
        isCorrectGuess: false, feedbackText: `Na verdade, essa atividade é um momento de ${scenario.type === 'TRABALHO' ? 'Trabalho 💼' : scenario.type === 'ESTUDO' ? 'Estudo 📚' : 'Lazer 🎮'}.`,
        feedbackHardware: '', feedbackSoftware: '', showFeedbackModal: true
      });
    }
  }

  checkPhase3Answers() {
    if (this.state.unassignedItems.length > 0) return;

    const workOk = this.state.workColumn.every(i => i.category === 'TRABALHO');
    const studyOk = this.state.studyColumn.every(i => i.category === 'ESTUDO');
    const leisureOk = this.state.leisureColumn.every(i => i.category === 'LAZER');

    if (workOk && studyOk && leisureOk) {
      this.updateState({
        isCorrectGuess: true,
        feedbackText: 'Perfeito! Tudo organizado em seus devidos lugares.',
        feedbackHardware: '', feedbackSoftware: '', showFeedbackModal: true
      });
    } else {
      this.updateState({ showDragError: true });
    }
  }

  nextStep() {
    this.updateState({ showFeedbackModal: false });

    if (!this.state.isCorrectGuess) {
      this.reportProgress('failure', false);
      return;
    }

    // Logic to advance tasks depending on mission type
    if (this.currentMission.type === 'tool-match') {
      if (!this.state.isHwSwChallenge && this.state.hwSwChallengeIndex < this.hwSwChallenges.length && (this.state.currentTaskIndex % 2 === 0)) {
        this.updateState({ isHwSwChallenge: true, currentHwSwChallenge: this.hwSwChallenges[this.state.hwSwChallengeIndex] });
      } else {
        if (this.state.isHwSwChallenge) {
          this.updateState({ isHwSwChallenge: false, hwSwChallengeIndex: this.state.hwSwChallengeIndex + 1 });
        }
        if (this.state.currentTaskIndex < this.professions.length - 1) {
          this.updateState({ currentTaskIndex: this.state.currentTaskIndex + 1 });
          this.loadCurrentMission1Task();
        } else {
          this.completeMission();
        }
      }
    } else if (this.currentMission.type === 'software-identify') {
      if (this.state.currentTaskIndex < this.softwareTasks.length - 1) {
        this.updateState({ currentTaskIndex: this.state.currentTaskIndex + 1 });
        this.loadSoftwareTask();
      } else {
        this.completeMission();
      }
    } else if (this.currentMission.type === 'category-sort') {
      this.updateState({ energyBlocks: this.state.energyBlocks + 1 });
      if (this.state.currentTaskIndex < this.scenarios.length - 1) {
        this.updateState({ currentTaskIndex: this.state.currentTaskIndex + 1 });
      } else {
        this.completeMission();
      }
    } else if (this.currentMission.type === 'drag-drop') {
      if (this.state.phase3Level < this.phase3Data.length) {
        this.updateState({ phase3Level: this.state.phase3Level + 1 });
        this.loadPhase3();
      } else {
        this.completeMission();
      }
    }

    this.reportProgress('success', this.state.gameFinished);
  }

  private completeMission() {
    this.updateState({
      displayMode: 'mission-complete',
      currentDialogueIndex: 0
    });
  }

  updateDragState(unassigned: Phase3Item[], work: Phase3Item[], study: Phase3Item[], leisure: Phase3Item[]) {
    this.updateState({
      unassignedItems: unassigned,
      workColumn: work,
      studyColumn: study,
      leisureColumn: leisure
    });
  }

  private reportProgress(result: 'success' | 'failure', isFinished: boolean) {
    const m1 = this.professions.length + this.hwSwChallenges.length;
    const m2 = this.softwareTasks.length;
    const m3 = this.scenarios.length;
    let absoluteFase = 0;
    
    switch (this.state.currentMissionIndex) {
      case 0: absoluteFase = this.state.currentTaskIndex; break;
      case 1: absoluteFase = m1 + this.state.currentTaskIndex; break;
      case 2: absoluteFase = m1 + m2 + this.state.currentTaskIndex; break;
      case 3: absoluteFase = m1 + m2 + m3 + (this.state.phase3Level - 1); break;
    }
    
    this.progressReporter.report({
      levelId: `professions-m${this.state.currentMissionIndex}-t${this.state.currentTaskIndex}`,
      fase: absoluteFase,
      result: result,
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: isFinished
    });
  }

  getAbsoluteStage(): number {
    const m1 = this.professions.length + this.hwSwChallenges.length;
    const m2 = this.softwareTasks.length;
    const m3 = this.scenarios.length;
    switch (this.state.currentMissionIndex) {
      case 0: return this.state.currentTaskIndex;
      case 1: return m1 + this.state.currentTaskIndex;
      case 2: return m1 + m2 + this.state.currentTaskIndex;
      case 3: return m1 + m2 + m3 + (this.state.phase3Level - 1);
      default: return 0;
    }
  }

  getTotalStages(): number {
    return this.professions.length + this.hwSwChallenges.length
         + this.softwareTasks.length
         + this.scenarios.length
         + this.phase3Data.length;
  }
}
