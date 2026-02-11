import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss']
})
export class TableWidgetComponent {
  @Input() rows: Record<string, unknown>[] = [];
}
