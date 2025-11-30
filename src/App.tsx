import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./main";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all pages except critical ones
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Auth = lazy(() => import("./pages/Auth"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Profile = lazy(() => import("./pages/Profile"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));

// Admin pages - lazy loaded
const Admin = lazy(() => import("./pages/Admin"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminComments = lazy(() => import("./pages/AdminComments"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminSupport = lazy(() => import("./pages/AdminSupport"));
const AdminTags = lazy(() => import("./pages/AdminTags"));
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./hooks/useSupabaseAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import ScrollToTop from "./components/ScrollToTop";
import SupportChatButton from "./components/SupportChatButton";

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <AuthProvider>
                <FavoritesProvider>
                  <CartProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                  <ScrollToTopOnRouteChange />
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route 
                        path="/order-history" 
                        element={
                          <ProtectedRoute>
                            <OrderHistory />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute adminOnly>
                            <Admin />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/products" 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminProducts />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/categories" 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminCategories />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/orders" 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminOrders />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/users" 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminUsers />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/comments" 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminComments />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/reports" 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminReports />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/settings" 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminSettings />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/support" 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminSupport />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/tags" 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminTags />
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <SupportChatButton />
                  <ScrollToTop />
                  </BrowserRouter>
                  </CartProvider>
                </FavoritesProvider>
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
