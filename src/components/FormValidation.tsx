import { z } from 'zod';

// رجکس برای شماره تلفن ایرانی
const iranianPhoneRegex = /^(\+98|0)?9\d{9}$/;

// رجکس برای کد پستی ایرانی
const iranianPostalCodeRegex = /^\d{10}$/;

// رجکس برای نام فارسی (حروف علامت‌گذاری شده)
const persianNameRegex = /^[\u0600-\u06FF\s]+$/;

// اسکیماهای اعتبارسنجی
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'نام باید حداقل ۲ حرف باشد')
    .max(50, 'نام نمی‌تواند بیش از ۵۰ حرف باشد')
    .regex(persianNameRegex, 'لطفاً نام را با حروف فارسی وارد کنید'),
  
  email: z
    .string()
    .email('آدرس ایمیل معتبر نیست')
    .min(1, 'ایمیل الزامی است'),
  
  phone: z
    .string()
    .regex(iranianPhoneRegex, 'شماره تلفن معتبر نیست (مثال: 09123456789)')
    .optional(),
  
  subject: z
    .string()
    .min(5, 'موضوع باید حداقل ۵ حرف باشد')
    .max(100, 'موضوع نمی‌تواند بیش از ۱۰۰ حرف باشد'),
  
  message: z
    .string()
    .min(10, 'پیام باید حداقل ۱۰ حرف باشد')
    .max(1000, 'پیام نمی‌تواند بیش از ۱۰۰۰ حرف باشد'),
});

export const checkoutFormSchema = z.object({
  // اطلاعات شخصی
  firstName: z
    .string()
    .min(2, 'نام باید حداقل ۲ حرف باشد')
    .max(30, 'نام نمی‌تواند بیش از ۳۰ حرف باشد')
    .regex(persianNameRegex, 'لطفاً نام را با حروف فارسی وارد کنید'),
  
  lastName: z
    .string()
    .min(2, 'نام خانوادگی باید حداقل ۲ حرف باشد')
    .max(30, 'نام خانوادگی نمی‌تواند بیش از ۳۰ حرف باشد')
    .regex(persianNameRegex, 'لطفاً نام خانوادگی را با حروف فارسی وارد کنید'),
  
  email: z
    .string()
    .email('آدرس ایمیل معتبر نیست')
    .min(1, 'ایمیل الزامی است'),
  
  phone: z
    .string()
    .regex(iranianPhoneRegex, 'شماره تلفن معتبر نیست (مثال: 09123456789)'),
  
  // آدرس
  address: z
    .string()
    .min(10, 'آدرس باید حداقل ۱۰ حرف باشد')
    .max(200, 'آدرس نمی‌تواند بیش از ۲۰۰ حرف باشد'),
  
  city: z
    .string()
    .min(2, 'نام شهر باید حداقل ۲ حرف باشد')
    .max(50, 'نام شهر نمی‌تواند بیش از ۵۰ حرف باشد')
    .regex(persianNameRegex, 'لطفاً نام شهر را با حروف فارسی وارد کنید'),
  
  state: z
    .string()
    .min(2, 'نام استان باید حداقل ۲ حرف باشد')
    .max(50, 'نام استان نمی‌تواند بیش از ۵۰ حرف باشد')
    .regex(persianNameRegex, 'لطفاً نام استان را با حروف فارسی وارد کنید'),
  
  postalCode: z
    .string()
    .regex(iranianPostalCodeRegex, 'کد پستی باید ۱۰ رقم باشد'),
  
  // سایر فیلدها
  notes: z
    .string()
    .max(500, 'یادداشت نمی‌تواند بیش از ۵۰۰ حرف باشد')
    .optional(),
});

export const subscribeFormSchema = z.object({
  email: z
    .string()
    .email('آدرس ایمیل معتبر نیست')
    .min(1, 'ایمیل الزامی است'),
  
  name: z
    .string()
    .min(2, 'نام باید حداقل ۲ حرف باشد')
    .optional(),
});

export const reviewFormSchema = z.object({
  name: z
    .string()
    .min(2, 'نام باید حداقل ۲ حرف باشد')
    .max(50, 'نام نمی‌تواند بیش از ۵۰ حرف باشد')
    .regex(persianNameRegex, 'لطفاً نام را با حروف فارسی وارد کنید'),
  
  email: z
    .string()
    .email('آدرس ایمیل معتبر نیست')
    .min(1, 'ایمیل الزامی است'),
  
  rating: z
    .number()
    .min(1, 'امتیاز باید حداقل ۱ باشد')
    .max(5, 'امتیاز نمی‌تواند بیش از ۵ باشد'),
  
  comment: z
    .string()
    .min(10, 'نظر باید حداقل ۱۰ حرف باشد')
    .max(1000, 'نظر نمی‌تواند بیش از ۱۰۰۰ حرف باشد'),
});

// تایپ‌های TypeScript برای اسکیماها
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type SubscribeFormData = z.infer<typeof subscribeFormSchema>;
export type ReviewFormData = z.infer<typeof reviewFormSchema>;

// تابع helper برای نمایش خطاهای validation
export const getValidationErrors = (error: z.ZodError) => {
  const errors: Record<string, string> = {};
  
  error.issues.forEach((err) => {
    if (err.path.length > 0) {
      const fieldName = String(err.path[0]);
      errors[fieldName] = err.message;
    }
  });
  
  return errors;
};

// تابع helper برای بررسی قوت پسورد (در صورت نیاز)
export const passwordStrengthSchema = z
  .string()
  .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'رمز عبور باید شامل حروف کوچک، بزرگ، عدد و نماد باشد');

export type PasswordData = z.infer<typeof passwordStrengthSchema>;