import { Injectable, signal } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface FactTask {
  id: string;
  type: 'real_fake' | 'clickbait' | 'source' | 'date' | 'grand_checker';
  content: string;
  options?: string[]; // For clickbait (if multiple) or grand checker
  correctAnswer: string;
  explanation: string;
}

export interface GameState {
  fase: number; // 0 to 4 (Module index)
  taskIndex: number; // 0 to 9
  hearts: number;
  score: number;
  isGameOver: boolean;
  isGameWon: boolean;
  currentTasks: FactTask[];
}

@Injectable({
  providedIn: 'root'
})
export class FactCheckerEngineService {
  private readonly STORAGE_KEY = 'boebel_fact_checker_state';

  private defaultState: GameState = {
    fase: 0,
    taskIndex: 0,
    hearts: 3,
    score: 0,
    isGameOver: false,
    isGameWon: false,
    currentTasks: []
  };

  public state = signal<GameState>(this.defaultState);

  // Raw Task Data
  private module1Tasks: FactTask[] = [
    { id: '1-1', type: 'real_fake', content: 'Cientistas descobrem água em Marte.', correctAnswer: 'Real', explanation: 'A NASA confirmou a presença de água em Marte.' },
    { id: '1-2', type: 'real_fake', content: 'O homem nunca pisou na Lua, foi tudo gravado em estúdio.', correctAnswer: 'Fake', explanation: 'Existem inúmeras evidências científicas das missões Apollo.' },
    { id: '1-3', type: 'real_fake', content: 'Vacinas causam autismo em crianças.', correctAnswer: 'Fake', explanation: 'Estudos extensivos provam que não há ligação entre vacinas e autismo.' },
    { id: '1-4', type: 'real_fake', content: 'A Terra é redonda.', correctAnswer: 'Real', explanation: 'Fato científico comprovado há séculos.' },
    { id: '1-5', type: 'real_fake', content: 'Tomar suco de limão cura o câncer.', correctAnswer: 'Fake', explanation: 'Limão faz bem, mas não é cura para o câncer.' },
    { id: '1-6', type: 'real_fake', content: 'Exercício físico regular melhora a saúde cardiovascular.', correctAnswer: 'Real', explanation: 'Atividade física é essencial para a saúde do coração.' },
    { id: '1-7', type: 'real_fake', content: 'Alienígenas construíram as pirâmides do Egito.', correctAnswer: 'Fake', explanation: 'As pirâmides foram construídas por trabalhadores egípcios.' },
    { id: '1-8', type: 'real_fake', content: 'A Grande Muralha da China é visível do espaço a olho nu.', correctAnswer: 'Fake', explanation: 'É um mito muito comum, mas ela não é visível do espaço sem ajuda.' },
    { id: '1-9', type: 'real_fake', content: 'Árvores produzem oxigênio.', correctAnswer: 'Real', explanation: 'Através da fotossíntese, plantas liberam oxigênio.' },
    { id: '1-10', type: 'real_fake', content: 'Beber 2 litros de água por dia é recomendado para a saúde.', correctAnswer: 'Real', explanation: 'A hidratação é importante, embora a quantidade ideal varie.' }
  ];

  private module2Tasks: FactTask[] = [
    { id: '2-1', type: 'clickbait', content: 'Você não vai acreditar no que essa celebridade fez!', correctAnswer: 'Clickbait', explanation: 'Título sensacionalista para atrair cliques.' },
    { id: '2-2', type: 'clickbait', content: 'Governo anuncia novas medidas econômicas para 2025.', correctAnswer: 'Normal', explanation: 'Título informativo e direto.' },
    { id: '2-3', type: 'clickbait', content: 'O segredo CHOCANTE para perder 10kg em um dia!', correctAnswer: 'Clickbait', explanation: 'Promessa irreal e uso de palavras fortes.' },
    { id: '2-4', type: 'clickbait', content: 'Previsão do tempo: Chuvas fortes na região sudeste.', correctAnswer: 'Normal', explanation: 'Apenas informa os fatos.' },
    { id: '2-5', type: 'clickbait', content: 'Médicos escondem essa cura milagrosa de você!', correctAnswer: 'Clickbait', explanation: 'Teoria da conspiração para ganhar cliques.' },
    { id: '2-6', type: 'clickbait', content: 'Resultados dos jogos da rodada no Campeonato Brasileiro.', correctAnswer: 'Normal', explanation: 'Informa sobre um evento esportivo.' },
    { id: '2-7', type: 'clickbait', content: 'Esse truque bizarro vai limpar sua casa em 5 minutos.', correctAnswer: 'Clickbait', explanation: 'Uso de "bizarro" e promessas exageradas.' },
    { id: '2-8', type: 'clickbait', content: 'Descoberta nova espécie de sapo na Amazônia.', correctAnswer: 'Normal', explanation: 'Notícia científica clara.' },
    { id: '2-9', type: 'clickbait', content: 'Ganhe R$ 10.000 por dia sem sair da cama!', correctAnswer: 'Clickbait', explanation: 'Promessa financeira absurda.' },
    { id: '2-10', type: 'clickbait', content: 'Escolas municipais iniciam período de matrículas.', correctAnswer: 'Normal', explanation: 'Informação de utilidade pública.' }
  ];

