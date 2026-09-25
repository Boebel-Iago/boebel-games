import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextShapesEngineService } from './engine/text-shapes-engine.service';

@Component({
  selector: 'app-text-shapes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-shapes.component.html'
})
export class TextShapesComponent {
  inputValue: string = '';

  constructor(public engine: TextShapesEngineService) {}

  get state() { return this.engine.state; }
  get currentTask() { return this.engine.currentTask; }

  checkInput() {
    const correct = this.engine.checkAnswer(this.inputValue);
    if (correct) {
      this.inputValue = '';
    } else {
      this.inputValue = ''; // reset on wrong
      if (this.state.vidas <= 0) {
        this.engine.restartModule();
      }
    }
  }

  checkOption(option: any) {
    const correct = this.engine.checkAnswer(option);
    if (!correct && this.state.vidas <= 0) {
      this.engine.restartModule();
    }
  }
}
