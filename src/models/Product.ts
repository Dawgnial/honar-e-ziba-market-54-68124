
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  is_featured?: boolean;
  discount_percentage?: number;
}

// Mock data for development and fallback scenarios
export const productsData: Product[] = [
  {
    id: "1",
    title: "کاسه سفالی دست‌ساز",
    description: "کاسه زیبای سفالی با طرح‌های سنتی ایرانی",
    price: 125000,
    imageUrl: "/lovable-uploads/65845eaa-4790-4db4-9552-62e1d93113d4.png",
    category_id: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    is_featured: true,
    discount_percentage: 15
  },
  {
    id: "2", 
    title: "گلدان سفالی آبی",
    description: "گلدان دست‌ساز با لعاب آبی فیروزه‌ای",
    price: 200000,
    imageUrl: "/lovable-uploads/ffcf916e-f264-4fb5-9d88-576b0a935b75.png",
    category_id: "1",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    is_featured: false,
    discount_percentage: 0
  },
  {
    id: "3",
    title: "ظرف سفالی کلاسیک",
    description: "ظرف سفالی با طرح کلاسیک و رنگ‌آمیزی طبیعی",
    price: 180000,
    imageUrl: "/lovable-uploads/f49c67db-ba5d-46b9-beac-42c1759eb778.png",
    category_id: "1",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
    is_featured: false,
    discount_percentage: 10
  },
  {
    id: "4",
    title: "فرش دستباف کاشان",
    description: "فرش زیبای دستباف از کاشان با طرح‌های اصیل",
    price: 5000000,
    imageUrl: "/lovable-uploads/467cf13d-00cf-48dd-9fb9-4db6e42bc4d2.png",
    category_id: "2",
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
    is_featured: true,
    discount_percentage: 5
  }
];
