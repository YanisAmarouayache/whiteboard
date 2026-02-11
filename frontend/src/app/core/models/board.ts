export interface BoardStatePayload {
  widgets: unknown[];
}

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  version: number;
  state: BoardStatePayload;
}
