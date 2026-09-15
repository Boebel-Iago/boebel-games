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
