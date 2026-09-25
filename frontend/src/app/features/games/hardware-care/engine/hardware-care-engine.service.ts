import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  module: number;
  phase: number;
  hearts: number;
}

@Injectable({ providedIn: 'root' })
export class HardwareCareEngineService {
  state: GameState = { module: 0, phase: 0, hearts: 3 };
  
  // Módulo 1: Mãos Limpas (Tap)
  m1Data = [
    { correct: 'Mão limpa e seca ✨', wrong: 'Mão suja de chocolate 🍫' },
    { correct: 'Mãos lavadas 🧼', wrong: 'Mãos cheias de terra 🌱' },
    { correct: 'Mãos secas 🌬️', wrong: 'Mãos molhadas 💧' },
    { correct: 'Mãos limpas 👐', wrong: 'Mãos engorduradas 🍕' },
    { correct: 'Mãos recém-lavadas 🚿', wrong: 'Mãos sujas de tinta 🎨' },
    { correct: 'Mãos enxutas 🧻', wrong: 'Mãos pingando água ☔' },
    { correct: 'Mão sem sujeira 🖐️', wrong: 'Mão com poeira 🌪️' },
    { correct: 'Mãos de quem lavou 🫧', wrong: 'Mãos de quem comeu salgadinho 🧀' },
    { correct: 'Mãos higienizadas 🧴', wrong: 'Mãos pegajosas de doce 🍬' },
    { correct: 'Mão perfeitamente limpa 👍', wrong: 'Mão suja de barro 🟤' }
  ];

  // Módulo 2: Comida e Eletrônicos (Drag & Drop)
  m2Data = [
    { item: '💧 Copo d\'água', correctZone: 'perigo' },
    { item: '🍕 Pedaço de Pizza', correctZone: 'perigo' },
    { item: '🎧 Fone de ouvido', correctZone: 'seguro' },
    { item: '🖱️ Mouse', correctZone: 'seguro' },
    { item: '🥤 Suco de uva', correctZone: 'perigo' },
    { item: '⌨️ Teclado', correctZone: 'seguro' },
    { item: '🍫 Barra de chocolate', correctZone: 'perigo' },
    { item: '🍟 Batata frita', correctZone: 'perigo' },
    { item: '🖊️ Caneta touch', correctZone: 'seguro' },
    { item: '🔋 Carregador', correctZone: 'seguro' }
  ];

  // Módulo 3: Transporte e Uso (Tap)
  m3Data = [
    { correct: 'Levar o notebook fechado com as duas mãos 🤲', wrong: 'Correr com o notebook aberto 🏃‍♂️' },
    { correct: 'Puxar pelo plugue 🔌', wrong: 'Puxar o fio da tomada 〰️' },
    { correct: 'Apertar as teclas com carinho ⌨️', wrong: 'Bater forte no teclado 👊' },
    { correct: 'Usar em uma mesa reta 🪑', wrong: 'Usar equilibrando no joelho 🦵' },
    { correct: 'Fechar a tela com cuidado 💻', wrong: 'Bater a tela para fechar 💥' },
    { correct: 'Guardar o tablet na capa 🎒', wrong: 'Jogar o tablet solto na mochila 🎒' },
    { correct: 'Desenrolar o fio antes de usar 🧶', wrong: 'Usar com o fio todo embolado 🌪️' },
    { correct: 'Carregar na tomada com cuidado ⚡', wrong: 'Forçar o cabo se não encaixar 😡' },
    { correct: 'Colocar o celular na mesa 📱', wrong: 'Jogar o celular na mesa ⚾' },
    { correct: 'Pedir ajuda para ligar na tomada 🙋', wrong: 'Ligar sozinho correndo perigo ⚡' }
  ];

