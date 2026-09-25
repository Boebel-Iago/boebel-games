import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionsEngineService } from '../../engine/professions-engine.service';

@Component({
  selector: 'app-category-sort',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-3xl flex flex-col items-center gap-6 mx-auto">
      <!-- Barra de Energia -->
      <div class="w-full bg-white rounded-2xl shadow p-4 flex items-center gap-3">
        <span class="text-lg">⚡</span>
        <div class="flex-1 bg-gray-200 rounded-full h-4">
          <div class="bg-gradient-to-r from-yellow-400 to-green-400 h-4 rounded-full transition-all duration-500"
               [style.width.%]="engine.totalEnergyBlocks > 0 ? (state.energyBlocks / engine.totalEnergyBlocks * 100) : 0"></div>
        </div>
        <span class="text-sm font-bold text-gray-600">{{ state.energyBlocks }}/{{ engine.totalEnergyBlocks }}</span>
      </div>

      <!-- O Cenário -->
      <div class="bg-white w-full p-8 rounded-3xl shadow-xl border-4 border-emerald-100 flex flex-col md:flex-row items-center text-center md:text-left gap-6">
        <ng-container *ngIf="scenario.icon.includes('/')">
          <img [src]="scenario.icon" class="w-36 h-36 object-cover rounded-2xl shadow-md border-4 border-white" alt="Cenário">
        </ng-container>
        <ng-container *ngIf="!scenario.icon.includes('/')">
          <span class="text-7xl drop-shadow-md">{{ scenario.icon }}</span>
        </ng-container>
        <h3 class="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
          {{ scenario.description }}
        </h3>
      </div>

      <!-- 3 Botões Gigantes -->
      <div class="flex w-full gap-3 md:gap-6">
        <button (click)="engine.checkScenario('TRABALHO')"
                class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-2xl shadow-lg border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center">
          <span class="text-4xl mb-1">💼</span>
          <span class="text-lg md:text-xl font-black uppercase">Trabalho</span>
        </button>
        <button (click)="engine.checkScenario('ESTUDO')"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center">
          <span class="text-4xl mb-1">📚</span>
          <span class="text-lg md:text-xl font-black uppercase">Estudo</span>
        </button>
        <button (click)="engine.checkScenario('LAZER')"
                class="flex-1 bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-2xl shadow-lg border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center">
          <span class="text-4xl mb-1">🎮</span>
          <span class="text-lg md:text-xl font-black uppercase">Lazer</span>
        </button>
      </div>
    </div>
  `
})
export class CategorySortComponent {
  constructor(public engine: ProfessionsEngineService) {}
  get state() { return this.engine.stateValue; }
  get scenario() { return this.engine.scenarios[this.state.currentTaskIndex]; }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
