import { WidgetDefinition } from '../../widget-sdk/widget.interface';
import { ChartWidgetComponent } from './chart-widget.component';

export const chartWidgetDefinition: WidgetDefinition = {
  type: 'chart',
  name: 'Chart',
  component: ChartWidgetComponent,
  defaultConfig: { chartType: 'pie' }
};
