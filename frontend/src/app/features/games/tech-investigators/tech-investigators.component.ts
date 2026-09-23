import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechInvestigatorsEngineService } from './engine/tech-investigators-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

@Component({
  selector: 'app-tech-investigators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-investigators.component.html',
  styleUrls: ['./tech-investigators.component.scss']
})
export class TechInvestigatorsComponent implements OnInit {
  draggedDeviceId: string | null = null;
  draggedHsId: string | null = null;

  constructor(
    public engine: TechInvestigatorsEngineService,
    private progress: ProgressReporter
  ) {}

  ngOnInit() {
    this.engine.reset();
  }

  // Phase 0
  selectItem(item: any) {
    if (item.selected) return;
    
    if (item.isTech) {
      item.selected = true;
      const allSelected = this.engine.items.filter(i => i.isTech).every(i => i.selected);
      if (allSelected) {
        this.completePhase(false);
      }
    } else {
      item.isWrong = true;
      this.reportMistake();
      setTimeout(() => item.isWrong = false, 1000);
    }
  }

  // Phase 1 (Drag & Drop)
  onDragStartDevice(event: DragEvent, id: string) {
    this.draggedDeviceId = id;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDropScene(event: DragEvent, sceneId: string) {
    event.preventDefault();
    if (this.draggedDeviceId) {
      const device = this.engine.purposeDevices.find(d => d.id === this.draggedDeviceId);
      if (device && device.targetId === sceneId) {
        if (device.id === 'cam') this.engine.matches['cam'] = true;
        if (device.id === 'spk') this.engine.matches['spk'] = true;
        
        if (this.engine.matches['cam'] && this.engine.matches['spk']) {
          this.completePhase(false);
        }
      } else {
        this.reportMistake();
      }
      this.draggedDeviceId = null;
    }
  }

  // Phase 2
  onDragStartHs(event: DragEvent, id: string) {
    this.draggedHsId = id;
  }

  onDropBox(event: DragEvent, boxType: 'hardware' | 'software') {
    event.preventDefault();
    if (this.draggedHsId) {
      const item = this.engine.hsItems.find(i => i.id === this.draggedHsId);
      if (item) {
        if (item.type === boxType) {
          item.box = boxType;
          const allSorted = this.engine.hsItems.every(i => i.box !== 'none');
          if (allSorted) {
            this.completePhase(false);
          }
        } else {
          this.reportMistake();
        }
      }
      this.draggedHsId = null;
    }
  }

  // Phase 3
  selectCare(choice: any) {
    if (choice.isCorrect) {
      this.completePhase(true);
    } else {
      this.reportMistake();
    }
  }

  completePhase(isLastLevel: boolean) {
    this.progress.report({
      levelId: `fase-${this.engine.fase}`,
      fase: this.engine.fase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });
    
    if (!isLastLevel) {
      setTimeout(() => {
        this.engine.fase++;
      }, 1000);
    }
  }

  reportMistake() {
    this.progress.report({
      levelId: `fase-${this.engine.fase}`,
      fase: this.engine.fase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });
  }
}
