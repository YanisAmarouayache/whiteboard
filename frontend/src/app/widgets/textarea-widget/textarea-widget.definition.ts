import { WidgetDefinition } from '../../widget-sdk/widget.interface';
import { TextareaWidgetComponent } from './textarea-widget.component';

export const textareaWidgetDefinition: WidgetDefinition = {
  type: 'textarea',
  name: 'Textarea',
  component: TextareaWidgetComponent,
  defaultConfig: { text: '' }
};
