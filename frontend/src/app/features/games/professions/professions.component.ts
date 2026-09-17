import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

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
  imports: [CommonModule],
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

  gameStage: 1 | 2 = 1;
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
        if (stage >= phase1Total + this.scenarios.length) {
          this.gameFinished = true;
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

  private getAbsoluteStage(): number {
    return this.gameStage === 1
      ? this.currentIndex
      : this.professions.length + this.currentIndex;
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
      this.gameFinished = true;
      isFinished = true;
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
}