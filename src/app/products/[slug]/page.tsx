'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchProductBySlug, deleteProduct } from '@/lib/features/products/productsSlice';
import Link from 'next/link';
import Image from 'next/image';
import ConfirmationModal from '@/components/ConfirmationModal';

// Helper function to validate URL
function isValidUrl(urlString: string | undefined | null): boolean {
  if (!urlString) return false;
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

export default function ProductDetailPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { token } = useSelector((state: RootState) => state.auth);
  const { selectedProduct, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (slug) {
      // --- THIS IS THE FIX ---
      // We now check the result of the dispatch action
      dispatch(fetchProductBySlug(slug)).then(action => {
        // If the fetch action was rejected, it means the slug is likely invalid
        if (fetchProductBySlug.rejected.match(action)) {
          // Redirect to the homepage for a better user experience
          router.push('/');
        }
      });
    }
  }, [slug, dispatch, token, router]);


  const handleConfirmDelete = () => {
    if (selectedProduct) {
      dispatch(deleteProduct(selectedProduct.id)).then((action) => {
        if (deleteProduct.fulfilled.match(action)) {
          router.push('/');
        }
      });
    }
  };

  // Show loading state ONLY if there's no product data yet
  if (loading === 'pending' && !selectedProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-off-white text-dark-space">
        Loading product details...
      </div>
    );
  }

  // If there's an error AND no product, something went wrong initially
  if (error && !selectedProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-off-white text-burnt-sienna">
        Error: {error}
      </div>
    );
  }

  // If there's no product after loading, it's likely being redirected
  if (!selectedProduct) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-off-white text-dark-space">
            Loading product details...
        </div>
    );
  }


  return (
    <>
      <main className="min-h-screen bg-off-white p-4 sm:p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-tan transition-colors hover:text-forest-green">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Back to Products</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            {/* Left Column: Image */}
            <div className="h-[500px] rounded-xl bg-white p-6 shadow-sm">
               <img 
                src={isValidUrl(selectedProduct.images?.[0]) ? selectedProduct.images[0] : 'https://placehold.co/600x400/F0F0F0/CCC?text=No+Image'}
                alt={selectedProduct.name}
                className="h-full w-full object-contain"
              />
            </div>
            
            {/* Right Column: Details */}
            <div className="flex flex-col py-4">
              <span className="mb-2 text-sm font-semibold uppercase tracking-widest text-tan">
                {selectedProduct.category.name}
              </span>
              <h1 className="text-4xl font-bold text-dark-space sm:text-5xl">{selectedProduct.name}</h1>
              <p className="mt-4 text-4xl font-bold text-forest-green">${selectedProduct.price}</p>
              <p className="mt-6 flex-grow text-lg text-gray-600">{selectedProduct.description}</p>
              
              <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row">
                <Link
                  href={`/products/${selectedProduct.slug}/edit`}
                  className="flex flex-1 items-center justify-center rounded-full bg-tan px-8 py-3 text-center font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                >
                  Edit Product
                </Link>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex flex-1 items-center justify-center rounded-full bg-burnt-sienna px-8 py-3 font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
      />
    </>
  );
}

