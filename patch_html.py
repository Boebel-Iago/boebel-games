with open('frontend/src/app/features/games/professions/professions.component.html', 'r') as f:
    html = f.read()

phase3_html = """
    <!-- FASE 3: CATEGORIZAÇÃO (DRAG AND DROP) -->
    <div *ngIf="gameStage === 3 && !gameFinished" class="w-full flex flex-col items-center gap-6">
      
      <div class="text-center bg-white px-8 py-3 rounded-full shadow-md font-bold text-gray-700 text-lg md:text-xl border-2 border-forest-900 mb-2">
        <span>Fase Final: Nível {{ phase3Level }} de 3</span>
      </div>

      <!-- Área de Origem (Cesto) -->
      <div class="bg-white w-full p-6 rounded-3xl shadow-xl border-4 border-dashed border-gray-300 flex flex-col items-center min-h-[160px]">
        <h4 class="text-xl font-bold text-gray-500 mb-4 uppercase tracking-wider">📦 Artefatos para organizar</h4>
        
        <div 
          cdkDropList
          #unassignedList="cdkDropList"
          [cdkDropListData]="unassignedItems"
          [cdkDropListConnectedTo]="[workList, studyList, leisureList]"
          class="flex flex-wrap gap-3 justify-center w-full min-h-[100px]"
          (cdkDropListDropped)="drop($event)">
          
          <div 
            *ngFor="let item of unassignedItems" 
            cdkDrag 
            class="bg-gray-50 border-2 border-gray-200 px-4 py-3 rounded-xl shadow-sm cursor-grab active:cursor-grabbing flex items-center gap-3 hover:bg-gray-100 hover:border-gray-400 transition-colors w-[220px]">
            <span class="text-3xl">{{ item.icon }}</span>
            <span class="font-bold text-gray-700 leading-tight text-sm">{{ item.name }}</span>
          </div>
          
        </div>
      </div>

      <!-- As 3 Colunas de Destino -->
      <div class="flex flex-col md:flex-row w-full gap-4 mt-2">
        
        <!-- TRABALHO -->
        <div class="flex-1 bg-blue-50 p-4 rounded-3xl border-4 border-blue-200 flex flex-col min-h-[300px]">
          <div class="bg-blue-600 text-white text-center py-2 rounded-xl mb-4 font-black uppercase text-lg shadow-sm">💼 Trabalho</div>
          <div 
            cdkDropList
            #workList="cdkDropList"
            [cdkDropListData]="workColumn"
            [cdkDropListConnectedTo]="[unassignedList, studyList, leisureList]"
            class="flex-1 flex flex-col gap-3 min-h-[200px]"
            (cdkDropListDropped)="drop($event)">
            
            <div *ngFor="let item of workColumn" cdkDrag class="bg-white border-2 border-blue-300 px-3 py-2 rounded-lg shadow-sm cursor-grab flex items-center gap-3 w-full">
              <span class="text-2xl">{{ item.icon }}</span>
              <span class="font-bold text-blue-900 text-sm leading-tight">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <!-- ESTUDO -->
        <div class="flex-1 bg-emerald-50 p-4 rounded-3xl border-4 border-emerald-200 flex flex-col min-h-[300px]">
          <div class="bg-emerald-600 text-white text-center py-2 rounded-xl mb-4 font-black uppercase text-lg shadow-sm">📚 Estudo</div>
          <div 
            cdkDropList
            #studyList="cdkDropList"
            [cdkDropListData]="studyColumn"
            [cdkDropListConnectedTo]="[unassignedList, workList, leisureList]"
            class="flex-1 flex flex-col gap-3 min-h-[200px]"
            (cdkDropListDropped)="drop($event)">
            
            <div *ngFor="let item of studyColumn" cdkDrag class="bg-white border-2 border-emerald-300 px-3 py-2 rounded-lg shadow-sm cursor-grab flex items-center gap-3 w-full">
              <span class="text-2xl">{{ item.icon }}</span>
              <span class="font-bold text-emerald-900 text-sm leading-tight">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <!-- LAZER -->
        <div class="flex-1 bg-purple-50 p-4 rounded-3xl border-4 border-purple-200 flex flex-col min-h-[300px]">
          <div class="bg-purple-600 text-white text-center py-2 rounded-xl mb-4 font-black uppercase text-lg shadow-sm">🎮 Lazer</div>
          <div 
            cdkDropList
            #leisureList="cdkDropList"
            [cdkDropListData]="leisureColumn"
            [cdkDropListConnectedTo]="[unassignedList, workList, studyList]"
            class="flex-1 flex flex-col gap-3 min-h-[200px]"
            (cdkDropListDropped)="drop($event)">
            
            <div *ngFor="let item of leisureColumn" cdkDrag class="bg-white border-2 border-purple-300 px-3 py-2 rounded-lg shadow-sm cursor-grab flex items-center gap-3 w-full">
              <span class="text-2xl">{{ item.icon }}</span>
              <span class="font-bold text-purple-900 text-sm leading-tight">{{ item.name }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Botão Verificar Respostas -->
      <button 
        (click)="checkPhase3Answers()"
        [disabled]="unassignedItems.length > 0"
        class="mt-6 w-full md:w-1/2 p-4 rounded-2xl font-black text-xl text-white transition-all transform shadow-lg"
        [ngClass]="unassignedItems.length === 0 ? 'bg-forest-900 hover:bg-forest-800 hover:-translate-y-1 active:translate-y-0 cursor-pointer' : 'bg-gray-300 cursor-not-allowed opacity-70'">
        <ng-container *ngIf="unassignedItems.length > 0">Organize todos os {{ unassignedItems.length }} itens para continuar...</ng-container>
        <ng-container *ngIf="unassignedItems.length === 0">✅ Verificar Respostas!</ng-container>
      </button>

    </div>
"""

# Inject before "<!-- TELA FINAL -->"
html = html.replace("<!-- TELA FINAL -->", phase3_html + "\n    <!-- TELA FINAL -->")

with open('frontend/src/app/features/games/professions/professions.component.html', 'w') as f:
    f.write(html)
