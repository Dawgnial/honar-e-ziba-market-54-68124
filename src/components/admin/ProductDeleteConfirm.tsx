import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductDeleteConfirmProps {
  productId: string;
  productTitle: string;
  onDelete: (productId: string) => Promise<void>;
  isDeleting: boolean;
  triggerElement?: HTMLElement | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTriggerClick: (event: React.MouseEvent) => void;
}

const ProductDeleteConfirm = ({
  productId,
  productTitle,
  onDelete,
  isDeleting,
  triggerElement,
  isOpen,
  onOpenChange,
  onTriggerClick
}: ProductDeleteConfirmProps) => {
  const handleConfirmDelete = async () => {
    try {
      await onDelete(productId);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          disabled={isDeleting}
          className="hover:bg-red-50 hover:text-red-600"
          onClick={onTriggerClick}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0"
        side="left"
        align="start"
        sideOffset={5}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trash2 className="h-5 w-5" />
              تأیید حذف محصول
            </CardTitle>
            <CardDescription className="text-red-100">
              این عمل قابل بازگشت نیست
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                آیا از حذف محصول <span className="font-semibold">"{productTitle}"</span> اطمینان دارید؟
              </p>
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isDeleting}
                  className="px-4"
                >
                  انصراف
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4"
                >
                  {isDeleting ? "در حال حذف..." : "تأیید حذف"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default ProductDeleteConfirm;