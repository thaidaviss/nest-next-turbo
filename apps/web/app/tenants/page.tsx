'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Building, Edit, MoreHorizontal, Plus, Search, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { SITE_MAP } from '@/constants';
import { Tenant } from '@/types/tenant.type';

interface TenantWithUserCount extends Tenant {
  userCount: number;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantWithUserCount[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      domain: 'acme.example.com',
      status: 'active',
      industry: 'Manufacturing',
      address: '123 Main St, City',
      phone: '+1-123-456-7890',
      email: 'info@acme.example.com',
      planType: 'enterprise',
      userCount: 34,
      createdAt: '2024-05-12T10:00:00',
    },
    {
      id: '2',
      name: 'Globex Technologies',
      domain: 'globex.example.com',
      status: 'active',
      industry: 'Technology',
      address: '456 Tech Blvd, Valley',
      phone: '+1-234-567-8901',
      email: 'contact@globex.example.com',
      planType: 'professional',
      userCount: 27,
      createdAt: '2024-06-05T14:30:00',
    },
    {
      id: '3',
      name: 'Initech Software',
      domain: 'initech.example.com',
      status: 'inactive',
      industry: 'Software',
      address: '789 Code Ave, Town',
      phone: '+1-345-678-9012',
      email: 'support@initech.example.com',
      planType: 'starter',
      userCount: 8,
      createdAt: '2024-02-18T09:15:00',
    },
    {
      id: '4',
      name: 'Umbrella Corporation',
      domain: 'umbrella.example.com',
      status: 'pending',
      industry: 'Pharmaceuticals',
      address: '101 Lab St, Raccoon',
      phone: '+1-456-789-0123',
      email: 'info@umbrella.example.com',
      planType: 'free',
      userCount: 0,
      createdAt: '2024-07-01T16:45:00',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tenant.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
              <p className="text-muted-foreground">
                Manage all tenants (companies) in your system
              </p>
            </div>
            <Link href={SITE_MAP.TENANT_CREATE}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Companies</CardTitle>
              <CardDescription>
                A list of all companies (tenants) in your multi-tenant system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name or domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
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
                    ) : filteredTenants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex justify-center">
                            <Building className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="mt-2 text-gray-500">No companies found</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell className="font-medium">
                            <Link 
                              href={`/tenants/${tenant.id}`} 
                              className="hover:underline hover:text-primary"
                            >
                              {tenant.name}
                            </Link>
                          </TableCell>
                          <TableCell>{tenant.domain}</TableCell>
                          <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4 text-gray-500" />
                              {tenant.userCount}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(tenant.createdAt)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Link href={`/tenants/${tenant.id}`} className="flex w-full items-center">
                                    View details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/tenants/${tenant.id}/edit`} className="flex w-full items-center">
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
