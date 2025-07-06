'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Edit, Printer } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { SITE_MAP } from '@/constants';

interface SalaryRecord {
  id?: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  email: string;
  joiningDate: string;
  month: string;
  year: string;
  baseSalary: number;
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  allowances: {
    type: string;
    amount: number;
  }[];
  bonus: number;
  deductions: {
    type: string;
    amount: number;
  }[];
  netPay: number;
  status: 'pending' | 'processed' | 'paid';
  paymentDate: string | null;
  paymentMethod: string;
  bankAccount?: string;
  notes?: string;
}

export default function SalaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Mock salary record data - in a real app this would be fetched from an API
  const [salaryRecord, setSalaryRecord] = useState<SalaryRecord>({
    id: id,
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'IT',
    position: 'Senior Developer',
    email: 'john.doe@example.com',
    joiningDate: '2020-03-15',
    month: '11',
    year: '2023',
    baseSalary: 5000,
    overtime: {
      hours: 10,
      rate: 35,
      amount: 350
    },
    allowances: [
      { type: 'Housing', amount: 300 },
      { type: 'Transportation', amount: 150 },
    ],
    bonus: 200,
    deductions: [
      { type: 'Tax', amount: 100 },
      { type: 'Insurance', amount: 50 },
    ],
    netPay: 5850,
    status: 'paid',
    paymentDate: '2023-11-28',
    paymentMethod: 'Bank Transfer',
    bankAccount: '•••• •••• •••• 1234',
    notes: 'Performance bonus included for Q4 project completion.',
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'processed':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Processed</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate total allowances
  const totalAllowances = salaryRecord.allowances.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate total deductions
  const totalDeductions = salaryRecord.deductions.reduce((sum, item) => sum + item.amount, 0);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={SITE_MAP.SALARY}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Salary Slip</h1>
          {getStatusBadge(salaryRecord.status)}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12 mb-6">
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>Payslip Details</CardTitle>
            <CardDescription>
              Salary statement for {getMonthName(salaryRecord.month)} {salaryRecord.year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Employee Information</h3>
                  <div className="space-y-1 mt-2">
                    <p className="font-medium">{salaryRecord.employeeName}</p>
                    <p className="text-sm">ID: {salaryRecord.employeeId}</p>
                    <p className="text-sm">{salaryRecord.position}</p>
                    <p className="text-sm">{salaryRecord.department}</p>
                    <p className="text-sm">Joined on: {formatDate(salaryRecord.joiningDate)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Payment Information</h3>
                  <div className="space-y-1 mt-2">
                    <p className="text-sm">Payment Date: {salaryRecord.paymentDate ? formatDate(salaryRecord.paymentDate) : 'Pending'}</p>
                    <p className="text-sm">Payment Method: {salaryRecord.paymentMethod}</p>
                    {salaryRecord.bankAccount && (
                      <p className="text-sm">Account: {salaryRecord.bankAccount}</p>
                    )}
                    <p className="text-sm">Period: {getMonthName(salaryRecord.month)} {salaryRecord.year}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Basic Salary</span>
                    <span className="text-sm">${salaryRecord.baseSalary.toLocaleString()}</span>
                  </div>

                  {salaryRecord.overtime.hours > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Overtime ({salaryRecord.overtime.hours} hrs @ ${salaryRecord.overtime.rate}/hr)</span>
                      <span className="text-sm">${salaryRecord.overtime.amount.toLocaleString()}</span>
                    </div>
                  )}

                  {salaryRecord.allowances.map((allowance, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm">{allowance.type} Allowance</span>
                      <span className="text-sm">${allowance.amount.toLocaleString()}</span>
                    </div>
                  ))}

                  {salaryRecord.bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Bonus</span>
                      <span className="text-sm">${salaryRecord.bonus.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Earnings</span>
                    <span>${(salaryRecord.baseSalary + salaryRecord.overtime.amount + totalAllowances + salaryRecord.bonus).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Deductions</h3>
                <div className="space-y-2">
                  {salaryRecord.deductions.map((deduction, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm">{deduction.type}</span>
                      <span className="text-sm">${deduction.amount.toLocaleString()}</span>
                    </div>
                  ))}

                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Deductions</span>
                    <span>${totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Net Pay</span>
                <span>${salaryRecord.netPay.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
          {salaryRecord.notes && (
            <CardFooter className="flex flex-col items-start">
              <h3 className="font-medium text-sm text-muted-foreground">Notes</h3>
              <p className="text-sm mt-1">{salaryRecord.notes}</p>
            </CardFooter>
          )}
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span>${salaryRecord.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overtime</span>
                  <span>${salaryRecord.overtime.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Allowances</span>
                  <span>${totalAllowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bonus</span>
                  <span>${salaryRecord.bonus.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Earnings</span>
                  <span>${(salaryRecord.baseSalary + salaryRecord.overtime.amount + totalAllowances + salaryRecord.bonus).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Deductions</span>
                  <span>${totalDeductions.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Net Pay</span>
                  <span>${salaryRecord.netPay.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2">Year-to-Date Summary</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">YTD Earnings</span>
                    <span>$55,350.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">YTD Deductions</span>
                    <span>$1,500.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">YTD Net Pay</span>
                    <span>$53,850.00</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <Download className="h-4 w-4 mr-2" />
                Download Tax Statement
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Helper function to get month name
function getMonthName(monthNumber: string): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[parseInt(monthNumber, 10) - 1] || monthNumber;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
