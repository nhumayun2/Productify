
export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id:string;
  name: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  category: Category;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  categoryId: string;
  images: string[];
}

export interface ProductSubmitData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
}