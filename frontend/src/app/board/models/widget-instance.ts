export interface WidgetInstance {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  config: Record<string, unknown>;
}
