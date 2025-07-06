'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Network, MoreHorizontal, Plus, Search, Trash2, Users, Edit, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Department } from '@/types/department.type';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Engineering',
      code: 'ENG',
      description: 'Software development and technical operations',
      employeeCount: 24,
      managerName: 'John Doe',
      managerId: '1',
      createdAt: '2022-01-15T10:00:00',
    },
    {
      id: '2',
      name: 'Human Resources',
      code: 'HR',
      description: 'Employee management and recruitment',
      employeeCount: 8,
      managerName: 'Jane Smith',
      managerId: '2',
      createdAt: '2022-01-15T10:00:00',
    },
    {
      id: '3',
      name: 'Marketing',
      code: 'MKT',
      description: 'Marketing and brand management',
      employeeCount: 12,
      managerName: 'Michael Brown',
      managerId: '5',
      createdAt: '2022-03-10T14:30:00',
    },
    {
      id: '4',
      name: 'Finance',
      code: 'FIN',
      description: 'Financial management and accounting',
      employeeCount: 6,
      managerName: 'Sarah Johnson',
      managerId: '7',
      createdAt: '2022-01-15T10:00:00',
    },
    {
      id: '5',
      name: 'Design',
      code: 'DSG',
      description: 'UI/UX and graphic design',
      employeeCount: 10,
      managerName: 'Emily Davis',
      managerId: '4',
      createdAt: '2022-06-22T09:15:00',
    },
    {
      id: '6',
      name: 'Sales',
      code: 'SLS',
      description: 'Sales and business development',
      employeeCount: 15,
      managerName: 'David Wilson',
      managerId: '9',
      createdAt: '2022-02-18T11:45:00',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    code: '',
    description: '',
    managerId: '',
  });

  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    department.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    department.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateDepartment = () => {
    if (newDepartment.name.trim() === '' || newDepartment.code.trim() === '') return;
    
    const newDepartmentData: Department = {
      id: `${departments.length + 1}`,
      name: newDepartment.name,
      code: newDepartment.code.toUpperCase(),
      description: newDepartment.description,
      employeeCount: 0,
      managerName: 'Not Assigned',
      managerId: newDepartment.managerId || '',
      createdAt: new Date().toISOString(),
    };
    
    setDepartments([...departments, newDepartmentData]);
    setNewDepartment({
      name: '',
      code: '',
      description: '',
      managerId: '',
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
              <p className="text-muted-foreground">
                Manage company departments and teams
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Department</DialogTitle>
                  <DialogDescription>
                    Add a new department to your organization structure
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Product Development"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Department Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g., PROD"
                      maxLength={5}
                      value={newDepartment.code}
                      onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value.toUpperCase() })}
                    />
                    <p className="text-xs text-muted-foreground">
                      A short unique identifier (max 5 characters)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of this department"
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateDepartment} 
                    disabled={!newDepartment.name || !newDepartment.code}
                  >
                    Create Department
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Departments</CardTitle>
              <CardDescription>
                View and manage all departments in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900"></div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">Loading...</div>
                        </TableCell>
                      </TableRow>
                    ) : filteredDepartments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center">
                            <Network className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="mt-2 text-gray-500">No departments found</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepartments.map((department) => (
                        <TableRow key={department.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                <Link 
                                  href={`/departments/${department.id}`} 
                                  className="hover:underline hover:text-primary"
                                >
                                  {department.name}
                                </Link>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {department.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{department.code}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4 text-gray-500" />
                              {department.employeeCount}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <UserCircle className="mr-2 h-4 w-4 text-gray-500" />
                              <Link 
                                href={`/employees/${department.managerId}`} 
                                className="hover:underline hover:text-primary"
                              >
                                {department.managerName}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(department.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Link href={`/departments/${department.id}`} className="flex w-full items-center">
                                    View details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/departments/${department.id}/edit`} className="flex w-full items-center">
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
