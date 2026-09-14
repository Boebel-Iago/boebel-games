export interface NarrativeLine {
  speaker: string;
  avatar: string;
  text: string;
}

export type ActivityType =
  | 'classify'
  | 'pattern'
  | 'sequence-order'
  | 'algorithm'
  | 'icon-message'
  | 'quiz-artifact'
  | 'safety-scenario';

export interface BasePhaseConfig {
  id: string;
  fase: number;
  /** Códigos BNCC trabalhados nessa fase, ex: ['EF01CO01']. */
  skillCodes: string[];
  title: string;
  objective: string;
  briefing: NarrativeLine[];
}

// ---------- Mecânica 1: Classificar (fases 1-2) ----------
export interface ClassifyItem {
  id: string;
  label: string;
  emoji: string;
  correctBucket: string;
}

export interface ClassifyBucket {
  id: string;
  label: string;
  emoji: string;
}

export interface ClassifyPhaseConfig extends BasePhaseConfig {
  activityType: 'classify';
  buckets: ClassifyBucket[];
  items: ClassifyItem[];
}

// ---------- Mecânica 2: Padrão/Informação (fases 3-4) ----------
export interface PatternOption {
  id: string;
  emoji: string;
  /** Texto opcional junto do emoji (útil pra rodadas tipo "Sim"/"Não"). */
  label?: string;
  isCorrect: boolean;
}

export interface PatternRound {
  id: string;
  prompt: string;
  /** Sequência mostrada como contexto (pode ter um '❓' marcando a lacuna, ou ser um único item pra julgar). */
  contextSequence: string[];
  options: PatternOption[];
}

export interface PatternPhaseConfig extends BasePhaseConfig {
  activityType: 'pattern';
  rounds: PatternRound[];
}

// ---------- Mecânica 3: Ordenar sequência (fases 5-6) — a implementar ----------
export interface SequenceCard {
  id: string;
  label: string;
  emoji: string;
  correctOrder: number;
}

export interface SequenceOrderPhaseConfig extends BasePhaseConfig {
  activityType: 'sequence-order';
  cards: SequenceCard[];
}

// ---------- Mecânica 4: Algoritmo (fases 7-9) — a implementar, reaproveita motor Blockly simplificado ----------
export type AlgorithmCellType = 0 | 1 | 2; // livre | parede | porta (sem fogo/zona de risco aqui)
export type AlgorithmBlockType = 'move_up' | 'move_down' | 'move_left' | 'move_right';

export interface AlgorithmPhaseConfig extends BasePhaseConfig {
  activityType: 'algorithm';
  grid: AlgorithmCellType[][];
  startPosition: { r: number; c: number };
  availableBlocks: AlgorithmBlockType[];
}

// ---------- Mecânica 5: Mensagem com ícones (fases 10-11) — a implementar ----------
export interface IconOption {
  id: string;
  emoji: string;
  meaning: string;
}

export interface IconMessagePhaseConfig extends BasePhaseConfig {
  activityType: 'icon-message';
  targetMessage: string;
  availableIcons: IconOption[];
  correctSequence: string[];
}

// ---------- Mecânica 6: Quiz de artefatos (fases 12-13) — a implementar ----------
export interface QuizArtifactQuestion {
  id: string;
  emoji: string;
  label: string;
  isComputationalArtifact: boolean;
}

export interface QuizArtifactPhaseConfig extends BasePhaseConfig {
  activityType: 'quiz-artifact';
  questions: QuizArtifactQuestion[];
}

// ---------- Mecânica 7: Cenário de segurança (fases 14-15) — a implementar ----------
export interface SafetyScenarioOption {
  id: string;
  text: string;
  isSafe: boolean;
  feedback: string;
}

export interface SafetyScenario {
  id: string;
  situation: string;
  options: SafetyScenarioOption[];
}

export interface SafetyScenarioPhaseConfig extends BasePhaseConfig {
  activityType: 'safety-scenario';
  scenarios: SafetyScenario[];
}

export type PhaseConfig =
  | ClassifyPhaseConfig
  | PatternPhaseConfig
  | SequenceOrderPhaseConfig
  | AlgorithmPhaseConfig
  | IconMessagePhaseConfig
  | QuizArtifactPhaseConfig
  | SafetyScenarioPhaseConfig;