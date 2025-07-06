'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  TooltipProps,
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  PieProps,
  Cell 
} from 'recharts';

import { 
  RevenueData,
  AttendanceData,
  EventData,
  CustomLabelProps
} from '@/types/common.type';
import { ProjectStatusData, ProjectData } from '@/types/project.type';

// Dashboard-specific interfaces
interface DepartmentData {
  name: string;
  employees: number;
  budget: number;
  color: string;
}

interface EmployeeData {
  name: string;
  role: string;
  department: string;
  performance: number;
  avatar: string;
}

// Mock data for charts and tables
const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 35000, expenses: 22000, profit: 13000 },
  { month: 'Feb', revenue: 42000, expenses: 24500, profit: 17500 },
  { month: 'Mar', revenue: 38000, expenses: 23000, profit: 15000 },
  { month: 'Apr', revenue: 45000, expenses: 25000, profit: 20000 },
  { month: 'May', revenue: 48000, expenses: 26000, profit: 22000 },
  { month: 'Jun', revenue: 52000, expenses: 27500, profit: 24500 },
  { month: 'Jul', revenue: 55000, expenses: 28000, profit: 27000 },
];

const attendanceData: AttendanceData[] = [
  { day: 'Mon', present: 95, absent: 5, late: 8 },
  { day: 'Tue', present: 92, absent: 8, late: 10 },
  { day: 'Wed', present: 90, absent: 10, late: 7 },
  { day: 'Thu', present: 94, absent: 6, late: 5 },
  { day: 'Fri', present: 88, absent: 12, late: 15 },
];

const departmentData: DepartmentData[] = [
  { name: 'IT', employees: 42, budget: 180000, color: '#8884d8' },
  { name: 'HR', employees: 18, budget: 90000, color: '#82ca9d' },
  { name: 'Sales', employees: 36, budget: 160000, color: '#ffc658' },
  { name: 'Marketing', employees: 24, budget: 130000, color: '#ff8042' },
  { name: 'Finance', employees: 16, budget: 85000, color: '#0088fe' },
];

const projectStatusData: ProjectStatusData[] = [
  { name: 'Completed', value: 12, color: '#4ade80' },
  { name: 'In Progress', value: 18, color: '#60a5fa' },
  { name: 'Planning', value: 8, color: '#f59e0b' },
  { name: 'On Hold', value: 4, color: '#94a3b8' },
  { name: 'Delayed', value: 3, color: '#ef4444' },
];

const topEmployees: EmployeeData[] = [
  { name: 'Sarah Johnson', role: 'Senior Developer', department: 'IT', performance: 95, avatar: '/avatars/sarah.jpg' },
  { name: 'Michael Chen', role: 'Sales Manager', department: 'Sales', performance: 92, avatar: '/avatars/michael.jpg' },
  { name: 'Emily Davis', role: 'UX Designer', department: 'Marketing', performance: 90, avatar: '/avatars/emily.jpg' },
  { name: 'David Wilson', role: 'Financial Analyst', department: 'Finance', performance: 89, avatar: '/avatars/david.jpg' },
];

const recentProjects: ProjectData[] = [
  { name: 'HR System Upgrade', progress: 85, status: 'In Progress', deadline: '2024-07-30', team: 6 },
  { name: 'Mobile App Development', progress: 60, status: 'In Progress', deadline: '2024-09-15', team: 8 },
  { name: 'New Website Launch', progress: 100, status: 'Completed', deadline: '2024-06-30', team: 5 },
  { name: 'Data Migration', progress: 35, status: 'Delayed', deadline: '2024-08-10', team: 4 },
];

