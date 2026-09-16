import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

interface NewsPartTask {
  id: string; // 'url', 'headline', 'author', 'date', 'image', 'body'
  instruction: string;
  feedback: string;
}

interface FactCheckTask {
  suspiciousNews: string;
  sourceType: string; // Ex: 'Mensagem de WhatsApp', 'Site Desconhecido'
  reliableSearch: string; // O que o buscador mostrou após investigar
  isFact: boolean;
  feedback: string;
}

@Component({
  selector: 'app-fact-checker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fact-checker.component.html',
  styleUrl: './fact-checker.component.scss'
})
export class FactCheckerComponent implements OnInit {
  
  // FASE 1: Identificar as Pistas (Anatomia da Notícia)
  newsTasks: NewsPartTask[] = [
    { id: 'url', instruction: 'Fase 1: Encontre e toque no ENDEREÇO DO SITE (URL). É a primeira coisa a olhar para ver se o site é conhecido.', feedback: 'Isso! Sites que terminam com nomes estranhos ou erros de português na URL costumam ser falsos.' },
    { id: 'headline', instruction: 'Fase 2: Toque na MANCHETE (Título Grande).', feedback: 'Muito bem! Manchetes muito exageradas, com MUITAS LETRAS MAIÚSCULAS e pontos de exclamação (!!!) servem para nos assustar e clicar rápido sem pensar.' },
    { id: 'date', instruction: 'Fase 3: Essa notícia é de hoje ou do ano passado? Toque na DATA DE PUBLICAÇÃO.', feedback: 'Excelente! Muitas vezes as pessoas compartilham notícias verdadeiras, mas que aconteceram há 5 anos atrás, fora de contexto.' },
    { id: 'author', instruction: 'Fase 4: Quem escreveu isso? Toque no NOME DO AUTOR (Jornalista).', feedback: 'Perfeito! Notícias confiáveis sempre mostram quem é o jornalista responsável. Se não tem autor, desconfie!' },
    { id: 'image', instruction: 'Fase 5: Toque na FOTOGRAFIA da notícia.', feedback: 'Ótimo! Às vezes a foto é verdadeira, mas foi tirada em outro país e usada para inventar uma mentira aqui.' },
    
    // Repete os conceitos para fixar, com instruções um pouco diferentes
    { id: 'url', instruction: 'Fase 6: Onde vemos se o site tem um cadeado de segurança e o nome oficial?', feedback: 'Exato! A barra de endereço é a identidade do site.' },
    { id: 'author', instruction: 'Fase 7: Encontre a assinatura de quem se responsabiliza pelo texto.', feedback: 'Boa! Assinaturas dão credibilidade à informação.' },
    { id: 'date', instruction: 'Fase 8: Onde você clica para ver se essa informação não está desatualizada?', feedback: 'Isso aí! Ficar de olho na data evita confusão.' },
    { id: 'headline', instruction: 'Fase 9: Qual parte foi feita com letras gigantes só para chamar sua atenção?', feedback: 'Muito bem. O título é feito para chamar atenção, mas não conta a história toda.' },
    { id: 'body', instruction: 'Fase 10: Toque no CORPO DO TEXTO (a notícia inteira).', feedback: 'Perfeito! Nunca leia só o título. Para saber a verdade, precisamos ler o texto até o final.' }
  ];

