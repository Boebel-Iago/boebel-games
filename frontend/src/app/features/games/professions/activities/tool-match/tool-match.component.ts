import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionsEngineService } from '../../engine/professions-engine.service';

@Component({
  selector: 'app-tool-match',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center">

      <!-- O Profissional -->
      <div class="bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-100 flex flex-col items-center w-full md:w-1/3">
        <ng-container *ngIf="profession.icon.includes('/')">
          <img [src]="profession.icon" class="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-md mb-4 border-4 border-white" alt="Profissão">
        </ng-container>
        <h3 class="text-2xl font-black text-gray-800">{{ profession.name }}</h3>
        <p class="text-sm text-gray-500 mt-1">Qual ferramenta este profissional usa?</p>
      </div>

      <div class="hidden md:block text-5xl text-gray-300 font-bold">➔</div>

      <!-- Opções de Ferramenta (4 opções) -->
      <div class="w-full md:w-2/3 grid grid-cols-2 gap-4">
        <button *ngFor="let tool of state.currentOptions" (click)="engine.checkTool(tool)"
                class="bg-white p-4 md:p-6 rounded-2xl shadow-md border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center cursor-pointer">
          <ng-container *ngIf="tool.icon.includes('/')">
            <img [src]="tool.icon" class="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl shadow-md mb-3 border-2 border-gray-100" alt="Ferramenta">
          </ng-container>
          <ng-container *ngIf="!tool.icon.includes('/')">
            <span class="text-6xl md:text-7xl mb-3 drop-shadow">{{ tool.icon }}</span>
          </ng-container>
          <span class="font-bold text-gray-700 text-sm md:text-base text-center">{{ tool.name }}</span>
        </button>
      </div>
    </div>
  `
})
export class ToolMatchComponent {
  constructor(public engine: ProfessionsEngineService) {}
  
  get state() { return this.engine.stateValue; }
  get profession() { return this.engine.professions[this.state.currentTaskIndex]; }
}
