'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SITE_MAP } from '@/constants';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  checked: boolean;
}

export default function CreateRolePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [permissions, setPermissions] = useState<Permission[]>([
    // User management permissions
    { id: '1', name: 'view_users', description: 'View user list', category: 'user', checked: false },
    { id: '2', name: 'create_user', description: 'Create new users', category: 'user', checked: false },
    { id: '3', name: 'edit_user', description: 'Edit user details', category: 'user', checked: false },
    { id: '4', name: 'delete_user', description: 'Delete users', category: 'user', checked: false },
    
    // Role management permissions
    { id: '5', name: 'view_roles', description: 'View roles list', category: 'role', checked: false },
    { id: '6', name: 'create_role', description: 'Create new roles', category: 'role', checked: false },
    { id: '7', name: 'edit_role', description: 'Edit role details', category: 'role', checked: false },
    { id: '8', name: 'delete_role', description: 'Delete roles', category: 'role', checked: false },
    
    // Employee management permissions
    { id: '9', name: 'view_employees', description: 'View employee list', category: 'employee', checked: false },
    { id: '10', name: 'create_employee', description: 'Add new employees', category: 'employee', checked: false },
    { id: '11', name: 'edit_employee', description: 'Edit employee details', category: 'employee', checked: false },
    { id: '12', name: 'delete_employee', description: 'Delete employees', category: 'employee', checked: false },
    
    // Department management permissions
    { id: '13', name: 'view_departments', description: 'View departments', category: 'department', checked: false },
    { id: '14', name: 'create_department', description: 'Create new departments', category: 'department', checked: false },
    { id: '15', name: 'edit_department', description: 'Edit department details', category: 'department', checked: false },
    { id: '16', name: 'delete_department', description: 'Delete departments', category: 'department', checked: false },
    
    // Attendance management permissions
    { id: '17', name: 'view_attendance', description: 'View attendance records', category: 'attendance', checked: false },
    { id: '18', name: 'edit_attendance', description: 'Edit attendance records', category: 'attendance', checked: false },
    { id: '19', name: 'create_attendance_report', description: 'Generate attendance reports', category: 'attendance', checked: false },
    
    // Project management permissions
    { id: '20', name: 'view_projects', description: 'View project list', category: 'project', checked: false },
    { id: '21', name: 'create_project', description: 'Create new projects', category: 'project', checked: false },
    { id: '22', name: 'edit_project', description: 'Edit project details', category: 'project', checked: false },
    { id: '23', name: 'delete_project', description: 'Delete projects', category: 'project', checked: false },
    { id: '24', name: 'assign_project_members', description: 'Assign members to projects', category: 'project', checked: false },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (id: string, checked: boolean) => {
    setPermissions(permissions.map(permission => 
      permission.id === id ? { ...permission, checked } : permission
    ));
  };

  const handleSelectAllInCategory = (category: string, checked: boolean) => {
    setPermissions(permissions.map(permission => 
      permission.category === category ? { ...permission, checked } : permission
    ));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Role name is required');
      return false;
    }

    if (!permissions.some(p => p.checked)) {
      setError('At least one permission must be selected');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here we would call an API to create the role with selected permissions
      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      // Reset form
      setFormData({
        name: '',
        description: '',
      });
      setPermissions(permissions.map(p => ({ ...p, checked: false })));
    } catch (err) {
      setError('Failed to create role. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = Array.from(new Set(permissions.map(p => p.category)));
  
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl py-6">
        <div className="mb-6">
          <Link href={SITE_MAP.ROLES} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Roles
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create New Role</CardTitle>
            <CardDescription>
              Define a new role with specific permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isSuccess && (
              <Alert className="mb-6">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Role has been successfully created.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Project Manager"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of this role's responsibilities"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Permissions</Label>
                  </div>
                  
                  <Tabs defaultValue={categories[0]} className="w-full">
                    <TabsList className="mb-4 flex flex-wrap">
                      {categories.map(category => (
                        <TabsTrigger key={category} value={category} className="capitalize">
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {categories.map(category => (
                      <TabsContent key={category} value={category} className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium capitalize">{category} Permissions</h3>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`select-all-${category}`}
                              onCheckedChange={(checked) => 
                                handleSelectAllInCategory(category, checked === true)
                              }
                              checked={permissions
                                .filter(p => p.category === category)
                                .every(p => p.checked)
                              }
                            />
                            <Label htmlFor={`select-all-${category}`} className="font-normal">
                              Select All
                            </Label>
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          {permissions
                            .filter(p => p.category === category)
                            .map(permission => (
                              <div key={permission.id} className="flex items-center space-x-2 border p-3 rounded-md">
                                <Checkbox 
                                  id={permission.id}
                                  checked={permission.checked}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(permission.id, checked === true)
                                  }
                                />
                                <div>
                                  <Label 
                                    htmlFor={permission.id} 
                                    className="font-medium"
                                  >
                                    {permission.name}
                                  </Label>
                                  <p className="text-xs text-gray-500">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Link href={SITE_MAP.ROLES}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Role"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
