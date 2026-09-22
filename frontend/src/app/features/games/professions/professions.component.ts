import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  Dialogue, Tool, Profession, Scenario, Phase3Item,
  HwSwChallenge, SoftwareTask, AcademyMission
} from './models';

/**
 * Academia de Talentos Digitais — Jogo de Profissões Expandido.
 *
 * Mentora: Professora Ada (inspirada em Ada Lovelace).
 * 4 Missões temáticas com narrativa imersiva (~1h a 1h30 de jogo).
 *
 * Missão 1: Ferramentas Tecnológicas (tool-match)
 * Missão 2: O Software Invisível (software-identify)
 * Missão 3: Trabalho, Estudo ou Lazer? (category-sort)
 * Missão 4: Desafio Final — Drag & Drop (drag-drop)
 */
@Component({
  selector: 'app-professions',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './professions.component.html',
  styleUrl: './professions.component.scss'
})
export class ProfessionsComponent implements OnInit {

  // ═══════════════════════════════════════════════════════════════
  //  ESTADO DA MÁQUINA DE ESTADOS
  // ═══════════════════════════════════════════════════════════════
  displayMode: 'briefing' | 'gameplay' | 'feedback' | 'mission-complete' | 'finished' = 'briefing';
  currentMissionIndex = 0;
  currentTaskIndex = 0;
  currentDialogueIndex = 0;
  gameFinished = false;
  studentName = sessionStorage.getItem('studentName') || 'Recruta';

  // Feedback modal
  showFeedbackModal = false;
  feedbackText = '';
  feedbackHardware = '';
  feedbackSoftware = '';
  isCorrectGuess = false;

  // Fase 1 — Tool match
  currentOptions: Tool[] = [];

  // Fase 2 — Software identify
  currentSoftwareOptions: string[] = [];

  // Fase 2.5 — HW/SW challenge
  isHwSwChallenge = false;
  currentHwSwChallenge: HwSwChallenge | null = null;
  hwSwChallengeIndex = 0;

  // Fase 3 — Category sort (Trabalho/Estudo/Lazer com botões)
  scenarioCategory: 'TRABALHO' | 'ESTUDO' | 'LAZER' | null = null;

  // Fase 4 — Drag & Drop
  phase3Level = 1;
  showDragError = false;
  unassignedItems: Phase3Item[] = [];
  workColumn: Phase3Item[] = [];
  studyColumn: Phase3Item[] = [];
  leisureColumn: Phase3Item[] = [];

  // ═══════════════════════════════════════════════════════════════
  //  MISSÕES
  // ═══════════════════════════════════════════════════════════════
  missions: AcademyMission[] = [
    {
      id: 1,
      title: 'O Primeiro Dia na Academia',
      subtitle: 'Descubra as ferramentas tecnológicas de cada profissão',
      type: 'tool-match',
      briefing: [
        { speaker: 'ada', text: 'Olá, recruta! Eu sou a Professora Ada, e este é o seu primeiro dia na Academia de Talentos Digitais! 👩‍🏫' },
        { speaker: 'ada', text: 'Aqui você vai descobrir como a tecnologia transformou TODAS as profissões. Médicas, pilotos, agricultores... todos usam máquinas incríveis!' },
        { speaker: 'ada', text: 'Mas antes de tudo, você precisa aprender a diferenciar HARDWARE (a parte física que tocamos) de SOFTWARE (o programa invisível que faz tudo funcionar).' },
        { speaker: 'ada', text: 'Vamos começar! Vou te apresentar vários profissionais. Sua missão é descobrir qual ferramenta tecnológica cada um usa. Preparado?' },
      ],
      debriefing: [
        { speaker: 'ada', text: 'Excelente trabalho, recruta! Você já conhece as ferramentas de 10 profissionais diferentes!' },
        { speaker: 'ada', text: 'Percebeu como TODA profissão hoje em dia usa tecnologia? E cada ferramenta tem uma parte que tocamos (Hardware) e uma parte invisível (Software).' },
        { speaker: 'ada', text: 'Agora vamos para a Feira de Profissões! Lá você vai descobrir os softwares secretos que cada profissional usa... 🔍' },
      ]
    },
    {
      id: 2,
      title: 'A Feira de Profissões',
      subtitle: 'Descubra o Software Invisível de cada profissão',
      type: 'software-identify',
      briefing: [
        { speaker: 'ada', text: 'Bem-vindo à Feira de Profissões da Academia! 🎪 Cada stand mostra um profissional no trabalho.' },
        { speaker: 'ada', text: 'Na missão anterior, você aprendeu a identificar as FERRAMENTAS (Hardware). Agora vamos focar no que é invisível: o SOFTWARE!' },
        { speaker: 'ada', text: 'Software é o programa que faz o Hardware funcionar. Sem o Software, o Hardware é só um pedaço de metal ou plástico!' },
        { speaker: 'ada', text: 'Para cada profissional, você deve escolher qual Software ele usa no dia a dia. Vamos lá!' },
      ],
      debriefing: [
        { speaker: 'ada', text: 'Agora você domina os dois lados da moeda tecnológica: Hardware E Software! 🎓' },
        { speaker: 'ada', text: 'Lembre-se: o Software é como a alma da máquina — sem ele, o computador mais caro do mundo não faz absolutamente nada.' },
        { speaker: 'ada', text: 'Mas a tecnologia não é só para trabalhar! Vamos descobrir como ela aparece no nosso dia a dia... ⚡' },
      ]
    },
    {
      id: 3,
      title: 'O Grande Apagão',
      subtitle: 'Classifique as atividades para restaurar a energia!',
      type: 'category-sort',
      briefing: [
        { speaker: 'ada', text: 'ALERTA! Um apagão atingiu a Academia de Talentos Digitais! ⚡🔌' },
        { speaker: 'ada', text: 'Para restaurar a energia, precisamos organizar todas as atividades digitais nas categorias corretas!' },
        { speaker: 'ada', text: 'Cada atividade pode ser de TRABALHO 💼, ESTUDO 📚 ou LAZER 🎮. Cuidado! Algumas podem parecer ambíguas...' },
        { speaker: 'ada', text: 'A cada resposta certa, restauramos um bloco de energia. Vamos salvar a Academia!' },
      ],
      debriefing: [
        { speaker: 'ada', text: 'A energia foi restaurada! ⚡ A Academia está funcionando de novo!' },
        { speaker: 'ada', text: 'Você aprendeu que a mesma tecnologia pode servir para trabalhar, estudar ou se divertir. Tudo depende de COMO usamos!' },
        { speaker: 'ada', text: 'Agora falta o último desafio: a prova de FORMATURA! 🎓' },
      ]
    },
    {
      id: 4,
      title: 'A Formatura',
      subtitle: 'Desafio Final — Organize tudo e receba seu diploma!',
      type: 'drag-drop',
      briefing: [
        { speaker: 'ada', text: 'Chegou o grande momento, recruta! A cerimônia de formatura da Academia de Talentos Digitais! 🎓🏆' },
        { speaker: 'ada', text: 'Para receber seu diploma, você precisa passar pelo Desafio Final: arrastar cada item digital para a coluna correta.' },
        { speaker: 'ada', text: 'São 3 rodadas com dificuldade crescente. Arraste os itens para TRABALHO, ESTUDO ou LAZER.' },
        { speaker: 'ada', text: 'Quando todos os itens estiverem nas colunas, clique em "Verificar Respostas". Se algum estiver errado, tente de novo!' },
      ],
      debriefing: [
        { speaker: 'ada', text: '🏆 PARABÉNS, RECRUTA! Você se formou na Academia de Talentos Digitais!' },
        { speaker: 'ada', text: 'Você aprendeu que a tecnologia está em TODAS as profissões, que Hardware é a parte física e Software é a parte lógica...' },
        { speaker: 'ada', text: '...e que a mesma tecnologia pode servir para Trabalho, Estudo ou Lazer! Nunca se esqueça disso! 🌟' },
      ]
    }
  ];

