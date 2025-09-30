import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  breadcrumbs?: Array<{name: string; url: string; isActive?: boolean}>;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  price?: number;
  currency?: string;
  availability?: string;
}

export const SEOHead = ({
  title = "ایرولیا شاپ - ابزار و لوازم سفال و سرامیک، از مبتدی تا حرفه‌ای",
  description = "فروشگاه آنلاین ایرولیا شاپ ارائه دهنده بهترین ابزار و لوازم سفال و سرامیک، از مبتدی تا حرفه‌ای. کاسه، گلدان، ابزار سفال و سرامیک و محصولات صنایع دستی با کیفیت بالا.",
  keywords = "سفال, سرامیک, سفال و سرامیک, ابزار سفال و سرامیک, کاسه سفالی, گلدان, صنایع دستی, ایرولیا شاپ, خرید آنلاین, ابزار هنری",
  image = "/logo.png",
  url = "https://iroliashop.com",
  type = "website",
  breadcrumbs,
  publishedTime,
  modifiedTime,
  category,
  price,
  currency = "IRR",
  availability = "InStock"
}: SEOHeadProps) => {
  
  // Generate breadcrumb structured data
  const breadcrumbData = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null;
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ایرولیا شاپ" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ایرولیا شاپ" />
      <meta property="og:locale" content="fa_IR" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {category && <meta property="article:section" content={category} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@iroliashop" />

      {/* Product-specific meta tags */}
      {price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability} />
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#328E6E" />
      <meta name="msapplication-TileColor" content="#328E6E" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ایرولیا شاپ" />
      
      {/* Performance and Loading */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Security */}
      <meta name="referrer" content="origin-when-cross-origin" />

      {/* Language and Direction */}
      <html lang="fa" dir="rtl" />
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      )}
    </Helmet>
  );
};