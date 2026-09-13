export interface TierDefinition {
    id: string;
    label: string;
    /** Inclusive nos dois extremos. */
    fromFase: number;
    toFase: number;
    description: string;
  }
  
  /** 6 faixas cobrindo as 15 fases (2+2+2+2+3+4 = 15). */
  export const TIERS: TierDefinition[] = [
    { id: 'livre', label: 'Livre', fromFase: 1, toFase: 2,
      description: 'Blocos ilimitados — qualquer caminho até a porta serve.' },
    { id: 'limitado', label: 'Blocos Limitados', fromFase: 3, toFase: 4,
      description: 'Quantidade exata de blocos — exige planejamento antes de arrastar.' },
    { id: 'loops', label: 'Repetições', fromFase: 5, toFase: 6,
      description: 'Libera o bloco de REPETIR pra economizar blocos em padrões que se repetem.' },
    { id: 'loops-aninhados', label: 'Repetições Aninhadas', fromFase: 7, toFase: 8,
      description: 'Um REPETIR dentro de outro REPETIR.' },
    { id: 'condicional', label: 'Tudo Junto + Condicionais', fromFase: 9, toFase: 11,
      description: 'Zonas de risco, fogo aleatório e o bloco condicional "SE FOGO".' },
    { id: 'final', label: 'Desafio Final', fromFase: 12, toFase: 15,
      description: 'Todos os conceitos combinados, no nível mais difícil.' }
  ];
  
  export const TOTAL_LEVELS = 15;
  
  export function getTierForFase(fase: number): TierDefinition {
    const tier = TIERS.find(t => fase >= t.fromFase && fase <= t.toFase);
    if (!tier) {
      throw new Error(`Nenhuma faixa de dificuldade encontrada para a fase ${fase}.`);
    }
    return tier;
  }