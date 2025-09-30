import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const ContactUs = () => {
  return (
    <>
      <SEOHead 
        title="تماس با ما | ایرولیا شاپ"
        description="برای دریافت مشاوره و سفارش محصولات سفال و سرامیک با ایرولیا شاپ در تماس باشید. آدرس، شماره تماس و شبکه‌های اجتماعی ما."
        keywords="تماس با ما, آدرس فروشگاه, شماره تماس ایرولیا, مشهد سفال"
        url="https://iroliashop.com/contact"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-vazir">تماس با ما</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-vazir">
                برای دریافت مشاوره و سفارش محصولات، با ما در تماس باشید
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information Card */}
              <Card className="bg-white shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="bg-gradient-to-r from-green-primary to-green-secondary text-white rounded-t-xl">
                  <CardTitle className="text-2xl text-center font-vazir">اطلاعات تماس</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-7 w-7 text-blue-600" />
                    </div>
                    <div className="text-right flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg font-vazir">ایمیل</h4>
                      <a 
                        href="mailto:iroliashop@gmail.com"
                        className="text-gray-700 hover:text-blue-600 transition-colors font-estedad"
                        dir="ltr"
                      >
                        iroliashop@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-7 w-7 text-green-600" />
                    </div>
                    <div className="text-right flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg font-vazir">شماره تماس</h4>
                      <div className="space-y-2 text-gray-700 font-vazir">
                        <p dir="ltr">
                          <a href="tel:+989155057813" className="hover:text-green-600 transition-colors">
                            ۰۹۱۵۵۰۵۷۸۱۳
                          </a>
                        </p>
                        <p dir="ltr">
                          <a href="tel:+989153131652" className="hover:text-green-600 transition-colors">
                            ۰۹۱۵۳۱۳۱۶۵۲
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-7 w-7 text-amber-600" />
                    </div>
                    <div className="text-right flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg font-vazir">ساعت کاری فروشگاه</h4>
                      <div className="space-y-1 text-gray-700 font-vazir">
                        <p>همه‌روزه از ساعت ۹ صبح تا ۱ ظهر</p>
                        <p>و ۴:۳۰ عصر تا ۷:۳۰ شب</p>
                        <p className="text-sm text-amber-600 italic mt-2">
                          (یکشنبه و پنجشنبه عصر تعطیل + روز های تعطیل)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-7 w-7 text-red-600" />
                    </div>
                    <div className="text-right flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg font-vazir">آدرس فروشگاه</h4>
                      <p className="text-gray-700 leading-relaxed font-vazir">
                        خراسان رضوی، مشهد، قاسم‌آباد، فلاحی ۱۹/۴، پلاک ۳۱، واحد ۱
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Social Media Card */}
              <Card className="bg-white shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
                  <CardTitle className="text-2xl text-center font-vazir">شبکه‌های اجتماعی ما</CardTitle>
                  <p className="text-center text-white/90 text-sm mt-2 font-vazir">
                    برای دریافت آخرین اخبار و تخفیف‌ها با ما در ارتباط باشید
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Instagram */}
                    <a 
                      href="https://www.instagram.com/irolia.shop" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:from-pink-100 hover:to-purple-100 transition-all duration-300 group border border-pink-200"
                    >
                      <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.017 0C8.396 0 7.888.013 7.171.06 5.78.127 4.903.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.903.131 5.78.06 7.171.013 7.888 0 8.396 0 12.017c0 3.624.013 4.09.06 4.833.067 1.391.253 2.26.63 3.028.315.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 3.028.630.752.035 1.230.043 4.833.043 3.604 0 4.09-.008 4.833-.043 1.391-.131 2.26-.334 3.028-.63.788-.305 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.630-3.028.043-.743.056-1.209.056-4.833 0-3.624-.013-4.129-.056-4.833-.131-1.391-.334-2.26-.63-3.028a5.9 5.9 0 00-1.384-2.126A5.9 5.9 0 0019.86.63c-.765-.297-1.636-.499-3.028-.63C16.09.013 15.624.001 12.017.001zM12.017 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 2.163A3.833 3.833 0 108.184 8.159a3.833 3.833 0 003.833-3.833zm0 6.326a2.49 2.49 0 110-4.982 2.49 2.49 0 010 4.982zm4.693-6.4a.896.896 0 11-1.793 0 .896.896 0 011.793 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-right flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 font-vazir">اینستاگرام</h4>
                        <p className="text-pink-600 font-medium font-estedad" dir="ltr">@irolia.shop</p>
                        <p className="text-sm text-gray-600 font-vazir">تصاویر محصولات و آموزش‌های کاربردی</p>
                      </div>
                    </a>

                    {/* Telegram */}
                    <a 
                      href="https://t.me/irolia" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 group border border-blue-200"
                    >
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </div>
                      <div className="text-right flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 font-vazir">تلگرام</h4>
                        <p className="text-blue-600 font-medium font-estedad" dir="ltr">@irolia</p>
                        <p className="text-sm text-gray-600 font-vazir">دریافت سریع اطلاعات و پشتیبانی</p>
                      </div>
                    </a>

                    {/* WhatsApp */}
                    <a 
                      href="https://wa.me/989155057813" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group border border-green-200"
                    >
                      <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </div>
                      <div className="text-right flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 font-vazir">واتساپ</h4>
                        <p className="text-green-600 font-medium font-estedad" dir="ltr">+۹۸۹۱۵۵۰۵۷۸۱۳</p>
                        <p className="text-sm text-gray-600 font-vazir">گفتگوی مستقیم و سریع</p>
                      </div>
                    </a>

                    <div className="text-center pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3 font-vazir">
                        🌟 عضو شبکه‌های اجتماعی ما شوید و از تخفیف‌های ویژه باخبر شوید
                      </p>
                      <div className="flex justify-center gap-2">
                        <span className="inline-block w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                        <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        <span className="inline-block w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ContactUs;
