import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { ProductDetail } from './index';
import { renderWithRouter } from '../../test/test-utils';

describe('ProductDetail', () => {
  it('renders without crashing', async () => {
    renderWithRouter(<ProductDetail />);
    
    // Wait for the component to load data
    await waitFor(() => {
      expect(screen.getByText(/Back to Products/i)).toBeInTheDocument();
    });
  });

  it('renders all child components', async () => {
    renderWithRouter(<ProductDetail />);

    // Wait for data to load and check for elements from each child component
    await waitFor(() => {
      // ProductNavigation
      expect(screen.getByText(/Back to Products/i)).toBeInTheDocument();
      
      // ProductInfo - should show title and price
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
      
      // ProductMeta - should show brand, category, stock, rating
      expect(screen.getByText('Test Brand')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText(/4\.5/)).toBeInTheDocument();
      
      // ProductActions - should show Add to Cart button
      expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
    });
  });

  it('ensures correct structure with container class', async () => {
    const { container } = renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText(/Back to Products/i)).toBeInTheDocument();
    });

    // Find the main container div - CSS modules add hashed class names
    const mainContainer = container.querySelector('[class*="container"]');
    expect(mainContainer).toBeInTheDocument();
  });

  it('ensures correct structure with product class', async () => {
    const { container } = renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText(/Back to Products/i)).toBeInTheDocument();
    });

    // Find the product div
    const productDiv = container.querySelector('[class*="product"]');
    expect(productDiv).toBeInTheDocument();
  });

  it('ensures correct structure with infoSection class', async () => {
    const { container } = renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText(/Back to Products/i)).toBeInTheDocument();
    });

    // Find the infoSection div
    const infoSection = container.querySelector('[class*="infoSection"]');
    expect(infoSection).toBeInTheDocument();
  });

  it('renders product navigation outside of product section', async () => {
    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText(/Back to Products/i)).toBeInTheDocument();
    });

    const backLink = screen.getByText(/Back to Products/i);
    const parentWithProductClass = backLink.closest('[class*="product"]');
    
    // The back link should NOT be inside the product section
    expect(parentWithProductClass).toBeNull();
  });

  it('displays product data from API', async () => {
    renderWithRouter(<ProductDetail />);

    // Wait for data to load and verify it's displayed
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
    });
  });

  it('groups ProductInfo, ProductMeta, and ProductActions in infoSection', async () => {
    const { container } = renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const infoSection = container.querySelector('[class*="infoSection"]');
    expect(infoSection).toBeInTheDocument();

    // Check that key elements from each component are within infoSection
    const title = screen.getByText('Test Product');
    const brand = screen.getByText('Test Brand');
    const addToCartButton = screen.getByRole('button', { name: /Add to Cart/i });

    expect(infoSection).toContainElement(title);
    expect(infoSection).toContainElement(brand);
    expect(infoSection).toContainElement(addToCartButton);
  });

  it('maintains correct DOM hierarchy', async () => {
    const { container } = renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Find the main container
    const mainContainer = container.querySelector('[class*="container"]');
    expect(mainContainer).toBeInTheDocument();

    // Check that product div exists
    const productDiv = container.querySelector('[class*="product"]');
    expect(productDiv).toBeInTheDocument();

    // Check that infoSection exists
    const infoSection = container.querySelector('[class*="infoSection"]');
    expect(infoSection).toBeInTheDocument();

    // Verify infoSection is inside product
    expect(productDiv).toContainElement(infoSection as HTMLElement);
  });
});

