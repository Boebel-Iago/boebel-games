import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  moduleIndex: number;
  taskIndex: number;
  hearts: number;
}

export type TaskType = 'tap-2' | 'drag-2' | 'drag-3';

export interface BaseTask {
  type: TaskType;
  prompt: string;
}

export interface TapTask extends BaseTask {
  type: 'tap-2';
  options: { text: string; correct: boolean }[];
}

export interface Drag2Task extends BaseTask {
  type: 'drag-2';
  item: string;
  correctZone: number;
  zones: string[];
}

export interface Drag3Task extends BaseTask {
  type: 'drag-3';
  item: string;
  correctZone: number;
  zones: string[];
}

export type Task = TapTask | Drag2Task | Drag3Task;

export interface ModuleData {
  title: string;
  description: string;
  tasks: Task[];
}

@Injectable({ providedIn: 'root' })
export class EthicalDilemmasEngineService {
  state: GameState = {
    moduleIndex: 0,
    taskIndex: 0,
    hearts: 3
  };

  finished = false;
  modules: ModuleData[] = [];
  currentTask: Task | null = null;
  
  private storageKey = 'boebel_ethical_dilemmas_state';

  constructor(private progress: ProgressReporter) {
    this.initModules();
  }

  initGame() {
    this.finished = false;
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch(e) {
        this.resetGame();
      }
    } else {
      this.resetGame();
    }
    
