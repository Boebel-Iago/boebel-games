import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LevelConfig } from './level.model';

import fase1 from './levels/fase-1.json';
import fase2 from './levels/fase-2.json';
import fase3 from './levels/fase-3.json';
import fase4 from './levels/fase-4.json';
import fase5 from './levels/fase-5.json';
import fase6 from './levels/fase-6.json';
import fase7 from './levels/fase-7.json';
import fase8 from './levels/fase-8.json';
import fase9 from './levels/fase-9.json';
import fase10 from './levels/fase-10.json';
import fase11 from './levels/fase-11.json';
import fase12 from './levels/fase-12.json';
import fase13 from './levels/fase-13.json';
import fase14 from './levels/fase-14.json';
import fase15 from './levels/fase-15.json';

/**
 * Contrato que qualquer fonte de níveis precisa cumprir.
 * Hoje: LocalLevelRepositoryService (lê JSON do bundle).
 * Futuro: ApiLevelRepositoryService (busca do backend Java via token do professor).
 */
export abstract class LevelRepository {
  abstract getLevel(fase: number): Observable<LevelConfig>;
  abstract getAllLevels(): Observable<LevelConfig[]>;
}

@Injectable({ providedIn: 'root' })
export class LocalLevelRepositoryService implements LevelRepository {
  private readonly levels: LevelConfig[] = [
    fase1, fase2, fase3, fase4, fase5, fase6, fase7, fase8,
    fase9, fase10, fase11, fase12, fase13, fase14, fase15
  ] as LevelConfig[];

  getLevel(fase: number): Observable<LevelConfig> {
    const level = this.levels.find(l => l.fase === fase);
    if (!level) {
      throw new Error(`Nível da fase ${fase} não encontrado.`);
    }
    return of(level);
  }

  getAllLevels(): Observable<LevelConfig[]> {
    if (sessionStorage.getItem('isDemoMode') === 'true') {
      return of(this.levels.slice(0, 2));
    }
    return of(this.levels);
  }
}