  // FASE 2: Checagem de Fatos (Fato ou Fake)
  factCheckTasks: FactCheckTask[] = [
    {
      suspiciousNews: 'Tubarão gigante de 15 metros foi visto na praia ontem à tarde. Proibido entrar na água!',
      sourceType: 'Mensagem encaminhada no grupo da família',
      reliableSearch: 'Instituto do Meio Ambiente e biólogos confirmam que era apenas um golfinho saltando perto da costa. Nenhuma proibição foi feita.',
      isFact: false,
      feedback: 'FAKE! Mensagens alarmistas no WhatsApp sem links oficiais costumam ser falsas para gerar pânico.'
    },
    {
      suspiciousNews: 'Prefeitura vai distribuir sorvete grátis de chocolate para todos os alunos nas escolas amanhã.',
      sourceType: 'Postagem sem autor no Facebook',
      reliableSearch: 'Nenhum site oficial da prefeitura ou da secretaria de educação publicou esta informação.',
      isFact: false,
      feedback: 'FAKE! Sempre desconfie de promoções e coisas grátis fáceis demais. Verifique nos sites oficiais.'
    },
    {
      suspiciousNews: 'Santa Catarina tem aumento no número de pinguins que aparecem nas praias durante o inverno.',
      sourceType: 'Site de Notícias Conhecido',
      reliableSearch: 'Projeto de Monitoramento de Praias registrou 30% a mais de pinguins resgatados nas praias de SC este ano.',
      isFact: true,
      feedback: 'FATO! Animais marinhos realmente seguem correntes de água fria no inverno. A informação foi confirmada por biólogos.'
    },
    {
      suspiciousNews: 'O WhatsApp vai ser pago a partir de amanhã! Repasse essa mensagem para 10 pessoas para o seu ficar azul e continuar grátis.',
      sourceType: 'Mensagem encaminhada muitas vezes',
      reliableSearch: 'A empresa dona do aplicativo confirmou que o serviço continua gratuito. Mensagens de repasse são sempre falsas.',
      isFact: false,
      feedback: 'FAKE! Um clássico das notícias falsas. Nenhuma empresa avisa mudanças sérias pedindo para repassar mensagens.'
    },
    {
      suspiciousNews: 'Receber mensagens de números desconhecidos oferecendo empregos onde você ganha muito dinheiro rápido é golpe.',
      sourceType: 'Site de Segurança Digital',
      reliableSearch: 'A Polícia Civil alerta para o aumento de fraudes na internet usando falsas promessas de dinheiro fácil.',
      isFact: true,
      feedback: 'FATO! Dinheiro fácil não existe. Isso é uma armadilha de criminosos na internet.'
    },
    {
      suspiciousNews: 'Beber água gelada com limão mata todos os vírus e cura qualquer gripe em menos de 1 hora!',
      sourceType: 'Vídeo amador no YouTube',
      reliableSearch: 'Médicos e o Ministério da Saúde afirmam que limão tem vitamina C e ajuda na imunidade, mas não cura gripe sozinho, muito menos em 1 hora.',
      isFact: false,
      feedback: 'FAKE! Dicas milagrosas de saúde são perigosas. Confie sempre em médicos e na ciência.'
    },
    {
      suspiciousNews: 'A Terra tem formato arredondado, parecido com uma esfera achatada nos polos.',
      sourceType: 'Livro Escolar e Site da NASA',
      reliableSearch: 'Todas as imagens de satélites e estudos científicos de astrônomos do mundo inteiro confirmam o formato do planeta.',
      isFact: true,
      feedback: 'FATO! A ciência e as fotos espaciais comprovam isso há muitas décadas.'
    },
    {
      suspiciousNews: 'Novo parque de diversões gigante com 50 montanhas-russas será construído na nossa cidade na semana que vem.',
      sourceType: 'Blog "Notícias Chocantes"',
      reliableSearch: 'O blog foi criado ontem. Não há registros na prefeitura de nenhuma obra desse tamanho aprovada para a cidade.',
      isFact: false,
      feedback: 'FAKE! Uma obra gigantesca dessas leva anos de planejamento e estaria em todos os jornais confiáveis, não apenas num blog obscuro.'
    },
    {
      suspiciousNews: 'Jogar videogame por muitas horas sem piscar pode causar ressecamento nos olhos dos alunos.',
      sourceType: 'Revista de Saúde Ocular',
      reliableSearch: 'Oftalmologistas recomendam fazer pausas a cada 20 minutos de tela para piscar e evitar o cansaço visual.',
      isFact: true,
      feedback: 'FATO! É importante cuidar da saúde dos olhos quando usamos as tecnologias.'
    },
    {
      suspiciousNews: 'Se você colocar o celular no micro-ondas por 5 segundos, a bateria carrega 100% imediatamente.',
      sourceType: 'Desafio do TikTok',
      reliableSearch: 'Fabricantes alertam: celulares contêm metal e baterias que EXPLODEM se colocados no micro-ondas. Risco de incêndio grave.',
      isFact: false,
      feedback: 'FAKE EXTREMAMENTE PERIGOSO! Desafios de internet podem ser mortais. O celular só carrega na tomada com o carregador correto.'
    }
  ];