    if (this.state.moduleIndex >= this.modules.length) {
      this.state.moduleIndex = 0;
      this.state.taskIndex = 0;
    }
    this.updateCurrentTask();
  }

  resetGame() {
    this.finished = false;
    this.state = {
      moduleIndex: 0,
      taskIndex: 0,
      hearts: 3
    };
    this.saveState();
    this.updateCurrentTask();
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  clearState() {
    localStorage.removeItem(this.storageKey);
  }

  updateCurrentTask() {
    if (this.state.moduleIndex < this.modules.length) {
      const mod = this.modules[this.state.moduleIndex];
      if (this.state.taskIndex < mod.tasks.length) {
        this.currentTask = mod.tasks[this.state.taskIndex];
      } else {
        this.currentTask = null;
      }
    } else {
      this.currentTask = null;
    }
  }

  shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  initModules() {
    const mod1Tasks: TapTask[] = [
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Ajudar um colega no chat', correct: true}, {text: 'Xingar no jogo online', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Pedir permissão antes de postar foto', correct: true}, {text: 'Postar foto de um amigo em momento constrangedor', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Denunciar uma mensagem de ódio', correct: true}, {text: 'Ignorar e repassar mensagens de ódio', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Elogiar o desenho de alguém', correct: true}, {text: 'Comentar que o desenho está feio', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Convidar o aluno novo para jogar', correct: true}, {text: 'Excluir o aluno novo do grupo', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Avisar o amigo se o microfone dele está ruim', correct: true}, {text: 'Rir do áudio ruim do amigo', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Compartilhar links úteis de estudo', correct: true}, {text: 'Mandar links falsos e assustadores', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Respeitar a vez no jogo online', correct: true}, {text: 'Trapacear para ganhar sempre', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Guardar as senhas em segredo', correct: true}, {text: 'Dar a senha para amigos entrarem na sua conta', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na Atitude Correta', options: this.shuffle([{text: 'Ajudar a espalhar boas notícias', correct: true}, {text: 'Compartilhar boatos maldosos sobre a escola', correct: false}]) },
    ];

    const mod2Tasks: Drag2Task[] = [
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Seu cabelo está horrível hoje!', correctZone: 1, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] },
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Gostei muito da sua apresentação!', correctZone: 0, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] },
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Você não serve para jogar isso, sai da sala!', correctZone: 1, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] },
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Tudo bem, na próxima a gente consegue vencer!', correctZone: 0, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] },
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Gordo! Não consegue nem correr no jogo!', correctZone: 1, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] },
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Ninguém gosta de você aqui.', correctZone: 1, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] },
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Ótima foto! Ficou muito legal!', correctZone: 0, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] },
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Você joga muito bem, parabéns!', correctZone: 0, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] },
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Vai chorar, bebê chorão?', correctZone: 1, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] },
      { type: 'drag-2', prompt: 'Arraste para a categoria correta', item: 'Que ideia incrível, você é muito criativo!', correctZone: 0, zones: ['💬 Comentário Legal', '🚫 Cyberbullying'] }
    ];

    const mod3Tasks: TapTask[] = [
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'O Sol vai apagar amanhã!', correct: true}, {text: 'Previsão de chuva para amanhã', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'Vaca voadora é vista no centro da cidade!', correct: true}, {text: 'Cachorro resgatado ganha novo lar', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'Se você não mandar isso para 10 pessoas, vai ter azar!', correct: true}, {text: 'Escola terá feriado nesta sexta-feira', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'Cientistas descobrem que a Terra é plana!', correct: true}, {text: 'Novas fotos de Marte são divulgadas', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'Beba água com sal para curar todas as doenças!', correct: true}, {text: 'Comer frutas ajuda na saúde', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'Zumbis invadiram o shopping!', correct: true}, {text: 'Novo filme de zumbis estreia no cinema', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'Esse botão secreto desliga a internet mundial!', correct: true}, {text: 'Como melhorar o sinal do seu Wi-Fi', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'Alienígenas construíram o Cristo Redentor!', correct: true}, {text: 'História sobre a construção de monumentos', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'Chocolate emagrece 10kg em um dia!', correct: true}, {text: 'Exercícios regulares ajudam a saúde', correct: false}]) },
      { type: 'tap-2', prompt: 'Toque na FAKE NEWS', options: this.shuffle([{text: 'As árvores estão andando à noite!', correct: true}, {text: 'Desmatamento é problema grave', correct: false}]) },
    ];

    const mod4Tasks: Drag2Task[] = [
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Usar foto do Google e dizer que fui eu que tirei', correctZone: 1, zones: ['✅ Dar Créditos', '❌ Plágio'] },
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Colocar o nome do autor do texto que usei no trabalho', correctZone: 0, zones: ['✅ Dar Créditos', '❌ Plágio'] },
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Copiar um desenho e assinar meu nome', correctZone: 1, zones: ['✅ Dar Créditos', '❌ Plágio'] },
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Compartilhar uma música dizendo quem é o cantor', correctZone: 0, zones: ['✅ Dar Créditos', '❌ Plágio'] },
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Pegar o trabalho de escola do amigo e entregar como meu', correctZone: 1, zones: ['✅ Dar Créditos', '❌ Plágio'] },
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Citar o livro de onde tirei a frase legal', correctZone: 0, zones: ['✅ Dar Créditos', '❌ Plágio'] },
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Fazer download de um filme pirata para vender', correctZone: 1, zones: ['✅ Dar Créditos', '❌ Plágio'] },
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Usar imagem livre com licença gratuita, mantendo regras', correctZone: 0, zones: ['✅ Dar Créditos', '❌ Plágio'] },
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Mudar apenas o título do texto da internet e usar', correctZone: 1, zones: ['✅ Dar Créditos', '❌ Plágio'] },
      { type: 'drag-2', prompt: 'Arraste a atitude para a categoria correta', item: 'Indicar o site de onde peguei a pesquisa', correctZone: 0, zones: ['✅ Dar Créditos', '❌ Plágio'] }
    ];

    const mod5Tasks: Drag3Task[] = [
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Invadir a conta de alguém', correctZone: 0, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] },
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Denunciar um perfil que posta ódio', correctZone: 2, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] },
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Inventar que um colega roubou o estojo', correctZone: 1, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] },
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Ameaçar bater em alguém na saída', correctZone: 0, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] },
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Espalhar foto falsa sobre o professor', correctZone: 1, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] },
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Ajudar a ensinar alguém a usar a plataforma', correctZone: 2, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] },
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Fingir ser outra pessoa para enganar online', correctZone: 1, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] },
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Roubar dinheiro da conta bancária dos pais', correctZone: 0, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] },
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Apoiar um amigo que sofreu bullying', correctZone: 2, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] },
      { type: 'drag-3', prompt: 'Julgue o caso arrastando-o para a categoria correspondente', item: 'Criar notícia falsa sobre vacina', correctZone: 1, zones: ['⚖️ Crime', '🤥 Mentira', '✅ Cidadania'] }
    ];

    this.modules = [
      { title: 'Módulo 1: Atitude Cidadã', description: 'Escolha a atitude correta para ser um bom cidadão digital.', tasks: this.shuffle(mod1Tasks) },
      { title: 'Módulo 2: O Filtro do Cyberbullying', description: 'Classifique os comentários entre legais e cyberbullying.', tasks: this.shuffle(mod2Tasks) },
      { title: 'Módulo 3: Caçador de Fake News', description: 'Encontre a notícia falsa entre as opções.', tasks: this.shuffle(mod3Tasks) },
      { title: 'Módulo 4: Direitos Autorais', description: 'Diga se a atitude respeita os direitos autorais ou se é plágio.', tasks: this.shuffle(mod4Tasks) },
      { title: 'Módulo 5: O Juiz da Internet', description: 'Seja o juiz e classifique os casos corretamente!', tasks: this.shuffle(mod5Tasks) }
    ];
  }

  processAnswer(correct: boolean) {
    const isLastModule = this.state.moduleIndex === this.modules.length - 1;
    const isLastTask = this.state.taskIndex === this.modules[this.state.moduleIndex].tasks.length - 1;
    const isLastLevel = isLastModule && isLastTask;
    const totalLevelIndex = this.state.moduleIndex * 10 + this.state.taskIndex;

    if (correct) {
      this.progress.report({
         levelId: `dilemmas-${totalLevelIndex}`,
         fase: totalLevelIndex,
         result: 'success',
         attempts: 1,
         timestamp: new Date().toISOString(),
         isLastLevel: isLastLevel
      });

      if (isLastTask) {
        if (!isLastModule) {
          this.state.moduleIndex++;
          this.state.taskIndex = 0;
          this.state.hearts = 3;
        } else {
          this.finished = true;
          this.clearState();
          this.currentTask = null;
          return;
        }
      } else {
        this.state.taskIndex++;
      }
      this.saveState();
      this.updateCurrentTask();
    } else {
      this.progress.report({
         levelId: `dilemmas-${totalLevelIndex}`,
         fase: totalLevelIndex,
         result: 'failure',
         attempts: 1,
         timestamp: new Date().toISOString(),
         isLastLevel: false
      });
      this.state.hearts--;
      if (this.state.hearts <= 0) {
        this.state.taskIndex = 0;
        this.state.hearts = 3;
      }
      this.saveState();
      this.updateCurrentTask();
    }
  }
}
