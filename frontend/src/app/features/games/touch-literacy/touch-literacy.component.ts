import { Component, OnInit, OnDestroy } from '@angular/core';
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
      if (this.state.appleDropped) {
        this.completePhase(false);
      }
    } else if (this.state.fase === 2) {
      if (this.state.shapes['square'] && this.state.shapes['triangle'] && this.state.shapes['circle']) {
        this.completePhase(false);
      }
    } else if (this.state.fase === 3) {
      if (this.state.devices['phone'] && this.state.devices['laptop'] && this.state.devices['flashlight']) {
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
      setTimeout(() => alert('🎉 Parabéns! Você completou tudo! 🎉'), 1000);
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
      if (this.draggedItem === 'apple' && target === 'basket') {
        this.engine.dropApple();
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
    }
    
    this.draggedItem = null;
  }
}
