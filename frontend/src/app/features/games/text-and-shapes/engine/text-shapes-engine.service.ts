import { Injectable } from '@angular/core';

export interface Shape {
  id: number;
  type: 'square' | 'circle' | 'triangle';
  x: number;
  y: number;
  color: string;
}

export interface GameState {
  fase: number;
  shapes: Shape[];
}

@Injectable({
  providedIn: 'root'
})
export class TextShapesEngineService {
  state: GameState = {
    fase: 0,
    shapes: []
  };

  reset() {
    this.state.fase = 0;
    this.state.shapes = [];
  }
}
