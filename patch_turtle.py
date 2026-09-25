with open('frontend/src/app/features/games/sea-turtles/activities/sequence-order/sequence-order-activity.component.ts', 'r') as f:
    content = f.read()

new_reset = """  private reset(): void {
    this.pool = [...this.phase.cards];
    
    // Algoritmo Fisher-Yates verdadeiro para embaralhamento e trava contra a ordem correta
    let isPerfectlyOrdered = true;
    while (isPerfectlyOrdered && this.pool.length > 1) {
      // Fisher-Yates Shuffle
      for (let i = this.pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.pool[i], this.pool[j]] = [this.pool[j], this.pool[i]];
      }
      
      // Checa se, por azar, as cartas caíram na ordem exata da resposta
      isPerfectlyOrdered = this.pool.every((card, index) => card.correctOrder === index);
    }
    
    this.placedSequence = [];
    this.wrongCardId = null;
  }"""

import re
content = re.sub(r'  private reset\(\): void \{.*?\n  \}', new_reset, content, flags=re.DOTALL)

with open('frontend/src/app/features/games/sea-turtles/activities/sequence-order/sequence-order-activity.component.ts', 'w') as f:
    f.write(content)
