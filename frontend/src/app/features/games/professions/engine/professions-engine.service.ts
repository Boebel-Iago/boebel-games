import { Injectable } from '@angular/core';

export interface Task {
  type: 'drag' | 'tap' | 'drag-3';
  prompt: string;
  item?: string; 
  options: string[]; 
  correct: string;
}

export interface GameModule {
  id: number;
  title: string;
  tasks: Task[];
}

export interface GameState {
  fase: number;
  taskId: number;
  hearts: number;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionsEngineService {
  private readonly STORAGE_KEY = 'boebel_professions_state';
  public state: GameState = { fase: 0, taskId: 0, hearts: 3, score: 0 };
  public modules: GameModule[] = [];

  constructor() {
    this.initModules();
    this.loadState();
  }

  private shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private initModules() {
    // Modulo 0: Hardware do Profissional (Drag)
    const m0Tasks: Task[] = Array(10).fill(null).map((_, i) => ({
      type: 'drag',
      prompt: 'Arraste a ferramenta (hardware) correta para a profissão!',
      item: ['Câmera DSLR', 'Estetoscópio Digital', 'Mesa Digitalizadora', 'Drone', 'Microfone Condensador', 'Óculos VR', 'Impressora 3D', 'Tablet Industrial', 'Termômetro Laser', 'Scanner Corporal'][i],
      options: ['Fotógrafo', 'Médico', 'Designer', 'Engenheiro Agrônomo', 'Podcaster', 'Arquiteto', 'Designer de Produto', 'Gerente de Logística', 'Técnico de Segurança', 'Fisioterapeuta'],
      correct: ['Fotógrafo', 'Médico', 'Designer', 'Engenheiro Agrônomo', 'Podcaster', 'Arquiteto', 'Designer de Produto', 'Gerente de Logística', 'Técnico de Segurança', 'Fisioterapeuta'][i]
    }));

    // Modulo 1: Software na Prática (Tap)
    const m1Tasks: Task[] = Array(10).fill(null).map((_, i) => {
      const correct = ['AutoCAD', 'Photoshop', 'VS Code', 'Premiere Pro', 'Excel', 'Revit', 'Figma', 'Pro Tools', 'ZBrush', 'Blender'][i];
      const wrongs = ['Word', 'Paint', 'Bloco de Notas', 'Calculadora'];
      return {
        type: 'tap',
        prompt: `Qual software o ${['Arquiteto', 'Designer Gráfico', 'Programador', 'Editor de Vídeo', 'Contador', 'Engenheiro Civil', 'UI Designer', 'Produtor Musical', 'Modelador 3D', 'Animador'][i]} usa?`,
        options: this.shuffle([correct, wrongs[i % 4], wrongs[(i+1) % 4]]),
        correct: correct
      };
    });

    // Modulo 2: Onde Trabalha? (Tap)
    const m2Tasks: Task[] = Array(10).fill(null).map((_, i) => {
      const correct = ['Ambiente de Desenvolvimento (IDE)', 'Estúdio Virtual', 'Plataforma BIM', 'Nuvem AWS', 'Sistema ERP', 'CRM de Vendas', 'Software de Telemedicina', 'Terminal Linux', 'Sistema de Controle de Tráfego', 'Painel de E-commerce'][i];
      return {
        type: 'tap',
        prompt: `Identifique o ambiente de trabalho digital do ${['Desenvolvedor', 'Streamer', 'Arquiteto', 'Engenheiro de Dados', 'Administrador', 'Vendedor', 'Médico Digital', 'SysAdmin', 'Controlador de Voo', 'Gerente de Loja'][i]}:`,
        options: this.shuffle([correct, 'Rede Social', 'Caixa de E-mail']),
        correct: correct
      };
    });

    // Modulo 3: Ferramenta Certa (Drag - Hardware vs Software)
    const m3Tasks: Task[] = Array(10).fill(null).map((_, i) => {
      const isHardware = i % 2 === 0;
      const item = isHardware ? 
        ['Monitor UltraWide', 'Placa de Captura', 'Servidor Físico', 'Mouse Vertical', 'Headset'][Math.floor(i/2)] : 
        ['Sistema Operacional', 'Antivírus', 'Compilador', 'Editor de Imagem', 'Navegador'][Math.floor(i/2)];
      return {
        type: 'drag',
        prompt: 'Classifique a ferramenta utilizada na profissão!',
        item: item,
        options: ['Hardware', 'Software'],
        correct: isHardware ? 'Hardware' : 'Software'
      };
    });

    // Modulo 4: O Especialista (Drag 3 zones)
    const m4Tasks: Task[] = Array(10).fill(null).map((_, i) => {
      const categories = ['Saúde', 'Engenharia', 'Artes'];
      const catIndex = i % 3;
      const item = [
        ['Monitor Cardíaco', 'Software de Raio-X', 'Prontuário Eletrônico', 'Bisturi Ultrassônico'],
        ['AutoCAD', 'Estação Total GPS', 'Drone de Mapeamento', 'Impressora 3D de Concreto'],
        ['Mesa Digitalizadora', 'Teclado MIDI', 'Software de Renderização', 'Câmera Mirrorless']
      ][catIndex][Math.floor(i/3)];
      return {
        type: 'drag-3',
        prompt: 'Em qual área o profissional utiliza esta tecnologia?',
        item: item,
        options: categories,
        correct: categories[catIndex]
      };
    });

    this.modules = [
      { id: 0, title: 'Hardware do Profissional', tasks: this.shuffle(m0Tasks) },
      { id: 1, title: 'Software na Prática', tasks: this.shuffle(m1Tasks) },
      { id: 2, title: 'Onde Trabalha?', tasks: this.shuffle(m2Tasks) },
      { id: 3, title: 'Ferramenta Certa', tasks: this.shuffle(m3Tasks) },
      { id: 4, title: 'O Especialista', tasks: this.shuffle(m4Tasks) }
    ];
  }

  loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        if (this.state.fase > 4) this.state.fase = 4;
      } catch (e) {
        this.saveState();
      }
    }
  }

  saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  getCurrentTask(): Task | null {
    if (this.state.fase >= this.modules.length) return null;
    const mod = this.modules[this.state.fase];
    if (this.state.taskId >= mod.tasks.length) return null;
    return mod.tasks[this.state.taskId];
  }

  checkAnswer(answer: string): boolean {
    const task = this.getCurrentTask();
    if (!task) return false;
    
    if (task.correct === answer) {
      this.state.score += 10;
      this.saveState();
      return true;
    } else {
      this.state.hearts--;
      this.saveState();
      return false;
    }
  }

  nextTask(): 'next-task' | 'next-module' | 'game-over' | 'finished' {
    this.state.taskId++;
    const mod = this.modules[this.state.fase];
    
    if (this.state.taskId >= mod.tasks.length) {
      this.state.fase++;
      this.state.taskId = 0;
      this.state.hearts = 3; 
      this.saveState();
      return this.state.fase >= this.modules.length ? 'finished' : 'next-module';
    }
    
    this.saveState();
    return 'next-task';
  }

  restartModule() {
    this.state.taskId = 0;
    this.state.hearts = 3;
    this.saveState();
  }
}
