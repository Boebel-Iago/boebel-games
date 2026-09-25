import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafetyScenario, SafetyScenarioOption, SafetyScenarioPhaseConfig } from '../../content/phase.model';

@Component({
  selector: 'app-safety-scenario-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './safety-scenario-activity.component.html'
})
export class SafetyScenarioActivityComponent implements OnChanges {
  @Input({ required: true }) phase!: SafetyScenarioPhaseConfig;
  @Output() completed = new EventEmitter<boolean>();

  scenarioIndex = 0;
  selectedOption: SafetyScenarioOption | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['phase']) {
      this.scenarioIndex = 0;
      this.selectedOption = null;
    }
  }

  get currentScenario(): SafetyScenario {
    return this.phase.scenarios[this.scenarioIndex];
  }

  get isLastScenario(): boolean {
    return this.scenarioIndex === this.phase.scenarios.length - 1;
  }

  selectOption(option: SafetyScenarioOption): void {
    this.selectedOption = option;
    if (option.isSafe) {
      setTimeout(() => this.advance(), 1600);
    }
  }

  tryAgain(): void {
    this.selectedOption = null;
  }

  private advance(): void {
    this.selectedOption = null;
    if (this.isLastScenario) {
      this.completed.emit(true);
    } else {
      this.scenarioIndex++;
    }
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}