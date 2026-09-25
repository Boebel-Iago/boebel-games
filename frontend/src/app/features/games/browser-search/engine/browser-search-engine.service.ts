import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';
import { BehaviorSubject } from 'rxjs';

export interface TaskOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface DragZone {
  id: string;
  title: string;
  acceptsId: string;
}

export interface SearchTask {
  id: string;
  type: 'tap' | 'drag';
  question: string;
  options: TaskOption[];
  correctOptionId?: string; // For tap
  dropZones?: DragZone[]; // For drag
}

export interface GameState {
  module: number;
  taskIndex: number;
  hearts: number;
  isGameOver: boolean;
  gameWon: boolean;
  currentTask: SearchTask | null;
}

@Injectable({
  providedIn: 'root'
})
export class BrowserSearchEngineService {
  private readonly STORAGE_KEY = 'boebel_browser_search_state';

  private defaultState: GameState = {
    module: 0,
    taskIndex: 0,
    hearts: 3,
    isGameOver: false,
    gameWon: false,
    currentTask: null
  };

  private state = new BehaviorSubject<GameState>({ ...this.defaultState });
  state$ = this.state.asObservable();

  private tasksByModule: SearchTask[][] = [];

  constructor(private progress: ProgressReporter) {
    this.generateTasks();
    this.loadState();
  }

  private loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    let st = this.defaultState;
    if (saved) {
      try {
        st = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved state', e);
      }
    }
    
    // Ensure we have a valid task
    if (!st.gameWon && !st.isGameOver) {
      st.currentTask = this.tasksByModule[st.module][st.taskIndex];
    }
    
