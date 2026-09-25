with open('frontend/src/app/features/games/fact-checker/fact-checker.component.html', 'w') as f:
    f.write("""<div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
  
  <!-- CABEÇALHO DO JOGO -->
  <div class="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
    <div class="text-center md:text-left mb-4 md:mb-0">
      <h2 class="text-3xl font-bold text-forest-900">Agência de Detetives Digitais</h2>
      <p class="text-gray-500 font-medium" *ngIf="!gameFinished">{{ activeCase.title }}</p>
    </div>
    <div *ngIf="!gameFinished" class="bg-blue-100 text-blue-800 font-bold px-6 py-2 rounded-full border-2 border-blue-200 shadow-sm">
      Caso {{ currentCaseIndex + 1 }} de {{ cases.length }}
    </div>
  </div>

  <!-- TELA DE BRIEFING (DIÁLOGO COM O INSPETOR) -->
  <div *ngIf="displayMode === 'briefing' && !gameFinished" class="w-full max-w-4xl bg-white border-4 border-gray-300 rounded-xl shadow-xl overflow-hidden flex flex-col mt-4">
    <div class="bg-gray-800 text-white p-4 font-bold text-lg flex items-center gap-3">
      <span>📁</span> ARQUIVO CONFIDENCIAL
    </div>
    
    <div class="p-8 flex flex-col md:flex-row items-center gap-8 bg-slate-100">
      <div class="text-8xl md:text-9xl drop-shadow-xl">🕵️‍♂️</div>
      <div class="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-200 relative w-full">
        <!-- Balão tail -->
        <div class="absolute -left-3 top-10 w-6 h-6 bg-white border-b-2 border-l-2 border-gray-200 transform rotate-45 hidden md:block"></div>
        <h4 class="text-blue-900 font-black mb-2 text-xl uppercase tracking-wider">Inspetor Lupa:</h4>
        <p class="text-xl text-gray-800 font-medium leading-relaxed italic">
          "{{ activeCase.briefing[briefingIndex].text }}"
        </p>
      </div>
    </div>
    
    <div class="bg-gray-200 p-4 border-t-2 border-gray-300 flex justify-end">
      <button 
        (click)="nextBriefing()"
        class="bg-blue-600 hover:bg-blue-700 text-white font-black text-xl py-4 px-8 rounded-xl shadow-lg border-b-4 border-blue-800 active:translate-y-1 active:border-b-0 transition-all">
        {{ briefingIndex < activeCase.briefing.length - 1 ? 'Continuar Lendo ➔' : 'Iniciar Investigação ➔' }}
      </button>
    </div>
  </div>

  <!-- AVISO DA MISSÃO DURANTE O GAMEPLAY -->
  <div *ngIf="displayMode === 'gameplay' && !gameFinished" class="bg-blue-50 border-l-8 border-blue-500 p-6 rounded-xl shadow-md w-full max-w-5xl mb-8 flex items-center gap-4">
    <div class="text-5xl drop-shadow">🔍</div>
    <div>
      <h3 class="text-xl font-bold text-blue-900 mb-1">Missão Atual:</h3>
      <p class="text-xl text-blue-800 font-medium" *ngIf="activeCase.type === 'anatomy'">
        {{ $any(activeStage).instruction }}
      </p>
      <p class="text-xl text-blue-800 font-medium" *ngIf="activeCase.type === 'phishing'">
        Leia a mensagem interceptada e classifique como GOLPE ou SEGURA.
      </p>
      <p class="text-xl text-blue-800 font-medium" *ngIf="activeCase.type === 'cross_check'">
        Leia a notícia, faça a checagem no buscador e vote se é FATO ou FAKE.
      </p>
    </div>
  </div>

  <!-- GAMEPLAY: ANATOMY (Fase 1) -->
  <div *ngIf="displayMode === 'gameplay' && activeCase.type === 'anatomy' && !gameFinished" class="w-full max-w-4xl bg-white border-4 border-gray-300 rounded-xl shadow-xl overflow-hidden flex flex-col relative">
    <div (click)="checkNewsPart('url')" class="bg-gray-100 p-3 border-b-2 border-gray-300 flex items-center gap-2 cursor-pointer hover:bg-yellow-100 transition-colors group">
      <span class="text-gray-400 group-hover:text-yellow-600">🔒</span>
      <span class="font-mono text-gray-500 group-hover:text-yellow-700 font-bold">https://www.noticias-estranhas-xzy.com.br/urgente</span>
    </div>
    <div class="p-8 md:p-12">
      <h1 (click)="checkNewsPart('headline')" class="text-4xl md:text-5xl font-black text-gray-900 mb-4 cursor-pointer hover:bg-yellow-100 hover:text-yellow-800 rounded p-2 transition-colors">
        O FIM DO MUNDO VAI COMEÇAR AMANHÃ ÀS 15H!!! COMPARTILHE!!!
      </h1>
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <div (click)="checkNewsPart('author')" class="text-gray-600 font-medium cursor-pointer hover:bg-yellow-100 hover:text-yellow-800 rounded p-1 px-2 transition-colors">
          Por: <span class="font-bold text-gray-800">Desconhecido (Anônimo)</span>
        </div>
        <div class="hidden md:block text-gray-400">|</div>
        <div (click)="checkNewsPart('date')" class="text-gray-600 font-medium cursor-pointer hover:bg-yellow-100 hover:text-yellow-800 rounded p-1 px-2 transition-colors">
          Publicado em: <span class="font-bold text-red-600">12 de Março de 2014</span>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-8">
        <div (click)="checkNewsPart('image')" class="md:w-1/2 bg-gray-200 h-64 rounded-xl border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-yellow-100 hover:border-yellow-400 transition-colors group">
          <span class="text-4xl text-gray-400 group-hover:text-yellow-600">📸 [Foto Genérica do Espaço]</span>
        </div>
        <div (click)="checkNewsPart('body')" class="md:w-1/2 cursor-pointer hover:bg-yellow-100 rounded p-4 transition-colors">
          <p class="text-gray-700 text-lg leading-relaxed mb-4">Segundo relatos misteriosos encontrados na internet profunda, um evento sem explicações vai acontecer. Especialistas que não quiseram se identificar afirmam que todos devem ficar em casa.</p>
          <p class="text-gray-700 text-lg leading-relaxed">Se você não enviar essa notícia para todos os seus contatos nos próximos cinco minutos, a maldição do cometa invisível cairá sobre a sua internet.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- GAMEPLAY: PHISHING (Fase 2) -->
  <div *ngIf="displayMode === 'gameplay' && activeCase.type === 'phishing' && !gameFinished" class="w-full max-w-5xl flex flex-col md:flex-row gap-8 justify-center">
    <!-- Simulação do Celular -->
    <div class="w-full md:w-5/12 bg-gray-900 p-4 rounded-[3rem] shadow-2xl border-8 border-gray-800 flex flex-col relative h-[600px]">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-10"></div>
      
      <div class="bg-[#ece5dd] flex-1 rounded-2xl overflow-hidden flex flex-col relative">
        <div class="bg-[#075e54] p-4 text-white flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl">👤</div>
          <div class="font-bold text-lg">Número Desconhecido</div>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-center">
          <div class="bg-white p-4 rounded-xl rounded-tl-none shadow-md mb-2 relative">
            <p class="text-gray-800 text-lg font-medium whitespace-pre-wrap">{{ $any(activeStage).suspiciousText }}</p>
            <span class="text-[10px] text-gray-400 absolute bottom-1 right-2">14:32</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Painel de Análise -->
    <div class="w-full md:w-5/12 flex flex-col gap-6 justify-center">
      <div class="bg-white p-6 rounded-2xl shadow-lg border-4 border-gray-200">
        <h3 class="text-2xl font-black text-gray-800 mb-6 text-center">Classificação da Mensagem:</h3>
        <div class="flex flex-col gap-4">
          <button (click)="votePhishing(true)" class="bg-red-500 hover:bg-red-600 text-white font-black text-2xl py-6 rounded-xl shadow-lg border-b-8 border-red-700 active:border-b-0 active:translate-y-2 transition-all">
            🚨 GOLPE (PHISHING)
          </button>
          <button (click)="votePhishing(false)" class="bg-green-500 hover:bg-green-600 text-white font-black text-2xl py-6 rounded-xl shadow-lg border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all">
            ✅ MENSAGEM SEGURA
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- GAMEPLAY: CROSS CHECK (Fase 3 e 4) -->
  <div *ngIf="displayMode === 'gameplay' && activeCase.type === 'cross_check' && !gameFinished" class="w-full max-w-5xl flex flex-col md:flex-row gap-8">
    <div class="w-full md:w-1/2 bg-white p-6 rounded-3xl shadow-xl border-4 border-gray-200 flex flex-col">
      <div class="bg-gray-100 text-gray-600 text-sm text-center font-bold py-2 rounded-t-xl mb-4 border-b-2 border-gray-200">
        Origem: {{ $any(activeStage).sourceType }}
      </div>
      <div class="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-400 shadow-inner mb-8">
        <p class="text-2xl text-gray-800 font-medium italic">"{{ $any(activeStage).suspiciousNews }}"</p>
      </div>
      <div class="mt-auto flex justify-center">
        <button *ngIf="!hasSearched" (click)="performSearch()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl py-4 px-8 rounded-full shadow-lg border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-3">
          <span>🔍</span> Cruzar Dados na Internet
        </button>
      </div>
    </div>

    <div class="w-full md:w-1/2 flex flex-col gap-6">
      <div *ngIf="hasSearched" class="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-200">
        <div class="text-blue-600 font-bold mb-3 flex items-center gap-2 text-lg">
          <span>🌐</span> Sistema de Busca da Agência:
        </div>
        <p class="text-gray-700 text-lg font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
          {{ $any(activeStage).reliableSearch }}
        </p>
      </div>
      <div *ngIf="hasSearched" class="bg-white p-6 rounded-2xl shadow-lg border-4 border-gray-200 text-center flex flex-col h-full justify-center">
        <h3 class="text-2xl font-black text-gray-800 mb-6">Qual é o seu veredito, detetive?</h3>
        <div class="flex gap-4">
          <button (click)="voteFactOrFake(true)" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-black text-2xl py-6 rounded-2xl shadow-lg border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all">FATO</button>
          <button (click)="voteFactOrFake(false)" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-black text-2xl py-6 rounded-2xl shadow-lg border-b-8 border-red-700 active:border-b-0 active:translate-y-2 transition-all">FAKE</button>
        </div>
      </div>
    </div>
  </div>

  <!-- TELA DE VITÓRIA FINAL -->
  <div *ngIf="gameFinished" class="bg-white p-12 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center max-w-3xl mt-10">
    <div class="text-9xl mb-6">🎖️</div>
    <h2 class="text-5xl font-black text-forest-900 mb-6">Você é um Detetive Mestre!</h2>
    <p class="text-2xl text-gray-700 mb-8 font-medium leading-relaxed">
      A internet é um lugar maravilhoso, mas precisa ser usada com inteligência. Você provou que sabe usar a lupa digital para separar a verdade da mentira e até identificar IA!
    </p>
    <div class="bg-blue-100 p-6 rounded-xl border-2 border-blue-200">
      <p class="text-blue-900 font-bold text-xl">O Inspetor Lupa e toda a Agência D.D. agradecem os seus serviços. Fim de jogo!</p>
    </div>
  </div>

  <!-- MODAL DE FEEDBACK -->
  <div *ngIf="displayMode === 'feedback'" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
    <div class="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center transform transition-all" [ngClass]="isCorrectGuess ? 'border-4 border-green-500' : 'border-4 border-red-500'">
      <div class="text-7xl mb-4">{{ isCorrectGuess ? '✅' : '❌' }}</div>
      <h3 class="text-3xl font-black mb-4" [ngClass]="isCorrectGuess ? 'text-green-600' : 'text-red-600'">
        {{ isCorrectGuess ? 'Ótima Análise!' : 'Cuidado, Detetive!' }}
      </h3>
      <p class="text-xl text-gray-800 font-medium mb-8 leading-relaxed">
        {{ feedbackText }}
      </p>
      <button (click)="nextStep()" class="w-full py-5 text-white font-black text-2xl rounded-2xl shadow-lg border-b-8 active:border-b-0 active:translate-y-2 transition-all" [ngClass]="isCorrectGuess ? 'bg-green-500 hover:bg-green-600 border-green-700' : 'bg-red-500 hover:bg-red-600 border-red-700'">
        {{ isCorrectGuess ? 'Continuar ➔' : 'Tentar Novamente' }}
      </button>
    </div>
  </div>

</div>""")