const upcomingEvents: EventData[] = [
  { title: 'Quarterly Review', date: '2024-07-15', type: 'meeting' },
  { title: 'Team Building', date: '2024-07-22', type: 'event' },
  { title: 'Product Launch', date: '2024-08-05', type: 'milestone' },
  { title: 'Annual Conference', date: '2024-09-10', type: 'event' },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      case 'On Hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'meeting':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-600">
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <path d="M21 8H3" />
            <path d="M7 5v2" />
            <path d="M17 5v2" />
          </svg>
        );
      case 'event':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-600">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
      case 'milestone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-amber-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-600">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h18" />
          </svg>
        );
    }
  };

  return (
    <DashboardLayout>
      {/* Header and time range selector */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <circle cx="18" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <path d="M13 6h3a2 2 0 0 1 2 2v7" />
              <path d="M11 18H6a2 2 0 0 1-2-2V6" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Key metrics cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'>
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$345,231.89</div>
            <p className='text-xs text-muted-foreground'>
              <span className="text-green-600">+5.7%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Employees</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'>
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>136</div>
            <p className='text-xs text-muted-foreground'>
              <span className="text-green-600">+12</span> new hires this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Projects</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'>
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>45</div>
            <p className='text-xs text-muted-foreground'>
              <span className="text-amber-600">8</span> due this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Attendance Rate</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'>
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>91.8%</div>
            <p className='text-xs text-muted-foreground'>
              <span className="text-green-600">+2.5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main dashboard content with tabs */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hr">HR Analytics</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Revenue, expenses and profit for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#4f46e5" name="Revenue" />
                    <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
                    <Bar dataKey="profit" fill="#22c55e" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Project Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>Current distribution of projects</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={(props: CustomLabelProps) => `${props.name}: ${props.percent ? (props.percent * 100).toFixed(0) : 0}%`}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any) => [`${value} Projects`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Updates from active projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50">
                      <div className="flex-1">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          <span className="mr-2">{project.team} team members</span>
                          <span>Due: {formatDate(project.deadline)}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full mt-2">
                          <div 
                            className={`h-2 rounded-full ${
                              project.status === 'Delayed' ? 'bg-red-500' : 
                              project.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Projects</Button>
              </CardFooter>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Calendar and scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50">
                      <div className="mt-0.5">
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(event.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Calendar</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* HR Analytics Tab Content */}
        <TabsContent value="hr" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Attendance Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
                <CardDescription>Attendance statistics for the current week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#4ade80" name="Present" />
                    <Bar dataKey="absent" fill="#f87171" name="Absent" />
                    <Bar dataKey="late" fill="#facc15" name="Late" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employee count by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="employees"
                      nameKey="name"
                      label={(props: CustomLabelProps) => props.name}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any) => [`${value} Employees`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Employees with highest performance ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topEmployees.map((employee, index) => (
                  <Card key={index} className="border-none shadow-none bg-slate-50">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{employee.role}</div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-800">
                        {employee.department}
                      </Badge>
                      <div className="mt-3 flex items-center">
                        <div className="font-bold text-lg">{employee.performance}%</div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1 text-green-600">
                          <path d="m13 7-6.5 6.5 3 3L16 10l4-4-7-7Z" />
                          <path d="M9.5 16.5 4.5 15" />
                          <path d="M14.5 11.5 16 4.5" />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Performance Reports</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Projects Tab Content */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Ongoing project schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { name: 'W1', project1: 10, project2: 30, project3: 50 },
                    { name: 'W2', project1: 20, project2: 40, project3: 65 },
                    { name: 'W3', project1: 30, project2: 45, project3: 75 },
                    { name: 'W4', project1: 40, project2: 55, project3: 80 },
                    { name: 'W5', project1: 50, project2: 65, project3: 90 },
                    { name: 'W6', project1: 60, project2: 70, project3: 95 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="project1" name="HR System Upgrade" stroke="#0ea5e9" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="project2" name="Mobile App Dev" stroke="#8b5cf6" />
                    <Line type="monotone" dataKey="project3" name="Website Launch" stroke="#22c55e" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
                <CardDescription>Team allocation by project</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={[
                    { name: 'HR System Upgrade', development: 4, design: 1, qa: 1, management: 1 },
                    { name: 'Mobile App', development: 5, design: 2, qa: 2, management: 1 },
                    { name: 'Website', development: 3, design: 2, qa: 1, management: 1 },
                    { name: 'Data Migration', development: 2, design: 0, qa: 1, management: 1 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="development" stackId="a" fill="#60a5fa" name="Development" />
                    <Bar dataKey="design" stackId="a" fill="#a78bfa" name="Design" />
                    <Bar dataKey="qa" stackId="a" fill="#4ade80" name="QA" />
                    <Bar dataKey="management" stackId="a" fill="#f59e0b" name="Management" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>Projects Overview</CardTitle>
                <CardDescription>Status and progress of all projects</CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  { name: 'HR System Upgrade', progress: 85, status: 'In Progress', team: ['JD', 'SM', 'AK', 'BL'], startDate: '2024-05-10', endDate: '2024-07-30' },
                  { name: 'Mobile App Development', progress: 60, status: 'In Progress', team: ['RJ', 'EW', 'MC', 'TF', 'DH'], startDate: '2024-06-01', endDate: '2024-09-15' },
                  { name: 'New Website Launch', progress: 100, status: 'Completed', team: ['SM', 'PL', 'KR', 'BL'], startDate: '2024-04-15', endDate: '2024-06-30' },
                  { name: 'Data Migration', progress: 35, status: 'Delayed', team: ['JD', 'MC', 'LZ'], startDate: '2024-06-15', endDate: '2024-08-10' },
                ].map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{project.name}</span>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </div>
                      </div>
                      <div className="flex items-center -space-x-2">
                        {project.team.map((initials, idx) => (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          project.status === 'Delayed' ? 'bg-red-500' : 
                          project.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Manage All Projects</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Financial Tab Content */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Monthly revenue and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`]} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#4f46e5" name="Revenue" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Budget</CardTitle>
                <CardDescription>Allocation by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="budget"
                      nameKey="name"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Expenses</CardTitle>
                <CardDescription>Major expense categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Salaries', amount: 180000, percentage: 45 },
                    { category: 'Office Rent', amount: 85000, percentage: 21.25 },
                    { category: 'Software & Tools', amount: 45000, percentage: 11.25 },
                    { category: 'Marketing', amount: 35000, percentage: 8.75 },
                    { category: 'Utilities', amount: 25000, percentage: 6.25 },
                    { category: 'Other', amount: 30000, percentage: 7.5 },
                  ].map((expense, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{expense.category}</span>
                        <span className="font-mono">${expense.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${expense.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-right text-muted-foreground">{expense.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Revenue breakdown by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: 'Product A', amount: 120000, percentage: 34.8, trend: 'up' },
                    { source: 'Product B', amount: 85000, percentage: 24.6, trend: 'up' },
                    { source: 'Services', amount: 65000, percentage: 18.8, trend: 'down' },
                    { source: 'Consulting', amount: 45000, percentage: 13.0, trend: 'stable' },
                    { source: 'Training', amount: 30000, percentage: 8.7, trend: 'up' },
                  ].map((revenue, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-medium">{revenue.source}</span>
                          {revenue.trend === 'up' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1 text-green-600">
                              <path d="m18 15-6-6-6 6"/>
                            </svg>
                          )}
                          {revenue.trend === 'down' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1 text-red-600">
                              <path d="m6 9 6 6 6-6"/>
                            </svg>
                          )}
                        </div>
                        <span className="font-mono">${revenue.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${revenue.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-right text-muted-foreground">{revenue.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
