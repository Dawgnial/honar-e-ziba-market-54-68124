
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Privacy = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="container-custom py-12 pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 font-vazir">
              حریم خصوصی کاربران
            </h1>
            <p className="text-lg text-muted-foreground font-vazir">
              ایرولیا شاپ به اطلاعات شخصی مشتریان خود احترام می‌گذارد و متعهد به حفاظت از آن است
            </p>
          </div>

          <div className="bg-card dark:bg-card rounded-lg shadow-lg border border-border p-8 space-y-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۱. اطلاعات جمع‌آوری‌شده
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  اطلاعاتی مانند نام، شماره تماس، آدرس، و ایمیل تنها برای پردازش سفارش و ارتباط با مشتری دریافت می‌شود.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۲. استفاده از اطلاعات
                </h2>
                <p className="text-foreground leading-relaxed font-vazir mb-4">
                  ما از این اطلاعات صرفاً برای اهداف زیر استفاده می‌کنیم:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground font-vazir mr-4">
                  <li>ارسال سفارش‌ها</li>
                  <li>اطلاع‌رسانی درباره وضعیت خرید</li>
                  <li>پشتیبانی و پاسخ به سوالات کاربران</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۳. حفظ امنیت اطلاعات
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  تمام اطلاعات شما در بستر امن و رمزنگاری‌شده نگهداری می‌شود و هرگز به اشخاص ثالث فروخته یا واگذار نمی‌گردد.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۴. کوکی‌ها
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  برای بهبود تجربه کاربری، سایت ممکن است از کوکی‌ها استفاده کند. کاربران می‌توانند تنظیمات مرورگر خود را برای مدیریت کوکی‌ها تغییر دهند.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۵. رضایت شما
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  استفاده از سایت به منزله پذیرش این سیاست حفظ حریم خصوصی است.
                </p>
              </section>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border-r-4 border-primary">
              <p className="text-sm text-muted-foreground font-vazir leading-relaxed">
                در صورت وجود سوال یا نگرانی در مورد حریم خصوصی خود، می‌توانید از طریق اطلاعات تماس موجود در سایت با ما در ارتباط باشید. ما متعهد هستیم که به تمامی سوالات شما پاسخ دهیم.
              </p>
            </div>
          </div>
        </div>
      </main>

      
      <Footer />
    </div>
  );
};

export default Privacy;
