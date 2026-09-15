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
