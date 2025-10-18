'use client';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchProducts, searchProducts } from '@/lib/features/products/productsSlice';
import Pagination from '@/components/Pagination';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isInitialMount = useRef(true);

  const { items: products, loading, error, currentPage, hasNextPage } = useSelector((state: RootState) => state.products);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      dispatch(fetchProducts({ page: 1 }));
    }
  }, [token, dispatch, router]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const handler = setTimeout(() => {
      if (searchTerm) {
        dispatch(searchProducts(searchTerm));
      } else {
        dispatch(fetchProducts({ page: 1 }));
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchProducts({ page: newPage }));
  };

  if (!token) return null;

  const showPagination = !searchTerm && (currentPage > 1 || hasNextPage);

  return (
    <main className="min-h-screen bg-off-white p-4 sm:p-8">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-dark-space">
            Explore Our Products
          </h1>
          <p className="mx-auto max-w-lg text-lg text-gray-600">
            Find, create, and manage your inventory with ease.
          </p>
        </div>
        
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">

            <div className="relative w-full md:w-1/3">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                 </span>
                 <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-full border-2 border-gray-200 bg-white py-3 pl-12 pr-6 text-dark-space placeholder-gray-400 focus:border-tan focus:outline-none focus:ring-0"
                />
            </div>
            <Link
              href="/products/new"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-green px-6 py-3 font-semibold text-off-white shadow-sm transition-transform hover:scale-105 active:scale-95 md:w-auto"
            >
              <span>Create Product</span>
            </Link>
        </div>

        {loading === 'pending' && <div className="flex justify-center p-12 text-dark-space">Loading...</div>}
        {error && <div className="flex justify-center p-12 text-burnt-sienna">Error: {error}</div>}
        {loading !== 'pending' && products.length === 0 && <div className="flex justify-center p-12 text-gray-500">No products found.</div>}
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id} className="group">
              <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                <div className="relative h-64 w-full bg-gray-100 p-4">
                  <img 
                    src={product.images?.[0] || 'https://placehold.co/600x400/F0F0F0/CCC?text=No+Image'} 
                    alt={product.name} 
                    className="h-full w-full object-contain" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="truncate text-lg font-bold text-dark-space">{product.name}</h2>
                  <p className="mt-2 text-xl font-semibold text-forest-green">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {showPagination && (
          <Pagination 
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
}
