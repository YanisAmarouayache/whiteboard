import { WidgetDefinition } from '../../widget-sdk/widget.interface';
import { TextWidgetComponent } from './text-widget.component';

export const textWidgetDefinition: WidgetDefinition = {
  type: 'text',
  name: 'Yellow Box',
  component: TextWidgetComponent,
  defaultConfig: { text: 'Yellow box' }
};
