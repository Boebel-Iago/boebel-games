import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChallengeItem {
  id: string;
  emoji: string;
  word: string;
  category: 'food' | 'shape' | 'tech';
}

const CHALLENGE_ITEMS: ChallengeItem[] = [
  { id: 'c1', emoji: '🍎', word: 'MAÇÃ', category: 'food' },
  { id: 'c2', emoji: '🍌', word: 'BANANA', category: 'food' },
  { id: 'c3', emoji: '🍉', word: 'MELANCIA', category: 'food' },
  { id: 'c4', emoji: '🍇', word: 'UVA', category: 'food' },
  { id: 'c5', emoji: '🟦', word: 'QUADRADO', category: 'shape' },
  { id: 'c6', emoji: '🔴', word: 'CÍRCULO', category: 'shape' },
  { id: 'c7', emoji: '⭐', word: 'ESTRELA', category: 'shape' },
  { id: 'c8', emoji: '💛', word: 'CORAÇÃO', category: 'shape' },
  { id: 'c9', emoji: '📱', word: 'CELULAR', category: 'tech' },
  { id: 'c10', emoji: '💻', word: 'COMPUTADOR', category: 'tech' },
  { id: 'c11', emoji: '⌚', word: 'RELÓGIO', category: 'tech' },
  { id: 'c12', emoji: '📸', word: 'CÂMERA', category: 'tech' },
];

@Injectable()
/**
 * TouchLiteracyEngineService
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class TouchLiteracyEngineService {
  private initialState = {
    fase: 0,
    bubbles: [false, false, false, false, false, false],
    fruitsToDrop: [
      { id: 'fruit_apple', emoji: '🍎', word: 'MAÇÃ' },
      { id: 'fruit_banana', emoji: '🍌', word: 'BANANA' },
      { id: 'fruit_grape', emoji: '🍇', word: 'UVA' },
      { id: 'fruit_orange', emoji: '🍊', word: 'LARANJA' },
      { id: 'fruit_watermelon', emoji: '🍉', word: 'MELANCIA' }
    ],
    fruitsDropped: 0,
    shapes: { square: false, triangle: false, circle: false, star: false, heart: false },
    devices: { phone: false, laptop: false, flashlight: false, tablet: false, camera: false },
    score: 0,
    challengeItem: null as ChallengeItem | null,
    challengeTargetScore: 100
  };

  private stateSubject = new BehaviorSubject<any>(this.clone(this.initialState));
  state$ = this.stateSubject.asObservable();

  state() {
    return this.stateSubject.value;
  }

  reset() {
    this.stateSubject.next(this.clone(this.initialState));
  }

  nextPhase() {
    const s = this.state();
    s.fase++;
    if (s.fase === 4) {
       this.generateChallengeItem(s);
    }
    this.stateSubject.next(s);
  }

  popBubble(index: number) {
    const s = this.state();
    s.bubbles[index] = true;
    this.stateSubject.next(s);
  }

  dropFruit() {
    const s = this.state();
    s.fruitsDropped++;
    this.stateSubject.next(s);
  }

  dropShape(shape: string) {
    const s = this.state();
    s.shapes[shape] = true;
    this.stateSubject.next(s);
  }

  powerDevice(device: string) {
    const s = this.state();
    s.devices[device] = true;
    this.stateSubject.next(s);
  }

  private generateChallengeItem(s: any) {
    const randomIndex = Math.floor(Math.random() * CHALLENGE_ITEMS.length);
    s.challengeItem = CHALLENGE_ITEMS[randomIndex];
  }

  processChallengeDrop(category: string): boolean {
    const s = this.state();
    if (!s.challengeItem) return false;

    const isCorrect = s.challengeItem.category === category;
    if (isCorrect) {
      s.score += 10;
    } else {
      s.score = Math.max(0, s.score - 5);
    }
    
    if (s.score < s.challengeTargetScore) {
      this.generateChallengeItem(s);
    }
    this.stateSubject.next(s);
    return isCorrect;
  }

  private clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}
