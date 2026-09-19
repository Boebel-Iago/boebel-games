import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Tool {
  name: string;
  icon: string;
}

interface Profession {
  name: string;
  icon: string;
  correctTool: Tool;
  wrongTools: Tool[];
  feedback: string;
  hardwareDesc: string; // Descrição do Físico
  softwareDesc: string; // Descrição do Lógico
}


interface Phase3Item {
  id: string;
  name: string;
  icon: string;
  category: 'TRABALHO' | 'ESTUDO' | 'LAZER';
}

interface Scenario {
  description: string;
  icon: string;
  type: 'TRABALHO' | 'LAZER';
  feedback: string;
  hardwareDesc: string;
  softwareDesc: string;
}

@Component({
  selector: 'app-professions',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './professions.component.html',
  styleUrl: './professions.component.scss'
})
export class ProfessionsComponent implements OnInit {
  
 // FASE 1: Associar a Tecnologia ao Profissional (10 Fases)
 professions: Profession[] = [
  {
    name: 'Médica', icon: 'assets/images/professions/medica_prof.jpg',
    correctTool: { name: 'Máquina de Ultrassom', icon: 'assets/images/professions/maquina_ultrassom.jpg' },
    wrongTools: [{ name: 'Batedeira', icon: 'assets/images/professions/batedeira.jpg' }, { name: 'Trator', icon: 'assets/images/professions/trator.jpg' }],
    feedback: 'A médica usa a tecnologia para ver dentro do nosso corpo!',
    hardwareDesc: 'O monitor e o sensor (a parte física que toca na pele).',
    softwareDesc: 'O programa de computador que transforma o sinal em uma imagem na tela.'
  },
  {
    name: 'Produtor Musical', icon: 'assets/images/professions/produtor_musical_prof.jpg',
    correctTool: { name: 'Teclado e Computador', icon: 'assets/images/professions/teclado_musical.jpg' },
    wrongTools: [{ name: 'Microscópio', icon: 'assets/images/professions/microscopio_digital.jpg' }, { name: 'Foguete', icon: 'assets/images/professions/foguete.jpg' }],
    feedback: 'A tecnologia ajuda a criar e gravar músicas incríveis!',
    hardwareDesc: 'As teclas físicas do controlador, o cabo e o notebook.',
    softwareDesc: 'O aplicativo de gravação e os instrumentos virtuais que geram o som.'
  },
  {
    name: 'Arquiteta', icon: 'assets/images/professions/arquiteta_prof.jpg',
    correctTool: { name: 'Mesa Digitalizadora', icon: 'assets/images/professions/mesa_digitalizadora.jpg' },
    wrongTools: [{ name: 'Panela', icon: 'assets/images/professions/panela.jpg' }, { name: 'Câmera', icon: 'assets/images/professions/camera_digital.jpg' }],
    feedback: 'Antes de construir uma casa real, ela é desenhada no computador.',
    hardwareDesc: 'A caneta digital e a tela física onde ela desenha.',
    softwareDesc: 'O sistema de desenho 3D que calcula as medidas das paredes.'
  },
  {
    name: 'Caixa de Mercado', icon: 'assets/images/professions/caixa_mercado_prof.jpg',
    correctTool: { name: 'Caixa Registradora', icon: 'assets/images/professions/caixa_registradora.jpg' },
    wrongTools: [{ name: 'Vassoura', icon: 'assets/images/professions/vassoura.jpg' }, { name: 'Secador', icon: 'assets/images/professions/secador.jpg' }],
    feedback: 'A tecnologia faz a conta das compras muito mais rápido!',
    hardwareDesc: 'O leitor de código de barras e a gaveta de dinheiro.',
    softwareDesc: 'O sistema do mercado que sabe o preço exato de cada produto.'
  },
  {
    name: 'Professor', icon: 'assets/images/professions/professor_prof.jpg',
    correctTool: { name: 'Lousa Digital', icon: 'assets/images/professions/lousa_interativa.jpg' },
    wrongTools: [{ name: 'Pá de Construção', icon: 'assets/images/professions/pa_construcao.jpg' }, { name: 'Frigideira', icon: 'assets/images/professions/frigideira.jpg' }],
    feedback: 'O professor usa a lousa interativa para deixar a aula mais divertida!',
    hardwareDesc: 'A tela gigante que podemos tocar com o dedo.',
    softwareDesc: 'O aplicativo de desenho e os jogos educativos que rodam nela.'
  },
  {
    name: 'Fotógrafa', icon: 'assets/images/professions/fotografa_prof.jpg',
    correctTool: { name: 'Câmera Digital', icon: 'assets/images/professions/camera_digital.jpg' },
    wrongTools: [{ name: 'Martelo', icon: 'assets/images/professions/martelo.jpg' }, { name: 'Regador', icon: 'assets/images/professions/regador.jpg' }],
    feedback: 'Ela captura momentos especiais usando muita tecnologia.',
    hardwareDesc: 'A lente, os botões e o cartão de memória da câmera.',
    softwareDesc: 'O sistema interno que ajusta a luz e salva a foto.'
  },
  {
    name: 'Piloto de Avião', icon: 'assets/images/professions/piloto_prof.jpg',
    correctTool: { name: 'Painel de Navegação', icon: 'assets/images/professions/painel_aviao.jpg' },
    wrongTools: [{ name: 'Tinta e Pincel', icon: 'assets/images/professions/tinta_pincel.jpg' }, { name: 'Vara de Pescar', icon: 'assets/images/professions/vara_pescar.jpg' }],
    feedback: 'O avião é uma máquina super inteligente que voa pelo céu.',
    hardwareDesc: 'As telas do painel e o manche (volante) do avião.',
    softwareDesc: 'O programa de GPS que mostra a rota nas nuvens.'
  },
  {
    name: 'Mecânico', icon: 'assets/images/professions/mecanico_prof.jpg',
    correctTool: { name: 'Scanner Automotivo', icon: 'assets/images/professions/scanner_automotivo.jpg' },
    wrongTools: [{ name: 'Microfone', icon: 'assets/images/professions/microfone.jpg' }, { name: 'Prancha de Surf', icon: 'assets/images/professions/prancha_surf.jpg' }],
    feedback: 'Hoje em dia, os carros também têm computadores dentro deles!',
    hardwareDesc: 'O cabo e a maquininha com tela que ele liga no carro.',
    softwareDesc: 'O programa que lê a "mente" do carro para achar o defeito.'
  },
  {
    name: 'Cientista', icon: 'assets/images/professions/cientista_prof.jpg',
    correctTool: { name: 'Microscópio Digital', icon: 'assets/images/professions/microscopio_digital.jpg' },
    wrongTools: [{ name: 'Bola de Futebol', icon: 'assets/images/professions/bola_futebol.jpg' }, { name: 'Violão', icon: 'assets/images/professions/violao.jpg' }],
    feedback: 'A ciência usa a tecnologia para descobrir coisas minúsculas.',
    hardwareDesc: 'As lentes especiais e o cabo que liga no computador.',
    softwareDesc: 'O software que dá zoom e tira fotos das bactérias.'
  },
  {
    name: 'Agricultor', icon: 'assets/images/professions/agricultor_prof.jpg',
    correctTool: { name: 'Drone de Plantação', icon: 'assets/images/professions/drone_plantacao.jpg' },
    wrongTools: [{ name: 'Liquidificador', icon: 'assets/images/professions/liquidificador.jpg' }, { name: 'Maquiagem', icon: 'assets/images/professions/maquiagem.jpg' }],
    feedback: 'A tecnologia voa sobre a fazenda para cuidar das plantas.',
    hardwareDesc: 'As hélices, a bateria e o controle remoto do Drone.',
    softwareDesc: 'O aplicativo de celular que faz o Drone voar sozinho.'
  }
];

// FASE 2: Trabalho vs Lazer (10 Fases - Cruzando HW e SW)
scenarios: Scenario[] = [
  { 
    description: 'Assistir a um filme de animação.', 
    icon: 'assets/images/professions/cenario_filme.jpg', 
    type: 'LAZER', 
    feedback: 'Você usou a tecnologia para se divertir e relaxar!',
    hardwareDesc: 'A tela do Tablet ou a Smart TV.',
    softwareDesc: 'O aplicativo de vídeos (como Netflix ou YouTube).'
  },
  { 
    description: 'Digitar um relatório do escritório.', 
    icon: 'assets/images/professions/cenario_relatorio.jpg', 
    type: 'TRABALHO', 
    feedback: 'A tecnologia é essencial para organizar informações.',
    hardwareDesc: 'O teclado físico e o mouse do Notebook.',
    softwareDesc: 'O editor de textos (como o Word ou Google Docs).'
  },
  { 
    description: 'Jogar online com os amigos.', 
    icon: 'assets/images/professions/cenario_jogar.jpg', 
    type: 'LAZER', 
    feedback: 'A diversão conectada depende da tecnologia!',
    hardwareDesc: 'O console do videogame e os botões do controle.',
    softwareDesc: 'O código do jogo digital que cria o mundo virtual.'
  },
  { 
    description: 'Programar um aplicativo novo.', 
    icon: 'assets/images/professions/cenario_programar.jpg', 
    type: 'TRABALHO', 
    feedback: 'Criar novas tecnologias é uma profissão muito importante!',
    hardwareDesc: 'Os servidores, os monitores e o computador.',
    softwareDesc: 'A linguagem de código que diz para a máquina o que fazer.'
  },
  { 
    description: 'Ouvir músicas no fone de ouvido enquanto descansa.', 
    icon: 'assets/images/professions/cenario_musica.jpg', 
    type: 'LAZER', 
    feedback: 'A música digital viaja pelo ar até o seu fone.',
    hardwareDesc: 'O fone de ouvido sem fio (Bluetooth) e o celular.',
    softwareDesc: 'O aplicativo de música (como o Spotify) que toca o som.'
  },
  { 
    description: 'Fazer uma videochamada de reunião com o chefe.', 
    icon: 'assets/images/professions/cenario_videochamada.jpg', 
    type: 'TRABALHO', 
    feedback: 'A tecnologia conecta profissionais do mundo inteiro.',
    hardwareDesc: 'A câmera (webcam) e o microfone do notebook.',
    softwareDesc: 'O programa de reuniões online (como o Google Meet).'
  },
  { 
    description: 'Ler um livro digital (e-book) de aventuras na cama.', 
    icon: 'assets/images/professions/cenario_ebook.jpg', 
    type: 'LAZER', 
    feedback: 'Milhares de livros podem caber em um único aparelho!',
    hardwareDesc: 'O leitor digital (como o Kindle) e sua tela.',
    softwareDesc: 'O sistema que guarda as páginas virtuais do livro.'
  },
  { 
    description: 'Controlar o estoque de roupas de uma loja.', 
    icon: 'assets/images/professions/cenario_estoque.jpg', 
    type: 'TRABALHO', 
    feedback: 'A tecnologia evita que as lojas percam produtos.',
    hardwareDesc: 'O tablet que o vendedor segura na mão.',
    softwareDesc: 'O aplicativo que anota quantas blusas ainda têm para vender.'
  },
  { 
    description: 'Brincar de fazer um desenho digital colorido.', 
    icon: 'assets/images/professions/cenario_desenho.jpg', 
    type: 'LAZER', 
    feedback: 'A arte digital não precisa de papel ou tinta de verdade.',
    hardwareDesc: 'O tablet e a caneta especial de toque.',
    softwareDesc: 'O aplicativo de pintura com pincéis virtuais.'
  },
  { 
    description: 'Motorista de aplicativo levando passageiros.', 
    icon: 'assets/images/professions/cenario_motorista.jpg', 
    type: 'TRABALHO', 
    feedback: 'O GPS mudou a forma como as pessoas viajam pela cidade.',
    hardwareDesc: 'O suporte e o celular no painel do carro.',
    softwareDesc: 'O aplicativo de mapas e corridas (como Uber ou Waze).'
  }
];

  
  // FASE 3: Drag & Drop (Categorização)
  gameStage: 1 | 2 | 3 = 1;
  showFeedback: boolean = false;
  phase3Level: number = 1;

