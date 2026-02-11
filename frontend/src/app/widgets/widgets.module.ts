import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartWidgetComponent } from './chart-widget/chart-widget.component';
import { TableWidgetComponent } from './table-widget/table-widget.component';
import { CounterWidgetComponent } from './counter-widget/counter-widget.component';
import { TextWidgetComponent } from './text-widget/text-widget.component';
import { ImageWidgetComponent } from './image-widget/image-widget.component';
import { TextareaWidgetComponent } from './textarea-widget/textarea-widget.component';
import { WidgetRegistryService } from '../widget-sdk/widget-registry.service';
import { chartWidgetDefinition } from './chart-widget/chart-widget.definition';
import { tableWidgetDefinition } from './table-widget/table-widget.definition';
import { counterWidgetDefinition } from './counter-widget/counter-widget.definition';
import { textWidgetDefinition } from './text-widget/text-widget.definition';
import { imageWidgetDefinition } from './image-widget/image-widget.definition';
import { textareaWidgetDefinition } from './textarea-widget/textarea-widget.definition';

@NgModule({
  declarations: [
    ChartWidgetComponent,
    TableWidgetComponent,
    CounterWidgetComponent,
    TextWidgetComponent,
    ImageWidgetComponent,
    TextareaWidgetComponent
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    ChartWidgetComponent,
    TableWidgetComponent,
    CounterWidgetComponent,
    TextWidgetComponent,
    ImageWidgetComponent,
    TextareaWidgetComponent
  ]
})
export class WidgetsModule {
  constructor(registry: WidgetRegistryService) {
    registry.register(chartWidgetDefinition);
    registry.register(tableWidgetDefinition);
    registry.register(counterWidgetDefinition);
    registry.register(textWidgetDefinition);
    registry.register(imageWidgetDefinition);
    registry.register(textareaWidgetDefinition);
  }
}
