'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { ArrowUpDown, Briefcase, Calendar, Clock, Edit, MoreHorizontal, Plus, Search, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { SITE_MAP } from '@/constants';

interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  status: 'active' | 'completed' | 'on hold' | 'cancelled';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  teamMembers: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with new branding',
      client: 'Acme Corp',
      status: 'active',
      progress: 65,
      startDate: '2024-04-15',
      endDate: '2024-07-30',
      budget: 35000,
      teamMembers: [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '4', name: 'Sarah Williams' },
      ]
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application for customer engagement',
      client: 'TechGiant Inc',
      status: 'active',
      progress: 40,
      startDate: '2024-03-01',
      endDate: '2024-09-15',
      budget: 120000,
      teamMembers: [
        { id: '1', name: 'John Doe' },
        { id: '3', name: 'Mike Johnson' },
        { id: '5', name: 'David Brown' },
      ]
    },
    {
      id: '3',
      name: 'CRM Integration',
      description: 'Integrate new CRM system with existing company software',
      client: 'Global Services Ltd',
      status: 'on hold',
      progress: 25,
      startDate: '2024-02-10',
      endDate: '2024-06-30',
      budget: 45000,
      teamMembers: [
        { id: '2', name: 'Jane Smith' },
        { id: '5', name: 'David Brown' },
      ]
    },
    {
      id: '4',
      name: 'E-commerce Platform',
      description: 'New e-commerce platform with payment gateway integration',
      client: 'Retail Solutions',
      status: 'completed',
      progress: 100,
      startDate: '2023-11-01',
      endDate: '2024-03-15',
      budget: 85000,
      teamMembers: [
        { id: '1', name: 'John Doe' },
        { id: '4', name: 'Sarah Williams' },
        { id: '3', name: 'Mike Johnson' },
      ]
    },
    {
      id: '5',
      name: 'Data Analytics Dashboard',
      description: 'Real-time data visualization dashboard for management',
      client: 'Data Insights Co',
      status: 'active',
      progress: 80,
      startDate: '2024-01-15',
      endDate: '2024-05-30',
      budget: 65000,
      teamMembers: [
        { id: '3', name: 'Mike Johnson' },
        { id: '5', name: 'David Brown' },
      ]
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
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
              <CardTitle className="text-2xl font-bold">Projects</CardTitle>
              <CardDescription>
                Manage and track all your company projects
              </CardDescription>
            </div>
            <Link href={SITE_MAP.PROJECT_CREATE}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects by name, client or description..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">
                    <div className="flex items-center">
                      Project Name
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline">
                        {project.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{project.description}</p>
                    </TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(project.startDate)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(project.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(project.budget)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="h-2 w-[60px]" />
                        <span className="text-sm text-gray-500">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {project.teamMembers.slice(0, 3).map((member, index) => (
                          <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                            {member.avatar ? (
                              <AvatarImage src={member.avatar} alt={member.name} />
                            ) : (
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        ))}
                        {project.teamMembers.length > 3 && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-gray-100 text-xs">
                            +{project.teamMembers.length - 3}
                          </div>
                        )}
                      </div>
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
                          <DropdownMenuItem>
                            <Link href={`/projects/${project.id}`} className="flex items-center">
                              <Briefcase className="mr-2 h-4 w-4" />
                              View Project
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Manage Team
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
                {filteredProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                      No projects found. Try a different search term or <Link href={SITE_MAP.PROJECT_CREATE} className="text-blue-600 underline">create a new project</Link>.
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
