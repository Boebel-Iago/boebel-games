export type MissionType = 'anatomy' | 'keyword_search';

export interface Dialogue {
  speaker: 'T-B0T' | 'System';
  text: string;
}

export interface AnatomyTask {
  id: string; // 'back', 'forward', 'refresh', 'url', 'bookmark', 'lock'
  instruction: string;
  feedback: string;
}

export interface SearchTask {
  situation: string;
  correctKeywords: string[];
  alternativeKeywords?: string[][]; // Permite múltiplas combinações corretas
  distractorWords: string[];
  feedback: string;
}

export interface CyberMission {
  id: string;
  title: string;
  briefing: Dialogue[];
  type: MissionType;
  tasks: AnatomyTask[] | SearchTask[];
}
