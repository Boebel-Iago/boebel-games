import { Injectable } from '@angular/core';
import { CreatorsMission, LicenseTask, PlagiarismTask, DragDropItem, AuditTask } from './models';

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
        { speaker: 'justino', text: 'A seguir, a Delegacia Anti-Cópia precisa da sua ajuda com uma papelada que chegou misturada...' }
      ]
    },
    {
      id: 4,
      title: 'A Grande Triagem',
      subtitle: 'Classifique as atitudes nas pastas corretas',
      type: 'drag-drop',
      briefing: [
        { speaker: 'justino', text: 'Alerta! 🚨 Ocorreu um vazamento no arquivo da Delegacia Anti-Cópia!' },
        { speaker: 'justino', text: 'Temos várias atitudes misturadas em nossa mesa. Você precisará arrastar cada atitude para a sua respectiva caixa.' },
        { speaker: 'justino', text: 'Caixa 1: Uso Livre (Domínio Público). Caixa 2: Permitido, mas EXIGE CRÉDITOS (CC BY). Caixa 3: Plágio / Pirataria (Totalmente Ilegal).' },
        { speaker: 'justino', text: 'Seja minucioso! Se algo exige créditos e você colocar como Uso Livre, a triagem falhará.' }
      ],
      debriefing: [
        { speaker: 'justino', text: 'Excelente organização! Os arquivos da delegacia estão em ordem novamente.' },
        { speaker: 'justino', text: 'Agora, para a sua provação final. Você foi contratado como o Auditor Chefe de um projeto gigante...' }
      ]
    },
    {
      id: 5,
      title: 'Auditoria Final do Projeto',
      subtitle: 'Revise o site da escola antes que ele vá ao ar',
      type: 'audit',
      briefing: [
        { speaker: 'justino', text: 'A Escola Estadual do Futuro está prestes a lançar seu novo site para o mundo inteiro ver! 🌐' },
        { speaker: 'justino', text: 'Mas a diretora está preocupada... "E se os alunos usaram coisas protegidas por Copyright? A escola pode ser processada!"' },
        { speaker: 'justino', text: 'Seu trabalho final é auditar 10 recursos que foram colocados no site. Olhe a licença original e veja como os alunos usaram.' },
        { speaker: 'justino', text: 'Se estiver tudo certo, Aprove. Se tiver erro de licença, Reprove antes que o site vá para o ar!' }
      ],
      debriefing: [
        { speaker: 'justino', text: 'Ufa! O site foi salvo graças à sua auditoria impecável!' },
        { speaker: 'justino', text: 'Você provou que não apenas sabe a teoria, mas consegue aplicá-la em um grande projeto do mundo real.' },
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

  dragDropData: DragDropItem[][] = [
    // Fase 1
    [
      { id: 'i1', description: 'Usar música de um Mozart (falecido há mais de 100 anos)', category: 'LIVRE' },
      { id: 'i2', description: 'Usar foto com selo "Domínio Público"', category: 'LIVRE' },
      { id: 'i3', description: 'Usar texto da Wikipédia citando os autores', category: 'CREDITOS' },
      { id: 'i4', description: 'Usar foto do Unsplash citando o fotógrafo', category: 'CREDITOS' },
      { id: 'i5', description: 'Copiar o trabalho de Artes do colega', category: 'PLAGIO' }
    ],
    // Fase 2
    [
      { id: 'i6', description: 'Fazer o download de um filme pirata para vender', category: 'PLAGIO' },
      { id: 'i7', description: 'Usar foto com selo ©️ Copyright sem autorização', category: 'PLAGIO' },
      { id: 'i8', description: 'Pegar uma receita antiga de pão da vovó e modificar', category: 'LIVRE' },
      { id: 'i9', description: 'Usar um vídeo CC BY e colocar o nome do criador original', category: 'CREDITOS' },
      { id: 'i10', description: 'Clonar a dancinha de alguém sem dar "dc"', category: 'PLAGIO' }
    ],
    // Fase 3
    [
      { id: 'i11', description: 'Apagar a marca d\'água de uma foto para usar de graça', category: 'PLAGIO' },
      { id: 'i12', description: 'Mudar duas palavras de um texto da web e assinar seu nome', category: 'PLAGIO' },
      { id: 'i13', description: 'Baixar um modelo 3D do governo marcado como CC0', category: 'LIVRE' },
      { id: 'i14', description: 'Apresentar dados do IBGE, colocando a fonte no rodapé', category: 'CREDITOS' },
      { id: 'i15', description: 'Entregar texto feito 100% pelo ChatGPT como autoria própria', category: 'PLAGIO' }
    ],
    // Fase 4
    [
      { id: 'i16', description: 'Gravar um vídeo da chuva na rua da sua casa', category: 'LIVRE' },
      { id: 'i17', description: 'Usar uma música folclórica antiga sem dono registrado', category: 'LIVRE' },
      { id: 'i18', description: 'Pegar trecho de um podcast, editando e citando o nome do host', category: 'CREDITOS' },
      { id: 'i19', description: 'Tirar a assinatura do artista de uma arte do Instagram', category: 'PLAGIO' },
      { id: 'i20', description: 'Traduzir um artigo inteiro e postar como seu', category: 'PLAGIO' }
    ],
    // Fase 5
    [
      { id: 'i21', description: 'Fazer um desenho totalmente original com suas próprias mãos', category: 'LIVRE' },
      { id: 'i22', description: 'Usar dados de uma universidade aberta colocando o link', category: 'CREDITOS' },
      { id: 'i23', description: 'Baixar um trabalho escolar pronto e trocar o nome da capa', category: 'PLAGIO' },
      { id: 'i24', description: 'Copiar o trabalho que o irmão fez anos atrás', category: 'PLAGIO' },
      { id: 'i25', description: 'Usar imagens de IA deixando claro que foram geradas por IA', category: 'CREDITOS' }
    ]
  ];

  auditTasks: AuditTask[] = [
    {
      assetName: 'Logo do Site',
      originalLicense: '©️ Copyright (Nike Inc.)',
      studentAction: 'O aluno pegou a logo da Nike no Google, pintou de azul e usou como a logo do projeto da escola.',
      isApproved: false,
      feedback: 'REPROVADO! O Copyright não permite derivações. Alterar a cor de uma marca registrada não tira os direitos autorais dela. É crime de pirataria de marca!'
    },
    {
      assetName: 'Música de Fundo do Vídeo Institucional',
      originalLicense: 'Domínio Público (Beethoven - Sinfonia nº 5)',
      studentAction: 'O aluno usou uma gravação em Domínio Público como fundo musical e não colocou os créditos do compositor.',
      isApproved: true,
      feedback: 'APROVADO! Obras em Domínio Público não exigem legalmente atribuição de créditos (embora seja educado). O uso é 100% livre.'
    },
    {
      assetName: 'Fotos da Página Inicial',
      originalLicense: '👤 Atribuição (CC BY)',
      studentAction: 'O aluno colocou várias fotos lindas, mas a página não tem nenhuma menção a quem tirou as fotos.',
      isApproved: false,
      feedback: 'REPROVADO! A licença CC BY permite o uso, MAS exige créditos. Sem o nome do autor, o uso vira uma violação de direitos autorais.'
    },
    {
      assetName: 'Texto sobre a História da Escola',
      originalLicense: 'Criação Própria',
      studentAction: 'O aluno entrevistou os professores antigos, gravou o áudio e escreveu o texto todo com suas próprias palavras.',
      isApproved: true,
      feedback: 'APROVADO COM LOUVOR! Isso é criação original autêntica. O aluno é o detentor dos direitos autorais deste texto.'
    },
    {
      assetName: 'Ícones dos Botões',
      originalLicense: '🚫💲 Uso Não Comercial (CC NC)',
      studentAction: 'O aluno usou os ícones para fazer uma página que vende camisetas para arrecadar dinheiro para a formatura.',
      isApproved: false,
      feedback: 'REPROVADO! O uso é proibido. A licença "Non-Commercial" proíbe ganhar dinheiro, não importa se é para doação ou formatura. Apenas uso estritamente não-comercial é permitido.'
    },
    {
      assetName: 'Gráficos de Pesquisa',
      originalLicense: '👤 Atribuição (CC BY)',
      studentAction: 'O aluno redesenhou os gráficos no Canva usando as mesmas cores, e colocou abaixo: "Dados obtidos do Instituto Nacional (CC BY)".',
      isApproved: true,
      feedback: 'APROVADO! Ele deu a atribuição exigida pela licença CC BY. Tudo feito dentro da lei e da ética.'
    }
  ];

  getFilteredData(isDemoMode: boolean) {
    if (isDemoMode) {
      return {
        licenseTasks: this.licenseTasks.slice(0, 2),
        plagiarismTasksModule2: this.plagiarismTasksModule2.slice(0, 2),
        plagiarismTasksModule3: this.plagiarismTasksModule3.slice(0, 2),
        dragDropData: this.dragDropData.slice(0, 1),
        auditTasks: this.auditTasks.slice(0, 2)
      };
    }
    return {
      licenseTasks: this.licenseTasks,
      plagiarismTasksModule2: this.plagiarismTasksModule2,
      plagiarismTasksModule3: this.plagiarismTasksModule3,
      dragDropData: this.dragDropData,
      auditTasks: this.auditTasks
    };
  }
}
