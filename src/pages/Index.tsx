
import { useState, useEffect } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import OptimizedFeaturedProducts from "../components/OptimizedFeaturedProducts";

import BrowsingHistory from "../components/BrowsingHistory";
import TrainingCourse from "../components/TrainingCourse";
import FrequentlyAskedQuestions from "../components/FrequentlyAskedQuestions";

import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";
import { SEOHead } from "../components/SEOHead";
import { OrganizationStructuredData, WebSiteStructuredData } from "../components/StructuredData";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // بلافاصله loading را false کنیم تا حاشیه اضافی نداشته باشیم
    setLoading(false);
  }, []);

  return (
    <ErrorBoundary>
      <SEOHead 
        title="ایرولیا شاپ | فروشگاه آنلاین خرید بهترین لوازم سفال و سرامیک"
        description="خرید بهترین و با کیفیت‌ترین لوازم سفال و سرامیک، لعاب، زیرلعابی و ابزار هنری از ایرولیا شاپ. ارسال سریع در سراسر ایران با تضمین کیفیت."
        keywords="سفال و سرامیک, لعاب, زیرلعابی, صنایع دستی, ابزار هنری, آندرگلیز, استین, فروشگاه آنلاین, ایرولیا"
        url="https://iroliashop.com"
        type="website"
      />
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      <div className="min-h-screen bg-background dark:bg-background transition-colors duration-300 font-estedad w-full overflow-x-hidden">
        <Navbar />
        {loading ? (
          <LoadingScreen />
        ) : (
          <ErrorBoundary>
            <div className="pt-14 sm:pt-16 lg:pt-20">
              <Hero />
            </div>
            <div id="categories">
              <ErrorBoundary>
                <CategoryGrid />
              </ErrorBoundary>
            </div>
            <ErrorBoundary>
              <OptimizedFeaturedProducts />
            </ErrorBoundary>
            <ErrorBoundary>
              <BrowsingHistory />
            </ErrorBoundary>
            <div id="training">
              <ErrorBoundary>
                <TrainingCourse />
              </ErrorBoundary>
            </div>
            <div id="faq">
              <ErrorBoundary>
                <FrequentlyAskedQuestions />
              </ErrorBoundary>
            </div>
          </ErrorBoundary>
        )}
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
