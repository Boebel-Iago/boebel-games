import { Injectable } from '@angular/core';
import { CyberMission } from './models';

@Injectable({ providedIn: 'root' })
export class BrowserSearchContentService {
  missions: CyberMission[] = [
    {
      id: 'mission_1',
      title: 'Missão 1: O Painel da Nave',
      type: 'anatomy',
      briefing: [
        { speaker: 'T-B0T', text: 'Bip-bop! Olá, recruta! Eu sou T-B0T, seu navegador de bordo. Bem-vindo à Agência de Cyber Exploradores!' },
        { speaker: 'T-B0T', text: 'Antes de mergulharmos na Grande Teia, você precisa conhecer o painel de controle da nossa Nave-Navegador.' },
        { speaker: 'T-B0T', text: 'Eu vou pedir um comando e você deve tocar no botão correto do painel. Preparado para a decolagem?' }
      ],
      tasks: [
        { id: 'url', instruction: 'Onde digitamos o endereço do planeta... digo, do site que queremos visitar? Toque na BARRA DE ENDEREÇO.', feedback: 'Bip-Bop! Exato! A Barra de Endereço é o volante da nossa nave.' },
        { id: 'back', instruction: 'Entrou num buraco negro por engano? Toque no botão para VOLTAR à página anterior.', feedback: 'Isso! A seta para a esquerda sempre nos salva e nos traz de volta em segurança.' },
        { id: 'forward', instruction: 'Voltou demais e se arrependeu? Toque no botão para AVANÇAR para a página que estávamos.', feedback: 'Muito bem! A seta para a direita avança no tempo do nosso histórico.' },
        { id: 'refresh', instruction: 'A página travou no meio do caminho? Toque no botão de RECARREGAR (aquela setinha em círculo).', feedback: 'Perfeito! Recarregar faz o painel buscar a página de novo do zero.' },
        { id: 'lock', instruction: 'Quer ter certeza que não há piratas roubando nossos dados? Toque no CADEADO DE SEGURANÇA.', feedback: 'Atenção total! Se o cadeado estiver fechado e verde, a conexão da nossa nave está criptografada e segura.' },
        { id: 'bookmark', instruction: 'Achou um planeta super legal e quer salvar o mapa? Toque na ESTRELINHA DE FAVORITOS.', feedback: 'Excelente! Favoritos guardam os endereços para viajarmos para lá rapidinho da próxima vez!' }
      ]
    },
    {
      id: 'mission_2',
      title: 'Missão 2: O Filtro Mágico',
      type: 'keyword_search',
      briefing: [
        { speaker: 'T-B0T', text: 'Excelente pilotagem! Mas agora temos um problema no motor de busca.' },
        { speaker: 'T-B0T', text: 'A nave está muito pesada porque você está digitando palavras desnecessárias! Precisamos usar o Filtro Mágico.' },
        { speaker: 'T-B0T', text: 'A regra de ouro dos Cyber Exploradores: O motor de busca ODEIA pronomes (eu, você, meu) e preposições (de, para, com). Selecione apenas as palavras essenciais!' }
      ],
      tasks: [
        {
          situation: 'Você quer ver vídeos de cachorros engraçados. Qual a melhor pesquisa?',
          correctKeywords: ['vídeos', 'cachorros', 'engraçados'],
          alternativeKeywords: [['cachorros', 'engraçados']],
          distractorWords: ['eu', 'quero', 'ver', 'uns', 'de', 'para', 'mim'],
          feedback: 'Bip! Perfeito! Tirando "eu quero ver", sobrou apenas a essência da pesquisa!'
        },
        {
          situation: 'Você precisa saber qual é o menor país do mundo inteiro.',
          correctKeywords: ['menor', 'país', 'mundo'],
          distractorWords: ['qual', 'é', 'o', 'do', 'inteiro', 'me', 'diga'],
          feedback: 'Acelerando! Se você perguntar "qual é o", o motor se confunde. "Menor país mundo" é muito mais rápido!'
        },
        {
          situation: 'Você quer comprar uma bola de futebol vermelha.',
          correctKeywords: ['comprar', 'bola', 'futebol', 'vermelha'],
          alternativeKeywords: [['preço', 'bola', 'futebol', 'vermelha'], ['bola', 'futebol', 'vermelha']],
          distractorWords: ['eu', 'quero', 'uma', 'para', 'brincar', 'qual', 'o'],
          feedback: 'Na mosca! Objeto + Cor + Ação. A busca ideal!'
        }
      ]
    },
    {
      id: 'mission_3',
      title: 'Missão 3: Resgate Amazônico',
      type: 'keyword_search',
      briefing: [
        { speaker: 'T-B0T', text: 'ALERTA VERMELHO! O sistema da Escola Municipal perdeu todos os dados de biologia e história.' },
        { speaker: 'T-B0T', text: 'As crianças não têm como fazer o dever de casa! Você precisa encontrar as informações perdidas na selva de dados do Brasil.' },
        { speaker: 'T-B0T', text: 'Cuidado: se você não for específico, vai encontrar animais de outro país!' }
      ],
      tasks: [
        {
          situation: 'O professor perguntou onde fica o ninho do Pica-Pau-Amarelo no Brasil.',
          correctKeywords: ['ninho', 'Pica-Pau-Amarelo', 'Brasil'],
          alternativeKeywords: [['onde', 'vive', 'Pica-Pau-Amarelo', 'Brasil']],
          distractorWords: ['o', 'professor', 'perguntou', 'qual', 'lugar', 'do'],
          feedback: 'Isso! Focar no pássaro e na região ("Brasil") garante que a resposta será exata.'
        },
        {
          situation: 'Pesquise sobre a história do descobrimento do Brasil para um trabalho.',
          correctKeywords: ['resumo', 'história', 'descobrimento', 'Brasil'],
          alternativeKeywords: [['história', 'descobrimento', 'Brasil']],
          distractorWords: ['fazer', 'trabalho', 'sobre', 'a', 'do', 'na', 'escola'],
          feedback: 'Bip-Bop! A palavra mágica "resumo" ajuda muito quando precisamos de conteúdo escolar direto ao ponto.'
        },
        {
          situation: 'Você precisa descobrir quanto pesa a onça pintada macho adulta.',
          correctKeywords: ['peso', 'onça', 'pintada', 'macho'],
          alternativeKeywords: [['quanto', 'pesa', 'onça', 'pintada']],
          distractorWords: ['eu', 'preciso', 'descobrir', 'a', 'adulta', 'que', 'vive'],
          feedback: 'Muito bem! "Peso" e a espécie exata é tudo que o banco de dados do Google precisa.'
        }
      ]
    },
    {
      id: 'mission_4',
      title: 'Missão 4: O Hacker',
      type: 'keyword_search',
      briefing: [
        { speaker: 'T-B0T', text: 'Bzzzt! Tem algo errado! Nossas telas estão piscando.' },
        { speaker: 'T-B0T', text: 'Os computadores do laboratório estão com problemas técnicos! Muitas vezes o suporte técnico demora para chegar.' },
        { speaker: 'T-B0T', text: 'Um verdadeiro Cyber Explorador sabe pesquisar seus próprios problemas técnicos. Ajude-me a consertar os computadores formulando perguntas técnicas precisas!' }
      ],
      tasks: [
        {
          situation: 'A tela do seu computador com Windows 11 ficou de cabeça para baixo sem querer.',
          correctKeywords: ['tela', 'cabeça', 'para', 'baixo', 'Windows 11'],
          alternativeKeywords: [['como', 'desvirar', 'tela', 'Windows 11'], ['virar', 'tela', 'Windows 11']],
          distractorWords: ['sem', 'querer', 'ficou', 'de', 'do', 'meu', 'ajuda'],
          feedback: 'Exatamente! Ao colocar "Windows 11", a internet sabe exatamente para qual sistema dar a solução.'
        },
        {
          situation: 'Seu celular da marca Motorola não está conectando no Wi-Fi da escola.',
          correctKeywords: ['celular', 'Motorola', 'não', 'conecta', 'Wi-Fi'],
          alternativeKeywords: [['Motorola', 'não', 'conecta', 'Wi-Fi']],
          distractorWords: ['meu', 'na', 'escola', 'ajuda', 'o', 'que', 'fazer'],
          feedback: 'Bip! Informar a marca (Motorola) e o problema (não conecta Wi-Fi) te leva direto à página de suporte da fabricante.'
        },
        {
          situation: 'O teclado do computador parou de funcionar e você quer saber como abrir o teclado virtual na tela.',
          correctKeywords: ['como', 'abrir', 'teclado', 'virtual'],
          alternativeKeywords: [['teclado', 'virtual', 'tela']],
          distractorWords: ['meu', 'quebrou', 'parou', 'de', 'funcionar', 'quero', 'saber'],
          feedback: 'Formidável! Às vezes não precisamos pesquisar o problema ("teclado quebrou"), mas sim pesquisar direto a SOLUÇÃO ("teclado virtual")!'
        },
        {
          situation: 'Você precisa limpar o histórico de navegação do seu Google Chrome porque ele está lento.',
          correctKeywords: ['como', 'limpar', 'histórico', 'Google Chrome'],
          alternativeKeywords: [['limpar', 'histórico', 'Chrome']],
          distractorWords: ['ele', 'está', 'muito', 'lento', 'do', 'meu', 'porque'],
          feedback: 'Sensacional! Você é oficialmente um Mestre da Pesquisa. A internet não guarda mais nenhum segredo para você!'
        }
      ]
    }
  ];

  getMissions(): CyberMission[] {
    return this.missions;
  }
}
