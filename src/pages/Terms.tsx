
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Terms = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="container-custom py-12 pt-14 sm:pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 font-vazir">
              شرایط و قوانین ایرولیا شاپ
            </h1>
            <p className="text-lg text-muted-foreground font-vazir">
              لطفاً پیش از استفاده از خدمات و ثبت سفارش، موارد زیر را با دقت مطالعه فرمایید
            </p>
          </div>

          <div className="bg-card dark:bg-card rounded-lg shadow-lg border border-border p-8 space-y-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۱. ثبت سفارش
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  پس از ثبت سفارش، تایید آن از طریق پیامک یا ایمیل به اطلاع مشتری خواهد رسید. ارسال کالا طبق زمان‌بندی مشخص‌شده در صفحه محصول انجام می‌گیرد.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۲. قیمت و پرداخت
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  قیمت‌ها به‌صورت روزانه به‌روزرسانی می‌شوند و شامل مالیات بر ارزش افزوده هستند. پرداخت از طریق درگاه‌های بانکی امن و معتبر صورت می‌گیرد.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۳. ارسال و تحویل
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  ارسال سفارش‌ها از طریق پست یا تیپاکس صورت می‌گیرد. هزینه ارسال بر اساس وزن و مقصد محاسبه می‌شود. مسئولیت تا زمان تحویل به مشتری بر عهده فروشگاه است.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۴. لغو و مرجوعی
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  امکان لغو سفارش تا پیش از ارسال وجود دارد. کالاهای باز نشده و بدون آسیب، تا ۷ روز قابل بازگشت هستند (مطابق شرایط مرجوعی).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۵. حقوق مالکیت معنوی
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  تمامی محتوا، تصاویر و طراحی سایت متعلق به ایرولیا شاپ بوده و هرگونه استفاده غیرمجاز پیگرد قانونی دارد.
                </p>
              </section>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border-r-4 border-primary">
              <p className="text-sm text-muted-foreground font-vazir leading-relaxed">
                با استفاده از خدمات ایرولیا شاپ، شما پذیرش این شرایط و قوانین را تایید می‌کنید. در صورت عدم موافقت با هر یک از موارد فوق، لطفاً از استفاده از خدمات ما خودداری نمایید.
              </p>
            </div>
          </div>
        </div>
      </main>

      
      <Footer />
    </div>
  );
};

export default Terms;
