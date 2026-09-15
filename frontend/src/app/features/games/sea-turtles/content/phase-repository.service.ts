import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PhaseConfig } from './phase.model';

import fase1 from './phases/fase-1.json';
import fase2 from './phases/fase-2.json';
import fase3 from './phases/fase-3.json';
import fase4 from './phases/fase-4.json';
import fase5 from './phases/fase-5.json';
import fase6 from './phases/fase-6.json';
import fase7 from './phases/fase-7.json';
import fase8 from './phases/fase-8.json';
import fase9 from './phases/fase-9.json';
import fase10 from './phases/fase-10.json';
import fase11 from './phases/fase-11.json';
import fase12 from './phases/fase-12.json';
import fase13 from './phases/fase-13.json';
import fase14 from './phases/fase-14.json';
import fase15 from './phases/fase-15.json';

export abstract class PhaseRepository {
  abstract getPhase(fase: number): Observable<PhaseConfig>;
  abstract getAllPhases(): Observable<PhaseConfig[]>;
}

@Injectable({ providedIn: 'root' })
export class LocalPhaseRepositoryService implements PhaseRepository {
  // Adicionar aqui conforme cada mecânica ganhar conteúdo real.
  private readonly phases: PhaseConfig[] = [
    fase1, fase2, fase3, fase4, fase5, fase6, fase7, fase8, fase9,
    fase10, fase11, fase12, fase13, fase14, fase15
  ] as PhaseConfig[];

  getPhase(fase: number): Observable<PhaseConfig> {
    const phase = this.phases.find(p => p.fase === fase);
    if (!phase) {
      throw new Error(`Fase ${fase} ainda não tem conteúdo implementado.`);
    }
    return of(phase);
  }

  getAllPhases(): Observable<PhaseConfig[]> {
    return of(this.phases);
  }
}