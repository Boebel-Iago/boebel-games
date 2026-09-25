import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameItem {
  id: string;
  emoji: string;
  word: string;
  category: 'food' | 'shape' | 'tech';
}

const ITEMS: GameItem[] = [
  { id: 'f1', emoji: '🍎', word: 'MAÇÃ', category: 'food' },
  { id: 'f2', emoji: '🍌', word: 'BANANA', category: 'food' },
  { id: 'f3', emoji: '🍉', word: 'MELANCIA', category: 'food' },
  { id: 'f4', emoji: '🍇', word: 'UVA', category: 'food' },
  { id: 'f5', emoji: '🍓', word: 'MORANGO', category: 'food' },
  { id: 'f6', emoji: '🍔', word: 'HAMBÚRGUER', category: 'food' },
  { id: 'f7', emoji: '🍕', word: 'PIZZA', category: 'food' },
  
  { id: 's1', emoji: '🟦', word: 'QUADRADO', category: 'shape' },
  { id: 's2', emoji: '🔴', word: 'CÍRCULO', category: 'shape' },
  { id: 's3', emoji: '⭐', word: 'ESTRELA', category: 'shape' },
  { id: 's4', emoji: '💛', word: 'CORAÇÃO', category: 'shape' },
  { id: 's5', emoji: '🔺', word: 'TRIÂNGULO', category: 'shape' },

  { id: 't1', emoji: '📱', word: 'CELULAR', category: 'tech' },
  { id: 't2', emoji: '💻', word: 'COMPUTADOR', category: 'tech' },
  { id: 't3', emoji: '⌚', word: 'RELÓGIO', category: 'tech' },
  { id: 't4', emoji: '📸', word: 'CÂMERA', category: 'tech' },
  { id: 't5', emoji: '🎮', word: 'VIDEOGAME', category: 'tech' },
  { id: 't6', emoji: '🎧', word: 'FONE', category: 'tech' }
];

export interface Balloon {
  id: string;
  item: GameItem;
  x: number; // 0 to 100 percentage
  createdAt: number;
}

export interface GameState {
  currentModuleIndex: number;
  currentTaskIndex: number;
  lives: number;
  taskData: any; // Dynamic data for the current module/task
  balloons: Balloon[];
  foodsPopped: number;
}

const STORAGE_KEY = 'boebel_touch_literacy_state';

@Injectable({ providedIn: 'root' })
export class TouchLiteracyEngineService {
  private initialState: GameState = {
    currentModuleIndex: 0,
    currentTaskIndex: 0,
    lives: 3,
    taskData: null,
    balloons: [],
    foodsPopped: 0
  };

  private stateSubject = new BehaviorSubject<GameState>(this.clone(this.initialState));
  state$ = this.stateSubject.asObservable();

  constructor(private progress: ProgressReporter) {
    this.loadState();
  }

  get state(): GameState {
    return this.stateSubject.value;
  }

  private updateState(newState: Partial<GameState>) {
    const nextState = { ...this.state, ...newState };
    this.stateSubject.next(nextState);
    this.saveState(nextState);
  }

  private saveState(state: GameState) {
    if (state.currentModuleIndex >= 5) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }

