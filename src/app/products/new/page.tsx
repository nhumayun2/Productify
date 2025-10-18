'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { createProduct } from '@/lib/features/products/productsSlice';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';
import { ProductSubmitData } from '@/types';

export default function NewProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSubmit = (data: ProductSubmitData) => {
    dispatch(createProduct(data)).then((action) => {
      if (createProduct.fulfilled.match(action)) {
        router.push('/');
      } else {
        console.error('Failed to create product:', action.payload);
      }
    });
  };

  return (
    <main className="min-h-screen bg-off-white p-4 sm:p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-tan transition-colors hover:text-forest-green">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Back to Products</span>
            </Link>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-sm sm:p-12">
            <h1 className="mb-8 text-center text-4xl font-bold text-dark-space">Add a New Product</h1>
            <ProductForm onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  );
}
