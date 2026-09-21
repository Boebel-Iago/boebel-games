import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

interface BrowserTask {
  id: string;
  instruction: string;
  feedback: string;
}

interface SearchTask {
  situation: string;
  correctKeywords: string[];
  alternativeKeywords?: string[][];
  distractorWords: string[]; 
  feedback: string;
}

@Component({
  selector: 'app-browser-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browser-search.component.html',
  styleUrl: './browser-search.component.scss'
})
export class BrowserSearchComponent implements OnInit {
  
  // FASE 1: Identificar partes do Navegador (10 Fases - Fácil para Difícil)
  browserTasks: BrowserTask[] = [
    { id: 'search-bar', instruction: 'Fase 1: Toque na BARRA DE PESQUISA (A lupa grande no meio da tela).', feedback: 'Fácil, né? A barra de pesquisa é onde digitamos o que queremos achar no Google.' },
    { id: 'back', instruction: 'Fase 2: Você entrou no site errado. Toque no botão VOLTAR para a página anterior.', feedback: 'Isso! A setinha para a esquerda sempre nos salva quando clicamos onde não devíamos.' },
    { id: 'forward', instruction: 'Fase 3: Você voltou sem querer! Toque no botão AVANÇAR para ir para a próxima página.', feedback: 'Perfeito! A setinha para a direita refaz o nosso caminho.' },
    { id: 'refresh', instruction: 'Fase 4: A internet travou. Toque no botão de ATUALIZAR (Recarregar) o site.', feedback: 'Muito bem! A setinha em círculo faz o navegador carregar tudo de novo.' },
    { id: 'home', instruction: 'Fase 5: Você quer voltar para a tela inicial. Toque no botão PÁGINA INICIAL.', feedback: 'Exato! O ícone da Casinha (Home) nos leva para o começo do navegador.' },
    { id: 'address-bar', instruction: 'Fase 6: Toque na BARRA DE ENDEREÇOS (Onde está escrito o site "https://...").', feedback: 'Ótimo! É aí que digitamos o caminho exato para visitar uma página direta.' },
    { id: 'new-tab', instruction: 'Fase 7: Você quer fazer uma pesquisa sem fechar o site atual. Abra uma NOVA GUIA.', feedback: 'Muito bem! O botão de Nova Guia (+) abre uma aba limpa para você usar.' },
    { id: 'close-tab', instruction: 'Fase 8: Terminou de usar o site? Toque no botão de FECHAR A GUIA.', feedback: 'Isso! A bolinha vermelha com o "X" fecha a página quando não precisamos mais dela.' },
    { id: 'bookmark', instruction: 'Fase 9: Você adorou esse site e quer salvar! Toque nos FAVORITOS.', feedback: 'Excelente! A Estrela guarda o site na sua lista de favoritos para você achar rápido amanhã.' },
    { id: 'lock', instruction: 'Fase 10: Como saber se o site é seguro e não tem vírus? Toque no CADEADO de segurança.', feedback: 'Incrível! O Cadeado fechado significa que suas informações estão protegidas nesse site!' }
  ];

