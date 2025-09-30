
import { CheckCircle, Shield, Clock, CreditCard, Truck, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [{
  icon: <Truck size={24} strokeWidth={1.5} />,
  title: 'ارسال سریع',
  description: 'ارسال به سراسر کشور'
}, {
  icon: <Shield size={24} strokeWidth={1.5} />,
  title: 'تضمین اصالت',
  description: 'کیفیت تضمین شده'
}, {
  icon: <CheckCircle size={24} strokeWidth={1.5} />,
  title: 'کیفیت برتر',
  description: 'ساخت استادان برجسته'
}, {
  icon: <CreditCard size={24} strokeWidth={1.5} />,
  title: 'پرداخت امن',
  description: 'درگاه‌های معتبر بانکی'
}, {
  icon: <HeartHandshake size={24} strokeWidth={1.5} />,
  title: 'پشتیبانی ۲۴/۷',
  description: 'پاسخگویی همیشگی'
}];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const TrustIndicators = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-persian-light/20 to-offwhite dark:from-gray-800 dark:to-gray-900">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-persian-dark dark:text-white mb-3 font-iranyekan">
            چرا ایرولیا شاپ را انتخاب کنید؟
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-xl mx-auto font-vazir">
            ما متعهد به ارائه بهترین تجربه خرید صنایع دستی هستیم
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-6 text-center border border-persian-dark/5 dark:border-white/5 hover:border-persian-dark/20 dark:hover:border-white/20 transition-all duration-300 group"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className="text-persian-dark dark:text-persian-light mb-4 mx-auto bg-persian-light/20 dark:bg-persian-dark/20 w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-persian-dark dark:text-white mb-2 group-hover:text-persian-medium transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-vazir text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustIndicators;
