'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Copy, Eye, EyeOff, Key, Plus, RefreshCw, Server, Shield, Wrench } from 'lucide-react';

// Mock data for API keys
const mockApiKeys = [
  {
    id: 'key_1',
    name: 'Production API Key',
    key: 'pk_live_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    createdAt: '2024-04-12T14:30:00Z',
    lastUsed: '2024-07-18T09:15:22Z',
    status: 'active',
    permissions: ['read', 'write'],
    environment: 'production',
    requestCount: 3542,
    ipRestrictions: ['192.168.1.0/24']
  },
  {
    id: 'key_2',
    name: 'Development API Key',
    key: 'pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    createdAt: '2024-04-15T10:00:00Z',
    lastUsed: '2024-07-17T16:22:45Z',
    status: 'active',
    permissions: ['read', 'write', 'delete'],
    environment: 'development',
    requestCount: 15678,
    ipRestrictions: []
  },
  {
    id: 'key_3',
    name: 'Read-only API Key',
    key: 'pk_ro_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    createdAt: '2024-05-02T08:45:00Z',
    lastUsed: '2024-07-10T11:30:10Z',
    status: 'active',
    permissions: ['read'],
    environment: 'production',
    requestCount: 2865,
    ipRestrictions: ['10.0.0.0/8']
  },
  {
    id: 'key_4',
    name: 'Mobile App API Key',
    key: 'pk_mob_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    createdAt: '2024-06-10T09:20:00Z',
    lastUsed: '2024-07-18T08:45:30Z',
    status: 'active',
    permissions: ['read', 'write'],
    environment: 'production',
    requestCount: 28975,
    ipRestrictions: []
  },
  {
    id: 'key_5',
    name: 'Temporary Integration Key',
    key: 'pk_temp_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    createdAt: '2024-07-05T15:10:00Z',
    lastUsed: '2024-07-15T14:20:15Z',
    status: 'revoked',
    permissions: ['read', 'write'],
    environment: 'development',
    requestCount: 345,
    ipRestrictions: []
  }
];

// Mock data for API endpoints
const mockEndpoints = [
  {
    id: 'endpoint_1',
    path: '/api/v1/users',
    method: 'GET',
    description: 'List all users',
    requiresAuth: true,
    rateLimit: 100,
    avgResponseTime: 45,
    status: 'active'
  },
  {
    id: 'endpoint_2',
    path: '/api/v1/users/{id}',
    method: 'GET',
    description: 'Get user by ID',
    requiresAuth: true,
    rateLimit: 200,
    avgResponseTime: 38,
    status: 'active'
  },
  {
    id: 'endpoint_3',
    path: '/api/v1/users',
    method: 'POST',
    description: 'Create a new user',
    requiresAuth: true,
    rateLimit: 50,
    avgResponseTime: 120,
    status: 'active'
  },
  {
    id: 'endpoint_4',
    path: '/api/v1/users/{id}',
    method: 'PUT',
    description: 'Update user by ID',
    requiresAuth: true,
    rateLimit: 50,
    avgResponseTime: 110,
    status: 'active'
  },
  {
    id: 'endpoint_5',
    path: '/api/v1/users/{id}',
    method: 'DELETE',
    description: 'Delete user by ID',
    requiresAuth: true,
    rateLimit: 20,
    avgResponseTime: 85,
    status: 'active'
  },
  {
    id: 'endpoint_6',
    path: '/api/v1/health',
    method: 'GET',
    description: 'API health check',
    requiresAuth: false,
    rateLimit: 1000,
    avgResponseTime: 12,
    status: 'active'
  },
  {
    id: 'endpoint_7',
    path: '/api/v1/departments',
    method: 'GET',
    description: 'List all departments',
    requiresAuth: true,
    rateLimit: 100,
    avgResponseTime: 40,
    status: 'active'
  },
  {
    id: 'endpoint_8',
    path: '/api/v1/reports/usage',
    method: 'GET',
    description: 'Get API usage reports',
    requiresAuth: true,
    rateLimit: 20,
    avgResponseTime: 350,
    status: 'deprecated',
    deprecationDate: '2024-09-30T00:00:00Z',
    replacedBy: '/api/v2/analytics/usage'
  }
];

// Mock usage data
const mockUsageData = [
  { date: '2024-07-12', requests: 4230 },
  { date: '2024-07-13', requests: 3890 },
  { date: '2024-07-14', requests: 2105 },
  { date: '2024-07-15', requests: 5430 },
  { date: '2024-07-16', requests: 6120 },
  { date: '2024-07-17', requests: 5840 },
  { date: '2024-07-18', requests: 4650 }
];

