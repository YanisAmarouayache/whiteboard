import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardComponent } from './board.component';
import { CanvasComponent } from './components/canvas.component';
import { ToolbarComponent } from './components/toolbar.component';
import { WidgetHostComponent } from './components/widget-host.component';
import { WidgetInstanceComponent } from './components/widget-instance.component';
import { WidgetPaletteComponent } from './components/widget-palette.component';
import { BoardStateService } from './board-state.service';
import { HistoryService } from './services/history.service';
import { SelectionService } from './services/selection.service';
import { TransformService } from './services/transform.service';
import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  declarations: [
    BoardComponent,
    CanvasComponent,
    ToolbarComponent,
    WidgetHostComponent,
    WidgetInstanceComponent,
    WidgetPaletteComponent
  ],
  imports: [CommonModule, FormsModule, WidgetsModule],
  exports: [BoardComponent]
})
export class BoardModule {
  static forRoot(): ModuleWithProviders<BoardModule> {
    return {
      ngModule: BoardModule,
      providers: [BoardStateService, HistoryService, SelectionService, TransformService]
    };
  }
}
