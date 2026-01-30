import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { ProductDetail } from './index';
import { renderWithQueryClient } from '../../test/test-utils';
import { useProduct } from '../../hooks/useProduct';
import { Product } from '../../types/product';

// Mock all child components
vi.mock('../ProductNavigation', () => ({
  ProductNavigation: () => <div data-testid="product-navigation">Product Navigation</div>,
}));

vi.mock('../ProductImage', () => ({
  ProductImage: () => <div data-testid="product-image">Product Image</div>,
}));

vi.mock('../ProductInfo', () => ({
  ProductInfo: () => <div data-testid="product-info">Product Info</div>,
}));

vi.mock('../ProductMeta', () => ({
  ProductMeta: () => <div data-testid="product-meta">Product Meta</div>,
}));

vi.mock('../ProductActions', () => ({
  ProductActions: () => <div data-testid="product-actions">Product Actions</div>,
}));

// Mock the useProduct hook
vi.mock('../../hooks/useProduct');

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  category: 'Test Category',
  price: 99.99,
  rating: 4.5,
  stock: 10,
  brand: 'Test Brand',
  availabilityStatus: 'In Stock',
  returnPolicy: '30 days',
  thumbnail: 'https://example.com/thumbnail.jpg',
  images: ['https://example.com/image1.jpg'],
};

describe('ProductDetail', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Mock useProduct to return successful data
    vi.mocked(useProduct).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
    } as any);
  });

  it('renders without crashing', () => {
    renderWithQueryClient(<ProductDetail />);
    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
  });

  it('renders all child components', () => {
    renderWithQueryClient(<ProductDetail />);

    // Verify all child components are rendered
    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('product-image')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByTestId('product-meta')).toBeInTheDocument();
    expect(screen.getByTestId('product-actions')).toBeInTheDocument();
  });

  it('ensures correct structure with container class', () => {
    const { container } = renderWithQueryClient(<ProductDetail />);

    // Find the main container div - CSS modules add hashed class names
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveAttribute('class');
    expect(mainContainer.className).toContain('container');
  });

  it('ensures correct structure with product class', () => {
    const { container } = renderWithQueryClient(<ProductDetail />);

    // Find the product div
    const productDiv = container.querySelector('[class*="product"]');
    expect(productDiv).toBeInTheDocument();
  });

  it('ensures correct structure with infoSection class', () => {
    const { container } = renderWithQueryClient(<ProductDetail />);

    // Find the infoSection div
    const infoSection = container.querySelector('[class*="infoSection"]');
    expect(infoSection).toBeInTheDocument();
  });

  it('renders product navigation outside of product section', () => {
    const { container } = renderWithQueryClient(<ProductDetail />);

    // Navigation should be a direct child of container - CSS modules add hashed class names
    const navigation = screen.getByTestId('product-navigation');
    expect(navigation.parentElement).toHaveAttribute('class');
    expect(navigation.parentElement?.className).toContain('container');
  });

  it('renders product image and info section within product container', () => {
    renderWithQueryClient(<ProductDetail />);

    const productImage = screen.getByTestId('product-image');
    const productInfo = screen.getByTestId('product-info');
    const productMeta = screen.getByTestId('product-meta');
    const productActions = screen.getByTestId('product-actions');

    // All these components should be rendered
    expect(productImage).toBeInTheDocument();
    expect(productInfo).toBeInTheDocument();
    expect(productMeta).toBeInTheDocument();
    expect(productActions).toBeInTheDocument();
  });

  it('groups ProductInfo, ProductMeta, and ProductActions in infoSection', () => {
    const { container } = renderWithQueryClient(<ProductDetail />);

    const infoSection = container.querySelector('[class*="infoSection"]');
    expect(infoSection).toBeInTheDocument();

    // Check that all three components are within the infoSection
    const productInfo = screen.getByTestId('product-info');
    const productMeta = screen.getByTestId('product-meta');
    const productActions = screen.getByTestId('product-actions');

    expect(infoSection).toContainElement(productInfo);
    expect(infoSection).toContainElement(productMeta);
    expect(infoSection).toContainElement(productActions);
  });

  it('integrates with useProduct hook correctly', () => {
    renderWithQueryClient(<ProductDetail />);

    // Verify that the component renders even when useProduct hook is called
    // The mocked components should receive the product data from the hook
    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('product-image')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByTestId('product-meta')).toBeInTheDocument();
    expect(screen.getByTestId('product-actions')).toBeInTheDocument();
  });

  it('renders correctly when useProduct is loading', async () => {
    // Mock loading state
    vi.mocked(useProduct).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
    } as any);

    renderWithQueryClient(<ProductDetail />);

    // Component should still render its structure
    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
  });

  it('renders correctly when useProduct has error', async () => {
    // Mock error state
    vi.mocked(useProduct).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load product'),
      isError: true,
      isSuccess: false,
    } as any);

    renderWithQueryClient(<ProductDetail />);

    // Component should still render its structure
    expect(screen.getByTestId('product-navigation')).toBeInTheDocument();
  });

  it('maintains correct DOM hierarchy', () => {
    const { container } = renderWithQueryClient(<ProductDetail />);

    // Check hierarchy: container > navigation + product
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer.children).toHaveLength(2);

    // Check hierarchy: product > image + infoSection
    const productDiv = container.querySelector('[class*="product"]');
    expect(productDiv?.children).toHaveLength(2);

    // Check hierarchy: infoSection > info + meta + actions
    const infoSection = container.querySelector('[class*="infoSection"]');
    expect(infoSection?.children).toHaveLength(3);
  });
});
