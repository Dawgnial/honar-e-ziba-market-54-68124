
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "پیام شما ارسال شد",
      description: "به زودی با شما تماس خواهیم گرفت",
    });
    setFormData({ name: "", phone: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      <main className="pt-14 sm:pt-16 lg:pt-20">
        {/* About Us Section */}
        <section className="relative py-20 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(/lovable-uploads/c08b0079-1e7d-4d11-803f-36ca04af72c0.png)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-relaxed">
                درباره ایرولیا شاپ
              </h1>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 text-white shadow-2xl border border-white/20">
                <div className="space-y-6 text-lg md:text-xl leading-relaxed font-vazir text-right">
                  <p>
                    ما در "ایرولیا شاپ"، با عشق به هنر و ریشه‌های اصیل ایرانی، بستری را فراهم کرده‌ایم تا هنرمندان و علاقه‌مندان به سفال‌گری بتوانند به‌سادگی به باکیفیت‌ترین و تخصصی‌ترین لوازم مورد نیاز خود دسترسی داشته باشند.
                  </p>
                  
                  <p>
                    مجموعه ما تنها یک فروشگاه نیست؛ بلکه پلی است میان هنر دست و ابزار حرفه‌ای.
                    از گل سفال و سرامیک و رنگ و لعاب‌های متنوع گرفته تا چرخ‌های سفال و سرامیک، ابزارهای شکل‌دهی، قالب‌ها و کوره‌های برقی — هر آنچه برای خلق آثار هنری نیاز دارید، با دقت انتخاب کرده‌ایم تا تجربه‌ای لذت‌بخش و حرفه‌ای داشته باشید.
                  </p>
                  
                  <p>
                    ما باور داریم که خلق‌کردن با دست، نوعی مراقبه و بازگشت به آرامش است، و وظیفه ما این است که این مسیر را برای شما هموار و الهام‌بخش کنیم.
                  </p>
                  
                  <p className="font-medium text-amber-200">
                    با تکیه بر تجربه، کیفیت، پشتیبانی صمیمانه و ارسال سریع، همراه شما هستیم تا هنر از دل خاک شکوفا شود.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-16 bg-gradient-to-br from-muted to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">ارتباط با ما</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  برای دریافت مشاوره و سفارش محصولات، با ما در تماس باشید
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information Card */}
                <Card className="bg-card shadow-lg border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-foreground">اطلاعات تماس</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-semibold text-foreground mb-1">ایمیل</h4>
                        <p className="text-muted-foreground" dir="ltr">iroliashop@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-semibold text-foreground mb-1">شماره تماس</h4>
                        <div className="space-y-1 text-muted-foreground">
                          <p dir="ltr">09155057813</p>
                          <p dir="ltr">09153131652</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-semibold text-foreground mb-1">ساعت کاری فروشگاه</h4>
                         <div className="space-y-1 text-muted-foreground text-sm">
                           <p>همه‌روزه از ساعت ۹ صبح تا ۱ ظهر</p>
                           <p>و ۴:۳۰ عصر تا ۷:۳۰ شب</p>
                           <p className="text-xs italic">(یکشنبه و پنجشنبه عصر تعطیل + روز های تعطیل)</p>
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-semibold text-foreground mb-1">آدرس فروشگاه</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          خراسان رضوی، مشهد، قاسم‌آباد، فلاحی ۱۹/۴، پلاک ۳۱، واحد ۱
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Social Media Section */}
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-foreground">شبکه‌های اجتماعی ما</CardTitle>
                    <p className="text-center text-muted-foreground">برای دریافت آخرین اخبار و تخفیف‌ها با ما در ارتباط باشید</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Instagram */}
                      <a 
                        href="https://instagram.com/irolia.shop" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg hover:from-pink-500/20 hover:to-purple-500/20 transition-all duration-300 group border border-pink-200/20"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.017 0C8.396 0 7.888.013 7.171.06 5.78.127 4.903.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.903.131 5.78.06 7.171.013 7.888 0 8.396 0 12.017c0 3.624.013 4.09.06 4.833.067 1.391.253 2.26.63 3.028.315.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 3.028.630.752.035 1.230.043 4.833.043 3.604 0 4.09-.008 4.833-.043 1.391-.131 2.26-.334 3.028-.63.788-.305 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.630-3.028.043-.743.056-1.209.056-4.833 0-3.624-.013-4.129-.056-4.833-.131-1.391-.334-2.26-.63-3.028a5.9 5.9 0 00-1.384-2.126A5.9 5.9 0 0019.86.63c-.765-.297-1.636-.499-3.028-.63C16.09.013 15.624.001 12.017.001zM12.017 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 2.163A3.833 3.833 0 108.184 8.159a3.833 3.833 0 003.833-3.833zm0 6.326a2.49 2.49 0 110-4.982 2.49 2.49 0 010 4.982zm4.693-6.4a.896.896 0 11-1.793 0 .896.896 0 011.793 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-right flex-1">
                          <h4 className="font-semibold text-foreground mb-1">اینستاگرام</h4>
                          <p className="text-primary font-medium" dir="ltr">@irolia.shop</p>
                          <p className="text-sm text-muted-foreground">تصاویر محصولات و آموزش‌های کاربردی</p>
                        </div>
                      </a>

                      {/* Telegram */}
                      <a 
                        href="https://t.me/irolia" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 group border border-blue-200/20"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        </div>
                        <div className="text-right flex-1">
                          <h4 className="font-semibold text-foreground mb-1">تلگرام</h4>
                          <p className="text-primary font-medium" dir="ltr">@irolia</p>
                          <p className="text-sm text-muted-foreground">دریافت سریع اطلاعات و پشتیبانی</p>
                        </div>
                      </a>

                      {/* WhatsApp */}
                      <a 
                        href="https://wa.me/989155057813" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300 group border border-green-200/20"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                        </div>
                        <div className="text-right flex-1">
                          <h4 className="font-semibold text-foreground mb-1">واتساپ</h4>
                          <p className="text-primary font-medium" dir="ltr">+989155057813</p>
                          <p className="text-sm text-muted-foreground">گفتگوی مستقیم و سریع</p>
                        </div>
                      </a>

                      <div className="text-center pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-2">
                          🌟 عضو شبکه‌های اجتماعی ما شوید و از تخفیف‌های ویژه باخبر شوید
                        </p>
                        <div className="flex justify-center gap-2">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                          <span className="inline-block w-2 h-2 bg-secondary rounded-full"></span>
                          <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      
      <Footer />
    </div>
  );
};

export default AboutUs;
