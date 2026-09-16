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
      distractorWords: ['eu', 'quero', 'ver', 'de', 'muito', 'fofinhos'],
      feedback: 'Fácil e direto! "Fotos gatos filhotes" é tudo o que o computador precisa ler.'
    },
    {
      situation: 'Fase 2: Você precisa saber o resultado do jogo do Brasil de ontem.',
      correctKeywords: ['resultado', 'jogo', 'Brasil'],
      distractorWords: ['qual', 'foi', 'o', 'do', 'de', 'ontem', 'quem', 'ganhou'],
      feedback: 'Isso! Evite perguntar "quem ganhou", foque em palavras concretas como "resultado" e "Brasil".'
    },
    {
      situation: 'Fase 3: Você quer aprender a fazer um bolo de cenoura com chocolate.',
      correctKeywords: ['receita', 'bolo', 'cenoura', 'chocolate'],
      distractorWords: ['como', 'fazer', 'um', 'com', 'cobertura', 'de', 'para', 'mim'],
      feedback: 'Ótimo! A palavra "Receita" já diz ao computador que você quer o passo a passo de como fazer.'
    },
    {
      situation: 'Fase 4: Seu cachorro está comendo grama e você quer saber o motivo.',
      correctKeywords: ['cachorro', 'comendo', 'grama', 'motivo'],
      distractorWords: ['por', 'que', 'o', 'meu', 'está', 'fazendo', 'isso', 'agora'],
      feedback: 'Excelente! Nós não conversamos com o computador como se fosse uma pessoa. Tiramos os "por que" e os "o meu".'
    },
    {
      situation: 'Fase 5: Você precisa encontrar o endereço do Museu da Água na cidade de Blumenau.',
      correctKeywords: ['endereço', 'museu', 'água', 'Blumenau'],
      distractorWords: ['onde', 'fica', 'o', 'da', 'na', 'cidade', 'de', 'como', 'chegar'],
      feedback: 'Muito bem! Ao colocar o nome da cidade, você garante que não vai achar um museu de outro estado.'
    },
    {
      situation: 'Fase 6: O seu computador deu uma tela azul com o erro "ERR_NETWORK".',
      correctKeywords: ['erro', 'tela', 'azul', 'ERR_NETWORK'],
      distractorWords: ['meu', 'computador', 'deu', 'uma', 'com', 'o', 'o', 'que', 'fazer'],
      feedback: 'Perfeito! Se você digitar exatamente o código do erro (ERR_NETWORK), vai achar a solução rapidinho.'
    },
    {
      situation: 'Fase 7: Você quer comprar um teclado sem fio barato para o seu tablet.',
      correctKeywords: ['comprar', 'teclado', 'sem fio', 'barato'],
      distractorWords: ['eu', 'quero', 'um', 'para', 'o', 'meu', 'tablet', 'onde', 'vende'],
      feedback: 'Isso! O computador lê "comprar", "teclado" e "barato" e já mostra as melhores lojas para você.'
    },
    {
      situation: 'Fase 8: Você tem um trabalho escolar sobre a história do descobrimento do Brasil.',
      correctKeywords: ['história', 'descobrimento', 'Brasil', 'resumo'],
      distractorWords: ['um', 'trabalho', 'escolar', 'sobre', 'a', 'do', 'quem', 'descobriu'],
      feedback: 'Gênio! A palavra "Resumo" é um truque secreto excelente para trabalhos escolares!'
    },
    {
      situation: 'Fase 9: Como traduzir a palavra "teclado" do português para o inglês.',
      correctKeywords: ['tradutor', 'teclado', 'inglês'],
      distractorWords: ['como', 'escrever', 'a', 'palavra', 'do', 'português', 'para', 'o', 'em'],
      feedback: 'Exato! Só usar a palavra "Tradutor" acompanhada do idioma que você quer.'
    },
    {
      situation: 'Fase 10: Seu jogo Roblox não quer abrir e fica fechando sozinho no celular.',
      correctKeywords: ['Roblox', 'fechando', 'sozinho', 'celular'],
      distractorWords: ['o', 'meu', 'jogo', 'não', 'quer', 'abrir', 'e', 'fica', 'toda', 'hora'],
      feedback: 'Missão cumprida! Retirando o desespero e focando no nome do jogo e no problema, a internet sempre ajuda!'
    }
  ];

  gameStage: 1 | 2 = 1;
  currentTaskIndex: number = 0;
  
  availableWords: string[] = [];
  selectedWords: string[] = [];

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
    const hasAllCorrect = task.correctKeywords.every(w => this.selectedWords.includes(w));
    const hasNoDistractors = this.selectedWords.every(w => task.correctKeywords.includes(w));

    if (hasAllCorrect && hasNoDistractors) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
    } else {
      this.isCorrectGuess = false;
      this.feedbackText = 'Sua pesquisa está confusa! Lembre-se: remova palavras como "eu", "o", "que", "como". Deixe apenas as palavras mais importantes!';
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