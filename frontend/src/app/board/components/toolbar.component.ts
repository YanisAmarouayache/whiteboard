import { Component } from '@angular/core';
import { BoardStateService } from '../board-state.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  constructor(private readonly boardState: BoardStateService) {}

  undo(): void {
    this.boardState.undo();
  }

  redo(): void {
    this.boardState.redo();
  }
}
