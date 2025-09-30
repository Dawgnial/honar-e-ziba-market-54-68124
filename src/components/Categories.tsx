
import { useCategories } from "../hooks/useCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3 } from "lucide-react";
import { toFarsiNumber } from "../utils/numberUtils";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const { categories, loading } = useCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-green-light/20 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-primary/10 rounded-full px-6 py-3 mb-6">
            <Grid3X3 className="h-5 w-5 text-green-primary ml-2" />
            <span className="text-green-primary font-semibold">دسته‌بندی‌ها</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            طیف گسترده محصولات
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            از سفال‌های سنتی تا مدرن، از تزئینات خانگی تا هدایای خاص
          </p>
          {categories.length > 0 && (
            <div className="mt-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {toFarsiNumber(categories.length)} دسته‌بندی
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-light/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-persian-blue">
                    {category.title.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-persian-blue group-hover:text-green-primary transition-colors">
                  {category.title}
                </h3>
                <Badge variant="secondary" className="mt-3 bg-green-light/30 text-green-primary border-0">
                  مشاهده محصولات
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
