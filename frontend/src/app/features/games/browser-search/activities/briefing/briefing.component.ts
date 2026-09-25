import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserSearchEngineService } from '../../engine/browser-search-engine.service';

@Component({
  selector: 'app-briefing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-4xl bg-white border-4 border-gray-300 rounded-xl shadow-xl overflow-hidden flex flex-col mt-4">
      <div class="bg-indigo-900 text-white p-4 font-bold text-lg flex items-center gap-3 tracking-wider">
        <span>🚀</span> TRANSMISSÃO DA CENTRAL DE COMANDO
      </div>
      
      <div class="p-8 flex flex-col md:flex-row items-center gap-8 bg-slate-100">
        <div class="text-8xl md:text-9xl drop-shadow-xl transform hover:scale-110 transition-transform">🤖</div>
        <div class="bg-white p-6 rounded-3xl shadow-lg border-2 border-indigo-200 relative w-full">
          <div class="absolute -left-3 top-10 w-6 h-6 bg-white border-b-2 border-l-2 border-indigo-200 transform rotate-45 hidden md:block"></div>
          <h4 class="text-indigo-900 font-black mb-2 text-xl uppercase tracking-wider">T-B0T diz:</h4>
          <p class="text-xl text-gray-800 font-medium leading-relaxed italic">
            "{{ activeMission.briefing[state.briefingIndex].text }}"
          </p>
        </div>
      </div>
      
      <div class="bg-gray-200 p-4 flex justify-end">
        <button (click)="engine.nextBriefing()" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-3 px-8 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
          ENTENDIDO! <span>👍</span>
        </button>
      </div>
    </div>
  `
})
export class BriefingComponent {
  constructor(public engine: BrowserSearchEngineService) {}
  
  get state() { return this.engine.stateValue; }
  get activeMission() { return this.engine.activeMission; }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
