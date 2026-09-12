import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LevelConfig } from './level.model';

import fase1 from './levels/fase-1.json';
import fase2 from './levels/fase-2.json';
import fase3 from './levels/fase-3.json';

/**
 * Contrato que qualquer fonte de níveis precisa cumprir.
 * Hoje: LocalLevelRepositoryService (lê JSON do bundle).
 * Futuro: ApiLevelRepositoryService (busca do backend Java via token do professor).
 * O GameEngine e o componente só conhecem esta interface, nunca a implementação.
 */
export abstract class LevelRepository {
  abstract getLevel(fase: 1 | 2 | 3): Observable<LevelConfig>;
  abstract getAllLevels(): Observable<LevelConfig[]>;
}

@Injectable({ providedIn: 'root' })
export class LocalLevelRepositoryService implements LevelRepository {
  private readonly levels: LevelConfig[] = [
    fase1 as LevelConfig,
    fase2 as LevelConfig,
    fase3 as LevelConfig
  ];

  getLevel(fase: 1 | 2 | 3): Observable<LevelConfig> {
    const level = this.levels.find(l => l.fase === fase);
    if (!level) {
      throw new Error(`Nível da fase ${fase} não encontrado.`);
    }
    return of(level);
  }

  getAllLevels(): Observable<LevelConfig[]> {
    return of(this.levels);
  }
}