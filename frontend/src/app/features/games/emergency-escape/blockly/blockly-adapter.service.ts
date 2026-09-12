import { Injectable } from '@angular/core';
import * as Blockly from 'blockly';
import { BlockType, LevelConfig } from '../content/level.model';
import { Direction, ProgramNode } from '../engine/block-interpreter';
import { defineCustomBlocks } from './custom-blocks';
import { blocklyDarkTheme } from './blockly-dark.theme';

const DIRECTION_BY_BLOCK: Partial<Record<BlockType, Direction>> = {
  move_up: 'up',
  move_down: 'down',
  move_left: 'left',
  move_right: 'right'
};

export interface ExtractResult {
  program: ProgramNode[];
  /** Presente quando o workspace não pôde ser convertido (ex: blocos soltos). */
  error?: string;
}

/**
 * Única camada que conhece Blockly de verdade (fora de custom-blocks.ts e
 * blockly-dark.theme.ts). GameEngine e block-interpreter nunca importam
 * 'blockly' — só recebem o ProgramNode[] que sai daqui.
 */
@Injectable({ providedIn: 'root' })
export class BlocklyAdapterService {
  inject(container: HTMLElement, level: LevelConfig): Blockly.WorkspaceSvg {
    defineCustomBlocks();

    return Blockly.inject(container, {
      toolbox: this.buildToolbox(level),
      maxInstances: this.buildMaxInstances(level),
      scrollbars: true,
      trashcan: true,
      theme: blocklyDarkTheme
    });
  }

  dispose(workspace: Blockly.WorkspaceSvg): void {
    workspace.dispose();
  }

  /** Quantos blocos de cada tipo estão no workspace agora — pro painel de inventário. */
  countBlocksByType(workspace: Blockly.WorkspaceSvg): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const block of workspace.getAllBlocks(false)) {
      counts[block.type] = (counts[block.type] ?? 0) + 1;
    }
    return counts;
  }

  /**
   * Converte o workspace em ProgramNode[]. Exige uma única sequência
   * encaixada (mesma regra de validação que o código original tinha).
   */
  extractProgram(workspace: Blockly.WorkspaceSvg): ExtractResult {
    const topBlocks = workspace.getTopBlocks(true);

    if (topBlocks.length === 0) {
      return { program: [], error: 'Arraste os blocos para a área de trabalho antes de executar.' };
    }
    if (topBlocks.length > 1) {
      return { program: [], error: 'Encaixe todos os blocos juntos em uma única sequência.' };
    }

    return { program: this.parseSequence(topBlocks[0]) };
  }

  private parseSequence(firstBlock: Blockly.Block): ProgramNode[] {
    const nodes: ProgramNode[] = [];
    let current: Blockly.Block | null = firstBlock;
    while (current) {
      nodes.push(...this.parseBlock(current));
      current = current.getNextBlock();
    }
    return nodes;
  }

  private parseBlock(block: Blockly.Block): ProgramNode[] {
    const direction = DIRECTION_BY_BLOCK[block.type as BlockType];
    if (direction) {
      return [{ kind: 'move', direction }];
    }

    if (block.type === 'if_fire') {
      return [{ kind: 'if_fire' }];
    }

    if (block.type === 'repeat_loop') {
      const times = block.getFieldValue('TIMES');
      const child = block.getInputTargetBlock('DO');
      const body = child ? this.parseSequence(child) : [];
      return [{ kind: 'repeat', times, body }];
    }

    return [];
  }

  private buildToolbox(level: LevelConfig): Blockly.utils.toolbox.ToolboxDefinition {
    return {
      kind: 'flyoutToolbox',
      contents: level.availableBlocks.map(type => ({ kind: 'block', type }))
    };
  }

  private buildMaxInstances(level: LevelConfig): Record<string, number> {
    const limits: Record<string, number> = {};
    for (const limit of level.blockLimits ?? []) {
      limits[limit.type] = limit.max;
    }
    return limits;
  }
}