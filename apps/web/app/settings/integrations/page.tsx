'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check, Info, Link, Plus, RefreshCw } from 'lucide-react';

// Mock integrations data
const mockIntegrations = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications and messages to Slack channels',
    icon: '/integrations/slack.svg',
    status: 'connected',
    config: {
      webhookUrl: 'https://hooks.slack.com/services/XXXXXX/XXXXXX/XXXXXX',
      channel: '#notifications',
      username: 'HR Bot',
    }
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync events with Google Calendar',
    icon: '/integrations/google-calendar.svg',
    status: 'connected',
    config: {
      clientId: 'XXXXXX.apps.googleusercontent.com',
      clientSecret: 'XXXXXX-XXXXXX',
      refreshToken: 'XXXXXX',
      calendarId: 'primary'
    }
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Integrate with GitHub repositories for project management',
    icon: '/integrations/github.svg',
    status: 'disconnected',
    config: {}
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Connect Dropbox for file storage and sharing',
    icon: '/integrations/dropbox.svg',
    status: 'disconnected',
    config: {}
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments and manage subscriptions',
    icon: '/integrations/stripe.svg',
    status: 'connected',
    config: {
      publishableKey: 'pk_test_XXXXXX',
      secretKey: 'sk_test_XXXXXX',
      webhookSecret: 'whsec_XXXXXX'
    }
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Customer support and ticketing system integration',
    icon: '/integrations/zendesk.svg',
    status: 'connected',
    config: {
      subdomain: 'company',
      email: 'admin@example.com',
      apiToken: 'XXXXXX'
    }
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing and newsletter automation',
    icon: '/integrations/mailchimp.svg',
    status: 'error',
    config: {
      apiKey: 'XXXXXX-usX',
      listId: 'XXXXXX',
      serverPrefix: 'usX'
    },
    error: 'API key has expired. Please reconnect.'
  },
  {
    id: 'aws',
    name: 'AWS S3',
    description: 'Cloud storage for documents and backups',
    icon: '/integrations/aws.svg',
    status: 'connected',
    config: {
      accessKey: 'AKIAXXXXXX',
      secretKey: 'XXXXXX',
      bucket: 'company-files',
      region: 'us-east-1'
    }
  }
];

