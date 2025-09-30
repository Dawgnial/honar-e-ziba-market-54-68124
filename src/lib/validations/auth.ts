import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره همراه الزامی است")
    .refine((val) => {
      return /^09\d{9}$/.test(val);
    }, "شماره تلفن باید به فرمت 09xxxxxxxxx باشد"),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "نام الزامی است")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد"),
  phone: z
    .string()
    .min(1, "شماره همراه الزامی است")
    .refine((val) => {
      return /^09\d{9}$/.test(val);
    }, "شماره تلفن باید به فرمت 09xxxxxxxxx باشد"),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .max(128, "رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد"),
  confirmPassword: z
    .string()
    .min(1, "تکرار رمز عبور الزامی است"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمزهای عبور مطابقت ندارند",
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "نام الزامی است")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد"),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^09\d{9}$/.test(val);
    }, "شماره تلفن باید به فرمت 09xxxxxxxxx باشد"),
});

export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "رمز عبور فعلی الزامی است"),
  newPassword: z
    .string()
    .min(1, "رمز عبور جدید الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .max(128, "رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد"),
  confirmPassword: z
    .string()
    .min(1, "تکرار رمز عبور جدید الزامی است"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "رمزهای عبور جدید مطابقت ندارند",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;