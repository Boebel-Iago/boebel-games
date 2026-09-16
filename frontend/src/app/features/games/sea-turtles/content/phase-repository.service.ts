import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PhaseConfig } from './phase.model';

import fase1 from './phases/fase-1.json';
import fase2 from './phases/fase-2.json';
import fase3 from './phases/fase-3.json';
import fase4 from './phases/fase-4.json';

export abstract class PhaseRepository {
  abstract getPhase(fase: number): Observable<PhaseConfig>;
  abstract getAllPhases(): Observable<PhaseConfig[]>;
}

@Injectable({ providedIn: 'root' })
export class LocalPhaseRepositoryService implements PhaseRepository {
  // Adicionar aqui conforme cada mecânica ganhar conteúdo real.
  private readonly phases: PhaseConfig[] = [fase1, fase2, fase3, fase4] as PhaseConfig[];

  getPhase(fase: number): Observable<PhaseConfig> {
    const phase = this.phases.find(p => p.fase === fase);
    if (!phase) {
      throw new Error(`Fase ${fase} ainda não tem conteúdo implementado.`);
    }
    return of(phase);
  }

  getAllPhases(): Observable<PhaseConfig[]> {
    if (sessionStorage.getItem('isDemoMode') === 'true') {
      return of(this.phases.slice(0, 2));
    }
    return of(this.phases);
  }
}