  unassignedItems: Phase3Item[] = [];
  workColumn: Phase3Item[] = [];
  studyColumn: Phase3Item[] = [];
  leisureColumn: Phase3Item[] = [];

  phase3Data: Phase3Item[][] = [
    // Nível 1
    [
      { id: '1', name: 'Planilha Financeira', icon: '📊', category: 'TRABALHO' },
      { id: '2', name: 'Editor de Código', icon: '💻', category: 'TRABALHO' },
      { id: '3', name: 'Reunião de Equipe', icon: '👔', category: 'TRABALHO' },
      { id: '4', name: 'Email Profissional', icon: '✉️', category: 'TRABALHO' },
      { id: '5', name: 'Controle de Estoque', icon: '📦', category: 'TRABALHO' },
      { id: '6', name: 'Videoaula', icon: '📐', category: 'ESTUDO' },
      { id: '7', name: 'Resumo Acadêmico', icon: '📄', category: 'ESTUDO' },
      { id: '8', name: 'Fórum de Dúvidas', icon: '🙋', category: 'ESTUDO' },
      { id: '9', name: 'Simulado Online', icon: '📝', category: 'ESTUDO' },
      { id: '10', name: 'Pesquisa Escolar', icon: '🔍', category: 'ESTUDO' },
      { id: '11', name: 'Série Animada', icon: '📺', category: 'LAZER' },
      { id: '12', name: 'Jogo de Aventura', icon: '🎮', category: 'LAZER' },
      { id: '13', name: 'Rede Social', icon: '📱', category: 'LAZER' },
      { id: '14', name: 'Música Relaxante', icon: '🎧', category: 'LAZER' },
      { id: '15', name: 'Quadrinhos', icon: '🗯️', category: 'LAZER' }
    ],
    // Nível 2
    [
      { id: '16', name: 'App de Vendas', icon: '📈', category: 'TRABALHO' },
      { id: '17', name: 'App de Motorista', icon: '🚗', category: 'TRABALHO' },
      { id: '18', name: 'Edição de Vídeo', icon: '🎬', category: 'TRABALHO' },
      { id: '19', name: 'Prancheta Digital', icon: '📏', category: 'TRABALHO' },
      { id: '20', name: 'Sistema de Caixa', icon: '🛒', category: 'TRABALHO' },
      { id: '21', name: 'Livro Didático', icon: '📚', category: 'ESTUDO' },
      { id: '22', name: 'Grupo de Estudos', icon: '💬', category: 'ESTUDO' },
      { id: '23', name: 'Curso de Idiomas', icon: '🌍', category: 'ESTUDO' },
      { id: '24', name: 'Calculadora', icon: '🧮', category: 'ESTUDO' },
      { id: '25', name: 'Mapa Mental', icon: '🧠', category: 'ESTUDO' },
      { id: '26', name: 'Vlog de Viagem', icon: '✈️', category: 'LAZER' },
      { id: '27', name: 'Futebol Online', icon: '⚽', category: 'LAZER' },
      { id: '28', name: 'Playlist de Festa', icon: '🎵', category: 'LAZER' },
      { id: '29', name: 'Vídeos Engraçados', icon: '😂', category: 'LAZER' },
      { id: '30', name: 'Live de Jogos', icon: '🔴', category: 'LAZER' }
    ],
    // Nível 3
    [
      { id: '31', name: 'Prontuário Médico', icon: '⚕️', category: 'TRABALHO' },
      { id: '32', name: 'Projeto 3D', icon: '🏗️', category: 'TRABALHO' },
      { id: '33', name: 'Design Gráfico', icon: '🎨', category: 'TRABALHO' },
      { id: '34', name: 'Contabilidade', icon: '🧾', category: 'TRABALHO' },
      { id: '35', name: 'Agenda de Clientes', icon: '📅', category: 'TRABALHO' },
      { id: '36', name: 'Tutorial Python', icon: '⌨️', category: 'ESTUDO' },
      { id: '37', name: 'Artigo Científico', icon: '🔬', category: 'ESTUDO' },
      { id: '38', name: 'Documentário', icon: '🏛️', category: 'ESTUDO' },
      { id: '39', name: 'Treinamento', icon: '🎯', category: 'ESTUDO' },
      { id: '40', name: 'Teste Lógico', icon: '🧩', category: 'ESTUDO' },
      { id: '41', name: 'Comédia Stand-up', icon: '🍿', category: 'LAZER' },
      { id: '42', name: 'Chat com Amigos', icon: '🗣️', category: 'LAZER' },
      { id: '43', name: 'Jogo de Cartas', icon: '🃏', category: 'LAZER' },
      { id: '44', name: 'Loja de Roupas', icon: '👗', category: 'LAZER' },
      { id: '45', name: 'Planejar Férias', icon: '🏖️', category: 'LAZER' }
    ]
  ];

