import { Injectable } from '@angular/core';

export type LevelResult = 'success' | 'failure';

export interface ProgressEvent {
  levelId: string;
  fase: number;
  result: LevelResult;
  attempts: number;
  timestamp: string; // ISO 8601
  isLastLevel?: boolean;
}

/**
 * Contrato pra reportar progresso. Hoje: NoopProgressReporterService (loga
 * no console). Futuro: ApiProgressReporterService enviando pro backend Java,
 * autenticado com o mesmo token do professor que já protege a rota
 * (ticketGuard). Quem consome (o componente) nunca muda.
 */
export abstract class ProgressReporter {
  abstract report(event: ProgressEvent): void;
}

@Injectable({ providedIn: 'root' })
export class NoopProgressReporterService implements ProgressReporter {
  report(event: ProgressEvent): void {
    console.debug('[emergency-escape] progresso (ainda não persistido):', event);
  }
}