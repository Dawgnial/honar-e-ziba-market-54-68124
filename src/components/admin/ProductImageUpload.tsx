
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, CheckCircle, Plus, Link2, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductImageUploadProps {
  currentImages?: string[];
  onImagesChange: (imageUrls: string[]) => void;
}

const ProductImageUpload = ({ currentImages = [], onImagesChange }: ProductImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState<string[]>(currentImages);

  // تأیین می‌کنم که images با currentImages همگام شود
  useEffect(() => {
    setImages(currentImages);
  }, [currentImages]);

  // اطلاع‌رسانی تغییرات تصاویر به والدین (فقط اگر تفاوت باشد)
  useEffect(() => {
    if (JSON.stringify(images) !== JSON.stringify(currentImages)) {
      onImagesChange(images);
    }
  }, [images]); // حذف onImagesChange از dependencies برای جلوگیری از حلقه

  const resizeImage = (file: File, maxWidth: number = 1200, maxHeight: number = 1200, quality: number = 0.85): Promise<Blob> => {
    return new Promise((resolve) => {
      // Always compress for better storage efficiency
      const targetSize = 1 * 1024 * 1024; // 1MB target
      let adjustedQuality = file.size > 5 * 1024 * 1024 ? 0.75 : quality;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = img;
        
        let newWidth = width;
        let newHeight = height;
        
        // Smart resizing for better space efficiency
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          newWidth = Math.floor(width * ratio);
          newHeight = Math.floor(height * ratio);
        } else if (width > 800 || height > 800) {
          // Even smaller images get optimized for space
          const ratio = Math.min(800 / width, 800 / height);
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
    if (acceptedFiles.length === 0) return;

    if (images.length + acceptedFiles.length > 5) {
      toast.error('حداکثر 5 تصویر مجاز است');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        
        if (!file.type.startsWith('image/')) {
          toast.error(`فایل ${file.name} یک تصویر معتبر نیست`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`حجم فایل ${file.name} نباید بیشتر از 10 مگابایت باشد`);
          continue;
        }

        setUploadProgress(((i + 0.2) / acceptedFiles.length) * 100);
        
        const compressedBlob = await resizeImage(file);
        
        setUploadProgress(((i + 0.4) / acceptedFiles.length) * 100);
        
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        setUploadProgress(((i + 0.6) / acceptedFiles.length) * 100);

        const { error: uploadError } = await supabase.storage
          .from('category-images')
          .upload(filePath, compressedBlob, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`خطا در آپلود ${file.name}`);
          continue;
        }

        setUploadProgress(((i + 0.8) / acceptedFiles.length) * 100);

        const { data } = supabase.storage
          .from('category-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
        setUploadProgress(((i + 1) / acceptedFiles.length) * 100);
      }

      if (uploadedUrls.length > 0) {
        const newImages = [...images, ...uploadedUrls];
        setImages(newImages);
        toast.success(`${uploadedUrls.length} تصویر با موفقیت آپلود شد`);
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error('خطا در آپلود تصاویر');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [images]); // حذف onImagesChange از dependencies

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 5,
    disabled: uploading || images.length >= 5
  });

  const handleManualUrlAdd = () => {
    if (!manualUrl.trim()) return;
    
    if (images.length >= 5) {
      toast.error('حداکثر 5 تصویر مجاز است');
      return;
    }

    const newImages = [...images, manualUrl.trim()];
    setImages(newImages);
    setManualUrl("");
    toast.success('تصویر اضافه شد');
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    toast.success('تصویر حذف شد');
  };

  return (
    <div className="space-y-6">
      {/* Current Images Preview */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-800 dark:text-white flex items-center gap-2">
              <Camera className="h-5 w-5" />
              تصاویر انتخاب شده
            </h4>
            <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {images.length} از 5
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <Card key={index} className="relative group overflow-hidden border-2 hover:border-blue-300 transition-colors">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={`تصویر محصول ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        تصویر اصلی
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      {images.length < 5 && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'transform scale-105'
                  : ''
              } ${uploading || images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-6 text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDragActive 
                    ? 'bg-blue-500 scale-110' 
                    : 'bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200'
                }`}>
                  {uploading ? (
                    <div className="relative">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{Math.round(uploadProgress)}%</span>
                      </div>
                    </div>
                  ) : uploadProgress === 100 ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <Upload className={`w-8 h-8 ${isDragActive ? 'text-white' : 'text-blue-500'}`} />
                  )}
                </div>
                
                {uploading ? (
                  <div className="space-y-3">
                    <p className="text-lg font-medium text-gray-700">در حال آپلود تصاویر...</p>
                    <div className="w-64 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : isDragActive ? (
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-blue-600">فایل‌ها را اینجا رها کنید</p>
                    <p className="text-gray-600">تصاویر شما آماده آپلود هستند</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xl font-semibold text-gray-800 mb-2">
                        تصاویر محصول را اضافه کنید
                      </p>
                      <p className="text-gray-600">
                        تصاویر را بکشید و اینجا رها کنید یا کلیک کنید
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">JPG</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full">PNG</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full">WebP</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full">حداکثر 10MB</span>
                    </div>
                    <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
                      💡 تصویر اول به عنوان تصویر اصلی محصول استفاده می‌شود
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual URL Input */}
      {images.length < 5 && (
        <Card className="bg-gray-50 dark:bg-gray-800 border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label htmlFor="imageUrl" className="text-base font-medium flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                یا آدرس تصویر را وارد کنید
              </Label>
              <div className="flex gap-3">
                <Input
                  id="imageUrl"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 h-12 border-2 focus:border-blue-500 transition-colors"
                />
                <Button
                  type="button"
                  onClick={handleManualUrlAdd}
                  disabled={!manualUrl.trim()}
                  className="h-12 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  افزودن
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductImageUpload;
