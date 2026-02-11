import { Type } from '@angular/core';

export interface ConfigSchemaField {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'json';
  label: string;
  required?: boolean;
  options?: string[];
  defaultValue?: unknown;
}

export interface ConfigSchema {
  fields: ConfigSchemaField[];
}

export interface IWidgetComponent<TConfig = unknown, TData = unknown> {
  config: TConfig;
  data?: TData;
  updateConfig(config: Partial<TConfig>): void;
  refreshData(): void;
}

export interface WidgetDefinition<TConfig = unknown> {
  type: string;
  name: string;
  icon?: string;
  component?: Type<unknown>;
  defaultConfig: TConfig;
  configSchema?: ConfigSchema;
}
