import * as Blockly from 'blockly';

let alreadyDefined = false;

export function defineAlgorithmBlocks(): void {
  if (alreadyDefined) return;

  Blockly.defineBlocksWithJsonArray([
    { type: 'algo_move_up', message0: '⬆️ CIMA', previousStatement: null, nextStatement: null, colour: 175 },
    { type: 'algo_move_down', message0: '⬇️ BAIXO', previousStatement: null, nextStatement: null, colour: 175 },
    { type: 'algo_move_left', message0: '⬅️ ESQUERDA', previousStatement: null, nextStatement: null, colour: 175 },
    { type: 'algo_move_right', message0: '➡️ DIREITA', previousStatement: null, nextStatement: null, colour: 175 }
  ]);

  alreadyDefined = true;
}