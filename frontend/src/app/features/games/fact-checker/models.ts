export type CaseType = 'anatomy' | 'phishing' | 'cross_check' | 'advanced_fake';

export interface Dialogue {
  speaker: 'Lupa' | 'System';
  text: string;
}

export interface AnatomyStage {
  id: string; // 'url', 'headline', 'author', 'date', 'image', 'body'
  instruction: string;
  feedback: string;
}

export interface PhishingStage {
  imageUrl?: string; // Para mostrar o print falso
  suspiciousText: string;
  clues: string[]; // Ex: 'Link encurtado', 'Urgência'
  isPhishing: boolean;
  feedback: string;
}

export interface FactCheckStage {
  suspiciousNews: string;
  sourceType: string;
  reliableSearch: string;
  isFact: boolean;
  feedback: string;
}

export interface DetectiveCase {
  id: string;
  title: string;
  briefing: Dialogue[];
  type: CaseType;
  stages: AnatomyStage[] | PhishingStage[] | FactCheckStage[];
}
