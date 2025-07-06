'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { ArrowUpDown, Briefcase, Calendar, CheckCircle, Clock, Edit, MoreHorizontal, Plus, Search, Tag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { SITE_MAP } from '@/constants';
import { Task } from '@/types/task.type';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Wireframe design',
      description: 'Create wireframes for the new homepage layout',
      projectId: '1',
      projectName: 'Website Redesign',
      assigneeId: '2',
      assigneeName: 'Jane Smith',
      dueDate: '2024-04-30',
      priority: 'high',
      status: 'completed',
      createdAt: '2024-04-10'
    },
    {
      id: '2',
      title: 'Homepage development',
      description: 'Develop the new homepage based on approved wireframes',
      projectId: '1',
      projectName: 'Website Redesign',
      assigneeId: '1',
      assigneeName: 'John Doe',
      dueDate: '2024-05-15',
      priority: 'high',
      status: 'in progress',
      createdAt: '2024-04-15'
    },
    {
      id: '3',
      title: 'API integration',
      description: 'Integrate the app with payment gateway API',
      projectId: '2',
      projectName: 'Mobile App Development',
      assigneeId: '1',
      assigneeName: 'John Doe',
      dueDate: '2024-05-20',
      priority: 'medium',
      status: 'not started',
      createdAt: '2024-04-18'
    },
    {
      id: '4',
      title: 'User testing',
      description: 'Conduct user testing sessions with focus group',
      projectId: '1',
      projectName: 'Website Redesign',
      assigneeId: '4',
      assigneeName: 'Sarah Williams',
      dueDate: '2024-06-01',
      priority: 'medium',
      status: 'not started',
      createdAt: '2024-04-20'
    },
    {
      id: '5',
      title: 'Database migration',
      description: 'Migrate existing data to the new CRM structure',
      projectId: '3',
      projectName: 'CRM Integration',
      assigneeId: '5',
      assigneeName: 'David Brown',
      dueDate: '2024-05-10',
      priority: 'high',
      status: 'blocked',
      createdAt: '2024-04-05'
    },
    {
      id: '6',
      title: 'Analytics dashboard',
      description: 'Design and implement real-time analytics dashboard',
      projectId: '5',
      projectName: 'Data Analytics Dashboard',
      assigneeId: '3',
      assigneeName: 'Mike Johnson',
      dueDate: '2024-05-25',
      priority: 'medium',
      status: 'in progress',
      createdAt: '2024-04-12'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assigneeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not started':
        return 'bg-gray-100 text-gray-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-50 text-blue-800';
      case 'medium':
        return 'bg-yellow-50 text-yellow-800';
      case 'high':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    // In a real app, you would call an API to update the task status
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus as any } : task
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Tasks</CardTitle>
              <CardDescription>
                Manage and track all project tasks
              </CardDescription>
            </div>
            <Link href={SITE_MAP.PROJECTS}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  className="max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-4">
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="not started">Not Started</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-40">
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center">
                      Task
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <Link href={`/tasks/${task.id}`} className="text-blue-600 hover:underline">
                        {task.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                    </TableCell>
                    <TableCell>
                      <Link href={`/projects/${task.projectId}`} className="text-sm text-gray-800 hover:underline flex items-center">
                        <Briefcase className="h-3 w-3 mr-1 text-gray-500" />
                        {task.projectName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          {task.assigneeAvatar ? (
                            <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName} />
                          ) : (
                            <AvatarFallback className="text-xs">
                              {task.assigneeName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm">{task.assigneeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                        <span className="text-sm">{formatDate(task.dueDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={task.status} 
                        onValueChange={(value) => handleStatusChange(task.id, value)}
                      >
                        <SelectTrigger className={`w-32 h-8 ${getStatusColor(task.status)} border-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not started">Not Started</SelectItem>
                          <SelectItem value="in progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link href={`/tasks/${task.id}`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Complete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                      No tasks found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
