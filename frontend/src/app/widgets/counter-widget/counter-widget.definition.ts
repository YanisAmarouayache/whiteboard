import { WidgetDefinition } from '../../widget-sdk/widget.interface';
import { CounterWidgetComponent } from './counter-widget.component';

export const counterWidgetDefinition: WidgetDefinition = {
  type: 'counter',
  name: 'Counter',
  component: CounterWidgetComponent,
  defaultConfig: { value: 0, label: 'Metric' }
};
