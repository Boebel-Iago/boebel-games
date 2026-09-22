import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserSearchEngineService } from '../../engine/browser-search-engine.service';

@Component({
  selector: 'app-anatomy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-4xl bg-white border-4 border-gray-300 rounded-xl shadow-2xl overflow-hidden flex flex-col relative mx-auto mt-4">
      
      <!-- Top Bar (Chrome-like) -->
      <div class="bg-gray-200 p-3 flex items-center gap-4 border-b border-gray-300">
        <div class="flex gap-2">
          <button (click)="engine.checkAnatomy('back')" class="w-10 h-10 rounded-full hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold hover:text-indigo-600 transition-colors text-xl">
            ←
          </button>
          <button (click)="engine.checkAnatomy('forward')" class="w-10 h-10 rounded-full hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold hover:text-indigo-600 transition-colors text-xl">
            →
          </button>
          <button (click)="engine.checkAnatomy('refresh')" class="w-10 h-10 rounded-full hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold hover:text-indigo-600 transition-colors text-xl">
            ↻
          </button>
        </div>

        <!-- URL Bar -->
        <div (click)="engine.checkAnatomy('url')" class="flex-1 bg-white rounded-full px-4 py-2 flex items-center gap-3 border border-gray-300 hover:border-indigo-400 hover:shadow-inner cursor-pointer group transition-all">
          <span (click)="engine.checkAnatomy('lock'); $event.stopPropagation()" class="text-gray-400 group-hover:text-green-600 hover:scale-125 transition-transform text-lg" title="Segurança">
            🔒
          </span>
          <span class="font-mono text-gray-600 group-hover:text-indigo-900 w-full font-medium">
            https://www.agenciacyber.edu.br/missoes
          </span>
          <span (click)="engine.checkAnatomy('bookmark'); $event.stopPropagation()" class="text-gray-300 hover:text-yellow-400 group-hover:text-yellow-300 hover:scale-125 transition-transform text-xl" title="Favoritar">
            ★
          </span>
        </div>
      </div>
      
      <div class="p-12 text-center bg-white min-h-[400px] flex flex-col items-center justify-center">
        <h1 class="text-5xl font-black text-gray-200 mb-4">Página da Missão</h1>
        <p class="text-gray-400 text-xl font-medium">O conteúdo será carregado quando você dominar o painel.</p>
      </div>
    </div>
  `
})
export class AnatomyComponent {
  constructor(public engine: BrowserSearchEngineService) {}
}
