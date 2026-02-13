import { Component, Input, OnChanges, OnDestroy, SimpleChanges, Type } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { WidgetRegistryService } from '../../widget-sdk/widget-registry.service';
import { WidgetInstance } from '../models/widget-instance';
import { BoardStateService } from '../board-state.service';

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
type LayerAction = 'forward' | 'backward' | 'front' | 'back';

@Component({
  selector: 'app-widget-instance',
  templateUrl: './widget-instance.component.html',
  styleUrls: ['./widget-instance.component.scss']
})
export class WidgetInstanceComponent implements OnChanges, OnDestroy {
  readonly resizeHandles: ResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

  @Input({ required: true }) widget!: WidgetInstance;
  private dragging = false;
  private resizing = false;
  private resizeDirection: ResizeDirection = 'se';
  private dragStartMouseX = 0;
  private dragStartMouseY = 0;
  private dragStartWidgetX = 0;
  private dragStartWidgetY = 0;
  private resizeStartMouseX = 0;
  private resizeStartMouseY = 0;
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeStartWidth = 0;
  private resizeStartHeight = 0;
  previewX = 0;
  previewY = 0;
  previewWidth = 280;
  previewHeight = 180;
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  private dragResizeListeners = new Subscription();
  private contextMenuListeners = new Subscription();

  constructor(
    private readonly registry: WidgetRegistryService,
    private readonly boardState: BoardStateService
  ) {}

  get widgetComponent(): Type<unknown> | null {
    return (this.registry.get(this.widget.type)?.component as Type<unknown>) ?? null;
  }

  get widgetInputs(): Record<string, unknown> {
    if (this.widget.type === 'textarea' || this.widget.type === 'text') {
      return { ...this.widget.config, widgetId: this.widget.id };
    }
    return this.widget.config;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['widget'] || this.dragging || this.resizing) return;
    this.setPreviewFromWidget();
  }

  startDrag(event: MouseEvent): void {
    if (event.button !== 0) return;
    if (this.isInteractiveTarget(event.target)) return;
    this.beginDrag(event);
  }

  startDragFromHandle(event: MouseEvent): void {
    if (event.button !== 0) return;
    event.stopPropagation();
    this.beginDrag(event);
  }

  private beginDrag(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuVisible = false;
    this.dragging = true;
    this.dragStartMouseX = event.clientX;
    this.dragStartMouseY = event.clientY;
    this.dragStartWidgetX = this.widget.x;
    this.dragStartWidgetY = this.widget.y;
    this.setPreviewFromWidget();
    this.bindDragResizeListeners();
  }

  openContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuVisible = true;
    this.contextMenuX = event.offsetX;
    this.contextMenuY = event.offsetY;
    this.bindContextMenuListeners();
  }

  closeContextMenu(): void {
    this.contextMenuVisible = false;
    this.contextMenuListeners.unsubscribe();
    this.contextMenuListeners = new Subscription();
  }

  deleteWidget(): void {
    this.boardState.removeWidget(this.widget.id);
    this.closeContextMenu();
  }

  bringForward(): void {
    this.applyLayerAction('forward');
  }

  sendBackward(): void {
    this.applyLayerAction('backward');
  }

  bringToFront(): void {
    this.applyLayerAction('front');
  }

  sendToBack(): void {
    this.applyLayerAction('back');
  }

  startResize(event: MouseEvent, direction: ResizeDirection): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuVisible = false;
    this.resizing = true;
    this.resizeDirection = direction;
    this.resizeStartMouseX = event.clientX;
    this.resizeStartMouseY = event.clientY;
    this.resizeStartX = this.widget.x;
    this.resizeStartY = this.widget.y;
    this.resizeStartWidth = this.widget.width;
    this.resizeStartHeight = this.widget.height;
    this.setPreviewFromWidget();
    this.bindDragResizeListeners();
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      const dx = event.clientX - this.dragStartMouseX;
      const dy = event.clientY - this.dragStartMouseY;
      this.previewX = this.dragStartWidgetX + dx;
      this.previewY = this.dragStartWidgetY + dy;
      return;
    }

    if (!this.resizing) return;

    const dx = event.clientX - this.resizeStartMouseX;
    const dy = event.clientY - this.resizeStartMouseY;

    let nextX = this.resizeStartX;
    let nextY = this.resizeStartY;
    let nextWidth = this.resizeStartWidth;
    let nextHeight = this.resizeStartHeight;

    if (this.resizeDirection.includes('e')) {
      nextWidth = Math.max(0, this.resizeStartWidth + dx);
    }

    if (this.resizeDirection.includes('s')) {
      nextHeight = Math.max(0, this.resizeStartHeight + dy);
    }

    if (this.resizeDirection.includes('w')) {
      nextWidth = Math.max(0, this.resizeStartWidth - dx);
      nextX = this.resizeStartX + (this.resizeStartWidth - nextWidth);
    }

    if (this.resizeDirection.includes('n')) {
      nextHeight = Math.max(0, this.resizeStartHeight - dy);
      nextY = this.resizeStartY + (this.resizeStartHeight - nextHeight);
    }

    this.previewX = nextX;
    this.previewY = nextY;
    this.previewWidth = nextWidth;
    this.previewHeight = nextHeight;
  }

  private onMouseUp(): void {
    if (this.dragging) {
      this.dragging = false;
      this.boardState.moveWidget(this.widget.id, this.previewX, this.previewY);
    }

    if (this.resizing) {
      this.resizing = false;
      this.boardState.setWidgetFrame(
        this.widget.id,
        this.previewX,
        this.previewY,
        this.previewWidth,
        this.previewHeight
      );
    }
    this.dragResizeListeners.unsubscribe();
    this.dragResizeListeners = new Subscription();
  }

  private isInteractiveTarget(target: EventTarget | null): boolean {
    const element = target as HTMLElement | null;
    if (!element) return false;
    return !!element.closest('textarea,input,select,button,label,a');
  }

  private setPreviewFromWidget(): void {
    this.previewX = this.widget.x;
    this.previewY = this.widget.y;
    this.previewWidth = this.widget.width;
    this.previewHeight = this.widget.height;
  }

  private applyLayerAction(action: LayerAction): void {
    const actions: Record<LayerAction, () => void> = {
      forward: () => this.boardState.bringForward(this.widget.id),
      backward: () => this.boardState.sendBackward(this.widget.id),
      front: () => this.boardState.bringToFront(this.widget.id),
      back: () => this.boardState.sendToBack(this.widget.id)
    };
    actions[action]();
    this.closeContextMenu();
  }

  private bindDragResizeListeners(): void {
    this.dragResizeListeners.unsubscribe();
    this.dragResizeListeners = new Subscription();
    this.dragResizeListeners.add(fromEvent<MouseEvent>(document, 'mousemove').subscribe((event) => this.onMouseMove(event)));
    this.dragResizeListeners.add(fromEvent<MouseEvent>(document, 'mouseup').subscribe(() => this.onMouseUp()));
  }

  private bindContextMenuListeners(): void {
    this.contextMenuListeners.unsubscribe();
    this.contextMenuListeners = new Subscription();
    this.contextMenuListeners.add(fromEvent<MouseEvent>(document, 'click').subscribe(() => this.closeContextMenu()));
    this.contextMenuListeners.add(
      fromEvent<KeyboardEvent>(document, 'keydown').subscribe((event) => {
        if (event.key === 'Escape') this.closeContextMenu();
      })
    );
  }

  ngOnDestroy(): void {
    this.dragResizeListeners.unsubscribe();
    this.contextMenuListeners.unsubscribe();
  }
}
