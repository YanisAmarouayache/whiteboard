import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BoardStateService } from '../../board/board-state.service';

@Component({
  selector: 'app-textarea-widget',
  templateUrl: './textarea-widget.component.html',
  styleUrls: ['./textarea-widget.component.scss']
})
export class TextareaWidgetComponent implements OnChanges {
  @Input() widgetId = '';
  @Input() text = '';

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
