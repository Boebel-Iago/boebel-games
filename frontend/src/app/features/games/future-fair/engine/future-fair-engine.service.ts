import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * FutureFairEngineService
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class FutureFairEngineService {
  fase: number = 0;
}
