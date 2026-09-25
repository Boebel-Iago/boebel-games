import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataAnonymityEngineService } from './engine/data-anonymity-engine.service';

@Component({
  selector: 'app-data-anonymity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-anonymity.component.html',
  styleUrls: ['./data-anonymity.component.scss']
})
export class DataAnonymityComponent {

  constructor(public engine: DataAnonymityEngineService) {}

  get heartsArray(): number[] {
    return Array(this.engine.state.hearts).fill(0);
  }

  get lostHeartsArray(): number[] {
    return Array(3 - this.engine.state.hearts).fill(0);
  }

  get currentModuleLabel(): string {
    const labels = [
      'Módulo 1: Dado Pessoal vs Comum',
      'Módulo 2: O Formulário Seguro',
      'Módulo 3: O Que é Anonimato?',
      'Módulo 4: Rastros Digitais',
      'Módulo 5: Guardião de Privacidade'
    ];
    return labels[this.engine.state.currentModuleIndex] || 'Fim de Jogo';
  }

  get currentInstruction(): string {
    switch (this.engine.state.currentModuleIndex) {
      case 0: return 'Toque no destino correto para a informação abaixo:';
      case 1: return 'Qual dado é PERIGOSO colocar num site de jogos?';
      case 2: return 'Qual frase protege a identidade da pessoa?';
      case 3: return 'Esta ação deixa um rastro na internet?';
      case 4: return 'Onde devemos guardar esta informação?';
      default: return '';
    }
  }

  handleModule1(isSensitive: boolean) {
    const isCorrect = this.engine.currentTask?.content.isSensitive === isSensitive;
    this.engine.submitAnswer(isCorrect);
  }

  handleModule2(selectedIndex: number) {
    const isCorrect = this.engine.currentTask?.content.dangerousIndex === selectedIndex;
    this.engine.submitAnswer(isCorrect);
  }

  handleModule3(selectedIndex: number) {
    const isCorrect = this.engine.currentTask?.content.safeIndex === selectedIndex;
    this.engine.submitAnswer(isCorrect);
  }

  handleModule4(rastro: boolean) {
    const isCorrect = this.engine.currentTask?.content.rastro === rastro;
    this.engine.submitAnswer(isCorrect);
  }

  handleModule5(zone: string) {
    const isCorrect = this.engine.currentTask?.content.zone === zone;
    this.engine.submitAnswer(isCorrect);
  }

  restartGame() {
    this.engine.resetGame();
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
