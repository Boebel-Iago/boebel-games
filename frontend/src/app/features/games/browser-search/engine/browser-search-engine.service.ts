import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrowserSearchContentService } from '../content/browser-search-content.service';
import { CyberMission, SearchTask } from '../content/models';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  currentMissionIndex: number;
  currentTaskIndex: number;
  displayMode: 'briefing' | 'gameplay' | 'feedback';
  briefingIndex: number;
  isCorrectGuess: boolean;
  feedbackText: string;
  gameFinished: boolean;
  availableWords: string[];
  selectedWords: string[];
  currentMistakes: number;
}

@Injectable({ providedIn: 'root' })
export class BrowserSearchEngineService {
  private missions: CyberMission[];
  
  private state: GameState = {
    currentMissionIndex: 0,
    currentTaskIndex: 0,
    displayMode: 'briefing',
    briefingIndex: 0,
    isCorrectGuess: false,
    feedbackText: '',
    gameFinished: false,
    availableWords: [],
    selectedWords: [],
    currentMistakes: 0
  };

  private stateSubject = new BehaviorSubject<GameState>({ ...this.state });

  constructor(
    private content: BrowserSearchContentService,
    private progressReporter: ProgressReporter
  ) {
    this.missions = this.content.getMissions();
  }

  get state$(): Observable<GameState> {
    return this.stateSubject.asObservable();
  }

  get stateValue(): GameState {
    return this.state;
  }

  get activeMission(): CyberMission {
    return this.missions[this.state.currentMissionIndex];
  }

  get activeTask(): any {
    return this.activeMission.tasks[this.state.currentTaskIndex];
  }

  private updateState(updates: Partial<GameState>) {
    this.state = { ...this.state, ...updates };
    this.stateSubject.next({ ...this.state });
  }

  restoreProgress(savedState: Partial<GameState>) {
    this.updateState(savedState);
    if (this.state.displayMode === 'gameplay') {
      this.setupTask();
    }
  }

  nextBriefing() {
    if (this.state.briefingIndex < this.activeMission.briefing.length - 1) {
      this.updateState({ briefingIndex: this.state.briefingIndex + 1 });
    } else {
      this.updateState({ displayMode: 'gameplay' });
      this.setupTask();
    }
  }

  setupTask() {
    if (this.activeMission.type === 'keyword_search') {
      const task = this.activeTask as SearchTask;
      const available = [...task.correctKeywords, ...task.distractorWords].sort(() => Math.random() - 0.5);
      this.updateState({
        selectedWords: [],
        availableWords: available,
        currentMistakes: 0
      });
    }
  }

  nextStep() {
    this.updateState({ displayMode: 'gameplay' });

    if (!this.state.isCorrectGuess) {
      this.reportProgress('failure', false);
      this.setupTask();
      return;
    }

    const oldStage = (this.state.currentMissionIndex * 10) + this.state.currentTaskIndex;

    if (this.state.currentTaskIndex < this.activeMission.tasks.length - 1) {
      this.updateState({ currentTaskIndex: this.state.currentTaskIndex + 1 });
      this.setupTask();
    } else {
      if (this.state.currentMissionIndex < this.missions.length - 1) {
        this.updateState({
          currentMissionIndex: this.state.currentMissionIndex + 1,
          currentTaskIndex: 0,
          briefingIndex: 0,
          displayMode: 'briefing'
        });
      } else {
        this.updateState({ gameFinished: true });
      }
    }
    
    this.reportProgress('success', this.state.gameFinished, oldStage);
  }

  private reportProgress(result: 'success' | 'failure', isFinished: boolean, overrideFase?: number) {
    const fase = overrideFase !== undefined ? overrideFase : (this.state.currentMissionIndex * 10) + this.state.currentTaskIndex;
    
    this.progressReporter.report({
      levelId: `browser-search-m${this.state.currentMissionIndex}-t${this.state.currentTaskIndex}`,
      fase: fase,
      result: result,
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: isFinished
    });
  }

  checkAnatomy(partId: string) {
    if (this.activeMission.type !== 'anatomy') return;
    
    if (partId === this.activeTask.id) {
      this.updateState({
        isCorrectGuess: true,
        feedbackText: this.activeTask.feedback,
        displayMode: 'feedback'
      });
    } else {
      this.updateState({
        isCorrectGuess: false,
        feedbackText: 'Bzzz! Erro de navegação. Leia com atenção a instrução e toque no lugar correto do painel.',
        displayMode: 'feedback'
      });
    }
  }

  selectWord(word: string) {
    this.updateState({
      selectedWords: [...this.state.selectedWords, word],
      availableWords: this.state.availableWords.filter(w => w !== word)
    });
  }

  removeWord(word: string) {
    this.updateState({
      availableWords: [...this.state.availableWords, word],
      selectedWords: this.state.selectedWords.filter(w => w !== word)
    });
  }

  checkKeywords() {
    if (this.activeMission.type !== 'keyword_search') return;
    
    const task = this.activeTask as SearchTask;
    let isCorrect = false;
    
    const hasAllCorrectPrimary = task.correctKeywords.every(w => this.state.selectedWords.includes(w));
    const hasNoDistractorsPrimary = this.state.selectedWords.every(w => task.correctKeywords.includes(w));
    
    if (hasAllCorrectPrimary && hasNoDistractorsPrimary && this.state.selectedWords.length === task.correctKeywords.length) {
      isCorrect = true;
    } else if (task.alternativeKeywords) {
      for (const alt of task.alternativeKeywords) {
        const hasAllCorrectAlt = alt.every(w => this.state.selectedWords.includes(w));
        const hasNoDistractorsAlt = this.state.selectedWords.every(w => alt.includes(w));
        if (hasAllCorrectAlt && hasNoDistractorsAlt && this.state.selectedWords.length === alt.length) {
          isCorrect = true;
          break;
        }
      }
    }

    if (isCorrect) {
      this.updateState({
        isCorrectGuess: true,
        feedbackText: task.feedback,
        displayMode: 'feedback'
      });
    } else {
      this.updateState({
        isCorrectGuess: false,
        feedbackText: 'O motor engasgou! Reveja as palavras essenciais da busca. Cuidado com detalhes desnecessários!',
        currentMistakes: this.state.currentMistakes + 1,
        displayMode: 'feedback'
      });
    }
  }
}
