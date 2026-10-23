import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  AutomationRoboticsEngineService, 
  GameState, 
  WorkEvolutionTask, 
  TimelineCard, 
  ClassifierItem 
} from './engine/automation-robotics-engine.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-automation-robotics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './automation-robotics.component.html',
  styleUrls: ['./automation-robotics.component.scss']
})
export class AutomationRoboticsComponent implements OnInit, OnDestroy {
  state!: GameState;
  currentTask: WorkEvolutionTask | null = null;
  private sub?: Subscription;

  feedbackType: 'success' | 'error' | null = null;
  feedbackExplanation: string = '';
  selectedOptionId: string | null = null;

  moduleTitles = [
    'A Era do Esforço Manual',
    'Profissões que Mudaram ou Sumiram',
    'A Linha do Tempo das Ferramentas',
    'A Era Digital e os Robôs',
    'O Futuro e as Novas Profissões',
    'O Construtor da Linha do Tempo',
    'O Grande Classificador: Humano vs Máquina'
  ];

  moduleIcons = ['🪵', '🏮', '⏳', '🤖', '🚀', '🧩', '⚖️'];

  // --- Estado para Módulo 6 (Timeline Drag & Drop) ---
  timelineEraSlots = [
    { index: 0, title: 'Era Manual', subtitle: 'Antiguidade / Força Muscular', icon: '🪵' },
    { index: 1, title: 'Era do Vapor', subtitle: 'Mecânica e Engrenagens', icon: '🚂' },
    { index: 2, title: 'Era Elétrica', subtitle: 'Linha de Montagem em Série', icon: '⚡' },
    { index: 3, title: 'Era Digital', subtitle: 'Computação, Internet e IA', icon: '💻' }
  ];
  availableTimelineCards: TimelineCard[] = [];
  placedTimelineCards: { [slotIndex: number]: TimelineCard } = {};
  selectedCardForPlacement: TimelineCard | null = null;

  // --- Estado para Módulo 7 (Classifier Drag & Drop) ---
  availableClassifierItems: ClassifierItem[] = [];
  machineZoneItems: ClassifierItem[] = [];
  humanZoneItems: ClassifierItem[] = [];
  selectedClassifierItem: ClassifierItem | null = null;

  draggedData: any = null;

  constructor(public engine: AutomationRoboticsEngineService) {}

