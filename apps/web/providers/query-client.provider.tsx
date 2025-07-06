'use client';

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * 60 * 1000, // To cache the data for 1 minute
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | null = null;

function getQueryClient() {
  if (isServer) {
    // In server, we are always creating new object because, we don't want to dehydrate all the data (from other requests) inside Query Client
    console.log('SSR');
    return createQueryClient();
  } else {
    // Using the same client, to access the cached data between Client Components
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
}

export function ReactQueryClientProvider({ children }: PropsWithChildren<unknown>) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
