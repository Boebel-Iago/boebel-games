/**
 * Modelos de dados para o jogo "Academia de Talentos Digitais" (Profissões).
 *
 * Este jogo ensina como a tecnologia (hardware e software) transforma
 * diferentes profissões, e como usamos tecnologia no trabalho, estudo e lazer.
 *
 * @see ProfessionsComponent Componente principal do jogo
 */

/** Diálogo da Professora Ada durante briefings e feedbacks. */
export interface Dialogue {
  speaker: 'ada';
  text: string;
}

/** Ferramenta tecnológica associada a uma profissão. */
export interface Tool {
  name: string;
  /** Caminho relativo da imagem (assets/images/professions/...) ou emoji. */
  icon: string;
}

/** Profissional com sua ferramenta correta e opções erradas. */
export interface Profession {
  name: string;
  icon: string;
  correctTool: Tool;
  wrongTools: Tool[];
  feedback: string;
  /** Explicação do componente físico (Hardware). */
  hardwareDesc: string;
  /** Explicação do componente lógico (Software). */
  softwareDesc: string;
}

/** Cenário de uso de tecnologia (Trabalho, Estudo ou Lazer). */
export interface Scenario {
  description: string;
  icon: string;
  type: 'TRABALHO' | 'ESTUDO' | 'LAZER';
  feedback: string;
  hardwareDesc: string;
  softwareDesc: string;
}

/** Item para categorização na fase de Drag & Drop. */
export interface Phase3Item {
  id: string;
  name: string;
  icon: string;
  category: 'TRABALHO' | 'ESTUDO' | 'LAZER';
}

/**
 * Pergunta-bônus "Desafio Ada" sobre Hardware vs Software.
 * Aparece entre grupos de perguntas regulares para reforçar o conceito.
 */
export interface HwSwChallenge {
  question: string;
  /** Imagem ou emoji do item sendo questionado. */
  icon: string;
  answer: 'HARDWARE' | 'SOFTWARE';
  explanation: string;
}

/**
 * Tarefa de identificação de Software usado por um profissional.
 * Na Missão 2, o aluno vê a profissão e deve identificar qual Software é usado.
 */
export interface SoftwareTask {
  professionName: string;
  professionIcon: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
}

/**
 * Missão da Academia de Talentos Digitais.
 *
 * Cada missão tem um briefing narrativo (diálogos da Professora Ada),
 * um conjunto de tarefas interativas e um debriefing de conclusão.
 */
export interface AcademyMission {
  id: number;
  title: string;
  subtitle: string;
  /** Tipo de tarefa principal desta missão. */
  type: 'tool-match' | 'software-identify' | 'category-sort' | 'drag-drop';
  briefing: Dialogue[];
  /** Diálogos exibidos ao completar a missão. */
  debriefing: Dialogue[];
}
