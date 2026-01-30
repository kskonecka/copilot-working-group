import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router';
import { CartProvider } from '../contexts/CartContext';
import { routeTree } from '../routeTree.gen';

// Create a custom render function that includes all providers
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    initialRouterPath = '/products/1',
    ...renderOptions
  }: {
    queryClient?: QueryClient;
    initialRouterPath?: string;
  } & Omit<RenderOptions, 'wrapper'> = {}
) {
  const memoryHistory = createMemoryHistory({
    initialEntries: [initialRouterPath],
  });

  const router = createRouter({
    routeTree,
    history: memoryHistory,
    context: {
      queryClient,
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <RouterProvider router={router} />
          {children}
        </CartProvider>
      </QueryClientProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), queryClient };
}

// Create a simpler wrapper for components that don't need routing
export function renderWithQueryClient(
  ui: ReactElement,
  {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  }: { queryClient?: QueryClient } & Omit<RenderOptions, 'wrapper'> = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <CartProvider>{children}</CartProvider>
      </QueryClientProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), queryClient };
}

// Export all from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