  // ═══════════════════════════════════════════════════════════════
  //  DADOS DA MISSÃO 1: FERRAMENTAS TECNOLÓGICAS
  // ═══════════════════════════════════════════════════════════════
  professions: Profession[] = [
    {
      name: 'Médica', icon: 'assets/images/professions/medica_prof.jpg',
      correctTool: { name: 'Máquina de Ultrassom', icon: 'assets/images/professions/maquina_ultrassom.jpg' },
      wrongTools: [{ name: 'Batedeira', icon: 'assets/images/professions/batedeira.jpg' }, { name: 'Trator', icon: 'assets/images/professions/trator.jpg' }, { name: 'Teclado Musical', icon: 'assets/images/professions/teclado_musical.jpg' }],
      feedback: 'A médica usa a tecnologia para ver dentro do nosso corpo!',
      hardwareDesc: 'O monitor e o sensor (a parte física que toca na pele).',
      softwareDesc: 'O programa de computador que transforma o sinal em uma imagem na tela.'
    },
    {
      name: 'Produtor Musical', icon: 'assets/images/professions/produtor_musical_prof.jpg',
      correctTool: { name: 'Teclado e Computador', icon: 'assets/images/professions/teclado_musical.jpg' },
      wrongTools: [{ name: 'Microscópio', icon: 'assets/images/professions/microscopio_digital.jpg' }, { name: 'Foguete', icon: 'assets/images/professions/foguete.jpg' }, { name: 'Pá de Construção', icon: 'assets/images/professions/pa_construcao.jpg' }],
      feedback: 'A tecnologia ajuda a criar e gravar músicas incríveis!',
      hardwareDesc: 'As teclas físicas do controlador, o cabo e o notebook.',
      softwareDesc: 'O aplicativo de gravação e os instrumentos virtuais que geram o som.'
    },
    {
      name: 'Arquiteta', icon: 'assets/images/professions/arquiteta_prof.jpg',
      correctTool: { name: 'Mesa Digitalizadora', icon: 'assets/images/professions/mesa_digitalizadora.jpg' },
      wrongTools: [{ name: 'Panela', icon: 'assets/images/professions/panela.jpg' }, { name: 'Câmera', icon: 'assets/images/professions/camera_digital.jpg' }, { name: 'Vassoura', icon: 'assets/images/professions/vassoura.jpg' }],
      feedback: 'Antes de construir uma casa real, ela é desenhada no computador.',
      hardwareDesc: 'A caneta digital e a tela física onde ela desenha.',
      softwareDesc: 'O sistema de desenho 3D que calcula as medidas das paredes.'
    },
    {
      name: 'Caixa de Mercado', icon: 'assets/images/professions/caixa_mercado_prof.jpg',
      correctTool: { name: 'Caixa Registradora', icon: 'assets/images/professions/caixa_registradora.jpg' },
      wrongTools: [{ name: 'Vassoura', icon: 'assets/images/professions/vassoura.jpg' }, { name: 'Secador', icon: 'assets/images/professions/secador.jpg' }, { name: 'Drone', icon: 'assets/images/professions/drone_plantacao.jpg' }],
      feedback: 'A tecnologia faz a conta das compras muito mais rápido!',
      hardwareDesc: 'O leitor de código de barras e a gaveta de dinheiro.',
      softwareDesc: 'O sistema do mercado que sabe o preço exato de cada produto.'
    },
    {
      name: 'Professor', icon: 'assets/images/professions/professor_prof.jpg',
      correctTool: { name: 'Lousa Digital', icon: 'assets/images/professions/lousa_interativa.jpg' },
      wrongTools: [{ name: 'Pá de Construção', icon: 'assets/images/professions/pa_construcao.jpg' }, { name: 'Frigideira', icon: 'assets/images/professions/frigideira.jpg' }, { name: 'Scanner Automotivo', icon: 'assets/images/professions/scanner_automotivo.jpg' }],
      feedback: 'O professor usa a lousa interativa para deixar a aula mais divertida!',
      hardwareDesc: 'A tela gigante que podemos tocar com o dedo.',
      softwareDesc: 'O aplicativo de desenho e os jogos educativos que rodam nela.'
    },
    {
      name: 'Fotógrafa', icon: 'assets/images/professions/fotografa_prof.jpg',
      correctTool: { name: 'Câmera Digital', icon: 'assets/images/professions/camera_digital.jpg' },
      wrongTools: [{ name: 'Martelo', icon: 'assets/images/professions/martelo.jpg' }, { name: 'Regador', icon: 'assets/images/professions/regador.jpg' }, { name: 'Liquidificador', icon: 'assets/images/professions/liquidificador.jpg' }],
      feedback: 'Ela captura momentos especiais usando muita tecnologia.',
      hardwareDesc: 'A lente, os botões e o cartão de memória da câmera.',
      softwareDesc: 'O sistema interno que ajusta a luz e salva a foto.'
    },
    {
      name: 'Piloto de Avião', icon: 'assets/images/professions/piloto_prof.jpg',
      correctTool: { name: 'Painel de Navegação', icon: 'assets/images/professions/painel_aviao.jpg' },
      wrongTools: [{ name: 'Tinta e Pincel', icon: 'assets/images/professions/tinta_pincel.jpg' }, { name: 'Vara de Pescar', icon: 'assets/images/professions/vara_pescar.jpg' }, { name: 'Bola de Futebol', icon: 'assets/images/professions/bola_futebol.jpg' }],
      feedback: 'O avião é uma máquina super inteligente que voa pelo céu.',
      hardwareDesc: 'As telas do painel e o manche (volante) do avião.',
      softwareDesc: 'O programa de GPS que mostra a rota nas nuvens.'
    },
    {
      name: 'Mecânico', icon: 'assets/images/professions/mecanico_prof.jpg',
      correctTool: { name: 'Scanner Automotivo', icon: 'assets/images/professions/scanner_automotivo.jpg' },
      wrongTools: [{ name: 'Microfone', icon: 'assets/images/professions/microfone.jpg' }, { name: 'Prancha de Surf', icon: 'assets/images/professions/prancha_surf.jpg' }, { name: 'Maquiagem', icon: 'assets/images/professions/maquiagem.jpg' }],
      feedback: 'Hoje em dia, os carros também têm computadores dentro deles!',
      hardwareDesc: 'O cabo e a maquininha com tela que ele liga no carro.',
      softwareDesc: 'O programa que lê a "mente" do carro para achar o defeito.'
    },
    {
      name: 'Cientista', icon: 'assets/images/professions/cientista_prof.jpg',
      correctTool: { name: 'Microscópio Digital', icon: 'assets/images/professions/microscopio_digital.jpg' },
      wrongTools: [{ name: 'Bola de Futebol', icon: 'assets/images/professions/bola_futebol.jpg' }, { name: 'Violão', icon: 'assets/images/professions/violao.jpg' }, { name: 'Panela', icon: 'assets/images/professions/panela.jpg' }],
      feedback: 'A ciência usa a tecnologia para descobrir coisas minúsculas.',
      hardwareDesc: 'As lentes especiais e o cabo que liga no computador.',
      softwareDesc: 'O software que dá zoom e tira fotos das bactérias.'
    },
    {
      name: 'Agricultor', icon: 'assets/images/professions/agricultor_prof.jpg',
      correctTool: { name: 'Drone de Plantação', icon: 'assets/images/professions/drone_plantacao.jpg' },
      wrongTools: [{ name: 'Liquidificador', icon: 'assets/images/professions/liquidificador.jpg' }, { name: 'Maquiagem', icon: 'assets/images/professions/maquiagem.jpg' }, { name: 'Foguete', icon: 'assets/images/professions/foguete.jpg' }],
      feedback: 'A tecnologia voa sobre a fazenda para cuidar das plantas.',
      hardwareDesc: 'As hélices, a bateria e o controle remoto do Drone.',
      softwareDesc: 'O aplicativo de celular que faz o Drone voar sozinho.'
    }
  ];

