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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(initialData);
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
      } catch (_) {
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
      });
    }
  };

  // Common class for all form inputs
  const inputClass = "w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-dark-space placeholder-gray-400 focus:border-tan focus:outline-none focus:ring-0";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
        {errors.name && <p className="mt-1 text-sm text-burnt-sienna">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="image" className="mb-2 block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input type="text" id="image" name="image" placeholder="https://..." value={formData.images[0] || ''} onChange={handleImageChange} className={inputClass} />
        {errors.image && <p className="mt-1 text-sm text-burnt-sienna">{errors.image}</p>}
      </div>
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className={inputClass} />
        {errors.description && <p className="mt-1 text-sm text-burnt-sienna">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Price */}
        <div>
          <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700">
            Price
          </label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className={inputClass} />
          {errors.price && <p className="mt-1 text-sm text-burnt-sienna">{errors.price}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} disabled={categoriesLoading === 'pending'} className={inputClass}>
            <option value="">Select a category</option>
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
        className="w-full rounded-full bg-forest-green px-6 py-4 text-lg font-semibold text-off-white shadow-sm transition-transform hover:scale-105 active:scale-95"
      >
        {isEditing ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}
