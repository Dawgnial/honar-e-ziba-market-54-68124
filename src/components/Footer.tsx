
import { Instagram, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight - 80;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };


  return (
    <footer className="bg-persian-blue dark:bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us */}
          <div className="lg:col-span-2">
            <h3 className="text-xl mb-4" style={{ fontWeight: 700 }}>درباره ایرولیا شاپ</h3>
            <p className="text-white/80 mb-4 leading-relaxed" style={{ fontWeight: 400 }}>
              ایرولیا شاپ، همراه مطمئن هنرمندان سرامیک و سفال در مسیر خلق آثار ماندگار.
            </p>
            <div>
              <h4 className="text-lg mb-3" style={{ fontWeight: 600 }}>شبکه‌های اجتماعی</h4>
              <p className="text-white/80 mb-3 text-sm" style={{ fontWeight: 400 }}>ما را در شبکه های اجتماعی دنبال کنید:</p>
              <div className="flex space-x-4 space-x-reverse">
                <a 
                  href="https://t.me/iroliashop" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-persian-gold transition-colors"
                >
                  <Send size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/irolia.shop" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://wa.me/989155057813" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-400 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl mb-4" style={{ fontWeight: 700 }}>دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors" style={{ fontWeight: 400 }}>صفحه اصلی</Link>
              </li>
              <li>
                <Link to="/products" className="text-white/80 hover:text-white transition-colors" style={{ fontWeight: 400 }}>محصولات</Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("categories")}
                  className="text-white/80 hover:text-white transition-colors text-right"
                  style={{ fontWeight: 400 }}
                >
                  دسته‌بندی‌ها
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("faq")}
                  className="text-white/80 hover:text-white transition-colors text-right"
                  style={{ fontWeight: 400 }}
                >
                  سوالات متداول
                </button>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors" style={{ fontWeight: 400 }}>تماس با ما</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors" style={{ fontWeight: 400 }}>درباره ما</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div id="contact">
            <h3 className="text-xl mb-4" style={{ fontWeight: 700 }}>تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 space-x-reverse">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span className="text-white/80 text-base text-right font-vazir">خراسان رضوی، مشهد، قاسم آباد، فلاحی ۱۹/۴، پلاک ۳۱، واحد ۱</span>
              </li>
              <li className="flex items-center space-x-3 space-x-reverse">
                <Phone size={20} />
                <div className="flex flex-col space-y-1">
                  <span className="text-white/80 hover:text-white transition-colors font-estedad">
                    <a href="tel:+989155057813">۰۹۱۵۵۰۵۷۸۱۳</a>
                  </span>
                  <span className="text-white/80 hover:text-white transition-colors font-vazir">
                    <a href="tel:+989153131652">۰۹۱۵۳۱۳۱۶۵۲</a>
                  </span>
                </div>
              </li>
              <li className="flex items-center space-x-3 space-x-reverse">
                <Mail size={20} />
                <span className="text-white/80 hover:text-white transition-colors font-estedad">
                  <a href="mailto:iroliashop@gmail.com">iroliashop@gmail.com</a>
                </span>
              </li>
              <li className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-white/20 p-1 rounded mt-1">
                  <span className="text-xs font-vazir">⏰</span>
                </div>
                 <div className="text-white/80 font-estedad text-sm">
                   <div><strong>همه روزه:</strong></div>
                   <div>۹ صبح تا ۱ ظهر</div>
                   <div>۴:۳۰ بعد از ظهر تا ۷:۳۰ شب</div>
                   <div className="text-orange-300 text-xs mt-1">
                     یکشنبه عصر و پنجشنبه عصر تعطیل + روز های تعطیل
                   </div>
                 </div>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-center md:text-right mb-4 md:mb-0 font-estedad">
            © ۱۴۰۴ ایرولیا شاپ. تمامی حقوق محفوظ است.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/terms" className="text-white/80 hover:text-white transition-colors text-sm font-vazir">شرایط و قوانین</Link>
            <Link to="/privacy" className="text-white/80 hover:text-white transition-colors text-sm font-estedad">حریم خصوصی</Link>
            <Link to="/faq" className="text-white/80 hover:text-white transition-colors text-sm font-vazir">سوالات متداول</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