  private module3Tasks: FactTask[] = [
    { id: '3-1', type: 'source', content: 'O Ministério da Saúde afirma que a campanha de vacinação começa amanhã.', correctAnswer: 'Confiável', explanation: 'Órgãos oficiais são fontes confiáveis.' },
    { id: '3-2', type: 'source', content: 'Mensagem repassada 50 vezes no WhatsApp diz que o mundo vai acabar.', correctAnswer: 'Suspeito', explanation: 'Correntes de WhatsApp geralmente espalham boatos.' },
    { id: '3-3', type: 'source', content: 'Portal de notícias G1 publica matéria sobre economia.', correctAnswer: 'Confiável', explanation: 'Veículos de imprensa reconhecidos costumam checar os fatos.' },
    { id: '3-4', type: 'source', content: 'Blog desconhecido "VerdadesOcultas.xyz" denuncia conspiração mundial.', correctAnswer: 'Suspeito', explanation: 'Sites sem reputação não são fontes seguras.' },
    { id: '3-5', type: 'source', content: 'Artigo publicado na revista científica Nature.', correctAnswer: 'Confiável', explanation: 'Revistas científicas revisadas por pares são altamente confiáveis.' },
    { id: '3-6', type: 'source', content: 'Vídeo no TikTok de uma pessoa sem identificação ensinando um "remédio natural".', correctAnswer: 'Suspeito', explanation: 'Dicas de saúde em redes sociais precisam ser verificadas com médicos.' },
    { id: '3-7', type: 'source', content: 'Instituto Brasileiro de Geografia e Estatística (IBGE) divulga novos dados.', correctAnswer: 'Confiável', explanation: 'O IBGE é a principal fonte de dados oficiais do Brasil.' },
    { id: '3-8', type: 'source', content: 'Um amigo de um primo disse que viu um OVNI.', correctAnswer: 'Suspeito', explanation: 'Relatos de terceiros não são evidências concretas.' },
    { id: '3-9', type: 'source', content: 'Universidade de São Paulo (USP) anuncia nova pesquisa.', correctAnswer: 'Confiável', explanation: 'Universidades públicas são centros de pesquisa respeitados.' },
    { id: '3-10', type: 'source', content: 'Site com muitos erros de português pede seus dados bancários para prêmio.', correctAnswer: 'Suspeito', explanation: 'Tentativa clara de golpe (phishing).' }
  ];

  private module4Tasks: FactTask[] = [
    { id: '4-1', type: 'date', content: 'Notícia de 2012: "Fim do mundo ocorrerá em dezembro!" (Compartilhada hoje)', correctAnswer: 'Inválida', explanation: 'Notícia antiga usada fora de contexto.' },
    { id: '4-2', type: 'date', content: 'Notícia de hoje: "Governo lança novo programa de bolsas."', correctAnswer: 'Válida', explanation: 'A data condiz com o fato atual.' },
    { id: '4-3', type: 'date', content: 'Foto de protesto de 2015 compartilhada como se fosse de ontem.', correctAnswer: 'Inválida', explanation: 'Uso de imagens antigas para manipular a opinião atual.' },
    { id: '4-4', type: 'date', content: 'Previsão do tempo publicada na manhã de hoje.', correctAnswer: 'Válida', explanation: 'Informação útil e no tempo correto.' },
    { id: '4-5', type: 'date', content: 'Notícia de 2018 sobre greve de caminhoneiros causando pânico em 2024.', correctAnswer: 'Inválida', explanation: 'Causa pânico desnecessário por desinformação.' },
    { id: '4-6', type: 'date', content: 'Artigo de 2023 sobre uma nova lei que já entrou em vigor.', correctAnswer: 'Válida', explanation: 'O conteúdo histórico continua verdadeiro e útil.' },
    { id: '4-7', type: 'date', content: 'Alerta de enchente de 3 anos atrás circulando nos grupos.', correctAnswer: 'Inválida', explanation: 'Perigoso, pois confunde a população em tempo real.' },
    { id: '4-8', type: 'date', content: 'Boletim médico atualizado de uma figura pública hoje.', correctAnswer: 'Válida', explanation: 'Contexto temporal correto.' },
    { id: '4-9', type: 'date', content: 'Descoberta de cura do câncer de uma matéria de 2005.', correctAnswer: 'Inválida', explanation: 'Ciência avança; matérias antigas sobre curas geralmente são exageradas ou desatualizadas.' },
    { id: '4-10', type: 'date', content: 'Resultados da eleição deste ano divulgados hoje.', correctAnswer: 'Válida', explanation: 'Fato atual.' }
  ];

