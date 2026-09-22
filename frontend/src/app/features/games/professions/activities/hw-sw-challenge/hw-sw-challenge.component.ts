import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionsEngineService } from '../../engine/professions-engine.service';

@Component({
  selector: 'app-hw-sw-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 border-4 border-yellow-200 flex flex-col items-center text-center mx-auto">
      <div class="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-bold text-sm mb-4">⚡ Desafio Ada</div>

      <ng-container *ngIf="challenge?.icon?.includes('/')">
        <img [src]="challenge?.icon" class="w-32 h-32 object-cover rounded-2xl shadow-md mb-4 border-4 border-yellow-100" alt="Item">
      </ng-container>

      <p class="text-xl md:text-2xl font-bold text-gray-800 mb-8">{{ challenge?.question }}</p>

      <div class="flex w-full gap-4 md:gap-8">
        <button (click)="engine.checkHwSw('HARDWARE')"
                class="flex-1 bg-gray-600 hover:bg-gray-700 text-white p-6 rounded-2xl shadow-lg border-b-4 border-gray-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center">
          <span class="text-4xl mb-2">⚙️</span>
          <span class="text-xl font-black uppercase">Hardware</span>
          <span class="text-xs mt-1 opacity-80">Parte Física</span>
        </button>
        <button (click)="engine.checkHwSw('SOFTWARE')"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center">
          <span class="text-4xl mb-2">💻</span>
          <span class="text-xl font-black uppercase">Software</span>
          <span class="text-xs mt-1 opacity-80">Parte Lógica</span>
        </button>
      </div>
    </div>
  `
})
export class HwSwChallengeComponent {
  constructor(public engine: ProfessionsEngineService) {}
  get challenge() { return this.engine.stateValue.currentHwSwChallenge; }
}