  ngOnInit(): void {
    this.sub = this.engine.state$.subscribe(state => {
      this.state = state;
      this.currentTask = this.engine.getCurrentTask();
      this.selectedOptionId = null;
      this.initializeTaskInteractiveState();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  get heartsArray(): boolean[] {
    return Array(3).fill(false).map((_, i) => i < this.state.hearts);
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  initializeTaskInteractiveState(): void {
    this.selectedCardForPlacement = null;
    this.selectedClassifierItem = null;
    this.draggedData = null;

    if (this.currentTask?.type === 'timeline_drag') {
      this.placedTimelineCards = {};
      this.availableTimelineCards = this.shuffle(this.currentTask.timelineCards || []);
    } else if (this.currentTask?.type === 'classifier_drag') {
      this.machineZoneItems = [];
      this.humanZoneItems = [];
      this.availableClassifierItems = this.shuffle(this.currentTask.classifierItems || []);
    }
  }

  // --- Módulos 1 a 5: Múltipla Escolha Reflexiva ---
  selectOption(option: { id: string; text: string; isCorrect: boolean }): void {
    if (this.feedbackType !== null || !this.currentTask) return;

    this.selectedOptionId = option.id;
    const isCorrect = option.isCorrect;
    this.feedbackExplanation = this.currentTask.didacticExplanation;

    if (isCorrect) {
      this.feedbackType = 'success';
      setTimeout(() => {
        this.feedbackType = null;
        this.selectedOptionId = null;
        this.engine.submitAnswer(true);
      }, 1600);
    } else {
      this.feedbackType = 'error';
      setTimeout(() => {
        this.feedbackType = null;
        this.selectedOptionId = null;
        this.engine.submitAnswer(false);
      }, 2400);
    }
  }

  // --- Módulo 6: Linha do Tempo Drag & Drop ---
  onCardDragStart(event: DragEvent, card: TimelineCard): void {
    this.draggedData = { type: 'timeline', card };
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', card.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onSlotDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onSlotDrop(event: DragEvent, slotIndex: number): void {
    event.preventDefault();
    if (!this.draggedData || this.draggedData.type !== 'timeline') return;
    this.placeCardInSlot(this.draggedData.card, slotIndex);
    this.draggedData = null;
  }

  selectCardToPlace(card: TimelineCard): void {
    if (this.feedbackType !== null) return;
    this.selectedCardForPlacement = this.selectedCardForPlacement?.id === card.id ? null : card;
  }

  clickSlotToPlace(slotIndex: number): void {
    if (this.feedbackType !== null) return;
    if (this.selectedCardForPlacement) {
      this.placeCardInSlot(this.selectedCardForPlacement, slotIndex);
      this.selectedCardForPlacement = null;
    } else if (this.placedTimelineCards[slotIndex]) {
      // Remove do slot e volta para a bandeja
      const card = this.placedTimelineCards[slotIndex];
      delete this.placedTimelineCards[slotIndex];
      this.availableTimelineCards.push(card);
    }
  }

  private placeCardInSlot(card: TimelineCard, slotIndex: number): void {
    // Se o slot já tem cartão, devolve para a bandeja
    if (this.placedTimelineCards[slotIndex]) {
      this.availableTimelineCards.push(this.placedTimelineCards[slotIndex]);
    }
    // Remove o cartão da bandeja disponível
    this.availableTimelineCards = this.availableTimelineCards.filter(c => c.id !== card.id);
    this.placedTimelineCards[slotIndex] = card;

    // Checa se todos os 4 slots foram preenchidos
    if (Object.keys(this.placedTimelineCards).length === 4) {
      this.verifyTimelinePlacement();
    }
  }

  private verifyTimelinePlacement(): void {
    let allCorrect = true;
    for (let slot = 0; slot < 4; slot++) {
      if (this.placedTimelineCards[slot]?.correctSlotIndex !== slot) {
        allCorrect = false;
        break;
      }
    }

    this.feedbackExplanation = this.currentTask?.didacticExplanation || '';

    if (allCorrect) {
      this.feedbackType = 'success';
      setTimeout(() => {
        this.feedbackType = null;
        this.engine.submitAnswer(true);
      }, 1800);
    } else {
      this.feedbackType = 'error';
      setTimeout(() => {
        this.feedbackType = null;
        this.engine.submitAnswer(false);
        this.initializeTaskInteractiveState(); // Reseta para tentar novamente
      }, 2500);
    }
  }

  // --- Módulo 7: Classificador Humano vs Máquina ---
  onClassifierItemDragStart(event: DragEvent, item: ClassifierItem): void {
    this.draggedData = { type: 'classifier', item };
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', item.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onZoneDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onZoneDrop(event: DragEvent, category: 'machine' | 'human'): void {
    event.preventDefault();
    if (!this.draggedData || this.draggedData.type !== 'classifier') return;
    this.classifyItem(this.draggedData.item, category);
    this.draggedData = null;
  }

  selectClassifierItemToDrop(item: ClassifierItem): void {
    if (this.feedbackType !== null) return;
    this.selectedClassifierItem = this.selectedClassifierItem?.id === item.id ? null : item;
  }

  clickZoneToClassify(category: 'machine' | 'human'): void {
    if (this.feedbackType !== null || !this.selectedClassifierItem) return;
    this.classifyItem(this.selectedClassifierItem, category);
    this.selectedClassifierItem = null;
  }

  private classifyItem(item: ClassifierItem, chosenCategory: 'machine' | 'human'): void {
    if (this.feedbackType !== null) return;

    if (item.correctCategory === chosenCategory) {
      // Acertou o item!
      this.availableClassifierItems = this.availableClassifierItems.filter(i => i.id !== item.id);
      if (chosenCategory === 'machine') {
        this.machineZoneItems.push(item);
      } else {
        this.humanZoneItems.push(item);
      }

      // Se classificou os 4 itens com sucesso:
      if (this.availableClassifierItems.length === 0) {
        this.feedbackExplanation = this.currentTask?.didacticExplanation || '';
        this.feedbackType = 'success';
        setTimeout(() => {
          this.feedbackType = null;
          this.engine.submitAnswer(true);
        }, 1800);
      }
    } else {
      // Errou a categoria!
      this.feedbackExplanation = `A tarefa "${item.text}" pertence à categoria do ${item.correctCategory === 'machine' ? 'Robô/Máquina' : 'Ser Humano'}!`;
      this.feedbackType = 'error';
      setTimeout(() => {
        this.feedbackType = null;
        this.engine.submitAnswer(false);
      }, 2000);
    }
  }

  restartGame(): void {
    this.feedbackType = null;
    this.selectedOptionId = null;
    this.engine.resetGame();
  }

  leaveRoom(): void {
    if (confirm('Tem certeza que deseja sair da sala? Seu progresso nesta fase será interrompido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
