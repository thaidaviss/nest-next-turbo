'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { AlertCircle, ArrowLeft, Briefcase, Calendar, CheckCircle, Clock, FileText, MessageCircle, Paperclip, Tag, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SITE_MAP } from '@/constants';

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not started' | 'in progress' | 'completed' | 'blocked';
  createdAt: string;
  attachments: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
  }[];
  comments: Comment[];
}

// Sample task data - in a real app, this would be fetched from an API
const taskData: Task = {
  id: '2',
  title: 'Homepage development',
  description: 'Develop the new homepage based on approved wireframes. Ensure mobile responsiveness and cross-browser compatibility. Implement all features according to the design specifications.',
  projectId: '1',
  projectName: 'Website Redesign',
  assigneeId: '1',
  assigneeName: 'John Doe',
  dueDate: '2024-05-15',
  priority: 'high',
  status: 'in progress',
  createdAt: '2024-04-15',
  attachments: [
    {
      id: '1',
      name: 'homepage-wireframe.pdf',
      type: 'pdf',
      size: 2450000,
      uploadedAt: '2024-04-15'
    },
    {
      id: '2',
      name: 'design-specs.docx',
      type: 'docx',
      size: 1250000,
      uploadedAt: '2024-04-16'
    }
  ],
  comments: [
    {
      id: '1',
      authorId: '4',
      authorName: 'Sarah Williams',
      content: 'Please make sure to follow the brand guidelines for colors and typography.',
      createdAt: '2024-04-16T09:30:00'
    },
    {
      id: '2',
      authorId: '1',
      authorName: 'John Doe',
      content: 'I\'ve started working on the navigation component. Will update once it\'s ready for review.',
      createdAt: '2024-04-17T11:45:00'
    }
  ]
};

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: '',
    status: '',
  });
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // In a real application, you would fetch task data from an API
    // For this example, we're using the sample data
    const fetchTask = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Assuming the API returned our sample data
        setTask(taskData);
        setFormData({
          title: taskData.title,
          description: taskData.description,
          assigneeId: taskData.assigneeId,
          priority: taskData.priority,
          status: taskData.status,
        });
        setDueDate(new Date(taskData.dueDate));
        setLoading(false);
      } catch (err) {
        setError('Failed to load task data');
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [taskId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveTask = async () => {
    if (!task) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real app, you would call an API to update the task
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedTask = {
        ...task,
        title: formData.title,
        description: formData.description,
        assigneeId: formData.assigneeId,
        priority: formData.priority as 'low' | 'medium' | 'high',
        status: formData.status as 'not started' | 'in progress' | 'completed' | 'blocked',
        dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : task.dueDate
      };
      
      setTask(updatedTask);
      setEditMode(false);
      setSubmitSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setSubmitError('Failed to update task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would call an API to add the comment
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        authorId: '1', // Current user ID
        authorName: 'John Doe', // Current user name
        content: newComment,
        createdAt: new Date().toISOString()
      };
      
      setTask({
        ...task,
        comments: [newCommentObj, ...task.comments]
      });
      
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <p>Loading task details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !task) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <p className="text-red-500">{error || 'Task not found'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl py-6">
        <div className="mb-6">
          <Link href={SITE_MAP.TASKS} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Tasks
          </Link>
        </div>

        {submitSuccess && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Task has been successfully updated.
            </AlertDescription>
          </Alert>
        )}

        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              {editMode ? (
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="text-2xl font-bold mb-1"
                />
              ) : (
                <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
              )}
              <Link href={`/projects/${task.projectId}`} className="text-sm text-gray-500 flex items-center mt-1 hover:text-blue-600">
                <Briefcase className="h-4 w-4 mr-1" />
                {task.projectName}
              </Link>
            </div>
            
            <div className="space-x-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveTask} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>
                  Edit Task
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                {editMode ? (
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger className={`w-full ${getStatusColor(formData.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not started">Not Started</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
                {editMode ? (
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger className={`w-full ${getPriorityColor(formData.priority)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Due Date</h3>
                {editMode ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {formatDate(task.dueDate)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-4 mb-8">
              <div className="md:col-span-3">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                {editMode ? (
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Assignee</h3>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    {task.assigneeAvatar ? (
                      <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName} />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {task.assigneeName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{task.assigneeName}</span>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="comments" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comments">
                <div className="space-y-6">
                  <div className="p-4 border rounded-md">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-4"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddComment} 
                        disabled={!newComment.trim() || isSubmitting}
                      >
                        {isSubmitting ? 'Posting...' : 'Add Comment'}
                      </Button>
                    </div>
                  </div>
                  
                  {task.comments.length > 0 ? (
                    <div className="space-y-4">
                      {task.comments.map((comment) => (
                        <div key={comment.id} className="p-4 border rounded-md">
                          <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2">
                              {comment.authorAvatar ? (
                                <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                              ) : (
                                <AvatarFallback className="text-xs">
                                  {comment.authorName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{comment.authorName}</p>
                              <p className="text-xs text-gray-500">{formatDateTime(comment.createdAt)}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No comments yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="attachments">
                {task.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {task.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 mr-3 text-blue-500" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • Uploaded on {formatDate(file.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                    
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Upload Attachment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No attachments yet</p>
                    <Button variant="outline" className="mt-4">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Upload Attachment
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between text-xs text-gray-500 border-t pt-4">
            <div>Created on {formatDate(task.createdAt)}</div>
            <div>Task ID: {task.id}</div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
