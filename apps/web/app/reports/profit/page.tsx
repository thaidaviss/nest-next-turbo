'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { BarChart3, CalendarRange, ChevronLeft, ChevronRight, Download, LineChart, Printer, TrendingDown, TrendingUp } from 'lucide-react';

interface MonthlyProfit {
  month: string;
  year: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  growthRate: number;
}

interface ProjectProfit {
  id: string;
  name: string;
  client: string;
  totalRevenue: number;
  laborCosts: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  status: 'active' | 'completed' | 'on-hold';
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentageOfTotal: number;
}

export default function ProfitReportPage() {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');

  // Mock data for monthly profit
  const monthlyProfits: MonthlyProfit[] = [
    { month: '07', year: '2023', revenue: 185000, expenses: 142000, profit: 43000, profitMargin: 23.2, growthRate: 2.8 },
    { month: '08', year: '2023', revenue: 192000, expenses: 146000, profit: 46000, profitMargin: 24.0, growthRate: 7.0 },
    { month: '09', year: '2023', revenue: 198000, expenses: 148000, profit: 50000, profitMargin: 25.3, growthRate: 8.7 },
    { month: '10', year: '2023', revenue: 205000, expenses: 153000, profit: 52000, profitMargin: 25.4, growthRate: 4.0 },
    { month: '11', year: '2023', revenue: 218000, expenses: 160000, profit: 58000, profitMargin: 26.6, growthRate: 11.5 },
    { month: '12', year: '2023', revenue: 230000, expenses: 167000, profit: 63000, profitMargin: 27.4, growthRate: 8.6 },
  ];

  // Mock data for project profitability
  const projectProfits: ProjectProfit[] = [
    { id: 'PRJ001', name: 'CRM System Upgrade', client: 'ABC Corporation', totalRevenue: 85000, laborCosts: 45000, expenses: 12000, profit: 28000, profitMargin: 32.9, status: 'active' },
    { id: 'PRJ002', name: 'E-commerce Platform', client: 'XYZ Retail', totalRevenue: 120000, laborCosts: 65000, expenses: 18000, profit: 37000, profitMargin: 30.8, status: 'completed' },
    { id: 'PRJ003', name: 'Mobile App Development', client: 'Tech Innovations', totalRevenue: 45000, laborCosts: 28000, expenses: 5000, profit: 12000, profitMargin: 26.7, status: 'active' },
    { id: 'PRJ004', name: 'IT Infrastructure Upgrade', client: 'Global Services', totalRevenue: 95000, laborCosts: 48000, expenses: 22000, profit: 25000, profitMargin: 26.3, status: 'completed' },
    { id: 'PRJ005', name: 'Business Intelligence Tool', client: 'Data Analytics Inc', totalRevenue: 75000, laborCosts: 42000, expenses: 8000, profit: 25000, profitMargin: 33.3, status: 'active' },
    { id: 'PRJ006', name: 'Cloud Migration', client: 'Secure Banking', totalRevenue: 110000, laborCosts: 58000, expenses: 25000, profit: 27000, profitMargin: 24.5, status: 'on-hold' }
  ];

  // Mock data for expense categories
  const expenseCategories: ExpenseCategory[] = [
    { category: 'Salaries & Benefits', amount: 310000, percentageOfTotal: 52 },
    { category: 'Office Rent', amount: 48000, percentageOfTotal: 8 },
    { category: 'Equipment & Software', amount: 72000, percentageOfTotal: 12 },
    { category: 'Marketing & Sales', amount: 60000, percentageOfTotal: 10 },
    { category: 'Professional Services', amount: 36000, percentageOfTotal: 6 },
    { category: 'Travel & Entertainment', amount: 24000, percentageOfTotal: 4 },
    { category: 'Utilities & Supplies', amount: 30000, percentageOfTotal: 5 },
    { category: 'Miscellaneous', amount: 18000, percentageOfTotal: 3 }
  ];
  
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
  
  const filteredMonthlyData = monthlyProfits.filter(data => {
    const monthsInQuarter = getQuarterMonths(selectedQuarter);
    return data.year === selectedYear && monthsInQuarter.includes(data.month);
  });
  
  // Calculate quarter totals
  const quarterTotalRevenue = filteredMonthlyData.reduce((sum, data) => sum + data.revenue, 0);
  const quarterTotalExpenses = filteredMonthlyData.reduce((sum, data) => sum + data.expenses, 0);
  const quarterTotalProfit = filteredMonthlyData.reduce((sum, data) => sum + data.profit, 0);
  const quarterProfitMargin = quarterTotalRevenue > 0 ? (quarterTotalProfit / quarterTotalRevenue) * 100 : 0;
  
  // Calculate project totals
  const totalProjectRevenue = projectProfits.reduce((sum, proj) => sum + proj.totalRevenue, 0);
  const totalProjectProfit = projectProfits.reduce((sum, proj) => sum + proj.profit, 0);
  const avgProjectMargin = totalProjectRevenue > 0 ? (totalProjectProfit / totalProjectRevenue) * 100 : 0;
  
  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  // Get month name
  const getMonthName = (monthNumber: string): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[parseInt(monthNumber) - 1] || monthNumber;
  };

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

  // Get status indicator
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active': 
        return <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>Active</div>;
      case 'completed':
        return <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>Completed</div>;
      case 'on-hold':
        return <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>On Hold</div>;
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Profit & Loss Report</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
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
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CashIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(quarterTotalRevenue)}</div>
            <p className="text-xs text-muted-foreground">For {selectedQuarter} {selectedYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(quarterTotalExpenses)}</div>
            <p className="text-xs text-muted-foreground">For {selectedQuarter} {selectedYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            {quarterTotalProfit >= 0 ? 
              <TrendingUp className="h-4 w-4 text-green-500" /> :
              <TrendingDown className="h-4 w-4 text-red-500" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${quarterTotalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(quarterTotalProfit)}
            </div>
            <p className="text-xs text-muted-foreground">Profit margin: {formatPercentage(quarterProfitMargin)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Growth</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(filteredMonthlyData.reduce((sum, data) => sum + data.growthRate, 0) / filteredMonthlyData.length)}
            </div>
            <p className="text-xs text-muted-foreground">Month-over-month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="w-full mb-8">
        <TabsList className="grid grid-cols-3 w-[450px]">
          <TabsTrigger value="monthly">Monthly P&L</TabsTrigger>
          <TabsTrigger value="projects">Project Profitability</TabsTrigger>
          <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Profit & Loss</CardTitle>
              <CardDescription>
                Monthly financial performance breakdown for {selectedQuarter} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Expenses</TableHead>
                      <TableHead className="text-right">Profit</TableHead>
                      <TableHead className="text-right">Profit Margin</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMonthlyData.map((data) => (
                      <TableRow key={`${data.month}-${data.year}`}>
                        <TableCell className="font-medium">
                          {getMonthName(data.month)} {data.year}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(data.revenue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(data.expenses)}</TableCell>
                        <TableCell className="text-right">
                          <span className={data.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(data.profit)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{formatPercentage(data.profitMargin)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {data.growthRate > 0 ? 
                              <TrendingUp className="h-4 w-4 mr-2 text-green-500" /> :
                              <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                            }
                            <span className={data.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatPercentage(data.growthRate)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold">
                      <TableCell>Quarter Total</TableCell>
                      <TableCell className="text-right">{formatCurrency(quarterTotalRevenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(quarterTotalExpenses)}</TableCell>
                      <TableCell className="text-right">
                        <span className={quarterTotalProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(quarterTotalProfit)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{formatPercentage(quarterProfitMargin)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue vs. Expenses</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <BarChart3 className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Bar chart visualization will be rendered here
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profit Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <LineChart className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Line chart will be rendered here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Profitability Analysis</CardTitle>
              <CardDescription>
                Profit breakdown by project for the current quarter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Labor Costs</TableHead>
                      <TableHead className="text-right">Expenses</TableHead>
                      <TableHead className="text-right">Profit</TableHead>
                      <TableHead className="text-right">Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectProfits.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <div>{project.name}</div>
                          <div className="text-xs text-muted-foreground">{project.id}</div>
                        </TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>{getStatusIndicator(project.status)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(project.totalRevenue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(project.laborCosts)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(project.expenses)}</TableCell>
                        <TableCell className="text-right">
                          <span className={project.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(project.profit)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={project.profitMargin >= 25 ? 'text-green-600' : 
                                          project.profitMargin >= 15 ? 'text-yellow-600' : 'text-red-600'}>
                            {formatPercentage(project.profitMargin)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">{formatCurrency(totalProjectRevenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(projectProfits.reduce((sum, p) => sum + p.laborCosts, 0))}</TableCell>
                      <TableCell className="text-right">{formatCurrency(projectProfits.reduce((sum, p) => sum + p.expenses, 0))}</TableCell>
                      <TableCell className="text-right">{formatCurrency(totalProjectProfit)}</TableCell>
                      <TableCell className="text-right">{formatPercentage(avgProjectMargin)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Profit Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <BarChart3 className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Bar chart visualization will be rendered here
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Margin Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <PieChart className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Pie chart will be rendered here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                Analysis of expenses by category for {selectedQuarter} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseCategories.map((category) => (
                      <TableRow key={category.category}>
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell className="text-right">{formatCurrency(category.amount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${category.percentageOfTotal}%` }}
                              ></div>
                            </div>
                            <span>{category.percentageOfTotal}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{formatCurrency(expenseCategories.reduce((sum, cat) => sum + cat.amount, 0))}</TableCell>
                      <TableCell>100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Expense Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <PieChart className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Pie chart visualization will be rendered here
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Expense Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-[300px]">
                    <CalendarRange className="w-32 h-32 text-muted-foreground" />
                    <div className="text-sm text-center text-muted-foreground">
                      Line chart will be rendered here
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
function CashIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  )
}

function Receipt(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  )
}

function PieChart(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}