  // Desafios HW/SW intercalados na Missão 1
  hwSwChallenges: HwSwChallenge[] = [
    { question: 'O sensor da Máquina de Ultrassom que toca na pele é...', icon: 'assets/images/professions/maquina_ultrassom.jpg', answer: 'HARDWARE', explanation: 'Correto! Tudo que podemos tocar é Hardware!' },
    { question: 'O programa que gera a imagem do ultrassom na tela é...', icon: 'assets/images/professions/maquina_ultrassom.jpg', answer: 'SOFTWARE', explanation: 'Isso! O programa que processa a imagem é Software — não podemos tocar nele!' },
    { question: 'As teclas físicas do teclado musical são...', icon: 'assets/images/professions/teclado_musical.jpg', answer: 'HARDWARE', explanation: 'Exatamente! As teclas que seus dedos apertam são a parte física — Hardware!' },
    { question: 'O aplicativo que grava e edita as músicas é...', icon: 'assets/images/professions/teclado_musical.jpg', answer: 'SOFTWARE', explanation: 'Perfeito! O editor de som é um programa — Software!' },
    { question: 'O leitor de código de barras do mercado é...', icon: 'assets/images/professions/caixa_registradora.jpg', answer: 'HARDWARE', explanation: 'Sim! O leitor é a parte física que bipa quando passa o produto!' },
    { question: 'As hélices e a bateria do Drone são...', icon: 'assets/images/professions/drone_plantacao.jpg', answer: 'HARDWARE', explanation: 'Muito bem! Hélices e bateria são peças físicas — puro Hardware!' },
    { question: 'O app do celular que controla a rota do Drone é...', icon: 'assets/images/professions/drone_plantacao.jpg', answer: 'SOFTWARE', explanation: 'Exato! O aplicativo é um programa que roda no celular — Software!' },
  ];

