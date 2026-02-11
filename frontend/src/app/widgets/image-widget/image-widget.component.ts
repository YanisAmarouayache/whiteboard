import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-widget',
  templateUrl: './image-widget.component.html',
  styleUrls: ['./image-widget.component.scss']
})
export class ImageWidgetComponent {
  @Input() src = 'https://placehold.co/300x200';
  @Input() alt = 'Widget image';
}
