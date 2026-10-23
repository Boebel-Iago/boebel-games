import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface TimelineCard {
  id: string;
  name: string;
  icon: string;
  correctSlotIndex: number;
}

export interface ClassifierItem {
  id: string;
  text: string;
  icon: string;
  correctCategory: 'machine' | 'human';
}

export interface WorkEvolutionTask {
  id: number;
  module: number;
  phase: number;
  type?: 'quiz' | 'timeline_drag' | 'classifier_drag';
  era?: string;
  badge: string;
  title: string;
  historicalContext: string;
  comparison?: {
    pastLabel: string;
    pastValue: string;
    pastIcon: string;
    modernLabel: string;
    modernValue: string;
    modernIcon: string;
  };
  timelineSteps?: { step: string; period: string; tech: string }[];
  question: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  didacticExplanation: string;
  timelineCards?: TimelineCard[];
  classifierItems?: ClassifierItem[];
}

export interface GameState {
  module: number;
  phase: number;
  hearts: number;
  deathCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AutomationRoboticsEngineService {
  state: GameState = { module: 0, phase: 0, hearts: 3, deathCount: 0 };
  public state$ = new BehaviorSubject<GameState>({ ...this.state });

  get score(): number {
    return Math.max(0, (this.state.module * 200) + (this.state.phase * 20) - (this.state.deathCount * 20));
  }

  // 5 Módulos x 10 Fases = 50 Desafios sobre "A Evolução do Trabalho: Do Manual ao Digital"
  public tasks: WorkEvolutionTask[][] = [
    // MÓDULO 1: O Trabalho Antigo e a Era do Esforço Físico (Manual)
    [
      {
        id: 1,
        module: 0,
        phase: 0,
        era: 'Era Manual',
        badge: 'Comunicação',
        title: 'Os Escribas e a Cópia de Livros à Mão',
        historicalContext: 'Na Idade Média, antes da imprensa e dos computadores, um único exemplar da Bíblia ou de um livro de ciências levava até 3 anos de trabalho ininterrupto de um escriba, usando pena de ganso e tinta vegetal.',
        comparison: {
          pastLabel: 'Trabalho Manual (Século XIV)',
          pastValue: '1 livro a cada 3 anos copiado pena por pena',
          pastIcon: '🪶',
          modernLabel: 'Trabalho Digital (Hoje)',
          modernValue: 'Milhões de cópias digitais em 1 segundo via download',
          modernIcon: '📱'
        },
        question: 'Qual era o principal fator que limitava a velocidade e a circulação do conhecimento na era manual?',
        options: [
          { id: 'a', text: 'O ritmo do trabalho dependia exclusivamente da resistência física das mãos e da visão dos escribas', isCorrect: true },
          { id: 'b', text: 'Porque os reis proibiam que os livros fossem lidos durante o dia', isCorrect: false },
          { id: 'c', text: 'Porque as pessoas do passado preferiam não ler nada para descansar os olhos', isCorrect: false },
          { id: 'd', text: 'Porque a internet medieval caía frequentemente com chuvas fortes', isCorrect: false }
        ],
        didacticExplanation: 'Na Era Manual, a produção dependia do limite muscular e biológico dos trabalhadores. Por isso, livros eram artigos raros e caríssimos guardados sob chave.'
      },
      {
        id: 2,
        module: 0,
        phase: 1,
        era: 'Era Manual',
        badge: 'Agricultura',
        title: 'A Colheita de Trigo com Foice Manual',
        historicalContext: 'Durante milhares de anos, a humanidade dependeu da foice e da enxada para colher grãos. Uma família inteira trabalhava de sol a sol por semanas para colher um único hectare de trigo.',
        comparison: {
          pastLabel: 'Esforço Físico Manual',
          pastValue: 'Foice rústica de ferro e braços cansados',
          pastIcon: '🌾',
          modernLabel: 'Agricultura Automatizada',
          modernValue: 'Colheitadeira autônoma com GPS e sensores de grãos',
          modernIcon: '🚜'
        },
        question: 'Como a tecnologia transformou o significado do trabalho no campo?',
        options: [
          { id: 'a', text: 'Poupou o ser humano do esgotamento físico extremo e aumentou a produção de alimentos para alimentar bilhões de pessoas', isCorrect: true },
          { id: 'b', text: 'Fez com que os seres humanos parassem de comer pães e cereais', isCorrect: false },
          { id: 'c', text: 'Destruiu a agricultura e fez a comida nascer direto nos supermercados', isCorrect: false },
          { id: 'd', text: 'Obrigou os agricultores a empurrarem os tratores com as próprias mãos', isCorrect: false }
        ],
        didacticExplanation: 'O trabalho humano evoluiu: o agricultor deixou de ser um feixe de força braçal para se tornar um gestor técnico de máquinas inteligentes e sustentabilidade.'
      },
      {
        id: 3,
        module: 0,
        phase: 2,
        era: 'Era Manual',
        badge: 'Construção',
        title: 'Corte e Transporte de Pedras sem Guindastes',
        historicalContext: 'Para erguer catedrais góticas e pirâmides, blocos de pedra de 5 toneladas eram erguidos por roldanas de madeira giradas por dezenas de homens suando em esteiras de tração humana.',
        comparison: {
          pastLabel: 'Força Muscular Bruta',
          pastValue: 'Centenas de operários puxando cordas de cânhamo',
          pastIcon: '🧱',
          modernLabel: 'Guindaste Eletro-hidráulico',
          modernValue: '1 operador sentado controlando joystick com sensores de carga',
          modernIcon: '🏗️'
        },
        question: 'O que as ferramentas mecânicas e automáticas proporcionaram aos trabalhadores da construção civil?',
        options: [
          { id: 'a', text: 'Redução dramática de acidentes fatais, hérnias e lesões físicas incapacitantes nos operários', isCorrect: true },
          { id: 'b', text: 'Obrigaram os prédios a serem feitos apenas de plástico inflável', isCorrect: false },
          { id: 'c', text: 'Fizeram as construções demorarem 10 vezes mais tempo para ficarem prontas', isCorrect: false },
          { id: 'd', text: 'Impediram que seres humanos entrassem nos canteiros de obras', isCorrect: false }
        ],
        didacticExplanation: 'As máquinas vieram para assumir o esforço lesivo e o perigo iminente. A tecnologia existe para preservar a integridade física da vida humana.'
      },
      {
        id: 4,
        module: 0,
        phase: 3,
        era: 'Era Manual',
        badge: 'Transporte',
        title: 'O Correio a Cavalo (Pony Express)',
        historicalContext: 'Em 1860, para levar uma carta da Califórnia até o Missouri nos EUA, jovens cavaleiros trocavam de cavalo galopando a cada 15 km, enfrentando nevascas e tempestades por 10 dias seguidos.',
        comparison: {
          pastLabel: 'Pony Express (1860)',
          pastValue: '10 dias para enviar uma folha de papel a cavalo',
          pastIcon: '🐎',
          modernLabel: 'Fibra Óptica e Satélites',
          modernValue: 'Menos de 1 segundo para enviar dados ao redor do planeta',
          modernIcon: '🌐'
        },
        question: 'Qual foi a invenção tecnológica que encerrou as atividades do correio a cavalo em apenas dois dias?',
        options: [
          { id: 'a', text: 'O Telégrafo elétrico, que transmitia mensagens por pulsos elétricos instantâneos através de fios', isCorrect: true },
          { id: 'b', text: 'Cavalos mais velozes trazidos de outros continentes', isCorrect: false },
          { id: 'c', text: 'Pombos-correio treinados para carregar malas pesadas', isCorrect: false },
          { id: 'd', text: 'A proibição do envio de cartas pelo governo', isCorrect: false }
        ],
        didacticExplanation: 'Quando a primeira linha de telégrafo transcontinental foi completada em outubro de 1861, o Pony Express encerrou suas operações imediatamente: o elétron viajou na velocidade da luz!'
      },
      {
        id: 5,
        module: 0,
        phase: 4,
        era: 'Era Manual',
        badge: 'Alimentação',
        title: 'A Fabricação do Pão em Fornos de Barro a Lenha',
        historicalContext: 'Padeiros antigos acordavam às 2 da manhã para sovar à mão dezenas de quilos de massa pesada e controlar a temperatura de fornos a lenha sentindo o calor com o dorso da mão.',
        comparison: {
          pastLabel: 'Sova e Forno a Lenha',
          pastValue: 'Horas de esforço físico nos braços e fumaça constante',
          pastIcon: '🥖',
          modernLabel: 'Panificação Industrial',
          modernValue: 'Batedeiras espirais automatizadas e fornos com controle PID',
          modernIcon: '🍞'
        },
        question: 'O que a automação trouxe para a alimentação humana em larga escala?',
        options: [
          { id: 'a', text: 'Padronização de higiene estrita, controle microbiológico e produção contínua para abastecer as cidades', isCorrect: true },
          { id: 'b', text: 'Fez com que os pães ficassem frios para sempre', isCorrect: false },
          { id: 'c', text: 'Eliminou o fermento e a farinha da receita', isCorrect: false },
          { id: 'd', text: 'Substituiu o alimento real por fotos de comida na tela do celular', isCorrect: false }
        ],
        didacticExplanation: 'A automação dos alimentos permitiu que normas sanitárias fossem aplicadas com rigor, garantindo que milhões de famílias tenham acesso a pão fresco e seguro diariamente.'
      },
      {
        id: 6,
        module: 0,
        phase: 5,
        era: 'Era Manual',
        badge: 'Indústria Têxtil',
        title: 'O Tear Manual de Madeira na Idade Média',
        historicalContext: 'Para tecer um lençol ou cobertor, uma tecelã passava a lançadeira de madeira de um lado para o outro centenas de milhares de vezes com os pés nos pedais durante semanas.',
        comparison: {
          pastLabel: 'Tear Manual',
          pastValue: 'Semanas de trabalho para alguns metros de tecido',
          pastIcon: '🧶',
          modernLabel: 'Tear a Jato de Ar Digital',
          modernValue: 'Milhares de metros por hora guiados por computador',
          modernIcon: '🧵'
        },
        question: 'Por que antes da Revolução Industrial as pessoas comuns tinham apenas uma ou duas trocas de roupa para a vida toda?',
        options: [
          { id: 'a', text: 'Porque o tecido manual era extremamente caro e demandava meses de esforço para ser fabricado', isCorrect: true },
          { id: 'b', text: 'Porque a moda antiga proibia trocar de camisa mais de uma vez ao ano', isCorrect: false },
          { id: 'c', text: 'Porque não existiam tintas coloridas na natureza', isCorrect: false },
          { id: 'd', text: 'Porque as pessoas preferiam andar embrulhadas em folhas de árvores', isCorrect: false }
        ],
        didacticExplanation: 'Roupas eram bens herdados de geração em geração. A automação dos teares democratizou o vestuário e permitiu que roupas e calçados se tornassem acessíveis a toda a população.'
      },
      {
        id: 7,
        module: 0,
        phase: 6,
        era: 'Era Manual',
        badge: 'Metais',
        title: 'O Ferreiro e a Forja a Carvão',
        historicalContext: 'Ferreiros moldavam pregos, ferraduras e ferramentas batendo repetidamente um martelo de ferro de 4 kg contra uma bigorna incandescente sob calor sufocante.',
        comparison: {
          pastLabel: 'Forja Manual a Martelo',
          pastValue: 'Prego por prego forjado individualmente no fogo',
          pastIcon: '🔨',
          modernLabel: 'Laminação e Estampagem Automatizada',
          modernValue: 'Milhares de parafusos e peças usinadas por minuto com precisão CNC',
          modernIcon: '⚙️'
        },
        question: 'Qual é a principal diferença de precisão entre a produção artesanal manual e a usinagem CNC moderna?',
        options: [
          { id: 'a', text: 'As máquinas CNC cortam com precisão de milésimos de milímetro (mícrons), permitindo que peças se encaixem perfeitamente', isCorrect: true },
          { id: 'b', text: 'As peças manuais do ferreiro eram exatamente idênticas até nos átomos', isCorrect: false },
          { id: 'c', text: 'O ferreiro conseguia enxergar os átomos a olho nu enquanto martelava', isCorrect: false },
          { id: 'd', text: 'A usinagem moderna só consegue cortar pedaços tortos de metal', isCorrect: false }
        ],
        didacticExplanation: 'Antes das máquinas de precisão, duas peças nunca eram iguais; cada parafuso só cabia na sua própria porca feita à mão! A padronização tecnológica permitiu a existência de motores e aviões.'
      },
      {
        id: 8,
        module: 0,
        phase: 7,
        era: 'Era Manual',
        badge: 'Navegação',
        title: 'As Galés Movidas a Remos de Prisioneiros',
        historicalContext: 'Na antiguidade e no Renascimento, navios militares chamados galés cruzavam o Mar Mediterrâneo impulsionados pela força física de centenas de homens remando no porão escuro.',
        comparison: {
          pastLabel: 'Propulsão Humana a Remos',
          pastValue: 'Centenas de pessoas esgotadas pelo cansaço físico extremo',
          pastIcon: '🚣',
          modernLabel: 'Navio Porta-Contêineres',
          modernValue: 'Motores a turbina e propulsão limpa operados por uma tripulação de 20 pessoas',
          modernIcon: '🚢'
        },
        question: 'O que a máquina a vapor e os motores a combustão significaram para a história da dignidade humana no trabalho?',
        options: [
          { id: 'a', text: 'Ajudaram a abolir o uso de seres humanos como simples "motores biológicos" descartáveis', isCorrect: true },
          { id: 'b', text: 'Fizeram com que as viagens de navio passassem a durar 50 anos', isCorrect: false },
          { id: 'c', text: 'Obrigaram os navios a andarem apenas em rios secos', isCorrect: false },
          { id: 'd', text: 'Aumentaram o número de pessoas que precisavam remar barcos gigantes', isCorrect: false }
        ],
        didacticExplanation: 'A substituição da força muscular de remadores por energia térmica e mecânica foi um dos maiores passos para a libertação humana do trabalho forçado.'
      },
      {
        id: 9,
        module: 0,
        phase: 8,
        era: 'Era Manual',
        badge: 'Conservação',
        title: 'A Colheita de Gelo em Lagos Congelados',
        historicalContext: 'No século XIX, antes da invenção da geladeira, homens serravam blocos de gelo gigantes em lagos gelados no inverno e transportavam em carroças forradas de serragem até as cidades.',
        comparison: {
          pastLabel: 'Corte Manual de Gelo',
          pastValue: 'Serras manuais no gelo com risco de afogamento em água congelante',
          pastIcon: '🧊',
          modernLabel: 'Refrigeração por Compressor',
          modernValue: 'Geladeiras em todos os lares conservando remédios e alimentos com energia elétrica',
          modernIcon: '❄️'
        },
        question: 'Como a invenção da refrigeração mecânica e digital impactou a saúde das populações?',
        options: [
          { id: 'a', text: 'Evitou intoxicações alimentares em massa e possibilitou o transporte global de vacinas e remédios que exigem cadeia de frio', isCorrect: true },
          { id: 'b', text: 'Fez com que a água do mundo inteiro evaporasse instantaneamente', isCorrect: false },
          { id: 'c', text: 'Obrigou as pessoas a comerem apenas comida estragada', isCorrect: false },
          { id: 'd', text: 'Impediu que os cientistas criassem microscópios', isCorrect: false }
        ],
        didacticExplanation: 'A conservação térmica por compressores e sensores automáticos salvou centenas de milhões de vidas contra bactérias em alimentos e viabilizou a distribuição de vacinas pelo mundo.'
      },
      {
        id: 10,
        module: 0,
        phase: 9,
        era: 'Era Manual',
        badge: 'Síntese da Era Manual',
        title: 'O Conceito Fundamental: O Que é o Trabalho?',
        historicalContext: 'O ser humano é a única espécie do planeta que constrói ferramentas para transformar o ambiente natural, buscando abrigo, saúde, alimentação e bem-estar coletivo.',
        comparison: {
          pastLabel: 'Ferramentas Primitivas',
          pastValue: 'Pau, pedra lascada, fogo e força muscular',
          pastIcon: '🪵',
          modernLabel: 'Ferramentas Digitais',
          modernValue: 'Supercomputadores, satélites, robôs e inteligência artificial',
          modernIcon: '💡'
        },
        question: 'De acordo com a história do trabalho, qual é o papel essencial das ferramentas criadas pela humanidade?',
        options: [
          { id: 'a', text: 'Ampliar a capacidade humana, poupar esforço braçal perigoso e resolver problemas complexos da sociedade', isCorrect: true },
          { id: 'b', text: 'Destruir a criatividade e fazer os seres humanos pararem de pensar', isCorrect: false },
          { id: 'c', text: 'Garantir que o trabalho seja o mais pesado e cansativo possível', isCorrect: false },
          { id: 'd', text: 'Isolar as pessoas para que ninguém mais converse na vida real', isCorrect: false }
        ],
        didacticExplanation: 'Desde a primeira pedra lascada até o algoritmo de IA, toda ferramenta criada pela engenharia humana tem o mesmo propósito: transformar a natureza para melhorar a vida das pessoas!'
      }
    ],

    // MÓDULO 2: O Túnel do Tempo das Profissões que Desapareceram ou Mudaram
    [
      {
        id: 11,
        module: 1,
        phase: 0,
        era: 'Profissões do Passado',
        badge: 'Iluminação',
        title: 'O Acendedor de Lampiões',
        historicalContext: 'Até o início do século XX, homens caminhavam pelas ruas ao entardecer com uma vara comprida acendendo postes de gás um a um, e voltavam de madrugada para apagá-los.',
        comparison: {
          pastLabel: 'Profissão Extinta',
          pastValue: 'Acendedor de Lampiões (Trabalho noturno manual poste por poste)',
          pastIcon: '🏮',
          modernLabel: 'Automação Moderna',
          modernValue: 'Sensor LDR (fotocélula) que acende as luzes de LED sozinho ao anoitecer',
          modernIcon: '💡'
        },
        question: 'Qual sensor tecnológico substituiu a necessidade de uma pessoa acender os postes da cidade manualmente?',
        options: [
          { id: 'a', text: 'O sensor de luminosidade (LDR / Fotocélula), que mede a luz natural do sol e ativa a eletricidade automaticamente', isCorrect: true },
          { id: 'b', text: 'Um sensor de temperatura que só liga quando neva na cidade', isCorrect: false },
          { id: 'c', text: 'Um microfone que ouve quando as pessoas pedem para a luz acender', isCorrect: false },
          { id: 'd', text: 'Um sensor de peso que sente os carros passando embaixo do poste', isCorrect: false }
        ],
        didacticExplanation: 'Os postes modernos têm pequenas fotocélulas no topo. Quando o sol se põe, a resistência elétrica varia e o circuito liga os LEDs instantaneamente em toda a cidade.'
      },
      {
        id: 12,
        module: 1,
        phase: 1,
        era: 'Profissões do Passado',
        badge: 'Telecomunicações',
        title: 'A Telefonista de Mesa de Cabos',
        historicalContext: 'Quando alguém queria ligar para outra pessoa, precisava falar com a telefonista na central. Ela pegava um cabo com plugue de cobre e encaixava manualmente no buraco correspondente à casa do destinatário.',
        comparison: {
          pastLabel: 'Profissão Extinta',
          pastValue: 'Telefonista conectando cabos físicos à mão na central',
          pastIcon: '☎️',
          modernLabel: 'Automação Moderna',
          modernValue: 'Roteadores e comutação digital automática por pacotes de dados',
          modernIcon: '📶'
        },
        question: 'Se as ligações ainda fossem conectadas à mão como em 1920, o que aconteceria hoje com bilhões de celulares?',
        options: [
          { id: 'a', text: 'Seria impossível conectar tantas chamadas; a população inteira do planeta teria que trabalhar conectando cabos!', isCorrect: true },
          { id: 'b', text: 'As conversas ficariam mais rápidas porque as pessoas corriam para plugar os fios', isCorrect: false },
          { id: 'c', text: 'A internet funcionaria sem fios usando apenas a mente das telefonistas', isCorrect: false },
          { id: 'd', text: 'Nenhum telefone celular tocaria durante a noite', isCorrect: false }
        ],
        didacticExplanation: 'Com bilhões de conexões por segundo no mundo, a comutação automática digital é o único meio viável de telecomunicação existente.'
      },
      {
        id: 13,
        module: 1,
        phase: 2,
        era: 'Profissões do Passado',
        badge: 'Cálculo e Espaço',
        title: 'O Computador Humano da NASA',
        historicalContext: 'Nas décadas de 1940 a 1960, a palavra "computador" era o título de um cargo de pessoas (principalmente mulheres matemáticas, como Katherine Johnson) que calculavam órbitas de foguetes a lápis.',
        comparison: {
          pastLabel: 'Profissão Antiga',
          pastValue: 'Salas inteiras de pessoas calculando equações diferenciais à mão por semanas',
          pastIcon: '🧮',
          modernLabel: 'Computação Eletrônica',
          modernValue: 'Microprocessadores executando bilhões de operações matemáticas por segundo',
          modernIcon: '💻'
        },
        question: 'Por que a criação dos computadores eletrônicos foi crucial para a exploração espacial moderna?',
        options: [
          { id: 'a', text: 'Porque foguetes modernos exigem cálculos de trajetória e manobra de propulsão recalculados em milissegundos', isCorrect: true },
          { id: 'b', text: 'Porque os astronautas não queriam levar lápis e borracha para o espaço', isCorrect: false },
          { id: 'c', text: 'Porque computadores eletrônicos pesam 50 toneladas e servem de âncora', isCorrect: false },
          { id: 'd', text: 'Porque as calculadoras humanas se recusaram a olhar para a Lua', isCorrect: false }
        ],
        didacticExplanation: 'A astronave Apollo 11 só conseguiu pousar na Lua porque o AGC (Apollo Guidance Computer) corrigia a queima dos motores 100 vezes por segundo, velocidade inalcançável no papel.'
      },
      {
        id: 14,
        module: 1,
        phase: 3,
        era: 'Profissões do Passado',
        badge: 'Rotina Matinal',
        title: 'O Despertador Humano ("Knocker-Up")',
        historicalContext: 'Na Inglaterra industrial, antes do relógio despertador ser barato, operários contratavam pessoas chamadas "Knocker-uppers" que batiam nas janelas com varas compridas de bambu ou atiravam ervilhas secas para acordá-los.',
        comparison: {
          pastLabel: 'Profissão Extinta',
          pastValue: 'Pessoa andando pelas ruas frias batendo nas janelas dos clientes',
          pastIcon: '🦯',
          modernLabel: 'Automação Moderna',
          modernValue: 'Alarmes com chip de quartzo, smartphones e assistentes virtuais',
          modernIcon: '⏰'
        },
        question: 'O que substituiu o despertador humano e tornou a rotina das pessoas autônoma?',
        options: [
          { id: 'a', text: 'Relógios mecânicos acessíveis e, mais tarde, o oscilador eletrônico de quartzo nos celulares', isCorrect: true },
          { id: 'b', text: 'Galo cantando gravado em fitas de áudio cassete', isCorrect: false },
          { id: 'c', text: 'Cachorros treinados para latir em horários específicos', isCorrect: false },
          { id: 'd', text: 'Canhões atirando pólvora no centro da cidade a cada 1 hora', isCorrect: false }
        ],
        didacticExplanation: 'A microeletrônica miniaturizou relógios de precisão atômica para dentro de qualquer chip, permitindo que cada cidadão programe seus alarmes com um toque.'
      },
      {
        id: 15,
        module: 1,
        phase: 4,
        era: 'Profissões do Passado',
        badge: 'Lazer e Esportes',
        title: 'O Menino Arrumador de Pinos de Boliche ("Pinsetter")',
        historicalContext: 'Nas pistas de boliche antigas, crianças e adolescentes trabalhavam no fundo da pista recolhendo bolas de 7 kg e reposicionando os 10 pinos de madeira pesados manualmente após cada jogada.',
        comparison: {
          pastLabel: 'Trabalho Infantil Perigoso',
          pastValue: 'Jovens arriscando levar boladas pesadas na canela para recolocar pinos',
          pastIcon: '🎳',
          modernLabel: 'Mecânica Automatizada',
          modernValue: 'Elevador mecânico com garras que varre a pista e arma os pinos em 3 segundos',
          modernIcon: '⚙️'
        },
        question: 'Por que a automação das pistas de boliche foi considerada um avanço social importante?',
        options: [
          { id: 'a', text: 'Eliminou uma atividade de risco físico que frequentemente explorava mão de obra infantil', isCorrect: true },
          { id: 'b', text: 'Fez com que as bolas de boliche ficassem quadradas', isCorrect: false },
          { id: 'c', text: 'Impediu que as pessoas continuassem praticando o esporte', isCorrect: false },
          { id: 'd', text: 'Obrigou os jogadores a jogarem sem sapatos especiais', isCorrect: false }
        ],
        didacticExplanation: 'Muitas profissões extintas eram degradantes ou perigosas para crianças e adolescentes. A automação mecânica assumiu o trabalho repetitivo, protegendo a infância.'
      },
      {
        id: 16,
        module: 1,
        phase: 5,
        era: 'Profissões do Passado',
        badge: 'Gráfica & Imprensa',
        title: 'O Operador de Linotipo e o Tipógrafo de Chumbo',
        historicalContext: 'Para imprimir o jornal de amanhã, tipógrafos montavam cada frase letra por letra, fundindo chumbo derretido tóxico a 300°C na máquina linotipo em salas barulhentas.',
        comparison: {
          pastLabel: 'Tipografia de Chumbo Quente',
          pastValue: 'Inalação diária de fumaça de chumbo e horas para diagramar 1 página',
          pastIcon: '📰',
          modernLabel: 'Editoração Eletrônica Digital',
          modernValue: 'Softwares de design, PDF e impressoras a laser ecológicas',
          modernIcon: '🖥️'
        },
        question: 'Como a era digital transformou a vida dos profissionais que trabalham com jornais e livros?',
        options: [
          { id: 'a', text: 'Eliminou a intoxicação por chumbo pesado e permitiu que designers e jornalistas publiquem conteúdos com liberdade criativa', isCorrect: true },
          { id: 'b', text: 'Acabou com todas as notícias do mundo', isCorrect: false },
          { id: 'c', text: 'Proibiu o uso de letras e palavras na internet', isCorrect: false },
          { id: 'd', text: 'Fez as pessoas escreverem com cinzas de carvão', isCorrect: false }
        ],
        didacticExplanation: 'A editoração digital substituiu o perigoso manuseio de ligas tóxicas de chumbo fundido por softwares visuais, tornando o trabalho gráfico seguro, limpo e infinitamente mais rápido.'
      },
      {
        id: 17,
        module: 1,
        phase: 6,
        era: 'Profissões do Passado',
        badge: 'Fábrica e Cultura',
        title: 'O Leitor de Fábrica de Charutos ("El Lector")',
        historicalContext: 'Em fábricas antigas de charutos em Cuba e no Brasil, trabalhadores contratavam um orador que subia em um tablado alto e lia jornais, romances e livros clássicos para aliviar o tédio do trabalho repetitivo manual.',
        comparison: {
          pastLabel: 'Profissão Antiga',
          pastValue: 'Uma pessoa lendo em voz alta por 8 horas seguidas na fábrica',
          pastIcon: '📖',
          modernLabel: 'Mídia Digital',
          modernValue: 'Podcasts, audiolivros, rádio web e streaming no smartphone',
          modernIcon: '🎧'
        },
        question: 'Qual inovação tecnológica descentralizou o acesso a notícias e histórias para qualquer trabalhador?',
        options: [
          { id: 'a', text: 'A difusão do rádio, dos reprodutores portáteis de áudio e, atualmente, dos podcasts e fones de ouvido', isCorrect: true },
          { id: 'b', text: 'A invenção de óculos que leem a mente das pessoas', isCorrect: false },
          { id: 'c', text: 'A proibição de conversar durante o almoço', isCorrect: false },
          { id: 'd', text: 'O fim dos livros e das histórias narradas', isCorrect: false }
        ],
        didacticExplanation: 'A transmissão de áudio digital permitiu que o conhecimento e o entretenimento se tornassem individuais e portáteis para qualquer pessoa a qualquer hora.'
      },
      {
        id: 18,
        module: 1,
        phase: 7,
        era: 'Profissões do Passado',
        badge: 'Trânsito Urbano',
        title: 'O Guarda Sinaleiro de Trânsito com Placa Manual',
        historicalContext: 'Nos cruzamentos das grandes cidades em 1910, policiais ficavam em pedestais girando manivelas com placas "PARE" e "SIGA" para evitar que carruagens e os primeiros carros batessem.',
        comparison: {
          pastLabel: 'Controle Manual com Risco',
          pastValue: 'Policial no meio do cruzamento engolindo fumaça tóxica de escapamentos',
          pastIcon: '👮',
          modernLabel: 'Semáforo Inteligente',
          modernValue: 'Controlador eletrônico sincronizado por sensores de laço indutivo e IA',
          modernIcon: '🚦'
        },
        question: 'Qual vantagem o semáforo automatizado inteligente traz para o trânsito moderno?',
        options: [
          { id: 'a', text: 'Ajusta os tempos de verde e vermelho em tempo real medindo a quantidade de carros pelos sensores no asfalto', isCorrect: true },
          { id: 'b', text: 'Faz com que todos os carros batam ao mesmo tempo no cruzamento', isCorrect: false },
          { id: 'c', text: 'Desliga todas as luzes quando o trânsito está muito engarrafado', isCorrect: false },
          { id: 'd', text: 'Manda todos os motoristas descerem e empurrarem os veículos', isCorrect: false }
        ],
        didacticExplanation: 'Os semáforos modernos utilizam "laços indutivos" (fios sob o asfalto que detectam metal) e câmeras de IA para calcular a "Onda Verde", reduzindo engarrafamentos automaticamente.'
      },
      {
        id: 19,
        module: 1,
        phase: 8,
        era: 'Profissões do Passado',
        badge: 'Operação Predial',
        title: 'O Ascensorista de Alavanca Mecânica',
        historicalContext: 'Antigamente, elevadores eram operados por uma pessoa que puxava alavancas de cobre pesadas para alinhar o piso da cabine exatamente com a soleira do andar.',
        comparison: {
          pastLabel: 'Ascensorista de Alavanca',
          pastValue: 'Nivelamento manual com risco de degrau perigoso para os passageiros',
          pastIcon: '🚪',
          modernLabel: 'Elevador Microprocessado',
          modernValue: 'Sensor de efeito Hall e inversor de frequência com parada milimétrica suave',
          modernIcon: '🛗'
        },
        question: 'O que tornou os elevadores seguros para que qualquer pessoa aperte um botão sem risco?',
        options: [
          { id: 'a', text: 'Sensores de nivelamento magnético, travas eletromecânicas de porta e circuitos lógicos de segurança redundantes', isCorrect: true },
          { id: 'b', text: 'Tirar o chão do elevador para as pessoas pularem no andar certo', isCorrect: false },
          { id: 'c', text: 'Fazer o elevador andar apenas quando estiver vazio', isCorrect: false },
          { id: 'd', text: 'Amarrar cordas de elástico na cabine', isCorrect: false }
        ],
        didacticExplanation: 'Os elevadores modernos são robôs verticais! Eles possuem sensores magnéticos que medem a posição com precisão milimétrica e nunca abrem a porta se a cabine não estiver perfeitamente alinhada.'
      },
      {
        id: 20,
        module: 1,
        phase: 9,
        era: 'Profissões do Passado',
        badge: 'Lição Fundamental',
        title: 'Por Que as Máquinas Assumem Certos Trabalhos?',
        historicalContext: 'Ao analisar as profissões que sumiram, percebemos um padrão claro: a tecnologia substitui tarefas que são Perigosas, Repetitivas ou Fisicamente Esgotantes (conhecidas na robótica como os "3 D\'s": Dirty, Dull, Dangerous).',
        comparison: {
          pastLabel: 'Trabalho Mecânico e Físico',
          pastValue: 'A pessoa era forçada a agir como uma engrenagem sem usar sua mente criativa',
          pastIcon: '⚙️',
          modernLabel: 'Trabalho Intelectual e Humano',
          modernValue: 'O ser humano supervisiona, programa, inova e cuida das relações sociais',
          modernIcon: '🌱'
        },
        question: 'Qual é a conclusão verdadeira sobre o impacto da tecnologia nas profissões?',
        options: [
          { id: 'a', text: 'A tecnologia não acaba com o trabalho humano; ela liberta as pessoas do esforço perigoso e repetitivo e cria novas profissões mais criativas', isCorrect: true },
          { id: 'b', text: 'As máquinas vieram para destruir todas as profissões e fazer as pessoas sumirem', isCorrect: false },
          { id: 'c', text: 'O ser humano nunca mais precisará estudar nada na vida', isCorrect: false },
          { id: 'd', text: 'O trabalho manual do passado era perfeito e ninguém nunca se machucava', isCorrect: false }
        ],
        didacticExplanation: 'Excelente! Essa é a grande lição: as máquinas assumem a repetição mecânica para que os seres humanos possam se dedicar ao que nos torna únicos: criatividade, empatia, arte e resolução de problemas.'
      }
    ],

    // MÓDULO 3: A Linha do Tempo das Ferramentas (Do Braço ao Algoritmo)
    [
      {
        id: 21,
        module: 2,
        phase: 0,
        era: 'Linha do Tempo',
        badge: 'Escrita',
        title: 'Evolução da Escrita e Registro',
        historicalContext: 'Veja como a ferramenta humana para guardar ideias evoluiu ao longo de milhares de anos:',
        timelineSteps: [
          { step: '1. Tabuleta de Argila', period: '3000 a.C.', tech: 'Cunha de madeira prensando barro úmido' },
          { step: '2. Papiro e Pena', period: 'Século VIII', tech: 'Tinta vegetal e folhas de papiro/pergaminho' },
          { step: '3. Máquina de Escrever', period: '1870', tech: 'Mecanismo de tipos de ferro e fita entintada' },
          { step: '4. Editor de Texto em Nuvem', period: 'Hoje', tech: 'Processamento digital com salvamento instantâneo e IA' }
        ],
        question: 'Qual é o salto evolutivo trazido pelo editor de texto digital em relação à máquina de escrever mecânica?',
        options: [
          { id: 'a', text: 'Possibilidade de apagar, reorganizar, corrigir ortografia e compartilhar com qualquer pessoa do mundo sem gastar papel', isCorrect: true },
          { id: 'b', text: 'O texto digital fica mais pesado que o papel e precisa de guindaste para carregar', isCorrect: false },
          { id: 'c', text: 'A máquina de escrever era mais rápida porque tinha fita de tecido colorido', isCorrect: false },
          { id: 'd', text: 'No computador as letras se apagam sozinhas a cada 5 minutos', isCorrect: false }
        ],
        didacticExplanation: 'Com o editor digital, a escrita deixou de ser um ato mecânico fixo no papel para se tornar um processo fluido de edição e colaboração em tempo real.'
      },
      {
        id: 22,
        module: 2,
        phase: 1,
        era: 'Linha do Tempo',
        badge: 'Cálculo',
        title: 'Evolução da Matemática Aplicada',
        historicalContext: 'A contagem começou com marcas em ossos e pedras, evoluindo até os supercomputadores modernos:',
        timelineSteps: [
          { step: '1. Ábaco de Contas', period: 'Antiguidade', tech: 'Pedras e varetas de madeira para somar' },
          { step: '2. Régua de Cálculo', period: '1620', tech: 'Escalas logarítmicas de precisão' },
          { step: '3. Calculadora Mecânica', period: '1940', tech: 'Engrenagens acionadas por manivela (Curta)' },
          { step: '4. Processador Eletrônico', period: 'Hoje', tech: 'Transistores microscópicos calculando em nano-segundos' }
        ],
        question: 'O que viabilizou a transição das engrenagens mecânicas pesadas para os celulares finos de hoje?',
        options: [
          { id: 'a', text: 'A invenção do transistor de silício, que substituiu engrenagens físicas por chaves elétricas microscópicas', isCorrect: true },
          { id: 'b', text: 'Engrenagens feitas de madeira transparente', isCorrect: false },
          { id: 'c', text: 'A diminuição do tamanho dos números matemáticos', isCorrect: false },
          { id: 'd', text: 'O uso de baterias de sabão em pó', isCorrect: false }
        ],
        didacticExplanation: 'O transistor é a maior invenção do século XX! Em vez de engrenagens de ferro girando para somar 1+1, o transistor usa elétrons abrindo e fechando circuitos na velocidade da luz.'
      },
      {
        id: 23,
        module: 2,
        phase: 2,
        era: 'Linha do Tempo',
        badge: 'Energia',
        title: 'Evolução da Iluminação Noturna',
        historicalContext: 'A noite sempre foi um desafio para o trabalho humano. Veja como dominamos a luz:',
        timelineSteps: [
          { step: '1. Fogueira e Tocha', period: 'Pré-história', tech: 'Madeira e gordura animal fumegante' },
          { step: '2. Vela de Cera', period: 'Idade Média', tech: 'Pavio de algodão com chama fraca e instável' },
          { step: '3. Lâmpada Incandescente', period: '1879', tech: 'Filamento de tungstênio aquecido por eletricidade (Edison)' },
          { step: '4. LED Inteligente IoT', period: 'Hoje', tech: 'Semicondutor de estado sólido dimerizável por smartphone' }
        ],
        question: 'Por que a lâmpada de LED é 90% mais eficiente que a lâmpada incandescente antiga?',
        options: [
          { id: 'a', text: 'Porque o LED transforma energia quase que exclusivamente em luz, enquanto a incandescente desperdiçava 90% da energia em calor', isCorrect: true },
          { id: 'b', text: 'Porque a lâmpada de LED usa vaga-lumes vivos presos no vidro', isCorrect: false },
          { id: 'c', text: 'Porque a lâmpada incandescente precisava de querosene para funcionar', isCorrect: false },
          { id: 'd', text: 'Porque o LED só acende quando está frio', isCorrect: false }
        ],
        didacticExplanation: 'As lâmpadas antigas funcionavam esquentando um arame até ficar vermelho de calor. O LED é física quântica pura: elétrons saltando de camada e emitindo fótons sem esquentar!'
      },
      {
        id: 24,
        module: 2,
        phase: 3,
        era: 'Linha do Tempo',
        badge: 'Locomoção',
        title: 'Evolução do Transporte Terrestre',
        historicalContext: 'Das primeiras rodas de pedra até os veículos autônomos elétricos:',
        timelineSteps: [
          { step: '1. Carro de Tração Animal', period: '3500 a.C.', tech: 'Cavalos e bois puxando rodas de madeira' },
          { step: '2. Locomotiva a Vapor', period: '1804', tech: 'Caldeira a carvão gerando pressão mecânica' },
          { step: '3. Automóvel a Combustão', period: '1908', tech: 'Motor a gasolina produzido em linha de montagem (Ford T)' },
          { step: '4. Veículo Elétrico Autônomo', period: 'Hoje', tech: 'Baterias de lítio, motores de imã permanente, câmeras e IA' }
        ],
        question: 'Qual é o grande salto ecológico e tecnológico dos veículos elétricos modernos?',
        options: [
          { id: 'a', text: 'Zero emissão local de gases poluentes e frenagem regenerativa que devolve energia para a bateria', isCorrect: true },
          { id: 'b', text: 'Eles não precisam de pneus nem de asfalto para andar', isCorrect: false },
          { id: 'c', text: 'Eles andam mais devagar que uma tartaruga para economizar', isCorrect: false },
          { id: 'd', text: 'Funcionam apenas quando estão conectados a um fio preso na tomada da casa', isCorrect: false }
        ],
        didacticExplanation: 'Veículos elétricos têm rendimento energético de mais de 90% (contra 25% dos motores a explosão) e são computadores sobre rodas capazes de desviar de obstáculos por sensores.'
      },
      {
        id: 25,
        module: 2,
        phase: 4,
        era: 'Linha do Tempo',
        badge: 'Memória',
        title: 'Evolução do Armazenamento de Dados',
        historicalContext: 'Onde a humanidade guarda suas memórias, livros, fotos e descobertas científicas:',
        timelineSteps: [
          { step: '1. Papiro e Papel', period: 'Antiguidade', tech: 'Fibras vegetais vulneráveis a mofo e fogo' },
          { step: '2. Cartão Perfurado', period: '1890', tech: 'Furos em cartolina lidos por agulhas elétricas' },
          { step: '3. Disquete Magnético', period: '1980', tech: 'Disco plástico flexível que guardava 1,44 Megabytes' },
          { step: '4. Nuvem / SSD NVMe', period: 'Hoje', tech: 'Memória Flash microscópica guardando Terabytes em um chaveiro' }
        ],
        question: 'Quantos disquetes antigos de 1,44 MB seriam necessários para guardar 1 único jogo moderno de 70 GB?',
        options: [
          { id: 'a', text: 'Quase 50.000 disquetes! Uma pilha de mais de 150 metros de altura!', isCorrect: true },
          { id: 'b', text: 'Apenas 2 disquetes cabem o jogo inteiro com folga', isCorrect: false },
          { id: 'c', text: 'Nenhum, porque os computadores antigos tinham mais espaço que os de hoje', isCorrect: false },
          { id: 'd', text: 'Meio disquete seria suficiente', isCorrect: false }
        ],
        didacticExplanation: 'A miniaturização do armazenamento digital é astronômica: um chip menor que uma unha guarda hoje o equivalente a milhões de livros de uma biblioteca inteira!'
      },
      {
        id: 26,
        module: 2,
        phase: 5,
        era: 'Linha do Tempo',
        badge: 'Saúde',
        title: 'Evolução da Medicina e Diagnóstico',
        historicalContext: 'Como os médicos investigavam o corpo humano através das eras:',
        timelineSteps: [
          { step: '1. Sangria e Palpação', period: 'Século XVII', tech: 'Tentativas empíricas sem enxergar o interior do corpo' },
          { step: '2. Estetoscópio de Madeira', period: '1816', tech: 'Tubo acústico para ouvir batimentos cardíacos' },
          { step: '3. Raio-X Analógico', period: '1895', tech: 'Radiação ionizante revelada em filme químico' },
          { step: '4. Ressonância Magnética + IA', period: 'Hoje', tech: 'Campos magnéticos tridimensionais com detecção de tumores por IA' }
        ],
        question: 'Como a Inteligência Artificial auxilia os médicos nos exames de imagem modernos?',
        options: [
          { id: 'a', text: 'Identificando padrões e lesões minúsculas em segundos que poderiam passar despercebidas ao olho cansado', isCorrect: true },
          { id: 'b', text: 'Substituindo o médico e mandando o paciente operar a si mesmo', isCorrect: false },
          { id: 'c', text: 'Apagando as fotos do exame para economizar espaço no hospital', isCorrect: false },
          { id: 'd', text: 'Pintando os ossos de cores fluorescentes', isCorrect: false }
        ],
        didacticExplanation: 'A IA atua como uma "segunda opinião ultra-atenta": ela compara o exame do paciente com milhões de exames do mundo todo, auxiliando o médico a fechar um diagnóstico precoce.'
      },
      {
        id: 27,
        module: 2,
        phase: 6,
        era: 'Linha do Tempo',
        badge: 'Construção',
        title: 'Evolução do Desenho Técnico de Projetos',
        historicalContext: 'Engenheiros e arquitetos projetando pontes e edifícios:',
        timelineSteps: [
          { step: '1. Prancheta e Esquadro', period: '1960', tech: 'Desenhos manuais a nanquim sobre papel manteiga' },
          { step: '2. CAD 2D', period: '1985', tech: 'Linhas vetoriais desenhadas na tela do computador' },
          { step: '3. Modelagem 3D (BIM)', period: '2010', tech: 'Edifícios virtuais com física de peso e materiais' },
          { step: '4. Gêmeos Digitais (Digital Twins)', period: 'Hoje', tech: 'Réplicas virtuais conectadas a sensores reais via IoT' }
        ],
        question: 'O que um "Gêmeo Digital" (Digital Twin) permite fazer em uma ponte antes que ela seja construída?',
        options: [
          { id: 'a', text: 'Simular terremotos, tempestades e peso do trânsito no computador para corrigir falhas antes de gastar cimento real', isCorrect: true },
          { id: 'b', text: 'Fazer a ponte sumir no mundo real para ninguém passar', isCorrect: false },
          { id: 'c', text: 'Obrigar os carros a voarem por cima do rio', isCorrect: false },
          { id: 'd', text: 'Pintar a ponte de preto e branco no papel', isCorrect: false }
        ],
        didacticExplanation: 'Com simulações digitais, engenheiros testam o colapso estrutural milhares de vezes virtualmente, garantindo que pontes e aviões reais nasçam com risco zero de engenharia.'
      },
      {
        id: 28,
        module: 2,
        phase: 7,
        era: 'Linha do Tempo',
        badge: 'Comércio',
        title: 'Evolução das Transações Comerciais',
        historicalContext: 'A troca de bens e valor na sociedade:',
        timelineSteps: [
          { step: '1. Escambo Direto', period: '5000 a.C.', tech: 'Troca de sacos de trigo por ovelhas ou sal' },
          { step: '2. Moedas de Metal', period: '600 a.C.', tech: 'Ouro e prata cunhados com peso fixo garantido pelo Estado' },
          { step: '3. Cédula de Papel e Cheque', period: 'Século XVII', tech: 'Títulos de crédito emitidos por bancos centrais' },
          { step: '4. Pagamento Instantâneo (PIX)', period: 'Hoje', tech: 'Assinaturas criptográficas autenticadas em servidores em 2 segundos' }
        ],
        question: 'Qual tecnologia garante que uma transferência PIX não possa ser fraudada ou duplicada?',
        options: [
          { id: 'a', text: 'Criptografia assimétrica de chaves públicas/privadas e redes bancárias auditadas pelo Banco Central', isCorrect: true },
          { id: 'b', text: 'Um funcionário que corre a pé com o dinheiro até o outro banco', isCorrect: false },
          { id: 'c', text: 'Moedas de chocolate derretidas no computador', isCorrect: false },
          { id: 'd', text: 'Fotocópias de notas de dinheiro enviadas por WhatsApp', isCorrect: false }
        ],
        didacticExplanation: 'O dinheiro moderno é pura matemática computacional! A criptografia matemática garante que o valor sai de uma conta e entra na outra sem que ninguém possa clonar a transação.'
      },
      {
        id: 29,
        module: 2,
        phase: 8,
        era: 'Linha do Tempo',
        badge: 'Música',
        title: 'Evolução da Produção Musical',
        historicalContext: 'Como a arte do som foi gravada e distribuída ao longo dos séculos:',
        timelineSteps: [
          { step: '1. Partitura de Papel', period: 'Século XI', tech: 'Música só existia quando músicos tocavam ao vivo' },
          { step: '2. Fonógrafo de Cera', period: '1877', tech: 'Agulha gravando ranhuras em cilindro de cera (Edison)' },
          { step: '3. Disco de Vinil e Fita Cassete', period: 'Século XX', tech: 'Ondas analógicas moldadas em plástico PVC' },
          { step: '4. DAWs e Streaming Digital', period: 'Hoje', tech: 'Áudio digital amostrado a 44.100 vezes por segundo (PCM)' }
        ],
        question: 'O que o formato digital MP3/Streaming permitiu para os artistas independentes?',
        options: [
          { id: 'a', text: 'Gravar um álbum inteiro em um notebook no quarto e lançar mundialmente sem precisar de gravadoras gigantes', isCorrect: true },
          { id: 'b', text: 'Proibiu as pessoas de ouvirem instrumentos como violão e piano', isCorrect: false },
          { id: 'c', text: 'Fez com que os cantores perdessem a voz para sempre', isCorrect: false },
          { id: 'd', text: 'Obrigou as músicas a terem apenas 5 segundos de duração', isCorrect: false }
        ],
        didacticExplanation: 'A tecnologia digital democratizou a produção cultural. Hoje qualquer jovem com um computador e criatividade tem acesso aos mesmos sintetizadores dos grandes estúdios!'
      },
      {
        id: 30,
        module: 2,
        phase: 9,
        era: 'Linha do Tempo',
        badge: 'Síntese das Eras',
        title: 'As Quatro Revoluções do Trabalho',
        historicalContext: 'Os historiadores dividem a transformação do trabalho em 4 grandes saltos:',
        timelineSteps: [
          { step: 'Indústria 1.0', period: '1780', tech: 'Vapor e tear mecânico (fim do esforço puramente muscular)' },
          { step: 'Indústria 2.0', period: '1870', tech: 'Eletricidade e linha de montagem em série (Fordismo)' },
          { step: 'Indústria 3.0', period: '1970', tech: 'Eletrônica, computadores e primeiros robôs programáveis' },
          { step: 'Indústria 4.0', period: 'Hoje', tech: 'Internet das Coisas (IoT), IA, computação em nuvem e Cobots' }
        ],
        question: 'O que caracteriza a atual "Indústria 4.0" em relação às revoluções do passado?',
        options: [
          { id: 'a', text: 'A conexão inteligente entre o mundo físico e o mundo digital, onde máquinas se comunicam em rede e aprendem', isCorrect: true },
          { id: 'b', text: 'A volta da tração animal para puxar esteiras nas fábricas', isCorrect: false },
          { id: 'c', text: 'A proibição do uso de energia elétrica nas indústrias', isCorrect: false },
          { id: 'd', text: 'O abandono de todos os computadores para usar apenas folhas de papel', isCorrect: false }
        ],
        didacticExplanation: 'Na Indústria 4.0, as fábricas são ecossistemas interconectados: sensores, robôs e pessoas colaboram conectados pela nuvem para produzir com sustentabilidade e customização.'
      }
    ],

    // MÓDULO 4: A Era Digital e os Robôs Modernos (O Que a Máquina Faz Melhor?)
    [
      {
        id: 31,
        module: 3,
        phase: 0,
        era: 'Era Digital',
        badge: 'Precisão vs Criatividade',
        title: 'Onde o Robô Supera o Ser Humano?',
        historicalContext: 'Em uma fábrica de microchips, peças microscópicas de silício precisam ser manipuladas com tolerância de nanômetros no escuro.',
        question: 'Qual característica das máquinas é insuperável para a biologia humana?',
        options: [
          { id: 'a', text: 'Precisão micrométrica sem tremores musculares, velocidade de repetição e imunidade à fadiga', isCorrect: true },
          { id: 'b', text: 'Capacidade de chorar de emoção com uma obra de arte', isCorrect: false },
          { id: 'c', text: 'Sentir compaixão por um colega de trabalho machucado', isCorrect: false },
          { id: 'd', text: 'Criar uma receita de bolo inovadora misturando memórias de infância', isCorrect: false }
        ],
        didacticExplanation: 'Máquinas não piscam, não tremem e não se cansam após 10 horas repetindo o mesmo gesto. Por isso elas são ideais para tarefas que exigem precisão cirúrgica contínua.'
      },
      {
        id: 32,
        module: 3,
        phase: 1,
        era: 'Era Digital',
        badge: 'Ambientes Hostis',
        title: 'Robôs em Locais Onde a Vida Humana Não Resiste',
        historicalContext: 'Na usina de Chernobyl e em vulcões ativos, robôs são enviados para desativar bombas, medir radiação e recolher lava incandescente.',
        question: 'Por que o uso de robôs móveis nesses cenários é uma conquista humanitária?',
        options: [
          { id: 'a', text: 'Porque preserva a vida humana, evitando que pessoas sofram contaminação letal por radiação ou calor extremo', isCorrect: true },
          { id: 'b', text: 'Porque os robôs gostam de tomar banho de lava quente', isCorrect: false },
          { id: 'c', text: 'Porque humanos não conseguem andar em superfícies de terra', isCorrect: false },
          { id: 'd', text: 'Porque os robôs conseguem respirar debaixo da terra sem ar', isCorrect: false }
        ],
        didacticExplanation: 'A robótica de resgate e ambientes inóspitos cumpre a mais nobre missão da tecnologia: assumir o perigo de morte para que nenhum pai ou mãe de família perca a vida.'
      },
      {
        id: 33,
        module: 3,
        phase: 2,
        era: 'Era Digital',
        badge: 'O Fator Humano',
        title: 'Onde o Ser Humano é Absolutamente Insubstituível?',
        historicalContext: 'Um hospital pediátrico comprou robôs modernos para triagem e transporte de remédios. Porém, uma criança de 6 anos está assustada e chorando antes de tomar uma injeção.',
        question: 'Qual atitude profissional NENHUM robô ou inteligência artificial consegue executar de verdade?',
        options: [
          { id: 'a', text: 'Empatia genuína, acolhimento afetivo, abraço caloroso e sensibilidade para confortar uma dor emocional', isCorrect: true },
          { id: 'b', text: 'Medir a temperatura com sensor infravermelho em 1 segundo', isCorrect: false },
          { id: 'c', text: 'Calcular a dose de antibiótico com base no peso corporal', isCorrect: false },
          { id: 'd', text: 'Guardar o prontuário no banco de dados digital do hospital', isCorrect: false }
        ],
        didacticExplanation: 'Robôs podem simular vozes amigáveis, mas não sentem amor, compaixão ou dor. O cuidado humano, o afeto e a sensibilidade ética são exclusividades da nossa humanidade.'
      },
      {
        id: 34,
        module: 3,
        phase: 3,
        era: 'Era Digital',
        badge: 'Cobots',
        title: 'O Conceito de Cobot: Robôs Colaborativos',
        historicalContext: 'Na montadora aeroespacial, a operadora Maria trabalha lado a lado com um braço robótico articulado sem grades ou gaiolas de proteção.',
        question: 'Qual é o papel do robô e o papel do ser humano no modelo colaborativo (Cobot)?',
        options: [
          { id: 'a', text: 'O robô segura o motor pesado de 40 kg sem cansaço, enquanto Maria posiciona os cabos delicados com destreza e inspeção visual crítica', isCorrect: true },
          { id: 'b', text: 'O robô manda na fábrica e Maria obedece calada sem pensar', isCorrect: false },
          { id: 'c', text: 'Maria carrega o robô nas costas para ele não gastar bateria', isCorrect: false },
          { id: 'd', text: 'O robô faz tudo e Maria fica dormindo no sofá da fábrica', isCorrect: false }
        ],
        didacticExplanation: 'Cobots são projetados para somar forças: a força mecânica e precisão da máquina aliadas à sensibilidade tátil, julgamento e inteligência adaptativa do ser humano.'
      },
      {
        id: 35,
        module: 3,
        phase: 4,
        era: 'Era Digital',
        badge: 'Arte e Criatividade',
        title: 'A IA Gerativa e a Criatividade Humana',
        historicalContext: 'Programas de IA conseguem gerar imagens, poesias e músicas analisando bilhões de exemplos criados pela humanidade ao longo da história.',
        question: 'O que diferencia a criação de um artista humano da resposta gerada por uma IA?',
        options: [
          { id: 'a', text: 'O artista humano cria a partir de suas vivências reais, dores, alegrias, memórias e sentimentos que a IA não possui', isCorrect: true },
          { id: 'b', text: 'A IA tem sentimentos mais puros que qualquer ser humano', isCorrect: false },
          { id: 'c', text: 'Os seres humanos só conseguem desenhar quadrados cinzas', isCorrect: false },
          { id: 'd', text: 'A IA inventou as cores do arco-íris sozinha', isCorrect: false }
        ],
        didacticExplanation: 'A IA reorganiza padrões estatísticos do passado. O artista humano expressa a alma, a cultura e a experiência viva. A IA é um pincel inteligente, o criador é o humano!'
      },
      {
        id: 36,
        module: 3,
        phase: 5,
        era: 'Era Digital',
        badge: 'Big Data',
        title: 'Análise de Milhões de Dados em Segundos (Big Data)',
        historicalContext: 'Meteorologistas precisam prever a chegada de um furacão analisando dados de 5.000 estações meteorológicas, 50 satélites e boias marítimas simultaneamente.',
        question: 'Por que os cientistas precisam de supercomputadores para esse trabalho?',
        options: [
          { id: 'a', text: 'Porque um cérebro humano levaria centenas de anos para calcular à mão tantas variáveis de vento, pressão e temperatura', isCorrect: true },
          { id: 'b', text: 'Porque os meteorologistas têm preguiça de olhar pela janela', isCorrect: false },
          { id: 'c', text: 'Porque o furacão só se move quando o computador manda', isCorrect: false },
          { id: 'd', text: 'Porque os satélites só funcionam se tiverem jogos instalados', isCorrect: false }
        ],
        didacticExplanation: 'O Big Data é a capacidade de processar volumes monumentais de informação em segundos, permitindo que governos evacuem cidades costeiras e salvem milhares de vidas.'
      },
      {
        id: 37,
        module: 3,
        phase: 6,
        era: 'Era Digital',
        badge: 'Decisão Ética',
        title: 'O Limite da Máquina: Julgamento Moral e Justiça',
        historicalContext: 'Um tribunal estuda usar um software para decidir se uma pessoa acusada de furto de alimento deve ir para a prisão ou receber assistência social.',
        question: 'Por que juristas e filósofos alertam que um algoritmo NUNCA deve dar a sentença final?',
        options: [
          { id: 'a', text: 'Porque a máquina não compreende o contexto humano, a dignidade, o arrependimento e pode carregar preconceitos ocultos nos dados históricos', isCorrect: true },
          { id: 'b', text: 'Porque os computadores não sabem ler palavras escritas em português', isCorrect: false },
          { id: 'c', text: 'Porque o réu pode roubar o teclado do computador do juiz', isCorrect: false },
          { id: 'd', text: 'Porque a eletricidade do tribunal é muito cara', isCorrect: false }
        ],
        didacticExplanation: 'A justiça não é uma equação matemática fria. Ela exige bom senso, empatia, escuta e compreensão da história de vida — atributos exclusivos da consciência humana.'
      },
      {
        id: 38,
        module: 3,
        phase: 7,
        era: 'Era Digital',
        badge: 'Educação Digital',
        title: 'O Papel do Professor na Era dos Vídeos e Tutoriais',
        historicalContext: 'Hoje qualquer aluno pode assistir a vídeos no YouTube ou perguntar dúvidas para uma inteligência artificial em segundos.',
        question: 'Diante de tanta informação disponível na internet, por que a figura do professor é mais importante do que nunca?',
        options: [
          { id: 'a', text: 'Porque o professor ensina a pensar criticamente, a filtrar verdades de mentiras, inspira valores éticos e apoia o aluno em seus momentos de dificuldade', isCorrect: true },
          { id: 'b', text: 'Porque os computadores odeiam ensinar crianças', isCorrect: false },
          { id: 'c', text: 'Porque as escolas precisam de alguém para apagar a lousa de giz', isCorrect: false },
          { id: 'd', text: 'Porque os vídeos do YouTube são todos falsificados por robôs', isCorrect: false }
        ],
        didacticExplanation: 'Informação não é sabedoria! Ter dados no celular não significa saber usá-los para o bem. O educador é o mentor que guia o estudante a transformar dados em cidadania e conhecimento real.'
      },
      {
        id: 39,
        module: 3,
        phase: 8,
        era: 'Era Digital',
        badge: 'Segurança e Manutenção',
        title: 'Quem Cuida das Máquinas quando Elas Falham?',
        historicalContext: 'Em uma fábrica totalmente robotizada, um rolamento aquece, um sensor quebra ou um cabo se rompe e toda a linha de produção para.',
        question: 'Quem é essencial para diagnosticar problemas inesperados e manter os sistemas funcionando?',
        options: [
          { id: 'a', text: 'Técnicos e engenheiros humanos de manutenção e mecatrônica com raciocínio investigativo apurado', isCorrect: true },
          { id: 'b', text: 'Ninguém, as máquinas se consertam por mágica sem peças de reposição', isCorrect: false },
          { id: 'c', text: 'A fábrica deve ser jogada no lixo e reconstruída do zero', isCorrect: false },
          { id: 'd', text: 'Basta desligar a luz que o robô cura seus circuitos sozinho', isCorrect: false }
        ],
        didacticExplanation: 'Quanto mais tecnologia uma sociedade tem, mais necessários são os profissionais capacitados para instalar, calibrar, programar, proteger contra hackers e consertar o maquinário.'
      },
      {
        id: 40,
        module: 3,
        phase: 9,
        era: 'Era Digital',
        badge: 'Síntese da Cooperação',
        title: 'A Grande Síntese: Humanos + Tecnologia',
        historicalContext: 'Kasparov, campeão mundial de xadrez que perdeu para o supercomputador Deep Blue, descobriu mais tarde que uma equipe de "Humano mediano + Computador mediano" vencia tanto o melhor humano sozinho quanto o melhor computador sozinho!',
        question: 'O que esse fenômeno histórico comprovou sobre o futuro do trabalho?',
        options: [
          { id: 'a', text: 'A maior força de produtividade e inteligência nasce da PARCERIA colaborativa entre o cérebro humano e o poder de processamento da máquina', isCorrect: true },
          { id: 'b', text: 'Humanos e computadores devem ser inimigos eternos em guerra constante', isCorrect: false },
          { id: 'c', text: 'O ser humano deve parar de aprender para deixar o computador pensar por ele', isCorrect: false },
          { id: 'd', text: 'Os jogos de computador deveriam ser banidos das escolas', isCorrect: false }
        ],
        didacticExplanation: 'Essa é a regra de ouro da tecnologia moderna: a inteligência combinada (Inteligência Aumentada) é sempre superior ao isolamento. A máquina é a alavanca da mente humana!'
      }
    ],

    // MÓDULO 5: O Futuro do Trabalho e as Novas Profissões
    [
      {
        id: 41,
        module: 4,
        phase: 0,
        era: 'Profissões do Futuro',
        badge: 'Inteligência Artificial',
        title: 'Engenheiro(a) de Prompts e Curador de IA',
        historicalContext: 'Profissionais especializados em formular instruções precisas, semânticas e contextuais para que modelos de IA gerem diagnósticos, códigos e soluções científicas sem alucinações.',
        question: 'Qual habilidade fundamental um(a) Engenheiro(a) de Prompts precisa ter?',
        options: [
          { id: 'a', text: 'Domínio profundo da língua, lógica rigorosa, clareza de pensamento e capacidade de testar hipóteses com senso crítico', isCorrect: true },
          { id: 'b', text: 'Falar apenas em código binário (zeros e uns) com a tela', isCorrect: false },
          { id: 'c', text: 'Saber digitar sem olhar para o teclado com luvas de ferro', isCorrect: false },
          { id: 'd', text: 'Apertar a tecla ENTER o mais forte possível', isCorrect: false }
        ],
        didacticExplanation: 'Para extrair o melhor de uma IA, é preciso saber fazer as perguntas certas! A clareza de comunicação e o raciocínio analítico são as maiores ferramentas dessa nova profissão.'
      },
      {
        id: 42,
        module: 4,
        phase: 1,
        era: 'Profissões do Futuro',
        badge: 'Ciberdefesa',
        title: 'Especialista em Cibersegurança e Defesa Digital',
        historicalContext: 'Com hospitais, bancos e cidades conectados em rede, criminosos virtuais tentam invadir sistemas para sequestrar dados ou paralisar serviços essenciais.',
        question: 'Qual é a missão diária de um(a) especialista em cibersegurança?',
        options: [
          { id: 'a', text: 'Descobrir vulnerabilidades antes dos criminosos, implementar criptografia forte e proteger a privacidade dos cidadãos', isCorrect: true },
          { id: 'b', text: 'Espalhar vírus em todos os computadores da escola', isCorrect: false },
          { id: 'c', text: 'Postar as senhas dos diretores de hospitais na internet', isCorrect: false },
          { id: 'd', text: 'Proibir as pessoas de usarem computadores', isCorrect: false }
        ],
        didacticExplanation: 'São os guardiões do mundo digital! Eles usam matemática avançada e análise comportamental para proteger redes elétricas, satélites e prontuários médicos contra ataques.'
      },
      {
        id: 43,
        module: 4,
        phase: 2,
        era: 'Profissões do Futuro',
        badge: 'Aeroespacial & Campo',
        title: 'Operador(a) e Piloto de Drones de Alta Precisão',
        historicalContext: 'Drones realizam reflorestamento lançando sementes inteligentes em áreas desmatadas e entregam bolsas de sangue em aldeias ribeirinhas isoladas.',
        question: 'O que essa nova profissão exige do operador além de saber pilotar pelo controle?',
        options: [
          { id: 'a', text: 'Conhecimento de meteorologia, leitura de sensores multiespectrais, manutenção mecatrônica e legislação do espaço aéreo', isCorrect: true },
          { id: 'b', text: 'Saber atirar pedras em outros drones no ar', isCorrect: false },
          { id: 'c', text: 'Voar apenas com os olhos vendados', isCorrect: false },
          { id: 'd', text: 'Pintar o drone com glitter brilhante', isCorrect: false }
        ],
        didacticExplanation: 'Pilotar drones profissionais é uma carreira técnica que une aviação, agronomia, geografia e robótica para salvar vidas e restaurar biomas degradados.'
      },
      {
        id: 44,
        module: 4,
        phase: 3,
        era: 'Profissões do Futuro',
        badge: 'Sustentabilidade',
        title: 'Engenheiro(a) de Energias Renováveis e Cidades Inteligentes',
        historicalContext: 'Cidades modernas gerenciam painéis solares, usinas eólicas e carros elétricos por meio de redes inteligentes (Smart Grids) para zerar a emissão de carbono.',
        question: 'Qual é o papel desse profissional no combate às mudanças climáticas?',
        options: [
          { id: 'a', text: 'Projetar sistemas automatizados que aproveitem a energia limpa do sol e dos ventos sem desperdício e com armazenamento em baterias', isCorrect: true },
          { id: 'b', text: 'Queimar mais carvão mineral para fazer fumaça', isCorrect: false },
          { id: 'c', text: 'Desligar a eletricidade de todos os hospitais do mundo', isCorrect: false },
          { id: 'd', text: 'Pintar os telhados de preto para esquentar o planeta', isCorrect: false }
        ],
        didacticExplanation: 'A transição para energia limpa depende de algoritmos e automação: saber a que hora direcionar energia solar das casas para a rede exige engenharia digital de ponta!'
      },
      {
        id: 45,
        module: 4,
        phase: 4,
        era: 'Profissões do Futuro',
        badge: 'Ética Digital',
        title: 'Auditor(a) de Ética Algorítmica e Direitos Digitais',
        historicalContext: 'Bancos e empresas usam algoritmos para conceder empréstimos, selecionar empregados e ranquear notícias nas redes sociais.',
        question: 'O que faz um(a) Auditor(a) de Ética de Algoritmos?',
        options: [
          { id: 'a', text: 'Verifica se os códigos de computador não contêm preconceitos ocultos, viés discriminatório ou manipulação nociva aos cidadãos', isCorrect: true },
          { id: 'b', text: 'Ensina os computadores a insultarem as pessoas na internet', isCorrect: false },
          { id: 'c', text: 'Apaga todas as redes sociais para ninguém se comunicar', isCorrect: false },
          { id: 'd', text: 'Garante que os robôs dominem o mundo sem regras', isCorrect: false }
        ],
        didacticExplanation: 'Essa carreira une Direito, Filosofia e Ciência da Computação para garantir que a tecnologia sirva à justiça social e respeite a dignidade e a diversidade humana.'
      },
      {
        id: 46,
        module: 4,
        phase: 5,
        era: 'Profissões do Futuro',
        badge: 'Saúde Avançada',
        title: 'Desenvolvedor(a) de Próteses Biônicas e Exoesqueletos',
        historicalContext: 'Pessoas com deficiência física e operários que carregam peso usam exoesqueletos robóticos e mãos biônicas que leem impulsos elétricos cerebrais.',
        question: 'Qual campo interdisciplinar combina biologia, medicina e robótica nessa área?',
        options: [
          { id: 'a', text: 'A Engenharia Biomédica e Biomecatrônica, que une eletrodos neurais à mecânica fina de motores e polímeros flexíveis', isCorrect: true },
          { id: 'b', text: 'A confecção de sapatos de madeira pesada', isCorrect: false },
          { id: 'c', text: 'O estudo de fósseis de dinossauros extintos', isCorrect: false },
          { id: 'd', text: 'A pintura manual com giz de cera', isCorrect: false }
        ],
        didacticExplanation: 'A robótica reabilitativa devolve a marcha e o movimento para pessoas que perderam membros, permitindo que voltem a abraçar, caminhar e trabalhar com autonomia.'
      },
      {
        id: 47,
        module: 4,
        phase: 6,
        era: 'Profissões do Futuro',
        badge: 'Economia Circular',
        title: 'Especialista em Mineração Urbana e E-Lixo',
        historicalContext: 'Milhões de celulares e computadores são descartados por ano. Um smartphone contém ouro, prata, cobre, platina e lítio em proporções maiores que uma mina mineral no solo.',
        question: 'O que o(a) especialista em mineração urbana faz para proteger a natureza?',
        options: [
          { id: 'a', text: 'Desenvolve robôs de desmontagem automatizada para recuperar metais nobres de placas velhas e reintroduzi-los na indústria', isCorrect: true },
          { id: 'b', text: 'Joga os aparelhos eletrônicos velhos dentro dos rios e oceanos', isCorrect: false },
          { id: 'c', text: 'Queima pilhas e baterias em fogueiras no quintal de casa', isCorrect: false },
          { id: 'd', text: 'Enterra celulares com lixo orgânico na terra úmida', isCorrect: false }
        ],
        didacticExplanation: 'A Economia Circular e a robótica de reciclagem evitam a devastação de florestas para minerar metais raros, extraindo matérias-primas direto do lixo eletrônico descartado.'
      },
      {
        id: 48,
        module: 4,
        phase: 7,
        era: 'Profissões do Futuro',
        badge: 'Realidade Virtual',
        title: 'Arquiteto(a) de Mundos Virtuais e Ambientes Imersivos',
        historicalContext: 'Médicos treinam cirurgias complexas, bombeiros simulam resgates em chamas e estudantes visitam o interior de células humanas em Realidade Virtual (VR).',
        question: 'Por que o treinamento de profissionais em simuladores virtuais 3D revolucionou o aprendizado?',
        options: [
          { id: 'a', text: 'Permite errar, testar e aperfeiçoar habilidades complexas centenas de vezes com segurança total antes de agir no mundo real', isCorrect: true },
          { id: 'b', text: 'Porque os simuladores são apenas para jogar videogame e não ensinam nada sério', isCorrect: false },
          { id: 'c', text: 'Porque aprender na vida real sem treino nunca causou nenhum acidente', isCorrect: false },
          { id: 'd', text: 'Porque a realidade virtual faz os bombeiros esquecerem como apagar fogo', isCorrect: false }
        ],
        didacticExplanation: 'Pilotos de avião, cirurgiões e astronautas treinam em simuladores por meses. A simulação imersiva transforma o erro em aprendizado seguro e sem vítimas.'
      },
      {
        id: 49,
        module: 4,
        phase: 8,
        era: 'Profissões do Futuro',
        badge: 'Educação para o Futuro',
        title: 'Como se Preparar para as Profissões que Ainda Nem Existem?',
        historicalContext: 'Estudos apontam que 65% das crianças que estão hoje na escola trabalharão em profissões que ainda não foram inventadas.',
        question: 'Qual é a melhor preparação que um(a) estudante de 12 anos pode desenvolver hoje?',
        options: [
          { id: 'a', text: 'Aprender a aprender, ter curiosidade, desenvolver pensamento crítico, saber colaborar em equipe e dominar a cidadania digital', isCorrect: true },
          { id: 'b', text: 'Decorar de memória listas telefônicas sem entender o que elas significam', isCorrect: false },
          { id: 'c', text: 'Ter medo da tecnologia e se recusar a usar computadores', isCorrect: false },
          { id: 'd', text: 'Acreditar em tudo o que vê nas redes sociais sem checar a fonte', isCorrect: false }
        ],
        didacticExplanation: 'Ferramentas mudam a cada 5 anos. Quem aprende a pensar criticamente, a ter curiosidade científica e a trabalhar com empatia estará pronto para qualquer profissão do futuro!'
      },
      {
        id: 50,
        module: 4,
        phase: 9,
        era: 'Profissões do Futuro',
        badge: 'Grande Conclusão',
        title: 'A Mensagem da Linha do Tempo do Trabalho',
        historicalContext: 'Da enxada de pedra ao satélite em órbita, a história humana é a história de transformar o esforço biológico em inteligência, arte e colaboração social.',
        question: 'Qual é a mensagem final que resume toda a evolução do trabalho humano?',
        options: [
          { id: 'a', text: 'A tecnologia não substitui o ser humano; ela transforma ferramentas, elimina o trabalho desumano e abre caminhos para criarmos um futuro melhor!', isCorrect: true },
          { id: 'b', text: 'O ser humano deve ser derrotado pelas máquinas e parar de existir', isCorrect: false },
          { id: 'c', text: 'O trabalho manual de sofrimento extremo deveria voltar para todas as pessoas', isCorrect: false },
          { id: 'd', text: 'A tecnologia é um erro e deveríamos viver sem eletricidade nem remédios', isCorrect: false }
        ],
        didacticExplanation: 'Parabéns, Historiador(a) e Cientista do Futuro! Você completou os 50 desafios sobre A Evolução do Trabalho. Use a tecnologia com sabedoria, ética e empatia para construir um mundo mais justo para todos!'
      }
    ],

    // MÓDULO 6: 🧩 O Construtor da Linha do Tempo (Drag & Drop Cronológico)
    [
      {
        id: 51,
        module: 5,
        phase: 0,
        type: 'timeline_drag',
        badge: 'Escrita',
        title: 'Linha do Tempo: A Evolução da Escrita',
        historicalContext: 'Organize a jornada da escrita humana desde os manuscritos antigos até os processadores de texto modernos.',
        question: 'Arraste cada uma das 4 invenções para a sua época histórica correta na linha do tempo:',
        didacticExplanation: 'Da pena animal que dependia da força dos dedos até o processador na nuvem, a escrita se tornou instantânea e universal!',
        timelineCards: [
          { id: 't1_1', name: 'Pena de Ganso e Papiro', icon: '🪶', correctSlotIndex: 0 },
          { id: 't1_2', name: 'Prensa de Tipos Móveis (Gutenberg)', icon: '📰', correctSlotIndex: 1 },
          { id: 't1_3', name: 'Máquina de Escrever Mecânica', icon: '⌨️', correctSlotIndex: 2 },
          { id: 't1_4', name: 'Editor de Texto em Nuvem com IA', icon: '💻', correctSlotIndex: 3 }
        ]
      },
      {
        id: 52,
        module: 5,
        phase: 1,
        type: 'timeline_drag',
        badge: 'Cálculo',
        title: 'Linha do Tempo: A Evolução do Cálculo',
        historicalContext: 'A contagem de pedras até os supercomputadores modernos com transistores microscópicos.',
        question: 'Encaixe os 4 instrumentos de cálculo nas suas respectivas eras cronológicas:',
        didacticExplanation: 'O ábaco dependia dos dedos; a régua e as calculadoras dependiam de engrenagens; os chips modernos calculam com elétrons!',
        timelineCards: [
          { id: 't2_1', name: 'Ábaco de Madeira e Pedras', icon: '🧮', correctSlotIndex: 0 },
          { id: 't2_2', name: 'Régua de Cálculo Logarítmica', icon: '📏', correctSlotIndex: 1 },
          { id: 't2_3', name: 'Calculadora Mecânica de Engrenagens', icon: '⚙️', correctSlotIndex: 2 },
          { id: 't2_4', name: 'Microprocessador de Silício em Nuvem', icon: '⚡', correctSlotIndex: 3 }
        ]
      },
      {
        id: 53,
        module: 5,
        phase: 2,
        type: 'timeline_drag',
        badge: 'Iluminação',
        title: 'Linha do Tempo: O Domínio da Luz Noturna',
        historicalContext: 'Como o ser humano venceu a escuridão da noite para trabalhar e viver com segurança.',
        question: 'Posicione as tecnologias de iluminação na ordem cronológica correta:',
        didacticExplanation: 'Do fogo instável à lâmpada incandescente que esquentava até os LEDs frios e inteligentes controlados por sensores!',
        timelineCards: [
          { id: 't3_1', name: 'Tocha de Fogo e Resina Animal', icon: '🔥', correctSlotIndex: 0 },
          { id: 't3_2', name: 'Lampião a Gás e Querosene', icon: '🏮', correctSlotIndex: 1 },
          { id: 't3_3', name: 'Lâmpada Incandescente de Filamento', icon: '💡', correctSlotIndex: 2 },
          { id: 't3_4', name: 'Lâmpada de LED Inteligente IoT', icon: '✨', correctSlotIndex: 3 }
        ]
      },
      {
        id: 54,
        module: 5,
        phase: 3,
        type: 'timeline_drag',
        badge: 'Transporte',
        title: 'Linha do Tempo: A Velocidade dos Meios de Transporte',
        historicalContext: 'A evolução da locomoção terrestre: da força dos animais aos motores elétricos inteligentes.',
        question: 'Ordene a evolução dos veículos de transporte na esteira temporal:',
        didacticExplanation: 'A tração animal limitava a velocidade a 15 km/h; a locomotiva a vapor uniu cidades; hoje carros elétricos navegam por IA!',
        timelineCards: [
          { id: 't4_1', name: 'Carroça de Tração por Cavalos e Bois', icon: '🐎', correctSlotIndex: 0 },
          { id: 't4_2', name: 'Locomotiva Maria-Fumaça a Vapor', icon: '🚂', correctSlotIndex: 1 },
          { id: 't4_3', name: 'Automóvel a Gasolina em Linha de Montagem', icon: '🚗', correctSlotIndex: 2 },
          { id: 't4_4', name: 'Veículo Elétrico Autônomo com Sensores LiDAR', icon: '🔋', correctSlotIndex: 3 }
        ]
      },
      {
        id: 55,
        module: 5,
        phase: 4,
        type: 'timeline_drag',
        badge: 'Agricultura',
        title: 'Linha do Tempo: O Trabalho Rural e a Produção de Alimentos',
        historicalContext: 'A história da comida: da foice de ferro às colheitadeiras guiadas por satélites.',
        question: 'Coloque as ferramentas agrícolas nas suas respectivas eras históricas:',
        didacticExplanation: 'A agricultura era o trabalho mais exaustivo da humanidade; hoje drones e máquinas com GPS monitoram a lavoura com precisão.',
        timelineCards: [
          { id: 't5_1', name: 'Foice Manual e Arado de Madeira', icon: '🌾', correctSlotIndex: 0 },
          { id: 't5_2', name: 'Trator Mecânico Tracionado a Vapor', icon: '⚙️', correctSlotIndex: 1 },
          { id: 't5_3', name: 'Colheitadeira Industrial a Combustão', icon: '🚜', correctSlotIndex: 2 },
          { id: 't5_4', name: 'Drone Agrícola com Câmeras Multiespectrais', icon: '🚁', correctSlotIndex: 3 }
        ]
      },
      {
        id: 56,
        module: 5,
        phase: 5,
        type: 'timeline_drag',
        badge: 'Comunicação',
        title: 'Linha do Tempo: A Conexão à Distância',
        historicalContext: 'Como as notícias e mensagens cruzaram oceanos e montanhas ao longo da história.',
        question: 'Organize a evolução das telecomunicações na linha do tempo:',
        didacticExplanation: 'Cartas a cavalo levavam meses; o telégrafo inaugurou a eletricidade na comunicação; hoje o 5G conecta bilhões instantaneamente.',
        timelineCards: [
          { id: 't6_1', name: 'Sinal de Fumaça e Carta a Cavalo', icon: '✉️', correctSlotIndex: 0 },
          { id: 't6_2', name: 'Telégrafo Óptico com Torres de Sinal', icon: '📡', correctSlotIndex: 1 },
          { id: 't6_3', name: 'Telefone Fixo com Fios de Cobre', icon: '☎️', correctSlotIndex: 2 },
          { id: 't6_4', name: 'Fibra Óptica Submarina e Redes 5G', icon: '🌐', correctSlotIndex: 3 }
        ]
      },
      {
        id: 57,
        module: 5,
        phase: 6,
        type: 'timeline_drag',
        badge: 'Imagem',
        title: 'Linha do Tempo: O Registro Visual e a Fotografia',
        historicalContext: 'Do retrato pintado à mão durante meses até as fotos digitais capturadas em milissegundos.',
        question: 'Encaixe cada técnica de imagem na sua época de surgimento:',
        didacticExplanation: 'O daguerreótipo exigia que a pessoa ficasse 15 minutos imóvel! Hoje câmeras neurais corrigem a luz em fração de segundo.',
        timelineCards: [
          { id: 't7_1', name: 'Pintura a Óleo sobre Tela de Tecido', icon: '🎨', correctSlotIndex: 0 },
          { id: 't7_2', name: 'Daguerreótipo em Placa Metálica Polida', icon: '📷', correctSlotIndex: 1 },
          { id: 't7_3', name: 'Câmera Analógica com Rolo de Filme Químico', icon: '🎞️', correctSlotIndex: 2 },
          { id: 't7_4', name: 'Sensor Digital CMOS com Inteligência Neural', icon: '📱', correctSlotIndex: 3 }
        ]
      },
      {
        id: 58,
        module: 5,
        phase: 7,
        type: 'timeline_drag',
        badge: 'Memória',
        title: 'Linha do Tempo: Onde Guardamos Nossos Dados',
        historicalContext: 'A preservação do saber humano: das cinzas do papiro aos servidores em nuvem seguros.',
        question: 'Posicione os suportes de armazenamento na linha do tempo correta:',
        didacticExplanation: 'Bibliotecas inteiras queimavam em incêndios no passado; hoje réplicas criptografadas em nuvem guardam a memória da humanidade.',
        timelineCards: [
          { id: 't8_1', name: 'Rolos de Papiro e Pergaminho de Couro', icon: '📜', correctSlotIndex: 0 },
          { id: 't8_2', name: 'Enciclopédias e Arquivos Físicos em Papel', icon: '📚', correctSlotIndex: 1 },
          { id: 't8_3', name: 'Disquetes Magnéticos de 1,44 MB', icon: '💾', correctSlotIndex: 2 },
          { id: 't8_4', name: 'Servidores em Nuvem com Memória Flash SSD', icon: '☁️', correctSlotIndex: 3 }
        ]
      },
      {
        id: 59,
        module: 5,
        phase: 8,
        type: 'timeline_drag',
        badge: 'Construção',
        title: 'Linha do Tempo: Como Construímos Cidades',
        historicalContext: 'Das primeiras cabanas de barro às casas impressas em 3D em 24 horas.',
        question: 'Arraste as tecnologias de construção para a ordem cronológica correta:',
        didacticExplanation: 'Construir exigia a força muscular de multidões; hoje braços robóticos e impressoras gigantes depositam cimento com segurança.',
        timelineCards: [
          { id: 't9_1', name: 'Picareta de Pedra e Corda com Troncos', icon: '🪵', correctSlotIndex: 0 },
          { id: 't9_2', name: 'Guindaste Mecânico a Vapor com Cabos de Aço', icon: '🏗️', correctSlotIndex: 1 },
          { id: 't9_3', name: 'Betoneiras e Tratores Diesel de Terraplanagem', icon: '🚚', correctSlotIndex: 2 },
          { id: 't9_4', name: 'Impressora 3D Robótica de Casas de Concreto', icon: '🏛️', correctSlotIndex: 3 }
        ]
      },
      {
        id: 60,
        module: 5,
        phase: 9,
        type: 'timeline_drag',
        badge: 'Medicina',
        title: 'Linha do Tempo: Os Cuidados de Saúde e Cirurgia',
        historicalContext: 'A vitória da medicina sobre a dor e as infecções cirúrgicas.',
        question: 'Ordene a evolução dos procedimentos cirúrgicos na linha do tempo:',
        didacticExplanation: 'Antes da anestesia e da esterilização, cirurgias eram dolorosas e rústicas; hoje robôs milimétricos operam com incisões microscópicas.',
        timelineCards: [
          { id: 't10_1', name: 'Faca Rústica sem Anestesia e Ervas', icon: '🌿', correctSlotIndex: 0 },
          { id: 't10_2', name: 'Estetoscópio de Madeira e Éter Anestésico', icon: '🩺', correctSlotIndex: 1 },
          { id: 't10_3', name: 'Aparelho de Raio-X com Tubo a Vácuo', icon: '🩻', correctSlotIndex: 2 },
          { id: 't10_4', name: 'Braço Robótico Cirúrgico Da Vinci Teleoperado', icon: '🦾', correctSlotIndex: 3 }
        ]
      }
    ],

    // MÓDULO 7: ⚖️ O Grande Classificador: Humano vs Máquina (Drag & Drop Dinâmico)
    [
      {
        id: 61,
        module: 6,
        phase: 0,
        type: 'classifier_drag',
        badge: 'Força vs Cuidado',
        title: 'Classificador: Onde Cada Um se Destaca?',
        historicalContext: 'Cada trabalhador e ferramenta tem seu talento exclusivo. Separe as tarefas entre as habilidades da Máquina e do Ser Humano.',
        question: 'Arraste cada uma das 4 tarefas para a caixa correta (Máquina ou Humano):',
        didacticExplanation: 'Máquinas realizam cálculos instantâneos e tarefas exaustivas; humanos oferecem compaixão, escuta ativa e emoção genuína!',
        classifierItems: [
          { id: 'c1_1', text: 'Calcular 1 bilhão de equações em 1 segundo', icon: '🧮', correctCategory: 'machine' },
          { id: 'c1_2', text: 'Abraçar e acalmar uma criança assustada no hospital', icon: '🫂', correctCategory: 'human' },
          { id: 'c1_3', text: 'Soldar 500 portas de carro sem parar e sem cansaço', icon: '⚡', correctCategory: 'machine' },
          { id: 'c1_4', text: 'Criar uma melodia tocante inspirada na saudade dos avós', icon: '🎶', correctCategory: 'human' }
        ]
      },
      {
        id: 62,
        module: 6,
        phase: 1,
        type: 'classifier_drag',
        badge: 'Perigo vs Empatia',
        title: 'Classificador: Riscos e Convivência',
        historicalContext: 'Protegendo a vida humana e fortalecendo as relações de amizade.',
        question: 'Classifique as 4 situações entre a Caixa da Máquina e a Caixa do Humano:',
        didacticExplanation: 'Colocar um robô em ambiente letal salva vidas humanas; resolver atritos com empatia exige inteligência emocional!',
        classifierItems: [
          { id: 'c2_1', text: 'Entrar em local com vazamento de radiação nuclear tóxica', icon: '☢️', correctCategory: 'machine' },
          { id: 'c2_2', text: 'Mediar uma discussão entre dois amigos para que façam as pazes', icon: '🤝', correctCategory: 'human' },
          { id: 'c2_3', text: 'Varrer o chão de uma fábrica 24 horas por dia sem parar', icon: '🧹', correctCategory: 'machine' },
          { id: 'c2_4', text: 'Contar uma história de ninar cheia de carinho para o irmãozinho', icon: '🌙', correctCategory: 'human' }
        ]
      },
      {
        id: 63,
        module: 6,
        phase: 2,
        type: 'classifier_drag',
        badge: 'Dados vs Sentimento',
        title: 'Classificador: Organização e Imaginação',
        historicalContext: 'A separação entre processamento veloz de dados e sensibilidade poética.',
        question: 'Arraste as tarefas para o destino apropriado:',
        didacticExplanation: 'Computadores organizam montanhas de dados com rapidez; perceber o sentimento alheio e imaginar novos mundos é puramente humano.',
        classifierItems: [
          { id: 'c3_1', text: 'Organizar 1 milhão de prontuários por data de nascimento', icon: '📁', correctCategory: 'machine' },
          { id: 'c3_2', text: 'Inventar uma fábula inédita com personagens da imaginação', icon: '✨', correctCategory: 'human' },
          { id: 'c3_3', text: 'Medir espessura de vidro com precisão de 0,001 mm', icon: '🔍', correctCategory: 'machine' },
          { id: 'c3_4', text: 'Perceber que um colega está em silêncio porque está magoado', icon: '💭', correctCategory: 'human' }
        ]
      },
      {
        id: 64,
        module: 6,
        phase: 3,
        type: 'classifier_drag',
        badge: 'Pesado vs Justo',
        title: 'Classificador: Cargas Físicas e Decisões Morais',
        historicalContext: 'O limite do peso suportado pelo corpo versus a ponderação de regras justas.',
        question: 'Distribua as ações entre as duas caixas:',
        didacticExplanation: 'Máquinas suportam toneladas de peso; a flexibilidade da justiça e o respeito aos vulneráveis exigem consciência moral.',
        classifierItems: [
          { id: 'c4_1', text: 'Empilhar 1.000 caixas de 50 kg sem lesionar as costas', icon: '📦', correctCategory: 'machine' },
          { id: 'c4_2', text: 'Decidir com justiça se uma regra precisa de exceção solidária', icon: '⚖️', correctCategory: 'human' },
          { id: 'c4_3', text: 'Monitorar temperatura de caldeira a 800°C sem desmaiar', icon: '🌡️', correctCategory: 'machine' },
          { id: 'c4_4', text: 'Ajudar um idoso a atravessar a rua com atenção e respeito', icon: '🚶‍♂️', correctCategory: 'human' }
        ]
      },
      {
        id: 65,
        module: 6,
        phase: 4,
        type: 'classifier_drag',
        badge: 'Espaço vs Amor',
        title: 'Classificador: Explorando o Desconhecido',
        historicalContext: 'Mundos distantes sem ar respirável e o afeto aos seres vivos do nosso planeta.',
        question: 'Classifique as 4 atividades:',
        didacticExplanation: 'Robôs espaciais viajam por anos no vácuo congelante; o amor à vida e a expressão de poesias nascem do coração humano.',
        classifierItems: [
          { id: 'c5_1', text: 'Explorar a cratera de Marte sob tempestade de poeira cósmica', icon: '🪐', correctCategory: 'machine' },
          { id: 'c5_2', text: 'Sentir compaixão e alimentar um animalzinho abandonado', icon: '🐶', correctCategory: 'human' },
          { id: 'c5_3', text: 'Detectar microfissura invisível em turbina de avião por laser', icon: '✈️', correctCategory: 'machine' },
          { id: 'c5_4', text: 'Compor um poema romântico expressando o primeiro beijo', icon: '💌', correctCategory: 'human' }
        ]
      },
      {
        id: 66,
        module: 6,
        phase: 5,
        type: 'classifier_drag',
        badge: 'Micrométrico vs Afeto',
        title: 'Classificador: Precisão e Carinho',
        historicalContext: 'A manufatura de semicondutores e o acolhimento afetuoso de pessoas queridas.',
        question: 'Arraste os cartões para a caixa adequada:',
        didacticExplanation: 'Soldas em nanoescala exigem mãos robóticas firmes; ouvir as memórias de quem amamos exige tempo, paciência e afeto.',
        classifierItems: [
          { id: 'c6_1', text: 'Montar circuito com 10.000 micro-soldas invisíveis ao olho', icon: '🔬', correctCategory: 'machine' },
          { id: 'c6_2', text: 'Olhar nos olhos de um paciente e ouvir com paciência e amor', icon: '❤️', correctCategory: 'human' },
          { id: 'c6_3', text: 'Verificar a rotação de turbinas de usina a 3.000 RPM sem piscar', icon: '🌀', correctCategory: 'machine' },
          { id: 'c6_4', text: 'Cozinhar um almoço de domingo colocando o tempero da família', icon: '🍲', correctCategory: 'human' }
        ]
      },
      {
        id: 67,
        module: 6,
        phase: 6,
        type: 'classifier_drag',
        badge: 'Perigo vs Moral',
        title: 'Classificador: Proteção e Sabedoria',
        historicalContext: 'Ações de desativação de explosivos e conselhos para a vida.',
        question: 'Separe as ações entre Máquina e Humano:',
        didacticExplanation: 'Robôs operam em zonas de conflito para que vidas sejam poupadas; conselhos éticos requerem sabedoria de vida acumulada.',
        classifierItems: [
          { id: 'c7_1', text: 'Desativar mina terrestre enterrada no barro com robô esteira', icon: '💣', correctCategory: 'machine' },
          { id: 'c7_2', text: 'Avaliar um caso difícil com sabedoria, bom senso e moralidade', icon: '🏛️', correctCategory: 'human' },
          { id: 'c7_3', text: 'Processar 100.000 transações de pagamento PIX por segundo', icon: '💳', correctCategory: 'machine' },
          { id: 'c7_4', text: 'Dar um conselho amigo para um jovem que está com medo do futuro', icon: '🌱', correctCategory: 'human' }
        ]
      },
      {
        id: 68,
        module: 6,
        phase: 7,
        type: 'classifier_drag',
        badge: 'Escuridão vs Liderança',
        title: 'Classificador: Automação e Inspiração',
        historicalContext: 'Trabalho contínuo no escuro e a capacidade de encorajar outras pessoas.',
        question: 'Arraste para as caixas corretas:',
        didacticExplanation: 'Sensores de AGV não precisam de luz para navegar; a humildade de pedir desculpas e liderar é a essência da liderança humana.',
        classifierItems: [
          { id: 'c8_1', text: 'Navegar em armazém totalmente escuro guiado por fita magnética', icon: '🔦', correctCategory: 'machine' },
          { id: 'c8_2', text: 'Inspirar uma equipe desanimada a ter esperança e continuar', icon: '⭐', correctCategory: 'human' },
          { id: 'c8_3', text: 'Cortar blocos de granito com jato de areia e água sob pressão', icon: '🪨', correctCategory: 'machine' },
          { id: 'c8_4', text: 'Reconhecer um erro, pedir desculpas sinceras e mudar de atitude', icon: '🙏', correctCategory: 'human' }
        ]
      },
      {
        id: 69,
        module: 6,
        phase: 8,
        type: 'classifier_drag',
        badge: 'Velocidade vs Filosofia',
        title: 'Classificador: Aceleração e Profundidade',
        historicalContext: 'A velocidade dos processos industriais e o acolhimento do sofrimento humano.',
        question: 'Distribua as ações entre as duas caixas:',
        didacticExplanation: 'Máquinas contam e separam frascos em alta velocidade; estar ao lado de alguém que sofre é um ato de puro amor humano.',
        classifierItems: [
          { id: 'c9_1', text: 'Separar frascos de remédios defeituosos a 300 frascos por minuto', icon: '💊', correctCategory: 'machine' },
          { id: 'c9_2', text: 'Refletir sobre o sentido da vida, arte e o que é ser honesto', icon: '📖', correctCategory: 'human' },
          { id: 'c9_3', text: 'Mapear o fundo do mar a 4.000 metros por meses sem respirar ar', icon: '🌊', correctCategory: 'machine' },
          { id: 'c9_4', text: 'Segurar a mão de alguém querido em um momento de dor e perda', icon: '🤍', correctCategory: 'human' }
        ]
      },
      {
        id: 70,
        module: 6,
        phase: 9,
        type: 'classifier_drag',
        badge: 'A Grande Parceria',
        title: 'Classificador: A Aliança do Futuro',
        historicalContext: 'A harmonia perfeita entre a inteligência computacional e o coração humano.',
        question: 'Finalize a classificação suprema:',
        didacticExplanation: 'Parabéns! A máquina oferece a potência do cálculo e a precisão do trabalho; o ser humano oferece o propósito, a ética e o amor para transformar o mundo!',
        classifierItems: [
          { id: 'c10_1', text: 'Entregar força física incansável, velocidade e precisão de dados', icon: '⚡', correctCategory: 'machine' },
          { id: 'c10_2', text: 'Entregar propósito ético, empatia, sensibilidade e imaginação', icon: '💡', correctCategory: 'human' },
          { id: 'c10_3', text: 'Executar tarefas perigosas e repetitivas em escala global', icon: '🏭', correctCategory: 'machine' },
          { id: 'c10_4', text: 'Sonhar com um mundo melhor e educar as futuras gerações com afeto', icon: '🌍', correctCategory: 'human' }
        ]
      }
    ]
  ];

  constructor(private progress: ProgressReporter) {
    this.progress.fetchSessionState()?.subscribe({
      next: (session: any) => {
        if (session?.gameState && session.gameState !== '{}' && session.gameState !== '') {
          try {
            const parsed = JSON.parse(session.gameState);
            if (parsed && typeof parsed.module === 'number') {
              this.state = parsed;
              if (this.state.module > 6) {
                this.state.module = 6;
                this.state.phase = 9;
              }
            }
          } catch (e) {
            console.error('Error parsing session state', e);
          }
        }
        this.state$.next({ ...this.state });
      },
      error: () => {
        this.state$.next({ ...this.state });
      }
    });
  }

  getCurrentTask(): WorkEvolutionTask | null {
    if (this.state.module > 6) return null;
    return this.tasks[this.state.module]?.[this.state.phase] || null;
  }

  resetGame() {
    this.state = { module: 0, phase: 0, hearts: 3, deathCount: 0 };
    this.state$.next({ ...this.state });
  }

  submitAnswer(isCorrect: boolean): boolean {
    const reportLevelId = `work-evolution-m${this.state.module + 1}-p${this.state.phase + 1}`;
    const reportFase = this.state.module * 10 + this.state.phase;

    if (isCorrect) {
      const isLastModule = this.state.module === 6;
      const isLastPhase = this.state.phase === 9;
      const isLastLevel = isLastModule && isLastPhase;

      if (isLastLevel) {
        this.state.module++; // will be 7 (game won)
      } else if (isLastPhase) {
        this.state.module++;
        this.state.phase = 0;
        this.state.hearts = 3; // Refill hearts on new module
      } else {
        this.state.phase++;
      }

      this.state$.next({ ...this.state });

      this.progress.report({
        levelId: reportLevelId,
        fase: reportFase,
        result: 'success',
        attempts: 1,
        timestamp: new Date().toISOString(),
        isLastLevel: isLastLevel,
        score: this.score,
        gameState: JSON.stringify(this.state)
      });
      return true;
    } else {
      this.state.hearts--;

      if (this.state.hearts <= 0) {
        // 3 hearts lost -> reset current module
        this.state.deathCount++;
        this.state.hearts = 3;
        this.state.phase = 0;
      }

      this.state$.next({ ...this.state });

      this.progress.report({
        levelId: reportLevelId,
        fase: reportFase,
        result: 'failure',
        attempts: 1,
        timestamp: new Date().toISOString(),
        isLastLevel: false,
        score: this.score,
        gameState: JSON.stringify(this.state)
      });
      return false;
    }
  }
}

