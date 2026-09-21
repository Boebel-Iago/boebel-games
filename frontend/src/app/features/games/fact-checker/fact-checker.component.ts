import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';
import { DetectiveCase, AnatomyStage, PhishingStage, FactCheckStage } from './models';

@Component({
  selector: 'app-fact-checker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fact-checker.component.html',
  styleUrl: './fact-checker.component.scss'
})
export class FactCheckerComponent implements OnInit {
  
  cases: DetectiveCase[] = [
    {
      id: 'case_1',
      title: 'Arquivo 1: O Recruta',
      type: 'anatomy',
      briefing: [
        { speaker: 'Lupa', text: 'Olá, recruta! Bem-vindo à Agência de Detetives Digitais. Eu sou o Inspetor Lupa.' },
        { speaker: 'Lupa', text: 'Antes de te dar um distintivo real, preciso testar seus olhos. Muitas mentiras na internet se escondem bem na nossa cara.' },
        { speaker: 'Lupa', text: 'Vou te mostrar uma página de notícias. Quero que você identifique cada parte importante que eu pedir. Preparado?' }
      ],
      stages: [
        { id: 'url', instruction: 'Toque no ENDEREÇO DO SITE (URL). É a primeira coisa a olhar para ver se o site é conhecido.', feedback: 'Isso! Sites que terminam com nomes estranhos ou erros de português na URL costumam ser falsos.' },
        { id: 'headline', instruction: 'Agora encontre a MANCHETE. É o título gigante feito para chamar nossa atenção.', feedback: 'Muito bem! Cuidado com manchetes que usam muitas letras MAIÚSCULAS ou exclamações exageradas.' },
        { id: 'author', instruction: 'Quem escreveu isso? Encontre o NOME DO AUTOR (jornalista).', feedback: 'Perfeito! Se a notícia não tem nome de autor ou tem um nome muito esquisito, desconfie!' },
        { id: 'date', instruction: 'Quando isso aconteceu? Toque na DATA DE PUBLICAÇÃO.', feedback: 'Isso aí! Muitas "notícias falsas" são, na verdade, notícias velhas de 10 anos atrás sendo repostadas.' },
        { id: 'image', instruction: 'Encontre a FOTOGRAFIA principal da notícia.', feedback: 'Ótimo! Às vezes a foto não tem nada a ver com o texto. Detetives sempre checam as imagens.' },
        { id: 'body', instruction: 'Por fim, toque no CORPO DA NOTÍCIA (o texto longo).', feedback: 'Excelente! Nunca leia apenas o título. O texto longo quase sempre desmente a manchete chamativa.' }
      ]
    },
    {
      id: 'case_2',
      title: 'Arquivo 2: O Roubo dos Diamantes',
      type: 'phishing',
      briefing: [
        { speaker: 'Lupa', text: 'Excelente trabalho no treinamento, Agente. Agora o caso é sério.' },
        { speaker: 'Lupa', text: 'Muitas crianças da escola estão relatando que perderam suas contas de jogos e redes sociais.' },
        { speaker: 'Lupa', text: 'Acreditamos ser obra de golpistas disparando mensagens falsas. Seu trabalho é analisar as mensagens interceptadas e decidir se são GOLPE (Phishing) ou SEGURAS.' }
      ],
      stages: [
        { suspiciousText: 'URGENTE! Você ganhou 10.000 diamantes no Free Fire! Clique NESTE LINK agora antes que acabe: http://freefire-gratis.xb2.net', clues: ['Urgência', 'Link Estranho', 'Promessa Irreal'], isPhishing: true, feedback: 'FATO! Golpistas usam senso de urgência ("clique agora") e promessas irreais para roubar contas.' },
        { suspiciousText: 'Olá! Somos do Suporte Técnico. Detectamos invasão na sua conta. Mande sua senha imediatamente para bloquearmos o invasor.', clues: ['Pedido de Senha'], isPhishing: true, feedback: 'FATO! NENHUM suporte técnico real pede a sua senha por mensagem. É golpe na certa.' },
        { suspiciousText: 'Lembrete Escolar: A feira de ciências acontecerá amanhã às 14h no pátio. Tragam seus materiais. - Diretora Marta', clues: ['Sem Links', 'Informação Normal'], isPhishing: false, feedback: 'SEGURO! Mensagens informativas de pessoas conhecidas, sem links perigosos e sem pedir dados, são seguras.' },
        { suspiciousText: 'PROMOÇÃO DE IPHONE! Apenas R$ 150,00! Últimas unidades! Faça o PIX na chave aleatória abaixo agora!', clues: ['Preço Absurdo', 'Urgência', 'Pagamento Rápido'], isPhishing: true, feedback: 'FATO! Se o preço é bom demais para ser verdade, provavelmente é mentira.' },
        { suspiciousText: 'Seu computador está infectado com 27 vírus! Baixe o Antivírus SuperLimpeza2000 clicando aqui para limpar agora!', clues: ['Ameaça', 'Link de Download'], isPhishing: true, feedback: 'FATO! Navegadores não conseguem escanear o seu computador sozinhos. Essa é a isca clássica para baixar um vírus de verdade.' }
      ]
    },
    {
      id: 'case_3',
      title: 'Arquivo 3: Invasão em Santa Catarina',
      type: 'cross_check',
      briefing: [
        { speaker: 'Lupa', text: 'Você está indo muito rápido! Mas agora as coisas complicam.' },
        { speaker: 'Lupa', text: 'Estão espalhando que seres alienígenas pousaram em Santa Catarina. Causou pânico generalizado!' },
        { speaker: 'Lupa', text: 'Como Detetive Digital, você nunca confia em uma fonte só. Você deve ler a notícia bizarra, abrir o buscador seguro da Agência, e checar se outras fontes confiáveis dizem a mesma coisa.' }
      ],
      stages: [
        { suspiciousNews: 'URGENTE: Disco Voador com luzes verdes cai em praia de Florianópolis nesta madrugada!', sourceType: 'Blog do ET Caçador', reliableSearch: 'Polícia Militar e Meteorologistas confirmam: moradores avistaram lixo espacial reentrando na atmosfera (luz verde) caindo no mar. Nenhum disco voador foi encontrado.', isFact: false, feedback: 'FAKE! Era apenas lixo espacial queimando na atmosfera. O blog sensacionalista inventou o disco voador.' },
        { suspiciousNews: 'Vídeo mostra pinguins caminhando na areia da praia em Santa Catarina neste inverno.', sourceType: 'Post no Instagram', reliableSearch: 'Biólogos e Institutos de Meio Ambiente confirmam que correntes marítimas trazem pinguins da Patagônia para a costa sul do Brasil todo inverno.', isFact: true, feedback: 'FATO! Isso acontece todos os anos, é um fenômeno natural. Ao checar em fontes de biologia, confirmamos a verdade.' },
        { suspiciousNews: 'Prefeito proíbe a venda de sorvetes e doces em toda a cidade para forçar as crianças a comerem legumes.', sourceType: 'Corrente de WhatsApp', reliableSearch: 'Sites oficiais do governo municipal não publicaram nenhuma lei sobre isso. Jornal local afirma que a notícia é brincadeira que viralizou.', isFact: false, feedback: 'FAKE! Ao buscar em sites da prefeitura (fontes oficiais), vemos que nada disso existe.' },
        { suspiciousNews: 'Estudos mostram que ficar 24h sem dormir para jogar videogame destrói partes do cérebro de crianças.', sourceType: 'Revista de Saúde', reliableSearch: 'Neurologistas alertam que a privação de sono afeta a memória, o humor e o desenvolvimento cerebral infantil gravemente.', isFact: true, feedback: 'FATO! Privação extrema de sono é realmente danosa, e especialistas médicos comprovam isso.' },
        { suspiciousNews: 'Cientistas encontram esqueleto de gigante de 10 metros em escavação em Joinville.', sourceType: 'Site Obscuro "Curiosidades Chocantes"', reliableSearch: 'Pesquisa por imagens revela que a foto do "esqueleto" venceu um concurso de Photoshop em 2012. Nenhum museu confirma a descoberta.', isFact: false, feedback: 'FAKE! O clássico golpe do Photoshop. Buscando pela imagem original, descobrimos que era só uma montagem.' }
      ]
    },
    {
      id: 'case_4',
      title: 'Arquivo 4: O Desafio Final - A Era da IA',
      type: 'cross_check',
      briefing: [
        { speaker: 'Lupa', text: 'Agente... Esse é o seu teste final. Bem-vindo à Era da Inteligência Artificial.' },
        { speaker: 'Lupa', text: 'As imagens não são mais garantias da verdade. Áudios podem ser clonados. Vídeos podem ser forjados.' },
        { speaker: 'Lupa', text: 'Aqui, você terá que desconfiar até dos próprios olhos, cruzando os detalhes com extrema cautela!' }
      ],
      stages: [
        { suspiciousNews: 'Vaza foto do Diretor da escola vestido de palhaço no meio da rua.', sourceType: 'Imagem recebida no WhatsApp', reliableSearch: 'A foto tem erros visuais graves: as mãos do diretor têm 7 dedos e o texto na placa ao fundo está em uma língua inexistente.', isFact: false, feedback: 'FAKE GERADO POR IA! Imagens falsas muitas vezes erram em mãos, reflexos e textos no fundo.' },
        { suspiciousNews: 'Áudio vazado: "Eu odeio dar férias para os alunos, eles deveriam estudar no domingo!" - Voz idêntica à do Ministro da Educação.', sourceType: 'Áudio do Telegram', reliableSearch: 'Peritos digitais analisaram o áudio e encontraram cortes não naturais e respirações robóticas. O Ministro estava em conferência ao vivo no horário do suposto áudio.', isFact: false, feedback: 'DEEPFAKE DE ÁUDIO! A voz foi clonada por IA. Detetives sempre procuram o álibi da pessoa!' },
        { suspiciousNews: 'Imagem impressionante mostra o Papa vestindo uma enorme jaqueta de neve estilosa em evento na neve.', sourceType: 'Rede Social', reliableSearch: 'Autor da imagem assumiu que a criou usando o programa Midjourney (IA de imagens). Vaticano confirmou que o Papa nunca usou a peça.', isFact: false, feedback: 'FAKE! Uma das deepfakes mais famosas do mundo. Sempre busque a fonte original da imagem.' },
        { suspiciousNews: 'Descoberto novo vírus que se transmite pela luz da tela do celular.', sourceType: 'Blog "Saúde Alternativa"', reliableSearch: 'Biólogos e médicos explicam que vírus são organismos biológicos ou pedaços de material genético; é fisicamente impossível serem transmitidos por luz digital.', isFact: false, feedback: 'FAKE! Conhecimento científico básico nos salva de espalhar lendas absurdas da internet.' },
        { suspiciousNews: 'Polícia rastreia criador de fake news que usava IA para enganar idosos na internet e o prende em flagrante.', sourceType: 'Jornal Nacional Reconhecido', reliableSearch: 'Secretaria de Segurança Pública lançou nota confirmando a operação "Truth" que desmantelou uma quadrilha de fraudes digitais ontem.', isFact: true, feedback: 'FATO! Fontes oficiais e jornais reconhecidos publicaram a mesma informação no mesmo dia.' }
      ]
    }
  ];

