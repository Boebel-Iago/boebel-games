import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixelArtEngineService, PixelArtState, GameTask } from './engine/pixel-art-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

@Component({
  selector: 'app-pixel-art',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pixel-art.component.html',
  styleUrls: ['./pixel-art.component.scss']
})
export class PixelArtComponent implements OnInit {
  state!: PixelArtState;
  currentTask!: GameTask | null;
  draggedData: any = null;
  painterMatches: { [key: string]: string } = {};

  constructor(
    public engine: PixelArtEngineService,
    private progress: ProgressReporter
  ) {}

  ngOnInit() {
    this.engine.state$.subscribe(s => {
      this.state = s;
      this.currentTask = this.engine.getCurrentTask();
      this.painterMatches = {};
    });
  }

  get fase() {
    return this.state.module * 10 + this.state.taskIndex;
  }
  
  get moduleNames() {
    return [
      'Qual é a Cor?',
      'Completar o Padrão',
      'Simetria',
      'Coordenadas',
      'Pintor Digital'
    ];
  }

  handleColorTap(option: any) {
    if (!this.currentTask || this.currentTask.type !== 'color') return;
    
    if (option.name === this.currentTask.data.target.name) {
      this.onSuccess();
    } else {
      this.onFailure();
    }
  }

  handlePatternTap(option: any) {
    if (!this.currentTask || this.currentTask.type !== 'pattern') return;

    if (option === this.currentTask.data.target) {
      this.onSuccess();
    } else {
      this.onFailure();
    }
  }

  onDragStart(event: DragEvent, data: any) {
    this.draggedData = data;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', JSON.stringify(data));
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDropSymmetry(event: DragEvent, index: number) {
    event.preventDefault();
    if (!this.currentTask || this.currentTask.type !== 'symmetry') return;

    if (index === this.currentTask.data.targetIndex) {
       this.onSuccess();
    } else {
       this.onFailure();
    }
    this.draggedData = null;
  }

  handleCoordinateTap(r: number, c: number) {
    if (!this.currentTask || this.currentTask.type !== 'coordinates') return;

    if (r === this.currentTask.data.targetRow && c === this.currentTask.data.targetCol) {
      this.onSuccess();
    } else {
      this.onFailure();
    }
  }

  onDropPainter(event: DragEvent, zoneId: string) {
    event.preventDefault();
    if (!this.currentTask || this.currentTask.type !== 'painter') return;

    if (this.draggedData && this.draggedData.id === zoneId) {
      this.painterMatches[zoneId] = this.draggedData.color;
      if (Object.keys(this.painterMatches).length === 3) {
        setTimeout(() => this.onSuccess(), 500);
      }
    } else {
      this.onFailure();
    }
    this.draggedData = null;
  }

  private onSuccess() {
    const isLast = this.state.module === 4 && this.state.taskIndex === 9;
    this.progress.report({
      levelId: `pixel-art-${this.fase}`,
      fase: this.fase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLast,
      score: this.engine.score,
      gameState: JSON.stringify(this.engine.getState())
    });
    this.engine.advanceTask();
  }

  private onFailure() {
    this.progress.report({
      levelId: `pixel-art-${this.fase}`,
      fase: this.fase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false,
      score: this.engine.score,
      gameState: JSON.stringify(this.engine.getState())
    });
    this.engine.loseHeart();
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}