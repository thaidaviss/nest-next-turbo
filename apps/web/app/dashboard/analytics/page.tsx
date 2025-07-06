'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart,
  Area,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis 
} from 'recharts';

// Type definitions
interface TimeSeriesData {
  date: string;
  value: number;
  previousValue?: number;
}

interface ComparisonData {
  category: string;
  current: number;
  previous: number;
  target: number;
}

interface MetricData {
  name: string;
  value: number;
  change: number;
  target?: number;
  status: 'positive' | 'negative' | 'neutral';
}

interface PerformanceData {
  name: string;
  value: number;
  fullMark: number;
}

interface ScatterData {
  x: number;
  y: number;
  z: number;
  name: string;
}

// Mock data for analytics
const kpiData: MetricData[] = [
  { name: 'Revenue', value: 468950, change: 12.5, target: 500000, status: 'positive' },
  { name: 'Expenses', value: 310680, change: -3.2, target: 300000, status: 'negative' },
  { name: 'Profit Margin', value: 33.75, change: 5.8, target: 35, status: 'positive' },
  { name: 'Employee Satisfaction', value: 87, change: 2.1, target: 90, status: 'positive' },
  { name: 'Project Completion', value: 92.3, change: 1.7, target: 95, status: 'positive' },
  { name: 'Customer Retention', value: 94.1, change: -0.9, target: 95, status: 'negative' },
];

const revenueData = [
  { date: 'Jan', value: 310000, previousValue: 290000 },
  { date: 'Feb', value: 325000, previousValue: 285000 },
  { date: 'Mar', value: 348000, previousValue: 305000 },
  { date: 'Apr', value: 380000, previousValue: 325000 },
  { date: 'May', value: 415000, previousValue: 345000 },
  { date: 'Jun', value: 442000, previousValue: 360000 },
  { date: 'Jul', value: 468950, previousValue: 385000 },
];

const employeeGrowthData = [
  { date: 'Jan', value: 98 },
  { date: 'Feb', value: 105 },
  { date: 'Mar', value: 112 },
  { date: 'Apr', value: 118 },
  { date: 'May', value: 124 },
  { date: 'Jun', value: 129 },
  { date: 'Jul', value: 136 },
];

const projectStatusData = [
  { name: 'Completed', value: 18, color: '#4ade80' },
  { name: 'In Progress', value: 15, color: '#60a5fa' },
  { name: 'Planning', value: 9, color: '#f59e0b' },
  { name: 'On Hold', value: 4, color: '#94a3b8' },
  { name: 'Delayed', value: 3, color: '#ef4444' },
];

const departmentPerformanceData = [
  { department: 'Engineering', efficiency: 85, quality: 92, completion: 88 },
  { department: 'Marketing', efficiency: 78, quality: 80, completion: 92 },
  { department: 'Sales', efficiency: 90, quality: 85, completion: 95 },
  { department: 'HR', efficiency: 82, quality: 90, completion: 88 },
  { department: 'Finance', efficiency: 88, quality: 95, completion: 90 },
];

const skillsRadarData = [
  { subject: 'Technical', A: 90, B: 75, fullMark: 100 },
  { subject: 'Communication', A: 80, B: 90, fullMark: 100 },
  { subject: 'Teamwork', A: 85, B: 90, fullMark: 100 },
  { subject: 'Problem Solving', A: 95, B: 80, fullMark: 100 },
  { subject: 'Time Management', A: 75, B: 85, fullMark: 100 },
  { subject: 'Leadership', A: 70, B: 95, fullMark: 100 },
];

const projectScatterData = [
  { x: 95, y: 28, z: 200000, name: 'Project A' },
  { x: 50, y: 45, z: 350000, name: 'Project B' },
  { x: 75, y: 35, z: 280000, name: 'Project C' },
  { x: 80, y: 12, z: 150000, name: 'Project D' },
  { x: 65, y: 20, z: 220000, name: 'Project E' },
  { x: 90, y: 15, z: 180000, name: 'Project F' },
  { x: 40, y: 8, z: 120000, name: 'Project G' },
  { x: 85, y: 30, z: 300000, name: 'Project H' },
];

