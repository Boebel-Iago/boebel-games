import { Injectable } from '@angular/core';
import { LicenseTask, PlagiarismTask } from './creators-vs-copiers.model';

@Injectable()
export class CreatorsVsCopiersRepository {
  
  private licenseTasks: LicenseTask[] = [
    {
      symbol: '©️', name: 'Copyright (Todos os Direitos Reservados)',
      correctAnswer: 'Ninguém pode usar, copiar ou alterar sem pedir permissão direta ao autor.',
      wrongAnswers: ['Posso usar à vontade, desde que eu não ganhe dinheiro.', 'Posso usar, mas tenho que colocar o nome do autor.'],
      feedback: 'O Copyright é a regra mais rígida! Se tem esse Czinho, você não pode usar a imagem no seu trabalho sem autorização expressa.'
    },
    {
      symbol: '🔓', name: 'Domínio Público (CC0)',
      correctAnswer: 'Totalmente livre! Posso usar, alterar e até vender, sem precisar pedir permissão.',
      wrongAnswers: ['Só posso usar se eu pagar uma taxa mensal.', 'Posso usar, mas não posso modificar a imagem de jeito nenhum.'],
      feedback: 'O Domínio Público é o paraíso das imagens livres! Obras muito antigas ou doadas pelo autor ganham esse selo.'
    },
    {
      symbol: '👤 CC BY', name: 'Atribuição (Creative Commons)',
      correctAnswer: 'Posso usar e alterar, mas OBRIGATORIAMENTE tenho que dar os créditos (citar o nome do autor).',
      wrongAnswers: ['Significa que eu fui o autor dessa imagem.', 'Posso usar sem dar créditos, desde que seja para a escola.'],
      feedback: 'A regra de ouro da internet: "Atribuição" significa atribuir a obra a quem a criou. Dar créditos é respeitar o trabalho alheio!'
    },
    {
      symbol: '🚫💲 CC NC', name: 'Uso Não Comercial',
      correctAnswer: 'Posso usar a imagem, mas NÃO posso ganhar dinheiro com ela ou vendê-la.',
      wrongAnswers: ['Significa que a imagem custa dinheiro para ser baixada.', 'Não posso usar essa imagem na escola.'],
      feedback: 'NC vem de "Non-Commercial". Você pode usar no trabalho de escola (porque não dá lucro), mas não poderia estampar numa camisa para vender.'
    },
    {
      symbol: '🟰 CC ND', name: 'Sem Derivações',
      correctAnswer: 'Posso usar a obra exatamente como ela é. NÃO posso recortar, mudar as cores ou editá-la.',
      wrongAnswers: ['Não posso fazer o download da imagem.', 'Posso mudar a cor da imagem, mas não posso cortar.'],
      feedback: 'Derivação é criar algo novo a partir do original. Com esse selo (igual =), a obra tem que permanecer intocada!'
    },
    {
      symbol: '🔄 CC SA', name: 'Compartilha Igual',
      correctAnswer: 'Se eu alterar a imagem e criar algo novo, tenho que compartilhar minha criação com essa MESMA licença livre.',
      wrongAnswers: ['Tenho que enviar a imagem para pelo menos 5 amigos.', 'Não posso compartilhar meu trabalho com ninguém.'],
      feedback: 'A licença "ShareAlike" garante que a internet continue livre. Se você usou algo livre para criar, sua criação também deve ser livre!'
    },
    {
      symbol: '©️', name: 'Revisão: Copyright',
      correctAnswer: 'Proteção total. O autor não liberou o uso público.',
      wrongAnswers: ['Uso totalmente liberado para estudantes.', 'Posso usar se eu prometer que fui eu quem fez.'],
      feedback: 'Nunca pegue uma imagem do Google sem filtrar os direitos de uso, ela provavelmente tem Copyright e usá-la é plágio!'
    },
    {
      symbol: '👤 CC BY', name: 'Revisão: Atribuição',
      correctAnswer: 'Sempre cite a fonte e o nome de quem criou.',
      wrongAnswers: ['Só cite a fonte se a imagem for feia.', 'Não precisa citar, o Google é dono de tudo.'],
      feedback: 'Ao fazer seus slides, no rodapé, sempre coloque "Imagem por: [Autor] sob licença CC BY".'
    },
    {
      symbol: '🔓', name: 'Revisão: Domínio Público',
      correctAnswer: 'Livre de direitos autorais. Pertence à humanidade.',
      wrongAnswers: ['Pertence ao presidente da república.', 'Ninguém pode usar nunca mais.'],
      feedback: 'Bancos de imagens como Pixabay e Unsplash são ótimos porque fornecem milhares de imagens em domínio público (CC0).'
    },
    {
      symbol: '🚫💲 + 👤', name: 'Mistura de Licenças (BY-NC)',
      correctAnswer: 'Tenho que dar os créditos E não posso ganhar dinheiro com ela.',
      wrongAnswers: ['Posso ganhar dinheiro, mas não dou créditos.', 'Não posso usar de jeito nenhum.'],
      feedback: 'O Creative Commons permite misturar as regras! Neste caso, você junta a regra da Atribuição com a do Uso Não Comercial.'
    }
  ];

