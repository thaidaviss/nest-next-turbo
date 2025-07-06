'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { SITE_MAP } from '@/constants';

interface Employee {
  id: string;
  name: string;
  position: string;
}

export default function CreateDepartmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    manager: '',
    location: '',
    budget: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Sample data - in a real application, this would come from an API
  const [employees] = useState<Employee[]>([
    { id: '1', name: 'John Doe', position: 'Senior Software Engineer' },
    { id: '2', name: 'Jane Smith', position: 'HR Manager' },
    { id: '3', name: 'Mike Johnson', position: 'Financial Analyst' },
    { id: '4', name: 'Sarah Williams', position: 'Product Manager' },
    { id: '5', name: 'David Brown', position: 'Marketing Specialist' }
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Department name is required');
      return false;
    }

    if (!formData.code.trim()) {
      setError('Department code is required');
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
      // Here we would call an API to create the department
      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      // Reset form
      setFormData({
        name: '',
        code: '',
        description: '',
        manager: '',
        location: '',
        budget: '',
      });
    } catch (err) {
      setError('Failed to create department. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-3xl py-6">
        <div className="mb-6">
          <Link href={SITE_MAP.DEPARTMENTS} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Departments
          </Link>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create New Department</CardTitle>
            <CardDescription>
              Add a new department to your organization structure
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
                  Department has been successfully created.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Marketing"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="code">Department Code *</Label>
                    <Input
                      id="code"
                      name="code"
                      placeholder="e.g., MKT"
                      value={formData.code}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      A short code used for identification purposes
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the department's purpose and responsibilities"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manager">Department Manager</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange('manager', value)} 
                    value={formData.manager}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} ({employee.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Headquarters, 3rd Floor"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Annual Budget</Label>
                    <Input
                      id="budget"
                      name="budget"
                      placeholder="e.g., 500000"
                      value={formData.budget}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Link href={SITE_MAP.DEPARTMENTS}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Department"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
