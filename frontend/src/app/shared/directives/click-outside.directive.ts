import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ selector: '[appClickOutside]' })
export class ClickOutsideDirective {
  @Output() readonly appClickOutside = new EventEmitter<void>();

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event.target'])
  onDocClick(target: EventTarget | null): void {
    if (!target || this.el.nativeElement.contains(target as Node)) return;
    this.appClickOutside.emit();
  }
}
