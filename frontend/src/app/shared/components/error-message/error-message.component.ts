import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: '<p class="error">{{ message }}</p>',
  styles: ['.error { color: #b91c1c; }']
})
export class ErrorMessageComponent {
  @Input() message = 'An error occurred';
}
