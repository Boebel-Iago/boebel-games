import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';
import { BehaviorSubject } from 'rxjs';

export interface GameState {
  fase: number;
  enteredPassword: string;
  phase1Items: { id: string, text: string, type: 'safe' | 'risk', placed: 'none' | 'safe' | 'risk' }[];
  phase2Solved: boolean;
  phase3Items: { id: string, text: string, type: 'safe' | 'risk', placed: 'none' | 'safe' | 'risk' }[];
}

@Injectable({
  providedIn: 'root'
})
/**
 * PasswordMysteryEngineService
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class PasswordMysteryEngineService {
  private initialState: GameState = {
    fase: 0,
    enteredPassword: '',
    phase1Items: [
      { id: 'p1_1', text: 'Memorizar a senha 🧠', type: 'safe', placed: 'none' },
      { id: 'p1_2', text: 'Contar para o amigo 🗣️', type: 'risk', placed: 'none' }
    ],
    phase2Solved: false,
    phase3Items: [
      { id: 'p3_1', text: 'Anotar na mesa ✏️', type: 'risk', placed: 'none' },
      { id: 'p3_2', text: 'Esconder a senha 🙈', type: 'safe', placed: 'none' },
      { id: 'p3_3', text: 'Usar a senha do colega 🕵️', type: 'risk', placed: 'none' },
      { id: 'p3_4', text: 'Criar uma senha difícil 🔒', type: 'safe', placed: 'none' }
    ]
  };

  private state = new BehaviorSubject<GameState>(this.initialState);
  state$ = this.state.asObservable();

  constructor(private progress: ProgressReporter) {}

  get currentState() {
    return this.state.value;
  }

  completePhase(isLastLevel: boolean) {
    this.progress.report({
      levelId: `fase-${this.currentState.fase}`,
      fase: this.currentState.fase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });
    
    if (!isLastLevel) {
      this.state.next({
        ...this.currentState,
        fase: this.currentState.fase + 1
      });
    }
  }

  reportMistake() {
    this.progress.report({
      levelId: `fase-${this.currentState.fase}`,
      fase: this.currentState.fase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });
  }

  enterDigit(digit: string) {
    const current = this.currentState.enteredPassword;
    if (current.length < 4) {
      this.state.next({ ...this.currentState, enteredPassword: current + digit });
    }
  }
  
  clearPassword() {
    this.state.next({ ...this.currentState, enteredPassword: '' });
  }

  checkPassword() {
    if (this.currentState.enteredPassword === '1234') {
      this.completePhase(false);
    } else {
      this.reportMistake();
      this.clearPassword();
    }
  }

  placeItem(phase: 1 | 3, itemId: string, target: 'safe' | 'risk') {
    const itemsKey = phase === 1 ? 'phase1Items' : 'phase3Items';
    const items = [...this.currentState[itemsKey]];
    const itemIndex = items.findIndex(i => i.id === itemId);
    
    if (itemIndex > -1) {
      const item = items[itemIndex];
      if (item.type === target) {
        items[itemIndex] = { ...item, placed: target };
        this.state.next({ ...this.currentState, [itemsKey]: items });
        
        const allPlaced = items.every(i => i.placed === i.type);
        if (allPlaced) {
          setTimeout(() => {
            this.completePhase(phase === 3);
          }, 1000);
        }
      } else {
        this.reportMistake();
      }
    }
  }

  selectPassword(isStrong: boolean) {
    if (isStrong) {
      this.state.next({ ...this.currentState, phase2Solved: true });
      setTimeout(() => {
        this.completePhase(false);
      }, 1000);
    } else {
      this.reportMistake();
    }
  }
}