  // ═══════════════════════════════════════════════════════════════
  //  DADOS DA MISSÃO 2: SOFTWARE INVISÍVEL
  // ═══════════════════════════════════════════════════════════════
  softwareTasks: SoftwareTask[] = [
    { professionName: 'Médica', professionIcon: 'assets/images/professions/medica_prof.jpg', question: 'Qual Software a Médica usa para ver o interior do corpo?', correctAnswer: 'Programa de Imagem Médica', wrongAnswers: ['Editor de Fotos', 'Jogo de Cirurgia', 'Planilha de Excel'], explanation: 'O Programa de Imagem Médica transforma os sinais do sensor em imagens que o médico pode analisar.' },
    { professionName: 'Produtor Musical', professionIcon: 'assets/images/professions/produtor_musical_prof.jpg', question: 'Qual Software o Produtor Musical usa para criar músicas?', correctAnswer: 'Software de Gravação (DAW)', wrongAnswers: ['Programa de Desenho', 'Navegador de Internet', 'Calculadora'], explanation: 'O DAW (Digital Audio Workstation) é o estúdio virtual onde ele mixa e grava todos os sons.' },
    { professionName: 'Arquiteta', professionIcon: 'assets/images/professions/arquiteta_prof.jpg', question: 'Qual Software a Arquiteta usa para projetar casas?', correctAnswer: 'Software de Design 3D (AutoCAD)', wrongAnswers: ['Editor de Vídeo', 'Aplicativo de Receitas', 'Rede Social'], explanation: 'O AutoCAD é um programa que desenha plantas e modelos 3D com medidas exatas.' },
    { professionName: 'Caixa de Mercado', professionIcon: 'assets/images/professions/caixa_mercado_prof.jpg', question: 'Qual Software o Caixa do Mercado usa para registrar compras?', correctAnswer: 'Sistema de Ponto de Venda (PDV)', wrongAnswers: ['Jogo de Fazenda', 'Editor de Texto', 'Aplicativo de Música'], explanation: 'O PDV é o programa que sabe o preço de cada produto e calcula o total da compra.' },
    { professionName: 'Professor', professionIcon: 'assets/images/professions/professor_prof.jpg', question: 'Qual Software o Professor usa na lousa digital?', correctAnswer: 'Software Educacional Interativo', wrongAnswers: ['Programa de Contabilidade', 'App de Entregas', 'Antivírus'], explanation: 'Os softwares educacionais permitem que o professor desenhe, mostre vídeos e crie jogos na lousa.' },
    { professionName: 'Fotógrafa', professionIcon: 'assets/images/professions/fotografa_prof.jpg', question: 'Qual Software a Fotógrafa usa para melhorar as fotos?', correctAnswer: 'Editor de Imagens (Lightroom)', wrongAnswers: ['Planilha de Dados', 'Programa de GPS', 'App de Banco'], explanation: 'O Lightroom ajusta brilho, cores e contraste das fotos para ficarem perfeitas.' },
    { professionName: 'Piloto de Avião', professionIcon: 'assets/images/professions/piloto_prof.jpg', question: 'Qual Software o Piloto usa para navegar nos céus?', correctAnswer: 'Sistema de Navegação GPS', wrongAnswers: ['Rede Social', 'Jogo de Avião', 'Editor de Texto'], explanation: 'O GPS do avião calcula a rota, altitude e velocidade para chegar ao destino com segurança.' },
    { professionName: 'Mecânico', professionIcon: 'assets/images/professions/mecanico_prof.jpg', question: 'Qual Software o Mecânico usa para diagnosticar problemas no carro?', correctAnswer: 'Software de Diagnóstico (OBD)', wrongAnswers: ['App de Corrida', 'Programa de Música', 'Editor de Fotos'], explanation: 'O OBD lê os códigos de erro do computador do carro e diz exatamente o que está quebrado.' },
    { professionName: 'Cientista', professionIcon: 'assets/images/professions/cientista_prof.jpg', question: 'Qual Software a Cientista usa para analisar amostras no microscópio?', correctAnswer: 'Software de Análise Microscópica', wrongAnswers: ['Jogo de Química', 'App de Delivery', 'Rede Social'], explanation: 'O software amplia a imagem, tira medidas das células e salva tudo para a pesquisa.' },
    { professionName: 'Agricultor', professionIcon: 'assets/images/professions/agricultor_prof.jpg', question: 'Qual Software o Agricultor usa para controlar o Drone?', correctAnswer: 'App de Pilotagem Automática', wrongAnswers: ['Programa de Desenho', 'Calculadora', 'Editor de Vídeo'], explanation: 'O aplicativo no celular programa a rota do Drone para sobrevoar toda a plantação automaticamente.' },
  ];

