import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface RoboticsTask {
  id: number;
  module: number;
  phase: number;
  category: string;
  badge: string;
  title: string;
  scenario: string;
  details?: { label: string; value: string; icon?: string }[];
  codeBlock?: string[];
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
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

  // 5 Modules x 10 Tasks = 50 Tasks
  public tasks: RoboticsTask[][] = [
    // MÓDULO 1: Linha de Montagem Industrial & Sequenciamento Lógico
    [
      {
        id: 1,
        module: 0,
        phase: 0,
        category: 'Linha de Montagem',
        badge: 'Veículo Elétrico',
        title: 'Montagem Automatizada de Chassi Elétrico',
        scenario: 'Uma fábrica 100% robotizada precisa montar a base de um carro elétrico sem intervenção manual. As estações de trabalho utilizam braços mecânicos industriais e solda a laser.',
        details: [
          { label: 'Peça Base', value: 'Chassi de Alumínio Reforçado', icon: '🚗' },
          { label: 'Componente Crítico', value: 'Pacote de Baterias de 400V', icon: '🔋' },
          { label: 'Exigência Técnica', value: 'Instalação elétrica antes da vedação inferior', icon: '⚡' }
        ],
        question: 'Qual é a sequência lógica correta da esteira automatizada para garantir segurança?',
        options: [
          { id: 'a', text: '1. Soldagem do Chassi → 2. Instalação da Bateria → 3. Conexão do Chicote Elétrico → 4. Teste de Carga e Vedação', isCorrect: true },
          { id: 'b', text: '1. Teste de Carga e Vedação → 2. Instalação da Bateria → 3. Soldagem do Chassi → 4. Conexão do Chicote', isCorrect: false },
          { id: 'c', text: '1. Instalação da Bateria → 2. Soldagem do Chassi → 3. Teste de Carga → 4. Conexão do Chicote Elétrico', isCorrect: false },
          { id: 'd', text: '1. Conexão do Chicote Elétrico → 2. Vedação → 3. Soldagem do Chassi → 4. Instalação da Bateria', isCorrect: false }
        ],
        explanation: 'A estrutura mecânica (chassi) deve ser soldada primeiro; em seguida acomoda-se a bateria e os cabos de alta tensão; por fim, realiza-se o teste elétrico e a vedação hermética protetora.'
      },
      {
        id: 2,
        module: 0,
        phase: 1,
        category: 'Linha de Montagem',
        badge: 'Nanotecnologia',
        title: 'Fabricação Automatizada de Microchips (3nm)',
        scenario: 'Em uma sala limpa de semicondutores, robôs de litografia ultravioleta extrema (EUV) produzem wafers de silício com precisão atômica.',
        details: [
          { label: 'Material', value: 'Disco de Silício Cristalino (Wafer)', icon: '💿' },
          { label: 'Contaminação Máx.', value: 'Zero partículas de poeira', icon: '🛡️' }
        ],
        question: 'Qual ordem de etapas o sistema SCADA da fábrica deve disparar?',
        options: [
          { id: 'a', text: 'Polimento Químico → Deposição de Filme → Fotolitografia UV → Gravação e Dopagem → Encapsulamento', isCorrect: true },
          { id: 'b', text: 'Encapsulamento → Gravação → Polimento Químico → Deposição de Filme → Fotolitografia UV', isCorrect: false },
          { id: 'c', text: 'Fotolitografia UV → Encapsulamento → Polimento Químico → Deposição de Filme → Gravação', isCorrect: false },
          { id: 'd', text: 'Deposição de Filme → Encapsulamento → Polimento Químico → Gravação e Dopagem → Fotolitografia', isCorrect: false }
        ],
        explanation: 'O disco é polido e coberto por um filme fino antes de receber a luz UV que desenha os circuitos. Depois da gravação dos transistores, ele é fatiado e encapsulado.'
      },
      {
        id: 3,
        module: 0,
        phase: 2,
        category: 'Linha de Montagem',
        badge: 'Aeroespacial',
        title: 'Integração de Satélite CubeSat',
        scenario: 'Um nanossatélite universitário está sendo montado por robôs para garantir isolamento eletrostático antes do lançamento em órbita baixa.',
        details: [
          { label: 'Missão', value: 'Monitoramento de Desmatamento da Amazônia', icon: '🛰️' },
          { label: 'Sub-sistemas', value: 'Painéis Solares, Antena UHF, Bateria e Câmera RGB', icon: '📡' }
        ],
        question: 'Para evitar curto-circuito na placa-mãe durante o acoplamento robótico, qual deve ser a ordem?',
        options: [
          { id: 'a', text: 'Fixar Placa-mãe no Chassi → Conectar Câmera/Sensores → Acoplar Bateria com Trava Desligada → Fixar Painéis Solares', isCorrect: true },
          { id: 'b', text: 'Ligar Bateria com Carga Máxima → Conectar Sensores com Placa Energizada → Parafusar Chassi → Painéis Solares', isCorrect: false },
          { id: 'c', text: 'Colocar Painéis Solares no Sol → Ligar Cabos ao Vivo → Parafusar no Chassi → Instalar Câmera', isCorrect: false },
          { id: 'd', text: 'Instalar Bateria Aberta → Fixar Painéis Solares → Testar no Vácuo → Encaixar Placa-mãe por Último', isCorrect: false }
        ],
        explanation: 'Equipamentos aeroespaciais exigem que a eletrônica e os sensores estejam estruturados e aterrados antes que a fonte de energia (baterias) seja integrada de forma segura e desligada.'
      },
      {
        id: 4,
        module: 0,
        phase: 3,
        category: 'Linha de Montagem',
        badge: 'Biotecnologia',
        title: 'Manufatura de Prótese Biônica Inteligente',
        scenario: 'Uma linha de braços robóticos fabrica próteses de mão mioelétricas acionadas por sinais musculares do usuário.',
        details: [
          { label: 'Sensores', value: 'Eletrodos Mioelétricos de Superfície (EMG)', icon: '🦾' },
          { label: 'Atuadores', value: 'Micro-servomotores com redução planetária', icon: '⚙️' }
        ],
        question: 'Em que sequência a célula robótica deve proceder para montar os dedos articulados?',
        options: [
          { id: 'a', text: 'Impressão da Estrutura de Titânio → Instalação dos Tendões e Motores → Calibração de Força → Capa de Silicone Protetora', isCorrect: true },
          { id: 'b', text: 'Capa de Silicone Protetora → Impressão de Titânio → Calibração de Força → Instalação dos Motores', isCorrect: false },
          { id: 'c', text: 'Calibração de Força sem Motores → Capa de Silicone → Instalação dos Tendões → Estrutura de Titânio', isCorrect: false },
          { id: 'd', text: 'Instalação dos Tendões no Ar → Capa de Silicone → Impressão da Estrutura → Teste com Usuário', isCorrect: false }
        ],
        explanation: 'Não é possível instalar motores sem esqueleto físico (titânio), e a calibração de força só pode ser feita com os motores conectados, antes de selar a prótese com silicone protetor.'
      },
      {
        id: 5,
        module: 0,
        phase: 4,
        category: 'Linha de Montagem',
        badge: 'Logística',
        title: 'Célula de Montagem de Drone de Entrega',
        scenario: 'Drones hexacópteros autônomos para transporte de medicamentos em regiões isoladas estão na linha de montagem.',
        details: [
          { label: 'Componentes', value: 'Frame de Carbono, 6 Motores Brushless, ESCs, GPS e Bússola', icon: '🚁' }
        ],
        question: 'Qual etapa NÃO PODE acontecer antes de os Controladores Eletrônicos de Velocidade (ESCs) serem instalados?',
        options: [
          { id: 'a', text: 'Ligar e testar a rotação dos motores elétricos Brushless', isCorrect: true },
          { id: 'b', text: 'Parafusar o trem de pouso de fibra de carbono', isCorrect: false },
          { id: 'c', text: 'Pintar o logotipo da equipe de resgate no frame', isCorrect: false },
          { id: 'd', text: 'Instalar a gaveta de transporte de vacinas', isCorrect: false }
        ],
        explanation: 'Motores elétricos brushless não funcionam com corrente contínua direta; eles dependem exclusivamente dos ESCs para converter energia em pulsos trifásicos sincronizados.'
      },
      {
        id: 6,
        module: 0,
        phase: 5,
        category: 'Linha de Montagem',
        badge: 'Dispositivos Móveis',
        title: 'Montagem Automatizada de Smartphones',
        scenario: 'A esteira de alta velocidade monta 30 telas de smartphone por minuto utilizando visão computacional e braços SCARA.',
        details: [
          { label: 'Gargalo Identificado', value: 'Braço robótico colando tela sobre bateria descarregada sem teste', icon: '📱' }
        ],
        question: 'Onde ocorreu o erro de sequenciamento no processo automatizado?',
        options: [
          { id: 'a', text: 'A vedação adesiva da tela ocorreu antes da bancada de teste funcional de componentes internos', isCorrect: true },
          { id: 'b', text: 'A tela foi limpa com soprador ionizado antes da montagem', isCorrect: false },
          { id: 'c', text: 'A câmera foi parafusada antes da carcaça externa ser fechada', isCorrect: false },
          { id: 'd', text: 'O chip NFC foi posicionado próximo à tampa traseira', isCorrect: false }
        ],
        explanation: 'Se a tela OLED for selada com cola impermeável antes dos testes elétricos de placa e bateria, qualquer falha interna inutilizará o aparelho inteiro, gerando refugo.'
      },
      {
        id: 7,
        module: 0,
        phase: 6,
        category: 'Linha de Montagem',
        badge: 'Energia Limpa',
        title: 'Automatização de Módulos Fotovoltaicos',
        scenario: 'Robôs stringer soldam células solares de silício policristalino em trilhas conectadas para formar painéis de 500W.',
        details: [
          { label: 'Processo Crítico', value: 'Laminação a vácuo com EVA e vidro temperado', icon: '☀️' }
        ],
        question: 'Em que momento a laminação térmica com filme EVA deve ser disparada?',
        options: [
          { id: 'a', text: 'Após a soldagem das trilhas de células e inspeção por eletroluminescência (raio-X)', isCorrect: true },
          { id: 'b', text: 'Antes de posicionar as células solares sobre a esteira', isCorrect: false },
          { id: 'c', text: 'Depois de parafusar a moldura de alumínio externa', isCorrect: false },
          { id: 'd', text: 'Durante o transporte final na carreta de entrega', isCorrect: false }
        ],
        explanation: 'A laminação funde o vidro e as células em bloco sólido irreversível. Por isso, a inspeção de microfissuras por eletroluminescência precisa ocorrer obrigatoriamente antes da fusão.'
      },
      {
        id: 8,
        module: 0,
        phase: 7,
        category: 'Linha de Montagem',
        badge: 'Robótica Doméstica',
        title: 'Linha de Montagem de Robôs Aspiradores',
        scenario: 'O robô aspirador precisa de sensores infravermelhos antiqueda nas bordas inferiores para não rolar escadas.',
        details: [
          { label: 'Falha de Montagem', value: 'Robô caindo no primeiro degrau durante teste de fábrica', icon: '🧹' }
        ],
        question: 'Ao investigar a telemetria do teste, qual falha de sequenciamento foi detectada?',
        options: [
          { id: 'a', text: 'A calibração dos sensores de desnível foi executada com a esteira nivelada sem simular degraus', isCorrect: true },
          { id: 'b', text: 'O motor de sucção tinha potência acima de 2000 Pa', isCorrect: false },
          { id: 'c', text: 'As cerdas giratórias eram feitas de nylon flexível', isCorrect: false },
          { id: 'd', text: 'A bateria de lítio foi carregada a 100% antes do envio', isCorrect: false }
        ],
        explanation: 'Calibrar sensores de abismo/queda em superfície totalmente plana faz com que o robô aprenda o chão plano como leitura segura, falhando ao detectar desníveis reais.'
      },
      {
        id: 9,
        module: 0,
        phase: 8,
        category: 'Linha de Montagem',
        badge: 'Turbinas Eólicas',
        title: 'Pás de Gerador Eólico em Resina de Vidro',
        scenario: 'Robôs gantry de 60 metros aplicam camadas de fibra e infusão de resina sob vácuo em pás de energia eólica offshore.',
        details: [
          { label: 'Dimensão', value: 'Pá de 85 metros de comprimento', icon: '💨' }
        ],
        question: 'Qual etapa garante que não haverá bolhas de ar enfraquecendo a estrutura interna?',
        options: [
          { id: 'a', text: 'Desgaseificação e teste de pressão negativa de vácuo antes da injeção da resina', isCorrect: true },
          { id: 'b', text: 'Pintura externa vermelha na ponta da pá', isCorrect: false },
          { id: 'c', text: 'Instalação do sensor de vento anenômetro na base', isCorrect: false },
          { id: 'd', text: 'Polimento manual das pontas com lixa d\'água', isCorrect: false }
        ],
        explanation: 'O processo de infusão por vácuo remove todo o ar entre os tecidos de fibra de vidro antes da entrada da resina, garantindo rigidez mecânica máxima contra tempestades.'
      },
      {
        id: 10,
        module: 0,
        phase: 9,
        category: 'Linha de Montagem',
        badge: 'Vacinas & Saúde',
        title: 'Envasamento Automatizado de Medicamentos',
        scenario: 'Robôs delta operam dentro de cabine estéril envasando frascos de vacina com dosagem micrométrica.',
        details: [
          { label: 'Velocidade', value: '300 frascos por minuto', icon: '💉' }
        ],
        question: 'Qual é o fluxo à prova de contaminação microbiológica que os robôs devem seguir?',
        options: [
          { id: 'a', text: 'Esterilização por Calor Seco → Dosagem Líquida → Aplicação da Rolha de Borracha → Lacração com Alumínio → Inspeção por Câmera', isCorrect: true },
          { id: 'b', text: 'Dosagem Líquida → Esterilização Térmica a 250°C do Líquido → Lacração → Aplicação da Rolha', isCorrect: false },
          { id: 'c', text: 'Lacração com Alumínio → Dosagem com Agulha Furando o Metal → Esterilização com Pano', isCorrect: false },
          { id: 'd', text: 'Aplicação da Rolha → Dosagem por Cima → Lavagem com Sabão → Inspeção Visual', isCorrect: false }
        ],
        explanation: 'O frasco deve ser esterilizado antes do líquido entrar. Uma vez envasado, a rolha de vedação fecha o frasco imediatamente, sendo travada com anel de alumínio inviolável.'
      }
    ],

    // MÓDULO 2: Sensores e Lógica Condicional SE / ENTÃO
    [
      {
        id: 11,
        module: 1,
        phase: 0,
        category: 'Sensores & Atuadores',
        badge: 'Rover Marciano',
        title: 'Navegação em Terreno Rochoso',
        scenario: 'O Rover está explorando a cratera Jezero em Marte. O tempo de envio de comando da Terra é de 14 minutos, então ele precisa decidir de forma 100% autônoma.',
        details: [
          { label: 'Sensor Ultrassônico Dianteiro', value: '18 cm (Rocha pontiaguda)', icon: '📡' },
          { label: 'Inclinômetro Giroscópico', value: 'Inclinação segura (3°)', icon: '🧭' },
          { label: 'Sensor de Linha Térmica', value: 'Passagem livre à Esquerda', icon: '⬅️' }
        ],
        question: 'Com base no firmware `SE (distancia_frente < 30cm) ENTÃO`, qual ação lógica deve ser disparada?',
        options: [
          { id: 'a', text: 'Parar motores dianteiros → Girar 45° para a Esquerda → Retomar avanço a 0,5 m/s', isCorrect: true },
          { id: 'b', text: 'Acelerar velocidade máxima à frente para empurrar a rocha', isCorrect: false },
          { id: 'c', text: 'Desligar todos os sensores e entrar em modo de hibernação profunda', isCorrect: false },
          { id: 'd', text: 'Girar continuamente em 360° sem sair do lugar', isCorrect: false }
        ],
        explanation: 'Com obstáculo crítico a menos de 30 cm, a prioridade máxima é frenagem para evitar impacto, seguida de rotação para o lado identificado como livre pelos sensores laterais.'
      },
      {
        id: 12,
        module: 1,
        phase: 1,
        category: 'Sensores & Atuadores',
        badge: 'AGV Hospitalar',
        title: 'Veículo Autônomo em Corredor de UTI',
        scenario: 'Um robô de transporte hospitalar autônomo está levando medicamentos urgentes pela rota central.',
        details: [
          { label: 'Sensor LiDAR 360°', value: 'Pessoa cruzando a 1,2 metro na frente', icon: '🚶' },
          { label: 'Sensor de Fita Magnética', value: 'Trilha do chão alinhada (Erro = 0)', icon: '🧲' }
        ],
        question: 'Qual instrução condicional respeita o protocolo de segurança hospitalar?',
        options: [
          { id: 'a', text: 'SE (obstaculo_dinamico < 2m) ENTÃO { frear_suave(); acender_led_azul_aviso(); aguardar_desobstrucao(); }', isCorrect: true },
          { id: 'b', text: 'SE (obstaculo_dinamico < 2m) ENTÃO { tocar_sirene_120dB(); acelerar_para_desviar(); }', isCorrect: false },
          { id: 'c', text: 'SE (trilha_alinhada) ENTÃO { ignorar_sensores_lidar(); continuar_sem_parar(); }', isCorrect: false },
          { id: 'd', text: 'SE (pessoa_detectada) ENTÃO { dar_re_em_velocidade_maxima(); }', isCorrect: false }
        ],
        explanation: 'Em ambiente hospitalar, o robô deve desacelerar suavemente sem ruídos estridentes que assustem pacientes, aguardando a passagem da pessoa enquanto sinaliza visualmente.'
      },
      {
        id: 13,
        module: 1,
        phase: 2,
        category: 'Sensores & Atuadores',
        badge: 'Braço Soldador',
        title: 'Soldagem Automatizada de Tubulações de Petróleo',
        scenario: 'Um manipulador robótico de 6 eixos está soldando flanges em alta temperatura.',
        details: [
          { label: 'Sensor Pirométrico Óptico', value: 'Temperatura na tocha = 1.650 °C (Limite: 1.400 °C)', icon: '🔥' },
          { label: 'Sensor de Fluxo de Gás Argônio', value: 'Vazão Normal de Proteção', icon: '💨' }
        ],
        question: 'O controlador do braço identifica o superaquecimento. Qual é a conduta do atuador?',
        options: [
          { id: 'a', text: 'SE (temperatura > limite) ENTÃO { cortar_arco_eletrico(); afastar_tocha(50mm); acionar_resfriamento(); }', isCorrect: true },
          { id: 'b', text: 'SE (temperatura > limite) ENTÃO { aumentar_potencia_eletrica(); soldar_mais_rapido(); }', isCorrect: false },
          { id: 'c', text: 'SE (temperatura > limite) ENTÃO { cortar_fluxo_de_gas_argonio_imediatamente(); }', isCorrect: false },
          { id: 'd', text: 'SE (temperatura > limite) ENTÃO { reiniciar_computador_do_robo(); }', isCorrect: false }
        ],
        explanation: 'Para evitar derretimento da tocha de solda e deformação do metal base, deve-se interromper o arco elétrico instantaneamente e recuar o cabeçote robótico com refrigeração ativa.'
      },
      {
        id: 14,
        module: 1,
        phase: 3,
        category: 'Sensores & Atuadores',
        badge: 'Drone Agrícola',
        title: 'Pulverização Seletiva em Lavoura de Milho',
        scenario: 'Um drone autônomo sobrevoa plantações analisando índice de vegetação por câmera multiespectral.',
        details: [
          { label: 'Câmera NDVI', value: 'Detectada praga na coordenada (X:45, Y:89)', icon: '🌿' },
          { label: 'Sensor de Vento Pitot', value: 'Rajada lateral de 45 km/h (Limite de deriva: 25 km/h)', icon: '💨' }
        ],
        question: 'Com base nas regras de preservação ambiental e evitar contaminação por deriva do vento:',
        options: [
          { id: 'a', text: 'SE (vento > 25 km/h) ENTÃO { suspender_bicos_pulverizacao(); registrar_ponto_gps(); retornar_base(); }', isCorrect: true },
          { id: 'b', text: 'SE (vento > 25 km/h) ENTÃO { abrir_todos_os_bicos_no_maximo_para_compensar(); }', isCorrect: false },
          { id: 'c', text: 'SE (praga_detectada) ENTÃO { ignorar_vento_e_pulverizar_assim_mesmo(); }', isCorrect: false },
          { id: 'd', text: 'SE (vento_alto) ENTÃO { desligar_motores_do_drone_em_pleno_voo(); }', isCorrect: false }
        ],
        explanation: 'Pulverizar com vento forte espalha defensivos para rios e áreas vizinhas (deriva química). O robô deve salvar a coordenada geográfica da praga e abortar a aspersão.'
      },
      {
        id: 15,
        module: 1,
        phase: 4,
        category: 'Sensores & Atuadores',
        badge: 'Seguidor de Linha',
        title: 'Calibração PID de Robô Seguidor de Pista',
        scenario: 'Robô de transporte em fábrica segue uma faixa preta no piso branco usando dois sensores infravermelhos (Sensor Esquerdo e Sensor Direito).',
        details: [
          { label: 'Sensor Esquerdo (IR)', value: 'Detecta BRANCO (Refletância 95%)', icon: '⚪' },
          { label: 'Sensor Direito (IR)', value: 'Detecta PRETO (Refletância 12%)', icon: '⚫' }
        ],
        question: 'O robô está saindo da linha para a esquerda. Qual ajuste diferencial nos motores deve ser feito?',
        options: [
          { id: 'a', text: 'Acelerar Motor Esquerdo e Frear/Reduzir Motor Direito para curva corretiva à Direita', isCorrect: true },
          { id: 'b', text: 'Acelerar Motor Direito e Parar Motor Esquerdo para forçar curva à Esquerda', isCorrect: false },
          { id: 'c', text: 'Parar ambos os motores e acionar buzina de socorro', isCorrect: false },
          { id: 'd', text: 'Inverter os motores para andar de marcha à ré em linha reta', isCorrect: false }
        ],
        explanation: 'Para virar à direita e centralizar a linha, o motor da esquerda precisa girar mais rápido que o da direita (tração diferencial típica de robôs móveis).'
      },
      {
        id: 16,
        module: 1,
        phase: 5,
        category: 'Sensores & Atuadores',
        badge: 'Carro Autônomo',
        title: 'Frenagem Autônoma de Emergência (AEB)',
        scenario: 'Um veículo autônomo está em via pública a 50 km/h quando uma bola de futebol entra na pista repentinamente.',
        details: [
          { label: 'Radar de Onda Milimétrica', value: 'Objeto em aproximação a 15 metros', icon: '📡' },
          { label: 'Câmera de Visão Computacional', value: 'Identificada silhueta de criança correndo atrás da bola', icon: '🏃' }
        ],
        question: 'Qual deve ser o tempo de resposta e prioridade do algoritmo de controle?',
        options: [
          { id: 'a', text: 'Acionar imediatamente freio regenerativo + ABS nas 4 rodas e tensionar cintos de segurança dos passageiros', isCorrect: true },
          { id: 'b', text: 'Esperar 3 segundos para confirmar se a criança realmente vai alcançar a bola', isCorrect: false },
          { id: 'c', text: 'Tocar a buzina e manter a velocidade de 50 km/h', isCorrect: false },
          { id: 'd', text: 'Desligar o sistema autônomo e pedir que o motorista assuma o volante imediatamente', isCorrect: false }
        ],
        explanation: 'Em situações com pedestres em risco de atropelamento, o sistema autônomo deve agir em milissegundos com frenagem máxima pré-colisão, sem tempo hábil para transferência humana.'
      },
      {
        id: 17,
        module: 1,
        phase: 6,
        category: 'Sensores & Atuadores',
        badge: 'Separador Óptico',
        title: 'Triagem Automatizada de Reciclagem',
        scenario: 'Uma esteira de lixo eletrônico passa por sensor infravermelho de espectroscopia que identifica tipos de polímeros e metais.',
        details: [
          { label: 'Leitura Espectral', value: 'Material identificado: Cobre Puro (Cu) de alto valor comercial', icon: '🥉' },
          { label: 'Posição na Esteira', value: 'A 20 cm do bico de ar comprimido nº 4', icon: '💨' }
        ],
        question: 'Qual fórmula de temporização o atuador pneumático deve computar para ejetar a peça?',
        options: [
          { id: 'a', text: 'Tempo_Disparo = Distância (20cm) / Velocidade_Esteira (m/s)', isCorrect: true },
          { id: 'b', text: 'Tempo_Disparo = Peso_do_Cobre * Tamanho_da_Esteira', isCorrect: false },
          { id: 'c', text: 'Tempo_Disparo = Sempre 10 segundos fixos independente da velocidade', isCorrect: false },
          { id: 'd', text: 'Tempo_Disparo = Temperatura_do_Ar comprimido / 2', isCorrect: false }
        ],
        explanation: 'Em automação de esteiras com bicos ejetores de ar, o instante exato do sopro é o tempo cinemático de deslocamento da peça da câmera até o bico (t = d / v).'
      },
      {
        id: 18,
        module: 1,
        phase: 7,
        category: 'Sensores & Atuadores',
        badge: 'Robô Submarino',
        title: 'Inspeção de Tubulações no Fundo do Mar',
        scenario: 'Um veículo submarino autônomo (AUV) inspeciona cabos de fibra óptica a 2.000 metros de profundidade no oceano.',
        details: [
          { label: 'Sensor de Pressão Hidrostática', value: '200 bar (Pressão normal de profundidade)', icon: '🌊' },
          { label: 'Sensor de Umidade Interna do Casco', value: 'ATENÇÃO: Gotas de água detectadas no compartimento de baterias!', icon: '⚠️' }
        ],
        question: 'Qual subrotina crítica de emergência deve sobrepor qualquer outra tarefa?',
        options: [
          { id: 'a', text: 'Despressurizar tanques de lastro, soltar pesos de emergência e subir imediatamente à superfície', isCorrect: true },
          { id: 'b', text: 'Ligar holofotes máximos e continuar tirando fotos do cabo', isCorrect: false },
          { id: 'c', text: 'Aumentar a velocidade das hélices e descer para 3.000 metros', isCorrect: false },
          { id: 'd', text: 'Ignorar o alerta, pois água do mar é rica em minerais condutores', isCorrect: false }
        ],
        explanation: 'Água salgada em contato com baterias de alta densidade energética causa curto-circuito catastrófico e incêndio químico. O AUV deve abortar a missão e emergir para resgate.'
      },
      {
        id: 19,
        module: 1,
        phase: 8,
        category: 'Sensores & Atuadores',
        badge: 'Braço Paletizador',
        title: 'Sensor de Torque e Célula de Carga em Armazém',
        scenario: 'Um robô paletizador ergue caixas de vidro cristal que pesam até 15 kg.',
        details: [
          { label: 'Célula de Carga da Garra', value: 'Peso medido: 48 kg (Carga triplicada acima do limite)', icon: '⚖️' },
          { label: 'Sensor de Vácuo das Ventosas', value: 'Vedação em 40% (Risco iminente de descolar no ar)', icon: '💨' }
        ],
        question: 'Qual é o comportamento seguro programado no PLC do braço?',
        options: [
          { id: 'a', text: 'Não elevar o braço mecânico, soltar a caixa no chão e emitir alerta sonoro de sobrepeso', isCorrect: true },
          { id: 'b', text: 'Girar o braço com força máxima para arremessar a caixa no caminhão', isCorrect: false },
          { id: 'c', text: 'Aumentar a velocidade para terminar antes que a ventosa solte', isCorrect: false },
          { id: 'd', text: 'Desligar a bomba de ar para a caixa cair de 2 metros de altura', isCorrect: false }
        ],
        explanation: 'Quando o peso excede a capacidade estrutural ou o vácuo da ventosa não é estanque, elevar a peça pode causar acidentes graves aos operadores ou quebra de maquinário.'
      },
      {
        id: 20,
        module: 1,
        phase: 9,
        category: 'Sensores & Atuadores',
        badge: 'Estufa Inteligente',
        title: 'Automação Climática Agrícola com IoT',
        scenario: 'Uma estufa hidropônica automatizada controla janelas zenitais, névoa e exaustores para cultivo de morangos.',
        details: [
          { label: 'Sensor DHT22 (Umidade)', value: '88% (Muito alta, risco de fungos)', icon: '💧' },
          { label: 'Sensor de Temperatura', value: '34 °C (Acima do ideal de 24°C)', icon: '🌡️' },
          { label: 'Sensor Pluviométrico Externo', value: 'SEM CHUVA (Céu limpo)', icon: '☀️' }
        ],
        question: 'Qual combinação de atuadores resolve simultaneamente o calor e o excesso de umidade?',
        options: [
          { id: 'a', text: 'Abrir janelas do teto + Ligar ventiladores exaustores + Desligar nebulização de água', isCorrect: true },
          { id: 'b', text: 'Fechar todas as janelas + Ligar aquecedores elétricos + Ligar mais água', isCorrect: false },
          { id: 'c', text: 'Apagar as luzes da estufa e trancar as portas por 24 horas', isCorrect: false },
          { id: 'd', text: 'Ligar aspersores de água fria com janelas lacradas', isCorrect: false }
        ],
        explanation: 'Para resfriar e secar a estufa sem chuva lá fora, abrem-se os respiradouros e ativam-se os exaustores para expelir o ar quente e úmido acumulado, cortando a irrigação por névoa.'
      }
    ],

    // MÓDULO 3: Inspetor de Código & Depuração de Bugs
    [
      {
        id: 21,
        module: 2,
        phase: 0,
        category: 'Depuração de Código',
        badge: 'Loop Infinito',
        title: 'Robô Travado no Canto da Parede',
        scenario: 'O robô de limpeza do laboratório entrou em um canto e ficou batendo na parede sem sair do lugar.',
        codeBlock: [
          '1: ENQUANTO (sensor_frente == BLOQUEADO) FAÇA',
          '2:   girar_para_direita(10_graus)',
          '3:   // Falta ler o sensor novamente dentro do loop!',
          '4: FIM_ENQUANTO',
          '5: avancar()'
        ],
        question: 'Por que o robô nunca sai do loop de rotação?',
        options: [
          { id: 'a', text: 'A variável `sensor_frente` nunca é re-lida dentro do laço de repetição, mantendo o valor travado', isCorrect: true },
          { id: 'b', text: 'Porque o motor da direita está com a voltagem invertida na linha 5', isCorrect: false },
          { id: 'c', text: 'Porque o comando `girar_para_direita` desliga a placa-mãe', isCorrect: false },
          { id: 'd', text: 'Porque o robô não tem memória RAM suficiente para 10 graus', isCorrect: false }
        ],
        explanation: 'Em lógica de programação para robôs, se você não atualizar a leitura do sensor dentro do bloco de repetição `ENQUANTO`, a condição permanecerá verdadeira eternamente (loop infinito).'
      },
      {
        id: 22,
        module: 2,
        phase: 1,
        category: 'Depuração de Código',
        badge: 'Operador Invertido',
        title: 'Portão Automático Esmagando Caixas',
        scenario: 'Um portão de segurança de armazém deve fechar apenas quando a área estiver completamente desocupada.',
        codeBlock: [
          '1: SE (sensor_presenca == VERDADEIRO) ENTÃO',
          '2:   fechar_portao_hidraulico()',
          '3: SENÃO',
          '4:   manter_portao_aberto()',
          '5: FIM_SE'
        ],
        question: 'Onde está o erro grave de lógica que causa acidentes no portão?',
        options: [
          { id: 'a', text: 'O operador condicional está invertido: o portão fecha quando detecta alguém em vez de manter aberto!', isCorrect: true },
          { id: 'b', text: 'A palavra `SENÃO` deveria ser escrita em inglês (`ELSE`)', isCorrect: false },
          { id: 'c', text: 'O sensor de presença deveria ser substituído por um termômetro', isCorrect: false },
          { id: 'd', text: 'Falta colocar um ponto e vírgula na linha 5', isCorrect: false }
        ],
        explanation: 'A lógica correta de segurança em portas automáticas é: `SE (sensor == VERDADEIRO) ENTÃO manter_aberto() SENÃO fechar_portao()`. O código fez exatamente o oposto!'
      },
      {
        id: 23,
        module: 2,
        phase: 2,
        category: 'Depuração de Código',
        badge: 'Erro de Escopo',
        title: 'Elevador de Carga Subindo sem Parada',
        scenario: 'O elevador de pallets ultrapassou o 3º andar e quase bateu no teto da fábrica.',
        codeBlock: [
          '1: andar_atual = 1',
          '2: ENQUANTO (andar_atual != 3) FAÇA',
          '3:   subir_motor(1_metro)',
          '4:   // O contador `andar_atual` não é incrementado aqui!',
          '5: FIM_ENQUANTO',
          '6: frear_motor()'
        ],
        question: 'Qual linha precisa ser adicionada dentro do laço para o elevador saber que mudou de andar?',
        options: [
          { id: 'a', text: '`andar_atual = ler_sensor_de_andar()` logo após a linha 3', isCorrect: true },
          { id: 'b', text: '`subir_motor(100_metros)` na linha 1', isCorrect: false },
          { id: 'c', text: '`andar_atual = 0` na linha 5', isCorrect: false },
          { id: 'd', text: '`apagar_luz_do_andar()` na linha 4', isCorrect: false }
        ],
        explanation: 'Sem atualizar a variável `andar_atual` com o sensor de fim de curso ou leitura de pavimento, a variável permanece valendo 1, e a condição `!= 3` continuará para sempre.'
      },
      {
        id: 24,
        module: 2,
        phase: 3,
        category: 'Depuração de Código',
        badge: 'Comparação Fraca',
        title: 'Termostato de Cauterização Robótica',
        scenario: 'Um sistema de corte térmico precisa atingir exatamente entre 200°C e 220°C para selar plástico biodegradável.',
        codeBlock: [
          '1: temp = ler_sensor_temperatura()',
          '2: SE (temp > 200 OU temp < 220) ENTÃO',
          '3:   ativar_resistencia_aquecimento()',
          '4: FIM_SE'
        ],
        question: 'Por que o aquecedor fica ligado até queimar o plástico mesmo a 500°C?',
        options: [
          { id: 'a', text: 'O operador lógico `OU` torna a condição SEMPRE verdadeira para qualquer número!', isCorrect: true },
          { id: 'b', text: 'Porque o número 200 é maior que o número 220', isCorrect: false },
          { id: 'c', text: 'Porque o sensor lê a temperatura em Fahrenheit em vez de Celsius', isCorrect: false },
          { id: 'd', text: 'Porque falta ligar a ventoinha na linha 1', isCorrect: false }
        ],
        explanation: 'A expressão `(temp > 200 OU temp < 220)` é sempre verdadeira! Exemplo: 500°C é > 200 (verdade); 10°C é < 220 (verdade). Para definir um intervalo fechado, deve-se usar o operador `E` (`E lógico`).'
      },
      {
        id: 25,
        module: 2,
        phase: 4,
        category: 'Depuração de Código',
        badge: 'Ordem de Operações',
        title: 'Braço Robótico Soltando Peça no Vazio',
        scenario: 'O manipulador robótico pega uma caixa na bancada A e deveria deixá-la na bancada B.',
        codeBlock: [
          '1: mover_para(bancada_A)',
          '2: fechar_garra()',
          '3: abrir_garra()',
          '4: mover_para(bancada_B)',
          '5: comemorar_sucesso()'
        ],
        question: 'Por que a caixa cai e quebra na bancada A antes mesmo do robô se mover?',
        options: [
          { id: 'a', text: 'O comando `abrir_garra()` foi chamado na linha 3 antes de o robô se deslocar para a bancada B na linha 4', isCorrect: true },
          { id: 'b', text: 'Porque a garra não tem dedos de borracha antiderrapante', isCorrect: false },
          { id: 'c', text: 'Porque o comando `mover_para` só funciona de ré', isCorrect: false },
          { id: 'd', text: 'Porque falta ligar o Wi-Fi do braço mecânico na linha 2', isCorrect: false }
        ],
        explanation: 'Erro clássico de fluxo de execução sequencial (pipeline). A garra abriu imediatamente após fechar. O correto seria: `mover_para(B)` e só então `abrir_garra()`.'
      },
      {
        id: 26,
        module: 2,
        phase: 5,
        category: 'Depuração de Código',
        badge: 'Conversão de Unidade',
        title: 'Sonda Marciana Mars Climate Orbiter Bug',
        scenario: 'Inspirado no erro real da NASA em 1999: O algoritmo do robô calcula o impulso de frenagem em Newton, mas a biblioteca recebe Libras-força.',
        codeBlock: [
          '1: forca_newtons = calcular_forca_frenagem() // Retorna 1000 N',
          '2: acionar_propulsor(forca_newtons) // Espera valor em Libras (lbf)',
          '3: // 1 Libra-força vale ~4.45 Newtons'
        ],
        question: 'O que aconteceu com a frenagem do robô devido à falta de conversão de unidades?',
        options: [
          { id: 'a', text: 'O robô freou com quase 4,5 vezes mais força do que o necessário, errando completamente o pouso', isCorrect: true },
          { id: 'b', text: 'O robô não se mexeu porque Newtons não existem no espaço', isCorrect: false },
          { id: 'c', text: 'O motor entrou em pane elétrica por excesso de combustível', isCorrect: false },
          { id: 'd', text: 'A gravidade do planeta se anulou com os cálculos', isCorrect: false }
        ],
        explanation: 'Passar 1.000 como argumento para uma função que espera libras aplicou 1.000 lbf (~4.450 N), ou seja, uma desaceleração extrema e descontrolada por falta de conversão de tipos/unidades.'
      },
      {
        id: 27,
        module: 2,
        phase: 6,
        category: 'Depuração de Código',
        badge: 'Filtro de Ruído',
        title: 'Leitura Falsa do Sensor Ultrassônico',
        scenario: 'O robô móvel fica dando solavancos e freando no ar mesmo com o corredor 100% vazio.',
        codeBlock: [
          '1: leitura = ler_ultrassonico()',
          '2: SE (leitura < 50) ENTÃO // Às vezes o sensor dá pico de eco com valor 0',
          '3:   frear_bruscamente()',
          '4: FIM_SE'
        ],
        question: 'Como os engenheiros de software eliminam esses picos de ruído elétrico?',
        options: [
          { id: 'a', text: 'Aplicar uma média móvel de 3 a 5 leituras antes de tomar a decisão de frenagem', isCorrect: true },
          { id: 'b', text: 'Aumentar a velocidade do robô para 100 km/h', isCorrect: false },
          { id: 'c', text: 'Desligar o sensor ultrassônico e usar uma bússola magnética', isCorrect: false },
          { id: 'd', text: 'Pintar o sensor com tinta spray preta para absorver som', isCorrect: false }
        ],
        explanation: 'Sensores físicos reais sofrem com ecos espúrios e interferências eletromagnéticas. O uso de filtros passa-baixa, média móvel ou medianas evita ações falsas por leituras corrompidas pontuais.'
      },
      {
        id: 28,
        module: 2,
        phase: 7,
        category: 'Depuração de Código',
        badge: 'Divisão por Zero',
        title: 'Cálculo de Consumo de Bateria do Drone',
        scenario: 'O computador de voo do drone travou durante a decolagem e caiu na grama.',
        codeBlock: [
          '1: distancia_percorrida = 0 // Robô acabou de ligar',
          '2: energia_gasta = 50 Joules',
          '3: eficiencia = energia_gasta / distancia_percorrida',
          '4: mostrar_no_painel(eficiencia)'
        ],
        question: 'Qual exceção matemática fatal paralisou o processador do drone?',
        options: [
          { id: 'a', text: 'Erro de Divisão por Zero na linha 3 (impossível dividir qualquer número por 0)', isCorrect: true },
          { id: 'b', text: 'Erro de raiz quadrada de número negativo na linha 1', isCorrect: false },
          { id: 'c', text: 'Erro de falta de memória RAM para guardar o número 50', isCorrect: false },
          { id: 'd', text: 'Erro de bateria fraca na linha 4', isCorrect: false }
        ],
        explanation: 'Na matemática e em qualquer processador computacional, a divisão por zero é uma operação indefinida que lança uma exceção de parada imediata (Crash / Kernel Panic).'
      },
      {
        id: 29,
        module: 2,
        phase: 8,
        category: 'Depuração de Código',
        badge: 'Condição de Corrida',
        title: 'Dois Robôs AGV na Mesma Encruzilhada',
        scenario: 'Dois robôs transportadores de caixas colidiram no cruzamento central de um centro de distribuição.',
        codeBlock: [
          '// Ambos os robôs executaram este código ao mesmo tempo:',
          '1: SE (cruzamento_livre == VERDADEIRO) ENTÃO',
          '2:   esperar(0.5_segundos) // Tempo de checagem do outro',
          '3:   ocupar_cruzamento()',
          '4: FIM_SE'
        ],
        question: 'Como resolver esse conflito concorrente de acesso ao mesmo recurso físico?',
        options: [
          { id: 'a', text: 'Implementar um semáforo digital (Mutex/Lock) com ordem de prioridade estrita de passagem', isCorrect: true },
          { id: 'b', text: 'Acelerar os dois robôs para ver qual chega primeiro na batida', isCorrect: false },
          { id: 'c', text: 'Remover os sensores e mandar os robôs andarem vendados', isCorrect: false },
          { id: 'd', text: 'Desligar a conexão de rede entre os dois robôs', isCorrect: false }
        ],
        explanation: 'Esse problema é chamado de "Condição de Corrida" (Race Condition). A solução em robótica e sistemas distribuídos é o uso de travas mútuas (Mutex) e gerenciamento de prioridade central.'
      },
      {
        id: 30,
        module: 2,
        phase: 9,
        category: 'Depuração de Código',
        badge: 'Transbordamento de Pilha',
        title: 'Busca em Labirinto com Recursão Infinita',
        scenario: 'O algoritmo de mapeamento SLAM do robô aspirador começou a esquentar o chip até desligar por superaquecimento.',
        codeBlock: [
          '1: FUNCAO explorar_sala(posicao):',
          '2:   mover_para(posicao)',
          '3:   retornar explorar_sala(posicao) // Chama a si mesma com o mesmo valor!',
          '4: FIM_FUNCAO'
        ],
        question: 'Qual é o defeito estrutural desta função recursiva?',
        options: [
          { id: 'a', text: 'Falta um caso base de parada e a chamada recursiva repete a mesma posição sem progresso', isCorrect: true },
          { id: 'b', text: 'Falta colocar o robô virado de costas para o sol', isCorrect: false },
          { id: 'c', text: 'A palavra `FUNCAO` não é aceita em robótica avançada', isCorrect: false },
          { id: 'd', text: 'O robô precisa de uma vassoura maior para funcionar', isCorrect: false }
        ],
        explanation: 'Toda função recursiva precisa obrigatoriamente de uma condição de término (caso base) e de avançar para um novo estado. Do contrário, esgota a memória de pilha (Stack Overflow).'
      }
    ],

    // MÓDULO 4: Indústria 4.0, IA e Decisão Ética Humano-Máquina
    [
      {
        id: 31,
        module: 3,
        phase: 0,
        category: 'Ética & Sociedade',
        badge: 'Cirurgia Robótica',
        title: 'Intervenção Cirúrgica Assistida por IA',
        scenario: 'Durante uma microcirurgia cardíaca guiada por braço robótico, a visão computacional detecta uma variação anatômica rara não prevista no prontuário do paciente.',
        details: [
          { label: 'IA Sugere', value: 'Manter incisão programada com margem de 1 mm', icon: '🤖' },
          { label: 'Cirurgião Humano', value: 'Percebe risco de romper vaso sanguíneo atípico', icon: '👨‍⚕️' }
        ],
        question: 'Segundo as normas internacionais de Robótica Médica e Cobots, quem detém a autoridade final?',
        options: [
          { id: 'a', text: 'O cirurgião humano deve assumir o controle manual imediatamente (Princípio Human-in-the-Loop)', isCorrect: true },
          { id: 'b', text: 'O robô deve ignorar o médico, pois computadores nunca erram cálculos mecânicos', isCorrect: false },
          { id: 'c', text: 'Deve-se desligar os aparelhos da sala e esperar o conselho de ética votar', isCorrect: false },
          { id: 'd', text: 'O robô deve acelerar a cirurgia para terminar em menos tempo', isCorrect: false }
        ],
        explanation: 'Em sistemas críticos de saúde e segurança da vida, a IA e a robótica são ferramentas de ampliação sensorial. A decisão ética e a autoridade de abortar são sempre do profissional humano.'
      },
      {
        id: 32,
        module: 3,
        phase: 1,
        category: 'Ética & Sociedade',
        badge: 'Impacto Social',
        title: 'Automação Total em Linha de Calçados',
        scenario: 'Uma fábrica substituiu 200 postos de costura manual repetitiva por 10 células robóticas de alta velocidade.',
        details: [
          { label: 'Ganho da Empresa', value: 'Aumento de 300% na produtividade e zero lesões por esforço repetitivo (LER)', icon: '📈' },
          { label: 'Desafio Social', value: '200 trabalhadores locais sem qualificação em programação ou mecânica', icon: '👥' }
        ],
        question: 'Qual é a política de responsabilidade social e corporativa recomendada na Indústria 4.0?',
        options: [
          { id: 'a', text: 'Criar programas de requalificação profissional (upskilling) para operação, manutenção e controle de qualidade dos robôs', isCorrect: true },
          { id: 'b', text: 'Proibir por lei qualquer tipo de máquina para que o trabalho continue sendo manual e cansativo', isCorrect: false },
          { id: 'c', text: 'Demitir todos sem aviso prévio e ignorar a comunidade local', isCorrect: false },
          { id: 'd', text: 'Fazer os trabalhadores competirem em velocidade contra os braços mecânicos', isCorrect: false }
        ],
        explanation: 'A automação deve libertar os seres humanos de trabalhos insalubres e perigosos. A transição justa exige capacitação para as novas funções de suporte tecnológico e supervisão.'
      },
      {
        id: 33,
        module: 3,
        phase: 2,
        category: 'Ética & Sociedade',
        badge: 'Privacidade & IA',
        title: 'Robôs com Câmeras em Espaços Públicos',
        scenario: 'Robôs autônomos de segurança patrulham praças públicas gravando rostos de todas as pessoas que passam.',
        details: [
          { label: 'Tecnologia', value: 'Reconhecimento Facial em Tempo Real conectado à nuvem', icon: '📹' },
          { label: 'Legislação', value: 'LGPD (Lei Geral de Proteção de Dados)', icon: '⚖️' }
        ],
        question: 'Qual medida garante a conformidade do robô com as leis de privacidade infantil e cidadania digital?',
        options: [
          { id: 'a', text: 'Processar dados na borda (Edge Computing) com anonimização/borramento automático de rostos sem guardar bancos biométricos', isCorrect: true },
          { id: 'b', text: 'Vender as imagens dos rostos dos cidadãos para empresas de publicidade', isCorrect: false },
          { id: 'c', text: 'Publicar ao vivo as imagens em redes sociais abertas para qualquer pessoa ver', isCorrect: false },
          { id: 'd', text: 'Guardar os dados biométricos de todas as crianças para sempre sem avisar os pais', isCorrect: false }
        ],
        explanation: 'A privacidade por padrão (Privacy by Design) exige que sistemas robóticos em locais públicos processem apenas detecção de anomalias sem armazenar identidades e dados pessoais desnecessários.'
      },
      {
        id: 34,
        module: 3,
        phase: 3,
        category: 'Ética & Sociedade',
        badge: 'Segurança Física',
        title: 'Cobots (Robôs Colaborativos) sem Grade de Proteção',
        scenario: 'Antigamente, robôs industriais pesados ficavam trancados em jaulas de aço. Hoje, Cobots trabalham ombro a ombro com humanos.',
        details: [
          { label: 'Norma ISO/TS 15066', value: 'Segurança para Robôs Colaborativos', icon: '🤝' },
          { label: 'Recurso de Proteção', value: 'Sensores de força nas juntas e superfícies macias arredondadas', icon: '🛡️' }
        ],
        question: 'O que o Cobot deve fazer obrigatoriamente se um humano encostar nele acidentalmente?',
        options: [
          { id: 'a', text: 'Parar instantaneamente o movimento com frenagem por desacoplamento mecânico de força', isCorrect: true },
          { id: 'b', text: 'Empurrar o humano com força para desobstruir o caminho', isCorrect: false },
          { id: 'c', text: 'Acelerar o movimento para tentar desviar da pessoa em alta velocidade', isCorrect: false },
          { id: 'd', text: 'Ignorar o contato físico até a peça cair no chão', isCorrect: false }
        ],
        explanation: 'A grande revolução dos robôs colaborativos (Cobots) é o monitoramento contínuo de torque em cada junta. Qualquer toque inesperado acima de limiares mínimos corta a força motriz na hora.'
      },
      {
        id: 35,
        module: 3,
        phase: 4,
        category: 'Ética & Sociedade',
        badge: 'Viés Algorítmico',
        title: 'Seleção Automatizada de Currículos por IA',
        scenario: 'Uma grande corporação treinou uma IA para triar engenheiros de automação analisando os contratados dos últimos 20 anos.',
        details: [
          { label: 'Problema Descoberto', value: 'A IA passou a rejeitar currículos excelentes de mulheres e minorias', icon: '⚠️' }
        ],
        question: 'Por que o robô de software tomou decisões discriminatórias?',
        options: [
          { id: 'a', text: 'Porque o banco de dados histórico do passado tinha preconceitos e a IA apenas replicou os padrões humanos antigos', isCorrect: true },
          { id: 'b', text: 'Porque computadores odeiam tecnologia inclusiva', isCorrect: false },
          { id: 'c', text: 'Porque o arquivo do currículo estava em formato PDF em vez de papel', isCorrect: false },
          { id: 'd', text: 'Porque o processador do servidor estava operando a 100°C', isCorrect: false }
        ],
        explanation: 'Inteligências Artificiais aprendem com dados históricos. Se o passado tinha preconceito ou falta de diversidade, a IA institucionaliza esse viés como regra sem auditoria humana contínua.'
      },
      {
        id: 36,
        module: 3,
        phase: 5,
        category: 'Ética & Sociedade',
        badge: 'Descarte e E-Lixo',
        title: 'Ciclo de Vida e Sustentabilidade de Robôs Velhos',
        scenario: 'Uma montadora automotiva comprou 50 robôs novos e precisa dar destino a 50 braços robóticos com 15 anos de uso.',
        details: [
          { label: 'Composição', value: 'Cobre, ímãs de neodímio, placas eletrônicas e alumínio fundido', icon: '♻️' }
        ],
        question: 'Qual é o destino correto desses equipamentos segundo a Economia Circular?',
        options: [
          { id: 'a', text: 'Remanufatura de peças, doação para centros de pesquisa/escolas técnicas e reciclagem certificada de metais pesados', isCorrect: true },
          { id: 'b', text: 'Jogar tudo em um terreno baldio ou queimar para tirar o cobre com fumaça tóxica', isCorrect: false },
          { id: 'c', text: 'Afundar os robôs no rio para servir de abrigo para peixes', isCorrect: false },
          { id: 'd', text: 'Enterrar no pátio da fábrica sem nenhum isolamento do solo', isCorrect: false }
        ],
        explanation: 'Equipamentos de automação contêm metais nobres e terras raras valiosas, além de componentes poluentes. O descarte ecológico correto envolve desmontagem técnica e reaproveitamento.'
      },
      {
        id: 37,
        module: 3,
        phase: 6,
        category: 'Ética & Sociedade',
        badge: 'Cibersegurança',
        title: 'Ataque Hacker a Redes de Automação (Stuxnet)',
        scenario: 'Um sistema de controle SCADA de uma usina hidrelétrica foi infectado por um malware que tenta acelerar as turbinas sem limites.',
        details: [
          { label: 'Alvo', value: 'Controladores Lógicos Programáveis (CLPs) industriais', icon: '💻' },
          { label: 'Risco', value: 'Ruptura física de tubulações de alta pressão', icon: '💥' }
        ],
        question: 'Qual princípio de arquitetura de segurança industrial protege a usina contra hackers?',
        options: [
          { id: 'a', text: 'Isolamento de rede com Air-Gap, redundância física de freios mecânicos e autenticação forte com chaveiro criptográfico', isCorrect: true },
          { id: 'b', text: 'Conectar todos os robôs industriais ao Wi-Fi público sem senha para facilitar acesso', isCorrect: false },
          { id: 'c', text: 'Usar a senha padrão `admin123` em todos os computadores de comando', isCorrect: false },
          { id: 'd', text: 'Desligar os antivírus para o computador da fábrica rodar mais rápido', isCorrect: false }
        ],
        explanation: 'A segurança cibernética em infraestruturas críticas exige que sistemas de controle industrial não fiquem expostos à internet pública (redes isoladas) e tenham travas físicas analógicas independentes.'
      },
      {
        id: 38,
        module: 3,
        phase: 7,
        category: 'Ética & Sociedade',
        badge: 'Veículo Autônomo',
        title: 'O Dilema do Bonde (Trolley Problem) na Vida Real',
        scenario: 'Um carro autônomo em pista molhada sofre aquaplanagem e não tem espaço de frenagem suficiente.',
        details: [
          { label: 'Cenário', value: 'Obstáculo intransponível à frente ou desvio em direção a poste lateral', icon: '🚗' }
        ],
        question: 'Como os comitês de ética em engenharia de tráfego determinam o comportamento dos algoritmos?',
        options: [
          { id: 'a', text: 'Minimização do dano com desaceleração contínua máxima, sem julgar o valor ou idade de vidas humanas', isCorrect: true },
          { id: 'b', text: 'A IA deve escolher bater na pessoa que tiver menos dinheiro ou seguidores', isCorrect: false },
          { id: 'c', text: 'O carro deve proteger o dono do veículo a qualquer custo, mesmo ferindo pedestres', isCorrect: false },
          { id: 'd', text: 'O algoritmo deve sortear uma direção jogando uma moeda virtual', isCorrect: false }
        ],
        explanation: 'As diretrizes internacionais proíbem que carros autônomos façam discriminação de pessoas por perfil. A regra ética fundamental é aplicar força de frenagem máxima na trajetória prevista de menor energia.'
      },
      {
        id: 39,
        module: 3,
        phase: 8,
        category: 'Ética & Sociedade',
        badge: 'Exploração Espacial',
        title: 'Proteção Planetária em Missões Espaciais',
        scenario: 'Uma sonda robótica vai pousar em Europa (lua de Júpiter), onde existe um oceano líquido subterrâneo que pode conter vida microbiana.',
        details: [
          { label: 'Diretriz COSPAR', value: 'Proteção Planetária Classe IV', icon: '🪐' }
        ],
        question: 'Por que os robôs espaciais são desinfetados com calor e radiação antes do lançamento?',
        options: [
          { id: 'a', text: 'Para evitar que bactérias da Terra contaminem o oceano extraterrestre e matem ou mascarem vida alienígena nativa', isCorrect: true },
          { id: 'b', text: 'Para que as fotos tiradas pela câmera fiquem mais nítidas e brilhantes', isCorrect: false },
          { id: 'c', text: 'Para a sonda não pegar chuva durante a viagem de foguete', isCorrect: false },
          { id: 'd', text: 'Para o metal do robô não enferrujar no vácuo do espaço', isCorrect: false }
        ],
        explanation: 'O protocolo ético de Proteção Planetária visa preservar mundos intocados. Se levarmos micróbios terrestres resistentes, podemos destruir ecossistemas biológicos antes mesmo de conhecê-los.'
      },
      {
        id: 40,
        module: 3,
        phase: 9,
        category: 'Ética & Sociedade',
        badge: 'Trabalho do Futuro',
        title: 'O Papel do Engenheiro Humano no Futuro Automatizado',
        scenario: 'Se os robôs montam carros, separam remédios e pilotam aviões, o que os humanos farão?',
        details: [
          { label: 'Competências do Século XXI', value: 'Criatividade, Empatia, Filosofia e Arquitetura de Sistemas', icon: '🧠' }
        ],
        question: 'Qual área do conhecimento humano se torna MAIS valiosa com o avanço da robótica?',
        options: [
          { id: 'a', text: 'Pensamento crítico, resolução de problemas inéditos, ética e trabalho em equipe colaborativo', isCorrect: true },
          { id: 'b', text: 'Decorar números de telefone de memória sem usar internet', isCorrect: false },
          { id: 'c', text: 'Trabalhar 24 horas por dia sem dormir igual a uma máquina elétrica', isCorrect: false },
          { id: 'd', text: 'Fazer contas de multiplicação simples com lápis mais rápido que uma calculadora', isCorrect: false }
        ],
        explanation: 'Máquinas são excelentes em tarefas repetitivas, velocidade de cálculo e precisão milimétrica. O que torna os humanos insubstituíveis é a imaginação, a empatia e o discernimento ético.'
      }
    ],

    // MÓDULO 5: Programação de Rota e Otimização com Loops
    [
      {
        id: 41,
        module: 4,
        phase: 0,
        category: 'Rotas & Algoritmos',
        badge: 'Armazém Logístico',
        title: 'Trajetória em Linha Reta com Coleta',
        scenario: 'Um robô móvel AGV precisa andar por um corredor de 6 metros, coletando 1 pacote a cada metro.',
        details: [
          { label: 'Meta de Otimização', value: 'Não repetir comandos manualmente', icon: '📦' }
        ],
        question: 'Qual algoritmo compacto em blocos resolve a tarefa no menor número de linhas?',
        options: [
          { id: 'a', text: 'REPITA 6 VEZES { avancar(1m); coletar_pacote(); }', isCorrect: true },
          { id: 'b', text: 'avancar(6m); coletar_pacote(); // Só coleta o último!', isCorrect: false },
          { id: 'c', text: 'coletar_pacote(); avancar(6m); // Coleta sem andar', isCorrect: false },
          { id: 'd', text: 'REPITA 1 VEZ { avancar(6m); girar(360); }', isCorrect: false }
        ],
        explanation: 'O laço `REPITA 6 VEZES` executa o par de comandos (andar 1m e pegar pacote) seis vezes consecutivas, garantindo que nenhum item fique para trás com código limpo.'
      },
      {
        id: 42,
        module: 4,
        phase: 1,
        category: 'Rotas & Algoritmos',
        badge: 'Padrão Quadrado',
        title: 'Patrulha Perimetral em Circuito Fechado',
        scenario: 'O robô vigia deve patrulhar as 4 laterais de um galpão quadrado de 10 metros e voltar ao ponto de partida.',
        details: [
          { label: 'Geometria', value: 'Polígono regular de 4 lados iguais e ângulos de 90°', icon: '⏹️' }
        ],
        question: 'Qual é o programa ótimo para completar a volta de patrulha?',
        options: [
          { id: 'a', text: 'REPITA 4 VEZES { avancar(10m); girar_direita(90); }', isCorrect: true },
          { id: 'b', text: 'REPITA 3 VEZES { avancar(10m); girar_direita(90); }', isCorrect: false },
          { id: 'c', text: 'REPITA 4 VEZES { avancar(10m); girar_direita(180); }', isCorrect: false },
          { id: 'd', text: 'avancar(40m); girar_direita(90);', isCorrect: false }
        ],
        explanation: 'Um quadrado possui 4 lados de 10m e 4 curvas de 90° (4 x 90° = 360°, voltando à orientação original).'
      },
      {
        id: 43,
        module: 4,
        phase: 2,
        category: 'Rotas & Algoritmos',
        badge: 'Desvio de Obstáculo',
        title: 'Manobra de Contorno de Estante Bloqueada',
        scenario: 'O robô está em frente a uma estante que caiu bloqueando o corredor direto.',
        details: [
          { label: 'Obstáculo', value: 'Bloqueio de 2 metros à frente', icon: '🚧' },
          { label: 'Desvio Seguro', value: 'Corredor lateral livre à esquerda', icon: '↩️' }
        ],
        question: 'Qual algoritmo em zigue-zague desvia do obstáculo e retoma a rota original?',
        options: [
          { id: 'a', text: 'girar_esquerda(90) → avancar(2m) → girar_direita(90) → avancar(4m) → girar_direita(90) → avancar(2m) → girar_esquerda(90)', isCorrect: true },
          { id: 'b', text: 'avancar(4m) direto através da estante de metal', isCorrect: false },
          { id: 'c', text: 'girar_esquerda(180) → voltar_para_a_casa_inicial()', isCorrect: false },
          { id: 'd', text: 'girar_direita(90) → avancar(50m) sem parar', isCorrect: false }
        ],
        explanation: 'Essa manobra contorna o obstáculo pela esquerda, ultrapassa-o na paralela e retorna ao alinhamento do corredor original mantendo a orientação inicial.'
      },
      {
        id: 44,
        module: 4,
        phase: 3,
        category: 'Rotas & Algoritmos',
        badge: 'Varredura Zig-Zag',
        title: 'Mapeamento Completo de Terreno (Lawnmower Pattern)',
        scenario: 'O drone agrícola precisa cobrir uma área retangular de 3 faixas paralelas para tirar fotos de alta resolução.',
        details: [
          { label: 'Padrão', value: 'Vai pela faixa 1, vira, volta pela faixa 2, vira, vai pela faixa 3', icon: '🌾' }
        ],
        question: 'Qual algoritmo realiza essa varredura sem deixar áreas sem fotografar?',
        options: [
          { id: 'a', text: 'avancar(100m) → girar_dir(90) → avancar(10m) → girar_dir(90) → avancar(100m) → girar_esq(90) → avancar(10m) → girar_esq(90) → avancar(100m)', isCorrect: true },
          { id: 'b', text: 'avancar(300m) em círculos concêntricos fechados', isCorrect: false },
          { id: 'c', text: 'REPITA 10 VEZES { girar_dir(360); }', isCorrect: false },
          { id: 'd', text: 'ficar parado no mesmo ponto tirando 100 fotos do mesmo chão', isCorrect: false }
        ],
        explanation: 'O padrão "cortador de grama" alterna curvas para a direita e para a esquerda entre as passadas paralelas, cobrindo 100% da superfície de forma geométrica.'
      },
      {
        id: 45,
        module: 4,
        phase: 4,
        category: 'Rotas & Algoritmos',
        badge: 'Loops Aninhados',
        title: 'Preenchimento de Grade 3x3 com Loops Aninhados',
        scenario: 'Um braço robótico de impressão 3D precisa depositar pontos de solda em uma matriz de 3 linhas por 3 colunas.',
        details: [
          { label: 'Total de Pontos', value: '9 pontos de solda espaçados em 5 cm', icon: '🖨️' }
        ],
        question: 'Qual estrutura de laços aninhados realiza a tarefa com perfeição matemática?',
        options: [
          { id: 'a', text: 'REPITA 3 VEZES (para cada linha) { REPITA 3 VEZES (para cada coluna) { soldar_ponto(); avancar_coluna(5cm); } descer_linha(5cm); voltar_ao_inicio_da_linha(); }', isCorrect: true },
          { id: 'b', text: 'REPITA 9 VEZES { soldar_ponto(); descer_linha(100m); }', isCorrect: false },
          { id: 'c', text: 'soldar_ponto(); avancar_coluna(45cm); // Só faz 1 ponto', isCorrect: false },
          { id: 'd', text: 'REPITA 1 VEZ { soldar_tudo_de_uma_vez(); }', isCorrect: false }
        ],
        explanation: 'Loops aninhados (um laço de repetição dentro de outro) são a base de varredura bidimensional em matrizes, processamento de imagens e fabricação digital.'
      },
      {
        id: 46,
        module: 4,
        phase: 5,
        category: 'Rotas & Algoritmos',
        badge: 'Sensor como Gatilho',
        title: 'Avançar até Parede e Virar',
        scenario: 'O robô não sabe o tamanho exato da sala (armazém dinâmico com caixas móveis).',
        details: [
          { label: 'Instrução Condicional', value: 'Não usar distância fixa em metros', icon: '📏' }
        ],
        question: 'Qual estrutura baseada em eventos sensoriais é a mais segura?',
        options: [
          { id: 'a', text: 'REPITA_ATE_QUE (sensor_distancia < 20cm) { avancar(10cm); } girar_direita(90);', isCorrect: true },
          { id: 'b', text: 'avancar(1000m); // Anda às cegas rezando para não bater', isCorrect: false },
          { id: 'c', text: 'girar_direita(90); esperar_30_segundos();', isCorrect: false },
          { id: 'd', text: 'REPITA 500 VEZES { avancar(100m); desligar_sensores(); }', isCorrect: false }
        ],
        explanation: 'O laço condicional `REPITA_ATE_QUE` (ou `WHILE NOT`) permite navegação adaptativa em ambientes desconhecidos, parando assim que o sensor detectar aproximação da parede.'
      },
      {
        id: 47,
        module: 4,
        phase: 6,
        category: 'Rotas & Algoritmos',
        badge: 'Otimização Dijkstra',
        title: 'Cálculo do Caminho Mais Curto (Shortest Path)',
        scenario: 'O robô no ponto A precisa chegar ao ponto B. Existem duas rotas possíveis no mapa fabril.',
        details: [
          { label: 'Rota 1 (Pelo Pátio Externo)', value: '12 metros, sem pedestres, velocidade 2 m/s (Tempo: 6 segundos)', icon: '🟢' },
          { label: 'Rota 2 (Pelo Corredor Interno)', value: '6 metros, tráfego intenso de empilhadeiras, velocidade 0,5 m/s (Tempo: 12 segundos)', icon: '🔴' }
        ],
        question: 'Se o objetivo do algoritmo A* (A-Star) é entregar a peça no MENOR TEMPO:',
        options: [
          { id: 'a', text: 'Escolher a Rota 1 (Pátio Externo), pois gasta 6 segundos contra 12 segundos da Rota 2', isCorrect: true },
          { id: 'b', text: 'Escolher a Rota 2 apenas porque a distância em metros é menor, ignorando a lentidão', isCorrect: false },
          { id: 'c', text: 'Ficar parado entre as duas rotas esperando as empilhadeiras irem embora', isCorrect: false },
          { id: 'd', text: 'Andar de marcha à ré na Rota 2', isCorrect: false }
        ],
        explanation: 'Em algoritmos de roteamento inteligentes (como o GPS ou robôs de armazém), o peso das arestas do grafo leva em conta o tempo de viagem (custo real) e não apenas a distância geométrica pura.'
      },
      {
        id: 48,
        module: 4,
        phase: 7,
        category: 'Rotas & Algoritmos',
        badge: 'Docking Automatizado',
        title: 'Acoplamento Preciso na Estação de Recarga',
        scenario: 'A bateria do robô atingiu 10%. Ele localizou a estação de recarga por um farol infravermelho.',
        details: [
          { label: 'Alinhamento Fino', value: 'Os pinos de contato elétrico exigem precisão milimétrica de ±2 mm', icon: '🔌' }
        ],
        question: 'Qual é o algoritmo de aproximação final que evita danos aos conectores?',
        options: [
          { id: 'a', text: 'Reduzir velocidade para 0,05 m/s → Alinhar mira laser com o alvo → Inserir contato com monitoramento de corrente elétrica', isCorrect: true },
          { id: 'b', text: 'Acelerar a 10 m/s para bater com força na tomada e travar no impacto', isCorrect: false },
          { id: 'c', text: 'Desligar os freios a 5 metros de distância e deixar o robô deslizar solto', isCorrect: false },
          { id: 'd', text: 'Girar em círculo contínuo soltando faíscas até encostar', isCorrect: false }
        ],
        explanation: 'O docking autônomo (como nas naves espaciais da ISS e robôs industriais) utiliza controle de velocidade em rampa desacelerada e telemetria de precisão antes do contato elétrico de alta corrente.'
      },
      {
        id: 49,
        module: 4,
        phase: 8,
        category: 'Rotas & Algoritmos',
        badge: 'Recursão em Labirinto',
        title: 'Algoritmo de Mão Direita (Wall Following)',
        scenario: 'O robô de busca está em um labirinto desconhecido sem mapa prévio e sem GPS.',
        details: [
          { label: 'Estratégia Clássica', value: 'Regra de Manter a Mão na Parede Direita', icon: '🧱' }
        ],
        question: 'Qual é o conjunto de regras do robô em cada cruzamento do labirinto?',
        options: [
          { id: 'a', text: 'SE (lado direito livre) ENTÃO virar_direita() SENÃO SE (frente livre) ENTÃO avancar() SENÃO virar_esquerda()', isCorrect: true },
          { id: 'b', text: 'Escolher qualquer direção aleatória jogando dados no computador', isCorrect: false },
          { id: 'c', text: 'Sempre virar para trás e voltar para a entrada do labirinto', isCorrect: false },
          { id: 'd', text: 'Ficar buzinando parado no mesmo lugar', isCorrect: false }
        ],
        explanation: 'A regra da mão direita garante matematicamente a saída de qualquer labirinto com paredes conectadas (labirintos simplesmente conexos), priorizando sempre virar à direita quando houver abertura.'
      },
      {
        id: 50,
        module: 4,
        phase: 9,
        category: 'Rotas & Algoritmos',
        badge: 'O Grande Mestre',
        title: 'Missão Final: Fábrica 100% Autônoma Sincronizada',
        scenario: 'Desafio Master: Você deve despachar a frota inteira de robôs AGVs, braços de montagem e drones de entrega em perfeita harmonia.',
        details: [
          { label: 'Status da Rede', value: '50 máquinas conectadas via 5G Industrial e IoT', icon: '🌐' },
          { label: 'Critério de Vitória', value: 'Zero acidentes, 100% de eficiência e sincronização total', icon: '🏆' }
        ],
        question: 'Qual é a regra de ouro que coroa o verdadeiro Engenheiro de Automação e Robótica?',
        options: [
          { id: 'a', text: 'Automação inteligente combina código sem bugs, respeito à segurança humana e uso da tecnologia para melhorar a vida de todos na sociedade', isCorrect: true },
          { id: 'b', text: 'Substituir todas as pessoas do mundo por robôs que nunca descansam nem sorriem', isCorrect: false },
          { id: 'c', text: 'Fazer robôs que gastam o máximo de energia possível sem se importar com a natureza', isCorrect: false },
          { id: 'd', text: 'Desligar a tecnologia e viver como na Idade da Pedra', isCorrect: false }
        ],
        explanation: 'Parabéns, Engenheiro(a)! A verdadeira robótica não é sobre substituir humanos, mas sobre construir sistemas inteligentes, seguros e sustentáveis que impulsionem o potencial da humanidade!'
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
              if (this.state.module > 4) {
                this.state.module = 4;
                this.state.phase = 9;
              }
            }
          } catch (e) {
            console.error('Error parsing automation-robotics session state', e);
          }
        }
        this.state$.next({ ...this.state });
      },
      error: () => {
        this.state$.next({ ...this.state });
      }
    });
  }

  getCurrentTask(): RoboticsTask | null {
    if (this.state.module > 4) return null;
    return this.tasks[this.state.module]?.[this.state.phase] || null;
  }

  resetGame() {
    this.state = { module: 0, phase: 0, hearts: 3, deathCount: 0 };
    this.state$.next({ ...this.state });
  }

  submitAnswer(isCorrect: boolean): boolean {
    const reportLevelId = `automation-robotics-m${this.state.module + 1}-p${this.state.phase + 1}`;
    const reportFase = this.state.module * 10 + this.state.phase;

    if (isCorrect) {
      const isLastModule = this.state.module === 4;
      const isLastPhase = this.state.phase === 9;
      const isLastLevel = isLastModule && isLastPhase;

      if (isLastLevel) {
        this.state.module++; // will be 5 (game won)
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
      let moduleRestarted = false;

      if (this.state.hearts <= 0) {
        // 3 hearts lost -> reset current module
        this.state.deathCount++;
        this.state.hearts = 3;
        this.state.phase = 0;
        moduleRestarted = true;
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
