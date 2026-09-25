import re

with open('frontend/src/app/features/games/browser-search/browser-search.component.ts', 'r') as f:
    content = f.read()

# 1. Update interface
new_interface = """interface SearchTask {
  situation: string;
  correctKeywords: string[];
  alternativeKeywords?: string[][];
  distractorWords: string[]; 
  feedback: string;
}"""
content = re.sub(r'interface SearchTask \{.*?\n\}', new_interface, content, flags=re.DOTALL)

# 2. Add currentMistakes property
if 'currentMistakes: number = 0;' not in content:
    content = content.replace('selectedWords: string[] = [];', 'selectedWords: string[] = [];\n  currentMistakes: number = 0;')

# 3. Update searchTasks to include alternatives
# I will just write a custom block to replace the searchTasks array.
search_tasks = """searchTasks: SearchTask[] = [
    {
      situation: 'Fase 1: Você quer ver fotos de gatos filhotes fofinhos.',
      correctKeywords: ['fotos', 'gatos', 'filhotes'],
      alternativeKeywords: [['gatos', 'filhotes'], ['fotos', 'gatos']],
      distractorWords: ['eu', 'quero', 'ver', 'de', 'muito', 'fofinhos'],
      feedback: 'Fácil e direto! "Fotos gatos filhotes" ou apenas "gatos filhotes" é tudo o que o computador precisa ler.'
    },
    {
      situation: 'Fase 2: Você precisa saber o resultado do jogo do Brasil de ontem.',
      correctKeywords: ['resultado', 'jogo', 'Brasil'],
      alternativeKeywords: [['jogo', 'Brasil', 'ontem'], ['resultado', 'Brasil']],
      distractorWords: ['qual', 'foi', 'o', 'do', 'de', 'ontem', 'quem', 'ganhou'],
      feedback: 'Isso! Evite perguntar "quem ganhou", foque em palavras concretas como "resultado" e "Brasil".'
    },
    {
      situation: 'Fase 3: Você quer aprender a fazer um bolo de cenoura com chocolate.',
      correctKeywords: ['receita', 'bolo', 'cenoura', 'chocolate'],
      alternativeKeywords: [['bolo', 'cenoura', 'chocolate'], ['fazer', 'bolo', 'cenoura', 'chocolate']],
      distractorWords: ['como', 'fazer', 'um', 'com', 'cobertura', 'de', 'para', 'mim'],
      feedback: 'Ótimo! A palavra "Receita" já diz ao computador o que você quer, mas citar os ingredientes principais também funciona perfeitamente!'
    },
    {
      situation: 'Fase 4: Seu cachorro está comendo grama e você quer saber o motivo.',
      correctKeywords: ['cachorro', 'comendo', 'grama', 'motivo'],
      alternativeKeywords: [['cachorro', 'comendo', 'grama'], ['por que', 'cachorro', 'comendo', 'grama']],
      distractorWords: ['por que', 'o', 'meu', 'está', 'fazendo', 'isso', 'agora'],
      feedback: 'Excelente! Nós não conversamos com o computador como se fosse uma pessoa. Tiramos os "o meu" e "está fazendo".'
    },
    {
      situation: 'Fase 5: Você precisa encontrar o endereço do Museu da Água na cidade de Blumenau.',
      correctKeywords: ['endereço', 'museu', 'água', 'Blumenau'],
      alternativeKeywords: [['museu', 'água', 'Blumenau'], ['onde', 'fica', 'museu', 'água', 'Blumenau']],
      distractorWords: ['onde', 'fica', 'o', 'da', 'na', 'cidade', 'de', 'como', 'chegar'],
      feedback: 'Muito bem! Ao colocar o nome da cidade e do local, você garante que não vai achar um museu de outro estado.'
    },
    {
      situation: 'Fase 6: Você quer comprar um tênis azul tamanho 38.',
      correctKeywords: ['comprar', 'tênis', 'azul', '38'],
      alternativeKeywords: [['tênis', 'azul', '38'], ['preço', 'tênis', 'azul', '38']],
      distractorWords: ['eu', 'quero', 'um', 'para', 'mim', 'qual', 'o', 'preço', 'do'],
      feedback: 'Isso! Tamanho, cor e o objeto formam a pesquisa ideal para lojas online.'
    },
    {
      situation: 'Fase 7: Seu teclado parou de funcionar e você usa o Windows 11.',
      correctKeywords: ['teclado', 'não', 'funciona', 'Windows 11'],
      alternativeKeywords: [['teclado', 'parou', 'Windows 11'], ['problema', 'teclado', 'Windows 11']],
      distractorWords: ['meu', 'de', 'funcionar', 'como', 'consertar', 'no', 'problema', 'parou'],
      feedback: 'Perfeito! Colocar a versão do seu sistema (Windows 11) ajuda a achar a solução certa para o seu computador.'
    },
    {
      situation: 'Fase 8: Você tem um trabalho escolar sobre a história do descobrimento do Brasil.',
      correctKeywords: ['resumo', 'história', 'descobrimento', 'Brasil'],
      alternativeKeywords: [['história', 'descobrimento', 'Brasil'], ['trabalho', 'história', 'descobrimento', 'Brasil']],
      distractorWords: ['eu', 'tenho', 'um', 'escolar', 'sobre', 'a', 'do', 'trabalho'],
      feedback: 'Brilhante! "Resumo", "História" e "Descobrimento do Brasil" vai te levar direto aos melhores sites educativos!'
    },
    {
      situation: 'Fase 9: Você quer saber se vai chover amanhã na sua cidade, Florianópolis.',
      correctKeywords: ['previsão', 'tempo', 'amanhã', 'Florianópolis'],
      alternativeKeywords: [['chover', 'amanhã', 'Florianópolis'], ['clima', 'amanhã', 'Florianópolis']],
      distractorWords: ['vai', 'chover', 'na', 'minha', 'cidade', 'se', 'clima'],
      feedback: 'Show! Pesquisar "previsão do tempo" mais a data e a cidade não tem erro.'
    },
    {
      situation: 'Fase 10: Você esqueceu a senha do seu celular Samsung e quer formatar.',
      correctKeywords: ['como', 'formatar', 'celular', 'Samsung'],
      alternativeKeywords: [['formatar', 'celular', 'Samsung'], ['esqueci', 'senha', 'formatar', 'Samsung']],
      distractorWords: ['eu', 'esqueci', 'a', 'senha', 'do', 'meu', 'e', 'quero'],
      feedback: 'Muito bem! "Como formatar" seguido da marca do aparelho acha exatamente o tutorial que você precisa!'
    }
  ];"""
