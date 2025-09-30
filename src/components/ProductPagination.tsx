
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toFarsiNumber } from "../utils/numberUtils";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

export const ProductPagination = ({ currentPage, totalPages, onPageChange }: ProductPaginationProps) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 mt-12">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        صفحه {toFarsiNumber(currentPage)} از {toFarsiNumber(totalPages)}
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext 
              onClick={() => {
                const newPage = Math.min(totalPages, currentPage + 1);
                onPageChange(newPage);
                scrollToTop();
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            >
              بعدی
            </PaginationNext>
          </PaginationItem>
          
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => {
                    onPageChange(page as number);
                    scrollToTop();
                  }}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {toFarsiNumber(page as number)}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => {
                const newPage = Math.max(1, currentPage - 1);
                onPageChange(newPage);
                scrollToTop();
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            >
              قبلی
            </PaginationPrevious>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
