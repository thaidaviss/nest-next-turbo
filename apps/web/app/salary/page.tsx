'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { ArrowUpDown, Calendar, Download, Edit, Filter, MoreHorizontal, Plus, Printer, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SalaryRecord } from '@/types/salary.type';


export default function SalaryPage() {
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'IT',
      position: 'Senior Developer',
      month: '11',
      year: '2023',
      baseSalary: 5000,
      overtime: 350,
      bonus: 200,
      deductions: 150,
      netPay: 5400,
      status: 'paid',
      paymentDate: '2023-11-28'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      department: 'HR',
      position: 'HR Manager',
      month: '11',
      year: '2023',
      baseSalary: 4500,
      overtime: 0,
      bonus: 300,
      deductions: 120,
      netPay: 4680,
      status: 'paid',
      paymentDate: '2023-11-28'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Robert Johnson',
      department: 'Marketing',
      position: 'Marketing Specialist',
      month: '11',
      year: '2023',
      baseSalary: 3800,
      overtime: 180,
      bonus: 0,
      deductions: 100,
      netPay: 3880,
      status: 'paid',
      paymentDate: '2023-11-28'
    },
    {
      id: '4',
      employeeId: 'EMP004',
      employeeName: 'Emily Wilson',
      department: 'IT',
      position: 'Junior Developer',
      month: '12',
      year: '2023',
      baseSalary: 3200,
      overtime: 250,
      bonus: 0,
      deductions: 80,
      netPay: 3370,
      status: 'processed',
      paymentDate: null
    },
    {
      id: '5',
      employeeId: 'EMP005',
      employeeName: 'Michael Brown',
      department: 'Finance',
      position: 'Financial Analyst',
      month: '12',
      year: '2023',
      baseSalary: 4200,
      overtime: 0,
      bonus: 300,
      deductions: 110,
      netPay: 4390,
      status: 'processed',
      paymentDate: null
    },
    {
      id: '6',
      employeeId: 'EMP006',
      employeeName: 'Sarah Davis',
      department: 'Sales',
      position: 'Sales Executive',
      month: '12',
      year: '2023',
      baseSalary: 3600,
      overtime: 0,
      bonus: 500,
      deductions: 95,
      netPay: 4005,
      status: 'pending',
      paymentDate: null
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter records based on search term and filters
  const filteredRecords = salaryRecords.filter(record => {
    // Filter by search term
    const matchesSearch = 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by month
    const matchesMonth = selectedMonth === 'all' || record.month === selectedMonth;

    // Filter by year
    const matchesYear = selectedYear === 'all' || record.year === selectedYear;

    // Filter by status
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;

    return matchesSearch && matchesMonth && matchesYear && matchesStatus;
  });

  // Calculate totals for summary cards
  const totalSalary = filteredRecords.reduce((total, record) => total + record.netPay, 0);
  const pendingCount = filteredRecords.filter(record => record.status === 'pending').length;
  const processedCount = filteredRecords.filter(record => record.status === 'processed').length;
  const paidCount = filteredRecords.filter(record => record.status === 'paid').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'processed':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Processed</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Payroll Run
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salary Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedCount}</div>
            <p className="text-xs text-muted-foreground">Ready for payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Salaries</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Salary Records</CardTitle>
          <CardDescription>Manage employee salary records and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="01">January</SelectItem>
                  <SelectItem value="02">February</SelectItem>
                  <SelectItem value="03">March</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="05">May</SelectItem>
                  <SelectItem value="06">June</SelectItem>
                  <SelectItem value="07">July</SelectItem>
                  <SelectItem value="08">August</SelectItem>
                  <SelectItem value="09">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Base Salary</TableHead>
                  <TableHead className="text-right">Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div>{record.employeeName}</div>
                      <div className="text-xs text-muted-foreground">{record.employeeId}</div>
                    </TableCell>
                    <TableCell>
                      <div>{record.department}</div>
                      <div className="text-xs text-muted-foreground">{record.position}</div>
                    </TableCell>
                    <TableCell>{`${getMonthName(record.month)} ${record.year}`}</TableCell>
                    <TableCell className="text-right">${record.baseSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${record.netPay.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.paymentDate || '-'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/salary/${record.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Record</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Send Slip</DropdownMenuItem>
                          <DropdownMenuItem>Download Slip</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

// Helper function to get month name
function getMonthName(monthNumber: string): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[parseInt(monthNumber, 10) - 1] || monthNumber;
}

// Missing component definitions - making sure they exist
function Check(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}><polyline points="20 6 9 17 4 12" /></svg>
}

function CheckCircle(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
}

function DollarSign(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
}
