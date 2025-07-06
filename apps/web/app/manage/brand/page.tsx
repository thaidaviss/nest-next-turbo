'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const mockBrands = [
  { 
    id: 1, 
    name: 'Acme Corp', 
    logo: '/brands/acme.svg', 
    industry: 'Technology', 
    website: 'https://acme.example.com',
    status: 'active',
    createdAt: '2024-03-12'
  },
  { 
    id: 2, 
    name: 'Globex', 
    logo: '/brands/globex.svg', 
    industry: 'Finance', 
    website: 'https://globex.example.com',
    status: 'active',
    createdAt: '2024-04-05'
  },
  { 
    id: 3, 
    name: 'Initech', 
    logo: '/brands/initech.svg', 
    industry: 'Consulting', 
    website: 'https://initech.example.com',
    status: 'inactive',
    createdAt: '2024-01-18'
  },
  { 
    id: 4, 
    name: 'Massive Dynamic', 
    logo: '/brands/massive.svg', 
    industry: 'Research', 
    website: 'https://massive.example.com',
    status: 'active',
    createdAt: '2024-05-22'
  },
  { 
    id: 5, 
    name: 'Stark Industries', 
    logo: '/brands/stark.svg', 
    industry: 'Manufacturing', 
    website: 'https://stark.example.com',
    status: 'pending',
    createdAt: '2024-06-10'
  }
];

export default function BrandPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  
  const filteredBrands = mockBrands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEdit = (brand: any) => {
    setSelectedBrand(brand);
    setOpenDialog(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Brand Management</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>Add New Brand</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
              <DialogDescription>
                {selectedBrand 
                  ? 'Update the brand details below.' 
                  : 'Fill in the information to add a new brand to the system.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">Name</label>
                <Input
                  id="name"
                  defaultValue={selectedBrand?.name || ''}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="industry" className="text-right">Industry</label>
                <Input
                  id="industry"
                  defaultValue={selectedBrand?.industry || ''}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="website" className="text-right">Website</label>
                <Input
                  id="website"
                  defaultValue={selectedBrand?.website || ''}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="logo" className="text-right">Logo</label>
                <Input
                  id="logo"
                  type="file"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Brands</CardTitle>
            <CardDescription>All registered brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockBrands.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Brands</CardTitle>
            <CardDescription>Currently active brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockBrands.filter(b => b.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Industries</CardTitle>
            <CardDescription>Unique industry sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(mockBrands.map(b => b.industry)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
          <div className="flex justify-between my-4">
            <Input 
              placeholder="Search brands..." 
              className="max-w-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBrands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell className="font-medium">{brand.name}</TableCell>
                        <TableCell>{brand.industry}</TableCell>
                        <TableCell>
                          <Badge variant={brand.status === 'active' ? 'default' : brand.status === 'inactive' ? 'secondary' : 'outline'}>
                            {brand.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {brand.website.replace(/^https?:\/\//, '')}
                          </a>
                        </TableCell>
                        <TableCell>{brand.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                  <circle cx="12" cy="12" r="1"/>
                                  <circle cx="12" cy="5" r="1"/>
                                  <circle cx="12" cy="19" r="1"/>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenEdit(brand)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand) => (
                <Card key={brand.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{brand.name}</CardTitle>
                      <Badge variant={brand.status === 'active' ? 'default' : brand.status === 'inactive' ? 'secondary' : 'outline'}>
                        {brand.status}
                      </Badge>
                    </div>
                    <CardDescription>{brand.industry}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-sm">
                      Website: <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {brand.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                    <div className="text-sm text-muted-foreground">Created: {brand.createdAt}</div>
                  </CardContent>
                  <div className="p-4 pt-0 flex justify-end">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenEdit(brand)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
