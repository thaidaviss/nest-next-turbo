'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Edit, FileText, Mail, MapPin, Phone, User, Briefcase, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SITE_MAP } from '@/constants';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  departmentId: string;
  joinDate: string;
  status: 'active' | 'on leave' | 'terminated';
  avatar: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  salary: number;
}

// Sample data - in a real app, this would come from an API
const employeeData: Employee = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  position: 'Senior Software Engineer',
  department: 'IT',
  departmentId: '1',
  joinDate: '2022-03-15',
  status: 'active',
  avatar: '',
  address: '123 Main Street',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94105',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+1 (555) 987-6543',
  },
  salary: 95000
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params.id as string;
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch employee data from an API
    // For this example, we're using the sample data
    const fetchEmployee = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Assuming the API returned our sample data
        setEmployee(employeeData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load employee data');
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [employeeId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <p>Loading employee details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !employee) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <p className="text-red-500">{error || 'Employee not found'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl py-6">
        <div className="mb-6">
          <Link href={SITE_MAP.EMPLOYEES} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Employees
          </Link>
        </div>

        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              {employee.avatar ? (
                <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
              ) : (
                <AvatarFallback className="text-xl">
                  {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
              <div className="flex items-center mt-1">
                <Briefcase className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-gray-600">{employee.position}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-gray-600">{employee.department}</span>
              </div>
              <div className="mt-1">
                <Badge variant="outline" className={
                  employee.status === 'active' ? 'bg-green-100 text-green-800' : 
                  employee.status === 'on leave' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {employee.status === 'active' ? 'Active' : 
                   employee.status === 'on leave' ? 'On Leave' :
                   'Terminated'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" className="space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button variant="outline" className="space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Personal Details</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{employee.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1">{employee.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="mt-1">
                        {employee.address}<br />
                        {employee.city}, {employee.state} {employee.zipCode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1">{employee.emergencyContact.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1">{employee.emergencyContact.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="employment">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Position</p>
                      <p className="mt-1">{employee.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Department</p>
                      <p className="mt-1">{employee.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Join Date</p>
                      <p className="mt-1">{new Date(employee.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Salary & Compensation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Annual Salary</p>
                      <p className="mt-1">${employee.salary.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Attendance</CardTitle>
                <CardDescription>
                  View employee attendance records and time logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 py-8 text-center">
                  Attendance records will be displayed here.
                  <br />
                  <Link href={SITE_MAP.ATTENDANCE} className="text-blue-600 underline mt-2 block">
                    View full attendance history
                  </Link>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payroll">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payroll History</CardTitle>
                <CardDescription>
                  View employee salary payments and payslips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 py-8 text-center">
                  Payroll information will be displayed here.
                  <br />
                  <span className="text-blue-600 underline mt-2 block">
                    View all payslips
                  </span>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
