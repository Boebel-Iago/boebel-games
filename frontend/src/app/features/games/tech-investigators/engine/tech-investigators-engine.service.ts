import { Injectable } from '@angular/core';

export interface TechItem {
  id: string;
  icon: string;
  isTech: boolean;
  selected: boolean;
  isWrong?: boolean;
}

export interface PurposeMatch {
  id: string;
  deviceIcon: string;
  sceneIcon: string;
  matched: boolean;
}

export interface HardSoftItem {
  id: string;
  icon: string;
  type: 'hardware' | 'software';
  box: 'none' | 'hardware' | 'software';
}

@Injectable({
  providedIn: 'root'
})
export class TechInvestigatorsEngineService {
  fase: number = 0;

  // Phase 0
  items: TechItem[] = [
    { id: '1', icon: '💻', isTech: true, selected: false },
    { id: '2', icon: '📱', isTech: true, selected: false },
    { id: '3', icon: '📡', isTech: true, selected: false },
    { id: '4', icon: '✏️', isTech: false, selected: false },
    { id: '5', icon: '📓', isTech: false, selected: false },
    { id: '6', icon: '🍎', isTech: false, selected: false },
  ];

  // Phase 1
  purposeDevices = [
    { id: 'cam', icon: '📷', targetId: 'scene-landscape' },
    { id: 'spk', icon: '🔊', targetId: 'scene-singer' }
  ];
  purposeScenes = [
    { id: 'scene-singer', icon: '🎤' },
    { id: 'scene-landscape', icon: '🌄' }
  ];
  matches: Record<string, boolean> = { cam: false, spk: false };

  // Phase 2
  hsItems: HardSoftItem[] = [
    { id: 'btn', icon: '🔘', type: 'hardware', box: 'none' }, // Button
    { id: 'scr', icon: '📺', type: 'hardware', box: 'none' }, // Screen
    { id: 'char', icon: '👾', type: 'software', box: 'none' }, // Character
    { id: 'note', icon: '🎵', type: 'software', box: 'none' } // Music Note
  ];

  // Phase 3
  goodCareChoices = [
    { id: 'messy', icon: 'messy', isCorrect: false },
    { id: 'clean', icon: 'clean', isCorrect: true }
  ];

  reset() {
    this.fase = 0;
    this.items.forEach(i => { i.selected = false; i.isWrong = false; });
    this.matches = { cam: false, spk: false };
    this.hsItems.forEach(i => i.box = 'none');
    this.items = this.shuffle(this.items);
  }

  shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
