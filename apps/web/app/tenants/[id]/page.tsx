'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building, Calendar, Edit, Globe, Mail, MapPin, Phone, User, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SITE_MAP } from '@/constants';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'pending';
  industry: string;
  createdAt: string;
  address: string;
  phone: string;
  email: string;
  planType: string;
}

interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export default function TenantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenantData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch data from API
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        setTenant({
          id,
          name: 'Acme Corporation',
          domain: 'acme.example.com',
          status: 'active',
          industry: 'Technology',
          createdAt: '2024-05-12T10:00:00',
          address: '123 Main St, Tech City, CA 90210',
          phone: '+1 (555) 123-4567',
          email: 'info@acme.example.com',
          planType: 'Premium',
        });

        setUsers([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@acme.example.com',
            role: 'Admin',
            status: 'active',
            lastLogin: '2024-07-03T14:32:00',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@acme.example.com',
            role: 'HR Manager',
            status: 'active',
            lastLogin: '2024-07-02T09:15:00',
          },
          {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob@acme.example.com',
            role: 'Project Manager',
            status: 'inactive',
            lastLogin: '2024-06-25T16:45:00',
          },
        ]);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTenantData();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
              <p className="mt-4">Loading tenant data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!tenant) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Tenant not found</h2>
              <p className="mb-4">The tenant you are looking for does not exist or has been deleted.</p>
              <Button asChild>
                <Link href={SITE_MAP.TENANTS}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tenants
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="mr-4" asChild>
              <Link href={SITE_MAP.TENANTS}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
              <div className="flex items-center text-muted-foreground">
                <Globe className="mr-1 h-4 w-4" />
                {tenant.domain} • {getStatusBadge(tenant.status)}
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={`/tenants/${tenant.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Company
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Company Details</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Detailed information about {tenant.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Company Name</h3>
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-gray-500" />
                        <p>{tenant.name}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Domain</h3>
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-gray-500" />
                        <p>{tenant.domain}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Industry</h3>
                      <p>{tenant.industry}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Created On</h3>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        <p>{formatDate(tenant.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Address</h3>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                        <p>{tenant.address}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Phone</h3>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-gray-500" />
                        <p>{tenant.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Email</h3>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-gray-500" />
                        <p>{tenant.email}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">Subscription Plan</h3>
                      <Badge>{tenant.planType}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Company Users</CardTitle>
                  <CardDescription>
                    Users with access to {tenant.name}
                  </CardDescription>
                </div>
                <Button size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            {user.status === 'active' ? (
                              <Badge className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(user.lastLogin).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage billing information and subscription details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Billing information will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
