
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FrequentlyAskedQuestions = () => {
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
      answer: "بله، اکثر محصولات ما دارای گارانتی اصالت و کیفیت هستند. جزئیات گارانتی هر محصول در صفحه محصول ذکر شده است."
    },
    {
      question: "هزینه ارسال چقدر است؟",
      answer: "هزینه ارسال سفارش بر اساس موقعیت جغرافیایی، تعداد بسته‌ها و وزن کالا توسط شرکت‌های حمل‌ونقل (مانند تیپاکس یا چاپار) محاسبه می‌شود. به همین دلیل فروشگاه امکان اعلام مبلغ دقیق پیش از ارسال را ندارد."
    },
    {
      question: "روش‌های ارسال کالا",
      answer: "چاپار و تیپاکس: برای اکثر سفارش‌ها.\nباربری اتوبوس: مخصوص سفارش‌های با تعداد بالا یا اقلام شکستنی (مانند قالب‌ها)."
    }
  ];

  return (
    <section className="py-16 bg-background" id="faq">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">سوالات متداول</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            پاسخ به سوالات رایج شما درباره خرید، ارسال و محصولات ایرولیا شاپ
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
