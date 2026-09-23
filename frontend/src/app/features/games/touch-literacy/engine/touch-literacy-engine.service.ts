import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TouchLiteracyState {
  fase: number;
  bubbles: boolean[]; // true if popped
  appleDropped: boolean;
  shapes: { [key: string]: boolean }; // true if dropped
  devices: { [key: string]: boolean }; // true if powered
}

@Injectable({
  providedIn: 'root'
})
export class TouchLiteracyEngineService {
  private initialState: TouchLiteracyState = {
    fase: 0,
    bubbles: [false, false, false],
    appleDropped: false,
    shapes: { square: false, triangle: false, circle: false },
    devices: { phone: false, laptop: false, flashlight: false }
  };

  private stateSubject = new BehaviorSubject<TouchLiteracyState>(this.initialState);
  state$ = this.stateSubject.asObservable();

  get state(): TouchLiteracyState {
    return this.stateSubject.value;
  }

  constructor() {}

  popBubble(index: number) {
    if (this.state.fase !== 0) return;
    const newBubbles = [...this.state.bubbles];
    newBubbles[index] = true;
    this.updateState({ bubbles: newBubbles });
  }

  dropApple() {
    if (this.state.fase !== 1) return;
    this.updateState({ appleDropped: true });
  }

  dropShape(shape: string) {
    if (this.state.fase !== 2) return;
    const newShapes = { ...this.state.shapes, [shape]: true };
    this.updateState({ shapes: newShapes });
  }

  powerDevice(device: string) {
    if (this.state.fase !== 3) return;
    const newDevices = { ...this.state.devices, [device]: true };
    this.updateState({ devices: newDevices });
  }

  nextPhase() {
    this.updateState({ fase: this.state.fase + 1 });
  }

  reset() {
    this.updateState(this.initialState);
  }

  private updateState(newState: Partial<TouchLiteracyState>) {
    this.stateSubject.next({ ...this.state, ...newState });
  }
}
