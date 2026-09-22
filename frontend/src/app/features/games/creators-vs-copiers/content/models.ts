export interface Dialogue {
  speaker: 'justino' | 'system';
  text: string;
}

export interface CreatorsMission {
  id: number;
  title: string;
  subtitle: string;
  type: 'license-cards' | 'plagiarism-court' | 'drag-drop' | 'audit';
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
  isCorrectUse: boolean;
  feedback: string;
}

export interface DragDropItem {
  id: string;
  description: string;
  category: 'LIVRE' | 'CREDITOS' | 'PLAGIO';
}

export interface AuditTask {
  assetName: string;
  originalLicense: string;
  studentAction: string;
  isApproved: boolean;
  feedback: string;
}
