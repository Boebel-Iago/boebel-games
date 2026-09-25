with open('frontend/src/app/core/services/progress-reporter.service.ts', 'r') as f:
    text = f.read()

text = text.replace(
    'isLastLevel: boolean; // NOVO: O jogo que avisa se ele acabou!\n}',
    'isLastLevel: boolean; // NOVO: O jogo que avisa se ele acabou!\n  score?: number;\n  gameState?: string;\n}'
)

fetch = '''
  fetchSessionState(): import('rxjs').Observable<any> | null {
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) return null;
    return this.gameService.fetchSessionStatus(sessionId);
  }
'''
text = text.replace('  report(data: ProgressData): void {', fetch + '\n  report(data: ProgressData): void {')

text = text.replace(
    'this.gameService.updateGameProgress(sessionId, nextStage, this.mistakesInCurrentLevel, data.isLastLevel)',
    'this.gameService.updateGameProgress(sessionId, nextStage, this.mistakesInCurrentLevel, data.isLastLevel, data.score, data.gameState)'
)

with open('frontend/src/app/core/services/progress-reporter.service.ts', 'w') as f:
    f.write(text)
