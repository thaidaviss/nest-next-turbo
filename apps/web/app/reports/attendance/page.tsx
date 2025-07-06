'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, Download, Printer, Search, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: number | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave';
  leaveType?: string;
  notes?: string;
}

interface EmployeeSummary {
  id: string;
  name: string;
  department: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  attendancePercentage: number;
}

export default function AttendanceReportPage() {
  const [selectedMonth, setSelectedMonth] = useState('11'); // November
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Generate mock attendance records for the entire month
  const generateMockRecords = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const employees = [
      { id: 'EMP001', name: 'John Doe', department: 'IT', position: 'Senior Developer' },
      { id: 'EMP002', name: 'Jane Smith', department: 'HR', position: 'HR Manager' },
      { id: 'EMP003', name: 'Robert Johnson', department: 'Marketing', position: 'Marketing Specialist' },
      { id: 'EMP004', name: 'Emily Wilson', department: 'IT', position: 'Junior Developer' },
      { id: 'EMP005', name: 'Michael Brown', department: 'Finance', position: 'Financial Analyst' },
    ];
    
    // Get days in month
    const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    
    // Generate a record for each employee for each day in the month
    employees.forEach(employee => {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
        
        // Skip weekends
        if (isWeekend) continue;
        
        // Randomize some attendance statuses
        let status: AttendanceRecord['status'] = 'present';
        let checkIn: string | null = `09:${Math.floor(Math.random() * 15).toString().padStart(2, '0')}`;
        let checkOut: string | null = `18:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`;
        let hoursWorked: number | null = 9;
        let leaveType: string | undefined = undefined;
        let notes: string | undefined = undefined;
        
        // Randomize some absent/late/leave days
        const rand = Math.random();
        if (rand < 0.05) {
          status = 'absent';
          checkIn = null;
          checkOut = null;
          hoursWorked = 0;
          notes = 'No show, no notice';
        } else if (rand < 0.1) {
          status = 'late';
          checkIn = `10:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`;
          hoursWorked = 8;
          notes = 'Late arrival';
        } else if (rand < 0.15) {
          status = 'leave';
          checkIn = null;
          checkOut = null;
          hoursWorked = 0;
          leaveType = ['Annual', 'Sick', 'Personal', 'Family'][Math.floor(Math.random() * 4)];
          notes = `${leaveType} leave`;
        } else if (rand < 0.18) {
          status = 'half-day';
          checkOut = `13:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`;
          hoursWorked = 4;
          notes = 'Half-day';
        }
        
        records.push({
          id: `${employee.id}-${date}`,
          employeeId: employee.id,
          employeeName: employee.name,
          department: employee.department,
          position: employee.position,
          date,
          checkIn,
          checkOut,
          hoursWorked,
          status,
          leaveType,
          notes
        });
      }
    });
    
    return records;
  };
  
  const [attendanceRecords] = useState<AttendanceRecord[]>(generateMockRecords());
  
  // Filter records based on search term and department
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  // Get unique employees
  const uniqueEmployeeIds = [...new Set(filteredRecords.map(record => record.employeeId))];
  const employeesMap = new Map();
  filteredRecords.forEach(record => {
    if (!employeesMap.has(record.employeeId)) {
      employeesMap.set(record.employeeId, {
        id: record.employeeId,
        name: record.employeeName,
        department: record.department,
        position: record.position
      });
    }
  });
  
  // Create summary for each employee
  const employeeSummaries: EmployeeSummary[] = uniqueEmployeeIds.map(empId => {
    const employeeRecords = filteredRecords.filter(record => record.employeeId === empId);
    const totalDays = employeeRecords.length;
    const presentDays = employeeRecords.filter(r => r.status === 'present').length;
    const absentDays = employeeRecords.filter(r => r.status === 'absent').length;
    const lateDays = employeeRecords.filter(r => r.status === 'late').length;
    const leaveDays = employeeRecords.filter(r => r.status === 'leave').length;
    const halfDays = employeeRecords.filter(r => r.status === 'half-day').length;
    
    const emp = employeesMap.get(empId);
    
    return {
      id: empId,
      name: emp.name,
      department: emp.department,
      totalDays,
      presentDays: presentDays + (halfDays * 0.5),
      absentDays,
      lateDays,
      leaveDays,
      attendancePercentage: totalDays > 0 ? ((presentDays + (halfDays * 0.5)) / totalDays) * 100 : 0
    };
  });
  
  // Calculate summary statistics
  const totalEmployees = uniqueEmployeeIds.length;
  const totalWorkingDays = filteredRecords.length > 0 ? 
    filteredRecords.filter(r => r.employeeId === filteredRecords[0]?.employeeId).length : 0;
  const totalPresent = filteredRecords.filter(r => r.status === 'present').length;
  const totalAbsent = filteredRecords.filter(r => r.status === 'absent').length;
  const totalLeave = filteredRecords.filter(r => r.status === 'leave').length;
  const totalLate = filteredRecords.filter(r => r.status === 'late').length;
  
  // Get status badge
  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-500 hover:bg-red-600">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Late</Badge>;
      case 'half-day':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Half-day</Badge>;
      case 'leave':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Leave</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Get month name
  const getMonthName = (monthNumber: string): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[parseInt(monthNumber) - 1] || monthNumber;
  };
  
  // Handle month navigation
  const handlePrevMonth = () => {
    if (selectedMonth === '1') {
      setSelectedMonth('12');
      setSelectedYear((parseInt(selectedYear) - 1).toString());
    } else {
      setSelectedMonth((parseInt(selectedMonth) - 1).toString().padStart(2, '0'));
    }
  };
  
  const handleNextMonth = () => {
    if (selectedMonth === '12') {
      setSelectedMonth('1'.padStart(2, '0'));
      setSelectedYear((parseInt(selectedYear) + 1).toString());
    } else {
      setSelectedMonth((parseInt(selectedMonth) + 1).toString().padStart(2, '0'));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
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
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">
            {getMonthName(selectedMonth)} {selectedYear}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-1 relative">
            <Search className="h-4 w-4 absolute left-2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
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
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">In selected departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkingDays}</div>
            <p className="text-xs text-muted-foreground">In {getMonthName(selectedMonth)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalWorkingDays > 0 
                ? `${((totalPresent / filteredRecords.length) * 100).toFixed(1)}%` 
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">Present rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absences & Leaves</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAbsent + totalLeave}</div>
            <p className="text-xs text-muted-foreground">Total days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="w-full mb-8">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="summary">Employee Summary</TabsTrigger>
          <TabsTrigger value="daily">Daily Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Summary</CardTitle>
              <CardDescription>
                Employee attendance overview for {getMonthName(selectedMonth)} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-center">Working Days</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Leave</TableHead>
                      <TableHead className="text-center">Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeSummaries.map((summary) => (
                      <TableRow key={summary.id}>
                        <TableCell className="font-medium">
                          <div>{summary.name}</div>
                          <div className="text-xs text-muted-foreground">{summary.id}</div>
                        </TableCell>
                        <TableCell>{summary.department}</TableCell>
                        <TableCell className="text-center">{summary.totalDays}</TableCell>
                        <TableCell className="text-center">{summary.presentDays.toFixed(1)}</TableCell>
                        <TableCell className="text-center">{summary.absentDays}</TableCell>
                        <TableCell className="text-center">{summary.lateDays}</TableCell>
                        <TableCell className="text-center">{summary.leaveDays}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-12 text-right ${
                              summary.attendancePercentage > 90 ? 'text-green-600' :
                              summary.attendancePercentage > 75 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {summary.attendancePercentage.toFixed(1)}%
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance Records</CardTitle>
              <CardDescription>
                Detailed daily attendance records for {getMonthName(selectedMonth)} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords
                      .sort((a, b) => a.date.localeCompare(b.date) || a.employeeName.localeCompare(b.employeeName))
                      .slice(0, 100) // Limit to 100 records to avoid performance issues
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            <div>{record.employeeName}</div>
                            <div className="text-xs text-muted-foreground">{record.employeeId}</div>
                          </TableCell>
                          <TableCell>{record.department}</TableCell>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>{record.hoursWorked !== null ? record.hoursWorked : '-'}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {record.leaveType ? `${record.leaveType} leave` : record.notes || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              {filteredRecords.length > 100 && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Showing 100 of {filteredRecords.length} records. Export to see all records.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

// Missing component
function UserX(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="17" x2="22" y1="8" y2="13" />
      <line x1="22" x2="17" y1="8" y2="13" />
    </svg>
  )
}
