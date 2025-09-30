import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  customMessage?: string;
  logToConsole?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: any, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = false, // Changed default to false to hide error messages from users
      customMessage,
      logToConsole = true
    } = options;

    if (logToConsole) {
      console.error('Error occurred:', error);
    }

    // Only show toast messages if explicitly requested (mainly for critical auth errors)
    if (showToast && (error?.code?.startsWith('auth/') || options.customMessage)) {
      let message = customMessage;
      
      if (!message) {
        if (error?.message) {
          message = error.message;
        } else if (typeof error === 'string') {
          message = error;
        } else {
          message = 'خطای غیرمنتظره‌ای رخ داده است';
        }
      }

      // Handle specific auth error types only
      if (error?.code === 'auth/user-not-found') {
        message = 'کاربری با این ایمیل یافت نشد';
      } else if (error?.code === 'auth/wrong-password') {
        message = 'رمز عبور اشتباه است';
      } else if (error?.code === 'auth/email-already-in-use') {
        message = 'این ایمیل قبلاً ثبت شده است';
      } else if (error?.code === 'auth/weak-password') {
        message = 'رمز عبور خیلی ضعیف است';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'فرمت ایمیل صحیح نیست';
      } else if (error?.code === 'auth/too-many-requests') {
        message = 'تعداد تلاش‌های زیادی انجام شده. لطفاً بعداً تلاش کنید';
      }

      toast.error(message);
    }

    return error;
  }, []);

  const handleSuccess = useCallback((
    message: string,
    data?: any
  ) => {
    toast.success(message);
    return data;
  }, []);

  return {
    handleError,
    handleSuccess
  };
};