export default function ApiManagementPage() {
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [showEndpointDialog, setShowEndpointDialog] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [endpointFilter, setEndpointFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  
  // Filter endpoints based on search and filter
  const filteredEndpoints = mockEndpoints
    .filter(endpoint => 
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(endpoint => 
      endpointFilter === 'all' ? true : 
      endpointFilter === 'active' ? endpoint.status === 'active' : 
      endpoint.status === 'deprecated'
    );

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // In a real app you would show a toast notification here
  };

  const handleToggleShowKey = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleGenerateNewKey = () => {
    // Simulate generating a new API key
    setNewApiKey('pk_new_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    setShowNewKeyDialog(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  };

  const getMethodColor = (method: string) => {
    switch(method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-amber-100 text-amber-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">API Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Server className="h-4 w-4 mr-2" />
            API Status
          </Button>
          <Button>
            <Key className="h-4 w-4 mr-2" />
            Generate New Key
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Active API credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockApiKeys.filter(key => key.status === 'active').length}</div>
            <div className="text-sm text-muted-foreground mt-2">
              {mockApiKeys.filter(key => key.status === 'revoked').length} revoked keys
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Endpoints</CardTitle>
            <CardDescription>Available API routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockEndpoints.length}</div>
            <div className="text-sm text-muted-foreground mt-2">
              {mockEndpoints.filter(e => e.status === 'deprecated').length} deprecated
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Today's Usage</CardTitle>
            <CardDescription>API requests today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockUsageData[mockUsageData.length - 1]?.requests}</div>
            <div className="text-sm text-muted-foreground mt-2">
              {Math.round(((mockUsageData[mockUsageData.length - 1]?.requests || 0) - (mockUsageData[mockUsageData.length - 2]?.requests || 0)) / (mockUsageData[mockUsageData.length - 2]?.requests || 1) * 100)}% vs. yesterday
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keys" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="usage">Usage & Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="keys" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Button onClick={handleGenerateNewKey}>
              <Plus className="h-4 w-4 mr-2" />
              New API Key
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockApiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell>
                        <div className="font-medium">{apiKey.name}</div>
                        <div className="text-sm text-muted-foreground">Created {formatDate(apiKey.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {showKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleToggleShowKey(apiKey.id)}
                          >
                            {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleCopyKey(apiKey.key)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={apiKey.environment === 'production' ? 'default' : 'outline'}>
                          {apiKey.environment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {apiKey.permissions.map(perm => (
                            <Badge key={perm} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(apiKey.lastUsed)}</TableCell>
                      <TableCell>
                        <Badge variant={apiKey.status === 'active' ? 'outline' : 'secondary'} className={apiKey.status === 'active' ? "bg-green-50 text-green-600 border-green-600" : ""}>
                          {apiKey.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => {
                              setSelectedKey(apiKey);
                              setShowKeyDialog(true);
                            }}
                          >
                            <Wrench className="h-4 w-4" />
                          </Button>
                          {apiKey.status === 'active' ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600" 
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="12" x="3" y="8" rx="2" />
                                <path d="M7 8V7c0-2 2-3 5-3s5 1 5 3v1" />
                                <path d="M12 12v3" />
                              </svg>
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-green-600" 
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>API Key Details</DialogTitle>
                <DialogDescription>
                  View and modify details for this API key
                </DialogDescription>
              </DialogHeader>
              {selectedKey && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="key-name" className="text-right">Name</Label>
                    <Input id="key-name" defaultValue={selectedKey.name} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="key-value" className="text-right">API Key</Label>
                    <div className="relative col-span-3">
                      <Input 
                        id="key-value" 
                        value={showKeys[selectedKey.id] ? selectedKey.key : maskApiKey(selectedKey.key)} 
                        readOnly 
                        className="pr-16 font-mono"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleToggleShowKey(selectedKey.id)}
                        >
                          {showKeys[selectedKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => handleCopyKey(selectedKey.key)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="key-environment" className="text-right">Environment</Label>
                    <Select defaultValue={selectedKey.environment}>
                      <SelectTrigger id="key-environment" className="col-span-3">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Permissions</Label>
                    <div className="col-span-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="perm-read" defaultChecked={selectedKey.permissions.includes('read')} />
                        <Label htmlFor="perm-read">Read</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="perm-write" defaultChecked={selectedKey.permissions.includes('write')} />
                        <Label htmlFor="perm-write">Write</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="perm-delete" defaultChecked={selectedKey.permissions.includes('delete')} />
                        <Label htmlFor="perm-delete">Delete</Label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ip-restrictions" className="text-right">IP Restrictions</Label>
                    <Textarea 
                      id="ip-restrictions" 
                      defaultValue={selectedKey.ipRestrictions.join('\n')}
                      placeholder="Enter IP addresses or CIDR ranges (one per line)"
                      className="col-span-3 h-20"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">
                      <Label htmlFor="key-status">Status</Label>
                    </div>
                    <div className="col-span-3 flex items-center gap-3">
                      <Switch id="key-status" defaultChecked={selectedKey.status === 'active'} />
                      <div className="text-sm">
                        <p>{selectedKey.status === 'active' ? 'Active' : 'Revoked'}</p>
                        <p className="text-muted-foreground">Toggle to {selectedKey.status === 'active' ? 'revoke' : 'activate'} this API key</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowKeyDialog(false)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New API Key Generated</DialogTitle>
                <DialogDescription>
                  Copy your API key now. For security reasons, it will not be displayed again.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Alert className="bg-amber-50 border-amber-500">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Please store this key safely. You won't be able to see it again.
                  </AlertDescription>
                </Alert>
                <div className="relative">
                  <Input 
                    value={newApiKey}
                    readOnly 
                    className="pr-12 font-mono"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2" 
                    onClick={() => handleCopyKey(newApiKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
                  I've copied my key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="endpoints" className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
              <Input 
                placeholder="Search endpoints..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-1/3">
              <Select value={endpointFilter} onValueChange={setEndpointFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Endpoints</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Auth</TableHead>
                    <TableHead>Rate Limit</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEndpoints.map((endpoint) => (
                    <TableRow 
                      key={`${endpoint.method}_${endpoint.path}`}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedEndpoint(endpoint);
                        setShowEndpointDialog(true);
                      }}
                    >
                      <TableCell className="font-mono text-sm">{endpoint.path}</TableCell>
                      <TableCell>
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                      </TableCell>
                      <TableCell>{endpoint.description}</TableCell>
                      <TableCell>
                        {endpoint.requiresAuth ? (
                          <Shield className="h-4 w-4 text-amber-500" />
                        ) : (
                          <span className="text-green-600 text-sm">Public</span>
                        )}
                      </TableCell>
                      <TableCell>{endpoint.rateLimit}/min</TableCell>
                      <TableCell>{endpoint.avgResponseTime} ms</TableCell>
                      <TableCell>
                        {endpoint.status === 'deprecated' ? (
                          <Badge variant="destructive">Deprecated</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-600">Active</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Dialog open={showEndpointDialog} onOpenChange={setShowEndpointDialog}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Endpoint Details</DialogTitle>
                <DialogDescription>
                  Details and usage information for this API endpoint
                </DialogDescription>
              </DialogHeader>
              {selectedEndpoint && (
                <div className="space-y-6 py-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getMethodColor(selectedEndpoint.method)}>
                      {selectedEndpoint.method}
                    </Badge>
                    <span className="font-mono text-base">{selectedEndpoint.path}</span>
                    {selectedEndpoint.status === 'deprecated' && (
                      <Badge variant="destructive">Deprecated</Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground">{selectedEndpoint.description}</p>
                  
                  {selectedEndpoint.status === 'deprecated' && (
                    <Alert className="bg-red-50 border-red-500">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <AlertTitle>Deprecated</AlertTitle>
                      <AlertDescription>
                        This endpoint will be removed on {formatDate(selectedEndpoint.deprecationDate)}.
                        Please migrate to <span className="font-mono">{selectedEndpoint.replacedBy}</span>.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Authentication</h4>
                      <p>{selectedEndpoint.requiresAuth ? 'Required' : 'Public'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Rate Limit</h4>
                      <p>{selectedEndpoint.rateLimit} requests per minute</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Avg. Response Time</h4>
                      <p>{selectedEndpoint.avgResponseTime} ms</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Status</h4>
                      <p>{selectedEndpoint.status.charAt(0).toUpperCase() + selectedEndpoint.status.slice(1)}</p>
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-slate-50 p-4 border">
                    <h4 className="text-sm font-medium mb-2">Example Request</h4>
                    <pre className="bg-slate-900 text-slate-50 p-3 rounded-md text-xs overflow-x-auto">
                      {`curl -X ${selectedEndpoint.method} \\
  https://api.example.com${selectedEndpoint.path.replace('{id}', '123')} \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json"`}
                      {selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT' ? `\n  -d '{"name": "Example", "email": "user@example.com"}'` : ''}
                    </pre>
                  </div>
                  
                  <div className="rounded-md bg-slate-50 p-4 border">
                    <h4 className="text-sm font-medium mb-2">Example Response</h4>
                    <pre className="bg-slate-900 text-slate-50 p-3 rounded-md text-xs overflow-x-auto">
                      {`{
  "success": true,
  "data": {
    "id": "usr_123456",
    "name": "Example User",
    "email": "user@example.com",
    "createdAt": "2024-07-18T12:34:56Z"
  }
}`}
                    </pre>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEndpointDialog(false)}>
                  Close
                </Button>
                <Button variant="outline">View Documentation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Requests per day for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end gap-2">
                {mockUsageData.map((day, index) => (
                  <div key={index} className="relative flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full bg-primary/80 rounded-t-sm ${
                        index === mockUsageData.length - 1 ? 'bg-primary' : ''
                      }`}
                      style={{ 
                        height: `${(day.requests / Math.max(...mockUsageData.map(d => d.requests))) * 220}px` 
                      }}
                    />
                    <div className="text-xs mt-2 text-muted-foreground">
                      {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </div>
                    <div className="absolute -top-6 text-xs font-medium">
                      {day.requests.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Endpoints</CardTitle>
                <CardDescription>Most frequently called API routes</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Requests</TableHead>
                      <TableHead>Avg. Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { path: '/api/v1/users', method: 'GET', requests: 12450, time: 42 },
                      { path: '/api/v1/auth/login', method: 'POST', requests: 8920, time: 120 },
                      { path: '/api/v1/users/{id}', method: 'GET', requests: 5430, time: 38 },
                      { path: '/api/v1/products', method: 'GET', requests: 4260, time: 65 },
                      { path: '/api/v1/health', method: 'GET', requests: 3840, time: 12 },
                    ].map((endpoint, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{endpoint.path}</TableCell>
                        <TableCell>
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                        </TableCell>
                        <TableCell>{endpoint.requests.toLocaleString()}</TableCell>
                        <TableCell>{endpoint.time} ms</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Error Rate</CardTitle>
                <CardDescription>API errors in the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { code: 200, description: 'OK', count: 42560, percentage: 94.5 },
                      { code: 400, description: 'Bad Request', count: 1230, percentage: 2.7 },
                      { code: 401, description: 'Unauthorized', count: 845, percentage: 1.9 },
                      { code: 404, description: 'Not Found', count: 320, percentage: 0.7 },
                      { code: 500, description: 'Internal Server Error', count: 45, percentage: 0.1 },
                    ].map((error, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant={error.code >= 400 ? (error.code >= 500 ? 'destructive' : 'secondary') : 'outline'} className={error.code < 400 ? "bg-green-50 text-green-600 border-green-600" : ""}>
                            {error.code}
                          </Badge>
                        </TableCell>
                        <TableCell>{error.description}</TableCell>
                        <TableCell>{error.count.toLocaleString()}</TableCell>
                        <TableCell>{error.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>API Access Logs</CardTitle>
              <CardDescription>Recent API requests</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { timestamp: '2024-07-18T10:45:23Z', method: 'GET', endpoint: '/api/v1/users', status: 200, key: 'pk_live_51X...', ip: '192.168.1.105', duration: 38 },
                    { timestamp: '2024-07-18T10:44:56Z', method: 'POST', endpoint: '/api/v1/auth/login', status: 200, key: 'pk_test_51X...', ip: '10.0.0.15', duration: 125 },
                    { timestamp: '2024-07-18T10:44:32Z', method: 'GET', endpoint: '/api/v1/products/85', status: 404, key: 'pk_live_51X...', ip: '192.168.1.105', duration: 28 },
                    { timestamp: '2024-07-18T10:43:45Z', method: 'PUT', endpoint: '/api/v1/users/42', status: 400, key: 'pk_live_51X...', ip: '192.168.1.105', duration: 45 },
                    { timestamp: '2024-07-18T10:42:12Z', method: 'GET', endpoint: '/api/v1/health', status: 200, key: 'pk_live_51X...', ip: '10.0.0.15', duration: 12 },
                    { timestamp: '2024-07-18T10:40:56Z', method: 'DELETE', endpoint: '/api/v1/products/24', status: 200, key: 'pk_live_51X...', ip: '192.168.1.105', duration: 78 },
                    { timestamp: '2024-07-18T10:39:23Z', method: 'GET', endpoint: '/api/v1/users', status: 200, key: 'pk_test_51X...', ip: '10.0.0.15', duration: 40 },
                  ].map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <Badge className={getMethodColor(log.method)}>
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                      <TableCell>
                        <Badge variant={log.status >= 400 ? (log.status >= 500 ? 'destructive' : 'secondary') : 'outline'} className={log.status < 400 ? "bg-green-50 text-green-600 border-green-600" : ""}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.key}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{log.duration} ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button variant="outline">View All Logs</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
