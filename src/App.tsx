
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Favorites from "./pages/Favorites";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminComments from "./pages/AdminComments";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./hooks/useSupabaseAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

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
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
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
