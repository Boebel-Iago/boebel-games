import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatorsEngineService } from '../../engine/creators-engine.service';

@Component({
  selector: 'app-creators-briefing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 md:p-10 border-4 border-emerald-200 flex flex-col items-center text-center">
      <!-- Avatar Justino -->
      <div class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-emerald-100 flex items-center justify-center mb-4 border-4 border-emerald-300 shadow-lg">
        <span class="text-5xl md:text-6xl">🕵️‍♂️</span>
      </div>

      <h3 class="text-lg font-bold text-emerald-600 mb-2">Inspetor Justino</h3>

      <!-- Balão de diálogo -->
      <div class="bg-emerald-50 rounded-2xl p-6 md:p-8 w-full mb-6 border-2 border-emerald-100 relative">
        <p class="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
          {{ currentDialogue?.text }}
        </p>
      </div>

      <button (click)="engine.advanceDialogue()"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md transition-colors">
        {{ state.displayMode === 'mission-complete' && state.currentDialogueIndex >= currentMission.debriefing.length - 1
           ? (state.currentMissionIndex >= missionsLength - 1 ? '🏆 Ver Diploma' : '➔ Próxima Missão')
           : 'Continuar ➔' }}
      </button>
    </div>
  `
})
export class BriefingComponent {
  constructor(public engine: CreatorsEngineService) {}
  
  get state() { return this.engine.stateValue; }
  get currentMission() { return this.engine.currentMission; }
  get missionsLength() { return this.engine['missions'].length; }

  get currentDialogue() {
    if (this.state.displayMode === 'briefing') {
      return this.currentMission.briefing[this.state.currentDialogueIndex] || null;
    }
    if (this.state.displayMode === 'mission-complete') {
      return this.currentMission.debriefing[this.state.currentDialogueIndex] || null;
    }
    return null;
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
