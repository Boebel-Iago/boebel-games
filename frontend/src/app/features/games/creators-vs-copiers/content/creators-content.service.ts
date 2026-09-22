import { Injectable } from '@angular/core';
import { CreatorsMission, LicenseTask, PlagiarismTask } from './models';

@Injectable({ providedIn: 'root' })
export class CreatorsContentService {

  missions: CreatorsMission[] = [
    {
      id: 1,
      title: 'O Alfabeto da Autoria',
      subtitle: 'Aprenda os símbolos mágicos que protegem as obras',
      type: 'license-cards',
      briefing: [
        { speaker: 'justino', text: 'Olá! Eu sou o Inspetor Justino 🕵️‍♂️, o guardião dos Direitos Autorais na internet.' },
        { speaker: 'justino', text: 'Você sabia que toda foto, texto ou música na internet tem um dono? Não podemos simplesmente copiar tudo o que vemos pela frente!' },
        { speaker: 'justino', text: 'Para sabermos se podemos ou não usar algo, existem símbolos secretos chamados LICENÇAS. É como se fosse um semáforo da internet.' },
        { speaker: 'justino', text: 'Sua primeira missão é decifrar o Alfabeto da Autoria. Mostre que você conhece o que cada símbolo significa!' }
      ],
      debriefing: [
        { speaker: 'justino', text: 'Muito bem, Inspetor Júnior! Você decifrou o Código das Licenças.' },
        { speaker: 'justino', text: 'Lembre-se sempre da regra de ouro: se tem um ©️ Copyright, pare e não use sem pedir! Se for CC0 ou Domínio Público, o caminho está livre.' },
        { speaker: 'justino', text: 'Agora que você conhece a teoria, é hora da prática. Vista sua toga, pois o Tribunal do Plágio te aguarda! ⚖️' }
      ]
    },
    {
      id: 2,
      title: 'Tribunal do Plágio Escolar',
      subtitle: 'Julgue os casos de cópia e pesquisa na escola',
      type: 'plagiarism-court',
      briefing: [
        { speaker: 'justino', text: 'Bem-vindo ao Tribunal do Plágio, Meritíssimo! ⚖️' },
        { speaker: 'justino', text: 'Aqui nós julgamos as ações de alunos ao fazerem suas pesquisas escolares. Plágio é crime: é roubar o suor intelectual de outra pessoa.' },
        { speaker: 'justino', text: 'Leia atentamente a situação e a atitude do aluno. Se ele deu créditos ou usou imagens livres, a ação é LEGAL. Se ele apenas copiou e colou sem avisar, é PLÁGIO!' },
        { speaker: 'justino', text: 'Atenção ao bater o martelo. Que a justiça seja feita!' }
      ],
      debriefing: [
        { speaker: 'justino', text: 'A justiça escolar agradece seus serviços! 👩‍⚖️' },
        { speaker: 'justino', text: 'Você pegou os copistas no pulo e premiou os criadores éticos. Citar a fonte não diminui sua nota; pelo contrário, mostra que você sabe pesquisar!' },
        { speaker: 'justino', text: 'Porém... o mundo evoluiu. Novas tecnologias trouxeram novos crimes cibernéticos. Prepare-se para o módulo avançado...' }
      ]
    },
    {
      id: 3,
      title: 'Tribunal Digital: IA e Internet',
      subtitle: 'Resolva dilemas modernos sobre autoria',
      type: 'plagiarism-court',
      briefing: [
        { speaker: 'justino', text: 'O mundo mudou. Hoje temos Inteligência Artificial, redes sociais, dancinhas de TikTok e influenciadores. 📱🤖' },
        { speaker: 'justino', text: 'As regras de Direitos Autorais se aplicam a TUDO isso. Se você pede para um robô escrever seu trabalho, a autoria é sua?' },
        { speaker: 'justino', text: 'Se você imita um vídeo da internet, você é um criador ou um copiador?' },
        { speaker: 'justino', text: 'Nesta fase, julgue casos desafiadores do nosso mundo superconectado. Mostre que sua bússola ética funciona até com robôs!' }
      ],
      debriefing: [
        { speaker: 'justino', text: 'Missão Cumprida, Juiz Cibernético! 🏆' },
        { speaker: 'justino', text: 'Você entende que a ética não muda só porque a tecnologia avançou. Criar dá trabalho, e todo criador merece respeito e crédito.' },
        { speaker: 'justino', text: 'A partir de hoje, você é um protetor oficial da criatividade. Espalhe esse conhecimento!' }
      ]
    }
  ];

