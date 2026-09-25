import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  module: number;
  task: number;
  hearts: number;
  deathCount: number;
}

export interface CodeTask {
  code: string;
}

export interface DragTask {
  item: string;
  type: string; // The correct drop zone id
}

export interface TapTask {
  passwords: { text: string; isStrong: boolean }[];
}

@Injectable({ providedIn: 'root' })
export class PasswordMysteryEngineService {
  private readonly MAX_MODULES = 5;
  private readonly TASKS_PER_MODULE = 10;
  private readonly MAX_HEARTS = 3;

  state: GameState = {
    module: 0, // 0 to 4
    task: 0,   // 0 to 9
    hearts: this.MAX_HEARTS,
    deathCount: 0,
  };

  constructor(private progress: ProgressReporter) {
    const sessionState$ = this.progress.fetchSessionState();
    if (sessionState$) {
      sessionState$.subscribe((res: any) => {
        if (res && res.gameState) {
          try {
            this.state = JSON.parse(res.gameState);
          } catch (e) {
            console.error('Failed to parse remote game state', e);
          }
        }
      });
    }
  }

  get score(): number {
    return Math.max(0, (this.state.module * 200) + (this.state.task * 20) - (this.state.deathCount * 20));
  }

  // --- Content Generators ---
  
  // Módulo 1: O Cofre
  getModule1Task(taskIndex: number): CodeTask {
    const codes = ['1234', '4281', '9012', '5567', '3841', '7209', '6621', '8193', '2468', '1357'];
    return { code: codes[taskIndex % codes.length] };
  }

  // Módulo 2: Chave ou Senha?
  getModule2Task(taskIndex: number): DragTask {
    const items = [
      { item: '🏠 Porta', type: 'chave' },
      { item: '📱 Tablet', type: 'senha' },
      { item: '🎒 Mochila', type: 'chave' },
      { item: '💻 Computador', type: 'senha' },
      { item: '🚲 Cadeado de Bicicleta', type: 'chave' },
      { item: '🎮 Videogame', type: 'senha' },
      { item: '🚗 Carro', type: 'chave' },
      { item: '📱 Celular da Mãe', type: 'senha' },
      { item: '📦 Baú de Brinquedos', type: 'chave' },
      { item: '📧 E-mail', type: 'senha' }
    ];
    return items[taskIndex % items.length];
  }

  // Módulo 3: Atitudes de Segurança
  getModule3Task(taskIndex: number): DragTask {
    const items = [
      { item: 'Contar a senha para o amigo', type: 'perigoso' },
      { item: 'Memorizar a senha', type: 'seguro' },
      { item: 'Escrever na lousa da escola', type: 'perigoso' },
      { item: 'Criar senha difícil', type: 'seguro' },
      { item: 'Usar "123456"', type: 'perigoso' },
      { item: 'Não anotar em papel', type: 'seguro' },
      { item: 'Passar senha no WhatsApp', type: 'perigoso' },
      { item: 'Usar letras e números', type: 'seguro' },
      { item: 'Anotar e colar no monitor', type: 'perigoso' },
      { item: 'Guardar em segredo', type: 'seguro' }
    ];
    return items[taskIndex % items.length];
  }

  // Módulo 4: Senha Forte vs Fraca
  getModule4Task(taskIndex: number): TapTask {
    const pairs = [
      [ { text: '1234', isStrong: false }, { text: 'Gato@9!', isStrong: true } ],
      [ { text: 'a1b2c3d4', isStrong: true }, { text: 'senha', isStrong: false } ],
      [ { text: 'nome123', isStrong: false }, { text: 'P#n7eR4', isStrong: true } ],
      [ { text: 'L!on88', isStrong: true }, { text: 'qwert', isStrong: false } ],
      [ { text: '111111', isStrong: false }, { text: 'S0l&Lu4', isStrong: true } ],
      [ { text: 'F0r7e#', isStrong: true }, { text: 'abcde', isStrong: false } ],
      [ { text: 'meunome', isStrong: false }, { text: 'M4g!c0', isStrong: true } ],
      [ { text: 'V3rd#21', isStrong: true }, { text: '98765', isStrong: false } ],
      [ { text: 'brasil', isStrong: false }, { text: 'Br@z!l9', isStrong: true } ],
      [ { text: 'XyZ$42', isStrong: true }, { text: 'deus', isStrong: false } ]
    ];
    
    // Copy the pair and shuffle
    const passwords = [...pairs[taskIndex % pairs.length]];
    for (let i = passwords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwords[i], passwords[j]] = [passwords[j], passwords[i]];
    }
    
    return { passwords };
  }

  // Módulo 5: O Guardião de Dados
  getModule5Task(taskIndex: number): DragTask {
    const items = [
      { item: 'Sua Senha do Tablet', type: 'segredo' },
      { item: 'Sua Cor Favorita', type: 'publico' },
      { item: 'A Senha do Banco do Pai', type: 'segredo' },
      { item: 'O Nome do seu Gato', type: 'publico' },
      { item: 'Senha do E-mail', type: 'segredo' },
      { item: 'Qual seu animal favorito', type: 'publico' },
      { item: 'Senha do Wi-Fi', type: 'segredo' },
      { item: 'O que você comeu hoje', type: 'publico' },
      { item: 'Senha do jogo', type: 'segredo' },
      { item: 'Seu esporte favorito', type: 'publico' }
    ];
    return items[taskIndex % items.length];
  }

  // --- Core Game Logic ---

  submitAnswer(isCorrect: boolean) {
    if (isCorrect) {
      this.completeTask();
    } else {
      this.reportMistake();
      this.loseHeart();
    }
  }

  private completeTask() {
    const totalLevelId = (this.state.module * this.TASKS_PER_MODULE) + this.state.task;
    const isLastTaskOverall = this.state.module === this.MAX_MODULES - 1 && this.state.task === this.TASKS_PER_MODULE - 1;

    this.progress.report({
      levelId: `password-mystery-m${this.state.module}-t${this.state.task}`,
      fase: totalLevelId,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastTaskOverall,
      score: this.score,
      gameState: JSON.stringify(this.state)
    });

    if (isLastTaskOverall) {
      this.clearState();
      return; // Game Finished
    }

    this.state.task++;
    if (this.state.task >= this.TASKS_PER_MODULE) {
      this.state.task = 0;
      this.state.module++;
      this.state.hearts = this.MAX_HEARTS; // Restore hearts on new module
    }
  }

  private reportMistake() {
    const totalLevelId = (this.state.module * this.TASKS_PER_MODULE) + this.state.task;
    this.progress.report({
      levelId: `password-mystery-m${this.state.module}-t${this.state.task}`,
      fase: totalLevelId,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false,
      score: this.score,
      gameState: JSON.stringify(this.state)
    });
  }

  private loseHeart() {
    this.state.hearts--;
    if (this.state.hearts <= 0) {
      this.state.task = 0; // Restart current module
      this.state.hearts = this.MAX_HEARTS;
      this.state.deathCount++;
    }
  }

  clearState() {
    this.state = {
      module: 0,
      task: 0,
      hearts: this.MAX_HEARTS,
      deathCount: 0
    };
  }
}
