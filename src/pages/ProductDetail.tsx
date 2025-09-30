import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, Share2, AlertCircle, MessageCircle, Instagram, Send, Shield, Headphones, TrendingDown } from "lucide-react";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { useCart } from "../context/CartContext";
import { useCategoryName } from "../utils/categoryUtils";
import { useCategories } from "../hooks/useCategories";
import { ProductComments } from "../components/ProductComments";
import ProductImageGallery from "../components/ProductImageGallery";
import { useFavorites } from "../context/FavoritesContext";
import { formatPriceToFarsi, toFarsiNumber } from "../utils/numberUtils";
import { SEOHead } from "../components/SEOHead";
import { EcommerceStoreStructuredData } from "../components/SEOOptimizations";
import { StructuredDataProduct } from "../components/StructuredDataProduct";
import ProductVariantSelector from "../components/ProductVariantSelector";
import ProductCustomAttributeSelector, { SelectedOption } from "../components/ProductCustomAttributeSelector";
import { ProductVariant } from "../hooks/useProductVariants";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedCustomOptions, setSelectedCustomOptions] = useState<SelectedOption[]>([]);
  const [customPriceModifier, setCustomPriceModifier] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { getProduct } = useSupabaseProducts();
  const { categories } = useCategories();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  // Get category name using the hook
  const categoryName = useCategoryName(categories, product?.category_id || '');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('شناسه محصول معتبر نیست');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
        setCurrentPrice(data?.price || 0);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('خطا در دریافت اطلاعات محصول');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if product is available before adding to cart
    const isAvailable = product.availability_status === 'available';
    
    if (!isAvailable) {
      toast({
        title: "خطا",
        description: "این محصول در حال حاضر موجود نیست",
        variant: "destructive",
      });
      return;
    }

    // Create product object with selected variant and custom attributes
    const productToAdd = {
      ...product,
      price: currentPrice,
      selectedAttributes: [
        ...(selectedVariant?.attributes?.map(attr => ({
          attribute_id: attr.attribute_id,
          attribute_value_id: attr.attribute_value_id,
          attribute_name: attr.attribute_name,
          attribute_display_name: attr.attribute_display_name,
          value: attr.value,
          display_value: attr.display_value,
          price_modifier: 0
        })) || []),
        ...selectedCustomOptions.map(option => ({
          attribute_id: option.attributeId,
          attribute_value_id: option.optionId,
          attribute_name: option.attributeName,
          attribute_display_name: option.attributeName,
          value: option.optionValue,
          display_value: option.optionValue,
          price_modifier: option.priceModifier
        }))
      ]
    };
    
    addToCart(productToAdd, quantity);
    
    toast({
      title: "موفقیت",
      description: `${product.title} به سبد خرید اضافه شد`,
    });
  };

  const handleVariantSelect = (variant: ProductVariant | null, price: number) => {
    setSelectedVariant(variant);
    
    // If custom options are selected, keep their price
    // Otherwise use variant price
    if (selectedCustomOptions.length > 0) {
      setCurrentPrice(customPriceModifier);
    } else {
      setCurrentPrice(price);
    }
  };

  const handleCustomAttributeSelect = (options: SelectedOption[], totalPrice: number) => {
    setSelectedCustomOptions(options);
    setCustomPriceModifier(totalPrice);
    
    // If custom options are selected, use their total price
    // Otherwise use variant price or base product price
    if (options.length > 0) {
      setCurrentPrice(totalPrice);
    } else {
      const basePrice = selectedVariant ? selectedVariant.price : (product?.price || 0);
      setCurrentPrice(basePrice);
    }
  };

  const handleAddToFavorites = () => {
    if (!product) return;
    const isFav = isFavorite(product.id);

    if (isFav) {
      removeFromFavorites(product.id);
      toast({
        title: "حذف شد",
        description: "محصول از لیست علاقه‌مندی‌ها حذف شد.",
      });
      return;
    }

    const images = getProductImages(product);
    const favoriteProduct = {
      id: product.id,
      title: product.title || '',
      description: product.description || '',
      price: Number(product.price) || 0,
      imageUrl: images[0] || '/placeholder.svg',
      category_id: product.category_id || '1',
      stock: Number(product.stock) || 0,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      is_featured: product.is_featured || false,
      discount_percentage: product.discount_percentage || 0,
    } as any;

    addToFavorites(favoriteProduct);
    toast({
      title: "اضافه شد",
      description: "محصول به لیست علاقه‌مندی‌ها اضافه شد.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "کپی شد",
        description: "لینک محصول کپی شد.",
      });
    }
  };

