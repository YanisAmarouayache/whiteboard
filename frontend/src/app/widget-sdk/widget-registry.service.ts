import { Injectable } from '@angular/core';
import { WidgetDefinition } from './widget.interface';

@Injectable({ providedIn: 'root' })
export class WidgetRegistryService {
  private readonly registry = new Map<string, WidgetDefinition>();

  register(definition: WidgetDefinition): void {
    this.registry.set(definition.type, definition);
  }

  unregister(type: string): void {
    this.registry.delete(type);
  }

  get(type: string): WidgetDefinition | undefined {
    return this.registry.get(type);
  }

  list(): WidgetDefinition[] {
    return [...this.registry.values()];
  }

  async loadExternalWidget(url: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load external widget: ${url}`));
      document.body.appendChild(script);
    });
  }
}
