with open('frontend/src/app/core/services/ticket.service.ts', 'r') as f:
    text = f.read()

delete_session = '''
  deleteSession(sessionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sessions/${sessionId}`);
  }
'''
text = text.replace('  deleteTicket(id: string): Observable<any> {', delete_session + '\n  deleteTicket(id: string): Observable<any> {')

with open('frontend/src/app/core/services/ticket.service.ts', 'w') as f:
    f.write(text)
