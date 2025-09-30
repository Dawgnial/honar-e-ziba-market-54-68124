
import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import OptimizedImage from "./OptimizedImage";

interface ProductImageGalleryProps {
  images: string[];
  productTitle: string;
}

const ProductImageGallery = ({ images, productTitle }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">تصویری موجود نیست</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        setIsViewerOpen(false);
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case ' ':
        e.preventDefault();
        toggleZoom();
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image - Priority loading for first product image */}
      <div className="relative group">
        <OptimizedImage
          src={images[currentImageIndex]}
          alt={`${productTitle} - تصویر ${currentImageIndex + 1}`}
          priority={currentImageIndex === 0}
          aspectRatio="square"
          className="hover:scale-105 transition-transform duration-300 cursor-pointer"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        />
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={() => setIsViewerOpen(true)}
        />
        
        {/* View Button Overlay */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-h-11 min-w-11"
          onClick={() => setIsViewerOpen(true)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white min-h-11 min-w-11"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white min-h-11 min-w-11"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail images - only show if multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <Card
              key={index}
              className={`flex-shrink-0 w-16 h-16 overflow-hidden cursor-pointer transition-all min-h-16 min-w-16 ${
                index === currentImageIndex ? 'ring-2 ring-primary' : 'hover:ring-1 ring-gray-300'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <div className="w-full h-full">
                <OptimizedImage
                  src={image}
                  alt={`${productTitle} - بندانگشتی ${index + 1}`}
                  priority={false}
                  aspectRatio="square"
                  sizes="64px"
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Gallery Popover */}
      <Popover open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <PopoverTrigger asChild>
          <div className="hidden" />
        </PopoverTrigger>
        <PopoverContent 
          className="w-[95vw] max-w-6xl h-[85vh] p-0 bg-background border shadow-2xl"
          side="top"
          align="center"
          sideOffset={20}
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-full flex flex-col bg-background rounded-lg overflow-hidden">
            {/* Header with controls */}
            <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{productTitle}</h3>
                {images.length > 1 && (
                  <span className="text-sm text-muted-foreground">
                    {currentImageIndex + 1} از {images.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleZoom}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setIsViewerOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Image */}
            <div className="flex-1 relative flex items-center justify-center p-6 bg-muted/30">
              <img
                src={images[currentImageIndex]}
                alt={`${productTitle} - تصویر ${currentImageIndex + 1}`}
                className={`max-w-full max-h-full object-contain transition-transform duration-300 cursor-pointer ${
                  isZoomed ? 'scale-125' : 'scale-100'
                }`}
                onClick={toggleZoom}
                loading="eager"
                style={{
                  imageRendering: 'auto',
                  objectFit: 'contain',
                  maxHeight: '70vh'
                }}
              />
              
              {/* Navigation arrows - only show if multiple images */}
              {images.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background h-10 w-10 rounded-full shadow-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    onClick={nextImage}
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background h-10 w-10 rounded-full shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="p-6 bg-background border-t">
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                        index === currentImageIndex 
                          ? 'border-primary scale-105' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                    <img
                      src={image}
                      alt={`تصویر کوچک ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      style={{
                        imageRendering: 'auto',
                        objectFit: 'cover'
                      }}
                    />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProductImageGallery;
