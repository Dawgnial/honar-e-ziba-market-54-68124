
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category_id: string; // Changed from categoryId to category_id to match database
  createdAt: string;
  updatedAt: string;
  is_featured?: boolean;
  discount_percentage?: number;
  availability_status?: string;
  tags?: string[];
  stock?: number;
}
