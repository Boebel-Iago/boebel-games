import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MiniPosterEngineService } from './engine/mini-poster-engine.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mini-poster',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mini-poster.component.html',
  styleUrls: ['./mini-poster.component.scss']
})
export class MiniPosterComponent implements OnInit, OnDestroy {
  fase = 0;
  private sub!: Subscription;

  // Phase 0
  dogImage = { x: 50, y: 50, width: 100, height: 100 };
  targetBox0 = { x: 300, y: 150, width: 200, height: 200 };
  
  // Phase 1
  textBlock1 = { x: 50, y: 300, width: 150, height: 50 };
  imageBlock1 = { x: 50, y: 380, width: 150, height: 100 };
  targetText1 = { x: 400, y: 100, width: 200, height: 50 };
  targetImage1 = { x: 400, y: 200, width: 200, height: 150 };

  // Phase 2
  phase2Title = '';
  phase2IsBold = false;
  phase2Sentences = '';

  // Phase 3
  phase3Images = ['🐶', '🐱', '🐰'];
  phase3Elements: any[] = [];
  phase3Text = '';
  phase3IsBold = false;

  // Dragging / Resizing State
  draggingItem: any = null;
  resizingItem: any = null;
  dragStartX = 0;
  dragStartY = 0;
  initialX = 0;
  initialY = 0;
  initialWidth = 0;
  initialHeight = 0;

  constructor(private engine: MiniPosterEngineService) {}

  ngOnInit() {
    this.sub = this.engine.state$.subscribe(state => {
      this.fase = state.fase;
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  // --- Interaction Methods ---
  
  onMouseDown(event: MouseEvent, item: any, action: 'drag' | 'resize' = 'drag') {
    event.preventDefault();
    if (action === 'drag') {
      this.draggingItem = item;
      this.initialX = item.x;
      this.initialY = item.y;
    } else {
      this.resizingItem = item;
      this.initialWidth = item.width;
      this.initialHeight = item.height;
    }
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.draggingItem) {
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      this.draggingItem.x = this.initialX + dx;
      this.draggingItem.y = this.initialY + dy;
    } else if (this.resizingItem) {
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      this.resizingItem.width = Math.max(50, this.initialWidth + dx);
      this.resizingItem.height = Math.max(50, this.initialHeight + dy);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.draggingItem) {
      this.checkPhaseConstraints(this.draggingItem);
      this.draggingItem = null;
    }
    if (this.resizingItem) {
      this.checkPhaseConstraints(this.resizingItem);
      this.resizingItem = null;
    }
  }

  checkPhaseConstraints(item: any) {
    if (this.fase === 0) {
      this.checkPhase0();
    } else if (this.fase === 1) {
      this.checkPhase1();
    }
  }

  checkPhase0() {
    const isInside = Math.abs(this.dogImage.x - this.targetBox0.x) < 40 &&
                     Math.abs(this.dogImage.y - this.targetBox0.y) < 40;
    const isSized = Math.abs(this.dogImage.width - this.targetBox0.width) < 40 &&
                    Math.abs(this.dogImage.height - this.targetBox0.height) < 40;

    if (isInside && isSized) {
      this.engine.completePhase(false);
    }
  }

  checkPhase1() {
    const textOk = Math.abs(this.textBlock1.x - this.targetText1.x) < 40 &&
                   Math.abs(this.textBlock1.y - this.targetText1.y) < 40;
    const imageOk = Math.abs(this.imageBlock1.x - this.targetImage1.x) < 40 &&
                    Math.abs(this.imageBlock1.y - this.targetImage1.y) < 40;

    if (textOk && imageOk) {
      this.engine.completePhase(false);
    }
  }

  validatePhase2() {
    const sentenceCount = this.phase2Sentences.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    if (this.phase2Title.length > 0 && this.phase2IsBold && sentenceCount >= 3) {
      this.engine.completePhase(false);
    } else {
      this.engine.reportMistake();
      alert('Certifique-se de preencher um título, deixá-lo em negrito e escrever pelo menos 3 frases na descrição!');
    }
  }

  toggleBold() {
    if (this.fase === 2) {
      this.phase2IsBold = !this.phase2IsBold;
    } else if (this.fase === 3) {
      this.phase3IsBold = !this.phase3IsBold;
    }
  }

  addPhase3Image(img: string) {
    this.phase3Elements.push({
      type: 'image',
      content: img,
      x: 100,
      y: 100,
      width: 100,
      height: 100
    });
  }

  finishPhase3() {
    if (this.phase3Elements.length > 0 && this.phase3Text.length > 0) {
      this.engine.completePhase(true);
      alert('Parabéns! Você concluiu todos os níveis do Mini-Cartaz!');
    } else {
      this.engine.reportMistake();
      alert('Coloque pelo menos uma imagem e escreva algo para finalizar o cartaz!');
    }
  }
}
