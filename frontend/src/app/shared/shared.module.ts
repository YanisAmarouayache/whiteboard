import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './directives/draggable.directive';
import { ResizableDirective } from './directives/resizable.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    DraggableDirective,
    ResizableDirective,
    ClickOutsideDirective,
    TruncatePipe,
    SafeHtmlPipe
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    DraggableDirective,
    ResizableDirective,
    ClickOutsideDirective,
    TruncatePipe,
    SafeHtmlPipe
  ]
})
export class SharedModule {}