  private loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.stateSubject.next(parsed);
      } catch (e) {
        this.generateNextTask();
      }
    } else {
      this.generateNextTask();
    }
  }

  private clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private shuffle(array: any[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private getItemsByCategory(cat: 'food'|'shape'|'tech'): GameItem[] {
    return ITEMS.filter(i => i.category === cat);
  }

  private getRandomItem(items: GameItem[]): GameItem {
    return items[Math.floor(Math.random() * items.length)];
  }

  generateNextTask() {
    const s = this.state;
    if (s.currentModuleIndex >= 5) return;

    let taskData: any = {};

    if (s.currentModuleIndex === 0) {
      // Tap Practice: 1 target, 2 distractors
      const shuffled = this.shuffle(ITEMS);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 3);
      taskData = {
        target,
        options: this.shuffle([target, ...distractors]),
        prompt: `Clique na(o) ${target.word}`
      };
    } else if (s.currentModuleIndex === 1) {
      // Drag to Basket: 1 food, 1 non-food
      const food = this.getRandomItem(this.getItemsByCategory('food'));
      const nonFoodCategories = this.shuffle([...this.getItemsByCategory('shape'), ...this.getItemsByCategory('tech')]);
      const nonFood = nonFoodCategories[0];
      taskData = {
        options: this.shuffle([food, nonFood]),
        prompt: `Arraste a COMIDA para a Cesta!`
      };
    } else if (s.currentModuleIndex === 2) {
      // Silhouette: 1 target shape, 2 wrong shapes
      const shapes = this.shuffle(this.getItemsByCategory('shape'));
      const target = shapes[0];
      const distractors = shapes.slice(1, 3);
      taskData = {
        target,
        options: this.shuffle([target, ...distractors]),
        prompt: `Arraste a forma correta para a sombra!`
      };
    } else if (s.currentModuleIndex === 3) {
      // Sorting: 1 random item
      const item = this.getRandomItem(ITEMS);
      taskData = {
        target: item,
        prompt: `Arraste a(o) ${item.word} para a lixeira correta!`
      };
    } else if (s.currentModuleIndex === 4) {
      // Balloon Arcade
      taskData = {
        prompt: `ESTOURE APENAS AS COMIDAS!`
      };
    }

    this.updateState({ taskData });
  }

  handleMistake() {
    const s = this.state;
    const newLives = s.lives - 1;
    
    this.progress.report({
      levelId: `fase-${s.currentModuleIndex}`,
      fase: s.currentModuleIndex,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });

    if (newLives <= 0) {
      // Restart current module
      this.updateState({
        currentTaskIndex: 0,
        lives: 3,
        foodsPopped: 0,
        balloons: []
      });
      this.generateNextTask();
    } else {
      this.updateState({ lives: newLives });
    }
  }

  handleSuccess() {
    const s = this.state;
    let nextTask = s.currentTaskIndex + 1;
    let nextMod = s.currentModuleIndex;
    
    // Module 4 uses foodsPopped instead of currentTaskIndex
    if (s.currentModuleIndex === 4) {
      const popped = s.foodsPopped + 1;
      if (popped >= 10) {
        this.completeModule(4);
      } else {
        this.updateState({ foodsPopped: popped });
      }
      return;
    }

    if (nextTask >= 10) {
      this.completeModule(nextMod);
    } else {
      this.updateState({ currentTaskIndex: nextTask });
      this.generateNextTask();
    }
  }

  private completeModule(modIndex: number) {
    const isLast = modIndex === 4;
    this.progress.report({
      levelId: `fase-${modIndex}`,
      fase: modIndex,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLast
    });

    if (isLast) {
      this.updateState({
        currentModuleIndex: 5,
        currentTaskIndex: 0
      });
      localStorage.removeItem(STORAGE_KEY);
    } else {
      this.updateState({
        currentModuleIndex: modIndex + 1,
        currentTaskIndex: 0,
        lives: 3
      });
      this.generateNextTask();
    }
  }

  // Interactions
  submitModule0(item: GameItem) {
    if (item.id === this.state.taskData.target.id) {
      this.handleSuccess();
    } else {
      this.handleMistake();
    }
  }

  submitModule1(item: GameItem, target: string) {
    if (target === 'basket' && item.category === 'food') {
      this.handleSuccess();
    } else {
      this.handleMistake();
    }
  }

  submitModule2(item: GameItem, targetId: string) {
    if (item.id === this.state.taskData.target.id && targetId === 'silhouette') {
      this.handleSuccess();
    } else {
      this.handleMistake();
    }
  }

  submitModule3(item: GameItem, binCategory: string) {
    if (item.category === binCategory) {
      this.handleSuccess();
    } else {
      this.handleMistake();
    }
  }

  // Phase 5 Logic
  spawnBalloon() {
    if (this.state.currentModuleIndex !== 4) return;
    const now = Date.now();
    const item = this.getRandomItem(ITEMS);
    const b: Balloon = {
      id: `b_${now}_${Math.random()}`,
      item,
      x: Math.random() * 80 + 10,
      createdAt: now
    };
    
    const balloons = [...this.state.balloons, b].filter(ball => now - ball.createdAt < 6000);
    this.updateState({ balloons });
  }

  popBalloon(id: string) {
    if (this.state.currentModuleIndex !== 4) return;
    const s = this.state;
    const balloon = s.balloons.find(b => b.id === id);
    if (!balloon) return;

    // Remove balloon
    const balloons = s.balloons.filter(b => b.id !== id);
    this.updateState({ balloons });

    if (balloon.item.category === 'food') {
      this.handleSuccess();
    } else {
      this.handleMistake();
    }
  }
}
