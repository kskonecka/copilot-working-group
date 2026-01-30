import { createFileRoute, useParams } from '@tanstack/react-router';
import { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useProduct } from '../../hooks/useProduct';
import { Layout } from '../../components/ui/Layout';
import { Header } from '../../components/Header';
import { ProductDetail } from '../../components/ProductDetail';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const ProductContent = () => {
  useProduct();
  return <ProductDetail />;
};

const ProductPage = () => {
  const { productId } = useParams({ from: '/products/$productId' });
  const id = Number(productId);

  // Check if id is valid before rendering the component that uses useSuspenseQuery
  if (isNaN(id) || id < 0) {
    return (
      <Layout>
        <Layout.Header>
          <Header />
        </Layout.Header>
        <Layout.Main>
          <p>Invalid product ID</p>
        </Layout.Main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Main>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset}>
              <Suspense fallback={<p>Loading product...</p>}>
                <ProductContent />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Layout.Main>
    </Layout>
  );
};

export const Route = createFileRoute('/products/$productId')({
  component: ProductPage,
});
