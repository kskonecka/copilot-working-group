/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { CartProvider } from '../contexts/CartContext';

// Create a wrapper for components that need QueryClient and CartProvider
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

// Create a wrapper with router for components that need routing
export function renderWithRouter(
  ui: ReactElement,
  {
    productId = '1',
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  }: {
    productId?: string;
    queryClient?: QueryClient;
  } & Omit<RenderOptions, 'wrapper'> = {}
) {
  // Create a simple root route
  const rootRoute = createRootRoute();

  // Create a product detail route that matches the expected structure
  const productRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/products/$productId',
    component: () => ui,
  });

  const routeTree = rootRoute.addChildren([productRoute]);

  const memoryHistory = createMemoryHistory({
    initialEntries: [`/products/${productId}`],
  });

  const router = createRouter({
    routeTree,
    history: memoryHistory,
    context: {
      queryClient,
    },
  });

  function Wrapper() {
    return (
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </QueryClientProvider>
    );
  }

  return { ...render(<Wrapper />, renderOptions), queryClient, router };
}

// Export all from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
