import { WidgetDefinition } from '../../widget-sdk/widget.interface';
import { TableWidgetComponent } from './table-widget.component';

export const tableWidgetDefinition: WidgetDefinition = {
  type: 'table',
  name: 'Table',
  component: TableWidgetComponent,
  defaultConfig: { rows: [] }
};
