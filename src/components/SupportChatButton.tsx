import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import SupportChatWindow from './SupportChatWindow';
import { motion, AnimatePresence } from 'framer-motion';

const SupportChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 bottom-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <MessageCircle className="h-7 w-7" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 bottom-6 z-50"
          >
            <div className="bg-background border border-border rounded-lg shadow-2xl w-[380px] h-[600px] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold text-base">پشتیبانی</h3>
                    <p className="text-xs opacity-90">آنلاین - پاسخگویی سریع</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-primary-foreground/20 text-primary-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Chat Window */}
              <SupportChatWindow onClose={() => setIsOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChatButton;
