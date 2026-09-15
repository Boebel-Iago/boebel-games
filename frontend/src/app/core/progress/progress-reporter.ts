export interface ProgressEvent {
  levelId?: string;
  fase: number;
  result: 'success' | 'failure';
  isLastLevel?: boolean;
  timestamp?: string;
  attempts?: number;
}

export abstract class ProgressReporter {
  abstract report(event: ProgressEvent): void;
}