  // FASE 2: Palavras-chave (10 Fases - Simples para Complexas)
  searchTasks: SearchTask[] = [
    {
      situation: 'Fase 1: Você quer ver fotos de gatos filhotes fofinhos.',
      correctKeywords: ['fotos', 'gatos', 'filhotes'],
      alternativeKeywords: [['gatos', 'filhotes'], ['fotos', 'gatos']],
      distractorWords: ['eu', 'quero', 'ver', 'de', 'muito', 'fofinhos'],
      feedback: 'Fácil e direto! "Fotos gatos filhotes" ou apenas "gatos filhotes" é tudo o que o computador precisa ler.'
    },
    {
      situation: 'Fase 2: Você precisa saber o resultado do jogo do Brasil de ontem.',
      correctKeywords: ['resultado', 'jogo', 'Brasil'],
      alternativeKeywords: [['jogo', 'Brasil', 'ontem'], ['resultado', 'Brasil']],
      distractorWords: ['qual', 'foi', 'o', 'do', 'de', 'ontem', 'quem', 'ganhou'],
      feedback: 'Isso! Evite perguntar "quem ganhou", foque em palavras concretas como "resultado" e "Brasil".'
    },
    {
      situation: 'Fase 3: Você quer aprender a fazer um bolo de cenoura com chocolate.',
      correctKeywords: ['receita', 'bolo', 'cenoura', 'chocolate'],
      alternativeKeywords: [['bolo', 'cenoura', 'chocolate'], ['fazer', 'bolo', 'cenoura', 'chocolate']],
      distractorWords: ['como', 'fazer', 'um', 'com', 'cobertura', 'de', 'para', 'mim'],
      feedback: 'Ótimo! A palavra "Receita" já diz ao computador o que você quer, mas citar os ingredientes principais também funciona perfeitamente!'
    },
    {
      situation: 'Fase 4: Seu cachorro está comendo grama e você quer saber o motivo.',
      correctKeywords: ['cachorro', 'comendo', 'grama', 'motivo'],
      alternativeKeywords: [['cachorro', 'comendo', 'grama'], ['por que', 'cachorro', 'comendo', 'grama']],
      distractorWords: ['por que', 'o', 'meu', 'está', 'fazendo', 'isso', 'agora'],
      feedback: 'Excelente! Nós não conversamos com o computador como se fosse uma pessoa. Tiramos os "o meu" e "está fazendo".'
    },
    {
      situation: 'Fase 5: Você precisa encontrar o endereço do Museu da Água na cidade de Blumenau.',
      correctKeywords: ['endereço', 'museu', 'água', 'Blumenau'],
      alternativeKeywords: [['museu', 'água', 'Blumenau'], ['onde', 'fica', 'museu', 'água', 'Blumenau']],
      distractorWords: ['onde', 'fica', 'o', 'da', 'na', 'cidade', 'de', 'como', 'chegar'],
      feedback: 'Muito bem! Ao colocar o nome da cidade e do local, você garante que não vai achar um museu de outro estado.'
    },
    {
      situation: 'Fase 6: Você quer comprar um tênis azul tamanho 38.',
      correctKeywords: ['comprar', 'tênis', 'azul', '38'],
      alternativeKeywords: [['tênis', 'azul', '38'], ['preço', 'tênis', 'azul', '38']],
      distractorWords: ['eu', 'quero', 'um', 'para', 'mim', 'qual', 'o', 'preço', 'do'],
      feedback: 'Isso! Tamanho, cor e o objeto formam a pesquisa ideal para lojas online.'
    },
    {
      situation: 'Fase 7: Seu teclado parou de funcionar e você usa o Windows 11.',
      correctKeywords: ['teclado', 'não', 'funciona', 'Windows 11'],
      alternativeKeywords: [['teclado', 'parou', 'Windows 11'], ['problema', 'teclado', 'Windows 11']],
      distractorWords: ['meu', 'de', 'funcionar', 'como', 'consertar', 'no', 'problema', 'parou'],
      feedback: 'Perfeito! Colocar a versão do seu sistema (Windows 11) ajuda a achar a solução certa para o seu computador.'
    },
    {
      situation: 'Fase 8: Você tem um trabalho escolar sobre a história do descobrimento do Brasil.',
      correctKeywords: ['resumo', 'história', 'descobrimento', 'Brasil'],
      alternativeKeywords: [['história', 'descobrimento', 'Brasil'], ['trabalho', 'história', 'descobrimento', 'Brasil']],
      distractorWords: ['eu', 'tenho', 'um', 'escolar', 'sobre', 'a', 'do', 'trabalho'],
      feedback: 'Brilhante! "Resumo", "História" e "Descobrimento do Brasil" vai te levar direto aos melhores sites educativos!'
    },
    {
      situation: 'Fase 9: Você quer saber se vai chover amanhã na sua cidade, Florianópolis.',
      correctKeywords: ['previsão', 'tempo', 'amanhã', 'Florianópolis'],
      alternativeKeywords: [['chover', 'amanhã', 'Florianópolis'], ['clima', 'amanhã', 'Florianópolis']],
      distractorWords: ['vai', 'chover', 'na', 'minha', 'cidade', 'se', 'clima'],
      feedback: 'Show! Pesquisar "previsão do tempo" mais a data e a cidade não tem erro.'
    },
    {
      situation: 'Fase 10: Você esqueceu a senha do seu celular Samsung e quer formatar.',
      correctKeywords: ['como', 'formatar', 'celular', 'Samsung'],
      alternativeKeywords: [['formatar', 'celular', 'Samsung'], ['esqueci', 'senha', 'formatar', 'Samsung']],
      distractorWords: ['eu', 'esqueci', 'a', 'senha', 'do', 'meu', 'e', 'quero'],
      feedback: 'Muito bem! "Como formatar" seguido da marca do aparelho acha exatamente o tutorial que você precisa!'
    }
  ];

  gameStage: 1 | 2 = 1;
  currentTaskIndex: number = 0;
  
