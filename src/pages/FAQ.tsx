
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead } from "../components/SEOHead";
import { FAQStructuredData } from "../components/StructuredData";
import { Breadcrumb } from "../components/Breadcrumb";

const FAQ = () => {
  const faqs = [
    {
      question: "روش‌های پرداخت در ایرولیا شاپ چیست؟",
      answer: "پرداخت سفارش‌ها به دو صورت امکان‌پذیر است: کارت به کارت به شماره حساب/کارت فروشگاه یا پرداخت حضوری از طریق دستگاه کارت‌خوان در فروشگاه."
    },
    {
      question: "زمان ارسال محصولات چقدر است؟",
      answer: "مشهد: سفارش‌ها حداکثر ظرف ۱ تا ۳ ساعت پس از پرداخت، از طریق اسنپ و به‌عهده مشتری ارسال می‌گردد.\nسایر شهرها: سفارش‌ها طی ۱ تا ۷ روز کاری پس از پرداخت فاکتور ارسال خواهند شد."
    },
    {
      question: "آیا محصولات گارانتی دارند؟",
      answer: "بله. اکثر محصولات ما دارای گارانتی اصالت و تضمین کیفیت می‌باشند."
    },
    {
      question: "هزینه ارسال چقدر است؟",
      answer: "هزینه ارسال سفارش بر اساس موقعیت جغرافیایی، تعداد بسته‌ها و وزن کالا توسط شرکت‌های حمل‌ونقل (مانند تیپاکس یا چاپار) محاسبه می‌شود. به همین دلیل فروشگاه امکان اعلام مبلغ دقیق پیش از ارسال را ندارد."
    },
    {
      question: "روش‌های ارسال کالا کدام است؟",
      answer: "چاپار و تیپاکس: برای اکثر سفارش‌ها.\nباربری اتوبوس: مخصوص سفارش‌های با تعداد بالا یا اقلام شکستنی (مانند قالب‌ها)."
    }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-300">
      <SEOHead 
        title="سوالات متداول | ایرولیا شاپ"
        description="پاسخ تمام سوالات شما در مورد خرید، ارسال، مرجوعی و کیفیت محصولات سفال و سرامیک ایرولیا شاپ."
        keywords="سوالات متداول, پشتیبانی, ارسال, مرجوعی, گارانتی"
        url="https://iroliashop.com/faq"
        breadcrumbs={[
          { name: "سوالات متداول", url: "/faq", isActive: true }
        ]}
      />
      <FAQStructuredData faqs={faqs} />
      <Navbar />
      
      <main className="container-custom py-12 pt-14 sm:pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb 
            items={[{ name: "سوالات متداول", url: "/faq", isActive: true }]}
            className="mb-8"
          />
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 font-estedad">
              سوالات متداول
            </h1>
            <p className="text-lg text-muted-foreground font-vazir">
              پاسخ به سوالات رایج شما درباره خرید، ارسال و محصولات ایرولیا شاپ
            </p>
          </div>

          <div className="bg-card dark:bg-card rounded-lg shadow-lg border border-border p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-right">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <span className="font-vazir">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-estedad">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border-r-4 border-primary mt-8">
            <p className="text-sm text-muted-foreground font-vazir leading-relaxed">
              سوال شما در این لیست نیست؟ از طریق صفحه تماس با ما یا شماره‌های تماس موجود در فوتر سایت، سوال خود را مطرح کنید. ما در کمترین زمان ممکن پاسخ شما را خواهیم داد.
            </p>
          </div>
        </div>
      </main>

      
      <Footer />
    </div>
  );
};

export default FAQ;
