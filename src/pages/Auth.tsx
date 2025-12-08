
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, LogIn, Mail, Phone, User, Eye, EyeOff } from "lucide-react";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from "@/lib/validations/auth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useErrorHandler } from "@/hooks/useErrorHandler";


const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    confirm: false,
  });
  const { signIn, signUp, user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { handleError, handleSuccess } = useErrorHandler();
  
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });
  
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  // Redirect if already logged in - use useEffect to avoid rendering issues
  React.useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Return null while redirecting
  if (user && !loading) {
    return null;
  }
  
  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.phone, data.password);
      navigate('/');
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await signUp(data.phone, data.password, {
        name: data.name,
        phone: data.phone,
      });
      
      // Navigate to home after successful registration
      navigate('/');
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-persian-blue dark:text-persian-light">حساب کاربری</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">به ایرولیا شاپ خوش آمدید</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg shadow-lg p-6 md:p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
                <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:text-foreground">ورود</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-background data-[state=active]:text-foreground">ثبت نام</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-phone" className="text-foreground">شماره همراه</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="login-phone"
                        type="tel"
                        className="pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                        placeholder="09123456789"
                        {...loginForm.register("phone")}
                      />
                    </div>
                     {loginForm.formState.errors.phone && (
                       <p className="text-sm text-destructive">{loginForm.formState.errors.phone.message}</p>
                     )}
                   </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground">رمز عبور</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword.login ? "text" : "password"}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground pl-10"
                        placeholder="••••••••"
                        {...loginForm.register("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-0 h-full w-10"
                        onClick={() => setShowPassword({ ...showPassword, login: !showPassword.login })}
                      >
                        {showPassword.login ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-persian-blue hover:bg-persian-blue/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="border-white border-t-transparent ml-2" />
                        در حال پردازش...
                      </div>
                    ) : (
                      <>
                        <LogIn className="ml-2" size={18} />
                        ورود به حساب
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-foreground">نام کامل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="register-name"
                        placeholder="نام و نام خانوادگی"
                        className="pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                        {...registerForm.register("name")}
                      />
                    </div>
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="text-foreground">شماره همراه</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="register-phone"
                        type="tel"
                        className="pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                        placeholder="09123456789"
                        {...registerForm.register("phone")}
                      />
                    </div>
                    {registerForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-foreground">رمز عبور</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword.register ? "text" : "password"}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground pl-10"
                        placeholder="حداقل ۶ کاراکتر"
                        {...registerForm.register("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-0 h-full w-10"
                        onClick={() => setShowPassword({ ...showPassword, register: !showPassword.register })}
                      >
                        {showPassword.register ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-foreground">تکرار رمز عبور</Label>
                    <div className="relative">
                      <Input
                        id="register-confirm-password"
                        type={showPassword.confirm ? "text" : "password"}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground pl-10"
                        placeholder="••••••••"
                        {...registerForm.register("confirmPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-0 h-full w-10"
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      >
                        {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-persian-blue hover:bg-persian-blue/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="border-white border-t-transparent ml-2" />
                        در حال پردازش...
                      </div>
                    ) : (
                      <>
                        <UserPlus className="ml-2" size={18} />
                        ثبت نام
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              ورود شما به معنای پذیرش <Link to="/terms" className="text-persian-blue hover:underline">قوانین و مقررات</Link> ایرولیا شاپ است.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
