import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HardwareCareEngineService } from './engine/hardware-care-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

@Component({
  selector: 'app-hardware-care',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hardware-care.component.html',
  styleUrls: ['./hardware-care.component.scss'],
  providers: [HardwareCareEngineService]
})
/**
 * HardwareCareComponent
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class HardwareCareComponent {
  constructor(public engine: HardwareCareEngineService) {}
  
  // Phase 0
  selectPhase0(isCorrect: boolean) {
    if (isCorrect) {
      this.engine.completePhase(false);
    } else {
      this.engine.reportMistake();
      alert('Ops! Essa não é a atitude mais segura. Tente novamente!');
    }
  }

  // Phase 1
  phase1Items = [
    { id: 1, name: 'Maçã', icon: 'fas fa-apple-alt', type: 'proibido', placed: null as string | null },
    { id: 2, name: 'Água', icon: 'fas fa-tint', type: 'proibido', placed: null as string | null },
    { id: 3, name: 'Biscoito', icon: 'fas fa-cookie', type: 'proibido', placed: null as string | null },
    { id: 4, name: 'Mãos Limpas', icon: 'fas fa-hands-wash', type: 'permitido', placed: null as string | null }
  ];
  selectedPhase1Item: any = null;

  selectP1Item(item: any) {
    if (!item.placed) this.selectedPhase1Item = item;
  }
  
  placeP1Item(zone: string) {
    if (!this.selectedPhase1Item) return;
    if (this.selectedPhase1Item.type === zone) {
      this.selectedPhase1Item.placed = zone;
      this.selectedPhase1Item = null;
      if (this.phase1Items.every(i => i.placed)) {
        this.engine.completePhase(false);
      }
    } else {
      this.engine.reportMistake();
      alert('Ops! Será que esse item pertence a este lugar?');
      this.selectedPhase1Item = null;
    }
  }

  // Phase 2
  phase2Available = [
    { id: 3, name: 'Transportar com cuidado', icon: 'fas fa-walking' },
    { id: 1, name: 'Pegar com duas mãos', icon: 'fas fa-hands' },
    { id: 4, name: 'Guardar no armário', icon: 'fas fa-box' },
    { id: 2, name: 'Sentar para usar', icon: 'fas fa-chair' }
  ];
  phase2Sequence: any[] = [];
  phase2Expected = [1, 2, 3, 4];

  selectP2Item(item: any) {
    this.phase2Sequence.push(item);
    this.phase2Available = this.phase2Available.filter(i => i.id !== item.id);
    
    if (this.phase2Sequence.length === 4) {
      const correct = this.phase2Sequence.every((val, index) => val.id === this.phase2Expected[index]);
      if (correct) {
        this.engine.completePhase(false);
      } else {
        this.engine.reportMistake();
        alert('A ordem não parece certa! Vamos tentar de novo?');
        this.phase2Available = [...this.phase2Sequence].sort((a, b) => a.name.localeCompare(b.name));
        this.phase2Sequence = [];
      }
    }
  }

  undoP2Item(item: any) {
    this.phase2Sequence = this.phase2Sequence.filter(i => i.id !== item.id);
    this.phase2Available.push(item);
  }

  // Phase 3
  phase3Items = [
    { id: 1, name: 'Comer perto do tablet', icon: 'fas fa-hamburger', type: 'danger', placed: null as string | null },
    { id: 2, name: 'Compartilhar Senha', icon: 'fas fa-user-secret', type: 'danger', placed: null as string | null },
    { id: 3, name: 'Lavar as mãos antes de usar', icon: 'fas fa-hands-wash', type: 'safe', placed: null as string | null },
    { id: 4, name: 'Criar senha forte', icon: 'fas fa-key', type: 'safe', placed: null as string | null }
  ];
  selectedPhase3Item: any = null;

  selectP3Item(item: any) {
    if (!item.placed) this.selectedPhase3Item = item;
  }
  
  placeP3Item(zone: string) {
    if (!this.selectedPhase3Item) return;
    if (this.selectedPhase3Item.type === zone) {
      this.selectedPhase3Item.placed = zone;
      this.selectedPhase3Item = null;
      if (this.phase3Items.every(i => i.placed)) {
        this.engine.completePhase(true);
      }
    } else {
      this.engine.reportMistake();
      alert('Cuidado! Tem certeza de que essa atitude é correta?');
      this.selectedPhase3Item = null;
    }
  }

  restart() {
    this.engine.state.fase = 0;
    this.phase1Items.forEach(i => i.placed = null);
    this.phase2Available = [...this.phase2Available, ...this.phase2Sequence].sort((a, b) => a.name.localeCompare(b.name));
    this.phase2Sequence = [];
    this.phase3Items.forEach(i => i.placed = null);
  }
}
