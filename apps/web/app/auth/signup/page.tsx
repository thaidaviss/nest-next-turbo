'use client';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import SignupForm from './SignupForm';

function SignUpPage() {
  return (
    <Card className='max-w-[420px] mx-auto translate-y-[20vh] p-6 space-y-4 md:space-y-6 sm:p-8'>
      <div className='w-full text-center '>
        <Label className='text-2xl text-blue-700 '>Sign Up</Label>
      </div>
      <SignupForm />
    </Card>
  );
}

export default SignUpPage;