  currentIndex: number = 0;
  currentOptions: Tool[] = [];
  
  showFeedbackModal: boolean = false;
  feedbackText: string = '';
  feedbackHardware: string = '';
  feedbackSoftware: string = '';
  isCorrectGuess: boolean = false;
  gameFinished: boolean = false;

  constructor(private progressReporter: ProgressReporter) {}

  ngOnInit() {
    if (sessionStorage.getItem("isDemoMode") === "true") { this.professions = this.professions.slice(0, 2); this.scenarios = []; }
    this.restoreProgress();
    this.loadProfession();
  }

  
  private restoreProgress() {
    const saved = sessionStorage.getItem('currentStage');
    if (saved) {
      const stage = parseInt(saved, 10);
      if (!isNaN(stage) && stage > 0) {
        const phase1Total = this.professions.length;
        const phase2Total = this.scenarios.length;
        if (stage >= phase1Total + phase2Total + 3) {
          this.gameFinished = true;
        } else if (stage >= phase1Total + phase2Total) {
          this.gameStage = 3;
          this.phase3Level = stage - (phase1Total + phase2Total) + 1;
          this.loadPhase3();
        } else if (stage >= phase1Total) {
          this.gameStage = 2;
          this.currentIndex = stage - phase1Total;
        } else {
          this.gameStage = 1;
          this.currentIndex = stage;
        }
      }
    }
  }

