import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextShapesEngineService } from './engine/text-shapes-engine.service';

@Component({
  selector: 'app-text-and-shapes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-and-shapes.component.html',
  styleUrls: ['./text-and-shapes.component.scss']
})
export class TextAndShapesComponent implements OnInit {
  inputValue = '';
  showError = false;

  constructor(public engine: TextShapesEngineService) {}

  ngOnInit(): void {}

  checkInput() {
    this.handleAnswer(this.inputValue);
    this.inputValue = '';
  }

  handleAnswer(answer: any) {
    if (this.engine.state.completed || this.engine.state.vidas <= 0) return;
    
    const correct = this.engine.checkAnswer(answer);
    if (!correct) {
      this.showError = true;
      setTimeout(() => this.showError = false, 1000);
    }
  }

  restart() {
    this.engine.restartModule();
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
