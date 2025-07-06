'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { AlertCircle, ArrowUp, Check, Database, Download, FileDown, FileUp, HardDrive, Play, RefreshCcw, RotateCcw, Server, Shield, Terminal, X } from 'lucide-react';

interface DatabaseInfo {
  status: 'connected' | 'disconnected' | 'error';
  type: string;
  version: string;
  uptime: number;
  size: number;
  connections: number;
  tables: number;
  lastBackup: string;
}

interface DatabaseTable {
  name: string;
  rows: number;
  size: string;
  lastUpdated: string;
  hasIndex: boolean;
}

interface MigrationRecord {
  id: string;
  name: string;
  batch: number;
  timestamp: string;
  status: 'pending' | 'applied' | 'failed';
}

export default function DbSettingsPage() {
  // Mock database information
  const [dbInfo, setDbInfo] = useState<DatabaseInfo>({
    status: 'connected',
    type: 'PostgreSQL',
    version: '14.4',
    uptime: 2419200, // 28 days in seconds
    size: 256,
    connections: 12,
    tables: 24,
    lastBackup: '2023-11-29T03:00:00'
  });
  
  // Mock database tables
  const [tables, setTables] = useState<DatabaseTable[]>([
    { name: 'users', rows: 1250, size: '8.4 MB', lastUpdated: '2023-11-30T10:15:22', hasIndex: true },
    { name: 'roles', rows: 12, size: '0.3 MB', lastUpdated: '2023-11-25T16:42:10', hasIndex: true },
    { name: 'permissions', rows: 85, size: '0.6 MB', lastUpdated: '2023-11-25T16:42:12', hasIndex: true },
    { name: 'departments', rows: 8, size: '0.2 MB', lastUpdated: '2023-11-24T09:30:45', hasIndex: true },
    { name: 'employees', rows: 1025, size: '12.8 MB', lastUpdated: '2023-11-30T11:25:18', hasIndex: true },
    { name: 'projects', rows: 48, size: '1.2 MB', lastUpdated: '2023-11-30T09:45:33', hasIndex: true },
    { name: 'tasks', rows: 756, size: '5.6 MB', lastUpdated: '2023-11-30T14:05:12', hasIndex: true },
    { name: 'attendance', rows: 15820, size: '42.5 MB', lastUpdated: '2023-11-30T14:35:02', hasIndex: true },
    { name: 'salaries', rows: 2450, size: '18.3 MB', lastUpdated: '2023-11-30T08:22:51', hasIndex: true },
    { name: 'logs', rows: 128450, size: '86.2 MB', lastUpdated: '2023-11-30T14:36:17', hasIndex: false }
  ]);
  
  // Mock migrations
  const [migrations, setMigrations] = useState<MigrationRecord[]>([
    { id: '01', name: '20230915120000_initial_schema', batch: 1, timestamp: '2023-09-15T12:00:00', status: 'applied' },
    { id: '02', name: '20230920140000_add_user_fields', batch: 1, timestamp: '2023-09-20T14:00:00', status: 'applied' },
    { id: '03', name: '20231001095000_create_departments', batch: 2, timestamp: '2023-10-01T09:50:00', status: 'applied' },
    { id: '04', name: '20231010110000_create_projects', batch: 2, timestamp: '2023-10-10T11:00:00', status: 'applied' },
    { id: '05', name: '20231015150000_create_tasks', batch: 2, timestamp: '2023-10-15T15:00:00', status: 'applied' },
    { id: '06', name: '20231101100000_add_attendance', batch: 3, timestamp: '2023-11-01T10:00:00', status: 'applied' },
    { id: '07', name: '20231105155106_add_salary', batch: 3, timestamp: '2023-11-05T15:51:06', status: 'applied' },
    { id: '08', name: '20231208033938_add_password_length', batch: 3, timestamp: '2023-12-08T03:39:38', status: 'applied' },
    { id: '09', name: '20231210000000_add_notifications', batch: 4, timestamp: '2023-12-10T00:00:00', status: 'pending' }
  ]);
  
  const [connectionString, setConnectionString] = useState('postgresql://postgres:password@localhost:5432/hr_management');
  const [searchTerm, setSearchTerm] = useState('');
  const [backupLocation, setBackupLocation] = useState('/var/backups/database');
  const [backupSchedule, setBackupSchedule] = useState('daily');
  const [migrationCommand, setMigrationCommand] = useState('');
  
  // Filter tables based on search
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format uptime as readable string
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Handle database backup (mock)
  const handleBackup = () => {
    alert('Database backup initiated. This may take a few minutes.');
  };
  
  // Handle migration (mock)
  const handleMigrate = () => {
    alert('Migration initiated. Pending migrations will be applied.');
    // In a real app, this would make an API call and update the migration statuses
    setMigrations(migrations.map(m => 
      m.status === 'pending' ? { ...m, status: 'applied', timestamp: new Date().toISOString() } : m
    ));
  };
  
  // Get status badge for migrations
  const getMigrationBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge className="bg-green-500 hover:bg-green-600">Applied</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Database Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => alert('Reconnected to database')}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reconnect
          </Button>
          <Button variant="outline" onClick={handleBackup}>
            <FileDown className="h-4 w-4 mr-2" />
            Backup Now
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <StatusIcon status={dbInfo.status} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{dbInfo.type}</div>
              <Badge className={`ml-2 ${dbInfo.status === 'connected' ? 'bg-green-500' : dbInfo.status === 'disconnected' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {dbInfo.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">v{dbInfo.version}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbInfo.size} MB</div>
            <p className="text-xs text-muted-foreground">{dbInfo.tables} tables</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbInfo.connections}</div>
            <p className="text-xs text-muted-foreground">Current database connections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTimestamp(dbInfo.lastBackup).split(',')[0]}</div>
            <p className="text-xs text-muted-foreground">At {formatTimestamp(dbInfo.lastBackup).split(', ')[1]}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schema" className="w-full mb-8">
        <TabsList className="grid grid-cols-3 w-[450px]">
          <TabsTrigger value="schema">Database Schema</TabsTrigger>
          <TabsTrigger value="migrations">Migrations</TabsTrigger>
          <TabsTrigger value="settings">DB Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>
                Browse database tables and their statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Schema
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table Name</TableHead>
                      <TableHead className="text-right">Rows</TableHead>
                      <TableHead className="text-right">Size</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Indexed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTables.map((table) => (
                      <TableRow key={table.name}>
                        <TableCell className="font-medium">{table.name}</TableCell>
                        <TableCell className="text-right">{table.rows.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{table.size}</TableCell>
                        <TableCell>{formatTimestamp(table.lastUpdated)}</TableCell>
                        <TableCell>
                          {table.hasIndex ? 
                            <Check className="h-4 w-4 text-green-500" /> : 
                            <X className="h-4 w-4 text-red-500" />
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 p-0 px-2">
                            Browse
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTables.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No tables match your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="migrations">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Database Migrations</CardTitle>
                <CardDescription>
                  Manage database schema migrations
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleMigrate} disabled={!migrations.some(m => m.status === 'pending')}>
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Run Migrations
                </Button>
                <Button variant="outline" size="sm">
                  <FileUp className="h-4 w-4 mr-2" />
                  Create Migration
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Migration</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {migrations.map((migration) => (
                      <TableRow key={migration.id}>
                        <TableCell className="font-medium">{migration.name}</TableCell>
                        <TableCell>{migration.batch}</TableCell>
                        <TableCell>{formatTimestamp(migration.timestamp)}</TableCell>
                        <TableCell>{getMigrationBadge(migration.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Migration Command</h3>
                  <p className="text-sm text-muted-foreground">Run custom migration commands</p>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="npx prisma migrate dev --name add_new_field"
                    value={migrationCommand}
                    onChange={(e) => setMigrationCommand(e.target.value)}
                    className="flex-1"
                  />
                  <Button disabled={!migrationCommand}>
                    <Terminal className="h-4 w-4 mr-2" />
                    Execute
                  </Button>
                </div>
                
                <div className="bg-gray-50 border rounded-md p-4">
                  <h4 className="font-medium mb-2">Quick Commands</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <span className="mr-2">→</span> prisma migrate dev
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <span className="mr-2">→</span> prisma migrate reset
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <span className="mr-2">→</span> prisma db push
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <span className="mr-2">→</span> prisma migrate status
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Database Configuration</CardTitle>
              <CardDescription>
                Configure database connection and backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Connection String</label>
                <Input
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">Database connection URL including authentication</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Backup Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure automated database backups</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Backup Location</label>
                    <Input
                      value={backupLocation}
                      onChange={(e) => setBackupLocation(e.target.value)}
                      placeholder="/var/backups/database"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Backup Schedule</label>
                    <Select value={backupSchedule} onValueChange={setBackupSchedule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select backup frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Retention Policy</label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Performance Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure database performance parameters</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Connections</label>
                    <Input
                      type="number"
                      defaultValue="100"
                      placeholder="100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Connection Timeout (seconds)</label>
                    <Input
                      type="number"
                      defaultValue="30"
                      placeholder="30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Query Timeout (seconds)</label>
                    <Input
                      type="number"
                      defaultValue="60"
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={() => alert('Settings saved successfully!')}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Database Health Check</CardTitle>
          <CardDescription>
            System diagnostics and health metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="text-sm font-medium">CPU Usage</div>
              <div className="text-sm">8.2%</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="text-sm font-medium">Memory Usage</div>
              <div className="text-sm">42.5%</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="text-sm font-medium">Disk I/O</div>
              <div className="text-sm">3.8 MB/s</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Database Uptime</div>
              <div className="text-sm">{formatUptime(dbInfo.uptime)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Latest Migration</div>
              <div className="text-sm">{migrations.filter(m => m.status === 'applied').slice(-1)[0]?.name || 'None'}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Pending Migrations</div>
              <div className="text-sm">{migrations.filter(m => m.status === 'pending').length}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Connection Pool</div>
              <div className="text-sm">{dbInfo.connections}/100 active</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Database Status</h4>
              <Badge className="bg-green-500">Healthy</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              All systems operational. No critical issues detected.
            </p>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-center text-muted-foreground">
              Last health check performed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

// Missing components
function StatusIcon({ status }: { status: string }) {
  if (status === 'connected') {
    return <Check className="h-4 w-4 text-green-500" />;
  } else if (status === 'disconnected') {
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  } else {
    return <X className="h-4 w-4 text-red-500" />;
  }
}

function Search(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function UsersIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
