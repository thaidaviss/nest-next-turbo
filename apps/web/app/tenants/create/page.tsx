'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { AlertCircle, Building, Check, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateTenantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    industry: '',
    planType: 'standard',
    adminEmail: '',
    adminName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Here we would call an API to create a new tenant
      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to tenant list
      router.push('/tenants');
    } catch (err) {
      setError('Failed to create company. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateBasicInfo = () => {
    return formData.name.trim() !== '' && formData.domain.trim() !== '' && formData.industry.trim() !== '';
  };

  const validateAdminInfo = () => {
    return formData.adminEmail.trim() !== '' && formData.adminName.trim() !== '';
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Company</h1>
            <p className="text-muted-foreground">
              Add a new company (tenant) to your multi-tenant system
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Enter the details of the new company
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="admin">Admin User</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Acme Corporation"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-gray-500" />
                      <Input
                        id="domain"
                        name="domain"
                        placeholder="acme.example.com"
                        required
                        value={formData.domain}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      placeholder="Technology, Manufacturing, etc."
                      value={formData.industry}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planType">Subscription Plan</Label>
                    <Select
                      value={formData.planType}
                      onValueChange={(value) => handleSelectChange('planType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('admin')}
                      disabled={!validateBasicInfo()}
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="admin" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Admin Name</Label>
                    <Input
                      id="adminName"
                      name="adminName"
                      placeholder="John Doe"
                      required
                      value={formData.adminName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      placeholder="admin@acme.example.com"
                      required
                      value={formData.adminEmail}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab('basic')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !validateBasicInfo() || !validateAdminInfo()}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Company'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
