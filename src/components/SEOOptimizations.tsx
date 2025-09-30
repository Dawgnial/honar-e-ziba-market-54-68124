import { Helmet } from 'react-helmet-async';

// JSON-LD for E-commerce Store
export const EcommerceStoreStructuredData = () => {
  const storeData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "ایرولیا شاپ",
    "description": "فروشگاه آنلاین تخصصی سفال و سرامیک و صنایع دستی ایرانی",
    "url": "https://iroliashop.com",
    "logo": "https://iroliashop.com/logo.png",
    "image": "https://iroliashop.com/logo.png",
    "telephone": "+989155057813",
    "email": "iroliashop@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "خراسان رضوی، مشهد، قاسم آباد، فلاحی ۱۹/۴، پلاک ۳۱، واحد ۱",
      "addressLocality": "مشهد",
      "addressRegion": "خراسان رضوی", 
      "postalCode": "91735",
      "addressCountry": "IR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "36.2974",
      "longitude": "59.6059"
    },
    "openingHours": "Mo-Fr 08:00-18:00",
    "priceRange": "$$",
    "paymentAccepted": ["Credit Card", "Bank Transfer", "Cash"],
    "currenciesAccepted": "IRR",
    "sameAs": [
      "https://t.me/iroliashop",
      "https://irolia.shop"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "محصولات سفال و سرامیک",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "لعاب‌های سفال و سرامیک",
          "numberOfItems": "50+"
        },
        {
          "@type": "OfferCatalog", 
          "name": "ابزار سفال و سرامیک",
          "numberOfItems": "30+"
        },
        {
          "@type": "OfferCatalog",
          "name": "صنایع دستی",
          "numberOfItems": "100+"
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(storeData)}
      </script>
    </Helmet>
  );
};

// Optimize images with lazy loading and proper sizing
export const imageOptimizationProps = {
  loading: "lazy" as const,
  decoding: "async" as const,
  sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
};

// Generate proper alt text for products
export const generateProductAlt = (productName: string, category?: string) => {
  return `${productName} - ${category || 'محصول'} سفال و سرامیک با کیفیت از ایرولیا شاپ`;
};

// SEO-optimized meta tags for different content types
export const contentTypeOptimization = {
  product: {
    type: "product",
    section: "product"
  },
  category: {
    type: "website", 
    section: "category"
  },
  article: {
    type: "article",
    section: "blog"
  }
};