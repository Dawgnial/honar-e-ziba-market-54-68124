
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CategoryImageUploadProps {
  currentImageUrl?: string | null;
  onImageChange: (imageUrl: string | null) => void;
}

const CategoryImageUpload = ({ currentImageUrl, onImageChange }: CategoryImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState(currentImageUrl || "");
  const [uploadProgress, setUploadProgress] = useState(0);

  const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.85): Promise<Blob> => {
    return new Promise((resolve) => {
      // Always compress for better storage efficiency
      const targetSize = 500 * 1024; // 500KB target for categories
      let adjustedQuality = file.size > 3 * 1024 * 1024 ? 0.75 : quality;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = img;
        
        // Calculate new dimensions
        let newWidth = width;
        let newHeight = height;
        
        // Smart resizing for categories (smaller size for better storage)
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          newWidth = Math.floor(width * ratio);
          newHeight = Math.floor(height * ratio);
        } else if (width > 600 || height > 600) {
          // Categories don't need huge images
          const ratio = Math.min(600 / width, 600 / height);
          newWidth = Math.floor(width * ratio);
          newHeight = Math.floor(height * ratio);
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // استفاده از کیفیت بالاتر برای رندرینگ
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Try WebP first for best compression, fallback to JPEG
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // Fallback to JPEG with optimized quality
            canvas.toBlob(resolve, 'image/jpeg', adjustedQuality);
          }
        }, 'image/webp', adjustedQuality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً یک فایل تصویری انتخاب کنید');
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('حجم فایل نباید بیشتر از 10 مگابایت باشد');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Show progress
      setUploadProgress(20);
      
      // Compress image for faster upload
      const compressedBlob = await resizeImage(file);
      
      setUploadProgress(40);
      
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `category-images/${fileName}`;

      setUploadProgress(60);

      // Upload compressed image
      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(filePath, compressedBlob, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      const { data } = supabase.storage
        .from('category-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      onImageChange(imageUrl);
      setManualUrl(imageUrl);
      
      setUploadProgress(100);
      toast.success('تصویر با موفقیت آپلود شد');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('خطا در آپلود تصویر');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const handleManualUrlChange = (url: string) => {
    setManualUrl(url);
    onImageChange(url || null);
  };

  const removeImage = () => {
    onImageChange(null);
    setManualUrl("");
  };

  return (
    <div className="space-y-4">
      <Label>تصویر دسته‌بندی</Label>
      
      {/* Current Image Preview */}
      {(currentImageUrl || manualUrl) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={currentImageUrl || manualUrl}
                alt="تصویر دسته‌بندی"
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600 truncate">
                  {currentImageUrl || manualUrl}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drag & Drop Upload */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-persian-blue bg-persian-blue/5'
                : 'border-gray-300 hover:border-persian-blue hover:bg-gray-50'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-persian-blue/10 flex items-center justify-center">
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-persian-blue border-t-transparent rounded-full animate-spin" />
                ) : uploadProgress === 100 ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Upload className="w-6 h-6 text-persian-blue" />
                )}
              </div>
              
              {uploading ? (
                <div className="space-y-2">
                  <p className="text-gray-600">در حال آپلود... {uploadProgress}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-persian-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : isDragActive ? (
                <p className="text-persian-blue font-medium">فایل را اینجا رها کنید</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600">
                    تصویر را بکشید و اینجا رها کنید یا کلیک کنید
                  </p>
                  <p className="text-sm text-gray-400">
                    فرمت‌های مجاز: JPG, PNG, GIF, WebP (حداکثر 10MB)
                  </p>
                  <p className="text-xs text-green-600">
                    تصاویر بزرگ به صورت خودکار فشرده می‌شوند
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual URL Input */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">یا آدرس تصویر را وارد کنید</Label>
        <Input
          id="imageUrl"
          value={manualUrl}
          onChange={(e) => handleManualUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );
};

export default CategoryImageUpload;
