import os

engine_code = """import { Injectable } from '@angular/core';
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
"""

comp_ts_code = """import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchLiteracyEngineService } from './engine/touch-literacy-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-touch-literacy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './touch-literacy.component.html',
  styleUrls: ['./touch-literacy.component.scss'],
  providers: [TouchLiteracyEngineService]
})
/**
 * TouchLiteracyComponent
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class TouchLiteracyComponent implements OnInit, OnDestroy {
  state: any;
  sub!: Subscription;

  draggedItem: string | null = null;

  constructor(
    public engine: TouchLiteracyEngineService,
    private progress: ProgressReporter
  ) {}

  ngOnInit() {
    this.sub = this.engine.state$.subscribe(s => {
      this.state = s;
      this.checkCompletion();
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  checkCompletion() {
    if (this.state.fase === 0) {
      if (this.state.bubbles.every((b: boolean) => b)) {
        this.completePhase(false);
      }
    } else if (this.state.fase === 1) {
      if (this.state.fruitsDropped >= this.state.fruitsToDrop.length) {
        this.completePhase(false);
      }
    } else if (this.state.fase === 2) {
      if (Object.values(this.state.shapes).every(v => v)) {
        this.completePhase(false);
      }
    } else if (this.state.fase === 3) {
      if (Object.values(this.state.devices).every(v => v)) {
        this.completePhase(false);
      }
    } else if (this.state.fase === 4) {
      if (this.state.score >= this.state.challengeTargetScore) {
        this.completePhase(true);
      }
    }
  }

  completePhase(isLastLevel: boolean) {
    this.progress.report({
      levelId: `fase-${this.state.fase}`,
      fase: this.state.fase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });
    if (!isLastLevel) {
      setTimeout(() => this.engine.nextPhase(), 1000);
    } else {
      setTimeout(() => alert('🎉 Parabéns! Você completou O GRANDE DESAFIO e venceu o jogo! 🎉'), 1000);
    }
  }

  reportMistake() {
    this.progress.report({
      levelId: `fase-${this.state.fase}`,
      fase: this.state.fase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });
  }

  onBubbleClick(index: number) {
    if (!this.state.bubbles[index]) {
      this.engine.popBubble(index);
    }
  }

  onDragStart(event: DragEvent, item: string) {
    this.draggedItem = item;
    event.dataTransfer?.setData('text/plain', item);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, target: string) {
    event.preventDefault();
    if (!this.draggedItem) return;

    if (this.state.fase === 1) {
      if (this.draggedItem.startsWith('fruit_') && target === 'basket') {
        this.engine.dropFruit();
      } else {
        this.reportMistake();
      }
    } else if (this.state.fase === 2) {
      if (this.draggedItem === target) {
        this.engine.dropShape(target);
      } else {
        this.reportMistake();
      }
    } else if (this.state.fase === 3) {
      if (this.draggedItem === 'battery') {
        if (!this.state.devices[target]) {
          this.engine.powerDevice(target);
        }
      } else {
        this.reportMistake();
      }
    } else if (this.state.fase === 4) {
      if (this.draggedItem === 'challengeItem') {
        const isCorrect = this.engine.processChallengeDrop(target);
        if (!isCorrect) {
          this.reportMistake();
        }
      }
    }
    
    this.draggedItem = null;
  }
}
"""

