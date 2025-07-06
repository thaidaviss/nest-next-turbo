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
import { ArrowUpDown, Check, Edit, Lock, MoreHorizontal, Plus, Search, Shield, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissionCount: number;
  isSystem: boolean;
  createdAt: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full access to all systems and settings',
      userCount: 2,
      permissionCount: 48,
      isSystem: true,
      createdAt: '2024-01-10T10:00:00',
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrator with access to most systems',
      userCount: 5,
      permissionCount: 36,
      isSystem: true,
      createdAt: '2024-01-10T10:00:00',
    },
    {
      id: '3',
      name: 'HR Manager',
      description: 'Access to employee records and HR functions',
      userCount: 8,
      permissionCount: 24,
      isSystem: true,
      createdAt: '2024-01-10T10:00:00',
    },
    {
      id: '4',
      name: 'Project Manager',
      description: 'Manage projects and team members',
      userCount: 12,
      permissionCount: 18,
      isSystem: false,
      createdAt: '2024-02-15T14:30:00',
    },
    {
      id: '5',
      name: 'Employee',
      description: 'Standard employee access',
      userCount: 45,
      permissionCount: 10,
      isSystem: true,
      createdAt: '2024-01-10T10:00:00',
    },
    {
      id: '6',
      name: 'Accountant',
      description: 'Access to financial data and reports',
      userCount: 3,
      permissionCount: 15,
      isSystem: false,
      createdAt: '2024-03-22T09:15:00',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRole = () => {
    if (newRole.name.trim() === '') return;
    
    const newRoleData: Role = {
      id: `${roles.length + 1}`,
      name: newRole.name,
      description: newRole.description,
      userCount: 0,
      permissionCount: 0,
      isSystem: false,
      createdAt: new Date().toISOString(),
    };
    
    setRoles([...roles, newRoleData]);
    setNewRole({ name: '', description: '' });
    setIsCreateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
              <p className="text-muted-foreground">
                Manage user roles and permissions
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Add a new role to assign to users
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Marketing Manager"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of this role's responsibilities"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole} disabled={!newRole.name.trim()}>
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Roles</CardTitle>
              <CardDescription>
                Define roles to assign permissions to groups of users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center">
                          Role
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Users</TableHead>
                      <TableHead className="text-center">Permissions</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
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
                    ) : filteredRoles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center">
                            <Shield className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="mt-2 text-gray-500">No roles found</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Shield className="mr-2 h-4 w-4 text-primary" />
                              <Link 
                                href={`/roles/${role.id}`} 
                                className="hover:underline hover:text-primary"
                              >
                                {role.name}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <div className="flex items-center">
                                <Users className="mr-1 h-4 w-4 text-gray-500" />
                                {role.userCount}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <div className="flex items-center">
                                <Lock className="mr-1 h-4 w-4 text-gray-500" />
                                {role.permissionCount}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {role.isSystem ? (
                              <Badge variant="secondary">System</Badge>
                            ) : (
                              <Badge variant="outline">Custom</Badge>
                            )}
                          </TableCell>
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
                                  <Link href={`/roles/${role.id}`} className="flex w-full items-center">
                                    View details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={role.isSystem}>
                                  <Link 
                                    href={role.isSystem ? '#' : `/roles/${role.id}/edit`} 
                                    className="flex w-full items-center"
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600" 
                                  disabled={role.isSystem}
                                >
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
