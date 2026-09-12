import { GameEngine } from './game-engine';
import { RandomEventService } from './random-event.service';
import { ProgramNode } from './block-interpreter';
import { LevelConfig } from '../content/level.model';

function makeLevel(overrides: Partial<LevelConfig> = {}): LevelConfig {
  return {
    id: 'test-level',
    fase: 1,
    title: 'Teste',
    objective: '',
    grid: [
      [0, 0, 0],
      [1, 0, 1],
      [0, 0, 2]
    ],
    startPosition: { r: 0, c: 0 },
    availableBlocks: ['move_up', 'move_down', 'move_left', 'move_right'],
    ...overrides
  };
}

describe('GameEngine', () => {
  let engine: GameEngine;
  let randomEvents: RandomEventService;

  beforeEach(() => {
    randomEvents = new RandomEventService();
    engine = new GameEngine(randomEvents);
  });

  it('move para célula livre retorna "moved" e atualiza a posição', () => {
    engine.loadLevel(makeLevel());
    engine.startRun([{ kind: 'move', direction: 'right' }]);

    const outcome = engine.next();

    expect(outcome).toEqual({ type: 'moved', r: 0, c: 1 });
    expect(engine.getPlayerPosition()).toEqual({ r: 0, c: 1 });
  });

  it('move contra escombro (tipo 1) retorna "blocked_wall" e não move o jogador', () => {
    engine.loadLevel(makeLevel());
    engine.startRun([{ kind: 'move', direction: 'down' }]); // (0,0) -> (1,0) é parede

    const outcome = engine.next();

    expect(outcome).toEqual({ type: 'blocked_wall' });
    expect(engine.getPlayerPosition()).toEqual({ r: 0, c: 0 });
  });

  it('chegar na porta (tipo 2) retorna "reached_goal"', () => {
    engine.loadLevel(makeLevel());
    const program: ProgramNode[] = [
      { kind: 'move', direction: 'right' },
      { kind: 'move', direction: 'right' },
      { kind: 'move', direction: 'down' },
      { kind: 'move', direction: 'down' }
    ];
    engine.startRun(program);

    let last;
    for (let i = 0; i < program.length; i++) last = engine.next();

    expect(last).toEqual({ type: 'reached_goal' });
    expect(engine.isOnGoal()).toBeTrue();
  });

  it('"repeat" desenrola corretamente sem precisar desenrolar antes (2x direita)', () => {
    engine.loadLevel(makeLevel());
    engine.startRun([{ kind: 'repeat', times: 2, body: [{ kind: 'move', direction: 'right' }] }]);

    engine.next(); // 1ª direita
    const second = engine.next(); // 2ª direita

    expect(second).toEqual({ type: 'moved', r: 0, c: 2 });
    expect(engine.next()).toBeNull(); // generator terminou
  });

  it('"check_fire" apaga fogo adjacente e retorna as células apagadas', () => {
    const level = makeLevel({
      grid: [
        [0, 4, 0],
        [1, 0, 1],
        [0, 0, 2]
      ]
    });
    engine.loadLevel(level);
    engine.startRun([{ kind: 'if_fire' }]);

    const outcome = engine.next();

    expect(outcome).toEqual({ type: 'extinguished', cells: [{ r: 0, c: 1 }] });
    expect(engine.getGrid()[0][1]).toBe(0);
  });

  it('fogo aleatório nunca nasce em cima do jogador (regra de justiça)', () => {
    spyOn(Math, 'random').and.returnValue(0); // sempre "sorteia" verdadeiro
    const level = makeLevel({
      grid: [
        [3, 0, 0],
        [1, 0, 1],
        [0, 0, 2]
      ],
      randomFire: { enabled: true, probabilityPerRiskCell: 1, minStepsBeforeFirstEvent: 0 }
    });
    engine.loadLevel(level);
    // jogador começa em cima da própria zona de risco (0,0)
    engine.startRun([{ kind: 'move', direction: 'right' }]);

    engine.next();

    expect(engine.getGrid()[0][0]).toBe(3); // não virou fogo, mesmo com random=0
  });
});