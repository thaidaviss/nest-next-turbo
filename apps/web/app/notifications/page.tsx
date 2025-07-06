'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCircle2, Clock, Info, MailWarning } from 'lucide-react';
import { useState } from 'react';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'warning':
      return <MailWarning className="h-5 w-5 text-amber-500" />;
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'error':
      return <Bell className="h-5 w-5 text-red-500" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'info':
      return 'bg-blue-50 border-blue-200';
    case 'warning':
      return 'bg-amber-50 border-amber-200';
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
  }
};

export default function NotificationsPage() {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Project Assigned',
      message: 'You have been assigned to Project Alpha. Check it out now.',
      type: 'info',
      timestamp: '2025-07-05T09:30:00',
      isRead: false,
    },
    {
      id: '2',
      title: 'Attendance Reminder',
      message: 'Don\'t forget to check-in today!',
      type: 'warning',
      timestamp: '2025-07-05T08:15:00',
      isRead: false,
    },
    {
      id: '3',
      title: 'Task Completed',
      message: 'Your task "Update Database Schema" has been marked as completed by the admin.',
      type: 'success',
      timestamp: '2025-07-04T16:45:00',
      isRead: true,
    },
    {
      id: '4',
      title: 'Salary Processed',
      message: 'Your salary for June 2025 has been processed and will be credited shortly.',
      type: 'success',
      timestamp: '2025-07-01T10:00:00',
      isRead: true,
    },
    {
      id: '5',
      title: 'System Maintenance',
      message: 'The system will undergo maintenance on July 7, 2025, from 10 PM to 2 AM.',
      type: 'error',
      timestamp: '2025-06-30T14:20:00',
      isRead: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with important announcements and updates
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-primary">
                  {unreadCount} unread
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Your latest updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`relative rounded-lg border p-4 transition-colors ${
                          notification.isRead ? 'bg-white' : getNotificationColor(notification.type)
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{notification.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatDate(notification.timestamp)}
                              </div>
                            </div>
                            <p className="mt-1 text-sm">{notification.message}</p>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No notifications yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        When you get notifications, they'll show up here.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