  private plagiarismTasks: PlagiarismTask[] = [
    {
      scenario: 'João precisava de uma foto de um vulcão para o trabalho de Ciências.',
      studentAction: 'Pesquisou no Google, pegou a primeira foto mais bonita, colocou no slide e entregou para o professor sem escrever nada embaixo.',
      isCorrectUse: false,
      feedback: 'PLÁGIO! Pegar qualquer imagem do Google sem filtrar e não citar a fonte é apropriação do trabalho alheio.'
    },
    {
      scenario: 'Maria usou uma imagem com licença Domínio Público (CC0) que achou no site Pixabay.',
      studentAction: 'Ela usou a imagem no seu trabalho escolar e até recortou um pedaço dela para caber no slide.',
      isCorrectUse: true,
      feedback: 'USO CORRETO! Imagens em Domínio Público (CC0) são totalmente livres para uso e modificação.'
    },
    {
      scenario: 'Pedro teve que fazer uma pesquisa sobre a Revolução Industrial.',
      studentAction: 'Ele copiou três parágrafos inteiros da Wikipédia, colou no Word, mudou a cor da letra e disse que foi ele quem escreveu.',
      isCorrectUse: false,
      feedback: 'PLÁGIO CLARO! Copiar um texto da internet e fingir que é seu é uma falta ética grave. Ele deveria ter lido e escrito com suas próprias palavras.'
    },
    {
      scenario: 'Ana fez um slide sobre Animais em Extinção.',
      studentAction: 'No final do slide, ela criou uma página chamada "Referências" e colocou: "Texto escrito por Ana. Foto do Panda por John Doe (Flickr) sob licença CC BY".',
      isCorrectUse: true,
      feedback: 'EXCELENTE! Ana agiu como uma cidadã digital nota 10. Deixou claro o que ela escreveu e deu os devidos créditos à foto que utilizou.'
    },
    {
      scenario: 'Lucas achou um desenho incrível no Instagram de um artista famoso (com o símbolo ©️).',
      studentAction: 'Ele imprimiu o desenho, apagou a assinatura do artista no Photoshop e usou como capa do seu trabalho escolar.',
      isCorrectUse: false,
      feedback: 'PLÁGIO E CRIME DE DIREITOS AUTORAIS! Além de usar uma obra protegida (Copyright), ele apagou a assinatura do autor de propósito.'
    },
    {
      scenario: 'Sofia usou uma música instrumental em seu vídeo para a escola.',
      studentAction: 'Ela usou o filtro "Creative Commons" no YouTube para achar uma música livre, baixou e colocou os créditos do músico no final do vídeo.',
      isCorrectUse: true,
      feedback: 'PERFEITO! Ferramentas como o YouTube também permitem filtrar buscas por licenças abertas (Creative Commons).'
    },
    {
      scenario: 'Carlos pegou a redação pronta que seu irmão mais velho fez há dois anos.',
      studentAction: 'Ele apenas apagou o nome do irmão, colocou o dele e entregou para a professora de Português.',
      isCorrectUse: false,
      feedback: 'PLÁGIO! O plágio não acontece só com a internet. Usar o trabalho escolar de outra pessoa e assinar o seu nome é fraude acadêmica.'
    },
    {
      scenario: 'Julia usou uma foto do Google com a licença "Sem Derivações (CC ND)".',
      studentAction: 'Ela colocou a foto inteira no seu cartaz, não mudou a cor e nem cortou a foto. Colocou os créditos embaixo.',
      isCorrectUse: true,
      feedback: 'USO CORRETO! Como a licença proibia derivações (modificações), ela usou a imagem original intacta e deu os créditos.'
    },
    {
      scenario: 'Gabriel precisava de uma frase forte para abrir sua apresentação.',
      studentAction: 'Ele escreveu no slide: "A educação é a arma mais poderosa..." e colocou entre aspas (" "), escrevendo embaixo: - Nelson Mandela.',
      isCorrectUse: true,
      feedback: 'USO CORRETO! O uso de aspas (" ") serve exatamente para mostrar que aquelas palavras são uma citação direta de outra pessoa.'
    },
    {
      scenario: 'Um aluno viu um meme muito engraçado no Twitter/X sobre provas e avaliações.',
      studentAction: 'Ele salvou no computador, postou na página da escola e escreveu "Olhem o meme que eu acabei de criar!".',
      isCorrectUse: false,
      feedback: 'PLÁGIO DE CONTEÚDO DIGITAL! Não importa se é um trabalho sério ou um meme, assumir a autoria de algo que você não fez é mentira.'
    }
  ];

  getLicenseTask(index: number): LicenseTask | null {
    return this.licenseTasks[index] || null;
  }

  getPlagiarismTask(index: number): PlagiarismTask | null {
    return this.plagiarismTasks[index] || null;
  }

  getTotalLicenseTasks(): number {
    return this.licenseTasks.length;
  }

  getTotalPhases(): number {
    return this.licenseTasks.length + this.plagiarismTasks.length;
  }
}
