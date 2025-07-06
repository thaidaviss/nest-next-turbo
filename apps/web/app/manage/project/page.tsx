'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Pencil, Plus, Search, Trash2, CheckCircle, XCircle, PauseCircle, PlayCircle, Clock } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

// Interfaces
interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done' | 'backlog';
  assignee: User;
  dueDate: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  team: User[];
  tasks: Task[];
}

// Mock Data
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', avatar: 'https://github.com/shadcn.png' },
  { id: '2', name: 'Jane Smith', avatar: '' },
  { id: '3', name: 'Robert Johnson', avatar: '' },
  { id: '4', name: 'Sarah Williams', avatar: '' },
  { id: '5', name: 'Michael Brown', avatar: '' },
];

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'E-commerce Platform',
    description: 'Developing a new online shopping platform with Next.js and NestJS.',
    status: 'in-progress',
    startDate: '2024-01-15',
    endDate: '2024-09-30',
    budget: 150000,
    spent: 75000,
    team: [mockUsers[0], mockUsers[1], mockUsers[3]].filter(Boolean) as User[],
    tasks: [
      { id: 'task-1', title: 'Setup project structure', status: 'done', assignee: mockUsers[0]!, dueDate: '2024-02-01' },
      { id: 'task-2', title: 'Design database schema', status: 'in-progress', assignee: mockUsers[1]!, dueDate: '2024-03-15' },
      { id: 'task-3', title: 'Implement authentication', status: 'todo', assignee: mockUsers[3]!, dueDate: '2024-04-10' },
    ],
  },
  {
    id: 'proj-2',
    name: 'Mobile Banking App',
    description: 'A native mobile app for online banking services.',
    status: 'completed',
    startDate: '2023-08-01',
    endDate: '2024-05-20',
    budget: 250000,
    spent: 240000,
    team: [mockUsers[1], mockUsers[2]].filter(Boolean) as User[],
    tasks: [],
  },
  {
    id: 'proj-3',
    name: 'Internal CRM Tool',
    description: 'Customer Relationship Management tool for the sales team.',
    status: 'not-started',
    startDate: '2024-08-01',
    endDate: '2025-02-28',
    budget: 80000,
    spent: 0,
    team: [mockUsers[0], mockUsers[4]].filter(Boolean) as User[],
    tasks: [],
  },
  {
    id: 'proj-4',
    name: 'Data Analytics Dashboard',
    description: 'A dashboard for visualizing company metrics.',
    status: 'on-hold',
    startDate: '2024-03-01',
    endDate: '2024-10-31',
    budget: 120000,
    spent: 30000,
    team: [mockUsers[3], mockUsers[4]].filter(Boolean) as User[],
    tasks: [],
  },
];

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setProjects(mockProjects);
      if (mockProjects.length > 0 && mockProjects[0]) {
        setSelectedProject(mockProjects[0]);
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = useMemo(() => 
    projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [projects, searchQuery]
  );

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setEditedProject({
      name: '',
      description: '',
      status: 'not-started',
      budget: 0,
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      team: [],
      tasks: [],
    });
    setIsEditModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setEditedProject({ ...project });
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProject = () => {
    if (editedProject.id) {
      // Update existing project
      const updatedProjects = projects.map(p => p.id === editedProject.id ? { ...p, ...editedProject } as Project : p)
      setProjects(updatedProjects);
      setSelectedProject({ ...selectedProject!, ...editedProject } as Project);
    } else {
      // Create new project
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        ...editedProject,
      } as Project;
      setProjects([...projects, newProject]);
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProject) return;
    setProjects(projects.filter(p => p.id !== selectedProject.id));
    setSelectedProject(null);
    setIsDeleteModalOpen(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({ ...prev, [name]: name === 'budget' || name === 'spent' ? parseFloat(value) : value }));
  };

  const getStatusProps = (status: Project['status']) => {
    switch (status) {
      case 'in-progress': return { icon: PlayCircle, color: 'blue', label: 'In Progress' };
      case 'completed': return { icon: CheckCircle, color: 'green', label: 'Completed' };
      case 'on-hold': return { icon: PauseCircle, color: 'yellow', label: 'On Hold' };
      case 'cancelled': return { icon: XCircle, color: 'red', label: 'Cancelled' };
      case 'not-started': return { icon: Clock, color: 'gray', label: 'Not Started' };
      default: return { icon: Clock, color: 'gray', label: 'Not Started' };
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <Button onClick={handleCreateProject}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Select a project to view details</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search projects..." className="pl-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="text-center p-8">Loading...</div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredProjects.map(project => {
                      const { icon: Icon, label, color } = getStatusProps(project.status);
                      const progress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
                      return (
                        <div key={project.id} className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedProject?.id === project.id ? 'bg-muted' : ''}`} onClick={() => handleSelectProject(project)}>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium mb-2">{project.name}</h3>
                            <Badge variant="outline" className={`border-${color}-500/50 text-${color}-600 bg-${color}-500/10`}><Icon className="mr-1 h-3 w-3" />{label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                          <Progress value={progress} className="mt-3 h-2" />
                          <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                            <span>{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {!selectedProject ? (
              <Card className="flex items-center justify-center h-full"><CardContent className="text-center"><h2 className="text-xl font-semibold">Select a Project</h2><p className="text-muted-foreground">Choose a project to see its details, tasks, and team.</p></CardContent></Card>
            ) : (
              <Tabs defaultValue="overview" value="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle>{selectedProject.name}</CardTitle>
                        <CardDescription>{selectedProject.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditProject(selectedProject)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteProject(selectedProject)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 border rounded-lg">
                          <Label>Status</Label>
                          <div className="flex items-center mt-1">
                            <div className={`w-2 h-2 rounded-full mr-2 bg-${getStatusProps(selectedProject.status).color}-500`}></div>
                            <p>{getStatusProps(selectedProject.status).label}</p>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg"><Label>Start Date</Label><p>{new Date(selectedProject.startDate).toLocaleDateString()}</p></div>
                        <div className="p-4 border rounded-lg"><Label>End Date</Label><p>{new Date(selectedProject.endDate).toLocaleDateString()}</p></div>
                        <div className="p-4 border rounded-lg"><Label>Team</Label><p>{selectedProject.team.length} members</p></div>
                      </div>
                      <div>
                        <Label>Budget</Label>
                        <Progress value={(selectedProject.spent / selectedProject.budget) * 100} className="mt-2 h-3" />
                        <div className="flex justify-between mt-1 text-sm">
                          <span>{formatCurrency(selectedProject.spent)} Spent</span>
                          <span className="text-muted-foreground">{formatCurrency(selectedProject.budget)} Total</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* Tasks and Team tabs would be here */}
              </Tabs>
            )}
          </div>
        </div>
      </div>

      {/* Edit/Create Project Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editedProject.id ? 'Edit Project' : 'Create New Project'}</DialogTitle>
            <DialogDescription>
              {editedProject.id ? `Update details for ${editedProject.name}` : 'Fill in the details for the new project.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={editedProject.name || ''} onChange={handleEditChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input id="description" name="description" value={editedProject.description || ''} onChange={handleEditChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" value={editedProject.startDate?.split('T')[0] || ''} onChange={handleEditChange} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" name="endDate" type="date" value={editedProject.endDate?.split('T')[0] || ''} onChange={handleEditChange} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input id="budget" name="budget" type="number" value={editedProject.budget || 0} onChange={handleEditChange} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="spent">Spent</Label>
                    <Input id="spent" name="spent" type="number" value={editedProject.spent || 0} onChange={handleEditChange} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select id="status" name="status" value={editedProject.status} onChange={handleEditChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProject}>{editedProject.id ? 'Save Changes' : 'Create Project'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete project "{selectedProject?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
