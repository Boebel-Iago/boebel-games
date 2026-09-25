import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface Task {
  id: string;
  type: 'module1' | 'module2' | 'module3' | 'module4' | 'module5';
  content: any;
}

export interface GameState {
  currentModuleIndex: number; // 0 to 4
  currentTaskIndex: number;   // 0 to 9
  hearts: number;             // 3 max
}

@Injectable({
  providedIn: 'root'
})
export class DataAnonymityEngineService {
  private readonly STORAGE_KEY = 'boebel_data_anonymity_state';
  state: GameState = { currentModuleIndex: 0, currentTaskIndex: 0, hearts: 3 };
  modulesTasks: Task[][] = [];
  currentTask: Task | null = null;

  constructor(private progress: ProgressReporter) {
    this.initTasks();
    this.loadState();
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private initTasks() {
    const mod1Tasks = [
      { id: 'm1_1', type: 'module1', content: { text: 'Meu CPF', isSensitive: true } },
      { id: 'm1_2', type: 'module1', content: { text: 'Minha cor favorita', isSensitive: false } },
      { id: 'm1_3', type: 'module1', content: { text: 'Endereço de casa', isSensitive: true } },
      { id: 'm1_4', type: 'module1', content: { text: 'Meu animal favorito', isSensitive: false } },
      { id: 'm1_5', type: 'module1', content: { text: 'Telefone da minha mãe', isSensitive: true } },
      { id: 'm1_6', type: 'module1', content: { text: 'Uma piada engraçada', isSensitive: false } },
      { id: 'm1_7', type: 'module1', content: { text: 'Senha do e-mail', isSensitive: true } },
      { id: 'm1_8', type: 'module1', content: { text: 'Nome de um filme', isSensitive: false } },
      { id: 'm1_9', type: 'module1', content: { text: 'Número do cartão de crédito', isSensitive: true } },
      { id: 'm1_10', type: 'module1', content: { text: 'Time de futebol que eu torço', isSensitive: false } },
      { id: 'm1_11', type: 'module1', content: { text: 'Minha idade exata', isSensitive: true } },
      { id: 'm1_12', type: 'module1', content: { text: 'Um desenho que eu fiz', isSensitive: false } }
    ];

    const mod2Tasks = [
      { id: 'm2_1', type: 'module2', content: { options: ['Nome do seu Cachorro', 'Senha do Banco do seu Pai'], dangerousIndex: 1 } },
      { id: 'm2_2', type: 'module2', content: { options: ['Nome verdadeiro e Sobrenome', 'Apelido (Nickname)'], dangerousIndex: 0 } },
      { id: 'm2_3', type: 'module2', content: { options: ['Seu endereço completo', 'Seu país'], dangerousIndex: 0 } },
      { id: 'm2_4', type: 'module2', content: { options: ['Cor do seu cabelo', 'Nome da sua escola'], dangerousIndex: 1 } },
      { id: 'm2_5', type: 'module2', content: { options: ['Telefone de casa', 'Seu esporte favorito'], dangerousIndex: 0 } },
      { id: 'm2_6', type: 'module2', content: { options: ['Onde você estuda', 'Qual sua fruta preferida'], dangerousIndex: 0 } },
      { id: 'm2_7', type: 'module2', content: { options: ['Dia que você nasceu', 'Música favorita'], dangerousIndex: 0 } },
      { id: 'm2_8', type: 'module2', content: { options: ['Nome do seu jogo favorito', 'Onde seus pais trabalham'], dangerousIndex: 1 } },
      { id: 'm2_9', type: 'module2', content: { options: ['Fotos de onde você mora', 'Foto de uma árvore'], dangerousIndex: 0 } },
      { id: 'm2_10', type: 'module2', content: { options: ['Canal do YouTube que você assiste', 'Placa do carro dos pais'], dangerousIndex: 1 } },
      { id: 'm2_11', type: 'module2', content: { options: ['Sua comida favorita', 'Número do documento de identidade'], dangerousIndex: 1 } }
    ];

    const mod3Tasks = [
      { id: 'm3_1', type: 'module3', content: { options: ['O Pedro da Silva da rua 5 caiu', 'Um menino caiu de bicicleta'], safeIndex: 1 } },
      { id: 'm3_2', type: 'module3', content: { options: ['Alguém ganhou o prêmio', 'A Maria da turma 4A ganhou o prêmio'], safeIndex: 0 } },
      { id: 'm3_3', type: 'module3', content: { options: ['O aluno João tirou nota 10', 'Um aluno da nossa escola tirou nota 10'], safeIndex: 1 } },
      { id: 'm3_4', type: 'module3', content: { options: ['Uma pessoa encontrou um cachorro', 'O Lucas Ferreira encontrou um cachorro'], safeIndex: 0 } },
      { id: 'm3_5', type: 'module3', content: { options: ['A professora Ana do 4º ano faltou', 'Uma professora não veio hoje'], safeIndex: 1 } },
      { id: 'm3_6', type: 'module3', content: { options: ['Um vizinho comprou um carro novo', 'O Sr. José que mora no número 10 comprou um carro'], safeIndex: 0 } },
      { id: 'm3_7', type: 'module3', content: { options: ['A Júlia da escola X machucou o pé', 'Uma aluna se machucou no recreio'], safeIndex: 1 } },
      { id: 'm3_8', type: 'module3', content: { options: ['Alguém perdeu uma jaqueta', 'O Felipe perdeu a jaqueta azul dele'], safeIndex: 0 } },
      { id: 'm3_9', type: 'module3', content: { options: ['A família do Marcos viajou para a praia', 'Uma família viajou para a praia nas férias'], safeIndex: 1 } },
      { id: 'm3_10', type: 'module3', content: { options: ['Um gato foi resgatado da árvore', 'O gato do Mateus que mora na rua Y foi resgatado'], safeIndex: 0 } },
      { id: 'm3_11', type: 'module3', content: { options: ['Uma criança ganhou o sorteio', 'O Tiago da turma B ganhou o sorteio'], safeIndex: 0 } }
    ];

    const mod4Tasks = [
      { id: 'm4_1', type: 'module4', content: { text: 'Curtir uma foto no Instagram', rastro: true } },
      { id: 'm4_2', type: 'module4', content: { text: 'Ler um livro de papel', rastro: false } },
      { id: 'm4_3', type: 'module4', content: { text: 'Pesquisar vídeos no YouTube', rastro: true } },
      { id: 'm4_4', type: 'module4', content: { text: 'Brincar de pega-pega no parque', rastro: false } },
      { id: 'm4_5', type: 'module4', content: { text: 'Fazer um comentário num site', rastro: true } },
      { id: 'm4_6', type: 'module4', content: { text: 'Dormir no seu quarto', rastro: false } },
      { id: 'm4_7', type: 'module4', content: { text: 'Jogar um jogo online no celular', rastro: true } },
      { id: 'm4_8', type: 'module4', content: { text: 'Comprar um brinquedo na internet', rastro: true } },
      { id: 'm4_9', type: 'module4', content: { text: 'Desenhar com lápis e papel', rastro: false } },
      { id: 'm4_10', type: 'module4', content: { text: 'Aceitar "Cookies" em um site', rastro: true } },
      { id: 'm4_11', type: 'module4', content: { text: 'Passear com o cachorro', rastro: false } },
      { id: 'm4_12', type: 'module4', content: { text: 'Enviar uma mensagem no WhatsApp', rastro: true } }
    ];

    const mod5Tasks = [
      { id: 'm5_1', type: 'module5', content: { text: 'Endereço de Casa', zone: 'nunca' } },
      { id: 'm5_2', type: 'module5', content: { text: 'Nome do Jogo Favorito', zone: 'publico' } },
      { id: 'm5_3', type: 'module5', content: { text: 'Foto de Biquini/Sunga', zone: 'nunca' } },
      { id: 'm5_4', type: 'module5', content: { text: 'Senha do celular', zone: 'pais' } },
      { id: 'm5_5', type: 'module5', content: { text: 'Cor que você mais gosta', zone: 'publico' } },
      { id: 'm5_6', type: 'module5', content: { text: 'Onde seus pais guardam dinheiro', zone: 'nunca' } },
      { id: 'm5_7', type: 'module5', content: { text: 'Notas da escola', zone: 'pais' } },
      { id: 'm5_8', type: 'module5', content: { text: 'Música preferida', zone: 'publico' } },
      { id: 'm5_9', type: 'module5', content: { text: 'Sua localização atual no celular', zone: 'nunca' } },
      { id: 'm5_10', type: 'module5', content: { text: 'O filme que assistiu ontem', zone: 'publico' } },
      { id: 'm5_11', type: 'module5', content: { text: 'Número do cartão do pai', zone: 'nunca' } },
      { id: 'm5_12', type: 'module5', content: { text: 'Boletim médico (doenças)', zone: 'pais' } }
    ];

    this.modulesTasks = [
      this.shuffle(mod1Tasks).slice(0, 10) as Task[],
      this.shuffle(mod2Tasks).slice(0, 10) as Task[],
      this.shuffle(mod3Tasks).slice(0, 10) as Task[],
      this.shuffle(mod4Tasks).slice(0, 10) as Task[],
      this.shuffle(mod5Tasks).slice(0, 10) as Task[]
    ];
  }

  private loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentModuleIndex === 'number') {
          this.state = parsed;
        }
      } catch (e) {
        this.resetGame();
      }
    }
    this.updateCurrentTask();
  }

  private saveState() {
    if (this.isGameFinished()) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  resetGame() {
    this.state = { currentModuleIndex: 0, currentTaskIndex: 0, hearts: 3 };
    this.initTasks();
    this.saveState();
    this.updateCurrentTask();
  }

  clearState() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private updateCurrentTask() {
    if (!this.isGameFinished()) {
      this.currentTask = this.modulesTasks[this.state.currentModuleIndex][this.state.currentTaskIndex];
    } else {
      this.currentTask = null;
    }
  }

  isGameFinished(): boolean {
    return this.state.currentModuleIndex >= 5;
  }

  private restartModule() {
    this.state.currentTaskIndex = 0;
    this.state.hearts = 3;
    // Reshuffle current module tasks
    this.modulesTasks[this.state.currentModuleIndex] = this.shuffle(this.modulesTasks[this.state.currentModuleIndex]);
    this.saveState();
    this.updateCurrentTask();
  }

  submitAnswer(isCorrect: boolean) {
    if (this.isGameFinished()) return;

    if (isCorrect) {
      const isLastTaskInModule = this.state.currentTaskIndex === 9;
      const isLastLevel = this.state.currentModuleIndex === 4 && isLastTaskInModule;

      this.progress.report({
        levelId: `data-anonymity-m${this.state.currentModuleIndex}-t${this.state.currentTaskIndex}`,
        fase: this.state.currentModuleIndex * 10 + this.state.currentTaskIndex,
        result: 'success',
        attempts: 4 - this.state.hearts,
        timestamp: new Date().toISOString(),
        isLastLevel: isLastLevel
      });

      if (isLastLevel) {
        this.state.currentModuleIndex++;
        this.clearState();
      } else if (isLastTaskInModule) {
        this.state.currentModuleIndex++;
        this.state.currentTaskIndex = 0;
        this.state.hearts = 3;
        this.saveState();
      } else {
        this.state.currentTaskIndex++;
        this.saveState();
      }
    } else {
      this.progress.report({
        levelId: `data-anonymity-m${this.state.currentModuleIndex}-t${this.state.currentTaskIndex}`,
        fase: this.state.currentModuleIndex * 10 + this.state.currentTaskIndex,
        result: 'failure',
        attempts: 4 - this.state.hearts,
        timestamp: new Date().toISOString(),
        isLastLevel: false
      });

      this.state.hearts--;
      if (this.state.hearts <= 0) {
        this.restartModule();
      } else {
        this.saveState();
      }
    }
    this.updateCurrentTask();
  }
}
