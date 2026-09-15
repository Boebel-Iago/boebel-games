import { Injectable } from '@angular/core';
import { BrowserTask, SearchTask } from './browser-search.model';

@Injectable()
export class BrowserSearchRepository {
  
  private browserTasks: BrowserTask[] = [
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

  private searchTasks: SearchTask[] = [
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
      feedback: 'Excelente! Jogos costumam dar problemas, colocar o nome do jogo e o que está acontecendo sempre funciona.'
    }
  ];

  getBrowserTask(index: number): BrowserTask | null {
    return this.browserTasks[index] || null;
  }

  getSearchTask(index: number): SearchTask | null {
    return this.searchTasks[index] || null;
  }

  getTotalPhases(): number {
    return this.browserTasks.length + this.searchTasks.length;
  }

  getTotalBrowserTasks(): number {
    return this.browserTasks.length;
  }
}
