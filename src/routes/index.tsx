import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useProducts } from '../hooks/useProducts';
import { Layout } from '../components/ui/Layout';
import { Header } from '../components/Header';
import { ProductGrid } from '../components/ProductGrid';
import { ProductCard } from '../components/ProductCard';
import { ErrorBoundary } from '../components/ErrorBoundary';

const ProductsContent = () => {
  const { data } = useProducts();

  return (
    <ProductGrid>
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductGrid>
  );
};

const IndexPage = () => {
  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        <h1>Featured Products</h1>

        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset}>
              <Suspense fallback={<p>Loading products...</p>}>
                <ProductsContent />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Layout.Main>
    </Layout>
  );
};

export const Route = createFileRoute('/')({
  component: IndexPage,
});
