import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CreatorsEngineService } from './engine/creators-engine.service';

import { BriefingComponent } from './activities/briefing/briefing.component';
import { LicenseCardsComponent } from './activities/license-cards/license-cards.component';
import { PlagiarismCourtComponent } from './activities/plagiarism-court/plagiarism-court.component';

@Component({
  selector: 'app-creators-vs-copiers',
  standalone: true,
  imports: [
    CommonModule,
    BriefingComponent,
    LicenseCardsComponent,
    PlagiarismCourtComponent
  ],
  templateUrl: './creators-vs-copiers.component.html',
  styleUrl: './creators-vs-copiers.component.scss'
})
export class CreatorsVsCopiersComponent implements OnInit, OnDestroy {
  studentName = sessionStorage.getItem('studentName') || 'Recruta';
  private sub!: Subscription;

  constructor(public engine: CreatorsEngineService) {}

  ngOnInit() {
    this.restoreProgress();
    this.sub = this.engine.state$.subscribe(() => {
      this.saveLocalProgress();
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  get state() { return this.engine.stateValue; }
  get currentMission() { return this.engine.currentMission; }
  get missionsLength() { return this.engine['missions'].length; }

  // ==== PERSISTÊNCIA ====

  saveLocalProgress() {
    const absoluteStage = this.engine.getAbsoluteStage();
    sessionStorage.setItem('currentStage', absoluteStage.toString());
  }

  restoreProgress() {
    const saved = sessionStorage.getItem('currentStage');
    if (saved) {
      try {
        const stage = parseInt(saved, 10);
        if (!isNaN(stage) && stage > 0) {
          const m1Total = this.engine.licenseTasks.length;
          const m2Total = this.engine.plagiarismTasksModule2.length;
          const m3Total = this.engine.plagiarismTasksModule3.length;

          if (stage >= m1Total + m2Total + m3Total) {
            this.engine.restoreProgress({ gameFinished: true, displayMode: 'finished' });
          } else if (stage >= m1Total + m2Total) {
            this.engine.restoreProgress({ 
              currentMissionIndex: 2, 
              currentTaskIndex: stage - (m1Total + m2Total),
              displayMode: 'gameplay' 
            });
          } else if (stage >= m1Total) {
            this.engine.restoreProgress({ 
              currentMissionIndex: 1, 
              currentTaskIndex: stage - m1Total,
              displayMode: 'gameplay' 
            });
          } else {
            this.engine.restoreProgress({ 
              currentMissionIndex: 0, 
              currentTaskIndex: stage,
              displayMode: 'gameplay' 
            });
          }
        }
      } catch (e) {
        console.error('Erro ao restaurar progresso', e);
      }
    }
  }
}