    this.state.next(st);
  }

  private saveState(st: GameState) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(st));
    this.state.next(st);
  }

  public resetGame() {
    this.generateTasks();
    const st = { ...this.defaultState, currentTask: this.tasksByModule[0][0] };
    this.saveState(st);
  }

  public submitAnswer(isCorrect: boolean) {
    const st = { ...this.state.value };

    if (isCorrect) {
      this.progress.report({
        levelId: `browser-search-m${st.module}-t${st.taskIndex}`,
        fase: st.module,
        result: 'success',
        attempts: 4 - st.hearts,
        timestamp: new Date().toISOString(),
        isLastLevel: st.module === 4 && st.taskIndex === 9
      });

      st.taskIndex++;
      if (st.taskIndex >= 10) {
        st.module++;
        st.taskIndex = 0;
        st.hearts = 3; // Refill hearts on module completion
        
        if (st.module >= 5) {
          st.gameWon = true;
          st.currentTask = null;
          this.saveState(st);
          return;
        }
      }
      st.currentTask = this.tasksByModule[st.module][st.taskIndex];
    } else {
      this.progress.report({
        levelId: `browser-search-m${st.module}-t${st.taskIndex}`,
        fase: st.module,
        result: 'failure',
        attempts: 1,
        timestamp: new Date().toISOString(),
        isLastLevel: false
      });

      st.hearts--;
      if (st.hearts <= 0) {
        st.isGameOver = true;
        st.currentTask = null;
      }
    }

    this.saveState(st);
  }

  public retryModule() {
    const st = { ...this.state.value };
    st.isGameOver = false;
    st.hearts = 3;
    st.taskIndex = 0;
    st.currentTask = this.tasksByModule[st.module][st.taskIndex];
    this.saveState(st);
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private generateTasks() {
    this.tasksByModule = [
      this.generateModule1(),
      this.generateModule2(),
      this.generateModule3(),
      this.generateModule4(),
      this.generateModule5(),
    ];
  }

  private generateModule1(): SearchTask[] {
    const scenarios = [
      { q: 'Fotos de gatos', c: 'gatos fofos fotos', w: 'eu quero ver uma foto de um gato por favor' },
      { q: 'Receita de bolo de cenoura', c: 'receita bolo cenoura', w: 'como fazer um bolo usando cenouras na minha casa' },
      { q: 'Comprar tênis esportivo', c: 'comprar tênis esportivo', w: 'onde tem tênis para eu fazer esportes' },
      { q: 'Previsão do tempo', c: 'previsão do tempo hoje', w: 'será que vai chover na minha rua hoje' },
      { q: 'Como estudar matemática', c: 'dicas estudar matemática', w: 'me ajuda a passar na prova de matemática amanhã' },
      { q: 'Melhores filmes de comédia', c: 'melhores filmes comédia', w: 'eu quero dar risada com um filme' },
      { q: 'Cachorros pequenos para apartamento', c: 'raças cachorro apartamento', w: 'qual cachorro cabe na minha casa' },
      { q: 'Aprender inglês sozinho', c: 'aprender inglês sozinho', w: 'como falar inglês sem ir na escola' },
      { q: 'Jogos de videogame baratos', c: 'jogos videogame baratos', w: 'onde tem jogo de videogame que custa pouco' },
      { q: 'Como fazer pipoca doce', c: 'receita pipoca doce', w: 'pipoca com açúcar na panela' }
    ];
    
    return this.shuffleArray(scenarios).map((s, idx) => {
      const options = this.shuffleArray([
        { id: 'c', text: s.c, isCorrect: true },
        { id: 'w', text: s.w, isCorrect: false }
      ]);
      return {
        id: `m1_t${idx}`,
        type: 'tap',
        question: `Como pesquisar melhor sobre: "${s.q}"?`,
        options: options,
        correctOptionId: 'c'
      };
    });
  }

  private generateModule2(): SearchTask[] {
    const scenarios = [
      { q: 'Pesquisar sobre o planeta Marte', c: 'planeta marte', w: 'coisas sobre o planeta vermelho no espaço' },
      { q: 'História do Brasil', c: 'história do brasil resumo', w: 'o que aconteceu no brasil antigamente' },
      { q: 'Curar dor de cabeça', c: 'remédio dor cabeça', w: 'como fazer minha cabeça parar de doer agora' },
      { q: 'Notícias sobre esportes', c: 'notícias esportes hoje', w: 'o que aconteceu no jogo de hoje' },
      { q: 'Comprar celular barato', c: 'celular barato comprar', w: 'quero um celular novo que não custa muito' },
      { q: 'Vídeos de música pop', c: 'música pop clipes', w: 'me mostra músicas pop' },
      { q: 'Imagens do fundo do mar', c: 'fundo do mar imagens', w: 'eu quero ver o oceano lá no fundo' },
      { q: 'Preço da gasolina', c: 'preço gasolina hoje', w: 'quanto custa para encher o tanque do carro' },
      { q: 'Como amarrar o tênis', c: 'tutorial amarrar tênis', w: 'como eu dou o nó no meu sapato' },
      { q: 'Ideias de presentes', c: 'ideias presente criativo', w: 'o que eu dou para o meu amigo' }
    ];
    
    return this.shuffleArray(scenarios).map((s, idx) => {
      const options = this.shuffleArray([
        { id: 'c', text: s.c },
        { id: 'w', text: s.w }
      ]);
      return {
        id: `m2_t${idx}`,
        type: 'drag',
        question: `Arraste a melhor palavra-chave para a pesquisa: "${s.q}"`,
        options: options,
        dropZones: [{ id: 'searchbar', title: 'Barra de Pesquisa', acceptsId: 'c' }]
      };
    });
  }

  private generateModule3(): SearchTask[] {
    const scenarios = [
      { q: 'Qual site é mais seguro para pesquisas escolares?', c: 'escola.edu.br', w: 'respostas123.xyz' },
      { q: 'Onde encontro informações do governo?', c: 'saude.gov.br', w: 'governo-noticias.net' },
      { q: 'Qual link é mais confiável?', c: 'universidade.edu.br', w: 'faculdade-barata.biz' },
      { q: 'Onde ler notícias sérias?', c: 'jornaloficial.com.br', w: 'fofocassupertis.vip' },
      { q: 'Informações sobre vacinas?', c: 'ministeriodasaude.gov.br', w: 'vacinas-reveladas.info' },
      { q: 'Artigo científico?', c: 'pesquisa-ciencia.org', w: 'ciencia-maluca.xyz' },
      { q: 'Site de compras seguro?', c: 'loja-conhecida.com.br', w: 'loja-gratis.tk' },
      { q: 'Prefeitura da cidade?', c: 'prefeitura.sp.gov.br', w: 'prefeiturasp.net' },
      { q: 'Museu Nacional?', c: 'museunacional.ufrj.br', w: 'museudobrasil.com' },
      { q: 'Dicionário confiável?', c: 'dicionario-academia.org.br', w: 'significados-facil.biz' }
    ];

    return this.shuffleArray(scenarios).map((s, idx) => {
      const options = this.shuffleArray([
        { id: 'c', text: s.c, isCorrect: true },
        { id: 'w', text: s.w, isCorrect: false }
      ]);
      return {
        id: `m3_t${idx}`,
        type: 'tap',
        question: s.q,
        options: options,
        correctOptionId: 'c'
      };
    });
  }

  private generateModule4(): SearchTask[] {
    const scenarios = [
      { q: 'Buscar a frase exata: O rato roeu a roupa', c: '"O rato roeu a roupa"', w: 'O rato roeu a roupa' },
      { q: 'Buscar o nome exato: Machado de Assis', c: '"Machado de Assis"', w: 'Machado de Assis' },
      { q: 'Buscar poema: Batatinha quando nasce', c: '"Batatinha quando nasce"', w: 'Batatinha quando nasce' },
      { q: 'Filme: O Senhor dos Anéis', c: '"O Senhor dos Anéis"', w: 'Senhor dos Anéis' },
      { q: 'Livro: Dom Quixote', c: '"Dom Quixote"', w: 'Dom Quixote' },
      { q: 'Música: Garota de Ipanema', c: '"Garota de Ipanema"', w: 'Garota de Ipanema' },
      { q: 'Letra: Parabéns pra você', c: '"Parabéns pra você"', w: 'Parabéns pra você' },
      { q: 'Série: Chaves', c: '"Série Chaves"', w: 'Série Chaves' },
      { q: 'Busca exata: Bolo de chocolate', c: '"Bolo de chocolate"', w: 'Bolo de chocolate' },
      { q: 'Termo exato: Mudanças climáticas', c: '"Mudanças climáticas"', w: 'Mudanças climáticas' }
    ];

    return this.shuffleArray(scenarios).map((s, idx) => {
      const options = this.shuffleArray([
        { id: 'c', text: s.c, isCorrect: true },
        { id: 'w', text: s.w, isCorrect: false }
      ]);
      return {
        id: `m4_t${idx}`,
        type: 'tap',
        question: s.q,
        options: options,
        correctOptionId: 'c'
      };
    });
  }

  private generateModule5(): SearchTask[] {
    const items = [
      { t: 'ibge.gov.br', c: 'fonte' },
      { t: '"fotos de gatos"', c: 'palavra' },
      { t: 'alienigenas.xyz', c: 'fake' },
      { t: 'universidade.edu.br', c: 'fonte' },
      { t: '"receita de bolo"', c: 'palavra' },
      { t: 'remedio-milagroso.biz', c: 'fake' },
      { t: 'mec.gov.br', c: 'fonte' },
      { t: '"melhores jogos"', c: 'palavra' },
      { t: 'dinheiro-gratis.tk', c: 'fake' },
      { t: '"como desenhar"', c: 'palavra' }
    ];

    return this.shuffleArray(items).map((item, idx) => {
      const dropZones = [
        { id: 'fonte', title: 'Fonte Confiável', acceptsId: item.c === 'fonte' ? 'drag-item' : '' },
        { id: 'palavra', title: 'Busca Exata', acceptsId: item.c === 'palavra' ? 'drag-item' : '' },
        { id: 'fake', title: 'Fake News / Suspeito', acceptsId: item.c === 'fake' ? 'drag-item' : '' }
      ];
      
      return {
        id: `m5_t${idx}`,
        type: 'drag',
        question: 'Onde este item se encaixa?',
        options: [{ id: 'drag-item', text: item.t }],
        dropZones: dropZones
      };
    });
  }
}