  licenseTasks: LicenseTask[] = [
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

  plagiarismTasksModule2: PlagiarismTask[] = [
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
      scenario: 'Um aluno viu um infográfico muito explicativo sobre a água no Pinterest.',
      studentAction: 'Ele reproduziu o mesmo infográfico desenhando com as próprias mãos no papel, copiando todas as palavras iguais e não citou de onde tirou a ideia.',
      isCorrectUse: false,
      feedback: 'PLÁGIO DE IDEIA! Copiar a estrutura e os dados idênticos de outra pessoa e fingir que a ideia foi sua, mesmo redesenhando, é plágio. Sempre cite a inspiração!'
    }
  ];

  plagiarismTasksModule3: PlagiarismTask[] = [
    {
      scenario: 'Marcos tinha que fazer um resumo de um livro para a aula de história.',
      studentAction: 'Ele abriu o ChatGPT, pediu para a IA gerar o resumo, copiou o texto, colou no Word, e entregou como se ele mesmo tivesse lido e escrito.',
      isCorrectUse: false,
      feedback: 'PLÁGIO POR IA (DESONESTIDADE ACADÊMICA)! O trabalho da escola avalia a SUA leitura e escrita, não a do robô. Fingir que o texto da IA foi escrito por você é fraude escolar.'
    },
    {
      scenario: 'Laura precisava entender um conceito difícil de matemática.',
      studentAction: 'Ela usou o ChatGPT como tutor para explicar a matéria com exemplos de jogos. Depois que entendeu, fechou a IA e resolveu os exercícios sozinha no caderno.',
      isCorrectUse: true,
      feedback: 'USO CORRETO! Usar a Inteligência Artificial como assistente de estudo e tutor particular é excelente e totalmente ético!'
    },
    {
      scenario: 'Thiago viu uma dancinha de TikTok viral criada por um coreógrafo menos famoso.',
      studentAction: 'Thiago gravou um vídeo imitando a dancinha perfeitamente, não marcou o criador original ("dc" - dance credits) e ganhou milhares de likes dizendo que a dança era sua.',
      isCorrectUse: false,
      feedback: 'PLÁGIO DE CONTEÚDO DIGITAL! Coreografias são obras protegidas! Se você usar a ideia de alguém, sempre dê o "dc" (créditos de dança) para o criador original.'
    },
    {
      scenario: 'Amanda queria uma imagem de capa futurista para o seu slide escolar.',
      studentAction: 'Ela usou um gerador de imagens por IA (Midjourney/DALL-E) e colocou no final do slide: "Imagem de capa gerada utilizando IA (Midjourney)".',
      isCorrectUse: true,
      feedback: 'USO CORRETO! Amanda foi transparente. Ela usou a tecnologia a seu favor, mas deixou muito claro para todos que a imagem não era uma obra humana.'
    },
    {
      scenario: 'Felipe achou o canal no YouTube de um criador pequeno ensinando a consertar videogame.',
      studentAction: 'Felipe baixou o vídeo, gravou sua própria voz por cima repetindo todas as dicas palavra por palavra e postou no seu canal para ganhar dinheiro.',
      isCorrectUse: false,
      feedback: 'PLÁGIO E ROUBO DE CONTEÚDO! Ele roubou a propriedade intelectual, o roteiro e o trabalho visual de outro criador. Isso derruba canais na internet e pode dar processo!'
    }
  ];

  getFilteredData(isDemoMode: boolean) {
    if (isDemoMode) {
      return {
        licenseTasks: this.licenseTasks.slice(0, 2),
        plagiarismTasksModule2: this.plagiarismTasksModule2.slice(0, 2),
        plagiarismTasksModule3: this.plagiarismTasksModule3.slice(0, 2)
      };
    }
    return {
      licenseTasks: this.licenseTasks,
      plagiarismTasksModule2: this.plagiarismTasksModule2,
      plagiarismTasksModule3: this.plagiarismTasksModule3
    };
  }
}