  gameStage: 1 | 2 = 1;
  currentTaskIndex: number = 0;
  
  // Controle da Fase 2
  hasSearched: boolean = false; 

  showFeedbackModal: boolean = false;
  feedbackText: string = '';
  isCorrectGuess: boolean = false;
  gameFinished: boolean = false;

  constructor(private progressReporter: ProgressReporter) {}

  ngOnInit() {
    if (sessionStorage.getItem("isDemoMode") === "true") { this.newsTasks = this.newsTasks.slice(0, 2); this.factCheckTasks = []; }
    this.restoreProgress();
  }

  private restoreProgress() {
    const saved = sessionStorage.getItem('currentStage');
    if (saved) {
      const stage = parseInt(saved, 10);
      if (!isNaN(stage) && stage > 0) {
        const phase1Total = this.newsTasks.length;
        if (stage >= phase1Total + this.factCheckTasks.length) {
          this.gameFinished = true;
        } else if (stage >= phase1Total) {
          this.gameStage = 2;
          this.currentTaskIndex = stage - phase1Total;
        } else {
          this.gameStage = 1;
          this.currentTaskIndex = stage;
        }
      }
    }
  }

  private getAbsoluteStage(): number {
    return this.gameStage === 1
      ? this.currentTaskIndex
      : this.newsTasks.length + this.currentTaskIndex;
  }

  // --- LÓGICA FASE 1 (PARTES DA NOTÍCIA) ---
  checkNewsPart(partId: string) {
    if (this.gameStage !== 1) return;
    
    const task = this.newsTasks[this.currentTaskIndex];
    if (partId === task.id) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ainda não é essa parte! Use sua lupa de detetive e leia com atenção a dica lá em cima.';
      this.showFeedbackModal = true;
    }
  }

  // --- LÓGICA FASE 2 (FATO OU FAKE) ---
  performSearch() {
    this.hasSearched = true;
  }

  voteFactOrFake(vote: boolean) {
    const task = this.factCheckTasks[this.currentTaskIndex];
    
    if (vote === task.isFact) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ops, detetive! Você foi enganado por essa informação. Leia novamente o que o buscador seguro (Google) disse.';
      this.showFeedbackModal = true;
    }
  }

  // --- NAVEGAÇÃO GERAL ---
  nextStep() {
    this.showFeedbackModal = false;

    if (!this.isCorrectGuess) {
      this.progressReporter.report({
        levelId: `fact-checker-${this.getAbsoluteStage()}`,
        fase: this.getAbsoluteStage(),
        result: 'failure',
        attempts: 0,
        timestamp: new Date().toISOString(),
        isLastLevel: false
      });
      return;
    }

    this.currentTaskIndex++;
    this.hasSearched = false;
    const phase1Total = this.newsTasks.length;
    let isFinished = false;

    if (this.gameStage === 1 && this.currentTaskIndex >= phase1Total) {
      this.gameStage = 2;
      this.currentTaskIndex = 0;
    } else if (this.gameStage === 2 && this.currentTaskIndex >= this.factCheckTasks.length) {
      this.gameFinished = true;
      isFinished = true;
    }

    this.progressReporter.report({
      levelId: `fact-checker-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success',
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: isFinished
    });
  }
}