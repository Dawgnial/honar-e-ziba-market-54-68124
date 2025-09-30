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
      showToast = true,
      customMessage,
      logToConsole = true
    } = options;

    if (logToConsole) {
      console.error('Error occurred:', error);
    }

    if (showToast) {
      let message = customMessage;
      
      if (!message) {
        if (error?.message) {
          message = error.message;
          
          // Handle specific Supabase auth error messages
          if (message.includes('Invalid login credentials')) {
            message = 'شماره همراه یا رمز عبور اشتباه است';
          } else if (message.includes('User already registered')) {
            message = 'این شماره همراه قبلاً ثبت شده است';
          } else if (message.includes('Password should be at least')) {
            message = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
          } else if (message.includes('Email not confirmed')) {
            message = 'لطفاً ایمیل خود را تأیید کنید';
          } else if (message.includes('Too many requests')) {
            message = 'تعداد تلاش‌های زیادی انجام شده. لطفاً بعداً تلاش کنید';
          }
        } else if (typeof error === 'string') {
          message = error;
        } else {
          message = 'خطای غیرمنتظره‌ای رخ داده است';
        }
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