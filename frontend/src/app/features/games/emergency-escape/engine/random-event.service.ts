import { Injectable } from '@angular/core';
import { CellType, RandomFireConfig } from '../content/level.model';

export interface Position {
  r: number;
  c: number;
}

@Injectable({ providedIn: 'root' })
export class RandomEventService {
  /**
   * Sorteia, célula por célula, se uma zona de risco (tipo 3) vira fogo (tipo 4).
   * Muta o grid diretamente (mesma referência), como o GameEngine espera.
   *
   * Regras de justiça — importantes pro público (6 a 10 anos):
   *  - só ignifica células JÁ marcadas como zona de risco no nível (tipo 3),
   *    nunca uma célula livre qualquer;
   *  - nunca ignifica a célula onde o jogador está agora em cima dele;
   *  - a chance é por-célula (config.probabilityPerRiskCell), não "sorteia 1
   *    célula do mapa inteiro" — isso evita que zonas de risco distantes do
   *    caminho do aluno peguem fogo à toa e o façam perder por algo invisível.
   */
  tryIgniteRiskCells(grid: CellType[][], config: RandomFireConfig, player: Position): void {
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] !== 3) continue;
        if (r === player.r && c === player.c) continue;

        if (Math.random() < config.probabilityPerRiskCell) {
          grid[r][c] = 4;
        }
      }
    }
  }
}