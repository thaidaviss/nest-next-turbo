'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Play, Pause, RefreshCw, Save, Trash2, Upload } from 'lucide-react';

export default function SystemConfigPage() {
  const [backupInterval, setBackupInterval] = useState<number>(24);
  const [logLevel, setLogLevel] = useState<string>("info");
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [jobQueueStatus, setJobQueueStatus] = useState<string>("running");
  const [cacheStatus, setCacheStatus] = useState<string>("connected");
  const [lastBackup, setLastBackup] = useState<string>("2024-07-17 03:00:00");
  const [backupStatus, setBackupStatus] = useState<string>("success");
  const [systemVersion, setSystemVersion] = useState<string>("v2.5.3");
  
  // Mock successful operation toast
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const handleSaveConfig = () => {
    // Simulate saving configuration
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const toggleMaintenanceMode = () => {
    setMaintenanceMode(!maintenanceMode);
    // Here you would make an API call to update the maintenance mode
  };

  const toggleJobQueue = () => {
    const newStatus = jobQueueStatus === "running" ? "paused" : "running";
    setJobQueueStatus(newStatus);
    // Here you would make an API call to update the job queue status
  };

  const clearCache = () => {
    // Simulate cache clearing operation
    setCacheStatus("clearing");
    setTimeout(() => setCacheStatus("connected"), 1500);
  };

  const triggerBackup = () => {
    // Simulate backup operation
    setBackupStatus("in-progress");
    setTimeout(() => {
      setBackupStatus("success");
      setLastBackup(new Date().toISOString().replace('T', ' ').substring(0, 19));
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Configuration</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSaveConfig}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {showSuccessToast && (
        <Alert className="mb-6 bg-green-50 border-green-500">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Configuration changes have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {maintenanceMode && (
        <Alert className="mb-6 bg-amber-50 border-amber-500">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>Maintenance Mode Active</AlertTitle>
          <AlertDescription>
            The system is currently in maintenance mode. Only administrators can access the application.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span>System</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-600">Online</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Cache</span>
              <Badge variant={cacheStatus === "connected" ? "outline" : "secondary"} className={cacheStatus === "connected" ? "bg-green-50 text-green-600 border-green-600" : ""}>
                {cacheStatus === "clearing" ? "Clearing..." : "Connected"}
              </Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Database</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-600">Connected</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Job Queue</span>
              <Badge variant={jobQueueStatus === "running" ? "outline" : "secondary"} className={jobQueueStatus === "running" ? "bg-green-50 text-green-600 border-green-600" : ""}>
                {jobQueueStatus === "running" ? "Running" : "Paused"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Storage</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-600">84% Free</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Backup Status</CardTitle>
            <CardDescription>Latest backup information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span>Last Backup</span>
              <span>{lastBackup}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Status</span>
              <Badge variant={backupStatus === "success" ? "outline" : backupStatus === "in-progress" ? "secondary" : "destructive"} 
                className={backupStatus === "success" ? "bg-green-50 text-green-600 border-green-600" : ""}>
                {backupStatus === "success" ? "Success" : backupStatus === "in-progress" ? "In Progress" : "Failed"}
              </Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Size</span>
              <span>245.8 MB</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Backup Interval</span>
              <span>Every {backupInterval} hours</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full" onClick={triggerBackup}>
              {backupStatus === "in-progress" ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Backup in progress...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Run Backup Now
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Information</CardTitle>
            <CardDescription>Environment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Version</span>
              <span>{systemVersion}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <Badge>Production</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Node.js</span>
              <span>18.18.2</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database</span>
              <span>PostgreSQL 14.9</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cache</span>
              <span>Redis 7.2.3</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Deployment</span>
              <span>2024-07-15 09:30:42</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="mb-6">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input id="app-name" defaultValue="HR Management System" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-url">Application URL</Label>
                  <Input id="app-url" defaultValue="https://hrms.example.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Acme Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="Y-m-d">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y-m-d">YYYY-MM-DD</SelectItem>
                      <SelectItem value="m/d/Y">MM/DD/YYYY</SelectItem>
                      <SelectItem value="d/m/Y">DD/MM/YYYY</SelectItem>
                      <SelectItem value="d.m.Y">DD.MM.YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select defaultValue="H:i">
                    <SelectTrigger id="time-format">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="H:i">24-hour (14:30)</SelectItem>
                      <SelectItem value="h:i A">12-hour (02:30 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <Switch 
                    id="maintenance-mode" 
                    checked={maintenanceMode} 
                    onCheckedChange={toggleMaintenanceMode} 
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, only administrators can access the system.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Send system notifications via email to administrators
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator Email</Label>
                <Input id="admin-email" defaultValue="admin@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.mailserver.com" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-encryption">Encryption</Label>
                  <Select defaultValue="tls">
                    <SelectTrigger id="smtp-encryption">
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">SMTP Username</Label>
                  <Input id="smtp-username" defaultValue="notifications@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input id="smtp-password" type="password" defaultValue="********" />
                </div>
              </div>
              <div className="pt-2">
                <Button variant="secondary">Test Email Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure system security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Password Policy</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-password-length" className="text-sm">Minimum Password Length</Label>
                    <Select defaultValue="8">
                      <SelectTrigger id="min-password-length">
                        <SelectValue placeholder="Select minimum length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 characters</SelectItem>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry" className="text-sm">Password Expiry</Label>
                    <Select defaultValue="90">
                      <SelectTrigger id="password-expiry">
                        <SelectValue placeholder="Select expiry period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="0">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-uppercase">Require Uppercase Letters</Label>
                  <Switch id="require-uppercase" defaultChecked />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-numbers">Require Numbers</Label>
                  <Switch id="require-numbers" defaultChecked />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-symbols">Require Special Characters</Label>
                  <Switch id="require-symbols" defaultChecked />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-2fa">Enable Two-Factor Authentication</Label>
                  <Switch id="enable-2fa" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for administrative accounts
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced system options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="log-level">Log Level</Label>
                <Select value={logLevel} onValueChange={setLogLevel}>
                  <SelectTrigger id="log-level">
                    <SelectValue placeholder="Select log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backup-interval">Backup Interval (hours)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="backup-interval"
                    min={1}
                    max={168}
                    step={1}
                    value={[backupInterval]}
                    onValueChange={(value) => setBackupInterval(value[0] ?? backupInterval)}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{backupInterval}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cache-ttl">Cache TTL (minutes)</Label>
                <Input id="cache-ttl" type="number" defaultValue="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-queue-status">Job Queue Status</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={jobQueueStatus === "running" ? "default" : "secondary"}>
                    {jobQueueStatus === "running" ? "Running" : "Paused"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={toggleJobQueue}>
                    {jobQueueStatus === "running" ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Queue
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Resume Queue
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clear-cache">System Cache</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={clearCache} disabled={cacheStatus === "clearing"}>
                    {cacheStatus === "clearing" ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Cache
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-js">Custom JavaScript</Label>
                <Textarea 
                  id="custom-js" 
                  placeholder="// Add custom JavaScript to be included in the application"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea 
                  id="custom-css" 
                  placeholder="/* Add custom CSS to be included in the application */"
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardHeader className="text-red-600">
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription className="text-red-500">Potentially destructive actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clear-logs">System Logs</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-red-200 text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Logs
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-system">Reset System</Label>
                <div className="flex items-center gap-2">
                  <Button variant="destructive">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default Settings
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will reset all system settings to their default values.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
