import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[appDraggable]' })
export class DraggableDirective {
  constructor(private readonly el: ElementRef<HTMLElement>) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.el.nativeElement.dataset['dragStartX'] = String(event.clientX);
    this.el.nativeElement.dataset['dragStartY'] = String(event.clientY);
  }
}
