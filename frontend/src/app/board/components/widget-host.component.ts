import { Component, Input } from '@angular/core';
import { WidgetInstance } from '../models/widget-instance';

@Component({
  selector: 'app-widget-host',
  templateUrl: './widget-host.component.html',
  styleUrls: ['./widget-host.component.scss']
})
export class WidgetHostComponent {
  @Input() widgets: WidgetInstance[] = [];

  trackByWidgetId(_: number, widget: WidgetInstance): string {
    return widget.id;
  }
}