  // Módulo 4: Depois de Usar (Drag & Drop)
  m4Data = [
    { scenario: 'A aula acabou', correctAction: 'Guardar na mochila', wrongAction: 'Deixar no chão' },
    { scenario: 'A bateria ficou vermelha', correctAction: 'Colocar para carregar', wrongAction: 'Continuar usando até desligar' },
    { scenario: 'A tela sujou', correctAction: 'Pedir um paninho macio', wrongAction: 'Limpar com a manga da blusa suja' },
    { scenario: 'Acabou de usar o fone', correctAction: 'Enrolar e guardar', wrongAction: 'Deixar jogado no sofá' },
    { scenario: 'O notebook esquentou muito', correctAction: 'Desligar um pouco', wrongAction: 'Colocar um travesseiro embaixo' },
    { scenario: 'Vai brincar lá fora', correctAction: 'Desligar o tablet', wrongAction: 'Deixar o tablet no sol' },
    { scenario: 'Terminou a tarefa', correctAction: 'Fechar os programas', wrongAction: 'Deixar tudo aberto pra sempre' },
    { scenario: 'O mouse parou de mexer', correctAction: 'Verificar o cabo/bateria', wrongAction: 'Bater o mouse na mesa' },
    { scenario: 'A capinha do tablet soltou', correctAction: 'Colocar a capinha de volta', wrongAction: 'Usar sem capinha e deixar cair' },
    { scenario: 'Hora do lanche', correctAction: 'Pausar e sair de perto', wrongAction: 'Comer em cima do teclado' }
  ];

  // Módulo 5: O Grande Inspetor (Drag & Drop - 3 zonas)
  // Categorias: higiene, energia, transporte
  m5Data = [
    { item: 'Cabo desencapado ⚡', category: 'energia' },
    { item: 'Dedo engordurado 🍕', category: 'higiene' },
    { item: 'Tablet solto na mochila 🎒', category: 'transporte' },
    { item: 'Tomada saindo faísca 💥', category: 'energia' },
    { item: 'Tela cheia de poeira 🌬️', category: 'higiene' },
    { item: 'Notebook equilibrado na ponta da mesa 🪑', category: 'transporte' },
    { item: 'Mão suja de tinta no mouse 🎨', category: 'higiene' },
    { item: 'Puxando o fio com força 🔌', category: 'energia' },
    { item: 'Correndo com o celular na mão 🏃', category: 'transporte' },
    { item: 'Carregador molhado 💧', category: 'energia' }
  ];

  currentModuleTasks: any[] = [];
  currentTaskIndex: number = 0;

  constructor(private progress: ProgressReporter) {
    this.loadState();
    this.initializeModule();
  }

  loadState() {
    const saved = localStorage.getItem('boebel_hardware_care_state');
    if (saved) {
      this.state = JSON.parse(saved);
      // Ensure validity
      if (this.state.module > 4) {
        this.resetGame();
      }
    } else {
      this.state = { module: 0, phase: 0, hearts: 3 };
    }
  }

  saveState() {
    if (this.state.module > 4) {
      localStorage.removeItem('boebel_hardware_care_state');
    } else {
      localStorage.setItem('boebel_hardware_care_state', JSON.stringify(this.state));
    }
  }

  resetGame() {
    this.state = { module: 0, phase: 0, hearts: 3 };
    this.saveState();
    this.initializeModule();
  }

  shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  initializeModule() {
    let dataToShuffle: any[] = [];
    switch (this.state.module) {
      case 0: dataToShuffle = [...this.m1Data]; break;
      case 1: dataToShuffle = [...this.m2Data]; break;
      case 2: dataToShuffle = [...this.m3Data]; break;
      case 3: dataToShuffle = [...this.m4Data]; break;
      case 4: dataToShuffle = [...this.m5Data]; break;
      default: dataToShuffle = []; break;
    }
    this.currentModuleTasks = this.shuffle(dataToShuffle);
    this.currentTaskIndex = this.state.phase;
  }

  getCurrentTask() {
    if (this.state.module > 4) return null;
    return this.currentModuleTasks[this.state.phase];
  }

  reportMistake() {
    this.progress.report({
      levelId: `hardware-care-m\${this.state.module + 1}-p\${this.state.phase + 1}`,
      fase: this.state.module * 10 + this.state.phase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });

    this.state.hearts--;
    if (this.state.hearts <= 0) {
      // Restart current module
      this.state.hearts = 3;
      this.state.phase = 0;
      this.initializeModule();
    }
    this.saveState();
  }

  completePhase() {
    const isLastModule = this.state.module === 4;
    const isLastPhase = this.state.phase === 9;
    const isLastLevel = isLastModule && isLastPhase;

    this.progress.report({
      levelId: `hardware-care-m\${this.state.module + 1}-p\${this.state.phase + 1}`,
      fase: this.state.module * 10 + this.state.phase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });

    if (isLastLevel) {
      this.state.module++; // will be 5 (game over)
      this.saveState();
      return;
    }

    if (isLastPhase) {
      this.state.module++;
      this.state.phase = 0;
      this.state.hearts = 3; // refill hearts on new module
      this.initializeModule();
    } else {
      this.state.phase++;
    }
    this.saveState();
  }
}
