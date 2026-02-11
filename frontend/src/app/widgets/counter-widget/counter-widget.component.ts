import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-counter-widget',
  templateUrl: './counter-widget.component.html',
  styleUrls: ['./counter-widget.component.scss']
})
export class CounterWidgetComponent {
  @Input() value = 0;
  @Input() label = 'Metric';
}
