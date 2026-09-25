import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserSearchEngineService } from '../../engine/browser-search-engine.service';

@Component({
  selector: 'app-keyword-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-4xl flex flex-col gap-6 mx-auto mt-4">
      
      <div class="bg-white p-8 rounded-2xl shadow-lg border-4 border-gray-200 min-h-[150px] flex flex-col items-center justify-center relative">
        <div class="absolute -top-4 bg-indigo-100 text-indigo-800 font-bold px-4 py-1 rounded-full border-2 border-indigo-300 text-sm">
          SUA PESQUISA:
        </div>
        
        <div class="flex flex-wrap gap-3 justify-center mt-4">
          <div *ngIf="state.selectedWords.length === 0" class="text-gray-400 font-medium italic text-xl">
            Toque nas palavras abaixo para formar sua pesquisa...
          </div>
          
          <button 
            *ngFor="let word of state.selectedWords" 
            (click)="engine.removeWord(word)"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl py-3 px-6 rounded-xl shadow border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 group">
            {{ word }} <span class="text-blue-200 group-hover:text-white text-sm">✖</span>
          </button>
        </div>
      </div>

      <div class="bg-gray-100 p-8 rounded-2xl shadow-inner border-4 border-gray-200 border-dashed">
        <h4 class="text-gray-500 font-bold mb-4 text-center uppercase tracking-widest">Banco de Palavras Misturadas</h4>
        <div class="flex flex-wrap gap-4 justify-center">
          <button 
            *ngFor="let word of state.availableWords" 
            (click)="engine.selectWord(word)"
            class="bg-white hover:bg-indigo-50 text-gray-800 font-bold text-xl py-4 px-6 rounded-xl shadow-md border-2 border-gray-300 hover:border-indigo-400 hover:text-indigo-700 transition-all transform hover:-translate-y-1">
            {{ word }}
          </button>
        </div>
      </div>

      <div class="flex justify-center mt-4">
        <button 
          (click)="engine.checkKeywords()"
          [disabled]="state.selectedWords.length === 0"
          class="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 disabled:border-gray-500 disabled:transform-none text-white font-black text-2xl py-6 px-12 rounded-full shadow-xl border-b-8 border-emerald-700 active:border-b-0 active:translate-y-2 transition-all flex items-center gap-3">
          <span>🚀</span> ACIONAR MOTOR DE BUSCA
        </button>
      </div>
    </div>
  `
})
export class KeywordSearchComponent {
  constructor(public engine: BrowserSearchEngineService) {}
  
  get state() { return this.engine.stateValue; }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
