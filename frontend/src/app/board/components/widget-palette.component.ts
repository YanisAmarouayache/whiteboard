import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { WidgetRegistryService } from '../../widget-sdk/widget-registry.service';
import { BoardStateService } from '../board-state.service';
import { WidgetInstance } from '../models/widget-instance';

@Component({
  selector: 'app-widget-palette',
  templateUrl: './widget-palette.component.html',
  styleUrls: ['./widget-palette.component.scss']
})
export class WidgetPaletteComponent {
  readonly widgets$: Observable<WidgetInstance[]>;
  readonly chartTypes = ['pie', 'doughnut', 'bar', 'line'];

  constructor(
    readonly registry: WidgetRegistryService,
    private readonly boardState: BoardStateService
  ) {
    this.widgets$ = this.boardState.state$.pipe(map((state) => state.widgets));
  }

  add(type: string): void {
    const definition = this.registry.get(type);
    if (!definition) return;
    this.boardState.addWidget(type, definition.defaultConfig as Record<string, unknown>);
  }

  trackByWidgetId(_: number, widget: WidgetInstance): string {
    return widget.id;
  }

  getChartType(widget: WidgetInstance): string {
    const chartType = widget.config['chartType'];
    return typeof chartType === 'string' ? chartType : 'pie';
  }

  setChartType(widgetId: string, chartType: string): void {
    this.boardState.updateWidgetConfig(widgetId, { chartType });
  }

  onImageFileSelected(widgetId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') return;
      this.boardState.updateWidgetConfig(widgetId, { src: result, alt: file.name });
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  bringForward(widgetId: string): void {
    this.boardState.bringForward(widgetId);
  }

  sendBackward(widgetId: string): void {
    this.boardState.sendBackward(widgetId);
  }

  bringToFront(widgetId: string): void {
    this.boardState.bringToFront(widgetId);
  }

  sendToBack(widgetId: string): void {
    this.boardState.sendToBack(widgetId);
  }
}
