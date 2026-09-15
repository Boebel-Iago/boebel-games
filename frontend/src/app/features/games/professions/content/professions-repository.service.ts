import { Injectable } from '@angular/core';
import { Profession, Scenario } from './professions.model';

@Injectable()
export class ProfessionsRepository {
  
  private professions: Profession[] = [
    {
      name: 'Médica', icon: '👩‍⚕️',
      correctTool: { name: 'Máquina de Ultrassom', icon: '🖥️' },
      wrongTools: [{ name: 'Batedeira', icon: '🥣' }, { name: 'Trator', icon: '🚜' }],
      feedback: 'A médica usa a tecnologia para ver dentro do nosso corpo!',
      hardwareDesc: 'O monitor e o sensor (a parte física que toca na pele).',
      softwareDesc: 'O programa de computador que transforma o sinal em uma imagem na tela.'
    },
    {
      name: 'Produtor Musical', icon: '🎹',
      correctTool: { name: 'Teclado e Computador', icon: '🎧' },
      wrongTools: [{ name: 'Microscópio', icon: '🔬' }, { name: 'Foguete', icon: '🚀' }],
      feedback: 'A tecnologia ajuda a criar e gravar músicas incríveis!',
      hardwareDesc: 'As teclas físicas do controlador, o cabo e o notebook.',
      softwareDesc: 'O aplicativo de gravação e os instrumentos virtuais que geram o som.'
    },
    {
      name: 'Arquiteta', icon: '📐',
      correctTool: { name: 'Mesa Digitalizadora', icon: '🖊️' },
      wrongTools: [{ name: 'Panela', icon: '🥘' }, { name: 'Câmera', icon: '📸' }],
      feedback: 'Antes de construir uma casa real, ela é desenhada no computador.',
      hardwareDesc: 'A caneta digital e a tela física onde ela desenha.',
      softwareDesc: 'O sistema de desenho 3D que calcula as medidas das paredes.'
    },
    {
      name: 'Caixa de Mercado', icon: '🛒',
      correctTool: { name: 'Caixa Registradora', icon: '📠' },
      wrongTools: [{ name: 'Vassoura', icon: '🧹' }, { name: 'Secador', icon: '💨' }],
      feedback: 'A tecnologia faz a conta das compras muito mais rápido!',
      hardwareDesc: 'O leitor de código de barras e a gaveta de dinheiro.',
      softwareDesc: 'O sistema do mercado que sabe o preço exato de cada produto.'
    },
    {
      name: 'Professor', icon: '👨‍🏫',
      correctTool: { name: 'Lousa Digital', icon: '📺' },
      wrongTools: [{ name: 'Pá de Construção', icon: '⛏️' }, { name: 'Frigideira', icon: '🍳' }],
      feedback: 'O professor usa a lousa interativa para deixar a aula mais divertida!',
      hardwareDesc: 'A tela gigante que podemos tocar com o dedo.',
      softwareDesc: 'O aplicativo de desenho e os jogos educativos que rodam nela.'
    },
    {
      name: 'Fotógrafa', icon: '📷',
      correctTool: { name: 'Câmera Digital', icon: '📸' },
      wrongTools: [{ name: 'Martelo', icon: '🔨' }, { name: 'Regador', icon: '🚿' }],
      feedback: 'Ela captura momentos especiais usando muita tecnologia.',
      hardwareDesc: 'A lente, os botões e o cartão de memória da câmera.',
      softwareDesc: 'O sistema interno que ajusta a luz e salva a foto.'
    },
    {
      name: 'Piloto de Avião', icon: '✈️',
      correctTool: { name: 'Painel de Navegação', icon: '🎛️' },
      wrongTools: [{ name: 'Tinta e Pincel', icon: '🎨' }, { name: 'Vara de Pescar', icon: '🎣' }],
      feedback: 'O avião é uma máquina super inteligente que voa pelo céu.',
      hardwareDesc: 'As telas do painel e o manche (volante) do avião.',
      softwareDesc: 'O programa de GPS que mostra a rota nas nuvens.'
    },
    {
      name: 'Mecânico', icon: '👨‍🔧',
      correctTool: { name: 'Scanner Automotivo', icon: '📟' },
      wrongTools: [{ name: 'Microfone', icon: '🎤' }, { name: 'Prancha de Surf', icon: '🏄' }],
      feedback: 'Hoje em dia, os carros também têm computadores dentro deles!',
      hardwareDesc: 'O cabo e a maquininha com tela que ele liga no carro.',
      softwareDesc: 'O programa que lê a "mente" do carro para achar o defeito.'
    },
    {
      name: 'Cientista', icon: '👩‍🔬',
      correctTool: { name: 'Microscópio Digital', icon: '🔬' },
      wrongTools: [{ name: 'Bola de Futebol', icon: '⚽' }, { name: 'Violão', icon: '🎸' }],
      feedback: 'A ciência usa a tecnologia para descobrir coisas minúsculas.',
      hardwareDesc: 'As lentes especiais e o cabo que liga no computador.',
      softwareDesc: 'O software que dá zoom e tira fotos das bactérias.'
    },
    {
      name: 'Agricultor', icon: '👨‍🌾',
      correctTool: { name: 'Drone de Plantação', icon: '🚁' },
      wrongTools: [{ name: 'Liquidificador', icon: '🥤' }, { name: 'Maquiagem', icon: '💄' }],
      feedback: 'A tecnologia voa sobre a fazenda para cuidar das plantas.',
      hardwareDesc: 'As hélices, a bateria e o controle remoto do Drone.',
      softwareDesc: 'O aplicativo de celular que faz o Drone voar sozinho.'
    }
  ];

