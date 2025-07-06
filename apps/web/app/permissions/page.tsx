'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { ArrowUpDown, Check, Edit, FolderKey, Key, Lock, MoreHorizontal, Plus, Search, Shield, Trash2, Users } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  key: string;
  description: string;
  module: string;
  isSystem: boolean;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: '1',
      name: 'View Users',
      key: 'users:view',
      description: 'View user list and details',
      module: 'User Management',
      isSystem: true,
    },
    {
      id: '2',
      name: 'Create Users',
      key: 'users:create',
      description: 'Create new users in the system',
      module: 'User Management',
      isSystem: true,
    },
    {
      id: '3',
      name: 'Edit Users',
      key: 'users:edit',
      description: 'Edit existing user information',
      module: 'User Management',
      isSystem: true,
    },
    {
      id: '4',
      name: 'Delete Users',
      key: 'users:delete',
      description: 'Delete users from the system',
      module: 'User Management',
      isSystem: true,
    },
    {
      id: '5',
      name: 'View Projects',
      key: 'projects:view',
      description: 'View project list and details',
      module: 'Project Management',
      isSystem: true,
    },
    {
      id: '6',
      name: 'Create Projects',
      key: 'projects:create',
      description: 'Create new projects in the system',
      module: 'Project Management',
      isSystem: true,
    },
    {
      id: '7',
      name: 'Edit Projects',
      key: 'projects:edit',
      description: 'Edit existing project information',
      module: 'Project Management',
      isSystem: true,
    },
    {
      id: '8',
      name: 'Delete Projects',
      key: 'projects:delete',
      description: 'Delete projects from the system',
      module: 'Project Management',
      isSystem: true,
    },
    {
      id: '9',
      name: 'View Attendance',
      key: 'attendance:view',
      description: 'View attendance records',
      module: 'HR',
      isSystem: true,
    },
    {
      id: '10',
      name: 'Manage Attendance',
      key: 'attendance:manage',
      description: 'Create and edit attendance records',
      module: 'HR',
      isSystem: true,
    },
    {
      id: '11',
      name: 'View Salary',
      key: 'salary:view',
      description: 'View salary information',
      module: 'Finance',
      isSystem: true,
    },
    {
      id: '12',
      name: 'Manage Salary',
      key: 'salary:manage',
      description: 'Create and edit salary information',
      module: 'Finance',
      isSystem: true,
    },
    {
      id: '13',
      name: 'View Reports',
      key: 'reports:view',
      description: 'Access to view all reports',
      module: 'Reports',
      isSystem: true,
    },
    {
      id: '14',
      name: 'View System Logs',
      key: 'system:logs',
      description: 'Access system logs',
      module: 'System',
      isSystem: true,
    },
    {
      id: '15',
      name: 'Manage Redis Cache',
      key: 'system:cache',
      description: 'Manage Redis cache settings',
      module: 'System',
      isSystem: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPermission, setNewPermission] = useState({
    name: '',
    key: '',
    description: '',
    module: '',
  });

  const modules = Array.from(new Set(permissions.map(permission => permission.module)));

  const filteredPermissions = permissions.filter(permission => 
    (searchQuery === '' || 
    permission.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    permission.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedModule === null || permission.module === selectedModule)
  );

  const handleCreatePermission = () => {
    if (
      newPermission.name.trim() === '' || 
      newPermission.key.trim() === '' || 
      newPermission.module.trim() === ''
    ) return;
    
    const newPermissionData: Permission = {
      id: `${permissions.length + 1}`,
      name: newPermission.name,
      key: newPermission.key,
      description: newPermission.description,
      module: newPermission.module,
      isSystem: false,
    };
    
    setPermissions([...permissions, newPermissionData]);
    setNewPermission({
      name: '',
      key: '',
      description: '',
      module: '',
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
              <p className="text-muted-foreground">
                Manage fine-grained permissions for user roles
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Permission
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Permission</DialogTitle>
                  <DialogDescription>
                    Add a new permission that can be assigned to roles
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Permission Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., View Reports"
                      value={newPermission.name}
                      onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key">Permission Key</Label>
                    <Input
                      id="key"
                      placeholder="e.g., reports:view"
                      value={newPermission.key}
                      onChange={(e) => setNewPermission({ ...newPermission, key: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: resource:action (lowercase with no spaces)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of this permission"
                      value={newPermission.description}
                      onChange={(e) => setNewPermission({ ...newPermission, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module">Module</Label>
                    <Input
                      id="module"
                      placeholder="e.g., Reports, User Management"
                      value={newPermission.module}
                      onChange={(e) => setNewPermission({ ...newPermission, module: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreatePermission} 
                    disabled={!newPermission.name || !newPermission.key || !newPermission.module}
                  >
                    Create Permission
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Permissions</CardTitle>
              <CardDescription>
                Detailed list of all permissions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FolderKey className="h-4 w-4 text-gray-500" />
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedModule || ''}
                    onChange={(e) => setSelectedModule(e.target.value || null)}
                  >
                    <option value="">All Modules</option>
                    {modules.map((module) => (
                      <option key={module} value={module}>
                        {module}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Permission
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Module</TableHead>
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
                    ) : filteredPermissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center">
                            <Key className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="mt-2 text-gray-500">No permissions found</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPermissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Lock className="mr-2 h-4 w-4 text-primary" />
                              {permission.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                              {permission.key}
                            </code>
                          </TableCell>
                          <TableCell>{permission.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{permission.module}</Badge>
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
                                <DropdownMenuItem disabled={permission.isSystem}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600" 
                                  disabled={permission.isSystem}
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
