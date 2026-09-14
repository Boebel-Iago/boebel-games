import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassifyItem, ClassifyPhaseConfig } from '../../content/phase.model';

@Component({
  selector: 'app-classify-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classify-activity.component.html'
})
export class ClassifyActivityComponent implements OnChanges {
  @Input({ required: true }) phase!: ClassifyPhaseConfig;
  @Output() completed = new EventEmitter<boolean>();

  remainingItems: ClassifyItem[] = [];
  placedItems: Record<string, ClassifyItem[]> = {};
  selectedItemId: string | null = null;
  wrongItemId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['phase']) {
      this.reset();
    }
  }

  private reset(): void {
    this.remainingItems = [...this.phase.items];
    this.placedItems = Object.fromEntries(this.phase.buckets.map(b => [b.id, [] as ClassifyItem[]]));
    this.selectedItemId = null;
    this.wrongItemId = null;
  }

  selectItem(item: ClassifyItem): void {
    this.wrongItemId = null;
    this.selectedItemId = this.selectedItemId === item.id ? null : item.id;
  }

  selectBucket(bucketId: string): void {
    if (!this.selectedItemId) return;
    const item = this.remainingItems.find(i => i.id === this.selectedItemId);
    if (!item) return;

    if (item.correctBucket === bucketId) {
      this.placedItems[bucketId].push(item);
      this.remainingItems = this.remainingItems.filter(i => i.id !== item.id);
      this.selectedItemId = null;
      this.wrongItemId = null;

      if (this.remainingItems.length === 0) {
        setTimeout(() => this.completed.emit(true), 400);
      }
    } else {
      // Não bloqueia: deixa tentar de novo, só avisa visualmente.
      this.wrongItemId = item.id;
      this.selectedItemId = null;
    }
  }
}