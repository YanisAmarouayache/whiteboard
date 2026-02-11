import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BoardStateService } from '../board-state.service';
import { Transform } from '../models/transform';
import { TransformService } from '../services/transform.service';
import { WidgetInstance } from '../models/widget-instance';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  private readonly minBoardWidth = 2200;
  private readonly minBoardHeight = 1400;
  private readonly extensionMargin = 800;

  readonly widgets$: Observable<WidgetInstance[]>;
  readonly transform$: Observable<Transform>;
  readonly boardWidth$: Observable<number>;
  readonly boardHeight$: Observable<number>;
  private panning = false;
  private panStartMouseX = 0;
  private panStartMouseY = 0;
  private panStartTransform: Transform = { x: 0, y: 0, scale: 1 };

  constructor(
    private readonly boardState: BoardStateService,
    private readonly transformService: TransformService
  ) {
    this.widgets$ = this.boardState.state$.pipe(map((state) => state.widgets));
    this.transform$ = this.boardState.state$.pipe(map((state) => state.transform));
    this.boardWidth$ = this.widgets$.pipe(
      map((widgets) =>
        Math.max(
          this.minBoardWidth,
          ...widgets.map((widget) => Math.max(0, widget.x) + widget.width + this.extensionMargin)
        )
      )
    );
    this.boardHeight$ = this.widgets$.pipe(
      map((widgets) =>
        Math.max(
          this.minBoardHeight,
          ...widgets.map((widget) => Math.max(0, widget.y) + widget.height + this.extensionMargin)
        )
      )
    );
  }

  onWheel(event: WheelEvent): void {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    this.zoomBy(delta);
  }

  get isPanning(): boolean {
    return this.panning;
  }

  startPan(event: MouseEvent): void {
    if (event.button !== 0) return;
    if (this.isInteractiveTarget(event.target)) return;
    this.panning = true;
    this.panStartMouseX = event.clientX;
    this.panStartMouseY = event.clientY;
    this.panStartTransform = this.boardState.snapshot().transform;
  }

  zoomBy(delta: number): void {
    this.boardState.update((state) => ({
      ...state,
      transform: this.transformService.zoom(state.transform, delta)
    }));
  }

  resetZoom(): void {
    this.boardState.update((state) => ({
      ...state,
      transform: { ...state.transform, scale: 1 }
    }));
  }

  zoomPercent(transform: Transform): number {
    return Math.round(transform.scale * 100);
  }

  transformCss(transform: Transform): string {
    return `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (!this.panning) return;
    const dx = event.clientX - this.panStartMouseX;
    const dy = event.clientY - this.panStartMouseY;
    this.boardState.replace({
      ...this.boardState.snapshot(),
      transform: this.transformService.pan(this.panStartTransform, dx, dy)
    });
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    this.panning = false;
  }

  private isInteractiveTarget(target: EventTarget | null): boolean {
    const element = target as HTMLElement | null;
    if (!element) return false;
    return !!element.closest('textarea,input,select,button,label,a,.context-menu,.resize-handle,.drag-handle');
  }
}
