'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, Calendar, ChevronRight, Clock, Download, Edit, FileText, PlusCircle, Users, Banknote } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SITE_MAP } from '@/constants';
import { Project as ProjectType, ProjectTask, ProjectTeamMember } from '@/types/project.type';

interface Project extends ProjectType {
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
}

// Sample project data - in a real app, this would be fetched from an API
const projectData: Project = {
  id: '1',
  name: 'Website Redesign',
  description: 'Complete overhaul of the company website with new branding, improved user experience, and mobile responsiveness. The project aims to increase user engagement and conversion rates.',
  client: 'Acme Corp',
  status: 'active',
  progress: 65,
  startDate: '2024-04-15',
  endDate: '2024-07-30',
  budget: 35000,
  teamMembers: [
    { id: '1', name: 'John Doe', position: 'Lead Developer' },
    { id: '2', name: 'Jane Smith', position: 'UX Designer' },
    { id: '4', name: 'Sarah Williams', position: 'Project Manager' },
  ],
  tasks: [
    { id: '1', title: 'Wireframe design', status: 'completed', assignee: 'Jane Smith', dueDate: '2024-04-30', priority: 'high' },
    { id: '2', title: 'Homepage development', status: 'in progress', assignee: 'John Doe', dueDate: '2024-05-15', priority: 'high' },
    { id: '3', title: 'User testing', status: 'not started', assignee: 'Sarah Williams', dueDate: '2024-06-01', priority: 'medium' },
    { id: '4', title: 'Content migration', status: 'not started', assignee: 'John Doe', dueDate: '2024-06-15', priority: 'medium' },
    { id: '5', title: 'Mobile optimization', status: 'not started', assignee: 'Jane Smith', dueDate: '2024-07-01', priority: 'high' },
    { id: '6', title: 'SEO implementation', status: 'blocked', assignee: 'Sarah Williams', dueDate: '2024-07-15', priority: 'low' },
  ],
  milestones: [
    { id: '1', title: 'Design approval', dueDate: '2024-05-01', completed: true },
    { id: '2', title: 'Beta launch', dueDate: '2024-06-15', completed: false },
    { id: '3', title: 'Final launch', dueDate: '2024-07-30', completed: false },
  ]
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch project data from an API
    // For this example, we're using the sample data
    const fetchProject = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Assuming the API returned our sample data
        setProject(projectData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load project data');
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'not started':
        return 'bg-gray-100 text-gray-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-800';
      case 'medium':
        return 'bg-yellow-50 text-yellow-800';
      case 'low':
        return 'bg-blue-50 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <p>Loading project details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <p className="text-red-500">{error || 'Project not found'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link href={SITE_MAP.PROJECTS} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Projects
          </Link>
        </div>

        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {project.name} 
              <ChevronRight className="mx-2 h-4 w-4 text-gray-400" /> 
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </h1>
            <p className="mt-1 text-gray-500">Client: {project.client}</p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" className="space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button className="space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">Start:</span>
                  {formatDate(project.startDate)}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">End:</span>
                  {formatDate(project.endDate)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Banknote className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-2xl font-bold">{formatCurrency(project.budget)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{project.progress}%</span>
                  <Badge variant="outline" className={project.progress === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {project.progress === 100 ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{project.description}</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="files">Files & Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    Manage project tasks and track progress
                  </CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Task</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>{formatDate(task.dueDate)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="milestones">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>
                    Track major project milestones
                  </CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Milestone
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Milestone</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.milestones.map((milestone) => (
                      <TableRow key={milestone.id}>
                        <TableCell className="font-medium">
                          {milestone.title}
                        </TableCell>
                        <TableCell>{formatDate(milestone.dueDate)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={milestone.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {milestone.completed ? 'Completed' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Project team and resource allocation
                  </CardDescription>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {project.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center p-4 border rounded-md">
                      <Avatar className="h-12 w-12 mr-4">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback className="text-lg">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.position}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center p-4 border rounded-md border-dashed">
                    <Button variant="ghost" className="h-full w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Team Member
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Files & Documents</CardTitle>
                  <CardDescription>
                    Project files, documentation and resources
                  </CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No files uploaded yet</h3>
                  <p className="text-gray-500 mt-2">
                    Upload project files and documents for easy access
                  </p>
                  <Button className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