  // ═══════════════════════════════════════════════════════════════
  //  DADOS DA MISSÃO 3: TRABALHO, ESTUDO OU LAZER
  // ═══════════════════════════════════════════════════════════════
  scenarios: Scenario[] = [
    { description: 'Assistir a um filme de animação.', icon: 'assets/images/professions/cenario_filme.jpg', type: 'LAZER', feedback: 'Você usou a tecnologia para se divertir e relaxar!', hardwareDesc: 'A tela do Tablet ou a Smart TV.', softwareDesc: 'O aplicativo de vídeos (como Netflix ou YouTube).' },
    { description: 'Digitar um relatório do escritório.', icon: 'assets/images/professions/cenario_relatorio.jpg', type: 'TRABALHO', feedback: 'A tecnologia é essencial para organizar informações.', hardwareDesc: 'O teclado físico e o mouse do Notebook.', softwareDesc: 'O editor de textos (como o Word ou Google Docs).' },
    { description: 'Jogar online com os amigos.', icon: 'assets/images/professions/cenario_jogar.jpg', type: 'LAZER', feedback: 'A diversão conectada depende da tecnologia!', hardwareDesc: 'O console do videogame e os botões do controle.', softwareDesc: 'O código do jogo digital que cria o mundo virtual.' },
    { description: 'Programar um aplicativo novo.', icon: 'assets/images/professions/cenario_programar.jpg', type: 'TRABALHO', feedback: 'Criar novas tecnologias é uma profissão muito importante!', hardwareDesc: 'Os servidores, os monitores e o computador.', softwareDesc: 'A linguagem de código que diz para a máquina o que fazer.' },
    { description: 'Ouvir músicas no fone de ouvido enquanto descansa.', icon: 'assets/images/professions/cenario_musica.jpg', type: 'LAZER', feedback: 'A música digital viaja pelo ar até o seu fone.', hardwareDesc: 'O fone de ouvido sem fio (Bluetooth) e o celular.', softwareDesc: 'O aplicativo de música (como o Spotify) que toca o som.' },
    { description: 'Fazer uma videochamada de reunião com o chefe.', icon: 'assets/images/professions/cenario_videochamada.jpg', type: 'TRABALHO', feedback: 'A tecnologia conecta profissionais do mundo inteiro.', hardwareDesc: 'A câmera (webcam) e o microfone do notebook.', softwareDesc: 'O programa de reuniões online (como o Google Meet).' },
    { description: 'Ler um livro digital (e-book) de aventuras na cama.', icon: 'assets/images/professions/cenario_ebook.jpg', type: 'LAZER', feedback: 'Milhares de livros podem caber em um único aparelho!', hardwareDesc: 'O leitor digital (como o Kindle) e sua tela.', softwareDesc: 'O sistema que guarda as páginas virtuais do livro.' },
    { description: 'Controlar o estoque de roupas de uma loja.', icon: 'assets/images/professions/cenario_estoque.jpg', type: 'TRABALHO', feedback: 'A tecnologia evita que as lojas percam produtos.', hardwareDesc: 'O tablet que o vendedor segura na mão.', softwareDesc: 'O aplicativo que anota quantas blusas ainda têm para vender.' },
    { description: 'Brincar de fazer um desenho digital colorido.', icon: 'assets/images/professions/cenario_desenho.jpg', type: 'LAZER', feedback: 'A arte digital não precisa de papel ou tinta de verdade.', hardwareDesc: 'O tablet e a caneta especial de toque.', softwareDesc: 'O aplicativo de pintura com pincéis virtuais.' },
    { description: 'Motorista de aplicativo levando passageiros.', icon: 'assets/images/professions/cenario_motorista.jpg', type: 'TRABALHO', feedback: 'O GPS mudou a forma como as pessoas viajam pela cidade.', hardwareDesc: 'O suporte e o celular no painel do carro.', softwareDesc: 'O aplicativo de mapas e corridas (como Uber ou Waze).' },
    // Novos cenários com categoria ESTUDO
    { description: 'Assistir uma videoaula de matemática no tablet.', icon: '📐', type: 'ESTUDO', feedback: 'Estudar com vídeos ajuda a entender melhor a matéria!', hardwareDesc: 'O tablet e seus alto-falantes.', softwareDesc: 'A plataforma de videoaulas (como Khan Academy).' },
    { description: 'Pesquisar no Google para um trabalho de ciências.', icon: '🔍', type: 'ESTUDO', feedback: 'A internet é uma biblioteca gigante para pesquisas!', hardwareDesc: 'O computador e o teclado.', softwareDesc: 'O navegador de internet e o buscador Google.' },
    { description: 'Usar um aplicativo para aprender inglês.', icon: '🌍', type: 'ESTUDO', feedback: 'Apps de idiomas transformam o celular em uma sala de aula!', hardwareDesc: 'O celular e o fone de ouvido.', softwareDesc: 'O aplicativo de idiomas (como o Duolingo).' },
    { description: 'Fazer um simulado online para a prova.', icon: '📝', type: 'ESTUDO', feedback: 'Simulados online ajudam a se preparar para avaliações!', hardwareDesc: 'O notebook e o mouse.', softwareDesc: 'A plataforma de simulados com timer e gabarito automático.' },
    { description: 'Assistir a uma live de um cientista explicando vulcões.', icon: '🌋', type: 'ESTUDO', feedback: 'Lives educativas conectam estudantes a especialistas do mundo todo!', hardwareDesc: 'O celular ou computador com câmera.', softwareDesc: 'A plataforma de streaming ao vivo (como YouTube Live).' },
    // Cenários ambíguos para gerar reflexão
    { description: 'Assistir um documentário sobre animais no Netflix.', icon: '🦁', type: 'LAZER', feedback: 'Apesar de ser educativo, se você assiste por diversão, é Lazer! Se fosse para um trabalho escolar, aí seria Estudo.', hardwareDesc: 'A Smart TV ou o tablet.', softwareDesc: 'O aplicativo Netflix com seu catálogo de filmes.' },
    { description: 'Gravar um TikTok ensinando uma receita.', icon: '📱', type: 'LAZER', feedback: 'Criar conteúdo divertido para redes sociais é Lazer, mesmo que alguém aprenda algo!', hardwareDesc: 'O celular com câmera frontal.', softwareDesc: 'O aplicativo TikTok com editor de vídeo integrado.' },
  ];