const attendanceData = [
  { month: 'Jan', present: 96.2, absent: 2.5, late: 1.3 },
  { month: 'Feb', present: 95.8, absent: 2.8, late: 1.4 },
  { month: 'Mar', present: 94.5, absent: 3.2, late: 2.3 },
  { month: 'Apr', present: 95.2, absent: 2.9, late: 1.9 },
  { month: 'May', present: 96.5, absent: 2.3, late: 1.2 },
  { month: 'Jun', present: 97.1, absent: 1.8, late: 1.1 },
  { month: 'Jul', present: 97.8, absent: 1.5, late: 0.7 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7m');
  const [comparisonType, setComparisonType] = useState('yoy');

  // Helper function to render trend indicator
  const renderTrend = (change: number) => {
    if (change > 0) {
      return (
        <span className="inline-flex items-center text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4">
            <path d="m18 15-6-6-6 6"/>
          </svg>
          {Math.abs(change)}%
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="inline-flex items-center text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4">
            <path d="m6 9 6 6 6-6"/>
          </svg>
          {Math.abs(change)}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4">
          <path d="M8 12h8"/>
        </svg>
        0%
      </span>
    );
  };

  // Format number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Format for currency
  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString()}`;
  };

  // Format for percentage
  const formatPercentage = (num: number) => {
    return `${num}%`;
  };

  // Function to determine color based on progress vs target
  const getProgressColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 0.95) return 'bg-green-500';
    if (ratio >= 0.8) return 'bg-blue-500';
    if (ratio >= 0.6) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getKPIValue = (metric: MetricData) => {
    if (metric.name.includes('Revenue') || metric.name.includes('Expenses')) {
      return formatCurrency(metric.value);
    } else if (
      metric.name.includes('Margin') || 
      metric.name.includes('Rate') || 
      metric.name.includes('Satisfaction') ||
      metric.name.includes('Completion') ||
      metric.name.includes('Retention')
    ) {
      return formatPercentage(metric.value);
    }
    return formatNumber(metric.value);
  };

  return (
    <DashboardLayout>
      {/* Header and filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="7m">Last 7 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={comparisonType} onValueChange={setComparisonType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Comparison Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yoy">Year over Year</SelectItem>
              <SelectItem value="mom">Month over Month</SelectItem>
              <SelectItem value="target">Against Target</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Export Data
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {kpiData.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <div className={`text-sm font-medium ${
                metric.status === 'positive' ? 'text-green-600' : 
                metric.status === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {renderTrend(metric.change)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getKPIValue(metric)}</div>
              {metric.target && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Progress</span>
                    <span>{Math.round((metric.value / metric.target) * 100)}% of {getKPIValue({...metric, value: metric.target})}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(metric.value, metric.target)}`}
                      style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main dashboard content with tabs */}
      <Tabs defaultValue="business" className="mt-6">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Business Analytics Tab */}
        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue with year-over-year comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                    <Tooltip 
                      formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']} 
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="value" name="Current Year" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="previousValue" name="Previous Year" stroke="#94a3b8" fillOpacity={1} fill="url(#colorPrevious)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-muted-foreground">
                <div>Total Revenue YTD: <span className="font-semibold">{formatCurrency(2689950)}</span></div>
                <div>YoY Growth: <span className="font-semibold text-green-600">+21.8%</span></div>
              </CardFooter>
            </Card>

            {/* Financial Health */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Health</CardTitle>
                <CardDescription>Key financial ratios and metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Gross Profit Margin', value: '42.8%', change: 3.2, status: 'positive' },
                  { name: 'Operating Margin', value: '33.7%', change: 5.8, status: 'positive' },
                  { name: 'Net Profit Margin', value: '28.9%', change: 4.5, status: 'positive' },
                  { name: 'Return on Assets', value: '18.2%', change: -0.7, status: 'negative' },
                  { name: 'Debt to Equity', value: '0.32', change: -0.08, status: 'positive' },
                ].map((metric, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{metric.value}</span>
                      <span className={`text-xs ${
                        (metric.status === 'positive' && metric.change !== 0) ? 'text-green-600' : 
                        (metric.status === 'negative' && metric.change !== 0) ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change > 0 && '+'}
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Detailed Report</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Key performance indicators by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="efficiency" name="Efficiency" fill="#60a5fa" />
                    <Bar dataKey="quality" name="Quality" fill="#4ade80" />
                    <Bar dataKey="completion" name="Task Completion" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Analytics */}
            <Card>
              <CardHeader className="flex justify-between items-start">
                <div>
                  <CardTitle>Customer Analytics</CardTitle>
                  <CardDescription>Customer acquisition and retention</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Customer Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="new">New Customers</SelectItem>
                    <SelectItem value="returning">Returning</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'New', value: 32, color: '#4ade80' },
                        { name: 'Returning', value: 68, color: '#3b82f6' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'New', value: 32, color: '#4ade80' },
                        { name: 'Returning', value: 68, color: '#3b82f6' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-blue-800 mb-1">Customer Retention</p>
                    <p className="text-xl font-bold text-blue-900">94.1%</p>
                    <p className="text-xs text-blue-700">-0.9% from last month</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-green-800 mb-1">Acquisition Cost</p>
                    <p className="text-xl font-bold text-green-900">$32.50</p>
                    <p className="text-xs text-green-700">-5.2% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Analytics Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>Current status of all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}: {name: string, percent?: number}) => 
                        `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value: any) => [`${value} Projects`]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="text-xs text-center text-muted-foreground">
                Total of {projectStatusData.reduce((sum, item) => sum + item.value, 0)} projects tracked
              </CardFooter>
            </Card>

            {/* Project Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Project Matrix</CardTitle>
                <CardDescription>Budget vs Timeline performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="Completion %" 
                      domain={[0, 100]} label={{ value: 'Completion %', position: 'bottom' }} />
                    <YAxis type="number" dataKey="y" name="Days Over Schedule" 
                      label={{ value: 'Days Over Schedule', angle: -90, position: 'left' }} />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} name="Budget" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                      formatter={(value: any, name: string) => {
                        if (name === 'Completion %') return [`${value}%`, name];
                        if (name === 'Days Over Schedule') return [`${value} days`, name];
                        if (name === 'Budget') return [`$${value.toLocaleString()}`, name];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Scatter name="Projects" data={projectScatterData} fill="#8884d8" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Size of bubble represents project budget
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>Project Timeline Analysis</CardTitle>
                <CardDescription>Schedule adherence and milestone tracking</CardDescription>
              </div>
              <Select defaultValue="active">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Project Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="active">Active Projects</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {[
                  { 
                    name: 'HR System Upgrade', 
                    startDate: '2025-02-15', 
                    endDate: '2025-08-30', 
                    plannedEnd: '2025-07-30',
                    progress: 85,
                    budget: 180000,
                    spent: 142000,
                    status: 'At Risk'
                  },
                  { 
                    name: 'Mobile App Development', 
                    startDate: '2025-04-01', 
                    endDate: '2025-10-15', 
                    plannedEnd: '2025-09-15',
                    progress: 60,
                    budget: 250000,
                    spent: 140000,
                    status: 'On Track'
                  },
                  { 
                    name: 'New Website Launch', 
                    startDate: '2025-01-15', 
                    endDate: '2025-06-30', 
                    plannedEnd: '2025-07-15',
                    progress: 100,
                    budget: 90000,
                    spent: 85000,
                    status: 'Completed'
                  },
                  { 
                    name: 'Data Migration', 
                    startDate: '2025-05-15', 
                    endDate: '2025-09-10', 
                    plannedEnd: '2025-08-10',
                    progress: 35,
                    budget: 120000,
                    spent: 48000,
                    status: 'Delayed'
                  },
                ].map((project, index) => {
                  const now = new Date();
                  const start = new Date(project.startDate);
                  const end = new Date(project.endDate);
                  const planned = new Date(project.plannedEnd);
                  
                  // Calculate total duration in days
                  const totalDuration = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
                  const plannedDuration = (planned.getTime() - start.getTime()) / (1000 * 3600 * 24);
                  const elapsed = (now.getTime() - start.getTime()) / (1000 * 3600 * 24);
                  
                  // Percentage of time elapsed
                  const timeElapsedPct = Math.min(100, Math.max(0, (elapsed / plannedDuration) * 100));
                  
                  // Budget status
                  const budgetPct = (project.spent / project.budget) * 100;
                  
                  // Colors
                  let statusColor = '';
                  switch(project.status) {
                    case 'Completed': statusColor = 'bg-green-100 text-green-800'; break;
                    case 'On Track': statusColor = 'bg-blue-100 text-blue-800'; break;
                    case 'At Risk': statusColor = 'bg-amber-100 text-amber-800'; break;
                    case 'Delayed': statusColor = 'bg-red-100 text-red-800'; break;
                    default: statusColor = 'bg-gray-100 text-gray-800';
                  }
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={statusColor}>{project.status}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-3">
                        <div>
                          <p className="text-sm mb-1">Progress vs Time</p>
                          <div className="relative h-6 bg-gray-200 rounded-full">
                            {/* Time elapsed bar */}
                            <div 
                              className="absolute h-6 bg-blue-200 rounded-full"
                              style={{ width: `${timeElapsedPct}%` }}
                            ></div>
                            {/* Progress bar */}
                            <div 
                              className="absolute h-6 bg-blue-600 rounded-full"
                              style={{ width: `${Math.min(timeElapsedPct, project.progress)}%` }}
                            ></div>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                              {project.progress}% Complete / {Math.round(timeElapsedPct)}% Time Elapsed
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm mb-1">Budget: ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</p>
                          <div className="relative h-6 bg-gray-200 rounded-full">
                            <div 
                              className={`absolute h-6 rounded-full ${budgetPct > project.progress ? 'bg-amber-500' : 'bg-green-500'}`}
                              style={{ width: `${budgetPct}%` }}
                            ></div>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                              {Math.round(budgetPct)}% of Budget Used
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Project Details</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Employees Analytics Tab */}
        <TabsContent value="employees" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Workforce Growth</CardTitle>
                <CardDescription>Employee headcount over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={employeeGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#60a5fa" name="Employees" />
                    <Line type="monotone" dataKey="value" stroke="#4f46e5" name="Trend" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Current total: 136 employees, 38.8% growth YoY
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employees by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'IT', value: 42, color: '#8884d8' },
                        { name: 'HR', value: 18, color: '#82ca9d' },
                        { name: 'Sales', value: 36, color: '#ffc658' },
                        { name: 'Marketing', value: 24, color: '#ff8042' },
                        { name: 'Finance', value: 16, color: '#0088fe' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {[
                        { name: 'IT', value: 42, color: '#8884d8' },
                        { name: 'HR', value: 18, color: '#82ca9d' },
                        { name: 'Sales', value: 36, color: '#ffc658' },
                        { name: 'Marketing', value: 24, color: '#ff8042' },
                        { name: 'Finance', value: 16, color: '#0088fe' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} employees`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Rate</CardTitle>
                <CardDescription>Attendance statistics by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="present" name="Present" fill="#4ade80" stroke="#22c55e" />
                    <Area type="monotone" dataKey="absent" name="Absent" fill="#f87171" stroke="#ef4444" />
                    <Area type="monotone" dataKey="late" name="Late" fill="#facc15" stroke="#eab308" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>Team A vs Team B skills comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillsRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Team A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Team B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Employee Performance Metrics</CardTitle>
              <CardDescription>Key productivity and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    metric: 'Productivity', 
                    value: 92.5, 
                    change: 3.2, 
                    status: 'positive',
                    chart: [75, 78, 80, 87, 89, 91, 92.5],
                    color: '#4f46e5',
                  },
                  { 
                    metric: 'Satisfaction', 
                    value: 87, 
                    change: 2.1, 
                    status: 'positive',
                    chart: [79, 81, 82, 84, 85, 86, 87],
                    color: '#22c55e',
                  },
                  { 
                    metric: 'Retention', 
                    value: 94, 
                    change: -1.5, 
                    status: 'negative',
                    chart: [97, 96, 95.5, 95, 94.5, 94.2, 94],
                    color: '#f59e0b',
                  },
                  { 
                    metric: 'Training Completion', 
                    value: 78, 
                    change: 8.5, 
                    status: 'positive',
                    chart: [60, 62, 65, 68, 70, 74, 78],
                    color: '#06b6d4',
                  },
                ].map((item, index) => (
                  <Card key={index} className="border-none shadow-sm bg-slate-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{item.metric}</h4>
                        <div className={
                          item.status === 'positive' ? 'text-green-600' : 
                          item.status === 'negative' ? 'text-red-600' : 'text-gray-600'
                        }>
                          {renderTrend(item.change)}
                        </div>
                      </div>
                      <div className="text-2xl font-bold mb-3">{item.value}%</div>
                      <ResponsiveContainer width="100%" height={50}>
                        <LineChart data={item.chart.map((val, i) => ({ value: val }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                          <Line type="monotone" dataKey="value" stroke={item.color} strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                      <p className="text-xs text-muted-foreground mt-2">Last 7 months trend</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Performance Reports</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Trends Analytics Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Key metrics over the past 7 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={[
                      { month: 'Jan', revenue: 310000, projects: 38, employees: 98, satisfaction: 79 },
                      { month: 'Feb', revenue: 325000, projects: 40, employees: 105, satisfaction: 81 },
                      { month: 'Mar', revenue: 348000, projects: 42, employees: 112, satisfaction: 82 },
                      { month: 'Apr', revenue: 380000, projects: 43, employees: 118, satisfaction: 84 },
                      { month: 'May', revenue: 415000, projects: 45, employees: 124, satisfaction: 85 },
                      { month: 'Jun', revenue: 442000, projects: 46, employees: 129, satisfaction: 86 },
                      { month: 'Jul', revenue: 468950, projects: 49, employees: 136, satisfaction: 87 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <YAxis yAxisId="right2" orientation="right" stroke="#ffc658" hide />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} 
                      formatter={(value: any) => [`$${value.toLocaleString()}`]} />
                    <Line yAxisId="right" type="monotone" dataKey="projects" name="Projects" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="employees" name="Employees" stroke="#ffc658" strokeWidth={2} dot={{ r: 4 }} />
                    <Line yAxisId="right2" type="monotone" dataKey="satisfaction" name="Satisfaction %" stroke="#ff8042" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="grid grid-cols-4 gap-4 text-center text-xs">
                <div className="bg-indigo-50 p-2 rounded-md">
                  <p className="text-indigo-800 font-medium">Revenue Growth</p>
                  <p className="text-indigo-900 font-bold">+51.3%</p>
                </div>
                <div className="bg-green-50 p-2 rounded-md">
                  <p className="text-green-800 font-medium">Projects Growth</p>
                  <p className="text-green-900 font-bold">+28.9%</p>
                </div>
                <div className="bg-amber-50 p-2 rounded-md">
                  <p className="text-amber-800 font-medium">Team Growth</p>
                  <p className="text-amber-900 font-bold">+38.8%</p>
                </div>
                <div className="bg-orange-50 p-2 rounded-md">
                  <p className="text-orange-800 font-medium">Satisfaction Trend</p>
                  <p className="text-orange-900 font-bold">+10.1%</p>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Insights</CardTitle>
                <CardDescription>Key growth insights and suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium mb-1 text-blue-900">Revenue Growth Strategy</h4>
                  <p className="text-sm text-blue-800">Revenue growth is strong at +51.3% over the past 7 months. The primary growth drivers are Product A (+34.8%) and Product B (+24.6%).</p>
                  <div className="flex justify-between text-xs mt-2 text-blue-700">
                    <span>Confidence: High</span>
                    <span>Impact: High</span>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                  <h4 className="font-medium mb-1 text-amber-900">Market Opportunity</h4>
                  <p className="text-sm text-amber-800">Services revenue is declining (-5.2%). Data suggests potential for expansion through complementary service offerings aligned with Products A and B.</p>
                  <div className="flex justify-between text-xs mt-2 text-amber-700">
                    <span>Confidence: Medium</span>
                    <span>Impact: High</span>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium mb-1 text-green-900">Operational Efficiency</h4>
                  <p className="text-sm text-green-800">Team productivity has increased by 3.2% while expenses have decreased by 3.2%. Continue optimizing team structure and resource allocation.</p>
                  <div className="flex justify-between text-xs mt-2 text-green-700">
                    <span>Confidence: High</span>
                    <span>Impact: Medium</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Full Strategic Analysis</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Analysis</CardTitle>
                <CardDescription>Forecasted metrics for next quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={[
                      { month: 'Jul', actual: 468950, forecast: 468950 },
                      { month: 'Aug', actual: null, forecast: 495000 },
                      { month: 'Sep', actual: null, forecast: 518000 },
                      { month: 'Oct', actual: null, forecast: 545000 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`]} />
                    <Legend />
                    <Line type="monotone" dataKey="actual" name="Actual Revenue" stroke="#4f46e5" strokeWidth={2} dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="forecast" name="Forecasted Revenue" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Projected Q3 Revenue</p>
                    <p className="text-xl font-bold">$1,558,000</p>
                    <p className="text-xs text-muted-foreground">+16.3% vs Q2</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Projected YE Revenue</p>
                    <p className="text-xl font-bold">$6.2M</p>
                    <p className="text-xs text-muted-foreground">+42.8% YoY</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground text-center">
                Forecast based on historical data, market trends, and seasonal adjustments
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
