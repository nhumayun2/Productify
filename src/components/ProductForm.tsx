'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchCategories } from '@/lib/features/categories/categoriesSlice';
import { ProductFormData, ProductSubmitData } from '@/types';

interface ProductFormProps {
  initialData?: ProductFormData | null;
  onSubmit: (data: ProductSubmitData) => void;
  isEditing?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  isEditing = false,
}: ProductFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    images: [''],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch categories only if they aren't already in the store
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // --- THIS IS THE FIX ---
  // Safely populate form if initialData is provided
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        ...initialData,
        // Ensure that formData.images is ALWAYS an array
        images: initialData.images || [''],
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, images: [e.target.value] }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (Number(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.images[0]) {
      newErrors.image = 'Image URL is required';
    } else {
      try {
        new URL(formData.images[0]);
      } catch (error) { // Use the error variable
        newErrors.image = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        price: Number(formData.price),
        // Ensure images array is not empty on submit
        images: formData.images?.[0] ? [formData.images[0]] : [],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-dark-space">Product Name</label>
        <input
          type="text" id="name" name="name" value={formData.name} onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-dark-space shadow-sm focus:border-tan focus:ring-tan"
        />
        {errors.name && <p className="mt-1 text-sm text-burnt-sienna">{errors.name}</p>}
      </div>
      
      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-dark-space">Image URL</label>
        <input
          type="text" id="image" name="image" placeholder="https://..." 
          // --- THIS IS ALSO PART OF THE FIX ---
          // Use optional chaining for extra safety
          value={formData.images?.[0] || ''} 
          onChange={handleImageChange}
          className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-dark-space shadow-sm focus:border-tan focus:ring-tan"
        />
        {errors.image && <p className="mt-1 text-sm text-burnt-sienna">{errors.image}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-dark-space">Description</label>
        <textarea
          id="description" name="description" rows={4} value={formData.description} onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-dark-space shadow-sm focus:border-tan focus:ring-tan"
        />
        {errors.description && <p className="mt-1 text-sm text-burnt-sienna">{errors.description}</p>}
      </div>

      {/* Price & Category in a grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-dark-space">Price</label>
          <input
            type="number" id="price" name="price" value={formData.price} onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-dark-space shadow-sm focus:border-tan focus:ring-tan"
          />
          {errors.price && <p className="mt-1 text-sm text-burnt-sienna">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-dark-space">Category</label>
          <select
            id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} disabled={categoriesLoading === 'pending'}
            className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-dark-space shadow-sm focus:border-tan focus:ring-tan"
          >
            <option value="">{categoriesLoading === 'pending' ? 'Loading...' : 'Select a category'}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-burnt-sienna">{errors.categoryId}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-forest-green px-4 py-3 font-semibold text-white shadow-lg shadow-forest-green/40 transition-transform hover:scale-105 active:scale-95"
      >
        {isEditing ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}

