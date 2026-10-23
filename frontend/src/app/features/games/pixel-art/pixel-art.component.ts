import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixelArtEngineService, PixelArtState, GameTask, DrawingTemplate, DRAWING_TEMPLATES } from './engine/pixel-art-engine.service';
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

  // Drawing module state
  drawnGrid: (string | null)[] = Array(100).fill(null);
  selectedColor: string | null = null;

  // Visual feedback
  feedbackType: 'success' | 'error' | null = null;
  private feedbackTimer: any;

  constructor(
    public engine: PixelArtEngineService,
    private progress: ProgressReporter
  ) {}

  ngOnInit() {
    this.engine.state$.subscribe(s => {
      this.state = s;
      this.currentTask = this.engine.getCurrentTask();
      this.painterMatches = {};
      this.drawnGrid = Array(100).fill(null);
      // Auto-select first color for drawing
      if (this.currentTask?.type === 'drawing') {
        const tmpl = this.currentTask.data?.template as DrawingTemplate;
        this.selectedColor = tmpl?.palette?.[0] ?? null;
      } else {
        this.selectedColor = null;
      }
    });
  }

  get fase() {
    return this.state.module * 15 + this.state.taskIndex;
  }

  get moduleEmojis() {
    return ['🎨', '🔄', '🪞', '🎯', '🖌️', '✏️'];
  }

  get heartsArray() {
    return Array.from({ length: 3 }, (_, i) => i < this.state.hearts);
  }

  // ── Module 0: Color ──────────────────────────────────────────
  handleColorTap(option: any) {
    if (this.feedbackType || !this.currentTask || this.currentTask.type !== 'color') return;
    option.code === this.currentTask.data.target.code ? this.onSuccess() : this.onFailure();
  }

  // ── Module 1: Pattern ─────────────────────────────────────────
  handlePatternTap(option: string) {
    if (this.feedbackType || !this.currentTask || this.currentTask.type !== 'pattern') return;
    option === this.currentTask.data.target ? this.onSuccess() : this.onFailure();
  }

  // ── Module 2: Symmetry ────────────────────────────────────────
  onDragStart(event: DragEvent, data: any) {
    this.draggedData = data;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', JSON.stringify(data));
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }

  onDropSymmetry(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.feedbackType || !this.currentTask || this.currentTask.type !== 'symmetry') return;
    index === this.currentTask.data.targetIndex ? this.onSuccess() : this.onFailure();
    this.draggedData = null;
  }

  // ── Module 3: Grid ────────────────────────────────────────────
  handleGridTap(color: string) {
    if (this.feedbackType || !this.currentTask || this.currentTask.type !== 'grid') return;
    color === this.currentTask.data.target ? this.onSuccess() : this.onFailure();
  }

  // ── Module 4: Painter ─────────────────────────────────────────
  onDropPainter(event: DragEvent, zoneId: string) {
    event.preventDefault();
    if (this.feedbackType || !this.currentTask || this.currentTask.type !== 'painter') return;
    const itemId = event.dataTransfer?.getData('text/plain')
      ? JSON.parse(event.dataTransfer.getData('text/plain')).id
      : this.draggedData?.id;

    if (itemId === zoneId) {
      this.painterMatches[zoneId] = zoneId; // use id as key (id IS the color)
      if (Object.keys(this.painterMatches).length === 3) {
        setTimeout(() => this.onSuccess(), 400);
      }
    } else {
      this.onFailure();
    }
    this.draggedData = null;
  }

  // ── Module 5: Drawing ─────────────────────────────────────────
  selectColor(color: string) {
    this.selectedColor = color;
  }

  drawCell(index: number) {
    if (!this.selectedColor || !this.currentTask || this.currentTask.type !== 'drawing') return;
    const newGrid = [...this.drawnGrid];
    // 'transparent-erase' = borracha
    newGrid[index] = this.selectedColor === 'transparent-erase' ? null : this.selectedColor;
    this.drawnGrid = newGrid;
    if (this.selectedColor !== 'transparent-erase' && this.checkDrawingComplete(newGrid)) {
      setTimeout(() => this.onSuccess(), 300);
    }
  }

  private checkDrawingComplete(drawn: (string | null)[]): boolean {
    const template = this.currentTask?.data?.template as DrawingTemplate;
    if (!template) return false;
    for (let i = 0; i < 100; i++) {
      if (template.grid[i] !== null && drawn[i] !== template.grid[i]) return false;
    }
    return true;
  }

  // ── Success / Failure ─────────────────────────────────────────
  private onSuccess() {
    const isLast = this.state.module === 5 && this.state.taskIndex === 14;
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
    this.showFeedback('success', () => this.engine.advanceTask());
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
    this.showFeedback('error', () => this.engine.loseHeart());
  }

  private showFeedback(type: 'success' | 'error', cb: () => void) {
    this.feedbackType = type;
    clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => {
      this.feedbackType = null;
      cb();
    }, type === 'success' ? 800 : 600);
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}