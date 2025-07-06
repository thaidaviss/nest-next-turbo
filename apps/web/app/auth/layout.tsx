import { PropsWithChildren } from 'react';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className=' min-h-[100vh] bg-gray-50 dark:bg-gray-900'>{children}</div>
  );
};

export default AuthLayout;
