
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { optimizeCategoryImage, formatFileSize } from "@/utils/imageOptimization";

interface CategoryImageUploadProps {
  currentImageUrl?: string | null;
  onImageChange: (imageUrl: string | null) => void;
}

const CategoryImageUpload = ({ currentImageUrl, onImageChange }: CategoryImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState(currentImageUrl || "");
  const [uploadProgress, setUploadProgress] = useState(0);

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
      
      // Optimize image to WebP format with compression
      const originalSize = file.size;
      const compressedBlob = await optimizeCategoryImage(file);
      const compressedSize = compressedBlob.size;
      
      console.log(`Category image optimized: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${Math.round((1 - compressedSize/originalSize) * 100)}% smaller)`);
      
      setUploadProgress(40);
      
      // Use .webp extension for WebP images
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webp`;
      const filePath = `category-images/${fileName}`;

      setUploadProgress(60);

      // Upload compressed image
      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(filePath, compressedBlob, {
          cacheControl: '31536000', // 1 year cache for images
          upsert: false,
          contentType: 'image/webp'
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
                    فرمت‌های مجاز: JPG, PNG, GIF → تبدیل به WebP
                  </p>
                  <p className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    ✓ فشرده‌سازی و بهینه‌سازی خودکار (حداکثر 10MB)
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
