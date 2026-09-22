import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserSearchEngineService } from './engine/browser-search-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';
import { Subscription } from 'rxjs';

import { BriefingComponent } from './activities/briefing/briefing.component';
import { AnatomyComponent } from './activities/anatomy/anatomy.component';
import { KeywordSearchComponent } from './activities/keyword-search/keyword-search.component';

@Component({
  selector: 'app-browser-search',
  standalone: true,
  imports: [CommonModule, BriefingComponent, AnatomyComponent, KeywordSearchComponent],
  templateUrl: './browser-search.component.html',
  styleUrl: './browser-search.component.scss'
})
export class BrowserSearchComponent implements OnInit, OnDestroy {
  
  private sub!: Subscription;

  constructor(
    public engine: BrowserSearchEngineService,
    private progressReporter: ProgressReporter
  ) {}

  ngOnInit() {
    this.restoreProgress();
    // Re-salvar a cada mudança de estado relevante
    this.sub = this.engine.state$.subscribe(() => {
      this.saveLocalProgress();
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  get state() { return this.engine.stateValue; }
  get activeMission() { return this.engine.activeMission; }
  get activeTask() { return this.engine.activeTask; }
  get missionsLength() { return this.engine['missions'].length; }

  // ==== PERSISTÊNCIA ====

  saveLocalProgress() {
    sessionStorage.setItem('browserSearch_progress', JSON.stringify(this.state));
  }

  restoreProgress() {
    const saved = sessionStorage.getItem('browserSearch_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.engine.restoreProgress(parsed);
      } catch (e) {
        console.error('Erro ao restaurar progresso', e);
      }
    }
  }
}
