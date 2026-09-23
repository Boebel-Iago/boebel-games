import { Injectable, signal } from '@angular/core';

export interface GameState {
  fase: number;
  cards: { id: number, text: string, category: 'good' | 'bad' | null, correctCategory: 'good' | 'bad' }[];
}

@Injectable({
  providedIn: 'root'
})
/**
 * EthicalDilemmasEngineService
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class EthicalDilemmasEngineService {
  state = signal<GameState>({
    fase: 0,
    cards: [
      { id: 1, text: 'Dar crédito ao autor do desenho', category: null, correctCategory: 'good' },
      { id: 2, text: 'Fingir que a ideia foi sua', category: null, correctCategory: 'bad' },
      { id: 3, text: 'Ajudar colega com bullying online', category: null, correctCategory: 'good' },
      { id: 4, text: 'Compartilhar senha do jogo', category: null, correctCategory: 'bad' },
    ]
  });

  reset() {
    this.state.set({
      fase: 0,
      cards: [
        { id: 1, text: 'Dar crédito ao autor do desenho', category: null, correctCategory: 'good' },
        { id: 2, text: 'Fingir que a ideia foi sua', category: null, correctCategory: 'bad' },
        { id: 3, text: 'Ajudar colega com bullying online', category: null, correctCategory: 'good' },
        { id: 4, text: 'Compartilhar senha do jogo', category: null, correctCategory: 'bad' },
      ]
    });
  }

  setFase(fase: number) {
    this.state.update(s => ({ ...s, fase }));
  }

  setCardCategory(cardId: number, category: 'good' | 'bad' | null) {
    this.state.update(s => {
      const cards = s.cards.map(c => c.id === cardId ? { ...c, category } : c);
      return { ...s, cards };
    });
  }
}
