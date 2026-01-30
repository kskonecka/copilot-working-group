import { http, HttpResponse } from 'msw';
import type { Product } from '../../types/product';

export const mockProduct: Product = {
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

export const handlers = [
  http.get('https://dummyjson.com/products/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      ...mockProduct,
      id: Number(id),
    });
  }),
];