  // Estado Geral
  currentCaseIndex: number = 0;
  currentStageIndex: number = 0;
  
  // Modos de Exibição: 'briefing' | 'gameplay' | 'feedback'
  displayMode: 'briefing' | 'gameplay' | 'feedback' = 'briefing';
  briefingIndex: number = 0;

  // Estados Locais (para o gameplay)
  isCorrectGuess: boolean = false;
  feedbackText: string = '';
  hasSearched: boolean = false;
  gameFinished: boolean = false;

  constructor(private progressReporter: ProgressReporter) {}

  ngOnInit() {
    this.restoreProgress();
  }

  // ==== GERENCIAMENTO DE CASOS ====

  get activeCase(): DetectiveCase {
    return this.cases[this.currentCaseIndex];
  }

  get activeStage(): any {
    return this.activeCase.stages[this.currentStageIndex];
  }

  // ==== TRANSIÇÕES DE TELA ====

  nextBriefing() {
    if (this.briefingIndex < this.activeCase.briefing.length - 1) {
      this.briefingIndex++;
    } else {
      this.displayMode = 'gameplay';
    }
  }

  nextStep() {
    this.displayMode = 'gameplay';
    this.hasSearched = false;

    if (!this.isCorrectGuess) {
      this.reportProgress('failure', false);
      return;
    }

    // Avançar estágio ou caso
    if (this.currentStageIndex < this.activeCase.stages.length - 1) {
      this.currentStageIndex++;
    } else {
      // Caso concluído, vai para o próximo caso
      if (this.currentCaseIndex < this.cases.length - 1) {
        this.currentCaseIndex++;
        this.currentStageIndex = 0;
        this.briefingIndex = 0;
        this.displayMode = 'briefing'; // Mostra a historinha do novo caso
      } else {
        this.gameFinished = true;
      }
    }
    
    this.saveLocalProgress();
    this.reportProgress('success', this.gameFinished);
  }

