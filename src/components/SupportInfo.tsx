
import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SupportInfo = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: 'تماس تلفنی',
      value: '۰۹۱۵۵۰۵۷۸۱۳',
      description: 'همه روزه ۹ تا ۱ و ۴:۳۰ تا ۸'
    },
    {
      icon: Phone,
      title: 'خط دوم',
      value: '۰۹۱۵۳۱۳۱۶۵۲',
      description: 'پاسخگویی سریع'
    },
    {
      icon: Mail,
      title: 'ایمیل',
      value: 'iroliashop@gmail.com',
      description: 'پاسخ در کمتر از ۲۴ ساعت'
    },
    {
      icon: MapPin,
      title: 'آدرس',
      value: 'مشهد، قاسم آباد، فلاحی ۱۹/۴',
      description: 'مراجعه حضوری با هماهنگی قبلی'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4 font-vazir">
            نیاز به راهنمایی دارید؟
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-estedad">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شما است
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <method.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2 font-vazir">
                {method.title}
              </h3>
              <p className="text-primary font-medium mb-1 font-estedad">
                {method.value}
              </p>
              <p className="text-sm text-foreground/70 font-estedad">
                {method.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-4 font-vazir">
            ساعات کاری پشتیبانی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground/80 mb-4 font-estedad">
            <div>
              <strong>همه روزه:</strong> ۹:۰۰ تا ۱:۰۰
            </div>
            <div>
              <strong>عصرها:</strong> ۴:۳۰ تا ۸:۰۰
            </div>
          </div>
          <p className="text-sm text-orange-600 mb-6 font-vazir">
            <strong>توجه:</strong> یکشنبه عصر و پنجشنبه عصر فروشگاه تعطیل می‌باشد
          </p>
          <Button className="bg-primary hover:bg-primary/90 font-estedad">
            تماس فوری با پشتیبانی
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SupportInfo;
