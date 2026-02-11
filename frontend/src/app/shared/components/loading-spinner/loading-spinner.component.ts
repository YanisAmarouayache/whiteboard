import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: '<div class="spinner">Loading...</div>',
  styles: ['.spinner { padding: 8px; }']
})
export class LoadingSpinnerComponent {}
