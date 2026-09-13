// Tipos de célula do grid. Mantido igual ao código original pra não perder os mapas já feitos.
// 0 = livre | 1 = escombro (parede) | 2 = porta (objetivo) | 3 = zona de risco | 4 = fogo ativo
export type CellType = 0 | 1 | 2 | 3 | 4;

export type BlockType =
  | 'move_up'
  | 'move_down'
  | 'move_left'
  | 'move_right'
  | 'if_fire'
  | 'repeat_loop';

export interface BlockLimit {
  type: BlockType;
  max: number;
}

export interface RandomFireConfig {
  enabled: boolean;
  /** Chance (0 a 1) de CADA célula tipo "zona de risco" virar fogo durante a execução. */
  probabilityPerRiskCell: number;
  /** Evita que o fogo nasça já no primeiro passo, dando tempo do aluno reagir. */
  minStepsBeforeFirstEvent?: number;
}

export interface NarrativeLine {
  /** Nome do personagem-guia (ex: "Capitão Alerta"). */
  speaker: string;
  /** Emoji usado como avatar na tela de briefing. */
  avatar: string;
  text: string;
}

export interface LevelConfig {
  id: string;
  fase: 1 | 2 | 3;
  title: string;
  /** Texto mostrado no painel amarelo de instrução (⚠️ OBJETIVO). */
  objective: string;
  /** Falas mostradas em sequência ANTES da fase liberar o jogo. */
  briefing: NarrativeLine[];
  grid: CellType[][];
  startPosition: { r: number; c: number };
  /** Quais blocos aparecem na toolbox do Blockly nesta fase. */
  availableBlocks: BlockType[];
  /** Ausente = sem limite de quantidade para nenhum bloco. */
  blockLimits?: BlockLimit[];
  /** Ausente = fase sem aleatoriedade (Fases 1 e 2). Presente = Fase 3. */
  randomFire?: RandomFireConfig;
  /**
   * Se true, o motor avisa o aluno antes de rodar caso nenhum bloco "if_fire"
   * tenha sido usado — mas ainda permite executar (ver GameEngine.validateBeforeRun).
   */
  requireConditional?: boolean;
}