  loadPhase3() {
    this.workColumn = [];
    this.studyColumn = [];
    this.leisureColumn = [];
    // Clonar e embaralhar
    this.unassignedItems = [...this.phase3Data[this.phase3Level - 1]].sort(() => Math.random() - 0.5);
  }


  private getAbsoluteStage(): number {
    const p1 = this.professions.length;
    const p2 = this.scenarios.length;
    if (this.gameStage === 1) return this.currentIndex;
    if (this.gameStage === 2) return p1 + this.currentIndex;
    return p1 + p2 + (this.phase3Level - 1);
  }


  loadProfession() {
    const prof = this.professions[this.currentIndex];
    this.currentOptions = [prof.correctTool, ...prof.wrongTools].sort(() => Math.random() - 0.5);
  }

  checkTool(tool: Tool) {
    const prof = this.professions[this.currentIndex];
    if (tool.name === prof.correctTool.name) {
      this.isCorrectGuess = true;
      this.feedbackText = prof.feedback;
      this.feedbackHardware = prof.hardwareDesc;
      this.feedbackSoftware = prof.softwareDesc;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ops! Essa tecnologia não pertence a este profissional. Tente de novo!';
      this.feedbackHardware = '';
      this.feedbackSoftware = '';
    }
    this.showFeedbackModal = true;
  }

