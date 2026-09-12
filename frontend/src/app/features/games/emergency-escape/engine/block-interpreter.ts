export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Árvore de programa genérica. Quem monta isso a partir do workspace do
 * Blockly é o blockly-adapter.service.ts — este arquivo nunca importa Blockly.
 */
export type ProgramNode =
  | { kind: 'move'; direction: Direction }
  | { kind: 'if_fire' }
  | { kind: 'repeat'; times: number; body: ProgramNode[] };

/**
 * Um passo atômico que o GameEngine sabe aplicar ao grid.
 */
export type InterpreterStep =
  | { type: 'move'; direction: Direction }
  | { type: 'check_fire' };

/**
 * Percorre a árvore e emite (yield) um passo por vez.
 *
 * Importante: loops NÃO são desenrolados numa lista gigante antes de começar.
 * O generator entra dentro do 'repeat' e sai dele em tempo real (via yield*),
 * então o motor consome um passo por tick e o cenário pode mudar entre um
 * passo e outro — inclusive no meio de uma repetição. É isso que permite o
 * fogo da Fase 3 nascer DURANTE a execução, não só antes dela começar.
 */
export function* runProgram(nodes: ProgramNode[]): Generator<InterpreterStep, void, void> {
  for (const node of nodes) {
    switch (node.kind) {
      case 'move':
        yield { type: 'move', direction: node.direction };
        break;

      case 'if_fire':
        yield { type: 'check_fire' };
        break;

      case 'repeat':
        for (let i = 0; i < node.times; i++) {
          yield* runProgram(node.body);
        }
        break;
    }
  }
}

/** Usado pela validação de "condicional obrigatório" (Fase 3). */
export function containsConditional(nodes: ProgramNode[]): boolean {
  return nodes.some(
    n => n.kind === 'if_fire' || (n.kind === 'repeat' && containsConditional(n.body))
  );
}