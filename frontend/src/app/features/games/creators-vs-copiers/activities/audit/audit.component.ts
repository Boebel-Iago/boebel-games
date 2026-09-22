import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatorsEngineService } from '../../engine/creators-engine.service';

@Component({
  selector: 'app-creators-audit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-5xl flex flex-col md:flex-row gap-8 mx-auto">
      
      <!-- O Recurso Auditado -->
      <div class="w-full md:w-3/5 bg-white rounded-3xl shadow-2xl border-2 border-gray-300 overflow-hidden flex flex-col">
        <div class="bg-gray-800 text-white p-3 flex items-center gap-2 font-medium">
          <span>🔍</span> Relatório de Auditoria #{{ state.currentTaskIndex + 1 }}
        </div>
        
        <div class="p-8 md:p-10 flex-1 flex flex-col justify-center gap-6">
          
          <div class="bg-gray-50 border-l-4 border-indigo-500 p-4 rounded-r-xl">
            <h3 class="text-indigo-800 font-bold uppercase tracking-wide text-xs mb-1">Recurso Analisado:</h3>
            <p class="text-xl font-black text-gray-800">{{ task.assetName }}</p>
          </div>

          <div class="bg-gray-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
            <h3 class="text-emerald-800 font-bold uppercase tracking-wide text-xs mb-1">Licença Original:</h3>
            <p class="text-lg font-bold text-gray-800">{{ task.originalLicense }}</p>
          </div>

          <div class="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl mt-2">
            <h3 class="text-blue-800 font-bold uppercase tracking-wide text-sm mb-2">Uso no Projeto:</h3>
            <p class="text-xl text-gray-900 leading-snug italic">
              "{{ task.studentAction }}"
            </p>
          </div>

        </div>
      </div>

      <!-- Veredito (Botões de julgamento) -->
      <div class="w-full md:w-2/5 flex flex-col gap-4 justify-center">
        <div class="text-center mb-4">
          <h3 class="text-gray-500 font-bold uppercase tracking-widest text-sm">Decisão do Auditor:</h3>
          <p class="text-gray-800 text-lg">O uso respeitou a licença original?</p>
        </div>

        <button (click)="engine.voteAudit(true)"
          class="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-2xl shadow-lg border-b-8 border-emerald-700 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center group">
          <span class="text-5xl mb-2 group-hover:scale-110 transition-transform">✅</span>
          <span class="text-2xl font-black uppercase">APROVADO</span>
          <span class="text-sm mt-1 opacity-90">Tudo Legal</span>
        </button>

        <button (click)="engine.voteAudit(false)"
          class="bg-red-500 hover:bg-red-600 text-white p-6 rounded-2xl shadow-lg border-b-8 border-red-700 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center group">
          <span class="text-5xl mb-2 group-hover:scale-110 transition-transform">❌</span>
          <span class="text-2xl font-black uppercase">REPROVADO</span>
          <span class="text-sm mt-1 opacity-90">Violação de Direitos</span>
        </button>
      </div>

    </div>
  `
})
export class AuditComponent {
  constructor(public engine: CreatorsEngineService) {}
  get state() { return this.engine.stateValue; }
  get task() { return this.engine.auditTasks[this.state.currentTaskIndex]; }
}