  checkScenario(answer: 'TRABALHO' | 'LAZER') {
    const scenario = this.scenarios[this.currentIndex];
    if (scenario.type === answer) {
      this.isCorrectGuess = true;
      this.feedbackText = scenario.feedback;
      this.feedbackHardware = scenario.hardwareDesc;
      this.feedbackSoftware = scenario.softwareDesc;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = `Na verdade, essa atividade é um momento de ${scenario.type.toLowerCase()}.`;
      this.feedbackHardware = '';
      this.feedbackSoftware = '';
    }
    this.showFeedbackModal = true;
  }

  nextStep() {
    this.showFeedbackModal = false;

    if (!this.isCorrectGuess) {
      this.progressReporter.report({
        levelId: `professions-${this.getAbsoluteStage()}`,
        fase: this.getAbsoluteStage(),
        result: 'failure',
        attempts: 0,
        timestamp: new Date().toISOString(),
        isLastLevel: false
      });
      return;
    }

    
    this.currentIndex++;
    const phase1Total = this.professions.length;
    let isFinished = false;

    if (this.gameStage === 1 && this.currentIndex >= phase1Total) {
      this.gameStage = 2;
      this.currentIndex = 0;
    } else if (this.gameStage === 2 && this.currentIndex >= this.scenarios.length) {
      this.gameStage = 3;
      this.phase3Level = 1;
      this.loadPhase3();
    } else if (this.gameStage === 1) {
      this.loadProfession();
    }

    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success',
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: isFinished
    });
  }

  drop(event: CdkDragDrop<Phase3Item[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  checkPhase3Answers() {
    if (this.unassignedItems.length > 0) return; // Não deveria ser clicável, mas por segurança
    
    // Validar cada coluna
    let hasError = false;
    this.workColumn.forEach(item => { if(item.category !== 'TRABALHO') hasError = true; });
    this.studyColumn.forEach(item => { if(item.category !== 'ESTUDO') hasError = true; });
    this.leisureColumn.forEach(item => { if(item.category !== 'LAZER') hasError = true; });

    if (hasError) {
      this.feedbackSoftware = 'Ops! Alguns artefatos estão na coluna errada. Revise!';
      this.showFeedback = true;
      
      this.progressReporter.report({
        levelId: `professions-${this.getAbsoluteStage()}`,
        fase: this.getAbsoluteStage(),
        result: 'failure',
        attempts: 0,
        timestamp: new Date().toISOString(), isLastLevel: false
      });
      return;
    }

    // Sucesso!
    this.showFeedback = false;
    this.feedbackSoftware = '';

    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success',
      attempts: 0,
      timestamp: new Date().toISOString(), isLastLevel: this.phase3Level === 3
    });

    if (this.phase3Level < 3) {
      this.phase3Level++;
      this.loadPhase3();
      sessionStorage.setItem('currentStage', this.getAbsoluteStage().toString());
    } else {
      this.gameFinished = true;
      sessionStorage.setItem('currentStage', this.getAbsoluteStage().toString());
    }
  }

}