import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatorsEngineService } from '../../engine/creators-engine.service';

@Component({
  selector: 'app-license-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-5xl flex flex-col items-center mx-auto">
      <!-- O Símbolo em Destaque -->
      <div class="bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-100 flex flex-col items-center w-full max-w-md mb-8">
        <h3 class="text-xl font-bold text-gray-500 mb-4 uppercase tracking-widest">O que significa:</h3>
        <div class="text-8xl md:text-9xl mb-4 drop-shadow-lg">{{ task.symbol }}</div>
        <h2 class="text-3xl font-black text-gray-800 text-center">{{ task.name }}</h2>
      </div>

      <!-- As Cartas de Opções -->
      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <button *ngFor="let option of state.currentOptions" (click)="engine.checkLicense(option)"
          class="bg-white p-8 rounded-2xl shadow-md border-b-8 border-gray-300 hover:border-emerald-600 hover:shadow-xl hover:-translate-y-2 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center text-center cursor-pointer min-h-[160px]">
          <span class="font-bold text-gray-700 text-xl leading-snug">{{ option }}</span>
        </button>
      </div>
    </div>
  `
})
export class LicenseCardsComponent {
  constructor(public engine: CreatorsEngineService) {}
  get state() { return this.engine.stateValue; }
  get task() { return this.engine.licenseTasks[this.state.currentTaskIndex]; }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
