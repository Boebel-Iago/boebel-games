import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HardwareCareEngineService } from './engine/hardware-care-engine.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hardware-care',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hardware-care.component.html',
  styleUrls: ['./hardware-care.component.scss']
})
export class HardwareCareComponent implements OnInit {
  
  shuffledOptions: any[] = [];
  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' | '' = '';
  draggedItem: any = null;

  constructor(
    public engine: HardwareCareEngineService,
    private router: Router
  ) {}

  ngOnInit() {
    this.prepareCurrentTask();
  }

  get state() {
    return this.engine.state;
  }

  get currentTask() {
    return this.engine.getCurrentTask();
  }

  prepareCurrentTask() {
    const task = this.currentTask;
    if (!task) return;

    this.feedbackMessage = '';
    this.feedbackType = '';
    this.draggedItem = null;

    if (this.state.module === 0 || this.state.module === 2) {
      // Tap modules - shuffle options
      this.shuffledOptions = [
        { text: task.correct, isCorrect: true },
        { text: task.wrong, isCorrect: false }
      ];
      this.engine.shuffle(this.shuffledOptions);
    }

    if (this.state.module === 3) {
      // Module 4 Drag and Drop (2 zones)
      this.shuffledOptions = [
        { action: task.correctAction, isCorrect: true },
        { action: task.wrongAction, isCorrect: false }
      ];
      this.engine.shuffle(this.shuffledOptions);
    }
  }

  handleTap(option: any) {
    if (option.isCorrect) {
      this.showFeedback('Muito bem!', 'success');
      setTimeout(() => {
        this.engine.completePhase();
        this.prepareCurrentTask();
      }, 1000);
    } else {
      this.showFeedback('Ops! Tente novamente.', 'error');
      setTimeout(() => {
        this.engine.reportMistake();
        this.prepareCurrentTask();
      }, 1000);
    }
  }

  // Drag and drop handlers
  onDragStart(event: DragEvent, item: any) {
    this.draggedItem = item;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text', 'dragging');
    }
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, zoneIdentifier: string) {
    event.preventDefault();
    if (!this.draggedItem) return;

    let isCorrect = false;

    if (this.state.module === 1) {
      // Module 2: Comida e Eletrônicos (zoneIdentifier: 'perigo' | 'seguro')
      isCorrect = (this.currentTask.correctZone === zoneIdentifier);
    } else if (this.state.module === 3) {
      // Module 4: Depois de usar (zoneIdentifier is the action text, and it must match correctAction)
      isCorrect = (this.currentTask.correctAction === zoneIdentifier);
    } else if (this.state.module === 4) {
      // Module 5: O Grande Inspetor (zoneIdentifier: 'higiene' | 'energia' | 'transporte')
      isCorrect = (this.currentTask.category === zoneIdentifier);
    }

    if (isCorrect) {
      this.showFeedback('Excelente!', 'success');
      setTimeout(() => {
        this.engine.completePhase();
        this.prepareCurrentTask();
      }, 1000);
    } else {
      this.showFeedback('Cuidado, isso não está certo!', 'error');
      setTimeout(() => {
        this.engine.reportMistake();
        this.prepareCurrentTask();
      }, 1000);
    }
    this.draggedItem = null;
  }

  showFeedback(msg: string, type: 'success' | 'error') {
    this.feedbackMessage = msg;
    this.feedbackType = type;
  }

  getHeartArray() {
    return Array(this.state.hearts).fill(0);
  }

  getLostHeartArray() {
    return Array(3 - this.state.hearts).fill(0);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