// Generic integration icon component to use when actual icons aren't available
const IntegrationIcon = ({ name }: { name: string }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-10 h-10 flex items-center justify-center rounded bg-primary/10 text-primary font-bold">
      {getInitials(name)}
    </div>
  );
};

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const filteredIntegrations = mockIntegrations
    .filter(integration => 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(integration => 
      statusFilter === 'all' ? true : integration.status === statusFilter
    );

  const handleSelectIntegration = (integration: any) => {
    setSelectedIntegration(integration);
    setIsConfiguring(true);
  };

  const handleSaveConfig = () => {
    setIsConfiguring(false);
    setSelectedIntegration(null);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleToggleStatus = (id: string) => {
    // In a real app, you would update the integration status here
    console.log(`Toggle integration status: ${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Integration
        </Button>
      </div>

      {showSuccessAlert && (
        <Alert className="mb-6 bg-green-50 border-green-500">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Integration configuration has been updated successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Integrations</CardTitle>
            <CardDescription>Available services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockIntegrations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Connected</CardTitle>
            <CardDescription>Active integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockIntegrations.filter(i => i.status === 'connected').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Issues</CardTitle>
            <CardDescription>Integrations with errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockIntegrations.filter(i => i.status === 'error').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <Input 
            placeholder="Search integrations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Integrations</SelectItem>
            <SelectItem value="connected">Connected</SelectItem>
            <SelectItem value="disconnected">Disconnected</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isConfiguring ? (
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setIsConfiguring(false)} className="mb-4">
            Back to All Integrations
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                {selectedIntegration.icon ? (
                  <img src={selectedIntegration.icon} alt={selectedIntegration.name} className="w-10 h-10" />
                ) : (
                  <IntegrationIcon name={selectedIntegration.name} />
                )}
                <div>
                  <CardTitle>{selectedIntegration.name}</CardTitle>
                  <CardDescription>{selectedIntegration.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="settings" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                  <TabsTrigger value="logs">Activity Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="settings" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Connection Status</h3>
                      <p className="text-sm text-muted-foreground">Enable or disable this integration</p>
                    </div>
                    <Switch 
                      checked={selectedIntegration.status === 'connected'} 
                      onCheckedChange={() => handleToggleStatus(selectedIntegration.id)}
                    />
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Configuration</h3>
                    
                    {selectedIntegration.id === 'slack' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="webhook-url">Webhook URL</Label>
                          <Input 
                            id="webhook-url" 
                            defaultValue={selectedIntegration.config.webhookUrl || ''}
                            placeholder="https://hooks.slack.com/services/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="channel">Default Channel</Label>
                          <Input 
                            id="channel" 
                            defaultValue={selectedIntegration.config.channel || ''}
                            placeholder="#general"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Bot Username</Label>
                          <Input 
                            id="username" 
                            defaultValue={selectedIntegration.config.username || ''}
                            placeholder="HR Bot"
                          />
                        </div>
                      </div>
                    )}
                    
                    {selectedIntegration.id === 'google-calendar' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="client-id">Client ID</Label>
                          <Input 
                            id="client-id" 
                            defaultValue={selectedIntegration.config.clientId || ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-secret">Client Secret</Label>
                          <Input 
                            id="client-secret" 
                            defaultValue={selectedIntegration.config.clientSecret || ''}
                            type="password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="calendar-id">Calendar ID</Label>
                          <Input 
                            id="calendar-id" 
                            defaultValue={selectedIntegration.config.calendarId || ''}
                            placeholder="primary"
                          />
                        </div>
                        <Alert className="bg-blue-50 border-blue-500">
                          <Info className="h-4 w-4 text-blue-500" />
                          <AlertTitle>Authorization Required</AlertTitle>
                          <AlertDescription>
                            <p className="mb-2">You need to authorize this application with Google Calendar.</p>
                            <Button variant="outline" size="sm">
                              Authorize with Google
                            </Button>
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                    
                    {selectedIntegration.id === 'stripe' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="publishable-key">Publishable Key</Label>
                          <Input 
                            id="publishable-key" 
                            defaultValue={selectedIntegration.config.publishableKey || ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secret-key">Secret Key</Label>
                          <Input 
                            id="secret-key" 
                            defaultValue={selectedIntegration.config.secretKey || ''}
                            type="password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="webhook-secret">Webhook Secret</Label>
                          <Input 
                            id="webhook-secret" 
                            defaultValue={selectedIntegration.config.webhookSecret || ''}
                            type="password"
                          />
                        </div>
                      </div>
                    )}
                    
                    {selectedIntegration.id === 'aws' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="access-key">Access Key</Label>
                          <Input 
                            id="access-key" 
                            defaultValue={selectedIntegration.config.accessKey || ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secret-key">Secret Key</Label>
                          <Input 
                            id="secret-key" 
                            defaultValue={selectedIntegration.config.secretKey || ''}
                            type="password"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bucket">S3 Bucket</Label>
                            <Input 
                              id="bucket" 
                              defaultValue={selectedIntegration.config.bucket || ''}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="region">AWS Region</Label>
                            <Select defaultValue={selectedIntegration.config.region || 'us-east-1'}>
                              <SelectTrigger id="region">
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                                <SelectItem value="us-east-2">US East (Ohio)</SelectItem>
                                <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                                <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                                <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedIntegration.status === 'error' && (
                      <Alert className="bg-red-50 border-red-500 mt-4">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {selectedIntegration.error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {(selectedIntegration.id === 'github' || selectedIntegration.id === 'dropbox') && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">This integration requires authorization</p>
                        <Button>
                          Connect with {selectedIntegration.name}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="webhooks" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Webhook Endpoints</h3>
                    <p className="text-sm text-muted-foreground">Configure the URLs that will receive webhook events from this integration.</p>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-endpoint">Webhook URL</Label>
                      <Input 
                        id="webhook-endpoint" 
                        defaultValue={`https://example.com/api/webhooks/${selectedIntegration.id}`} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhook-events">Events to Send</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["created", "updated", "deleted", "completed", "failed", "scheduled"].map(event => (
                          <div className="flex items-center space-x-2" key={event}>
                            <Switch id={`event-${event}`} defaultChecked={["created", "updated", "deleted"].includes(event)} />
                            <Label htmlFor={`event-${event}`}>{event.charAt(0).toUpperCase() + event.slice(1)}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhook-secret">Webhook Secret</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="webhook-secret" 
                          defaultValue="whsec_XXXXXXXXXXXXXXXXXXXXX"
                          type="password"
                          className="flex-1"
                        />
                        <Button variant="outline">Regenerate</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This secret is used to verify that webhook requests are coming from this integration.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="logs" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Activity Logs</h3>
                    <p className="text-sm text-muted-foreground">Recent activity for this integration</p>
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    {[
                      {
                        event: "Authentication refreshed",
                        timestamp: "2024-07-18T10:30:00Z",
                        status: "success"
                      },
                      {
                        event: "Webhook delivered",
                        timestamp: "2024-07-17T14:25:00Z",
                        status: "success"
                      },
                      {
                        event: "Configuration updated",
                        timestamp: "2024-07-15T09:12:00Z", 
                        status: "success"
                      },
                      {
                        event: "API call failed",
                        timestamp: "2024-07-14T16:30:00Z",
                        status: "error",
                        details: "Rate limit exceeded"
                      },
                      {
                        event: "Integration connected",
                        timestamp: "2024-07-10T11:05:00Z",
                        status: "success"
                      }
                    ].map((log, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{log.event}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                          {log.details && (
                            <p className="text-xs text-red-500 mt-1">{log.details}</p>
                          )}
                        </div>
                        <Badge variant={log.status === "success" ? "outline" : "destructive"} className={log.status === "success" ? "bg-green-50 text-green-600 border-green-600" : ""}>
                          {log.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Button variant="outline" size="sm">View All Logs</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsConfiguring(false)}>Cancel</Button>
              <div className="space-x-2">
                <Button variant="outline" className="border-blue-200 text-blue-600">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button onClick={handleSaveConfig}>Save Configuration</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {integration.icon ? (
                      <img src={integration.icon} alt={integration.name} className="w-8 h-8" />
                    ) : (
                      <IntegrationIcon name={integration.name} />
                    )}
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                  </div>
                  <Badge variant={
                    integration.status === 'connected' ? 'outline' :
                    integration.status === 'error' ? 'destructive' : 'secondary'
                  } className={integration.status === 'connected' ? "bg-green-50 text-green-600 border-green-600" : ""}>
                    {integration.status === 'connected' ? 'Connected' : 
                     integration.status === 'error' ? 'Error' : 'Disconnected'}
                  </Badge>
                </div>
                <CardDescription className="mt-2">{integration.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm pb-2">
                {integration.status === 'connected' && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <span>Configuration active</span>
                  </div>
                )}
                {integration.status === 'error' && (
                  <div className="text-red-500">{integration.error}</div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSelectIntegration(integration)}
                >
                  <Link className="h-4 w-4 mr-2" />
                  {integration.status === 'connected' ? 'Manage' : 
                   integration.status === 'error' ? 'Fix Issues' : 'Connect'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
