'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useState } from 'react';
import { Calendar, CalendarClock, Clock, Download, Filter, LogIn, LogOut, RefreshCcw, Search, UserCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  workHours: number | null;
  status: 'present' | 'late' | 'absent' | 'leave' | 'incomplete';
  notes?: string;
}

export default function AttendancePage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'John Doe',
      employeeAvatar: '',
      date: format(today, 'yyyy-MM-dd'),
      checkIn: '09:02:34',
      checkOut: '17:30:15',
      workHours: 8.5,
      status: 'present',
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Jane Smith',
      employeeAvatar: '',
      date: format(today, 'yyyy-MM-dd'),
      checkIn: '08:55:12',
      checkOut: '17:45:22',
      workHours: 8.8,
      status: 'present',
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Robert Johnson',
      employeeAvatar: '',
      date: format(today, 'yyyy-MM-dd'),
      checkIn: '09:30:45',
      checkOut: null,
      workHours: null,
      status: 'incomplete',
      notes: 'On client meeting',
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Emily Davis',
      employeeAvatar: '',
      date: format(today, 'yyyy-MM-dd'),
      checkIn: '10:15:33',
      checkOut: '18:20:10',
      workHours: 8.1,
      status: 'late',
      notes: 'Traffic delay',
    },
    {
      id: '5',
      employeeId: '5',
      employeeName: 'Michael Brown',
      employeeAvatar: '',
      date: format(today, 'yyyy-MM-dd'),
      checkIn: null,
      checkOut: null,
      workHours: null,
      status: 'leave',
      notes: 'Annual leave',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredAttendance = attendance.filter(record => 
    (searchQuery === '' || 
    record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === null || record.status === statusFilter)
  );

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500">Late</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'leave':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Leave</Badge>;
      case 'incomplete':
        return <Badge variant="secondary">Incomplete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateAttendanceSummary = () => {
    const present = attendance.filter(record => record.status === 'present').length;
    const late = attendance.filter(record => record.status === 'late').length;
    const absent = attendance.filter(record => record.status === 'absent').length;
    const leave = attendance.filter(record => record.status === 'leave').length;
    const incomplete = attendance.filter(record => record.status === 'incomplete').length;
    
    return { present, late, absent, leave, incomplete, total: attendance.length };
  };

  const summary = calculateAttendanceSummary();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
              <p className="text-muted-foreground">
                Track and manage employee attendance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  {/* Calendar UI would go here - simplified for now */}
                  <div className="p-4">
                    <p>Calendar would be here</p>
                  </div>
                </PopoverContent>
              </Popover>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="secondary">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.total}</div>
                <p className="text-xs text-muted-foreground">Employees tracked</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600">Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.present}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((summary.present / summary.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-600">Late</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.late}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((summary.late / summary.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.leave}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((summary.leave / summary.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-600">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.absent}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((summary.absent / summary.total) * 100)}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Loading date...'}
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
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={statusFilter || ''}
                    onChange={(e) => setStatusFilter(e.target.value || null)}
                  >
                    <option value="">All Statuses</option>
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Work Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
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
                    ) : filteredAttendance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center">
                            <CalendarClock className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="mt-2 text-gray-500">No attendance records found</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={record.employeeAvatar} alt={record.employeeName} />
                                <AvatarFallback className={getAvatarColor(record.employeeName)}>
                                  {getInitials(record.employeeName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  <Link 
                                    href={`/employees/${record.employeeId}`} 
                                    className="hover:underline hover:text-primary"
                                  >
                                    {record.employeeName}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.checkIn ? (
                              <div className="flex items-center">
                                <LogIn className="mr-2 h-4 w-4 text-green-500" />
                                {record.checkIn}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--:--:--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.checkOut ? (
                              <div className="flex items-center">
                                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                                {record.checkOut}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--:--:--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.workHours !== null ? (
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                {record.workHours.toFixed(1)} hrs
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>
                            {record.notes ? record.notes : <span className="text-muted-foreground">No notes</span>}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Check In</CardTitle>
                <CardDescription>
                  Record your attendance for today
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4 py-6">
                <Link href="/attendance/check-in">
                  <Button size="lg" className="w-40 h-16">
                    <LogIn className="mr-2 h-5 w-5" />
                    Check In
                  </Button>
                </Link>
                <Link href="/attendance/check-out">
                  <Button size="lg" variant="outline" className="w-40 h-16">
                    <LogOut className="mr-2 h-5 w-5" />
                    Check Out
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>
                  View detailed attendance reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/reports/attendance">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Monthly Report
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Employee Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
