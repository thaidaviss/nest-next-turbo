'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { BarChart2, Check, MoreHorizontal, Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';

// Types
interface Branch {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  industry: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  revenue: number;
  targetRevenue: number;
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'staff';
}

interface BrandUser {
  id: string;
  userId: string;
  brandId: string;
  role: 'admin' | 'manager' | 'staff';
  user: User;
}

interface SalesData {
  id: string;
  brandId: string;
  month: string;
  revenue: number;
  target: number;
  growth: number;
}

export default function ManageBrandPage() {
  const [brands, setBrands] = useState<Branch[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Branch | null>(null);
  const [brandUsers, setBrandUsers] = useState<BrandUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [isEditBrandDialogOpen, setIsEditBrandDialogOpen] = useState(false);
  const [isDeleteBrandDialogOpen, setIsDeleteBrandDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditSalesDialogOpen, setIsEditSalesDialogOpen] = useState(false);
  
  // Form states
  const [editedBrand, setEditedBrand] = useState<Partial<Branch>>({});
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserRole, setSelectedUserRole] = useState<'admin' | 'manager' | 'staff'>('staff');
  const [editedSales, setEditedSales] = useState<Partial<SalesData>>({});

  useEffect(() => {
    // Fetch brands data
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API call
        // const response = await fetch('/api/brands');
        // const data = await response.json();
        // setBrands(data);
        
        // Mock data for now
        setTimeout(() => {
          setBrands([
            {
              id: '1',
              name: 'Acme Corporation',
              logo: '',
              description: 'Leading provider of innovative solutions',
              website: 'https://acme.example.com',
              industry: 'Technology',
              status: 'active',
              createdAt: '2023-01-01T00:00:00Z',
              revenue: 1200000,
              targetRevenue: 1500000
            },
            {
              id: '2',
              name: 'Globex',
              logo: '',
              description: 'International trading company',
              website: 'https://globex.example.com',
              industry: 'Retail',
              status: 'active',
              createdAt: '2023-02-15T00:00:00Z',
              revenue: 980000,
              targetRevenue: 1000000
            },
            {
              id: '3',
              name: 'Initech',
              logo: '',
              description: 'Software development company',
              website: 'https://initech.example.com',
              industry: 'Technology',
              status: 'inactive',
              createdAt: '2023-03-20T00:00:00Z',
              revenue: 450000,
              targetRevenue: 800000
            },
            {
              id: '4',
              name: 'Umbrella Corp',
              logo: '',
              description: 'Pharmaceutical and biotechnology',
              website: 'https://umbrella.example.com',
              industry: 'Healthcare',
              status: 'pending',
              createdAt: '2023-05-10T00:00:00Z',
              revenue: 2500000,
              targetRevenue: 2000000
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
        setIsLoading(false);
      }
    };

    fetchBrands();
    fetchAvailableUsers();
  }, []);

  // Fetch users that can be added to a Branch
  const fetchAvailableUsers = async () => {
    try {
      // Replace with your actual API call
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setAvailableUsers(data);
      
      // Mock data for now
      setAvailableUsers([
        {
          id: '1',
          name: 'John Doe',
          username: 'johndoe',
          email: 'john.doe@example.com',
          avatar: 'https://github.com/shadcn.png',
          role: 'admin'
        },
        {
          id: '2',
          name: 'Jane Smith',
          username: 'janesmith',
          email: 'jane.smith@example.com',
          avatar: '',
          role: 'manager'
        },
        {
          id: '3',
          name: 'Robert Johnson',
          username: 'rjohnson',
          email: 'robert.j@example.com',
          avatar: '',
          role: 'staff'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch available users:', error);
    }
  };

  // Fetch users associated with a Branch
  const fetchBrandUsers = async (brandId: string) => {
    try {
      // Replace with your actual API call
      // const response = await fetch(`/api/brands/${brandId}/users`);
      // const data = await response.json();
      // setBrandUsers(data);
      
      // Mock data for now
      setBrandUsers([
        {
          id: '101',
          userId: '1',
          brandId: brandId,
          role: 'admin',
          user: {
            id: '1',
            name: 'John Doe',
            username: 'johndoe',
            email: 'john.doe@example.com',
            avatar: 'https://github.com/shadcn.png',
            role: 'admin'
          }
        },
        {
          id: '102',
          userId: '2',
          brandId: brandId,
          role: 'manager',
          user: {
            id: '2',
            name: 'Jane Smith',
            username: 'janesmith',
            email: 'jane.smith@example.com',
            avatar: '',
            role: 'manager'
          }
        }
      ]);
    } catch (error) {
      console.error(`Failed to fetch users for Branch ${brandId}:`, error);
    }
  };

  // Fetch sales data for a Branch
  const fetchSalesData = async (brandId: string) => {
    try {
      // Replace with your actual API call
      // const response = await fetch(`/api/brands/${brandId}/sales`);
      // const data = await response.json();
      // setSalesData(data);
      
      // Mock data for now
      setSalesData([
        {
          id: '201',
          brandId: brandId,
          month: 'January 2025',
          revenue: 125000,
          target: 120000,
          growth: 5.2
        },
        {
          id: '202',
          brandId: brandId,
          month: 'February 2025',
          revenue: 132000,
          target: 125000,
          growth: 5.6
        },
        {
          id: '203',
          brandId: brandId,
          month: 'March 2025',
          revenue: 140000,
          target: 130000,
          growth: 6.1
        },
        {
          id: '204',
          brandId: brandId,
          month: 'April 2025',
          revenue: 138000,
          target: 135000,
          growth: -1.4
        },
        {
          id: '205',
          brandId: brandId,
          month: 'May 2025',
          revenue: 145000,
          target: 140000,
          growth: 5.1
        },
        {
          id: '206',
          brandId: brandId,
          month: 'June 2025',
          revenue: 152000,
          target: 145000,
          growth: 4.8
        }
      ]);
    } catch (error) {
      console.error(`Failed to fetch sales data for Branch ${brandId}:`, error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredBrands = brands.filter((Branch) => {
    const query = searchQuery.toLowerCase();
    return (
      Branch.name.toLowerCase().includes(query) ||
      Branch.industry.toLowerCase().includes(query) ||
      Branch.description.toLowerCase().includes(query)
    );
  });

  const handleSelectBrand = (Branch: Branch) => {
    setSelectedBrand(Branch);
    fetchBrandUsers(Branch.id);
    fetchSalesData(Branch.id);
  };

  const handleBrandEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedBrand(prev => ({ ...prev, [name]: value }));
  };

  const handleSalesEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedSales(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleEditBrand = (Branch: Branch) => {
    setEditedBrand({
      name: Branch.name,
      description: Branch.description,
      website: Branch.website,
      industry: Branch.industry,
      status: Branch.status,
      targetRevenue: Branch.targetRevenue
    });
    setIsEditBrandDialogOpen(true);
  };

  const handleDeleteBrand = (Branch: Branch) => {
    setSelectedBrand(Branch);
    setIsDeleteBrandDialogOpen(true);
  };

  const handleEditSales = (salesItem: SalesData) => {
    setEditedSales({
      id: salesItem.id,
      brandId: salesItem.brandId,
      month: salesItem.month,
      revenue: salesItem.revenue,
      target: salesItem.target
    });
    setIsEditSalesDialogOpen(true);
  };

  const handleCreateBrand = () => {
    setEditedBrand({
      name: '',
      description: '',
      website: '',
      industry: '',
      status: 'pending',
      targetRevenue: 0
    });
    setIsEditBrandDialogOpen(true);
  };

  const handleSaveBrand = async () => {
    try {
      if (selectedBrand) {
        // Update existing Branch
        // Replace with your actual API call
        // await fetch(`/api/brands/${selectedBrand.id}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(editedBrand),
        // });
        
        // Update local state
        setBrands(prev => 
          prev.map(Branch => 
            Branch.id === selectedBrand.id 
              ? { ...Branch, ...editedBrand as Branch } 
              : Branch
          )
        );
      } else {
        // Create new Branch
        // Replace with your actual API call
        // const response = await fetch('/api/brands', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(editedBrand),
        // });
        // const newBrand = await response.json();
        
        // Mock creating a new Branch with a generated ID
        const newBrand: Branch = {
          id: `${Math.floor(Math.random() * 1000)}`,
          name: editedBrand.name || '',
          logo: '',
          description: editedBrand.description || '',
          website: editedBrand.website || '',
          industry: editedBrand.industry || '',
          status: editedBrand.status as 'active' | 'inactive' | 'pending' || 'pending',
          createdAt: new Date().toISOString(),
          revenue: 0,
          targetRevenue: editedBrand.targetRevenue || 0
        };
        
        // Update local state
        setBrands(prev => [...prev, newBrand]);
      }
      
      setIsEditBrandDialogOpen(false);
    } catch (error) {
      console.error('Failed to save Branch:', error);
    }
  };

  const handleDeleteBrandConfirm = async () => {
    if (!selectedBrand) return;
    
    try {
      // Replace with your actual API call
      // await fetch(`/api/brands/${selectedBrand.id}`, {
      //   method: 'DELETE',
      // });
      
      // Update local state
      setBrands(prev => prev.filter(Branch => Branch.id !== selectedBrand.id));
      setIsDeleteBrandDialogOpen(false);
      setSelectedBrand(null);
    } catch (error) {
      console.error('Failed to delete Branch:', error);
    }
  };

  const handleAddUserToBrand = async () => {
    if (!selectedBrand || !selectedUser) return;
    
    try {
      // Replace with your actual API call
      // await fetch(`/api/brands/${selectedBrand.id}/users`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     userId: selectedUser,
      //     role: selectedUserRole 
      //   }),
      // });
      
      // Find the user from availableUsers
      const user = availableUsers.find(u => u.id === selectedUser);
      
      if (user) {
        // Create new brandUser
        const newBrandUser: BrandUser = {
          id: `${Math.floor(Math.random() * 1000)}`,
          userId: selectedUser,
          brandId: selectedBrand.id,
          role: selectedUserRole,
          user: user
        };
        
        // Update local state
        setBrandUsers(prev => [...prev, newBrandUser]);
      }
      
      setIsAddUserDialogOpen(false);
      setSelectedUser('');
      setSelectedUserRole('staff');
    } catch (error) {
      console.error('Failed to add user to Branch:', error);
    }
  };

  const handleRemoveUserFromBrand = async (brandUserId: string) => {
    try {
      // Replace with your actual API call
      // await fetch(`/api/brands/${selectedBrand.id}/users/${brandUserId}`, {
      //   method: 'DELETE',
      // });
      
      // Update local state
      setBrandUsers(prev => prev.filter(bu => bu.id !== brandUserId));
    } catch (error) {
      console.error('Failed to remove user from Branch:', error);
    }
  };

  const handleSaveSalesData = async () => {
    if (!editedSales.id) return;
    
    try {
      // Replace with your actual API call
      // await fetch(`/api/brands/${selectedBrand.id}/sales/${editedSales.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(editedSales),
      // });
      
      // Calculate growth rate based on previous month
      const salesIndex = salesData.findIndex(item => item.id === editedSales.id);
      let growthRate = 0;
      
      if (salesIndex > 0) {
        const prevRevenue = salesData[salesIndex - 1]?.revenue || 0;
        const currentRevenue = editedSales.revenue || 0;
        growthRate = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
      }
      
      // Update local state
      setSalesData(prev => 
        prev.map(item => 
          item.id === editedSales.id 
            ? { ...item, ...editedSales, growth: growthRate } 
            : item
        )
      );
      
      setIsEditSalesDialogOpen(false);
    } catch (error) {
      console.error('Failed to update sales data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'inactive':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return (
        <span className="text-green-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {growth.toFixed(1)}%
        </span>
      );
    } else if (growth < 0) {
      return (
        <span className="text-red-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {Math.abs(growth).toFixed(1)}%
        </span>
      );
    } else {
      return <span className="text-gray-500">0.0%</span>;
    }
  };

  const calculateProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <Button onClick={handleCreateBrand}>
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Brands list */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Brands</CardTitle>
                <CardDescription>
                  Select a Branch to manage
                </CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search brands..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center my-8">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto">
                    {filteredBrands.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No brands found
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredBrands.map((Branch) => (
                          <div 
                            key={Branch.id} 
                            className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedBrand?.id === Branch.id ? 'bg-muted' : ''}`}
                            onClick={() => handleSelectBrand(Branch)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{Branch.name}</h3>
                                <p className="text-sm text-muted-foreground">{Branch.industry}</p>
                              </div>
                              <Badge variant="outline" className={getStatusColor(Branch.status)}>
                                {Branch.status}
                              </Badge>
                            </div>
                            <div className="mt-2">
                              <div className="text-sm">Revenue Progress</div>
                              <div className="w-full h-2 bg-muted rounded-full mt-1">
                                <div 
                                  className="h-2 bg-primary rounded-full" 
                                  style={{ width: `${calculateProgressPercentage(Branch.revenue, Branch.targetRevenue)}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{formatCurrency(Branch.revenue)}</span>
                                <span>Target: {formatCurrency(Branch.targetRevenue)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Branch details */}
          <div className="lg:col-span-2">
            {!selectedBrand ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Select a Branch</h2>
                  <p className="text-muted-foreground">Choose a Branch from the list to view and manage its details</p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="members">Team Members</TabsTrigger>
                  <TabsTrigger value="sales">Sales Performance</TabsTrigger>
                </TabsList>
                
                {/* Branch Details Tab */}
                <TabsContent value="details" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle>{selectedBrand.name}</CardTitle>
                        <CardDescription>
                          {selectedBrand.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditBrand(selectedBrand)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Branch
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteBrand(selectedBrand)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Branch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Industry</h3>
                        <p>{selectedBrand.industry}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Website</h3>
                        <a 
                          href={selectedBrand.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedBrand.website}
                        </a>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Status</h3>
                        <Badge variant="outline" className={getStatusColor(selectedBrand.status)}>
                          {selectedBrand.status}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Created At</h3>
                        <p>{new Date(selectedBrand.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Revenue Target</h3>
                        <div className="flex items-center justify-between">
                          <p>{formatCurrency(selectedBrand.targetRevenue)}</p>
                          <p className="text-sm text-muted-foreground">
                            Current: {formatCurrency(selectedBrand.revenue)} 
                            ({Math.round((selectedBrand.revenue / selectedBrand.targetRevenue) * 100)}%)
                          </p>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full mt-2">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${calculateProgressPercentage(selectedBrand.revenue, selectedBrand.targetRevenue)}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Team Members Tab */}
                <TabsContent value="members" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>
                        Manage users associated with this Branch
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {brandUsers.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No team members associated with this Branch
                                </TableCell>
                              </TableRow>
                            ) : (
                              brandUsers.map((brandUser) => (
                                <TableRow key={brandUser.id}>
                                  <TableCell className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={brandUser.user.avatar} alt={brandUser.user.name} />
                                      <AvatarFallback>
                                        {brandUser.user.name.substring(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{brandUser.user.name}</p>
                                      <p className="text-xs text-muted-foreground">@{brandUser.user.username}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>{brandUser.user.email}</TableCell>
                                  <TableCell>{brandUser.role}</TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleRemoveUserFromBrand(brandUser.id)}
                                    >
                                      <X className="h-4 w-4 text-destructive" />
                                      <span className="sr-only">Remove</span>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => setIsAddUserDialogOpen(true)}>
                        <Users className="mr-2 h-4 w-4" />
                        Add Team Member
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                {/* Sales Performance Tab */}
                <TabsContent value="sales" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales Performance</CardTitle>
                      <CardDescription>
                        Monthly revenue and targets for {selectedBrand.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>Revenue</TableHead>
                              <TableHead>Target</TableHead>
                              <TableHead>Growth</TableHead>
                              <TableHead>Progress</TableHead>
                              <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {salesData.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                  No sales data available for this Branch
                                </TableCell>
                              </TableRow>
                            ) : (
                              salesData.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.month}</TableCell>
                                  <TableCell>{formatCurrency(item.revenue)}</TableCell>
                                  <TableCell>{formatCurrency(item.target)}</TableCell>
                                  <TableCell>{getGrowthIndicator(item.growth)}</TableCell>
                                  <TableCell>
                                    <div className="w-full h-2 bg-muted rounded-full">
                                      <div 
                                        className={`h-2 rounded-full ${item.revenue >= item.target ? 'bg-green-500' : 'bg-primary'}`}
                                        style={{ width: `${calculateProgressPercentage(item.revenue, item.target)}%` }}
                                      ></div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleEditSales(item)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit/Create Branch Dialog */}
      <Dialog open={isEditBrandDialogOpen} onOpenChange={setIsEditBrandDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedBrand ? 'Edit Branch' : 'Create New Branch'}</DialogTitle>
            <DialogDescription>
              {selectedBrand 
                ? `Update information for ${selectedBrand.name}`
                : 'Add a new Branch to the system'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={editedBrand.name || ''}
                onChange={handleBrandEditChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="industry" className="text-right">
                Industry
              </Label>
              <Input
                id="industry"
                name="industry"
                value={editedBrand.industry || ''}
                onChange={handleBrandEditChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={editedBrand.website || ''}
                onChange={handleBrandEditChange}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                value={editedBrand.description || ''}
                onChange={handleBrandEditChange}
                className="col-span-3 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="status"
                name="status"
                value={editedBrand.status || 'pending'}
                onChange={handleBrandEditChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetRevenue" className="text-right">
                Target Revenue
              </Label>
              <Input
                id="targetRevenue"
                name="targetRevenue"
                type="number"
                value={editedBrand.targetRevenue || 0}
                onChange={handleBrandEditChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBrandDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBrand}>
              {selectedBrand ? 'Save Changes' : 'Create Branch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Branch Confirmation Dialog */}
      <Dialog open={isDeleteBrandDialogOpen} onOpenChange={setIsDeleteBrandDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {selectedBrand && `Are you sure you want to delete ${selectedBrand.name}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteBrandDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBrandConfirm}>
              Delete Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add User to Branch Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              {selectedBrand && `Add a user to ${selectedBrand.name}'s team`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user" className="text-right">
                User
              </Label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Select a user</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <select
                id="role"
                value={selectedUserRole}
                onChange={(e) => setSelectedUserRole(e.target.value as 'admin' | 'manager' | 'staff')}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUserToBrand}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Sales Data Dialog */}
      <Dialog open={isEditSalesDialogOpen} onOpenChange={setIsEditSalesDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Sales Data</DialogTitle>
            <DialogDescription>
              {editedSales.month && `Update sales data for ${editedSales.month}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="revenue" className="text-right">
                Revenue
              </Label>
              <Input
                id="revenue"
                name="revenue"
                type="number"
                value={editedSales.revenue || 0}
                onChange={handleSalesEditChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target" className="text-right">
                Target
              </Label>
              <Input
                id="target"
                name="target"
                type="number"
                value={editedSales.target || 0}
                onChange={handleSalesEditChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSalesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSalesData}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
