import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataAnonymityEngineService } from './engine/data-anonymity-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

@Component({
  selector: 'app-data-anonymity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-anonymity.component.html',
  styleUrls: ['./data-anonymity.component.scss']
})
/**
 * DataAnonymityComponent
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class DataAnonymityComponent implements OnInit {
  state$ = this.engine.state$;
  feedbackMessage = '';

  constructor(
    public engine: DataAnonymityEngineService,
    private progress: ProgressReporter
  ) {}

  ngOnInit() {}

  // D&D Handlers
  onDragStart(event: DragEvent, id: string, type: string) {
    if (event.dataTransfer) {
       event.dataTransfer.setData('text/plain', JSON.stringify({ id, type }));
       event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDropPhase0(event: DragEvent, dropZone: 'research' | 'private') {
    event.preventDefault();
    const dataStr = event.dataTransfer?.getData('text/plain');
    if (!dataStr) return;
    
    let parsed: any;
    try {
      parsed = JSON.parse(dataStr);
    } catch { return; }
    
    const { id, type } = parsed;

    const state = this.engine.state;
    const items = [...state.phase0Items];
    const itemIndex = items.findIndex(i => i.id === id);

    if (itemIndex > -1) {
       if (items[itemIndex].type === dropZone) {
          items[itemIndex].droppedIn = dropZone;
          this.engine.updateState({ phase0Items: items });
          this.checkPhase0Completion();
          this.feedbackMessage = 'Correto! Muito bem!';
          setTimeout(() => this.feedbackMessage = '', 2000);
       } else {
          this.reportMistake();
          this.feedbackMessage = 'Ops! Pense bem: esse dado é para a pesquisa ou é pessoal?';
          setTimeout(() => this.feedbackMessage = '', 3000);
       }
    }
  }

  checkPhase0Completion() {
     const state = this.engine.state;
     if (state.phase0Items.every(i => i.droppedIn === i.type)) {
        this.completePhase(false);
     }
  }

  // Phase 1 & 3
  onDropId(event: DragEvent) {
     event.preventDefault();
     const dataStr = event.dataTransfer?.getData('text/plain');
     if (!dataStr) return;

     let parsed: any;
     try {
       parsed = JSON.parse(dataStr);
     } catch { return; }

     const { id, type } = parsed;
     if (type !== 'badge') return;

     const idNum = parseInt(id, 10);
     const state = this.engine.state;
     const chars = [...state.characters];
     const char = chars.find(c => c.id === idNum);

     if (char && !char.idDropped) {
        char.idDropped = true;
        this.engine.updateState({
          characters: chars,
          privacyBoxCount: state.privacyBoxCount + 1
        });
        this.checkPhase1_3Completion();
     }
  }

  clickSnack(charId: number) {
     const state = this.engine.state;
     const chars = [...state.characters];
     const char = chars.find(c => c.id === charId);

     if (char && !char.snackClicked) {
        char.snackClicked = true;
        this.engine.updateState({
          characters: chars,
          snackChartCount: state.snackChartCount + 1
        });
        this.checkPhase1_3Completion();
     }
  }

  checkPhase1_3Completion() {
     const state = this.engine.state;
     const total = state.characters.length;
     if (state.privacyBoxCount === total && state.snackChartCount === total) {
        this.completePhase(state.fase === 3);
     }
  }

  // Phase 2
  censorRow(rowId: number) {
     const state = this.engine.state;
     const data = [...state.tableData];
     const row = data.find(r => r.id === rowId);

     if (row) {
        if (!row.censored) {
           row.censored = true;
           this.engine.updateState({ tableData: data });
           this.checkPhase2Completion();
        }
     }
  }

  checkPhase2Completion() {
     const state = this.engine.state;
     if (state.tableData.every(r => r.censored)) {
        this.completePhase(false);
     }
  }

  completePhase(isLastLevel: boolean) {
    const currentFase = this.engine.state.fase;
    this.progress.report({
       levelId: `fase-${currentFase}`,
       fase: currentFase,
       result: 'success',
       attempts: 1,
       timestamp: new Date().toISOString(),
       isLastLevel: isLastLevel
    });
    if (!isLastLevel) {
        setTimeout(() => {
            this.engine.nextPhase();
        }, 1500);
    } else {
       this.feedbackMessage = 'Parabéns! Você completou o jogo e aprendeu a proteger os dados!';
    }
  }

  reportMistake() {
    this.progress.report({
       levelId: `fase-${this.engine.state.fase}`,
       fase: this.engine.state.fase,
       result: 'failure',
       attempts: 1,
       timestamp: new Date().toISOString(),
       isLastLevel: false
    });
  }
}
