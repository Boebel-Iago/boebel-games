import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconMessagePhaseConfig, IconOption } from '../../content/phase.model';

@Component({
  selector: 'app-icon-message-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-message-activity.component.html'
})
export class IconMessageActivityComponent implements OnChanges {
  @Input({ required: true }) phase!: IconMessagePhaseConfig;
  @Output() completed = new EventEmitter<boolean>();

  placedIds: string[] = [];
  wrongIconId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['phase']) {
      this.placedIds = [];
      this.wrongIconId = null;
    }
  }

  get placedIcons(): IconOption[] {
    return this.placedIds
      .map(id => this.phase.availableIcons.find(i => i.id === id))
      .filter((i): i is IconOption => !!i);
  }

  get remainingIcons(): IconOption[] {
    return this.phase.availableIcons.filter(i => !this.placedIds.includes(i.id));
  }

  selectIcon(icon: IconOption): void {
    const expectedId = this.phase.correctSequence[this.placedIds.length];

    if (icon.id === expectedId) {
      this.wrongIconId = null;
      this.placedIds.push(icon.id);

      if (this.placedIds.length === this.phase.correctSequence.length) {
        setTimeout(() => this.completed.emit(true), 500);
      }
    } else {
      this.wrongIconId = icon.id;
    }
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}