export interface BrowserTask {
  id: string;
  instruction: string;
  feedback: string;
}

export interface SearchTask {
  situation: string;
  correctKeywords: string[];
  distractorWords: string[]; 
  feedback: string;
}
