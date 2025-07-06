import { ReactNode } from 'react';

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'task' 
  | 'project'
  | 'user' 
  | 'system' 
  | 'attendance';

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  timestamp: Date | string;
  type: NotificationType;
  isRead: boolean;
  userId: string;
  targetId?: string;
  targetType?: string;
  url?: string;
}

export interface NotificationItemProps {
  id?: string;
  title: string;
  description: string;
  time: string;
  icon?: ReactNode;
  isRead?: boolean;
  onClick?: () => void;
}

export interface NotificationCreateInput {
  title: string;
  description: string;
  type: NotificationType;
  userId: string;
  targetId?: string;
  targetType?: string;
  url?: string;
}
