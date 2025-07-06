'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { AlertCircle, ArrowLeft, Check, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SITE_MAP } from '@/constants';

interface Department {
  id: string;
  name: string;
}

export default function CreateEmployeePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    salary: '',
  });
  const [joinDate, setJoinDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [departments] = useState<Department[]>([
    { id: '1', name: 'IT' },
    { id: '2', name: 'Human Resources' },
    { id: '3', name: 'Finance' },
    { id: '4', name: 'Marketing' },
    { id: '5', name: 'Product Development' },
    { id: '6', name: 'Sales' },
    { id: '7', name: 'Customer Support' },
    { id: '8', name: 'Operations' }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // Create URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData.position.trim()) {
      setError('Position is required');
      return false;
    }

    if (!formData.department) {
      setError('Department is required');
      return false;
    }

    if (!joinDate) {
      setError('Join date is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here we would call an API to create the employee
      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        salary: '',
      });
      setJoinDate(undefined);
      setAvatar(null);
      setAvatarFile(null);
    } catch (err) {
      setError('Failed to create employee. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl py-6">
        <div className="mb-6">
          <Link href={SITE_MAP.EMPLOYEES} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Employees
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Add New Employee</CardTitle>
            <CardDescription>
              Create a new employee record in the system
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
            
            {isSuccess && (
              <Alert className="mb-6">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Employee has been successfully added.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="personal">Personal Information</TabsTrigger>
                  <TabsTrigger value="employment">Employment Details</TabsTrigger>
                  <TabsTrigger value="address">Address</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24">
                        {avatar ? (
                          <AvatarImage src={avatar} alt="Avatar" />
                        ) : (
                          <AvatarFallback className="text-2xl">
                            {formData.firstName && formData.lastName 
                              ? formData.firstName.charAt(0) + formData.lastName.charAt(0)
                              : 'NA'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Label 
                        htmlFor="avatar" 
                        className="mt-2 text-sm text-blue-600 cursor-pointer hover:underline"
                      >
                        Upload Photo
                      </Label>
                      <Input 
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        Upload a professional photo for this employee. The recommended size is 200x200 pixels.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="employment" className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position/Job Title *</Label>
                      <Input
                        id="position"
                        name="position"
                        placeholder="e.g., Software Engineer"
                        value={formData.position}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange('department', value)} 
                        value={formData.department}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(department => (
                            <SelectItem key={department.id} value={department.id}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !joinDate && "text-muted-foreground"
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {joinDate ? format(joinDate, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={joinDate}
                            onSelect={setJoinDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary (Annual)</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="text"
                        placeholder="e.g., 75000"
                        value={formData.salary}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="address" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main St"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="New York"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="NY"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="emergency" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      placeholder="Jane Doe"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      placeholder="+1 (555) 987-6543"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Link href={SITE_MAP.EMPLOYEES}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Add Employee"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
