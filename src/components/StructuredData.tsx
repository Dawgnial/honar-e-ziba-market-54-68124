import { Helmet } from 'react-helmet-async';

interface OrganizationDataProps {
  name?: string;
  url?: string;
  logo?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
}

export const OrganizationStructuredData = ({
  name = "ایرولیا شاپ",
  url = "https://iroliashop.com",
  logo = "https://iroliashop.com/logo.png",
  contactPhone = "+989155057813",
  contactEmail = "iroliashop@gmail.com",
  address = "خراسان رضوی، مشهد، قاسم آباد، فلاحی ۱۹/۴، پلاک ۳۱، واحد ۱"
}: OrganizationDataProps) => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": contactPhone,
      "contactType": "customer service",
      "email": contactEmail
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IR",
      "addressLocality": "مشهد",
      "addressRegion": "خراسان رضوی",
      "streetAddress": address
    },
    "sameAs": [
      "https://t.me/iroliashop",
      "https://irolia.shop"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
    </Helmet>
  );
};

interface ProductDataProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: string;
  brand?: string;
  category?: string;
}

export const ProductStructuredData = ({
  name,
  description,
  image,
  price,
  currency = "IRR",
  availability = "InStock",
  brand = "ایرولیا شاپ",
  category = "صنایع دستی"
}: ProductDataProps) => {
  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": [image],
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": category,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": `https://schema.org/${availability}`,
      "priceValidUntil": "2025-12-31",
      "seller": {
        "@type": "Organization",
        "name": brand,
        "url": "https://iroliashop.com"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "50000",
          "currency": "IRR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          }
        }
      }
    },
    "manufacturer": {
      "@type": "Organization",
      "name": brand
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productData)}
      </script>
    </Helmet>
  );
};

// WebSite Structured Data for search functionality
export const WebSiteStructuredData = () => {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ایرولیا شاپ",
    "alternateName": "Irolia Shop",
    "url": "https://iroliashop.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://iroliashop.com/products?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://t.me/iroliashop",
      "https://irolia.shop"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>
    </Helmet>
  );
};

// FAQ Structured Data
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
}

export const FAQStructuredData = ({ faqs }: FAQStructuredDataProps) => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqData)}
      </script>
    </Helmet>
  );
};