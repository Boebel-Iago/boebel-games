import { Injectable } from '@angular/core';

export interface GameState {
  module: number;
  taskIndex: number;
  hearts: number;
}

export interface Option {
  id: string;
  label: string;
  icon?: string;
}

export interface Zone {
  id: string;
  label: string;
  icon?: string;
}

export interface Task {
  type: 'tap' | 'drag';
  prompt: string;
  context?: string;
  options?: Option[];
  zones?: Zone[];
  correctId: string;
  draggable?: Option;
}

@Injectable({ providedIn: 'root' })
export class FutureFairEngineService {
  private readonly STORAGE_KEY = 'boebel_future_fair_state';
  
  public state: GameState = {
    module: 1,
    taskIndex: 0,
    hearts: 3
  };

  public tasks: Task[][] = [];

  constructor() {
    this.initializeTasks();
    this.loadState();
  }

  private loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      } catch (e) {
        this.resetState();
      }
    }
  }

  public saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  public clearState() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  public resetState() {
    this.state = { module: 1, taskIndex: 0, hearts: 3 };
    this.shuffleAllModules();
    this.saveState();
  }

  public resetModule() {
    this.state.hearts = 3;
    this.state.taskIndex = 0;
    this.shuffleCurrentModule();
    this.saveState();
  }

  private shuffleCurrentModule() {
    if (this.state.module >= 1 && this.state.module <= 5) {
      this.tasks[this.state.module - 1] = this.shuffleArray(this.tasks[this.state.module - 1]);
    }
  }

  private shuffleAllModules() {
    for (let i = 0; i < 5; i++) {
        this.tasks[i] = this.shuffleArray(this.tasks[i]);
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  public getCurrentTask(): Task | null {
    if (this.state.module > 5) return null;
    return this.tasks[this.state.module - 1][this.state.taskIndex];
  }

  public processAnswer(selectedId: string): boolean {
    const task = this.getCurrentTask();
    if (!task) return false;
    
    if (selectedId === task.correctId) {
      return true;
    } else {
      this.state.hearts--;
      this.saveState();
      return false;
    }
  }

  public advanceTask(): boolean {
    const currentModuleTasks = this.tasks[this.state.module - 1];
    
    this.state.taskIndex++;
    if (this.state.taskIndex >= currentModuleTasks.length) {
      this.state.module++;
      this.state.taskIndex = 0;
      this.state.hearts = 3;
      
      if (this.state.module <= 5) {
        this.shuffleCurrentModule();
      }
    }
    this.saveState();
    return this.state.module > 5; // Return true if game over
  }

  private initializeTasks() {
    const mod1Tasks: Task[] = [
      { type: 'tap', prompt: 'Entrar em um mundo digital com óculos', correctId: 'vr', options: [{ id: 'vr', label: 'Realidade Virtual' }, { id: 'drone', label: 'Drone' }] },
      { type: 'tap', prompt: 'Veículo voador que não precisa de piloto dentro', correctId: 'drone', options: [{ id: 'ai', label: 'Inteligência Artificial' }, { id: 'drone', label: 'Drone' }] },
      { type: 'tap', prompt: 'Computador que aprende e resolve problemas sozinho', correctId: 'ai', options: [{ id: 'vr', label: 'Realidade Virtual' }, { id: 'ai', label: 'Inteligência Artificial' }] },
      { type: 'tap', prompt: 'Máquina que cria objetos de plástico ou metal, camada por camada', correctId: '3d', options: [{ id: '3d', label: 'Impressora 3D' }, { id: 'iot', label: 'Internet das Coisas' }] },
      { type: 'tap', prompt: 'Geladeira que avisa o supermercado que acabou o leite', correctId: 'iot', options: [{ id: 'iot', label: 'Internet das Coisas' }, { id: 'drone', label: 'Drone' }] },
      { type: 'tap', prompt: 'Um jogo em que você se sente dentro do cenário', correctId: 'vr', options: [{ id: 'ai', label: 'Inteligência Artificial' }, { id: 'vr', label: 'Realidade Virtual' }] },
      { type: 'tap', prompt: 'Robô que ajuda a achar filmes que você gosta', correctId: 'ai', options: [{ id: 'ai', label: 'Inteligência Artificial' }, { id: '3d', label: 'Impressora 3D' }] },
      { type: 'tap', prompt: 'Tênis novo feito na hora em casa com um arquivo de computador', correctId: '3d', options: [{ id: 'iot', label: 'Internet das Coisas' }, { id: '3d', label: 'Impressora 3D' }] },
      { type: 'tap', prompt: 'Câmera que avisa o celular quando a planta precisa de água', correctId: 'iot', options: [{ id: 'vr', label: 'Realidade Virtual' }, { id: 'iot', label: 'Internet das Coisas' }] },
      { type: 'tap', prompt: 'Entregar um pacote voando por cima da cidade', correctId: 'drone', options: [{ id: 'drone', label: 'Drone' }, { id: '3d', label: 'Impressora 3D' }] },
    ];

    const mod2Tasks: Task[] = [
      { type: 'drag', prompt: 'Médico quer treinar uma cirurgia sem usar paciente real', correctId: 'vr', draggable: { id: 'drag1', label: 'Treinamento' }, zones: [{ id: 'vr', label: 'Realidade Virtual' }, { id: '3d', label: 'Impressora 3D' }] },
      { type: 'drag', prompt: 'Engenheiro precisa de uma peça que quebrou e não existe mais na loja', correctId: '3d', draggable: { id: 'drag2', label: 'Criar Peça' }, zones: [{ id: 'vr', label: 'Realidade Virtual' }, { id: '3d', label: 'Impressora 3D' }] },
      { type: 'drag', prompt: 'Piloto quer ver como será a corrida antes de ir para a pista', correctId: 'vr', draggable: { id: 'drag3', label: 'Reconhecer Pista' }, zones: [{ id: '3d', label: 'Impressora 3D' }, { id: 'vr', label: 'Realidade Virtual' }] },
      { type: 'drag', prompt: 'Dentista quer criar um molde perfeito para o dente do paciente na hora', correctId: '3d', draggable: { id: 'drag4', label: 'Fazer Molde' }, zones: [{ id: '3d', label: 'Impressora 3D' }, { id: 'ai', label: 'Inteligência Artificial' }] },
      { type: 'drag', prompt: 'Biólogo quer filmar pássaros em cima de árvores muito altas', correctId: 'drone', draggable: { id: 'drag5', label: 'Filmar Cima' }, zones: [{ id: 'vr', label: 'Realidade Virtual' }, { id: 'drone', label: 'Drone' }] },
      { type: 'drag', prompt: 'Construtor quer fazer uma maquete real de uma casa para o cliente pegar', correctId: '3d', draggable: { id: 'drag6', label: 'Fazer Maquete' }, zones: [{ id: '3d', label: 'Impressora 3D' }, { id: 'drone', label: 'Drone' }] },
      { type: 'drag', prompt: 'Policial quer buscar pessoas perdidas numa floresta grande', correctId: 'drone', draggable: { id: 'drag7', label: 'Buscar Pessoas' }, zones: [{ id: '3d', label: 'Impressora 3D' }, { id: 'drone', label: 'Drone' }] },
      { type: 'drag', prompt: 'Estudante quer passear por dentro do corpo humano na aula de ciências', correctId: 'vr', draggable: { id: 'drag8', label: 'Passeio Virtual' }, zones: [{ id: 'vr', label: 'Realidade Virtual' }, { id: 'drone', label: 'Drone' }] },
      { type: 'drag', prompt: 'Fazendeiro quer sobrevoar a plantação para ver se há pragas', correctId: 'drone', draggable: { id: 'drag9', label: 'Sobrevoar' }, zones: [{ id: '3d', label: 'Impressora 3D' }, { id: 'drone', label: 'Drone' }] },
      { type: 'drag', prompt: 'Arquiteto quer mostrar ao cliente a casa, para ele andar lá dentro, antes de construir', correctId: 'vr', draggable: { id: 'drag10', label: 'Visita' }, zones: [{ id: 'drone', label: 'Drone' }, { id: 'vr', label: 'Realidade Virtual' }] },
    ];

    const mod3Tasks: Task[] = [
      { type: 'tap', prompt: 'Entregar remédios rápido no topo da montanha', correctId: 'drone', options: [{ id: 'drone', label: 'Drone', icon: 'fa-helicopter' }, { id: 'car', label: 'Carro', icon: 'fa-car' }, { id: 'iot', label: 'Sensor IoT', icon: 'fa-wifi' }] },
      { type: 'tap', prompt: 'Fazer a luz da sala acender quando você chega', correctId: 'iot', options: [{ id: 'drone', label: 'Drone' }, { id: 'car', label: 'Carro' }, { id: 'iot', label: 'Sensor IoT' }] },
      { type: 'tap', prompt: 'Tirar fotos do telhado para ver se quebrou telha', correctId: 'drone', options: [{ id: 'iot', label: 'Sensor IoT' }, { id: 'drone', label: 'Drone' }, { id: 'car', label: 'Carro' }] },
      { type: 'tap', prompt: 'Medir a umidade da terra na fazenda toda hora e regar sozinho', correctId: 'iot', options: [{ id: 'drone', label: 'Drone' }, { id: 'car', label: 'Carro' }, { id: 'iot', label: 'Sensor IoT' }] },
      { type: 'tap', prompt: 'Viajar com a família para a praia no fim de semana', correctId: 'car', options: [{ id: 'iot', label: 'Sensor IoT' }, { id: 'drone', label: 'Drone' }, { id: 'car', label: 'Carro' }] },
      { type: 'tap', prompt: 'Fazer o portão abrir automaticamente pelo celular', correctId: 'iot', options: [{ id: 'car', label: 'Carro' }, { id: 'drone', label: 'Drone' }, { id: 'iot', label: 'Sensor IoT' }] },
      { type: 'tap', prompt: 'Monitorar o trânsito da cidade lá do alto', correctId: 'drone', options: [{ id: 'iot', label: 'Sensor IoT' }, { id: 'car', label: 'Carro' }, { id: 'drone', label: 'Drone' }] },
      { type: 'tap', prompt: 'Levar as compras do mês para casa', correctId: 'car', options: [{ id: 'drone', label: 'Drone' }, { id: 'car', label: 'Carro' }, { id: 'iot', label: 'Sensor IoT' }] },
      { type: 'tap', prompt: 'Acompanhar a temperatura da água de um aquário a distância', correctId: 'iot', options: [{ id: 'drone', label: 'Drone' }, { id: 'iot', label: 'Sensor IoT' }, { id: 'car', label: 'Carro' }] },
      { type: 'tap', prompt: 'Participar de uma corrida em interlagos no chão', correctId: 'car', options: [{ id: 'car', label: 'Carro' }, { id: 'drone', label: 'Drone' }, { id: 'iot', label: 'Sensor IoT' }] },
    ];

    const mod4Tasks: Task[] = [
      { type: 'drag', prompt: 'Uma geladeira que avisa quando o leite acaba é...', correctId: 'iot', draggable: { id: 'item1', label: 'Geladeira' }, zones: [{ id: 'iot', label: 'Conectado (Smart/IoT)' }, { id: 'comum', label: 'Comum (Sem internet)' }] },
      { type: 'drag', prompt: 'Um caderno de papel pautado normal é...', correctId: 'comum', draggable: { id: 'item2', label: 'Caderno' }, zones: [{ id: 'iot', label: 'Conectado (Smart/IoT)' }, { id: 'comum', label: 'Comum (Sem internet)' }] },
      { type: 'drag', prompt: 'Uma lâmpada que muda de cor quando você fala com a assistente virtual', correctId: 'iot', draggable: { id: 'item3', label: 'Lâmpada' }, zones: [{ id: 'comum', label: 'Comum (Sem internet)' }, { id: 'iot', label: 'Conectado (Smart/IoT)' }] },
      { type: 'drag', prompt: 'Um lápis de madeira...', correctId: 'comum', draggable: { id: 'item4', label: 'Lápis' }, zones: [{ id: 'comum', label: 'Comum (Sem internet)' }, { id: 'iot', label: 'Conectado (Smart/IoT)' }] },
      { type: 'drag', prompt: 'Um relógio de pulso que mede batimentos e mostra no celular...', correctId: 'iot', draggable: { id: 'item5', label: 'Smartwatch' }, zones: [{ id: 'iot', label: 'Conectado (Smart/IoT)' }, { id: 'comum', label: 'Comum (Sem internet)' }] },
      { type: 'drag', prompt: 'Uma cadeira de madeira simples...', correctId: 'comum', draggable: { id: 'item6', label: 'Cadeira' }, zones: [{ id: 'comum', label: 'Comum (Sem internet)' }, { id: 'iot', label: 'Conectado (Smart/IoT)' }] },
      { type: 'drag', prompt: 'Um colar para o cachorro com GPS para achá-lo se fugir...', correctId: 'iot', draggable: { id: 'item7', label: 'Coleira' }, zones: [{ id: 'iot', label: 'Conectado (Smart/IoT)' }, { id: 'comum', label: 'Comum (Sem internet)' }] },
      { type: 'drag', prompt: 'Um vaso de barro com uma planta...', correctId: 'comum', draggable: { id: 'item8', label: 'Vaso de Barro' }, zones: [{ id: 'comum', label: 'Comum (Sem internet)' }, { id: 'iot', label: 'Conectado (Smart/IoT)' }] },
      { type: 'drag', prompt: 'Um tênis que marca no app quantos passos você deu...', correctId: 'iot', draggable: { id: 'item9', label: 'Tênis Smart' }, zones: [{ id: 'iot', label: 'Conectado (Smart/IoT)' }, { id: 'comum', label: 'Comum (Sem internet)' }] },
      { type: 'drag', prompt: 'Um relógio de parede antigo com ponteiros de ferro...', correctId: 'comum', draggable: { id: 'item10', label: 'Relógio Antigo' }, zones: [{ id: 'iot', label: 'Conectado (Smart/IoT)' }, { id: 'comum', label: 'Comum (Sem internet)' }] },
    ];

    const mod5Tasks: Task[] = [
      { type: 'drag', prompt: 'Projeto de criar um robô que conversa e joga xadrez melhor que os humanos', correctId: 'ai', draggable: { id: 'proj1', label: 'Robô Xadrez' }, zones: [{ id: '3d', label: '🖨️ Impressão 3D' }, { id: 'vr', label: '🕶️ Realidade Virtual' }, { id: 'ai', label: '🧠 Inteligência Artificial' }] },
      { type: 'drag', prompt: 'Projeto de criar prótese sob medida para um braço', correctId: '3d', draggable: { id: 'proj2', label: 'Prótese' }, zones: [{ id: '3d', label: '🖨️ Impressão 3D' }, { id: 'vr', label: '🕶️ Realidade Virtual' }, { id: 'ai', label: '🧠 Inteligência Artificial' }] },
      { type: 'drag', prompt: 'Projeto para simular uma missão em Marte', correctId: 'vr', draggable: { id: 'proj3', label: 'Missão Marte' }, zones: [{ id: '3d', label: '🖨️ Impressão 3D' }, { id: 'vr', label: '🕶️ Realidade Virtual' }, { id: 'ai', label: '🧠 Inteligência Artificial' }] },
      { type: 'drag', prompt: 'Projeto para fazer um dinossauro de plástico realista e barato', correctId: '3d', draggable: { id: 'proj4', label: 'Brinquedo' }, zones: [{ id: 'ai', label: '🧠 Inteligência Artificial' }, { id: '3d', label: '🖨️ Impressão 3D' }, { id: 'vr', label: '🕶️ Realidade Virtual' }] },
      { type: 'drag', prompt: 'Projeto de app que entende o que você fala e traduz', correctId: 'ai', draggable: { id: 'proj5', label: 'Tradutor' }, zones: [{ id: 'vr', label: '🕶️ Realidade Virtual' }, { id: 'ai', label: '🧠 Inteligência Artificial' }, { id: '3d', label: '🖨️ Impressão 3D' }] },
      { type: 'drag', prompt: 'Projeto de óculos para ver a sala decorada antes de comprar móveis', correctId: 'vr', draggable: { id: 'proj6', label: 'Decorador' }, zones: [{ id: '3d', label: '🖨️ Impressão 3D' }, { id: 'vr', label: '🕶️ Realidade Virtual' }, { id: 'ai', label: '🧠 Inteligência Artificial' }] },
      { type: 'drag', prompt: 'Projeto de celular que prevê se vai chover baseado em nuvens e avisa o fazendeiro', correctId: 'ai', draggable: { id: 'proj7', label: 'Previsor Clima' }, zones: [{ id: 'ai', label: '🧠 Inteligência Artificial' }, { id: 'vr', label: '🕶️ Realidade Virtual' }, { id: '3d', label: '🖨️ Impressão 3D' }] },
      { type: 'drag', prompt: 'Projeto para criar pecinhas de Lego exclusivas para os alunos', correctId: '3d', draggable: { id: 'proj8', label: 'Peças de Lego' }, zones: [{ id: 'vr', label: '🕶️ Realidade Virtual' }, { id: '3d', label: '🖨️ Impressão 3D' }, { id: 'ai', label: '🧠 Inteligência Artificial' }] },
      { type: 'drag', prompt: 'Projeto de simulador de voo para treinar pilotos de avião sem sair do chão', correctId: 'vr', draggable: { id: 'proj9', label: 'Simulador Voo' }, zones: [{ id: '3d', label: '🖨️ Impressão 3D' }, { id: 'ai', label: '🧠 Inteligência Artificial' }, { id: 'vr', label: '🕶️ Realidade Virtual' }] },
      { type: 'drag', prompt: 'Projeto de programa de computador que desenha telas incríveis apenas ouvindo sua ideia', correctId: 'ai', draggable: { id: 'proj10', label: 'Desenhista Digital' }, zones: [{ id: 'ai', label: '🧠 Inteligência Artificial' }, { id: 'vr', label: '🕶️ Realidade Virtual' }, { id: '3d', label: '🖨️ Impressão 3D' }] },
    ];

    this.tasks = [
      this.shuffleArray(mod1Tasks),
      this.shuffleArray(mod2Tasks),
      this.shuffleArray(mod3Tasks),
      this.shuffleArray(mod4Tasks),
      this.shuffleArray(mod5Tasks)
    ];
  }
}
