import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionsEngineService } from '../../engine/professions-engine.service';

@Component({
  selector: 'app-software-identify',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-3xl flex flex-col items-center gap-6 mx-auto">
      <!-- Profissional -->
      <div class="bg-white w-full p-8 rounded-3xl shadow-xl border-4 border-purple-100 flex flex-col md:flex-row items-center gap-6">
        <ng-container *ngIf="task.professionIcon.includes('/')">
          <img [src]="task.professionIcon" class="w-36 h-36 object-cover rounded-2xl shadow-md border-4 border-white" alt="Profissional">
        </ng-container>
        <div class="text-center md:text-left">
          <h3 class="text-xl font-black text-gray-800 mb-2">{{ task.professionName }}</h3>
          <p class="text-lg text-gray-600 font-medium">{{ task.question }}</p>
        </div>
      </div>

      <!-- Opções de Software -->
      <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
        <button *ngFor="let opt of state.currentSoftwareOptions" (click)="engine.checkSoftwareAnswer(opt)"
                class="bg-white p-5 rounded-2xl shadow-md border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer text-left">
          <span class="text-lg font-bold text-gray-700 flex items-center gap-3">
            <span class="text-2xl">💿</span> {{ opt }}
          </span>
        </button>
      </div>
    </div>
  `
})
export class SoftwareIdentifyComponent {
  constructor(public engine: ProfessionsEngineService) {}
  get state() { return this.engine.stateValue; }
  get task() { return this.engine.softwareTasks[this.state.currentTaskIndex]; }
}
