export interface SkillTierDefinition {
  id: string;
  skillCodes: string[];
  label: string;
  fromFase: number;
  toFase: number;
  activityType: string;
}

/** As 7 faixas de habilidade cobrindo as 15 fases planejadas (2+2+2+3+2+2+2 = 15). */
export const SKILL_TIERS: SkillTierDefinition[] = [
  { id: 'classificar', skillCodes: ['EF01CO01'], label: 'Organizar e Classificar',
    fromFase: 1, toFase: 2, activityType: 'classify' },
  { id: 'padroes-informacao', skillCodes: ['EF01CO01', 'EF01CO04'], label: 'Padrões e Informação',
    fromFase: 3, toFase: 4, activityType: 'pattern' },
  { id: 'sequencias', skillCodes: ['EF01CO02'], label: 'Sequências do Dia a Dia',
    fromFase: 5, toFase: 6, activityType: 'sequence-order' },
  { id: 'algoritmo', skillCodes: ['EF01CO03'], label: 'Criando Algoritmos',
    fromFase: 7, toFase: 9, activityType: 'algorithm' },
  { id: 'codificacao', skillCodes: ['EF01CO04', 'EF01CO05'], label: 'Informação e Codificação',
    fromFase: 10, toFase: 11, activityType: 'icon-message' },
  { id: 'artefatos', skillCodes: ['EF01CO06'], label: 'Artefatos Computacionais',
    fromFase: 12, toFase: 13, activityType: 'quiz-artifact' },
  { id: 'seguranca', skillCodes: ['EF01CO07'], label: 'Segurança Digital',
    fromFase: 14, toFase: 15, activityType: 'safety-scenario' }
];

export const TOTAL_PHASES_PLANNED = 15;

/**
 * Quantas fases já têm conteúdo real no repositório. Atualizar esse número
 * cada vez que uma nova mecânica ganhar as fases JSON correspondentes —
 * é o que o orquestrador usa pra saber até onde pode avançar.
 */
export const TOTAL_PHASES_IMPLEMENTED = 15;