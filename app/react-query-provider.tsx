'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

export function ReactQueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    return <QueryClientProvider client={queryClient}>
        <ProgressProvider
            height="3px"
            color="#3b82f6"
            options={{ showSpinner: true }}
            shallowRouting
        >
            {children}
        </ProgressProvider>
    </QueryClientProvider>
}
