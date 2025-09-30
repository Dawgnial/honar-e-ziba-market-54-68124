
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import ModernAdminLayout from "../components/admin/ModernAdminLayout";
import { ThemeProvider } from "../components/ThemeProvider";

const Admin = () => {
  const { loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-persian-blue"></div>
          <p className="text-lg font-vazir text-gray-600 dark:text-gray-400">در حال بارگذاری پنل مدیریت...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="admin-ui-theme">
      <ModernAdminLayout />
    </ThemeProvider>
  );
};

export default Admin;
