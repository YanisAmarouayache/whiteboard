import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: '<button (click)="confirm.emit()">Confirm</button>',
  styles: []
})
export class ConfirmDialogComponent {
  @Output() readonly confirm = new EventEmitter<void>();
}
