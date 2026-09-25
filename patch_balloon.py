import os

engine_file = "frontend/src/app/features/games/touch-literacy/engine/touch-literacy-engine.service.ts"
comp_ts_file = "frontend/src/app/features/games/touch-literacy/touch-literacy.component.ts"
comp_html_file = "frontend/src/app/features/games/touch-literacy/touch-literacy.component.html"
comp_scss_file = "frontend/src/app/features/games/touch-literacy/touch-literacy.component.scss"

# 1. Update Engine
with open(engine_file, "r") as f:
    engine_content = f.read()

new_engine_props = """
    score: 0,
    challengeItem: null as ChallengeItem | null,
    challengeTargetScore: 100,
    // Phase 5 (Balloons)
    balloons: [] as any[],
    phase5Score: 0,
    phase5Target: 50,
    phase5CategoryTarget: 'food'
"""
engine_content = engine_content.replace("score: 0,\n    challengeItem: null as ChallengeItem | null,\n    challengeTargetScore: 100", new_engine_props)

engine_balloon_logic = """
  processChallengeDrop(category: string): boolean {
    const s = this.state();
    if (!s.challengeItem) return false;

    const isCorrect = s.challengeItem.category === category;
    if (isCorrect) {
      s.score += 10;
    } else {
      s.score = Math.max(0, s.score - 5);
    }
    
    if (s.score < s.challengeTargetScore) {
      this.generateChallengeItem(s);
    } else {
      // Finished Phase 4, automatically wait for component to transition to Phase 5
    }
    this.stateSubject.next(s);
    return isCorrect;
  }

  // Phase 5 Logic
  spawnBalloon() {
    const s = this.state();
    if (s.fase !== 5) return;

    const randomIndex = Math.floor(Math.random() * CHALLENGE_ITEMS.length);
    const item = CHALLENGE_ITEMS[randomIndex];
    
    const balloon = {
      id: 'b_' + new Date().getTime() + '_' + Math.random(),
      x: Math.floor(Math.random() * 80) + 10, // 10% to 90%
      item: item,
      active: true,
      color: ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'][Math.floor(Math.random()*5)]
    };
    
    s.balloons.push(balloon);
    
    // Cleanup old balloons
    if (s.balloons.length > 15) {
      s.balloons.shift();
    }
    
    this.stateSubject.next(s);
  }

  popMovingBalloon(id: string): boolean {
    const s = this.state();
    const balloon = s.balloons.find((b: any) => b.id === id);
    if (!balloon || !balloon.active) return false;

    balloon.active = false;
    const isCorrect = balloon.item.category === s.phase5CategoryTarget;
    
    if (isCorrect) {
      s.phase5Score += 10;
    } else {
      s.phase5Score = Math.max(0, s.phase5Score - 5);
    }
    
    this.stateSubject.next(s);
    return isCorrect;
  }
"""
engine_content = engine_content.replace("""
  processChallengeDrop(category: string): boolean {
    const s = this.state();
    if (!s.challengeItem) return false;

    const isCorrect = s.challengeItem.category === category;
    if (isCorrect) {
      s.score += 10;
    } else {
      s.score = Math.max(0, s.score - 5);
    }
    
    if (s.score < s.challengeTargetScore) {
      this.generateChallengeItem(s);
    }
    this.stateSubject.next(s);
    return isCorrect;
  }""", engine_balloon_logic)

with open(engine_file, "w") as f:
    f.write(engine_content)


# 2. Update SCSS
scss_content = """
@keyframes floatUp {
  0% { transform: translateY(100vh); opacity: 1; }
  100% { transform: translateY(-30vh); opacity: 0; }
}
.animate-floatUp {
  animation: floatUp 7s linear forwards;
}
.balloon-tail {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  width: 2px;
  height: 30px;
  background-color: #cbd5e1;
  transform: translateX(-50%);
}
"""
with open(comp_scss_file, "w") as f:
    f.write(scss_content)


# 3. Update Component TS
with open(comp_ts_file, "r") as f:
    ts_content = f.read()

ts_props = """
  state: any;
  sub!: Subscription;
  balloonInterval: any;

  draggedItem: string | null = null;
"""
ts_content = ts_content.replace("""
  state: any;
  sub!: Subscription;

  draggedItem: string | null = null;
""", ts_props)

ts_destroy = """
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.balloonInterval) clearInterval(this.balloonInterval);
  }
"""
ts_content = ts_content.replace("""
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
""", ts_destroy)

ts_completion = """
    } else if (this.state.fase === 4) {
      if (this.state.score >= this.state.challengeTargetScore) {
        this.completePhase(false);
        this.startBalloons();
      }
    } else if (this.state.fase === 5) {
      if (this.state.phase5Score >= this.state.phase5Target) {
        if (this.balloonInterval) clearInterval(this.balloonInterval);
        this.completePhase(true);
      }
    }
  }

  startBalloons() {
    this.balloonInterval = setInterval(() => {
      this.engine.spawnBalloon();
    }, 1500);
  }

  onBalloonClick(id: string) {
    const isCorrect = this.engine.popMovingBalloon(id);
    if (!isCorrect) {
      this.reportMistake();
    }
  }
"""
ts_content = ts_content.replace("""
    } else if (this.state.fase === 4) {
      if (this.state.score >= this.state.challengeTargetScore) {
        this.completePhase(true);
      }
    }
  }
""", ts_completion)

# Wait, replace the alert message text too
ts_content = ts_content.replace("venceu o jogo", "venceu todos os jogos")

with open(comp_ts_file, "w") as f:
    f.write(ts_content)


# 4. Update HTML
with open(comp_html_file, "r") as f:
    html_content = f.read()

phase5_html = """
  <!-- Phase 5 (Balloons) -->
  <div *ngIf="state.fase === 5" class="w-full h-full relative overflow-hidden flex flex-col items-center">
    <div class="z-10 mt-8 flex flex-col items-center gap-4 bg-white/80 p-6 rounded-2xl shadow-lg border-4 border-blue-200">
      <div class="text-4xl font-bold text-blue-800">CÉU DOS BALÕES!</div>
      <div class="text-2xl font-bold text-gray-700">Estoure apenas os itens da categoria: <span class="text-red-600 uppercase text-3xl tracking-widest">COMIDA</span></div>
      <div class="text-3xl font-bold bg-yellow-100 px-6 py-2 rounded-full shadow text-yellow-700 border-4 border-yellow-300">
        Pontos: {{ state.phase5Score }} / {{ state.phase5Target }}
      </div>
    </div>

    <!-- Spawning Balloons -->
    <div *ngFor="let b of state.balloons" 
         class="absolute bottom-0 animate-floatUp cursor-crosshair hover:scale-110 transition-transform"
         [style.left.%]="b.x"
         [class.hidden]="!b.active"
         (click)="onBalloonClick(b.id)">
      <div class="relative flex flex-col items-center">
        <!-- Balloon body -->
        <div class="w-32 h-40 rounded-[50%] shadow-inner flex flex-col items-center justify-center border-2 border-white/50"
             [ngClass]="b.color">
          <div class="text-6xl filter drop-shadow-md">{{ b.item.emoji }}</div>
          <div class="mt-2 text-sm font-black text-white bg-black/30 px-2 py-1 rounded tracking-wider">{{ b.item.word }}</div>
        </div>
        <!-- Balloon tail -->
        <div class="balloon-tail"></div>
      </div>
    </div>
  </div>

</div>
"""

html_content = html_content.replace("\n</div>", phase5_html)

with open(comp_html_file, "w") as f:
    f.write(html_content)
