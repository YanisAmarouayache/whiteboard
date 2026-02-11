import { Injectable } from '@angular/core';
import { Transform } from '../models/transform';

@Injectable()
export class TransformService {
  zoom(current: Transform, delta: number): Transform {
    const scale = Math.min(4, Math.max(0.2, current.scale + delta));
    return { ...current, scale };
  }

  pan(current: Transform, dx: number, dy: number): Transform {
    return { ...current, x: current.x + dx, y: current.y + dy };
  }
}