const formatPrice = (price: number): string => {
    return formatPriceToFarsi(price) + ' تومان';
  };

  // Get product images
  const getProductImages = (product: any): string[] => {
    if (product?.image_url) {
      // Check if it's already a JSON string starting with [
      if (product.image_url.startsWith('[')) {
        try {
          const parsed = JSON.parse(product.image_url);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
        } catch {
          console.error('Failed to parse image URLs:', product.image_url);
          return [];
        }
      } else {
        // Single URL string
        return [product.image_url].filter(Boolean);
      }
    }
    return [];
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">خطا در بارگذاری محصول</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.href = '/products'} variant="outline">
              بازگشت به محصولات
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const productImages = getProductImages(product);

  return (
    <Layout>
      <SEOHead 
        title={`${product.title} - ایرولیا شاپ`}
        description={product.description || `خرید ${product.title} از فروشگاه آنلاین ایرولیا شاپ. محصولات سفال و سرامیک با کیفیت و قیمت مناسب.`}
        keywords={`${product.title}, سفال, سرامیک, سفال و سرامیک, ایرولیا شاپ`}
        image={productImages[0] || '/logo.png'}
        price={product.discount_percentage && product.discount_percentage > 0 
          ? Math.round((product.price || 0) * (1 - (product.discount_percentage || 0) / 100))
          : (product.price || 0)}
        availability={product.availability_status === 'available' ? "InStock" : "OutOfStock"}
        type="product"
      />
      <EcommerceStoreStructuredData />
      <StructuredDataProduct 
        product={product} 
        averageRating={0}
        reviewCount={0}
      />
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ProductImageGallery 
              images={productImages}
              productTitle={product.title}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {categoryName}
              </Badge>
              <h1 className="text-3xl font-bold text-persian-blue mb-4">
                {product.title}
              </h1>
              <div className="mb-4">
                {product.availability_status === 'available' ? (
                  <>
                    {product.discount_percentage > 0 ? (
                      <div className="space-y-1">
                        <div className="text-lg text-gray-500 line-through">
                          {formatPrice(currentPrice || product.price)}
                        </div>
                        <div className="text-2xl font-bold text-green-primary">
                          {formatPrice(Math.round((currentPrice || product.price) * (1 - product.discount_percentage / 100)))}
                        </div>
                        <div className="inline-block">
                          <Badge className="bg-red-500 text-white text-sm">
                            {toFarsiNumber(product.discount_percentage)}% تخفیف
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-green-primary">
                        {formatPrice(currentPrice || product.price)}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-3xl font-bold text-red-500">
                    ناموجود
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">توضیحات محصول</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">وضعیت:</span>
                {product.availability_status === 'available' ? (
                  <Badge className="bg-green-500 text-white">
                    موجود
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    ناموجود
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Variant Selector */}
            <ProductVariantSelector 
              productId={id || ''}
              basePrice={product.price || 0}
              onVariantSelect={handleVariantSelect}
            />

            {/* Product Custom Attribute Selector */}
            <ProductCustomAttributeSelector 
              productId={id || ''}
              basePrice={selectedVariant ? selectedVariant.price : (product.price || 0)}
              onAttributeSelect={handleCustomAttributeSelect}
            />

            {/* Quantity Selector - Only show if available */}
            {product.availability_status === 'available' && (
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-medium">
                  تعداد:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-primary focus:border-transparent"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {toFarsiNumber(i + 1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.availability_status !== 'available'}
                className={`flex-1 ${
                  product.availability_status === 'available'
                    ? 'bg-persian-blue hover:bg-persian-blue/90'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="ml-2" size={20} />
                {product.availability_status === 'available'
                  ? 'افزودن به سبد خرید'
                  : 'ناموجود'
                }
              </Button>
              
              <Button
                onClick={handleAddToFavorites}
                variant="outline"
                size="icon"
              >
                <Heart size={20} />
              </Button>
              
              <Button
                onClick={handleShare}
                variant="outline"
                size="icon"
              >
                <Share2 size={20} />
              </Button>
            </div>

            {/* Social Media Contact */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-center">سوال دارید؟ با ما در تماس باشید</h4>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  onClick={() => {
                    window.open('https://t.me/iroliashop', '_blank');
                  }}
                >
                  <Send size={16} />
                  تلگرام
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-pink-50 hover:border-pink-500 hover:text-pink-600 transition-colors"
                  onClick={() => {
                    window.open('https://irolia.shop', '_blank');
                  }}
                >
                  <Instagram size={16} />
                  اینستاگرام
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-green-50 hover:border-green-500 hover:text-green-600 transition-colors"
                  onClick={() => {
                    window.open('https://wa.me/989155057813', '_blank');
                  }}
                >
                  <MessageCircle size={16} />
                  واتساپ
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Shield size={16} className="text-green-600" />
                  <span>ضمانت اصالت کالا</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Headphones size={16} className="text-blue-600" />
                  <span>پشتیبانی تخصصی در ساعات کاری</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <TrendingDown size={16} className="text-purple-600" />
                  <span>ضمانت بهترین قیمت</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Comments Section */}
        <div className="max-w-4xl mx-auto">
          <ProductComments productId={id || ''} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;