'use client';

import { Label } from '@/components/ui/label';
import SignInForm from './SignInForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SignInPage() {
  return (
    <Card className='max-w-[420px] mx-auto translate-y-[30vh] p-6 space-y-4 md:space-y-6 sm:p-8'>
      <CardHeader className='p-0'>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>Enter your username and password to access your account.</CardDescription>
      </CardHeader>

      <SignInForm />
    </Card>
  );
}

export default SignInPage;