  private module5Tasks: FactTask[] = [
    { id: '5-1', type: 'grand_checker', content: 'O homem não foi à Lua.', correctAnswer: 'Fake News', explanation: 'Teoria da conspiração já desmentida.' },
    { id: '5-2', type: 'grand_checker', content: 'O SEGREDO PARA FICAR MILIONÁRIO EM 24H!', correctAnswer: 'Clickbait', explanation: 'Promessa exagerada para cliques.' },
    { id: '5-3', type: 'grand_checker', content: 'Olimpíadas de Paris ocorrem em 2024.', correctAnswer: 'Fato Verificado', explanation: 'Fato público e notório.' },
    { id: '5-4', type: 'grand_checker', content: 'Misturar esses dois ingredientes destrói qualquer vírus!', correctAnswer: 'Clickbait', explanation: 'Título caça-clique com falsa promessa.' },
    { id: '5-5', type: 'grand_checker', content: 'A vacina contém um chip de rastreamento.', correctAnswer: 'Fake News', explanation: 'Mentira absurda espalhada nas redes.' },
    { id: '5-6', type: 'grand_checker', content: 'A capital do Brasil é Brasília.', correctAnswer: 'Fato Verificado', explanation: 'Informação geográfica correta.' },
    { id: '5-7', type: 'grand_checker', content: 'Você não vai crer no que este cachorro fez.', correctAnswer: 'Clickbait', explanation: 'Clássico formato de clickbait.' },
    { id: '5-8', type: 'grand_checker', content: 'A Terra é plana.', correctAnswer: 'Fake News', explanation: 'Mito anticientífico.' },
    { id: '5-9', type: 'grand_checker', content: 'Cientistas descobrem novo planeta habitável.', correctAnswer: 'Fato Verificado', explanation: 'Fato possível e frequentemente noticiado com bases reais.' }, // Assuming it's based on a real verified fact format for the game
    { id: '5-10', type: 'grand_checker', content: 'Bomba! Celebridade revela tudo e a internet quebra.', correctAnswer: 'Clickbait', explanation: 'Exagero típico para atrair visitas.' }
  ];

  constructor(private progress: ProgressReporter) {
    this.loadState();
  }

  private loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.state.set(JSON.parse(saved));
    } else {
      this.startModule(0);
    }
  }

  private saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state()));
  }

  private shuffleArray(array: any[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  public startModule(faseIndex: number) {
    let tasks: FactTask[] = [];
    switch (faseIndex) {
      case 0: tasks = this.module1Tasks; break;
      case 1: tasks = this.module2Tasks; break;
      case 2: tasks = this.module3Tasks; break;
      case 3: tasks = this.module4Tasks; break;
      case 4: tasks = this.module5Tasks; break;
    }
    
    this.state.update(s => ({
      ...s,
      fase: faseIndex,
      taskIndex: 0,
      hearts: 3,
      currentTasks: this.shuffleArray(tasks).slice(0, 10)
    }));
    this.saveState();
  }

  public submitAnswer(answer: string): boolean {
    const st = this.state();
    if (st.isGameOver || st.isGameWon) return false;

    const currentTask = st.currentTasks[st.taskIndex];
    const isCorrect = currentTask.correctAnswer === answer;

    if (isCorrect) {
      const nextTaskIndex = st.taskIndex + 1;
      if (nextTaskIndex >= 10) {
        // Module complete
        this.completePhase(st.fase === 4);
      } else {
        this.state.update(s => ({ ...s, taskIndex: nextTaskIndex, score: s.score + 10 }));
        this.saveState();
      }
      return true;
    } else {
      // Wrong answer
      this.reportMistake();
      const newHearts = st.hearts - 1;
      if (newHearts <= 0) {
        // Module failed
        this.state.update(s => ({ ...s, hearts: 0 }));
        this.saveState();
      } else {
        this.state.update(s => ({ ...s, hearts: newHearts }));
        this.saveState();
      }
      return false;
    }
  }

  public restartModule() {
    this.startModule(this.state().fase);
  }

  public resetGame() {
    this.state.set(this.defaultState);
    this.startModule(0);
  }

  private completePhase(isLastLevel: boolean) {
    const st = this.state();
    this.progress.report({
      levelId: `fase-${st.fase}`,
      fase: st.fase,
      result: 'success',
      attempts: 1, // simplified for this structure
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });

    if (isLastLevel) {
      this.state.update(s => ({ ...s, isGameWon: true }));
    } else {
      this.startModule(st.fase + 1);
    }
  }

  private reportMistake() {
    const st = this.state();
    this.progress.report({
      levelId: `fase-${st.fase}`,
      fase: st.fase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });
  }
}
