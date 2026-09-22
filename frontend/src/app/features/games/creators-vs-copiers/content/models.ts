export interface Dialogue {
  speaker: 'justino' | 'system';
  text: string;
}

export interface CreatorsMission {
  id: number;
  title: string;
  subtitle: string;
  type: 'license-cards' | 'plagiarism-court';
  briefing: Dialogue[];
  debriefing: Dialogue[];
}

export interface LicenseTask {
  symbol: string;
  name: string;
  correctAnswer: string;
  wrongAnswers: string[];
  feedback: string;
}

export interface PlagiarismTask {
  scenario: string;
  studentAction: string;
  isCorrectUse: boolean; // true = Uso Correto, false = Plágio/Erro
  feedback: string;
}
