export type ProjectStatus =
  | "active"
  | "on hold"
  | "cancelled"
  | "In Progress"
  | "Completed"
  | "Delayed";
export type TaskStatus = 'not started' | 'in progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ProjectTeamMember {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  role?: string;
  joinedDate?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: string;
  assigneeId?: string;
  assigneeAvatar?: string;
  dueDate: string;
  priority: TaskPriority;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  teamMembers: ProjectTeamMember[];
  tasks: ProjectTask[];
  managerId?: string;
  manager?: string;
  department?: string;
  departmentId?: string;
  createdAt?: string;
  updatedAt?: string;
  completedTasks?: number;
  totalTasks?: number;
}

export interface ProjectCreateInput {
  name: string;
  description: string;
  client: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  managerId?: string;
  departmentId?: string;
  teamMembers?: string[];
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  client?: string;
  status?: ProjectStatus;
  progress?: number;
  startDate?: string;
  endDate?: string;
  budget?: number;
  managerId?: string;
  departmentId?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  progress: number;
  status: ProjectStatus;
  dueDate: string;
  tasksCompleted: number;
  totalTasks: number;
}

export interface ProjectStatusData {
  name: ProjectStatus;
  value: number;
}
