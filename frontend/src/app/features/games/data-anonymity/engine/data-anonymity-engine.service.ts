import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameState {
  fase: number;
  // Phase 0
  phase0Items: { id: string; name: string; type: 'research' | 'private'; droppedIn?: 'research' | 'private' | null }[];
  // Phase 1 & 3
  characters: { id: number; name: string; snack: string; snackClicked: boolean; idDropped: boolean }[];
  privacyBoxCount: number;
  snackChartCount: number;
  // Phase 2
  tableData: { id: number; name: string; snack: string; censored: boolean }[];
}

@Injectable({
  providedIn: 'root'
})
/**
 * DataAnonymityEngineService
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class DataAnonymityEngineService {
  private initialState: GameState = {
    fase: 0,
    phase0Items: [
      { id: '1', name: 'Meu Lanche Favorito 🍔', type: 'research', droppedIn: null },
      { id: '2', name: 'Meu Nome Completo 📝', type: 'private', droppedIn: null }
    ],
    characters: [],
    privacyBoxCount: 0,
    snackChartCount: 0,
    tableData: []
  };

  private stateSubject = new BehaviorSubject<GameState>(this.initialState);
  state$ = this.stateSubject.asObservable();

  get state() {
    return this.stateSubject.value;
  }

  resetPhase1() {
     this.updateState({
       characters: [
          { id: 1, name: 'Ana', snack: 'Maçã 🍎', snackClicked: false, idDropped: false },
          { id: 2, name: 'Beto', snack: 'Bolo 🍰', snackClicked: false, idDropped: false },
          { id: 3, name: 'Caio', snack: 'Suco 🧃', snackClicked: false, idDropped: false }
       ],
       privacyBoxCount: 0,
       snackChartCount: 0
     });
  }

  resetPhase2() {
    this.updateState({
       tableData: [
         { id: 1, name: 'Estudante 1', snack: 'Maçã 🍎', censored: true },
         { id: 2, name: 'João Silva', snack: 'Sanduíche 🥪', censored: false },
         { id: 3, name: 'Estudante 3', snack: 'Suco 🧃', censored: true }
       ]
    });
  }

  resetPhase3() {
     this.updateState({
       characters: [
          { id: 1, name: 'Bia', snack: 'Banana 🍌', snackClicked: false, idDropped: false },
          { id: 2, name: 'Leo', snack: 'Pão 🥖', snackClicked: false, idDropped: false },
          { id: 3, name: 'Mia', snack: 'Uva 🍇', snackClicked: false, idDropped: false },
          { id: 4, name: 'Rui', snack: 'Biscoito 🍪', snackClicked: false, idDropped: false },
          { id: 5, name: 'Zoe', snack: 'Pera 🍐', snackClicked: false, idDropped: false }
       ],
       privacyBoxCount: 0,
       snackChartCount: 0
     });
  }

  updateState(newState: Partial<GameState>) {
    this.stateSubject.next({ ...this.state, ...newState });
  }

  nextPhase() {
    const nextFase = this.state.fase + 1;
    this.updateState({ fase: nextFase });
    if (nextFase === 1) this.resetPhase1();
    if (nextFase === 2) this.resetPhase2();
    if (nextFase === 3) this.resetPhase3();
  }
}
