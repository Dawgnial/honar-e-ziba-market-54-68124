import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SEOHead } from "@/components/SEOHead";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const partners = [
    "طباطبایی",
    "تندیس",
    "ملد سرام",
    "پارسیان",
    "عظیم قالب",
    "صوفی سرام",
    "توچی سرام",
    "مهرا ملد",
    "اشکان پارت",
    "اسپیرال مولد",
    "جاودان قالب"
  ];

  return (
    <>
      <SEOHead 
        title="درباره ایرولیا شاپ | اولین و بزرگ‌ترین فروشگاه تخصصی سفال و سرامیک در مشهد"
        description="فروشگاه ایرولیاشاپ در سال ۱۳۹۰ بنیان‌گذاری شد و همراه مطمئن هنرمندان سفال و سرامیک است. با ارائه باکیفیت‌ترین لوازم و ابزار حرفه‌ای."
        keywords="درباره ایرولیا شاپ, فروشگاه سفال, سرامیک مشهد, ابزار سفال‌گری"
        url="https://iroliashop.com/about"
      />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div 
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Images Section - 35% */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Image 1 - Tall */}
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group animate-fade-in">
                    <img 
                      src="/images/about-1.jpg" 
                      alt="هنرمندی سفال و سرامیک ایرولیا"
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Image 2 - Tall */}
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <img 
                      src="/images/about-2.jpg" 
                      alt="محصولات سفال و سرامیک"
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Image 3 - Wider and shorter */}
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <img 
                      src="/images/about-3.jpg" 
                      alt="فروشگاه ایرولیا شاپ"
                      className="w-full h-[250px] object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Text Content Section - 65% */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Header */}
                  <div className="text-right animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-vazir">
                      ایرولیاشاپ
                    </h1>
                    <p className="text-xl md:text-2xl text-primary font-semibold font-vazir">
                      اولین و بزرگ‌ترین فروشگاه تخصصی سفال و سرامیک در مشهد
                    </p>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-6 text-right text-foreground/80 leading-loose font-vazir text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <p>
                      فروشگاه ایرولیاشاپ در سال <strong className="text-foreground">۱۳۹۰</strong> به همت آقای گلستانی و خانم ایروانی بنیان‌گذاری شد و از همان آغاز، رسالت خود را در فراهم‌آوردن محیطی تخصصی، کامل و الهام‌بخش برای جامعه هنری کشور تعریف کرد.
                    </p>
                    
                    <p>
                      ما در ایرولیاشاپ، با عشق به هنر و ریشه‌های اصیل ایرانی، بستری آفریده‌ایم تا هنرمندان و علاقه‌مندان به سفال و سرامیک بتوانند به‌سادگی به باکیفیت‌ترین و تخصصی‌ترین لوازم مورد نیاز خود دسترسی داشته باشند.
                    </p>
                    
                    <p>
                      ایرولیاشاپ تنها یک فروشگاه نیست؛ بلکه <strong className="text-primary">پلی‌ست میان هنر دست و ابزار حرفه‌ای</strong>. از گل سفال و سرامیک، رنگ‌ها و لعاب‌های متنوع، تا چرخ‌های سفال‌گری، ابزارهای شکل‌دهی، قالب‌ها و کوره‌های برقی — هر آنچه برای خلق آثار هنری نیاز دارید، با دقتی وسواس‌گونه انتخاب کرده‌ایم تا تجربه‌ای لذت‌بخش، مطمئن و حرفه‌ای برای شما رقم بخورد.
                    </p>
                    
                    <p>
                      ما باور داریم که آفرینش با دست، سفری آرام‌بخش و نوعی مراقبه است؛ و رسالت ما این است که این مسیر را برای شما هموار، الهام‌بخش و سرشار از کیفیت کنیم.
                    </p>
                  </div>

                  {/* Partners Section */}
                  <div className="bg-muted/50 rounded-2xl p-8 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-right font-vazir">
                      همکاران ما
                    </h2>
                    <p className="text-foreground/80 mb-6 text-right leading-relaxed font-vazir text-lg">
                      همچنین ایرولیاشاپ در طی این سال‌ها افتخار همکاری با مجموعه‌ها و هنرمندان بزرگی همچون:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                      {partners.map((partner, index) => (
                        <li 
                          key={index}
                          className="flex items-center gap-3 text-foreground font-semibold text-lg font-vazir animate-fade-in"
                          style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                        >
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                          {partner}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Closing Message */}
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 shadow-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <p className="text-lg md:text-xl leading-relaxed text-right font-vazir mb-4 text-foreground">
                      ایرولیاشاپ، بیش از یک فروشگاه؛ <strong className="text-primary">خانه‌ای برای خلاقیت و آفرینش</strong> است. افتخار ما اعتماد و همراهی ارزشمند هنرمندانی‌ست که مسیر هنر خود را با ما هموار ساخته‌اند.
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-primary text-right font-vazir">
                      با تمام احترام و افتخار، در ایرولیاشاپ منتظر حضور گرم شما هستیم.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