  // ═══════════════════════════════════════════════════════════════
  //  DADOS DA MISSÃO 4: DRAG & DROP
  // ═══════════════════════════════════════════════════════════════
  phase3Data: Phase3Item[][] = [
    // Rodada 1: 9 itens fáceis
    [
      { id: '1', name: 'Planilha Financeira', icon: '📊', category: 'TRABALHO' },
      { id: '2', name: 'Editor de Código', icon: '💻', category: 'TRABALHO' },
      { id: '3', name: 'Email Profissional', icon: '✉️', category: 'TRABALHO' },
      { id: '6', name: 'Videoaula', icon: '📐', category: 'ESTUDO' },
      { id: '7', name: 'Resumo Acadêmico', icon: '📄', category: 'ESTUDO' },
      { id: '9', name: 'Simulado Online', icon: '📝', category: 'ESTUDO' },
      { id: '11', name: 'Série Animada', icon: '📺', category: 'LAZER' },
      { id: '12', name: 'Jogo de Aventura', icon: '🎮', category: 'LAZER' },
      { id: '14', name: 'Música Relaxante', icon: '🎧', category: 'LAZER' },
    ],
    // Rodada 2: 12 itens médios
    [
      { id: '16', name: 'App de Vendas', icon: '📈', category: 'TRABALHO' },
      { id: '17', name: 'App de Motorista', icon: '🚗', category: 'TRABALHO' },
      { id: '18', name: 'Edição de Vídeo', icon: '🎬', category: 'TRABALHO' },
      { id: '20', name: 'Sistema de Caixa', icon: '🛒', category: 'TRABALHO' },
      { id: '21', name: 'Livro Didático', icon: '📚', category: 'ESTUDO' },
      { id: '23', name: 'Curso de Idiomas', icon: '🌍', category: 'ESTUDO' },
      { id: '24', name: 'Calculadora', icon: '🧮', category: 'ESTUDO' },
      { id: '25', name: 'Mapa Mental', icon: '🧠', category: 'ESTUDO' },
      { id: '26', name: 'Vlog de Viagem', icon: '✈️', category: 'LAZER' },
      { id: '27', name: 'Futebol Online', icon: '⚽', category: 'LAZER' },
      { id: '29', name: 'Vídeos Engraçados', icon: '😂', category: 'LAZER' },
      { id: '30', name: 'Live de Jogos', icon: '🔴', category: 'LAZER' },
    ],
    // Rodada 3: 15 itens difíceis
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

  // Barra de energia (Missão 3)
  energyBlocks = 0;
  totalEnergyBlocks = 0;

  constructor(private progressReporter: ProgressReporter) {}

  // ═══════════════════════════════════════════════════════════════
  //  LIFECYCLE
  // ═══════════════════════════════════════════════════════════════
  ngOnInit() {
    if (sessionStorage.getItem('isDemoMode') === 'true') {
      this.professions = this.professions.slice(0, 2);
      this.softwareTasks = this.softwareTasks.slice(0, 2);
      this.scenarios = this.scenarios.slice(0, 3);
      this.phase3Data = [this.phase3Data[0]];
      this.hwSwChallenges = this.hwSwChallenges.slice(0, 1);
    }
    this.totalEnergyBlocks = this.scenarios.length;
    this.restoreProgress();
  }

  get currentMission(): AcademyMission {
    return this.missions[this.currentMissionIndex];
  }

  get currentDialogue(): Dialogue | null {
    if (this.displayMode === 'briefing') {
      return this.currentMission.briefing[this.currentDialogueIndex] || null;
    }
    if (this.displayMode === 'mission-complete') {
      return this.currentMission.debriefing[this.currentDialogueIndex] || null;
    }
    return null;
  }

  get progressPercent(): number {
    const totalStages = this.getTotalStages();
    const current = this.getAbsoluteStage();
    return totalStages > 0 ? Math.round((current / totalStages) * 100) : 0;
  }

  private getTotalStages(): number {
    return this.professions.length + this.hwSwChallenges.length
         + this.softwareTasks.length
         + this.scenarios.length
         + this.phase3Data.length;
  }

  // ═══════════════════════════════════════════════════════════════
  //  ESTÁGIO ABSOLUTO (Para telemetria)
  // ═══════════════════════════════════════════════════════════════
  private getAbsoluteStage(): number {
    const m1 = this.professions.length + this.hwSwChallenges.length;
    const m2 = this.softwareTasks.length;
    const m3 = this.scenarios.length;
    switch (this.currentMissionIndex) {
      case 0: return this.currentTaskIndex;
      case 1: return m1 + this.currentTaskIndex;
      case 2: return m1 + m2 + this.currentTaskIndex;
      case 3: return m1 + m2 + m3 + (this.phase3Level - 1);
      default: return 0;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  RESTORE PROGRESS
  // ═══════════════════════════════════════════════════════════════
  private restoreProgress() {
    const saved = sessionStorage.getItem('currentStage');
    if (saved) {
      const stage = parseInt(saved, 10);
      if (!isNaN(stage) && stage > 0) {
        const m1Total = this.professions.length + this.hwSwChallenges.length;
        const m2Total = this.softwareTasks.length;
        const m3Total = this.scenarios.length;
        const m4Total = this.phase3Data.length;

        if (stage >= m1Total + m2Total + m3Total + m4Total) {
          this.gameFinished = true;
          this.displayMode = 'finished';
          return;
        } else if (stage >= m1Total + m2Total + m3Total) {
          this.currentMissionIndex = 3;
          this.phase3Level = stage - (m1Total + m2Total + m3Total) + 1;
          this.loadPhase3();
          this.displayMode = 'gameplay';
        } else if (stage >= m1Total + m2Total) {
          this.currentMissionIndex = 2;
          this.currentTaskIndex = stage - (m1Total + m2Total);
          this.energyBlocks = this.currentTaskIndex;
          this.displayMode = 'gameplay';
        } else if (stage >= m1Total) {
          this.currentMissionIndex = 1;
          this.currentTaskIndex = stage - m1Total;
          this.loadSoftwareTask();
          this.displayMode = 'gameplay';
        } else {
          this.currentMissionIndex = 0;
          this.currentTaskIndex = stage;
          this.loadCurrentMission1Task();
          this.displayMode = 'gameplay';
        }
      } else {
        this.displayMode = 'briefing';
        this.currentDialogueIndex = 0;
      }
    } else {
      this.displayMode = 'briefing';
      this.currentDialogueIndex = 0;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  BRIEFING / DIALOGUE NAVIGATION
  // ═══════════════════════════════════════════════════════════════
  advanceDialogue() {
    if (this.displayMode === 'briefing') {
      if (this.currentDialogueIndex < this.currentMission.briefing.length - 1) {
        this.currentDialogueIndex++;
      } else {
        this.currentDialogueIndex = 0;
        this.displayMode = 'gameplay';
        this.startMission();
      }
    } else if (this.displayMode === 'mission-complete') {
      if (this.currentDialogueIndex < this.currentMission.debriefing.length - 1) {
        this.currentDialogueIndex++;
      } else {
        this.currentDialogueIndex = 0;
        this.currentMissionIndex++;
        this.currentTaskIndex = 0;
        if (this.currentMissionIndex >= this.missions.length) {
          this.gameFinished = true;
          this.displayMode = 'finished';
        } else {
          this.displayMode = 'briefing';
        }
      }
    }
  }

  private startMission() {
    this.isHwSwChallenge = false;
    this.hwSwChallengeIndex = 0;
    switch (this.currentMission.type) {
      case 'tool-match':
        this.currentTaskIndex = 0;
        this.loadCurrentMission1Task();
        break;
      case 'software-identify':
        this.currentTaskIndex = 0;
        this.loadSoftwareTask();
        break;
      case 'category-sort':
        this.currentTaskIndex = 0;
        this.energyBlocks = 0;
        break;
      case 'drag-drop':
        this.phase3Level = 1;
        this.loadPhase3();
        break;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  MISSÃO 1: TOOL MATCH + HW/SW CHALLENGES
  // ═══════════════════════════════════════════════════════════════
  private loadCurrentMission1Task() {
    if (this.currentTaskIndex < this.professions.length) {
      this.isHwSwChallenge = false;
      this.loadProfession();
    }
  }

  loadProfession() {
    const prof = this.professions[this.currentTaskIndex];
    this.currentOptions = [prof.correctTool, ...prof.wrongTools].sort(() => Math.random() - 0.5);
  }

  checkTool(tool: Tool) {
    const prof = this.professions[this.currentTaskIndex];
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

  checkHwSw(answer: 'HARDWARE' | 'SOFTWARE') {
    const challenge = this.currentHwSwChallenge!;
    if (answer === challenge.answer) {
      this.isCorrectGuess = true;
      this.feedbackText = challenge.explanation;
      this.feedbackHardware = '';
      this.feedbackSoftware = '';
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = `Não é bem assim... A resposta correta é ${challenge.answer}. ${challenge.explanation}`;
      this.feedbackHardware = '';
      this.feedbackSoftware = '';
    }
    this.showFeedbackModal = true;
  }

  // ═══════════════════════════════════════════════════════════════
  //  MISSÃO 2: SOFTWARE IDENTIFY
  // ═══════════════════════════════════════════════════════════════
  loadSoftwareTask() {
    if (this.currentTaskIndex < this.softwareTasks.length) {
      const task = this.softwareTasks[this.currentTaskIndex];
      this.currentSoftwareOptions = [task.correctAnswer, ...task.wrongAnswers].sort(() => Math.random() - 0.5);
    }
  }

  checkSoftwareAnswer(answer: string) {
    const task = this.softwareTasks[this.currentTaskIndex];
    if (answer === task.correctAnswer) {
      this.isCorrectGuess = true;
      this.feedbackText = task.explanation;
      this.feedbackHardware = '';
      this.feedbackSoftware = '';
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = `Essa não é a resposta certa. Pense no que a ${task.professionName} faz no dia a dia...`;
      this.feedbackHardware = '';
      this.feedbackSoftware = '';
    }
    this.showFeedbackModal = true;
  }

  // ═══════════════════════════════════════════════════════════════
  //  MISSÃO 3: CATEGORY SORT (TRABALHO/ESTUDO/LAZER)
  // ═══════════════════════════════════════════════════════════════
  checkScenario(answer: 'TRABALHO' | 'ESTUDO' | 'LAZER') {
    const scenario = this.scenarios[this.currentTaskIndex];
    if (scenario.type === answer) {
      this.isCorrectGuess = true;
      this.feedbackText = scenario.feedback;
      this.feedbackHardware = scenario.hardwareDesc;
      this.feedbackSoftware = scenario.softwareDesc;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = `Na verdade, essa atividade é um momento de ${scenario.type === 'TRABALHO' ? 'Trabalho 💼' : scenario.type === 'ESTUDO' ? 'Estudo 📚' : 'Lazer 🎮'}.`;
      this.feedbackHardware = '';
      this.feedbackSoftware = '';
    }
    this.showFeedbackModal = true;
  }

  // ═══════════════════════════════════════════════════════════════
  //  MISSÃO 4: DRAG & DROP
  // ═══════════════════════════════════════════════════════════════
  loadPhase3() {
    this.workColumn = [];
    this.studyColumn = [];
    this.leisureColumn = [];
    this.showDragError = false;
    const lvl = Math.min(this.phase3Level, this.phase3Data.length);
    this.unassignedItems = [...this.phase3Data[lvl - 1]].sort(() => Math.random() - 0.5);
  }

  drop(event: CdkDragDrop<Phase3Item[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  checkPhase3Answers() {
    if (this.unassignedItems.length > 0) return;
    let hasError = false;
    this.workColumn.forEach(item => { if (item.category !== 'TRABALHO') hasError = true; });
    this.studyColumn.forEach(item => { if (item.category !== 'ESTUDO') hasError = true; });
    this.leisureColumn.forEach(item => { if (item.category !== 'LAZER') hasError = true; });

    if (hasError) {
      this.showDragError = true;
      this.progressReporter.report({
        levelId: `professions-${this.getAbsoluteStage()}`,
        fase: this.getAbsoluteStage(),
        result: 'failure', attempts: 0,
        timestamp: new Date().toISOString(), isLastLevel: false
      });
      return;
    }

    this.showDragError = false;
    const isLast = this.phase3Level >= this.phase3Data.length;
    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success', attempts: 0,
      timestamp: new Date().toISOString(), isLastLevel: isLast
    });

    if (!isLast) {
      this.phase3Level++;
      this.loadPhase3();
    } else {
      this.currentDialogueIndex = 0;
      this.displayMode = 'mission-complete';
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  NEXT STEP (Unified flow after feedback modal)
  // ═══════════════════════════════════════════════════════════════
  nextStep() {
    this.showFeedbackModal = false;

    if (!this.isCorrectGuess) {
      this.progressReporter.report({
        levelId: `professions-${this.getAbsoluteStage()}`,
        fase: this.getAbsoluteStage(),
        result: 'failure', attempts: 0,
        timestamp: new Date().toISOString(), isLastLevel: false
      });
      return;
    }

    // Sucesso — avançar
    const missionType = this.currentMission.type;

    if (missionType === 'tool-match') {
      this.advanceMission1();
    } else if (missionType === 'software-identify') {
      this.advanceMission2();
    } else if (missionType === 'category-sort') {
      this.advanceMission3();
    }
  }

  private advanceMission1() {
    // Intercalar desafios HW/SW após profissões 3, 6 e 9
    const justFinishedProfIndex = this.currentTaskIndex;

    // Reportar sucesso
    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success', attempts: 0,
      timestamp: new Date().toISOString(), isLastLevel: false
    });

    if (this.isHwSwChallenge) {
      // Acabou um desafio HW/SW, voltar para profissão
      this.hwSwChallengeIndex++;
      this.isHwSwChallenge = false;
      this.currentTaskIndex++;
      if (this.currentTaskIndex >= this.professions.length) {
        // Missão 1 completa
        this.currentDialogueIndex = 0;
        this.displayMode = 'mission-complete';
      } else {
        this.loadProfession();
      }
    } else {
      this.currentTaskIndex++;
      // Check se é hora de um desafio HW/SW (após cada 3 profissões)
      if (this.currentTaskIndex % 3 === 0 && this.hwSwChallengeIndex < this.hwSwChallenges.length && this.currentTaskIndex < this.professions.length) {
        this.isHwSwChallenge = true;
        this.currentHwSwChallenge = this.hwSwChallenges[this.hwSwChallengeIndex];
      } else if (this.currentTaskIndex >= this.professions.length) {
        // Missão 1 completa
        this.currentDialogueIndex = 0;
        this.displayMode = 'mission-complete';
      } else {
        this.loadProfession();
      }
    }
  }

  private advanceMission2() {
    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success', attempts: 0,
      timestamp: new Date().toISOString(), isLastLevel: false
    });

    this.currentTaskIndex++;
    if (this.currentTaskIndex >= this.softwareTasks.length) {
      this.currentDialogueIndex = 0;
      this.displayMode = 'mission-complete';
    } else {
      this.loadSoftwareTask();
    }
  }

  private advanceMission3() {
    this.energyBlocks++;
    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success', attempts: 0,
      timestamp: new Date().toISOString(), isLastLevel: false
    });

    this.currentTaskIndex++;
    if (this.currentTaskIndex >= this.scenarios.length) {
      this.currentDialogueIndex = 0;
      this.displayMode = 'mission-complete';
    }
  }
}