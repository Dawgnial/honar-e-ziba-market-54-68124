
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Terms = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="container-custom py-12 pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 font-vazir">
              شرایط و قوانین استفاده از ایرولیا شاپ
            </h1>
            <p className="text-lg text-muted-foreground font-vazir">
              به وب‌سایت ایرولیا شاپ خوش آمدید.
استفاده از این وب‌سایت به معنی پذیرش کامل شرایط و قوانین زیر است. لطفاً قبل از ثبت درخواست یا دریافت فاکتور، این موارد را مطالعه کنید.
            </p>
          </div>

          <div className="bg-card dark:bg-card rounded-lg shadow-lg border border-border p-8 space-y-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۱. معرفی و نحوه‌ی خدمات
                </h2>
                <p className="text-foreground leading-relaxed font-vazir mb-3">
                  ایرولیا شاپ یک پلتفرم اطلاع‌رسانی و معرفی محصولات است.
                </p>
                <p className="text-foreground leading-relaxed font-vazir mb-3">
                  در حال حاضر خرید و پرداخت آنلاین از طریق سایت انجام نمی‌شود.
                </p>
                <p className="text-foreground leading-relaxed font-vazir">
                  پس از انتخاب محصولات و ثبت درخواست، فاکتور به‌صورت فایل PDF صادر و برای شما ارسال می‌شود (مثلاً از طریق تلگرام یا واتساپ). مراحل بعدی خرید، هماهنگی و پرداخت، مستقیماً با پشتیبانی انجام می‌شود.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۲. دقت اطلاعات و فاکتور
                </h2>
                <p className="text-foreground leading-relaxed font-vazir mb-3">
                  لطفاً در هنگام ثبت درخواست یا ارسال اطلاعات تماس، دقت لازم را داشته باشید.
                </p>
                <p className="text-foreground leading-relaxed font-vazir mb-3">
                  فاکتور صادرشده صرفاً جهت اعلام قیمت و موجودی است و به‌منزله‌ی پرداخت یا سفارش قطعی نیست.
                </p>
                <p className="text-foreground leading-relaxed font-vazir">
                  قیمت و موجودی محصولات ممکن است بدون اطلاع قبلی تغییر کند. اعتبار هر فاکتور تا زمانی است که توسط تیم فروش تأیید شود.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۳. ارتباط با پشتیبانی
                </h2>
                <p className="text-foreground leading-relaxed font-vazir mb-3">
                  تمام هماهنگی‌ها، پاسخ به سوالات، و پیگیری سفارش‌ها از طریق تلگرام پشتیبانی رسمی ایرولیا شاپ انجام می‌شود.
                </p>
                <p className="text-foreground leading-relaxed font-vazir">
                  تیم ما در ساعات کاری پاسخ‌گوی سوالات و درخواست‌های شماست.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۴. حقوق مالکیت و استفاده از محتوا
                </h2>
                <p className="text-foreground leading-relaxed font-vazir mb-3">
                  تمام تصاویر، توضیحات و اطلاعات درج‌شده در سایت متعلق به ایرولیا شاپ است.
                </p>
                <p className="text-foreground leading-relaxed font-vazir">
                  هرگونه کپی‌برداری یا استفاده‌ی تجاری بدون اجازه‌ی کتبی مجاز نیست.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۵. حریم خصوصی
                </h2>
                <p className="text-foreground leading-relaxed font-vazir mb-3">
                  اطلاعاتی که کاربران هنگام درخواست فاکتور یا ارتباط با پشتیبانی ارسال می‌کنند (مانند نام، شماره تماس یا آدرس ایمیل) صرفاً برای برقراری ارتباط و صدور فاکتور استفاده می‌شود و نزد ایرولیا شاپ محفوظ است.
                </p>
                <p className="text-foreground leading-relaxed font-vazir">
                  ما متعهد به حفظ امنیت و محرمانگی این اطلاعات هستیم.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-vazir">
                  ۶. تغییرات در شرایط
                </h2>
                <p className="text-foreground leading-relaxed font-vazir">
                  ایرولیا شاپ ممکن است هر زمان این قوانین را به‌روزرسانی کند. نسخه‌ی جدید همیشه در همین صفحه منتشر خواهد شد و استفاده‌ی ادامه‌دار از سایت به معنی پذیرش شرایط جدید است.
                </p>
              </section>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border-r-4 border-primary">
              <p className="text-sm text-muted-foreground font-vazir leading-relaxed">
                ایرولیا شاپ با هدف سهولت در مشاهده، استعلام و سفارش محصولات طراحی شده است.
استفاده از سایت به منزله‌ی آگاهی و پذیرش کامل شرایط بالا است.
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
