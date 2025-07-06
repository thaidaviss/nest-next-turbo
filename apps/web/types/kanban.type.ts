export type KanbanStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  status: KanbanStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  attachments?: number;
  comments?: number;
  taskId?: string;
  projectId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface KanbanColumn {
  id: KanbanStatus;
  title: string;
  cards: KanbanCard[];
  color?: string;
}

export interface KanbanBoard {
  id: string;
  title: string;
  description?: string;
  columns: KanbanColumn[];
  createdAt: string;
  updatedAt?: string;
}

export interface KanbanFilter {
  assignees?: string[];
  tags?: string[];
  priorities?: string[];
  search?: string;
}