  // ==== MECÂNICAS DE JOGO ====

  // Anatomia (Case 1)
  checkNewsPart(partId: string) {
    if (this.activeCase.type !== 'anatomy') return;
    
    if (partId === this.activeStage.id) {
      this.isCorrectGuess = true;
      this.feedbackText = this.activeStage.feedback;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ainda não é essa parte! Use sua lupa de detetive e leia com atenção a dica.';
    }
    this.displayMode = 'feedback';
  }

  // Phishing (Case 2)
  votePhishing(voteIsPhishing: boolean) {
    if (this.activeCase.type !== 'phishing') return;
    
    if (voteIsPhishing === this.activeStage.isPhishing) {
      this.isCorrectGuess = true;
      this.feedbackText = this.activeStage.feedback;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ops! Você deixou a pista passar. Essa mensagem era ' + (this.activeStage.isPhishing ? 'um GOLPE' : 'SEGURA') + '. Leia com mais calma!';
    }
    this.displayMode = 'feedback';
  }

  // Cross Check / Advanced (Case 3 e 4)
  performSearch() {
    this.hasSearched = true;
  }

  voteFactOrFake(vote: boolean) {
    if (this.activeCase.type !== 'cross_check') return;
    
    if (vote === this.activeStage.isFact) {
      this.isCorrectGuess = true;
      this.feedbackText = this.activeStage.feedback;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ops, detetive! Você foi enganado por essa informação. Leia novamente o que o buscador seguro (Google) disse e cruze as informações.';
    }
    this.displayMode = 'feedback';
  }

  // ==== PROGRESSO E TELEMETRIA ====

  private reportProgress(result: 'success' | 'failure', isFinished: boolean) {
    const absoluteFase = (this.currentCaseIndex * 10) + this.currentStageIndex; // Apenas um ID unico
    
    this.progressReporter.report({
      levelId: `fact-checker-case${this.currentCaseIndex}-stage${this.currentStageIndex}`,
      fase: absoluteFase,
      result: result,
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: isFinished
    });
  }

  private saveLocalProgress() {
    const progress = JSON.stringify({
      caseIndex: this.currentCaseIndex,
      stageIndex: this.currentStageIndex
    });
    sessionStorage.setItem('factCheckerProgress', progress);
  }

  private restoreProgress() {
    const saved = sessionStorage.getItem('factCheckerProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.caseIndex !== undefined && parsed.stageIndex !== undefined) {
          this.currentCaseIndex = parsed.caseIndex;
          this.currentStageIndex = parsed.stageIndex;
          this.briefingIndex = 0;
          this.displayMode = 'briefing';
        }
      } catch (e) {
        // Ignora caso esteja corrompido
      }
    }
  }
}
