import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextShapesEngineService, Shape } from './engine/text-shapes-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

@Component({
  selector: 'app-text-shapes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-shapes.component.html',
  styleUrls: ['./text-shapes.component.scss']
})
export class TextShapesComponent {
  @ViewChild('editor') editor!: ElementRef;
  
  draggedShape: Shape | null = null;
  shapeCounter = 0;
  
  availableShapes: any[] = [
    { type: 'square', color: '#3b82f6' }, // blue-500
    { type: 'triangle', color: '#ef4444' }, // red-500
    { type: 'circle', color: '#facc15' } // yellow-400
  ];

  constructor(
    public engine: TextShapesEngineService,
    private progress: ProgressReporter
  ) {}

  get state() {
    return this.engine.state;
  }

  execCmd(command: string, value: string = '') {
    document.execCommand(command, false, value);
    this.editor.nativeElement.focus();
  }

  validatePhase0() {
    const html = this.editor?.nativeElement.innerHTML || '';
    if (html.toLowerCase().includes('<b>') || html.toLowerCase().includes('<strong>')) {
      this.completePhase(false);
    } else {
      this.reportMistake();
    }
  }

  validatePhase1() {
    const html = this.editor?.nativeElement.innerHTML || '';
    const hasRed = html.includes('color: red') || html.includes('color="red"') || html.includes('color: rgb(255, 0, 0)') || html.includes('color: #ff0000');
    const hasBlue = html.includes('color: blue') || html.includes('color="blue"') || html.includes('color: rgb(0, 0, 255)') || html.includes('color: #0000ff');
    
    if (hasRed && hasBlue) {
      this.completePhase(false);
    } else {
      this.reportMistake();
    }
  }

  validatePhase2() {
    const hasSquare = this.state.shapes.some(s => s.type === 'square');
    const hasTriangle = this.state.shapes.some(s => s.type === 'triangle');
    if (hasSquare && hasTriangle) {
      this.completePhase(false);
    } else {
      this.reportMistake();
    }
  }

  completePhase3() {
    this.completePhase(true);
  }

  onDragStart(event: DragEvent, shape: any) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('shapeType', shape.type);
      event.dataTransfer.setData('shapeColor', shape.color);
    }
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  
  onShapeDragStart(event: DragEvent, shape: Shape) {
    this.draggedShape = shape;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', '');
    }
  }

  onCanvasDrop(event: DragEvent) {
    event.preventDefault();
    const svgRect = (event.currentTarget as Element).getBoundingClientRect();
    const x = event.clientX - svgRect.left - 25; 
    const y = event.clientY - svgRect.top - 25;
      
    if (this.draggedShape) {
      this.draggedShape.x = x;
      this.draggedShape.y = y;
      this.draggedShape = null;
      return;
    }

    if (event.dataTransfer) {
      const type = event.dataTransfer.getData('shapeType') as 'square' | 'circle' | 'triangle';
      const color = event.dataTransfer.getData('shapeColor');
      
      if (type) {
        this.state.shapes.push({
          id: this.shapeCounter++,
          type,
          x,
          y,
          color
        });
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
        this.state.fase++;
        if (this.editor?.nativeElement) {
          this.editor.nativeElement.innerHTML = '';
        }
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
    alert('Ops! Tente novamente. Verifique se seguiu as instruções corretamente.');
  }
}
