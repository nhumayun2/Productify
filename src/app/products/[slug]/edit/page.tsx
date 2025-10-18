'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchProductBySlug, updateProduct } from '@/lib/features/products/productsSlice';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';
import { ProductSubmitData } from '@/types';

export default function EditProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { selectedProduct, loading: productLoading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [slug, dispatch]);

  const handleSubmit = (data: ProductSubmitData) => {
    if (selectedProduct) {
      dispatch(updateProduct({ id: selectedProduct.id, data })).then((action) => {
        if (updateProduct.fulfilled.match(action)) {
          router.push(`/products/${action.payload.slug}`);
        } else {
          console.error('Failed to update product:', action.payload);
        }
      });
    }
  };
  
  if (productLoading === 'pending' && !selectedProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-off-white text-dark-space">
        Loading product...
      </div>
    );
  }
  
  if (!selectedProduct) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-off-white text-dark-space">
        Product not found.
      </div>
    )
  }

  const initialData = {
    name: selectedProduct.name,
    description: selectedProduct.description,
    price: selectedProduct.price,
    categoryId: selectedProduct.category.id,
    images: selectedProduct.images,
  };

  return (
    <main className="min-h-screen bg-off-white p-4 sm:p-8">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
            <Link href={`/products/${slug}`} className="inline-flex items-center gap-2 text-tan transition-colors hover:text-forest-green">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Back to Product</span>
            </Link>
        </div>
        <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold text-dark-space">
                Edit Product
            </h1>
            <p className="mx-auto max-w-lg text-lg text-gray-600">
                Update the details for &ldquo;{selectedProduct.name}&rdquo;.
            </p>
        </div>

        <div className="mt-8">
          <ProductForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isEditing={true}
          />
        </div>
      </div>
    </main>
  );
}

