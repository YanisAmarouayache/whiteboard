import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BoardStateService } from '../../board/board-state.service';

@Component({
  selector: 'app-text-widget',
  templateUrl: './text-widget.component.html',
  styleUrls: ['./text-widget.component.scss']
})
export class TextWidgetComponent implements OnChanges {
  @Input() widgetId = '';
  @Input() text = 'Yellow box';

  value = '';

  constructor(private readonly boardState: BoardStateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.value = typeof this.text === 'string' ? this.text : '';
    }
  }

  onChange(value: string): void {
    this.value = value;
    if (!this.widgetId) return;
    this.boardState.updateWidgetConfig(this.widgetId, { text: value });
  }
}
