import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unplugged-activity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-8 rounded-xl shadow-lg border-2 border-dashed border-gray-300">
      <div class="flex items-center gap-3 mb-6 border-b pb-4 border-gray-200">
        <span class="text-4xl">🔌</span>
        <div>
          <h2 class="text-2xl font-black text-gray-800">Atividade Desplugada</h2>
          <p class="text-gray-500 font-medium">Aplique os conceitos do jogo na vida real, sem usar computadores!</p>
        </div>
      </div>

      <div [ngSwitch]="gameRoute" class="space-y-4">
        
        <!-- SEA TURTLES -->
        <div *ngSwitchCase="'sea-turtles'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-teal-700 mb-2">🐢 Robô Tartaruga (Algoritmos no Chão)</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Compreender algoritmos, sequenciamento e lógica passo a passo.</p>
          <div class="bg-teal-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Crie uma grade no chão da sala usando fita crepe ou aproveite os azulejos.</li>
              <li>Coloque obstáculos físicos (cadeiras, mochilas) em alguns quadrados.</li>
              <li>Divida os alunos em duplas: um será o <strong>"Programador"</strong> e o outro será o <strong>"Robô Tartaruga"</strong>.</li>
              <li>O Robô só pode se mover se receber comandos exatos do Programador (ex: "Ande 1 passo para frente", "Gire 90 graus à direita").</li>
              <li>Se o Robô bater no obstáculo, o programa teve um "Bug" e eles devem recomeçar!</li>
            </ul>
          </div>
        </div>

        <!-- BROWSER SEARCH -->
        <div *ngSwitchCase="'browser-search'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-blue-700 mb-2">🔍 Jogo das 20 Perguntas com Filtros Booleanos</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Aprender a filtrar informações usando operadores lógicos (E, OU, NÃO).</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>O professor pensa em um animal, objeto ou pessoa famosa.</li>
              <li>Os alunos devem "pesquisar" fazendo perguntas, mas são obrigados a usar operadores de busca em voz alta.</li>
              <li>Exemplo de perguntas válidas: <em>"É um animal E vive na água?"</em>, <em>"Tem pelos OU penas?"</em>, <em>"É mamífero, mas NÃO é terrestre?"</em>.</li>
              <li>A sala tem no máximo 20 consultas (perguntas) para achar a resposta certa, simulando a limitação e a precisão de um motor de busca.</li>
            </ul>
          </div>
        </div>

        <!-- PROFESSIONS -->
        <div *ngSwitchCase="'professions'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-indigo-700 mb-2">💼 Mímica das Ferramentas Tecnológicas</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Associar diferentes profissões às tecnologias específicas que elas utilizam.</p>
          <div class="bg-indigo-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Escreva profissões em cartões azuis e ferramentas tecnológicas em cartões verdes.</li>
              <li>Um aluno sorteia uma profissão e deve fazer mímica daquela profissão <strong>utilizando a tecnologia correspondente</strong>.</li>
              <li>Exemplo: Médico usando um software de Raio-X 3D; Arquiteto desenhando em um Tablet com caneta digital; Engenheiro de Software digitando códigos furiosamente.</li>
              <li>A turma deve adivinhar tanto a profissão quanto a tecnologia que está sendo mimetizada.</li>
            </ul>
          </div>
        </div>

        <!-- FACT CHECKER -->
        <div *ngSwitchCase="'fact-checker'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-red-700 mb-2">🕵️ O Mural do Detetive (Fake News)</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Analisar a anatomia de uma notícia e distinguir fatos de boatos.</p>
          <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Imprima 4 manchetes gigantes de notícias e cole no quadro (3 falsas bem absurdas e 1 verdadeira, porém surpreendente).</li>
              <li>Divida a sala em "Agências de Checagem". Entregue a "Lupa de Papel" (um checklist com: Autor? Data? Fonte original? Título muito exagerado?).</li>
              <li>Cada grupo deve ir ao quadro, analisar as pistas visuais e classificar com post-its vermelhos (FAKE) ou verdes (FATO).</li>
              <li>Ao final, debatam por que a notícia verdadeira parecia mentira, e por que as falsas enganam tanta gente.</li>
            </ul>
          </div>
        </div>

        <!-- CREATORS VS COPIERS -->
        <div *ngSwitchCase="'creators-vs-copiers'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-yellow-700 mb-2">🎨 A Batalha dos Direitos Autorais</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Compreender o plágio, o impacto moral da cópia e como o Creative Commons funciona.</p>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Cada aluno recebe uma folha em branco e tem 3 minutos para criar um desenho muito legal e assinar no canto (Copyright).</li>
              <li>O professor recolhe tudo, redistribui os desenhos aleatoriamente e manda: <em>"Agora apaguem a assinatura do colega, desenhem um bigode no personagem, assinem o nome de vocês e digam que a obra é sua."</em></li>
              <li>Faça uma pausa e pergunte: <em>"Como vocês se sentem vendo o trabalho de vocês sendo roubado e alterado sem permissão?"</em></li>
              <li>Em seguida, introduza o conceito do símbolo CC-BY (Creative Commons): ensine que se a folha tivesse o símbolo "CC-BY", a alteração seria permitida desde que a assinatura original fosse mantida junto com a nova.</li>
            </ul>
          </div>
        </div>

        <!-- PIXEL ART -->
        <div *ngSwitchCase="'pixel-art'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-pink-700 mb-2">👾 Pixel Art no Papel Quadriculado</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Entender como as telas formam imagens usando matrizes, coordenadas e códigos de cores.</p>
          <div class="bg-pink-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Entregue folhas de papel quadriculado e lápis de cor para a turma. O papel deve ter coordenadas (Colunas A-J, Linhas 1-10).</li>
              <li>O professor atua como o "Processador", ditando o código: <em>"Atenção, placa de vídeo: Cor 1 (Preto) nas células C5, D5, E5."</em></li>
              <li>Os alunos processam a informação pintando os quadradinhos à medida que escutam as coordenadas.</li>
              <li>Quem seguir o código sem errar formará o desenho secreto (como um coração, um Pac-Man ou a inicial da escola) no final da instrução.</li>
            </ul>
          </div>
        </div>

        <!-- EMERGENCY ESCAPE -->
        <div *ngSwitchCase="'emergency-escape'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-orange-700 mb-2">🔥 Roteadores Humanos (Passa-Pacote)</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Compreender a topologia de redes, roteamento de pacotes e tolerância a falhas na internet.</p>
          <div class="bg-orange-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Posicione os alunos espalhados pela sala de aula formando uma "Rede Mesh" (cada aluno pode tocar no ombro de 2 ou 3 colegas próximos). Eles são os Roteadores.</li>
              <li>O professor entrega um "Pacote de Dados" (um envelope com uma mensagem) para o aluno em uma ponta da sala. O destino é o aluno na outra ponta.</li>
              <li>O pacote deve ser passado de mão em mão, buscando a rota mais curta.</li>
              <li><strong>Desafio:</strong> De repente, o professor grita <em>"Servidor Caiu!"</em> e manda 2 alunos aleatórios sentarem no chão. Eles não podem mais receber o pacote.</li>
              <li>A rede (os alunos de pé) deve rapidamente descobrir um caminho alternativo para que a mensagem chegue ao destino (Tolerância a Falhas).</li>
            </ul>
          </div>
        </div>

        <!-- TEXT AND SHAPES (3º ANO) -->
        <div *ngSwitchCase="'text-and-shapes'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-teal-700 mb-2">📝 Formatação no Caderno Comum</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Compreender os atributos visuais de um texto usando materiais escolares físicos.</p>
          <div class="bg-teal-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Os alunos escrevem um texto autoral sobre suas brincadeiras favoritas no caderno.</li>
              <li>Oriente-os a simular o "Negrito" passando o lápis grafite bem forte por cima de palavras importantes.</li>
              <li>Peça para alterarem o "Tamanho da Fonte" escrevendo algumas palavras fisicamente maiores.</li>
              <li>Utilizem lápis de cor por cima de outras letras para mudar a "Cor da Fonte", entendendo a analogia com os editores de texto digitais.</li>
            </ul>
          </div>
        </div>

        <!-- MINI POSTER (3º ANO) -->
        <div *ngSwitchCase="'mini-poster'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-cyan-700 mb-2">📐 Esqueleto Visual (Wireframe)</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Planejar o layout de uma interface ou documento de forma estruturada no papel.</p>
          <div class="bg-cyan-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Desenhe no quadro algumas opções de como organizar um folheto (ex: um quadrado na esquerda para imagem, linhas na direita para texto).</li>
              <li>No caderno, os alunos desenham o "esqueleto" (wireframe) de como querem que o trabalho final fique.</li>
              <li>Eles fazem um quadrado demarcando onde vão inserir a imagem, e riscam linhas horizontais onde o texto vai ficar.</li>
              <li>Isso os ensina sobre arranjo espacial e planejamento de diagramação antes da execução no software.</li>
            </ul>
          </div>
        </div>

        <!-- TOUCH LITERACY (1º ANO) -->
        <div *ngSwitchCase="'touch-literacy'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-green-700 mb-2">🔎 Caça aos Artefatos na Sala</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Diferenciar objetos de uso comum de artefatos computacionais que necessitam de energia.</p>
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Apresente imagens de diferentes objetos e artefatos (computador, roteador, bebedouro automático, lápis, caderno).</li>
              <li>Os alunos devem identificar quais deles são artefatos computacionais e explicar para que servem em roda de conversa.</li>
              <li>Em seguida, promova uma "Caçada" onde eles observam os objetos da própria sala de aula e desenham apenas aqueles que utilizam energia, programação ou processamento de informações.</li>
            </ul>
          </div>
        </div>

        <!-- TECH INVESTIGATORS (1º ANO) -->
        <div *ngSwitchCase="'tech-investigators'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-purple-700 mb-2">🃏 O que está por trás do botão?</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Diferenciar conceitos básicos de Hardware (físico) e Software (instruções/jogos).</p>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Prepare cartões impressos divididos em duas categorias: Hardware (botões físicos, tela de tablet, câmera) e Software (regras de jogo, códigos, imagem de um app na tela).</li>
              <li>Divida a turma em grupos. O desafio é classificar os cartões nas colunas "Físico (Dá para tocar)" e "Invisível/Instruções".</li>
              <li>Isso ajuda as crianças menores a entenderem que o tablet não faz mágica, mas sim recebe comandos (Software) através do corpo físico (Hardware).</li>
            </ul>
          </div>
        </div>

        <!-- HARDWARE CARE (2º ANO) -->
        <div *ngSwitchCase="'hardware-care'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-amber-700 mb-2">🧼 Cuidando do Nosso Hardware</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Aprender o manuseio correto, transporte seguro e cuidados físicos com os equipamentos.</p>
          <div class="bg-amber-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>O professor debate regras básicas: mãos limpas, usar as duas mãos, não comer nem beber água perto do equipamento.</li>
              <li>Os alunos rascunham no caderno a sequência correta de uso (1. Pegar, 2. Usar sentado, 3. Transportar com as duas mãos, 4. Guardar).</li>
              <li>Em seguida, realizam uma simulação prática em sala utilizando o próprio caderno fechado ou um livro pesado para treinar a postura física correta e o transporte seguro, sem usar telas reais.</li>
            </ul>
          </div>
        </div>

        <!-- PASSWORD MYSTERY (2º ANO) -->
        <div *ngSwitchCase="'password-mystery'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-blue-700 mb-2">📜 Nosso Código de Convivência Digital</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Reforçar o planejamento de regras éticas de convivência através de desenho visual.</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>O professor e a turma debatem regras de ouro para o uso ético e seguro da tecnologia (ex: não compartilhar senhas, não estragar o equipamento).</li>
              <li>No caderno, os alunos dividem a página para criar o "esqueleto" visual do código da turma.</li>
              <li>Eles devem desenhar ícones simples que representem as regras de zelo (ex: um copo d'água com um traço de proibido, um cadeado fechado simbolizando uma senha forte), organizando as ideias visualmente.</li>
            </ul>
          </div>
        </div>

        <!-- DATA ANONYMITY (4º ANO) -->
        <div *ngSwitchCase="'data-anonymity'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-indigo-700 mb-2">🛡️ O Segredo dos Meus Dados</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Compreender dados pessoais e praticar a cultura do sigilo e proteção da própria identidade.</p>
          <div class="bg-indigo-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>Debata o que são dados pessoais (nome completo, endereço, foto, escola onde estuda).</li>
              <li>Peça para os alunos escreverem essas informações no caderno e, imediatamente, cobrirem a folha com o estojo para simular o sigilo.</li>
              <li>Discuta com eles quem tem o direito de ler aquelas informações (Pais? Professores? Desconhecidos na internet?).</li>
              <li>Eles desenham um "Escudo de Privacidade" no próprio caderno simbolizando a segurança dos próprios dados.</li>
            </ul>
          </div>
        </div>

        <!-- ETHICAL DILEMMAS (4º ANO) -->
        <div *ngSwitchCase="'ethical-dilemmas'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-red-700 mb-2">✍️ O Dilema do Copiar e Colar</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Entender o conceito de plágio e praticar a citação correta de autoria.</p>
          <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>O professor desenha algo legal no quadro e assina seu nome. Em seguida, finge apagar o nome, escreve "Autor: [Nome de um aluno]" e pergunta se isso é justo.</li>
              <li>Inicie um debate sobre respeito ao criador e direitos autorais. Explique que na internet copiar textos sem dar crédito é "roubo de ideia".</li>
              <li>Peça para copiarem um pequeno trecho de um livro ou da lousa e praticarem a regra de ouro: escrever a FONTE e o AUTOR entre parênteses logo abaixo do texto no caderno.</li>
            </ul>
          </div>
        </div>

        <!-- AUTOMATION ROBOTICS (5º ANO) -->
        <div *ngSwitchCase="'automation-robotics'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-slate-700 mb-2">⏳ A Linha do Tempo do Trabalho</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Compreender a evolução do trabalho manual até o automatizado e o digital.</p>
          <div class="bg-slate-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>No quadro, o professor apresenta profissões do passado que desapareceram com a tecnologia (ex: acendedor de lampião, telefonista, despertador humano).</li>
              <li>No caderno, os estudantes desenham uma linha do tempo simples de três quadros, mostrando a evolução de uma ferramenta. Exemplo: Vassoura (Humano) -> Aspirador de pó (Humano + Máquina) -> Robô Aspirador (Autônomo).</li>
              <li>Debata com eles: o que a vassoura tem que o robô não tem? (A capacidade de limpar cantos específicos que o robô não enxerga).</li>
            </ul>
          </div>
        </div>

        <!-- FUTURE FAIR (5º ANO) -->
        <div *ngSwitchCase="'future-fair'" class="animate-fadeIn">
          <h3 class="text-xl font-bold text-fuchsia-700 mb-2">🚀 Desenhando as Profissões do Amanhã</h3>
          <p class="text-gray-700 mb-4"><strong>Objetivo:</strong> Rascunhar uma história em quadrinhos focada em planejamento, autoria criativa e resolução de problemas do futuro.</p>
          <div class="bg-fuchsia-50 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Como aplicar:</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-800">
              <li>O professor debate com a turma sobre os desafios do mundo em 2050 (aquecimento global, exploração espacial, superpopulação).</li>
              <li>Os alunos dividem uma folha em branco do caderno em quatro blocos (quadrinhos).</li>
              <li>Eles devem inventar uma profissão do futuro que resolva um desses problemas e desenhar um esqueleto simples da história, posicionando onde ficarão os personagens e os balões de fala, preparando o roteiro para o jogo digital.</li>
            </ul>
          </div>
        </div>

        <!-- DEFAULT / NÃO ENCONTRADO -->
        <div *ngSwitchDefault class="text-center py-8">
          <p class="text-gray-500 font-bold text-lg">Atividade desplugada não cadastrada para este jogo.</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class UnpluggedActivityComponent {
  @Input({ required: true }) gameRoute!: string;
}
