import { Injectable } from '@angular/core';
import * as Blockly from 'blockly';
import { AlgorithmBlockType, AlgorithmPhaseConfig } from '../content/phase.model';
import { Direction } from '../engine/algorithm-engine';
import { defineAlgorithmBlocks } from './algorithm-custom-blocks';
import { seaTurtlesBlocklyTheme } from './algorithm-blockly-theme';

const BLOCK_TO_DIRECTION: Record<string, Direction> = {
  algo_move_up: 'up',
  algo_move_down: 'down',
  algo_move_left: 'left',
  algo_move_right: 'right'
};

const DIRECTION_TO_BLOCK: Record<AlgorithmBlockType, string> = {
  move_up: 'algo_move_up',
  move_down: 'algo_move_down',
  move_left: 'algo_move_left',
  move_right: 'algo_move_right'
};

export interface ExtractResult {
  moves: Direction[];
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AlgorithmBlocklyAdapterService {
  inject(container: HTMLElement, phase: AlgorithmPhaseConfig): Blockly.WorkspaceSvg {
    defineAlgorithmBlocks();

    return Blockly.inject(container, {
      toolbox: {
        kind: 'flyoutToolbox',
        contents: phase.availableBlocks.map((b: AlgorithmBlockType) => ({ kind: 'block', type: DIRECTION_TO_BLOCK[b] }))
      },
      scrollbars: true,
      trashcan: true,
      theme: seaTurtlesBlocklyTheme
    });
  }

  dispose(workspace: Blockly.WorkspaceSvg): void {
    workspace.dispose();
  }

  /** Sem loop nem condicional aqui, então a "árvore" é sempre uma lista plana. */
  extractProgram(workspace: Blockly.WorkspaceSvg): ExtractResult {
    const topBlocks = workspace.getTopBlocks(true);
    if (topBlocks.length === 0) {
      return { moves: [], error: 'Arraste os blocos pra área de trabalho antes de executar.' };
    }
    if (topBlocks.length > 1) {
      return { moves: [], error: 'Encaixe todos os blocos juntos em uma única sequência.' };
    }

    const moves: Direction[] = [];
    let current: Blockly.Block | null = topBlocks[0];
    while (current) {
      const dir = BLOCK_TO_DIRECTION[current.type];
      if (dir) moves.push(dir);
      current = current.getNextBlock();
    }
    return { moves };
  }
}