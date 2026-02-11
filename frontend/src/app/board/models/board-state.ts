import { Transform } from './transform';
import { WidgetInstance } from './widget-instance';

export interface BoardState {
  id: string;
  name: string;
  transform: Transform;
  widgets: WidgetInstance[];
  version: number;
}
