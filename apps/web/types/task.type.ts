import { TaskPriority, TaskStatus } from './project.type';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string;
  progress?: number;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskCreateInput {
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedHours?: number;
  tags?: string[];
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  projectId?: string;
  assigneeId?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  progress?: number;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}
