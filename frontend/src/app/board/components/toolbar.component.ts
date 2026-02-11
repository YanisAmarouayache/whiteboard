import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardStateService } from '../board-state.service';
import { Board } from '../../core/models/board';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() boards: Board[] = [];
  @Input() selectedBoardId = '';
  @Output() readonly boardChange = new EventEmitter<string>();

  constructor(private readonly boardState: BoardStateService) {}

  undo(): void {
    this.boardState.undo();
  }

  redo(): void {
    this.boardState.redo();
  }

  onBoardSelect(boardId: string): void {
    this.boardChange.emit(boardId);
  }
}
