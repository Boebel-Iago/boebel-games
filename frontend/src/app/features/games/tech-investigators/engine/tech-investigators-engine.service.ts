import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  modulo: number; // 0 to 4
  tarefa: number; // 0 to 9
  vidas: number; // 0 to 3
}

export interface TaskOption {
  id: string;
  emoji: string;
  isCorrect?: boolean;
}

export interface DragTask {
  scene: string;
  options: TaskOption[];
  correctDropZoneId?: string;
}

export interface DropZone {
  id: string;
  emoji: string;
  label?: string;
}

const STORAGE_KEY = 'boebel_tech_investigators_state';

@Injectable({ providedIn: 'root' })
export class TechInvestigatorsEngineService {
  private state: GameState = { modulo: 0, tarefa: 0, vidas: 3 };

  constructor(private progress: ProgressReporter) {
    this.loadState();
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public loadState(): void {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.modulo !== undefined && parsed.tarefa !== undefined && parsed.vidas !== undefined) {
          this.state = parsed;
        }
      } catch (e) {
        console.error('Failed to parse game state', e);
      }
    }
  }

  public saveState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  public clearState(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.state = { modulo: 0, tarefa: 0, vidas: 3 };
  }

  public handleSuccess(): void {
    const isLastLevel = this.state.modulo === 4 && this.state.tarefa === 9;
    
    this.progress.report({
      levelId: `modulo-${this.state.modulo}-tarefa-${this.state.tarefa}`,
      fase: this.state.modulo * 10 + this.state.tarefa,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });

    if (isLastLevel) {
      this.clearState();
    } else {
      if (this.state.tarefa < 9) {
        this.state.tarefa++;
      } else {
        this.state.modulo++;
        this.state.tarefa = 0;
      }
      this.saveState();
    }
  }

  public handleFailure(): void {
    this.progress.report({
      levelId: `modulo-${this.state.modulo}-tarefa-${this.state.tarefa}`,
      fase: this.state.modulo * 10 + this.state.tarefa,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });

    this.state.vidas--;
    if (this.state.vidas <= 0) {
      // Restart current module
      this.state.tarefa = 0;
      this.state.vidas = 3;
    }
    this.saveState();
  }

  public shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Generators for modules
  public generateModule1Task(): { options: TaskOption[] } {
    const tech = ['💻', '📱', '⌨️', '🖱️', '📺', '⌚', '🎮', '📷', '🎧', '🖨️'];
    const nonTech = ['🍎', '🐶', '🌳', '⚽', '🚗', '📚', '👕', '🍕', '✏️', '🌻'];
    
    const correct = { id: 'tech', emoji: tech[Math.floor(Math.random() * tech.length)], isCorrect: true };
    const wrong = { id: 'non-tech', emoji: nonTech[Math.floor(Math.random() * nonTech.length)], isCorrect: false };
    
    return { options: this.shuffle([correct, wrong]) };
  }

  public generateModule2Task(): { scene: string, options: TaskOption[], correctOptionId: string } {
    const scenarios = [
      { scene: '🌄', devices: ['📷', '📱'], wrong: ['🖨️', '🖱️'] },
      { scene: '🎵', devices: ['🎧', '📻'], wrong: ['📺', '⌨️'] },
      { scene: '🌑', devices: ['🔦', '💡'], wrong: ['🎮', '⌚'] },
      { scene: '📝', devices: ['🖨️', '💻'], wrong: ['🎧', '🎮'] }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const correctEmoji = scenario.devices[Math.floor(Math.random() * scenario.devices.length)];
    const wrongEmoji = scenario.wrong[Math.floor(Math.random() * scenario.wrong.length)];
    
    const correctId = 'correct';
    const correct = { id: correctId, emoji: correctEmoji, isCorrect: true };
    const wrong = { id: 'wrong', emoji: wrongEmoji, isCorrect: false };
    
    return { scene: scenario.scene, options: this.shuffle([correct, wrong]), correctOptionId: correctId };
  }

  public generateModule3Task(): { item: string, zones: DropZone[], correctZoneId: string } {
    const hardware = ['🖱️', '⌨️', '💻', '🖨️', '📱', '📺'];
    const software = ['👾', '🌐', '🎮', '📧', '💬', '🖼️']; // Using game char, web, etc. as software representations
    
    const isHardware = Math.random() > 0.5;
    const item = isHardware ? hardware[Math.floor(Math.random() * hardware.length)] : software[Math.floor(Math.random() * software.length)];
    const correctZoneId = isHardware ? 'fisico' : 'digital';
    
    const zones = [
      { id: 'fisico', emoji: '🖐️', label: 'Tocar' },
      { id: 'digital', emoji: '👾', label: 'Ver' }
    ];
    
    return { item, zones, correctZoneId };
  }

  public generateModule4Task(): { options: TaskOption[] } {
    const good = ['💻+✨', '📱+🛡️', '🎮+🧹', '📺+🔌', '⌨️+🖐️(Limpa)'];
    const bad = ['💻+💧', '📱+🔨', '🎮+🥤', '📺+🔥', '⌨️+🍔'];
    
    const correct = { id: 'good', emoji: good[Math.floor(Math.random() * good.length)], isCorrect: true };
    const wrong = { id: 'bad', emoji: bad[Math.floor(Math.random() * bad.length)], isCorrect: false };
    
    return { options: this.shuffle([correct, wrong]) };
  }

  public generateModule5Task(): { item: string, zones: DropZone[], correctZoneId: string } {
    const nonTech = ['🍎', '🐶', '🌳', '⚽', '🚗'];
    const hardware = ['🖱️', '⌨️', '💻', '🖨️', '📱'];
    const software = ['🌐', '🎮', '📧', '💬', '🖼️']; // Reusing software ideas

    const type = Math.floor(Math.random() * 3);
    let item = '';
    let correctZoneId = '';

    if (type === 0) {
      item = nonTech[Math.floor(Math.random() * nonTech.length)];
      correctZoneId = 'nao-tech';
    } else if (type === 1) {
      item = hardware[Math.floor(Math.random() * hardware.length)];
      correctZoneId = 'fisico';
    } else {
      item = software[Math.floor(Math.random() * software.length)];
      correctZoneId = 'digital';
    }
    
    const zones = [
      { id: 'nao-tech', emoji: '🍎', label: 'Não é Tech' },
      { id: 'fisico', emoji: '🖐️', label: 'Físico' },
      { id: 'digital', emoji: '👾', label: 'Programa' }
    ];
    
    return { item, zones, correctZoneId };
  }
}
