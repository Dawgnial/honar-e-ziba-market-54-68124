
// Utility function to get category name from categoryId
export const getCategoryName = (categoryId: string): string => {
  const categoryMap: Record<string, string> = {
    '1': 'براشینگ و لعاب',
    '2': 'سفال و سرامیک', 
    '3': 'صنایع دستی',
    '4': 'تزئینات',
    '5': 'هنرهای سنتی'
  };
  
  return categoryMap[categoryId] || 'سایر محصولات';
};

// Hook to get category name using categories from database
export const useCategoryName = (categories: any[], categoryId: string): string => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.title : getCategoryName(categoryId);
};
