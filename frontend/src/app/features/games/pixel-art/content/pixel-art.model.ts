export interface PixelLevel {
  id: number;
  title: string;
  instruction: string;
  colors: { [key: number]: string };
  pattern: string[]; 
}
