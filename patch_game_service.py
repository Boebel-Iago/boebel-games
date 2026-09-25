with open('frontend/src/app/core/services/game.service.ts', 'r') as f:
    text = f.read()

# Update payload interface
text = text.replace(
    '  gameFinished: boolean;\n}',
    '  gameFinished: boolean;\n  score?: number;\n  gameState?: string;\n}'
)

# Update updateGameProgress signature
text = text.replace(
    'isFinished: boolean): Observable<any> {',
    'isFinished: boolean, score?: number, gameState?: string): Observable<any> {'
)

# Update payload object
text = text.replace(
    '      gameFinished: isFinished\n    };',
    '      gameFinished: isFinished,\n      score: score,\n      gameState: gameState\n    };'
)

# Add fetchSessionStatus
fetch_method = '''
  fetchSessionStatus(sessionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${sessionId}/status`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          alert('⏸️ Esta sala foi pausada ou encerrada pelo professor!\\n\\nVocê será redirecionado.');
          sessionStorage.clear();
          this.router.navigate(['/']);
        }
        return throwError(() => error);
      })
    );
  }
'''
text = text.replace('updateGameProgress(', fetch_method + '\n  updateGameProgress(')

with open('frontend/src/app/core/services/game.service.ts', 'w') as f:
    f.write(text)
