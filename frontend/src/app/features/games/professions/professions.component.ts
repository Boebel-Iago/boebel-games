import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProfessionsEngineService } from './engine/professions-engine.service';

import { BriefingComponent } from './activities/briefing/briefing.component';
import { ToolMatchComponent } from './activities/tool-match/tool-match.component';
import { HwSwChallengeComponent } from './activities/hw-sw-challenge/hw-sw-challenge.component';
import { SoftwareIdentifyComponent } from './activities/software-identify/software-identify.component';
import { CategorySortComponent } from './activities/category-sort/category-sort.component';
import { DragDropComponent } from './activities/drag-drop/drag-drop.component';

@Component({
  selector: 'app-professions',
  standalone: true,
  imports: [
    CommonModule, 
    BriefingComponent, 
    ToolMatchComponent, 
    HwSwChallengeComponent, 
    SoftwareIdentifyComponent, 
    CategorySortComponent, 
    DragDropComponent
  ],
  templateUrl: './professions.component.html',
  styleUrl: './professions.component.scss'
})
export class ProfessionsComponent implements OnInit, OnDestroy {
  studentName = sessionStorage.getItem('studentName') || 'Recruta';
  private sub!: Subscription;

  constructor(public engine: ProfessionsEngineService) {}

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
          const m1Total = this.engine.professions.length + this.engine.hwSwChallenges.length;
          const m2Total = this.engine.softwareTasks.length;
          const m3Total = this.engine.scenarios.length;
          const m4Total = this.engine.phase3Data.length;

          if (stage >= m1Total + m2Total + m3Total + m4Total) {
            this.engine.restoreProgress({ gameFinished: true, displayMode: 'finished' });
          } else if (stage >= m1Total + m2Total + m3Total) {
            this.engine.restoreProgress({ 
              currentMissionIndex: 3, 
              phase3Level: stage - (m1Total + m2Total + m3Total) + 1,
              displayMode: 'gameplay' 
            });
          } else if (stage >= m1Total + m2Total) {
            this.engine.restoreProgress({ 
              currentMissionIndex: 2, 
              currentTaskIndex: stage - (m1Total + m2Total),
              energyBlocks: stage - (m1Total + m2Total),
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