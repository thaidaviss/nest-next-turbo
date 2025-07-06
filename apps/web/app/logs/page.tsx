'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { AlertCircle, ArchiveRestore, Calendar, ChevronLeft, ChevronRight, Download, FileWarning, Info, Play, RefreshCcw, Search, ShieldAlert, Trash2, User } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
  level: 'info' | 'warning' | 'error' | 'critical';
}

export default function SystemLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedModule, setSelectedModule] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  
  // Mock log entries
  const [logEntries] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2023-11-30T14:32:45',
      userId: 'admin',
      userName: 'System Admin',
      action: 'User Login',
      module: 'Auth',
      ipAddress: '192.168.1.103',
      details: 'Successful login attempt',
      level: 'info'
    },
    {
      id: '2',
      timestamp: '2023-11-30T14:35:12',
      userId: 'admin',
      userName: 'System Admin',
      action: 'Configuration Change',
      module: 'Settings',
      ipAddress: '192.168.1.103',
      details: 'Updated email server configuration',
      level: 'info'
    },
    {
      id: '3',
      timestamp: '2023-11-30T15:01:23',
      userId: 'jdoe',
      userName: 'John Doe',
      action: 'User Login',
      module: 'Auth',
      ipAddress: '192.168.1.105',
      details: 'Successful login attempt',
      level: 'info'
    },
    {
      id: '4',
      timestamp: '2023-11-30T15:12:38',
      userId: 'jdoe',
      userName: 'John Doe',
      action: 'Record Update',
      module: 'Employee',
      ipAddress: '192.168.1.105',
      details: 'Updated employee record ID: EMP005',
      level: 'info'
    },
    {
      id: '5',
      timestamp: '2023-11-30T15:45:19',
      userId: 'unknown',
      userName: 'Unknown',
      action: 'Failed Login',
      module: 'Auth',
      ipAddress: '203.0.113.42',
      details: 'Failed login attempt with username: admin',
      level: 'warning'
    },
    {
      id: '6',
      timestamp: '2023-11-30T16:05:33',
      userId: 'system',
      userName: 'System',
      action: 'Database Backup',
      module: 'Database',
      ipAddress: 'localhost',
      details: 'Scheduled database backup completed successfully',
      level: 'info'
    },
    {
      id: '7',
      timestamp: '2023-11-30T16:22:08',
      userId: 'jsmith',
      userName: 'Jane Smith',
      action: 'Permission Change',
      module: 'User',
      ipAddress: '192.168.1.110',
      details: 'Modified role permissions for role: HR Manager',
      level: 'warning'
    },
    {
      id: '8',
      timestamp: '2023-11-30T17:12:45',
      userId: 'system',
      userName: 'System',
      action: 'Server Error',
      module: 'API',
      ipAddress: 'localhost',
      details: 'Internal server error on endpoint /api/reports/generate: Maximum execution time exceeded',
      level: 'error'
    },
    {
      id: '9',
      timestamp: '2023-11-30T17:30:22',
      userId: 'rbrown',
      userName: 'Robert Brown',
      action: 'Record Delete',
      module: 'Project',
      ipAddress: '192.168.1.115',
      details: 'Deleted project record ID: PRJ008',
      level: 'warning'
    },
    {
      id: '10',
      timestamp: '2023-11-30T18:05:19',
      userId: 'system',
      userName: 'System',
      action: 'Security Alert',
      module: 'Security',
      ipAddress: '203.0.113.42',
      details: 'Multiple failed login attempts detected from same IP address',
      level: 'critical'
    },
    {
      id: '11',
      timestamp: '2023-11-30T18:22:37',
      userId: 'admin',
      userName: 'System Admin',
      action: 'User Block',
      module: 'Security',
      ipAddress: '192.168.1.103',
      details: 'Blocked user account: testuser due to suspicious activity',
      level: 'warning'
    },
    {
      id: '12',
      timestamp: '2023-11-30T19:01:05',
      userId: 'system',
      userName: 'System',
      action: 'Cache Purge',
      module: 'Cache',
      ipAddress: 'localhost',
      details: 'Redis cache purged successfully',
      level: 'info'
    }
  ]);
  
  // Get unique modules for filter dropdown
  const modules = Array.from(new Set(logEntries.map(entry => entry.module)));
  
  // Filter log entries based on search and filters
  const filteredLogs = logEntries.filter(log => {
    // Filter by search term
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by level
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    
    // Filter by module
    const matchesModule = selectedModule === 'all' || log.module === selectedModule;
    
    return matchesSearch && matchesLevel && matchesModule;
  });
  
  // Count logs by level for summary cards
  const infoCount = logEntries.filter(log => log.level === 'info').length;
  const warningCount = logEntries.filter(log => log.level === 'warning').length;
  const errorCount = logEntries.filter(log => log.level === 'error').length;
  const criticalCount = logEntries.filter(log => log.level === 'critical').length;
  
  // Get level badge
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Info</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-500 hover:bg-red-600">Error</Badge>;
      case 'critical':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Critical</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline">
            <ArchiveRestore className="h-4 w-4 mr-2" />
            Archive
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info Events</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{infoCount}</div>
            <p className="text-xs text-muted-foreground">Normal system operations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningCount}</div>
            <p className="text-xs text-muted-foreground">Potential issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <FileWarning className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorCount}</div>
            <p className="text-xs text-muted-foreground">System errors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <ShieldAlert className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Urgent attention needed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Activity Logs</CardTitle>
          <CardDescription>Review all system activities and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {modules.map(module => (
                    <SelectItem key={module} value={module}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{log.userName}</div>
                          <div className="text-xs text-muted-foreground">{log.userId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.module}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                    <TableCell>{getLevelBadge(log.level)}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No log entries match your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {logEntries.length} log entries
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <span className="text-sm">Page 1 of 1</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground mb-8">
        <p className="mb-2">Log retention policy: System logs are retained for 90 days. Security-related logs are retained for 1 year.</p>
        <p>For complete audit logs or archived logs, please contact the system administrator.</p>
      </div>
    </DashboardLayout>
  );
}