content = re.sub(r'searchTasks: SearchTask\[\] = \[.*?\n  \];', search_tasks, content, flags=re.DOTALL)

# 4. Update checkKeywords to handle alternativeKeywords and currentMistakes
check_keywords_new = """checkKeywords() {
    const task = this.searchTasks[this.currentTaskIndex];
    
    // Testa a combinação principal
    let isCorrect = false;
    const hasAllCorrectPrimary = task.correctKeywords.every(w => this.selectedWords.includes(w));
    const hasNoDistractorsPrimary = this.selectedWords.every(w => task.correctKeywords.includes(w));
    
    if (hasAllCorrectPrimary && hasNoDistractorsPrimary && this.selectedWords.length === task.correctKeywords.length) {
      isCorrect = true;
    }

    // Testa as combinações alternativas, se houver
    if (!isCorrect && task.alternativeKeywords) {
      for (const alt of task.alternativeKeywords) {
        const hasAllAlt = alt.every(w => this.selectedWords.includes(w));
        const hasNoDistractorsAlt = this.selectedWords.every(w => alt.includes(w));
        if (hasAllAlt && hasNoDistractorsAlt && this.selectedWords.length === alt.length) {
          isCorrect = true;
          break;
        }
      }
    }

    if (isCorrect) {
      this.isCorrectGuess = true;
      this.feedbackText = task.feedback;
      this.showFeedbackModal = true;
      this.currentMistakes = 0; // Reseta os erros ao acertar
    } else {
      this.isCorrectGuess = false;
      this.currentMistakes++;
      
      if (this.currentMistakes >= 5) {
        this.feedbackText = '💡 DICA: As palavras essenciais poderiam ser: ' + task.correctKeywords.join(', ') + '.';
      } else {
        this.feedbackText = 'Sua pesquisa está um pouco confusa! Lembre-se: remova palavras como "eu", "o", "que", "como". Deixe apenas as palavras mais importantes!';
      }
      this.showFeedbackModal = true;
    }
  }"""
content = re.sub(r'checkKeywords\(\) \{.*?\n  \}', check_keywords_new, content, flags=re.DOTALL)

# 5. Fix loadStage logic just in case so we shuffle correctly (I actually don't need to change it if distractors has all words)
# Wait! In searchTasks, distractors + correctKeywords must contain all alternative words!
# Let me verify. E.g. Phase 8: correct = ['resumo', 'história', 'descobrimento', 'Brasil']
# alt: ['trabalho', 'história', 'descobrimento', 'Brasil'] -> distractor HAS 'trabalho'
# Phase 3: alt: ['fazer', 'bolo', ...] -> distractor HAS 'fazer'
# Phase 9: alt: ['chover', ...] -> distractor HAS 'chover'
# Phase 10: alt: ['esqueci', 'senha', ...] -> distractor HAS 'esqueci', 'senha'
# It seems perfect.

with open('frontend/src/app/features/games/browser-search/browser-search.component.ts', 'w') as f:
    f.write(content)
