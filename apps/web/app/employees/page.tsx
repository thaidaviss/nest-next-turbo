'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { ArrowUpDown, Calendar, Edit, Mail, MoreHorizontal, Phone, Plus, Search, Trash2, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { SITE_MAP } from '@/constants';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'active' | 'on leave' | 'terminated';
  avatar: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      position: 'Software Engineer',
      department: 'Engineering',
      joinDate: '2022-05-15',
      status: 'active',
      avatar: '',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      position: 'HR Manager',
      department: 'Human Resources',
      joinDate: '2020-03-10',
      status: 'active',
      avatar: '',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '+1 (555) 456-7890',
      position: 'Project Manager',
      department: 'Project Management',
      joinDate: '2021-08-22',
      status: 'on leave',
      avatar: '',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 (555) 234-5678',
      position: 'UI/UX Designer',
      department: 'Design',
      joinDate: '2023-01-05',
      status: 'active',
      avatar: '',
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+1 (555) 876-5432',
      position: 'Marketing Specialist',
      department: 'Marketing',
      joinDate: '2022-11-12',
      status: 'terminated',
      avatar: '',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const departments = Array.from(new Set(employees.map(employee => employee.department)));

  const filteredEmployees = employees.filter(employee => 
    (searchQuery === '' || 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterDepartment === null || employee.department === filterDepartment)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'on leave':
        return <Badge variant="secondary" className="bg-amber-500">On Leave</Badge>;
      case 'terminated':
        return <Badge variant="destructive">Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
              <p className="text-muted-foreground">
                Manage all employees in your company
              </p>
            </div>
            <Link href={SITE_MAP.EMPLOYEE_CREATE}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Employees</CardTitle>
              <CardDescription>
                A list of all employees in your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={filterDepartment || ''}
                    onChange={(e) => setFilterDepartment(e.target.value || null)}
                  >
                    <option value="">All Departments</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">
                        <div className="flex items-center">
                          Employee
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
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
                    ) : filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center">
                            <UserCircle className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="mt-2 text-gray-500">No employees found</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-9 w-9 mr-3">
                                <AvatarImage src={employee.avatar} alt={employee.name} />
                                <AvatarFallback className={getAvatarColor(employee.name)}>
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  <Link 
                                    href={`/employees/${employee.id}`} 
                                    className="hover:underline hover:text-primary"
                                  >
                                    {employee.name}
                                  </Link>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Mail className="mr-1 h-3 w-3" />
                                  {employee.email}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {employee.phone}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                              {formatDate(employee.joinDate)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(employee.status)}</TableCell>
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
                                  <Link href={`/employees/${employee.id}`} className="flex w-full items-center">
                                    View details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/employees/${employee.id}/edit`} className="flex w-full items-center">
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
