import { WidgetDefinition } from '../../widget-sdk/widget.interface';
import { ImageWidgetComponent } from './image-widget.component';

export const imageWidgetDefinition: WidgetDefinition = {
  type: 'image',
  name: 'Image',
  component: ImageWidgetComponent,
  defaultConfig: { src: '', alt: 'Imported image' }
};
