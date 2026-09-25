with open('frontend/src/app/features/admin/dashboard/dashboard.component.html', 'r') as f:
    text = f.read()

# Replace the creation form with a toggle button and modal
form_start = text.find('<form *ngIf="tickets.length < 20"')
form_end = text.find('</form>') + 7

create_section = '''
        <!-- Botão Criar Sala -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">Suas Turmas Ativas ({{tickets.length}}/20)</h3>
          
          <div class="flex items-center gap-3">
            <select [(ngModel)]="sortOrder" class="px-3 py-2 border rounded-lg bg-white text-sm">
              <option value="active">🟢 Mais Ativos</option>
              <option value="newest">🆕 Mais Recentes</option>
              <option value="oldest">⏳ Mais Antigos</option>
            </select>
            <button *ngIf="tickets.length < 20" (click)="openCreateModal()" class="bg-forest-900 hover:bg-forest-800 text-white font-bold py-2 px-4 rounded-lg shadow">
              + Criar Sala
            </button>
          </div>
        </div>

        <!-- Modal de Criação -->
        <div *ngIf="showCreateModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button (click)="closeCreateModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            <h2 class="text-2xl font-bold mb-4">Criar Nova Sala</h2>
''' + text[form_start:form_end] + '''
          </div>
        </div>
'''

# We also need to remove the old <h3 class="text-xl font-bold mb-4">Suas Turmas Ativas ({{tickets.length}}/20)</h3>
# and replace tickets with sortedTickets in the *ngFor

text = text[:form_start] + create_section + text[form_end:]

text = text.replace('<h3 class="text-xl font-bold mb-4">Suas Turmas Ativas ({{tickets.length}}/20)</h3>', '')
text = text.replace('*ngFor="let ticket of tickets"', '*ngFor="let ticket of sortedTickets"')

# Now add Kick Student button
table_header = '''
                <th (click)="toggleSort('startedAt')" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none">
                  Início <span class="text-gray-400">{{ getSortIcon('startedAt') }}</span>
                </th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
'''
text = text.replace('''<th (click)="toggleSort('startedAt')" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none">
                  Início <span class="text-gray-400">{{ getSortIcon('startedAt') }}</span>
                </th>''', table_header)

table_row = '''
                <td class="px-6 py-4 text-sm text-gray-500">{{ s.startedAt | date:'HH:mm' }}</td>
                <td class="px-6 py-4 text-right">
                  <button (click)="kickStudent(s.id, s.studentName)" class="text-red-500 hover:text-red-700 font-bold" title="Expulsar Aluno">
                    🗑️
                  </button>
                </td>
'''
text = text.replace('''<td class="px-6 py-4 text-sm text-gray-500">{{ s.startedAt | date:'HH:mm' }}</td>''', table_row)

with open('frontend/src/app/features/admin/dashboard/dashboard.component.html', 'w') as f:
    f.write(text)
