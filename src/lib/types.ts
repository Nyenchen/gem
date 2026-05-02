export interface Product {
  id: string;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  price: number;
  originalPrice?: number;
  weight: number; // carats
  category: string;
  cut: string;
  color: string;
  images: string[];
  videoUrl?: string;
  featured: boolean;
  isNew: boolean;
  isRare: boolean;
  createdAt: string;
}

export type Locale = 'zh' | 'en';

export interface FilterState {
  category: string;
  cut: string;
  color: string;
  minPrice: number;
  maxPrice: number;
  minWeight: number;
  maxWeight: number;
  sortBy: 'popular' | 'newest' | 'priceAsc' | 'priceDesc' | 'weight';
}
