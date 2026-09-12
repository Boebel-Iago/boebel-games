import * as Blockly from 'blockly';
import { BlockType } from '../content/level.model';

/** Usado pelo componente pra desenhar o painel "Restam: X". */
export const BLOCK_LABELS: Record<BlockType, string> = {
  move_up: '⬆️',
  move_down: '⬇️',
  move_left: '⬅️',
  move_right: '➡️',
  if_fire: '🤔🔥',
  repeat_loop: '🔁 Loop'
};

let alreadyDefined = false;

/**
 * Blockly.defineBlocksWithJsonArray reclama se chamado duas vezes com os
 * mesmos tipos. Como o componente pode reinicializar o workspace a cada
 * troca de fase, esse guard evita redefinir os blocos à toa.
 */
export function defineCustomBlocks(): void {
  if (alreadyDefined) return;

  Blockly.defineBlocksWithJsonArray([
    { type: 'move_up', message0: '⬆️ CIMA', previousStatement: null, nextStatement: null, colour: 230 },
    { type: 'move_down', message0: '⬇️ BAIXO', previousStatement: null, nextStatement: null, colour: 230 },
    { type: 'move_left', message0: '⬅️ ESQUERDA', previousStatement: null, nextStatement: null, colour: 230 },
    { type: 'move_right', message0: '➡️ DIREITA', previousStatement: null, nextStatement: null, colour: 230 },
    {
      type: 'if_fire',
      message0: '🤔 SE ⚠️ FOGO ENTÃO 🧯 APAGAR',
      previousStatement: null,
      nextStatement: null,
      colour: 35
    },
    {
      type: 'repeat_loop',
      message0: '🔁 REPETIR %1 VEZES %2 %3',
      args0: [
        { type: 'field_number', name: 'TIMES', value: 2, min: 1, max: 20 },
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 120
    }
  ]);

  alreadyDefined = true;
}