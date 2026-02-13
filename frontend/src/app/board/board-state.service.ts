import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardState } from './models/board-state';
import { HistoryService } from './services/history.service';
import { WidgetInstance } from './models/widget-instance';
import { Transform } from './models/transform';

const initialState: BoardState = {
  id: '',
  name: 'New board',
  transform: { x: 0, y: 0, scale: 1 },
  widgets: [],
  version: 1
};

@Injectable()
export class BoardStateService {
  private readonly stateSubject = new BehaviorSubject<BoardState>(initialState);
  readonly state$ = this.stateSubject.asObservable();

  constructor(private readonly history: HistoryService<BoardState>) {}

  snapshot(): BoardState {
    return this.stateSubject.value;
  }

  replace(state: BoardState): void {
    this.stateSubject.next(state);
  }

  update(mutator: (state: BoardState) => BoardState): void {
    const current = this.snapshot();
    const next = mutator(current);
    if (next === current) return;
    this.history.push(current);
    this.stateSubject.next(next);
  }

  setTransform(transform: Transform): void {
    const current = this.snapshot();
    if (
      current.transform.x === transform.x &&
      current.transform.y === transform.y &&
      current.transform.scale === transform.scale
    ) {
      return;
    }
    this.stateSubject.next({ ...current, transform });
  }

  markPersisted(): void {
    const current = this.snapshot();
    this.stateSubject.next({ ...current, version: current.version + 1 });
  }

  addWidget(type: string, defaultConfig: Record<string, unknown>): void {
    const id = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const widget: WidgetInstance = {
      id,
      type,
      x: 100 + this.snapshot().widgets.length * 24,
      y: 100 + this.snapshot().widgets.length * 24,
      width: 280,
      height: 180,
      config: { ...defaultConfig }
    };
    this.update((state) => ({ ...state, widgets: [...state.widgets, widget] }));
  }

  moveWidget(id: string, x: number, y: number): void {
    this.updateWidget(id, () => ({ x, y }));
  }

  setWidgetFrame(id: string, x: number, y: number, width: number, height: number): void {
    this.updateWidget(id, () => ({ x, y, width, height }));
  }

  updateWidgetConfig(id: string, patch: Record<string, unknown>): void {
    this.updateWidget(id, (widget) => ({ config: { ...widget.config, ...patch } }));
  }

  removeWidget(id: string): void {
    this.update((state) => ({
      ...state,
      widgets: state.widgets.filter((widget) => widget.id !== id)
    }));
  }

  bringForward(id: string): void {
    this.reorderLayer(id, (index, total) => Math.min(total - 1, index + 1));
  }

  sendBackward(id: string): void {
    this.reorderLayer(id, (index) => Math.max(0, index - 1));
  }

  bringToFront(id: string): void {
    this.reorderLayer(id, (_, total) => total - 1);
  }

  sendToBack(id: string): void {
    this.reorderLayer(id, () => 0);
  }

  undo(): void {
    const prev = this.history.undo(this.snapshot());
    if (prev) this.stateSubject.next(prev);
  }

  redo(): void {
    const next = this.history.redo(this.snapshot());
    if (next) this.stateSubject.next(next);
  }

  private reorderLayer(
    id: string,
    nextIndexFactory: (currentIndex: number, total: number) => number
  ): void {
    this.update((state) => {
      const widgets = [...state.widgets];
      const currentIndex = widgets.findIndex((widget) => widget.id === id);
      if (currentIndex < 0) return state;

      const targetIndex = nextIndexFactory(currentIndex, widgets.length);
      if (targetIndex === currentIndex) return state;

      const [moved] = widgets.splice(currentIndex, 1);
      widgets.splice(targetIndex, 0, moved);
      return { ...state, widgets };
    });
  }

  private updateWidget(
    id: string,
    patchFactory: (widget: WidgetInstance) => Partial<WidgetInstance>
  ): void {
    this.update((state) => ({
      ...state,
      widgets: state.widgets.map((widget) =>
        widget.id === id ? { ...widget, ...patchFactory(widget) } : widget
      )
    }));
  }
}