comp_html_code = """<div class="w-full h-full min-h-screen bg-blue-50 p-4 flex flex-col items-center justify-center font-sans overflow-hidden">
  
  <!-- Phase 0 -->
  <div *ngIf="state.fase === 0" class="flex flex-col items-center justify-center w-full h-full space-y-16">
    <div class="text-5xl font-bold text-blue-800 text-center mb-4">Estoure os Balões Coloridos!</div>
    <div class="grid grid-cols-3 gap-12">
      <div 
        *ngFor="let b of state.bubbles; let i = index" 
        (click)="onBubbleClick(i)"
        class="w-48 h-48 rounded-full cursor-pointer transition-transform duration-300 transform shadow-xl flex flex-col items-center justify-center text-white font-bold text-2xl border-4 border-white"
        [ngClass]="{
          'bg-red-400': i === 0, 
          'bg-yellow-400 text-gray-800': i === 1, 
          'bg-green-400 text-gray-800': i === 2, 
          'bg-blue-400': i === 3,
          'bg-purple-400': i === 4,
          'bg-orange-400': i === 5,
          'scale-0 opacity-0': state.bubbles[i], 
          'scale-100 opacity-100 active:scale-90': !state.bubbles[i]
        }">
        <span *ngIf="i === 0">VERMELHO</span>
        <span *ngIf="i === 1">AMARELO</span>
        <span *ngIf="i === 2">VERDE</span>
        <span *ngIf="i === 3">AZUL</span>
        <span *ngIf="i === 4">ROXO</span>
        <span *ngIf="i === 5">LARANJA</span>
      </div>
    </div>
  </div>

  <!-- Phase 1 -->
  <div *ngIf="state.fase === 1" class="flex flex-col items-center justify-center w-full h-full space-y-8">
    <div class="text-5xl font-bold text-blue-800 text-center mb-4">Guarde as Frutas na Cesta!</div>
    
    <!-- Fruits -->
    <div class="flex gap-8 mb-8">
      <div *ngFor="let fruit of state.fruitsToDrop; let i = index" class="flex flex-col items-center gap-4">
        <div class="text-7xl cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
             [class.invisible]="state.fruitsDropped > i"
             draggable="true" 
             (dragstart)="onDragStart($event, fruit.id)">
          {{ fruit.emoji }}
        </div>
        <div class="text-2xl font-bold text-red-600" [class.invisible]="state.fruitsDropped > i">{{ fruit.word }}</div>
      </div>
    </div>

    <!-- Basket -->
    <div class="flex flex-col items-center gap-4 mt-8">
      <div 
        class="text-9xl relative w-64 h-64 flex flex-col items-center justify-center border-8 border-dashed border-gray-400 rounded-3xl bg-white shadow-xl"
        [class.bg-green-100]="state.fruitsDropped === state.fruitsToDrop.length"
        (dragover)="onDragOver($event)" 
        (drop)="onDrop($event, 'basket')">
        <span *ngIf="state.fruitsDropped < state.fruitsToDrop.length">🧺</span>
        <span *ngIf="state.fruitsDropped === state.fruitsToDrop.length" class="text-8xl">✅</span>
        <div class="text-xl font-bold text-green-700 mt-4">{{ state.fruitsDropped }} / {{ state.fruitsToDrop.length }}</div>
      </div>
      <div class="text-4xl font-bold text-gray-700">CESTA DE FRUTAS</div>
    </div>
  </div>

  <!-- Phase 2 -->
  <div *ngIf="state.fase === 2" class="flex flex-col items-center w-full h-full max-w-6xl mx-auto space-y-12">
    <div class="text-5xl font-bold text-blue-800 text-center mb-4 mt-10">Associe as Formas Geométricas!</div>
    
    <div class="grid grid-cols-2 gap-x-32 gap-y-8 w-full justify-items-center">
      <!-- Row 1: Square & Target -->
      <div class="flex items-center gap-4">
        <div class="w-24 h-24 bg-blue-500 shadow-xl cursor-grab hover:scale-105" [class.invisible]="state.shapes['square']" draggable="true" (dragstart)="onDragStart($event, 'square')"></div>
        <span class="text-2xl font-bold text-blue-600" [class.invisible]="state.shapes['square']">QUADRADO</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="w-24 h-24 border-4 border-dashed bg-white" [ngClass]="state.shapes['square'] ? 'bg-blue-500 border-blue-500 shadow-xl' : 'border-gray-400'" (dragover)="onDragOver($event)" (drop)="onDrop($event, 'square')"></div>
        <span class="text-xl font-bold text-gray-400">ESPAÇO</span>
      </div>

      <!-- Row 2: Triangle & Target -->
      <div class="flex items-center gap-4">
        <div class="w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[96px] border-b-yellow-500 cursor-grab hover:scale-105" [class.invisible]="state.shapes['triangle']" draggable="true" (dragstart)="onDragStart($event, 'triangle')"></div>
        <span class="text-2xl font-bold text-yellow-600" [class.invisible]="state.shapes['triangle']">TRIÂNGULO</span>
      </div>
      <div class="flex items-center gap-4 relative">
        <div class="w-24 h-24 flex items-center justify-center relative" (dragover)="onDragOver($event)" (drop)="onDrop($event, 'triangle')">
            <div class="w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[96px] absolute" [ngClass]="state.shapes['triangle'] ? 'border-b-yellow-500 filter drop-shadow-xl' : 'border-b-gray-300'"></div>
        </div>
        <span class="text-xl font-bold text-gray-400">ESPAÇO</span>
      </div>

      <!-- Row 3: Circle & Target -->
      <div class="flex items-center gap-4">
        <div class="w-24 h-24 bg-red-500 rounded-full shadow-xl cursor-grab hover:scale-105" [class.invisible]="state.shapes['circle']" draggable="true" (dragstart)="onDragStart($event, 'circle')"></div>
        <span class="text-2xl font-bold text-red-600" [class.invisible]="state.shapes['circle']">CÍRCULO</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="w-24 h-24 rounded-full border-4 border-dashed bg-white" [ngClass]="state.shapes['circle'] ? 'bg-red-500 border-red-500 shadow-xl' : 'border-gray-400'" (dragover)="onDragOver($event)" (drop)="onDrop($event, 'circle')"></div>
        <span class="text-xl font-bold text-gray-400">ESPAÇO</span>
      </div>
      
      <!-- Row 4: Star & Target -->
      <div class="flex items-center gap-4">
        <div class="text-7xl cursor-grab hover:scale-105" [class.invisible]="state.shapes['star']" draggable="true" (dragstart)="onDragStart($event, 'star')">⭐</div>
        <span class="text-2xl font-bold text-yellow-600" [class.invisible]="state.shapes['star']">ESTRELA</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="w-24 h-24 rounded-full border-4 border-dashed flex justify-center items-center bg-white" [ngClass]="state.shapes['star'] ? 'border-yellow-500 shadow-xl' : 'border-gray-400'" (dragover)="onDragOver($event)" (drop)="onDrop($event, 'star')">
           <span *ngIf="state.shapes['star']" class="text-6xl">⭐</span>
        </div>
        <span class="text-xl font-bold text-gray-400">ESPAÇO</span>
      </div>
      
      <!-- Row 5: Heart & Target -->
      <div class="flex items-center gap-4">
        <div class="text-7xl cursor-grab hover:scale-105" [class.invisible]="state.shapes['heart']" draggable="true" (dragstart)="onDragStart($event, 'heart')">💛</div>
        <span class="text-2xl font-bold text-pink-600" [class.invisible]="state.shapes['heart']">CORAÇÃO</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="w-24 h-24 rounded-full border-4 border-dashed flex justify-center items-center bg-white" [ngClass]="state.shapes['heart'] ? 'border-pink-500 shadow-xl' : 'border-gray-400'" (dragover)="onDragOver($event)" (drop)="onDrop($event, 'heart')">
           <span *ngIf="state.shapes['heart']" class="text-6xl">💛</span>
        </div>
        <span class="text-xl font-bold text-gray-400">ESPAÇO</span>
      </div>
    </div>
  </div>

  <!-- Phase 3 -->
  <div *ngIf="state.fase === 3" class="flex flex-col items-center justify-center w-full h-full space-y-12">
    <div class="text-5xl font-bold text-blue-800 text-center mb-4">Ligue os Eletrônicos!</div>
    
    <!-- Batteries -->
    <div class="flex gap-8 mb-8 flex-wrap justify-center">
      <div *ngFor="let b of [1, 2, 3, 4, 5]; let i = index" class="flex flex-col items-center gap-2">
        <div class="text-7xl cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
             draggable="true" 
             (dragstart)="onDragStart($event, 'battery')">
          🔋
        </div>
        <div class="text-xl font-bold text-green-700">BATERIA</div>
      </div>
    </div>

    <!-- Devices -->
    <div class="flex gap-8 mt-4 flex-wrap justify-center max-w-5xl">
      <div class="flex flex-col items-center gap-4">
        <div class="text-7xl w-32 h-32 flex items-center justify-center border-4 border-dashed rounded-2xl bg-white relative"
             [ngClass]="state.devices['phone'] ? 'border-green-500 bg-green-100 shadow-lg' : 'border-gray-300'"
             (dragover)="onDragOver($event)" (drop)="onDrop($event, 'phone')">
          📱<span *ngIf="state.devices['phone']" class="text-4xl absolute -top-4 -right-4 animate-bounce">✅</span>
        </div>
        <div class="text-xl font-bold text-gray-700">CELULAR</div>
      </div>
      <div class="flex flex-col items-center gap-4">
        <div class="text-7xl w-32 h-32 flex items-center justify-center border-4 border-dashed rounded-2xl bg-white relative"
             [ngClass]="state.devices['laptop'] ? 'border-green-500 bg-green-100 shadow-lg' : 'border-gray-300'"
             (dragover)="onDragOver($event)" (drop)="onDrop($event, 'laptop')">
          💻<span *ngIf="state.devices['laptop']" class="text-4xl absolute -top-4 -right-4 animate-bounce">✅</span>
        </div>
        <div class="text-xl font-bold text-gray-700">COMPUTADOR</div>
      </div>
      <div class="flex flex-col items-center gap-4">
        <div class="text-7xl w-32 h-32 flex items-center justify-center border-4 border-dashed rounded-2xl bg-white relative"
             [ngClass]="state.devices['flashlight'] ? 'border-green-500 bg-green-100 shadow-lg' : 'border-gray-300'"
             (dragover)="onDragOver($event)" (drop)="onDrop($event, 'flashlight')">
          🔦<span *ngIf="state.devices['flashlight']" class="text-4xl absolute -top-4 -right-4 animate-bounce">✅</span>
        </div>
        <div class="text-xl font-bold text-gray-700">LANTERNA</div>
      </div>
      <div class="flex flex-col items-center gap-4">
        <div class="text-7xl w-32 h-32 flex items-center justify-center border-4 border-dashed rounded-2xl bg-white relative"
             [ngClass]="state.devices['tablet'] ? 'border-green-500 bg-green-100 shadow-lg' : 'border-gray-300'"
             (dragover)="onDragOver($event)" (drop)="onDrop($event, 'tablet')">
          📱<span *ngIf="state.devices['tablet']" class="text-4xl absolute -top-4 -right-4 animate-bounce">✅</span>
        </div>
        <div class="text-xl font-bold text-gray-700">TABLET</div>
      </div>
      <div class="flex flex-col items-center gap-4">
        <div class="text-7xl w-32 h-32 flex items-center justify-center border-4 border-dashed rounded-2xl bg-white relative"
             [ngClass]="state.devices['camera'] ? 'border-green-500 bg-green-100 shadow-lg' : 'border-gray-300'"
             (dragover)="onDragOver($event)" (drop)="onDrop($event, 'camera')">
          📸<span *ngIf="state.devices['camera']" class="text-4xl absolute -top-4 -right-4 animate-bounce">✅</span>
        </div>
        <div class="text-xl font-bold text-gray-700">CÂMERA</div>
      </div>
    </div>
  </div>

  <!-- Phase 4 (Challenge) -->
  <div *ngIf="state.fase === 4" class="flex flex-col items-center w-full h-full max-w-5xl mx-auto space-y-8">
    <div class="flex justify-between w-full items-center px-8 pt-8">
      <div class="text-4xl font-bold text-blue-800">O GRANDE DESAFIO!</div>
      <div class="text-3xl font-bold bg-white px-6 py-3 rounded-full shadow-lg text-purple-600 border-4 border-purple-200">
        Pontos: {{ state.score }} / {{ state.challengeTargetScore }}
      </div>
    </div>
    
    <div class="text-xl text-gray-600 font-semibold mb-8 text-center">
      Arraste o item que apareceu para a caixa certa e alcance 100 pontos!
    </div>

    <!-- Active Item -->
    <div class="h-64 flex items-center justify-center w-full">
      <div *ngIf="state.challengeItem" class="flex flex-col items-center gap-4 animate-pulse">
        <div class="text-9xl cursor-grab active:cursor-grabbing drop-shadow-2xl hover:scale-110 transition-transform"
             draggable="true" 
             (dragstart)="onDragStart($event, 'challengeItem')">
          {{ state.challengeItem.emoji }}
        </div>
        <div class="text-4xl font-black text-gray-800 bg-white px-6 py-2 rounded-xl shadow-md border-2 border-gray-100 tracking-widest">
          {{ state.challengeItem.word }}
        </div>
      </div>
    </div>

    <!-- Drop Zones -->
    <div class="flex justify-between w-full mt-12 gap-8 px-4">
      <div class="flex flex-col items-center gap-4 flex-1">
        <div class="w-full h-48 border-8 border-dashed border-red-300 rounded-3xl bg-red-50 flex items-center justify-center text-6xl shadow-inner"
             (dragover)="onDragOver($event)" (drop)="onDrop($event, 'food')">
          🧺
        </div>
        <div class="text-3xl font-bold text-red-600 bg-red-100 px-6 py-2 rounded-full w-full text-center">COMIDA</div>
      </div>

      <div class="flex flex-col items-center gap-4 flex-1">
        <div class="w-full h-48 border-8 border-dashed border-blue-300 rounded-3xl bg-blue-50 flex items-center justify-center text-6xl shadow-inner"
             (dragover)="onDragOver($event)" (drop)="onDrop($event, 'shape')">
          🟦
        </div>
        <div class="text-3xl font-bold text-blue-600 bg-blue-100 px-6 py-2 rounded-full w-full text-center">FORMA</div>
      </div>

      <div class="flex flex-col items-center gap-4 flex-1">
        <div class="w-full h-48 border-8 border-dashed border-green-300 rounded-3xl bg-green-50 flex items-center justify-center text-6xl shadow-inner"
             (dragover)="onDragOver($event)" (drop)="onDrop($event, 'tech')">
          🔋
        </div>
        <div class="text-3xl font-bold text-green-600 bg-green-100 px-6 py-2 rounded-full w-full text-center">ELETRÔNICO</div>
      </div>
    </div>
  </div>

</div>
"""

def write_file(path, content):
    with open(path, "w") as f:
        f.write(content)

base = "frontend/src/app/features/games/touch-literacy/"
write_file(base + "engine/touch-literacy-engine.service.ts", engine_code)
write_file(base + "touch-literacy.component.ts", comp_ts_code)
write_file(base + "touch-literacy.component.html", comp_html_code)
