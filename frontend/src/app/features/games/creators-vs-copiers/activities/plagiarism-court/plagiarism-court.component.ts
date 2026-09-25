import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatorsEngineService } from '../../engine/creators-engine.service';

@Component({
  selector: 'app-plagiarism-court',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-5xl flex flex-col md:flex-row gap-8 mx-auto">
      
      <!-- O Caso -->
      <div class="w-full md:w-3/5 bg-white rounded-3xl shadow-2xl border-2 border-gray-300 overflow-hidden flex flex-col">
        <div class="bg-blue-600 text-white p-3 flex items-center gap-2 font-medium">
          <span>📄</span> Caso_{{ state.currentTaskIndex + 1 }}.docx
        </div>
        
        <div class="p-8 md:p-10 flex-1 flex flex-col justify-center">
          <h3 class="text-gray-500 font-bold uppercase tracking-wide mb-2 text-sm">Situação:</h3>
          <p class="text-xl text-gray-800 mb-6 italic">
            "{{ task.scenario }}"
          </p>

          <div class="border-t-2 border-dashed border-gray-300 pt-6">
            <h3 class="text-blue-600 font-bold uppercase tracking-wide mb-2 text-sm">Ação do Aluno:</h3>
            <p class="text-2xl font-black text-gray-900 leading-snug">
              {{ task.studentAction }}
            </p>
          </div>
        </div>
      </div>

      <!-- Veredito (Botões de julgamento) -->
      <div class="w-full md:w-2/5 flex flex-col gap-4 justify-center">
        <div class="text-center mb-4">
          <h3 class="text-gray-500 font-bold uppercase tracking-widest text-sm">Seu Veredito, Juiz:</h3>
          <p class="text-gray-800 text-lg">Essa atitude foi correta ou foi plágio?</p>
        </div>

        <div class="flex flex-col gap-4" [ngClass]="{\'flex-col-reverse\': swapButtons}">

        <button (click)="engine.votePlagiarism(true)"
          class="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-2xl shadow-lg border-b-8 border-emerald-700 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center group">
          <span class="text-5xl mb-2 group-hover:scale-110 transition-transform">✅</span>
          <span class="text-2xl font-black uppercase">Uso Correto</span>
          <span class="text-sm mt-1 opacity-90">Deu os créditos / É livre</span>
        </button>
        <button (click)="engine.votePlagiarism(false)"
          class="bg-red-500 hover:bg-red-600 text-white p-6 rounded-2xl shadow-lg border-b-8 border-red-700 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center group">
          <span class="text-5xl mb-2 group-hover:scale-110 transition-transform">❌</span>
          <span class="text-2xl font-black uppercase">Plágio / Erro</span>
          <span class="text-sm mt-1 opacity-90">Copiou e fingiu que é seu</span>
        </button>
        </div>
      </div>

    </div>
  `
})
export class PlagiarismCourtComponent implements OnInit {
  swapButtons = false;
  ngOnInit() { this.swapButtons = Math.random() > 0.5; }

  constructor(public engine: CreatorsEngineService) {}
  get state() { return this.engine.stateValue; }
  
  get task() { 
    if (this.state.currentMissionIndex === 1) {
      return this.engine.plagiarismTasksModule2[this.state.currentTaskIndex]; 
    }
    return this.engine.plagiarismTasksModule3[this.state.currentTaskIndex]; 
  }
}
