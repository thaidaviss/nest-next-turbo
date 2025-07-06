'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { BarChart, ChevronLeft, ChevronRight, Download, FileBarChart, LineChart, PieChart, Printer, Search, TrendingUp } from 'lucide-react';

interface DepartmentSalary {
  department: string;
  headCount: number;
  totalSalary: number;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
  percentageOfTotal: number;
}

interface MonthlySalary {
  month: string;
  year: string;
  totalSalary: number;
  headCount: number;
  avgSalary: number;
  bonuses: number;
  overtimePayments: number;
}

export default function SalaryReportPage() {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for department-wise salary distribution
  const departmentSalaries: DepartmentSalary[] = [
    {
      department: 'IT',
      headCount: 12,
      totalSalary: 72000,
      averageSalary: 6000,
      minSalary: 3500,
      maxSalary: 12000,
      percentageOfTotal: 40
    },
    {
      department: 'HR',
      headCount: 5,
      totalSalary: 25000,
      averageSalary: 5000,
      minSalary: 4000,
      maxSalary: 7000,
      percentageOfTotal: 14
    },
    {
      department: 'Marketing',
      headCount: 8,
      totalSalary: 32000,
      averageSalary: 4000,
      minSalary: 3200,
      maxSalary: 6000,
      percentageOfTotal: 18
    },
    {
      department: 'Finance',
      headCount: 6,
      totalSalary: 30000,
      averageSalary: 5000,
      minSalary: 4000,
      maxSalary: 8000,
      percentageOfTotal: 16
    },
    {
      department: 'Sales',
      headCount: 7,
      totalSalary: 21000,
      averageSalary: 3000,
      minSalary: 2500,
      maxSalary: 5000,
      percentageOfTotal: 12
    }
  ];

  // Mock data for monthly salary trends
  const monthlySalaryTrends: MonthlySalary[] = [
    { month: '10', year: '2023', totalSalary: 175000, headCount: 38, avgSalary: 4605, bonuses: 5000, overtimePayments: 3500 },
    { month: '11', year: '2023', totalSalary: 180000, headCount: 38, avgSalary: 4737, bonuses: 6000, overtimePayments: 4000 },
    { month: '12', year: '2023', totalSalary: 185000, headCount: 38, avgSalary: 4868, bonuses: 10000, overtimePayments: 5000 },
    { month: '01', year: '2024', totalSalary: 185000, headCount: 38, avgSalary: 4868, bonuses: 5000, overtimePayments: 4500 },
    { month: '02', year: '2024', totalSalary: 190000, headCount: 39, avgSalary: 4872, bonuses: 5500, overtimePayments: 4200 },
    { month: '03', year: '2024', totalSalary: 195000, headCount: 40, avgSalary: 4875, bonuses: 6000, overtimePayments: 4800 }
  ];

  // Filter departments based on search term
  const filteredDepartments = departmentSalaries.filter(dept => 
    dept.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate totals
  const totalSalary = departmentSalaries.reduce((sum, dept) => sum + dept.totalSalary, 0);
  const totalHeadCount = departmentSalaries.reduce((sum, dept) => sum + dept.headCount, 0);
  const averageSalary = totalHeadCount > 0 ? totalSalary / totalHeadCount : 0;
  
  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get month name
  const getMonthName = (monthNumber: string): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[parseInt(monthNumber) - 1] || monthNumber;
  };

  // Filter monthly data based on quarter
  const getQuarterMonths = (quarter: string): string[] => {
    switch (quarter) {
      case 'Q1': return ['01', '02', '03'];
      case 'Q2': return ['04', '05', '06'];
      case 'Q3': return ['07', '08', '09'];
      case 'Q4': return ['10', '11', '12'];
      default: return ['10', '11', '12'];
    }
  };
  
  const filteredMonthlyData = monthlySalaryTrends.filter(data => {
    const monthsInQuarter = getQuarterMonths(selectedQuarter);
    return data.year === selectedYear && monthsInQuarter.includes(data.month);
  });
  
  // Calculate quarter totals
  const quarterTotalSalary = filteredMonthlyData.reduce((sum, data) => sum + data.totalSalary, 0);
  const quarterTotalBonuses = filteredMonthlyData.reduce((sum, data) => sum + data.bonuses, 0);
  const quarterTotalOvertime = filteredMonthlyData.reduce((sum, data) => sum + data.overtimePayments, 0);

  // Handle quarter navigation
  const handlePrevQuarter = () => {
    if (selectedQuarter === 'Q1') {
      setSelectedQuarter('Q4');
      setSelectedYear((parseInt(selectedYear) - 1).toString());
    } else {
      const currentQ = parseInt(selectedQuarter.charAt(1));
      setSelectedQuarter(`Q${currentQ - 1}`);
    }
  };
  
  const handleNextQuarter = () => {
    if (selectedQuarter === 'Q4') {
      setSelectedQuarter('Q1');
      setSelectedYear((parseInt(selectedYear) + 1).toString());
    } else {
      const currentQ = parseInt(selectedQuarter.charAt(1));
      setSelectedQuarter(`Q${currentQ + 1}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Salary Reports</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevQuarter}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">
            {selectedQuarter} {selectedYear}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextQuarter}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 relative">
            <Search className="h-4 w-4 absolute left-2 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[200px]"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salary Expense</CardTitle>
            <DollarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(quarterTotalSalary)}</div>
            <p className="text-xs text-muted-foreground">For {selectedQuarter} {selectedYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageSalary)}</div>
            <p className="text-xs text-muted-foreground">Per employee</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bonuses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(quarterTotalBonuses)}</div>
            <p className="text-xs text-muted-foreground">Quarterly bonuses paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overtime Expenses</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(quarterTotalOvertime)}</div>
            <p className="text-xs text-muted-foreground">Total overtime pay</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="department" className="w-full mb-8">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="department">Department Analysis</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>Salary Distribution by Department</CardTitle>
              <CardDescription>
                Analysis of salary expenses across different departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-center">Headcount</TableHead>
                      <TableHead className="text-right">Total Salary</TableHead>
                      <TableHead className="text-right">Average Salary</TableHead>
                      <TableHead className="text-right">Min Salary</TableHead>
                      <TableHead className="text-right">Max Salary</TableHead>
                      <TableHead className="text-center">% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.map((dept) => (
                      <TableRow key={dept.department}>
                        <TableCell className="font-medium">{dept.department}</TableCell>
                        <TableCell className="text-center">{dept.headCount}</TableCell>
                        <TableCell className="text-right">{formatCurrency(dept.totalSalary)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(dept.averageSalary)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(dept.minSalary)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(dept.maxSalary)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${dept.percentageOfTotal}%` }}
                              ></div>
                            </div>
                            <span>{dept.percentageOfTotal}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-center">{totalHeadCount}</TableCell>
                      <TableCell className="text-right">{formatCurrency(totalSalary)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(averageSalary)}</TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell>100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Salary Distribution Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <PieChart className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Visual chart will be rendered here
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Department Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <BarChart className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Bar chart will be rendered here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Salary Trends</CardTitle>
              <CardDescription>
                Analysis of monthly salary expenses and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-center">Headcount</TableHead>
                      <TableHead className="text-right">Total Salary</TableHead>
                      <TableHead className="text-right">Average Salary</TableHead>
                      <TableHead className="text-right">Bonuses</TableHead>
                      <TableHead className="text-right">Overtime</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMonthlyData.map((data) => (
                      <TableRow key={`${data.month}-${data.year}`}>
                        <TableCell className="font-medium">
                          {getMonthName(data.month)} {data.year}
                        </TableCell>
                        <TableCell className="text-center">{data.headCount}</TableCell>
                        <TableCell className="text-right">{formatCurrency(data.totalSalary)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(data.avgSalary)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(data.bonuses)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(data.overtimePayments)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(data.totalSalary + data.bonuses + data.overtimePayments)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold">
                      <TableCell>Quarter Total</TableCell>
                      <TableCell className="text-center"></TableCell>
                      <TableCell className="text-right">{formatCurrency(quarterTotalSalary)}</TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right">{formatCurrency(quarterTotalBonuses)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(quarterTotalOvertime)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(quarterTotalSalary + quarterTotalBonuses + quarterTotalOvertime)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Salary Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <LineChart className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Line chart will be rendered here
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <FileBarChart className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Stacked bar chart will be rendered here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

// Missing components
function DollarIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
}

function Clock(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}
