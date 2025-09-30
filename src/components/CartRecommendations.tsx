import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useCart } from '../context/CartContext';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Plus } from 'lucide-react';
import { toFarsiNumber } from "../utils/numberUtils";
import { useToast } from "@/hooks/use-toast";
import { Product } from '../models/Product';

const CartRecommendations = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useCart();
  const { products } = useSupabaseProducts();
  const { toast } = useToast();

  useEffect(() => {
    const generateRecommendations = () => {
      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      // گرفتن دسته‌بندی‌های موجود در سبد خرید
      const cartCategories = [...new Set(cart.map(item => item.category_id))];
      const cartProductIds = cart.map(item => item.id);

      let recommendedProducts: any[] = [];

      if (cartCategories.length > 0) {
        // پیشنهاد محصولات مرتبط بر اساس دسته‌بندی
        recommendedProducts = products
          .filter(product => 
            product.is_active && 
            cartCategories.includes(product.category_id) && 
            !cartProductIds.includes(product.id)
          )
          .slice(0, 4);
      }

      // اگر محصولات کافی نداشتیم، محصولات فعال دیگر را اضافه کنیم
      if (recommendedProducts.length < 4) {
        const additionalProducts = products
          .filter(product => 
            product.is_active && 
            !cartProductIds.includes(product.id) &&
            !recommendedProducts.some(rec => rec.id === product.id)
          )
          .slice(0, 4 - recommendedProducts.length);
        
        recommendedProducts = [...recommendedProducts, ...additionalProducts];
      }

      setRecommendations(recommendedProducts);
      setLoading(false);
    };

    generateRecommendations();
  }, [cart, products]);

  const handleAddToCart = (product: any) => {
    const cartProduct: Product = {
      id: product.id,
      title: product.title,
      description: product.description || '',
      price: product.price || 0,
      imageUrl: (() => {
        try {
          const imageUrls = typeof product.image_url === 'string' 
            ? JSON.parse(product.image_url) 
            : product.image_url;
          return Array.isArray(imageUrls) && imageUrls.length > 0 
            ? imageUrls[0] 
            : '/placeholder.svg';
        } catch {
          return product.image_url || '/placeholder.svg';
        }
      })(),
      category_id: product.category_id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addToCart(cartProduct);
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `${product.title} با موفقیت به سبد خرید شما اضافه شد.`,
    });
  };

  if (loading) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin ml-2"></div>
          <span>در حال بارگذاری پیشنهادات...</span>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <Card className="border-primary/10">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="text-xl flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
            شاید دوست داشته باشید
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            محصولات پیشنهادی بر اساس انتخاب‌های شما
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
                    <img 
                      src={(() => {
                        try {
                          const imageUrls = typeof product.image_url === 'string' 
                            ? JSON.parse(product.image_url) 
                            : product.image_url;
                          return Array.isArray(imageUrls) && imageUrls.length > 0 
                            ? imageUrls[0] 
                            : '/placeholder.svg';
                        } catch {
                          return product.image_url || '/placeholder.svg';
                        }
                      })()} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
                      {product.title}
                    </h3>
                    
                    <div className="text-primary font-bold text-sm">
                      {toFarsiNumber(product.price?.toLocaleString() || '0')} تومان
                    </div>
                    
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full h-8 text-xs bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-3 h-3 ml-1" />
                      افزودن به سبد
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartRecommendations;