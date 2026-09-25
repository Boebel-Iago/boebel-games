import os
import glob

html_button = '\n<!-- Sair da Sala -->\n<button (click)="leaveRoom()" class="fixed top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-xl font-bold z-50 shadow-lg hover:bg-red-600 transition-colors border-2 border-red-700">🚪 Sair da Sala</button>\n'

ts_method = '''
  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
'''

for root, dirs, files in os.walk('frontend/src/app/features/games'):
    for file in files:
        if file.endswith('.component.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            if 'leaveRoom()' not in content:
                with open(filepath, 'w') as f:
                    f.write(html_button + content)
                    
        if file.endswith('.component.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            if 'leaveRoom()' not in content:
                # Add method before the last closing brace
                idx = content.rfind('}')
                if idx != -1:
                    content = content[:idx] + ts_method + content[idx:]
                    with open(filepath, 'w') as f:
                        f.write(content)

print("Injected Sair da Sala button into all games")
