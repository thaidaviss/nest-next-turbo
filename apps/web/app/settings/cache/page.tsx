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
import { AlertCircle, Check, Database, HardDrive, Key, Play, RotateCcw, Save, Trash2, X } from 'lucide-react';

interface CacheInfo {
  status: 'connected' | 'disconnected' | 'error';
  version: string;
  uptime: number;
  memoryUsed: number;
  memoryTotal: number;
  hitRate: number;
  missRate: number;
  keysCount: number;
  connectedClients: number;
  lastRestart: string;
}

interface CacheKey {
  key: string;
  type: string;
  ttl: number;
  size: string;
  lastAccessed: string;
}

export default function CacheSettingsPage() {
  // Mock Redis cache information
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({
    status: 'connected',
    version: '7.0.5',
    uptime: 1209600, // 14 days in seconds
    memoryUsed: 128,
    memoryTotal: 512,
    hitRate: 94.2,
    missRate: 5.8,
    keysCount: 1245,
    connectedClients: 32,
    lastRestart: '2023-11-16T08:30:15'
  });
  
  // Mock cache keys
  const [cacheKeys, setCacheKeys] = useState<CacheKey[]>([
    { key: 'user:profile:1001', type: 'hash', ttl: 3600, size: '2.4 KB', lastAccessed: '2023-11-30T14:25:18' },
    { key: 'session:token:abc123', type: 'string', ttl: 1800, size: '0.8 KB', lastAccessed: '2023-11-30T14:32:45' },
    { key: 'product:list:featured', type: 'list', ttl: 7200, size: '18.5 KB', lastAccessed: '2023-11-30T14:10:12' },
    { key: 'notification:user:1001', type: 'list', ttl: 86400, size: '4.2 KB', lastAccessed: '2023-11-30T13:45:33' },
    { key: 'config:app:settings', type: 'hash', ttl: -1, size: '1.1 KB', lastAccessed: '2023-11-30T12:22:51' },
    { key: 'stats:daily:visits', type: 'sorted-set', ttl: 604800, size: '12.8 KB', lastAccessed: '2023-11-30T14:05:19' },
    { key: 'user:permissions:1001', type: 'set', ttl: 3600, size: '1.7 KB', lastAccessed: '2023-11-30T14:28:32' },
    { key: 'page:cache:home', type: 'string', ttl: 300, size: '24.6 KB', lastAccessed: '2023-11-30T14:34:11' },
    { key: 'api:rate:limit:192.168.1.105', type: 'string', ttl: 60, size: '0.3 KB', lastAccessed: '2023-11-30T14:35:02' },
    { key: 'search:results:latest', type: 'list', ttl: 600, size: '8.9 KB', lastAccessed: '2023-11-30T14:15:44' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [connectionString, setConnectionString] = useState('redis://localhost:6379');
  const [maxMemory, setMaxMemory] = useState('512');
  const [evictionPolicy, setEvictionPolicy] = useState('allkeys-lru');
  
  // Filter cache keys based on search and type filter
  const filteredKeys = cacheKeys.filter(key => {
    const matchesSearch = key.key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || key.type === selectedType;
    return matchesSearch && matchesType;
  });
  
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
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Format TTL
  const formatTtl = (ttl: number): string => {
    if (ttl === -1) return 'No expiration';
    if (ttl < 60) return `${ttl} seconds`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)} minutes`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)} hours`;
    return `${Math.floor(ttl / 86400)} days`;
  };
  
  // Handle cache flush (mock)
  const handleCacheFlush = () => {
    if (window.confirm('Are you sure you want to flush the entire cache? This cannot be undone.')) {
      // In a real app, this would make an API call
      setCacheKeys([]);
      setCacheInfo(prev => ({
        ...prev,
        keysCount: 0,
        memoryUsed: 0
      }));
      alert('Cache flushed successfully!');
    }
  };
  
  // Handle key deletion (mock)
  const handleDeleteKey = (key: string) => {
    if (window.confirm(`Are you sure you want to delete the key: ${key}?`)) {
      // In a real app, this would make an API call
      const keyToDelete = cacheKeys.find(k => k.key === key);
      if (keyToDelete) {
        setCacheKeys(cacheKeys.filter(k => k.key !== key));
        setCacheInfo(prev => ({
          ...prev,
          keysCount: prev.keysCount - 1
        }));
      }
    }
  };
  
  // Handle settings save (mock)
  const handleSaveSettings = () => {
    // In a real app, this would make an API call
    alert('Settings saved successfully!');
  };
  
  // Handle reconnect (mock)
  const handleReconnect = () => {
    // In a real app, this would make an API call
    alert('Reconnected to Redis successfully!');
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Cache Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReconnect}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reconnect
          </Button>
          <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleCacheFlush}>
            <Trash2 className="h-4 w-4 mr-2" />
            Flush Cache
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Status</CardTitle>
            <StatusIcon status={cacheInfo.status} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{cacheInfo.status === 'connected' ? 'Connected' : cacheInfo.status === 'disconnected' ? 'Disconnected' : 'Error'}</div>
              <Badge className={`ml-2 ${cacheInfo.status === 'connected' ? 'bg-green-500' : cacheInfo.status === 'disconnected' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {cacheInfo.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Redis v{cacheInfo.version}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheInfo.memoryUsed} MB / {cacheInfo.memoryTotal} MB</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className={`h-2.5 rounded-full ${(cacheInfo.memoryUsed / cacheInfo.memoryTotal) > 0.9 ? 'bg-red-600' : (cacheInfo.memoryUsed / cacheInfo.memoryTotal) > 0.7 ? 'bg-yellow-600' : 'bg-green-600'}`}
                style={{ width: `${(cacheInfo.memoryUsed / cacheInfo.memoryTotal) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{((cacheInfo.memoryUsed / cacheInfo.memoryTotal) * 100).toFixed(1)}% used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <TargetIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheInfo.hitRate}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>Hits: {cacheInfo.hitRate}%
              <span className="ml-2 inline-block w-3 h-3 bg-red-500 rounded-full"></span>Misses: {cacheInfo.missRate}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(cacheInfo.uptime)}</div>
            <p className="text-xs text-muted-foreground">Last restart: {formatTimestamp(cacheInfo.lastRestart)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keys" className="w-full mb-8">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="keys">Cache Keys</TabsTrigger>
          <TabsTrigger value="settings">Cache Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keys">
          <Card>
            <CardHeader>
              <CardTitle>Cache Keys</CardTitle>
              <CardDescription>
                Browse and manage Redis cache keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search keys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="hash">Hash</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="set">Set</SelectItem>
                    <SelectItem value="sorted-set">Sorted Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Time to Live</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Last Accessed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKeys.map((key) => (
                      <TableRow key={key.key}>
                        <TableCell className="font-mono text-sm">{key.key}</TableCell>
                        <TableCell>{key.type}</TableCell>
                        <TableCell>{formatTtl(key.ttl)}</TableCell>
                        <TableCell>{key.size}</TableCell>
                        <TableCell>{formatTimestamp(key.lastAccessed)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => handleDeleteKey(key.key)}>
                            <span className="sr-only">Delete</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredKeys.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          {cacheKeys.length === 0 ? 'Cache is empty' : 'No keys match your search criteria'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredKeys.length} of {cacheKeys.length} keys ({cacheInfo.keysCount} total in database)
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    Test Command
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCacheFlush} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Flush All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Cache Configuration</CardTitle>
              <CardDescription>
                Configure Redis cache settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Connection String</label>
                  <Input
                    value={connectionString}
                    onChange={(e) => setConnectionString(e.target.value)}
                    placeholder="redis://localhost:6379"
                  />
                  <p className="text-xs text-muted-foreground">Redis connection string including port and authentication if required</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Memory (MB)</label>
                  <Input
                    type="number"
                    value={maxMemory}
                    onChange={(e) => setMaxMemory(e.target.value)}
                    placeholder="512"
                  />
                  <p className="text-xs text-muted-foreground">Maximum memory allocated to Redis in megabytes</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Eviction Policy</label>
                  <Select value={evictionPolicy} onValueChange={setEvictionPolicy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select eviction policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noeviction">No eviction</SelectItem>
                      <SelectItem value="allkeys-lru">All keys LRU</SelectItem>
                      <SelectItem value="volatile-lru">Volatile LRU</SelectItem>
                      <SelectItem value="allkeys-lfu">All keys LFU</SelectItem>
                      <SelectItem value="volatile-lfu">Volatile LFU</SelectItem>
                      <SelectItem value="allkeys-random">All keys random</SelectItem>
                      <SelectItem value="volatile-random">Volatile random</SelectItem>
                      <SelectItem value="volatile-ttl">Volatile TTL</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Policy for key eviction when maximum memory is reached</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default TTL (seconds)</label>
                  <Input
                    type="number"
                    defaultValue="3600"
                    placeholder="3600"
                  />
                  <p className="text-xs text-muted-foreground">Default time-to-live for cache keys if not specified</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Advanced Settings</h3>
                  <p className="text-sm text-muted-foreground">These settings require a cache restart to take effect</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maximum Clients</label>
                    <Input
                      type="number"
                      defaultValue="10000"
                      placeholder="10000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timeout (seconds)</label>
                    <Input
                      type="number"
                      defaultValue="300"
                      placeholder="300"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Persistence</label>
                    <Select defaultValue="rdb">
                      <SelectTrigger>
                        <SelectValue placeholder="Select persistence mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="rdb">RDB</SelectItem>
                        <SelectItem value="aof">AOF</SelectItem>
                        <SelectItem value="rdb-aof">RDB + AOF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Save Frequency</label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue placeholder="Select save frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Disabled</SelectItem>
                        <SelectItem value="60">Every minute</SelectItem>
                        <SelectItem value="300">Every 5 minutes</SelectItem>
                        <SelectItem value="900">Every 15 minutes</SelectItem>
                        <SelectItem value="1800">Every 30 minutes</SelectItem>
                        <SelectItem value="3600">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Redis Stats</CardTitle>
          <CardDescription>
            Real-time performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="text-sm font-medium">Total Keys</div>
              <div className="text-sm">{cacheInfo.keysCount}</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="text-sm font-medium">Connected Clients</div>
              <div className="text-sm">{cacheInfo.connectedClients}</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="text-sm font-medium">Operations Per Second</div>
              <div className="text-sm">23,456</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="text-sm font-medium">Expired Keys</div>
              <div className="text-sm">1,245</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="text-sm font-medium">Evicted Keys</div>
              <div className="text-sm">156</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="text-sm font-medium">Used CPU</div>
              <div className="text-sm">2.3%</div>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-center text-muted-foreground">
              In a production environment, this section would include graphs for cache performance metrics over time.
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

function TargetIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function Clock(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
