import { Helmet } from 'react-helmet-async';
import { Product } from '../types';

interface StructuredDataProductProps {
  product: Product;
  averageRating?: number;
  reviewCount?: number;
}

export const StructuredDataProduct = ({ 
  product, 
  averageRating = 0, 
  reviewCount = 0 
}: StructuredDataProductProps) => {
  const finalPrice = product.discount_percentage && product.discount_percentage > 0 
    ? Math.round((product.price || 0) * (1 - (product.discount_percentage || 0) / 100))
    : (product.price || 0);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description || `محصول ${product.title} از فروشگاه ایرولیا شاپ`,
    "image": product.imageUrl,
    "brand": {
      "@type": "Brand",
      "name": "ایرولیا شاپ"
    },
    "offers": {
      "@type": "Offer",
      "price": finalPrice,
      "priceCurrency": "IRR",
      "availability": product.availability_status === 'available' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "ایرولیا شاپ"
      }
    },
    "category": "سفال و سرامیک",
    "sku": product.id,
    ...(averageRating > 0 && reviewCount > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating,
        "reviewCount": reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};