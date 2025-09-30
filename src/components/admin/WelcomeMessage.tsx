
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { useSupabaseAuth } from "../../hooks/useSupabaseAuth";

const WelcomeMessage = () => {
  const { user } = useSupabaseAuth();

  return (
    <Card className="bg-gradient-to-r from-persian-blue to-blue-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              خوش آمدید به پنل مدیریت!
            </h2>
            <p className="text-blue-100 mb-4">
              {user?.email ? `${user.email} عزیز،` : ''} از اینجا می‌توانید فروشگاه خود را مدیریت کنید
            </p>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = '/admin/products'}
                className="bg-white text-persian-blue hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 ml-2" />
                افزودن محصول جدید
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/admin/categories'}
                className="border-white text-white hover:bg-white hover:text-persian-blue"
              >
                <Settings className="h-4 w-4 ml-2" />
                مدیریت دسته‌بندی‌ها
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Settings className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeMessage;