  private scenarios: Scenario[] = [
    { 
      description: 'Assistir a um filme de animação.', 
      icon: '🍿', 
      type: 'LAZER', 
      feedback: 'Você usou a tecnologia para se divertir e relaxar!',
      hardwareDesc: 'A tela do Tablet ou a Smart TV.',
      softwareDesc: 'O aplicativo de vídeos (como Netflix ou YouTube).'
    },
    { 
      description: 'Digitar um relatório do escritório.', 
      icon: '📄', 
      type: 'TRABALHO', 
      feedback: 'A tecnologia é essencial para organizar informações.',
      hardwareDesc: 'O teclado físico e o mouse do Notebook.',
      softwareDesc: 'O editor de textos (como o Word ou Google Docs).'
    },
    { 
      description: 'Jogar online com os amigos.', 
      icon: '🎮', 
      type: 'LAZER', 
      feedback: 'A diversão conectada depende da tecnologia!',
      hardwareDesc: 'O console do videogame e os botões do controle.',
      softwareDesc: 'O código do jogo digital que cria o mundo virtual.'
    },
    { 
      description: 'Programar um aplicativo novo.', 
      icon: '👨‍💻', 
      type: 'TRABALHO', 
      feedback: 'Criar novas tecnologias é uma profissão muito importante!',
      hardwareDesc: 'Os servidores, os monitores e o computador.',
      softwareDesc: 'A linguagem de código que diz para a máquina o que fazer.'
    },
    { 
      description: 'Ouvir músicas no fone de ouvido enquanto descansa.', 
      icon: '🎧', 
      type: 'LAZER', 
      feedback: 'A música digital viaja pelo ar até o seu fone.',
      hardwareDesc: 'O fone de ouvido sem fio (Bluetooth) e o celular.',
      softwareDesc: 'O aplicativo de música (como o Spotify) que toca o som.'
    },
    { 
      description: 'Fazer uma videochamada de reunião com o chefe.', 
      icon: '👔', 
      type: 'TRABALHO', 
      feedback: 'A tecnologia conecta profissionais do mundo inteiro.',
      hardwareDesc: 'A câmera (webcam) e o microfone do notebook.',
      softwareDesc: 'O programa de reuniões online (como o Google Meet).'
    },
    { 
      description: 'Ler um livro digital (e-book) de aventuras na cama.', 
      icon: '📖', 
      type: 'LAZER', 
      feedback: 'Milhares de livros podem caber em um único aparelho!',
      hardwareDesc: 'O leitor digital (como o Kindle) e sua tela.',
      softwareDesc: 'O sistema que guarda as páginas virtuais do livro.'
    },
    { 
      description: 'Controlar o estoque de roupas de uma loja.', 
      icon: '👗', 
      type: 'TRABALHO', 
      feedback: 'A tecnologia evita que as lojas percam produtos.',
      hardwareDesc: 'O tablet que o vendedor segura na mão.',
      softwareDesc: 'O aplicativo que anota quantas blusas ainda têm para vender.'
    },
    { 
      description: 'Brincar de fazer um desenho digital colorido.', 
      icon: '🎨', 
      type: 'LAZER', 
      feedback: 'A arte digital não precisa de papel ou tinta de verdade.',
      hardwareDesc: 'O tablet e a caneta especial de toque.',
      softwareDesc: 'O aplicativo de pintura com pincéis virtuais.'
    },
    { 
      description: 'Motorista de aplicativo levando passageiros.', 
      icon: '🚗', 
      type: 'TRABALHO', 
      feedback: 'O GPS mudou a forma como as pessoas viajam pela cidade.',
      hardwareDesc: 'O celular grudado no painel do carro.',
      softwareDesc: 'O aplicativo de rotas (como Uber ou Waze).'
    }
  ];

  getProfession(index: number): Profession | null {
    return this.professions[index] || null;
  }

  getScenario(index: number): Scenario | null {
    return this.scenarios[index] || null;
  }

  getTotalProfessions(): number {
    return this.professions.length;
  }

  getTotalPhases(): number {
    return this.professions.length + this.scenarios.length;
  }
}
