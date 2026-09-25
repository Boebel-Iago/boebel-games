import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordMysteryEngineService, CodeTask, DragTask, TapTask } from './engine/password-mystery-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

@Component({
  selector: 'app-password-mystery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-mystery.component.html',
  styleUrls: ['./password-mystery.component.scss'],
  providers: [ProgressReporter] // usually provided in root, but just in case
})
export class PasswordMysteryComponent implements OnInit {
  moduleTitles = [
    'O Cofre',
    'Chave ou Senha?',
    'Atitudes de Segurança',
    'Senha Forte vs Fraca',
    'O Guardião de Dados'
  ];

  // Mod 1
  mod1Code = '';
  mod1Input = '';

  // Mod 2, 3, 5
  dragItem: string | null = null;
  dragType: string | null = null;
  dragOptions: { id: string, label: string, icon: string }[] = [];

  // Mod 4
  tapPasswords: { text: string; isStrong: boolean }[] = [];

  gameFinished = false;

  constructor(public engine: PasswordMysteryEngineService) {}

  ngOnInit() {
    this.loadCurrentTask();
  }

  get state() {
    return this.engine.state;
  }

  get heartsArray() {
    return Array(this.state.hearts).fill(0);
  }

  get emptyHeartsArray() {
    return Array(3 - this.state.hearts).fill(0);
  }

  loadCurrentTask() {
    if (this.state.module >= 5) {
      this.gameFinished = true;
      return;
    }

    this.dragItem = null;
    this.mod1Input = '';
    
    switch (this.state.module) {
      case 0:
        const t1 = this.engine.getModule1Task(this.state.task);
        this.mod1Code = t1.code;
        break;
      case 1:
        const t2 = this.engine.getModule2Task(this.state.task);
        this.dragItem = t2.item;
        this.dragType = t2.type;
        this.dragOptions = [
          { id: 'chave', label: 'Chave Física', icon: '🔑' },
          { id: 'senha', label: 'Senha Digital', icon: '🔤' }
        ];
        break;
      case 2:
        const t3 = this.engine.getModule3Task(this.state.task);
        this.dragItem = t3.item;
        this.dragType = t3.type;
        this.dragOptions = [
          { id: 'seguro', label: 'Seguro', icon: '🟢' },
          { id: 'perigoso', label: 'Perigoso', icon: '🔴' }
        ];
        break;
      case 3:
        const t4 = this.engine.getModule4Task(this.state.task);
        this.tapPasswords = t4.passwords;
        break;
      case 4:
        const t5 = this.engine.getModule5Task(this.state.task);
        this.dragItem = t5.item;
        this.dragType = t5.type;
        this.dragOptions = [
          { id: 'publico', label: 'Pode Contar (Público)', icon: '🌍' },
          { id: 'segredo', label: 'Nunca Contar (Segredo)', icon: '🤐' }
        ];
        break;
    }
  }

  // --- Mod 1 Logic ---
  pressKey(num: number) {
    if (this.mod1Input.length < 4) {
      this.mod1Input += num.toString();
      if (this.mod1Input.length === 4) {
        // check answer
        if (this.mod1Input === this.mod1Code) {
          this.engine.submitAnswer(true);
        } else {
          this.engine.submitAnswer(false);
        }
        this.loadCurrentTask();
      }
    }
  }

  clearKey() {
    this.mod1Input = '';
  }

  // --- Drag & Drop (Click to select zone instead of actual HTML5 drag for simplicity on mobile/touch) ---
  // To make it easy and robust for 2nd graders, we will show the item, and two big buttons for the zones.
  selectZone(zoneId: string) {
    if (this.dragType) {
      this.engine.submitAnswer(zoneId === this.dragType);
      this.loadCurrentTask();
    }
  }

  // --- Mod 4 Logic ---
  tapPassword(isStrong: boolean) {
    this.engine.submitAnswer(isStrong);
    this.loadCurrentTask();
  }

  restart() {
    this.engine.clearState();
    this.gameFinished = false;
    this.loadCurrentTask();
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
