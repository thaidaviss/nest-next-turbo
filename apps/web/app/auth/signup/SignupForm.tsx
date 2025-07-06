'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  re_password: z.string().min(2).max(50),
  term: z.boolean().refine(val => val === true, { message: 'Please accept the terms' }),
});
function SignupForm() {
  const { register } = useAuth();
  const { pending } = useFormStatus();
  const formState = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      re_password: '',
      term: false,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { re_password, term, ...body } = values;
    const data = await register(body);
    console.log(data);
  }
  return (
    <Form {...formState}>
      <form onSubmit={formState.handleSubmit(onSubmit)}>
        <FormField
          control={formState.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Enter your email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={formState.control}
          name='re_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Re-Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='••••••••' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formState.control}
          name='term'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='text-sm flex items-start mt-5'>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='mr-3'
                  />
                  <p className='font-light text-gray-500 dark:text-gray-300'>
                    I accept the{' '}
                    <a
                      className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                      href='#'>
                      Terms and Conditions
                    </a>
                  </p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-center mt-5'>
          <Button className='w-full' aria-disabled={pending}>
            {pending ? 'Registering...' : 'Register'}
          </Button>
        </div>
        <p className='text-sm font-light text-gray-500 dark:text-gray-400 pt-3'>
          Already have an account?{' '}
          <Link
            href={SITE_MAP.LOGIN}
            className='font-medium text-primary-600 hover:underline dark:text-primary-500'>
            Login here
          </Link>
        </p>
      </form>
    </Form>
  );
}

export default SignupForm;