  availableWords: string[] = [];
  selectedWords: string[] = [];
  currentMistakes: number = 0;

  showFeedbackModal: boolean = false;
  feedbackText: string = '';
  isCorrectGuess: boolean = false;
  gameFinished: boolean = false;

  constructor(private progressReporter: ProgressReporter) {}

  ngOnInit() {
    if (sessionStorage.getItem("isDemoMode") === "true") { this.browserTasks = this.browserTasks.slice(0, 2); this.searchTasks = []; }
    this.restoreProgress();
    this.loadStage();
  }

  private restoreProgress() {
    const saved = sessionStorage.getItem('currentStage');
    if (saved) {
      const stage = parseInt(saved, 10);
      if (!isNaN(stage) && stage > 0) {
        const phase1Total = this.browserTasks.length; // 10
        if (stage >= phase1Total + this.searchTasks.length) {
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
      : this.browserTasks.length + this.currentTaskIndex;
  }

  loadStage() {
    if (this.gameStage === 2 && this.currentTaskIndex < this.searchTasks.length) {
      const task = this.searchTasks[this.currentTaskIndex];
      this.selectedWords = [];
      this.availableWords = [...task.correctKeywords, ...task.distractorWords].sort(() => Math.random() - 0.5);
    }
  }

  checkBrowserPart(partId: string, event?: Event) {
    if (event) event.stopPropagation(); // Evita que clique no cadeado ative a barra de endereços junto
    
    if (this.gameStage !== 1) return;
    
    const task = this.browserTasks[this.currentTaskIndex];
    if (partId === task.id) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Ainda não é essa parte! Leia com atenção a instrução e toque no lugar correto do navegador.';
      this.showFeedbackModal = true;
    }
  }

  selectWord(word: string) {
    this.selectedWords.push(word);
    this.availableWords = this.availableWords.filter(w => w !== word);
  }

  removeWord(word: string) {
    this.availableWords.push(word);
    this.selectedWords = this.selectedWords.filter(w => w !== word);
  }

  checkKeywords() {
    const task = this.searchTasks[this.currentTaskIndex];
    
    // Testa a combinação principal
    let isCorrect = false;
    const hasAllCorrectPrimary = task.correctKeywords.every(w => this.selectedWords.includes(w));
    const hasNoDistractorsPrimary = this.selectedWords.every(w => task.correctKeywords.includes(w));
    
    if (hasAllCorrectPrimary && hasNoDistractorsPrimary && this.selectedWords.length === task.correctKeywords.length) {
      isCorrect = true;
    }

    // Testa as combinações alternativas, se houver
    if (!isCorrect && task.alternativeKeywords) {
      for (const alt of task.alternativeKeywords) {
        const hasAllAlt = alt.every(w => this.selectedWords.includes(w));
        const hasNoDistractorsAlt = this.selectedWords.every(w => alt.includes(w));
        if (hasAllAlt && hasNoDistractorsAlt && this.selectedWords.length === alt.length) {
          isCorrect = true;
          break;
        }
      }
    }

    if (isCorrect) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
      this.currentMistakes = 0; // Reseta os erros ao acertar
    } else {
      this.isCorrectGuess = false;
      this.currentMistakes++;
      
      if (this.currentMistakes >= 5) {
        this.feedbackText = '💡 DICA: As palavras essenciais poderiam ser: ' + task.correctKeywords.join(', ') + '.';
      } else {
        this.feedbackText = 'Sua pesquisa está um pouco confusa! Lembre-se: remova palavras como "eu", "o", "que", "como". Deixe apenas as palavras mais importantes!';
      }
      this.showFeedbackModal = true;
    }
  }

  nextStep() {
    this.showFeedbackModal = false;

    if (!this.isCorrectGuess) {
      this.progressReporter.report({
        levelId: `browser-search-${this.getAbsoluteStage()}`,
        fase: this.getAbsoluteStage(),
        result: 'failure',
        attempts: 0,
        timestamp: new Date().toISOString(),
        isLastLevel: false
      });
      return;
    }

    this.currentTaskIndex++;
    const phase1Total = this.browserTasks.length;
    let isFinished = false;

    if (this.gameStage === 1 && this.currentTaskIndex >= phase1Total) {
      this.gameStage = 2;
      this.currentTaskIndex = 0;
      this.loadStage();
    } else if (this.gameStage === 2 && this.currentTaskIndex >= this.searchTasks.length) {
      this.gameFinished = true;
      isFinished = true;
    } else {
      this.loadStage();
    }

    this.progressReporter.report({
      levelId: `browser-search-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success',
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: isFinished
    });
  }
}