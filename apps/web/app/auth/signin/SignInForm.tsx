'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SITE_MAP } from '@/constants';
import { useAuth } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});
function SignInForm() {
  const { pending } = useFormStatus();
  const { login, loading, error } = useAuth();
  const formState = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await login(values.username, values.password);
  };

  return (
    <Form {...formState}>
      {error && (
        <Alert variant='destructive' className='mt-4'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={formState.handleSubmit(onSubmit)}>
        <FormField
          control={formState.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Enter your username' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formState.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='••••••••' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-center mt-5'>
          <Button className='w-full ' aria-disabled={loading}>
            {loading ? 'Logging...' : 'Login'}
          </Button>
        </div>
        <p className='text-sm font-light text-gray-500 dark:text-gray-400 pt-3'>
          Already have an account?{' '}
          <Link
            href={SITE_MAP.REGISTER}
            className='font-medium text-primary-600 hover:underline dark:text-primary-500 text-blue-500'>
            Register here
          </Link>
        </p>
      </form>
    </Form>
  );
}

export default SignInForm;
