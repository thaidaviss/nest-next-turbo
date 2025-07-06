import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SITE_MAP } from '@/constants';
import { cn } from '@/lib/utils';
import { Bell, CalendarClock, CheckSquare, FolderDot, UserPlus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { NotificationItemProps } from '@/types/notification.type';

export const NotificationItem = ({ title, description, time, icon, isRead = false }: NotificationItemProps) => {
  return (
    <div className={cn(
      "flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors",
      !isRead && "bg-blue-50"
    )}>
      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full",
        !isRead ? "bg-blue-100" : "bg-gray-100"
      )}>
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className={cn("text-sm font-medium", !isRead && "font-semibold")}>{title}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export const NotificationsDropdown = () => {
  // Sample data - in a real app, this would come from an API or state management
  const notifications = [
    {
      id: '1',
      title: 'New employee added',
      description: 'John Doe has been added to the system',
      time: '5 min ago',
      icon: <UserPlus className="h-4 w-4" />,
      isRead: false
    },
    {
      id: '2',
      title: 'Project update',
      description: 'Website redesign project has been updated',
      time: '1 hour ago',
      icon: <FolderDot className="h-4 w-4" />,
      isRead: false
    },
    {
      id: '3',
      title: 'Task completed',
      description: 'Database migration task has been completed',
      time: '3 hours ago',
      icon: <CheckSquare className="h-4 w-4" />,
      isRead: true
    },
    {
      id: '4',
      title: 'Attendance reminder',
      description: 'Don\'t forget to check-in today',
      time: '12 hours ago',
      icon: <CalendarClock className="h-4 w-4" />,
      isRead: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <Link href={SITE_MAP.NOTIFICATIONS}>
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </div>
        <DropdownMenuSeparator />
        
        {/* Notification Items */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                title={notification.title}
                description={notification.description}
                time={notification.time}
                icon={notification.icon}
                isRead={notification.isRead}
              />
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No notifications
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
