import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchLiteracyEngineService, GameState, GameItem } from './engine/touch-literacy-engine.service';
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
export class TouchLiteracyComponent implements OnInit, OnDestroy {
  state!: GameState;
  sub!: Subscription;
  balloonInterval: any;
  draggedItem: GameItem | null = null;

  constructor(
    public engine: TouchLiteracyEngineService,
    private progress: ProgressReporter
  ) {}

  ngOnInit() {
    this.sub = this.engine.state$.subscribe(s => {
      const prevMod = this.state?.currentModuleIndex;
      this.state = s;
      
      if (this.state.currentModuleIndex === 4 && prevMod !== 4) {
        this.startBalloons();
      } else if (this.state.currentModuleIndex !== 4 && this.balloonInterval) {
        clearInterval(this.balloonInterval);
        this.balloonInterval = null;
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.balloonInterval) clearInterval(this.balloonInterval);
  }

  startBalloons() {
    if (this.balloonInterval) clearInterval(this.balloonInterval);
    this.balloonInterval = setInterval(() => {
      this.engine.spawnBalloon();
    }, 1200);
  }

  // Common UI helpers
  get heartsArray() {
    return Array(3).fill(0).map((_, i) => i < this.state.lives);
  }

  // Drag and Drop
  onDragStart(event: DragEvent, item: GameItem) {
    this.draggedItem = item;
    event.dataTransfer?.setData('text/plain', item.id);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // allow drop
  }

  onDrop(event: DragEvent, target: string) {
    event.preventDefault();
    if (!this.draggedItem) return;

    if (this.state.currentModuleIndex === 1) {
      this.engine.submitModule1(this.draggedItem, target);
    } else if (this.state.currentModuleIndex === 2) {
      this.engine.submitModule2(this.draggedItem, target);
    } else if (this.state.currentModuleIndex === 3) {
      this.engine.submitModule3(this.draggedItem, target);
    }

    this.draggedItem = null;
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
