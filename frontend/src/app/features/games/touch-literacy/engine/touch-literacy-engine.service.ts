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
    challengeTargetScore: 100,
    // Phase 5 (Balloons)
    balloons: [] as any[],
    phase5Score: 0,
    phase5Target: 50,
    phase5CategoryTarget: 'food'

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
    } else {
      // Finished Phase 4, automatically wait for component to transition to Phase 5
    }
    this.stateSubject.next(s);
    return isCorrect;
  }

  // Phase 5 Logic
  spawnBalloon() {
    const s = this.state();
    if (s.fase !== 5) return;

    const randomIndex = Math.floor(Math.random() * CHALLENGE_ITEMS.length);
    const item = CHALLENGE_ITEMS[randomIndex];
    
    const balloon = {
      id: 'b_' + new Date().getTime() + '_' + Math.random(),
      x: Math.floor(Math.random() * 80) + 10, // 10% to 90%
      item: item,
      active: true,
      color: ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'][Math.floor(Math.random()*5)]
    };
    
    s.balloons.push(balloon);
    
    // Cleanup old balloons
    if (s.balloons.length > 15) {
      s.balloons.shift();
    }
    
    this.stateSubject.next(s);
  }

  popMovingBalloon(id: string): boolean {
    const s = this.state();
    const balloon = s.balloons.find((b: any) => b.id === id);
    if (!balloon || !balloon.active) return false;

    balloon.active = false;
    const isCorrect = balloon.item.category === s.phase5CategoryTarget;
    
    if (isCorrect) {
      s.phase5Score += 10;
    } else {
      s.phase5Score = Math.max(0, s.phase5Score - 5);
    }
    
    this.stateSubject.next(s);
    return isCorrect;
  }


  private clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}
