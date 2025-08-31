'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import InputField from '@/components/ui/InputField';

interface NewsletterProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function Newsletter({ 
  title = "🚀 Join the Tech Elite",
  description = "Get exclusive insights that Fortune 500 CTOs pay thousands for. Weekly intelligence briefings on AI, cloud innovations, and breakthrough technologies that transform businesses and drive exponential growth.",
  className = ""
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // TODO: Implement newsletter subscription API
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isSubscribed) {
    return (
      <section className={`py-20 bg-coral-primary ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to the Elite!</h2>
            <p className="text-xl opacity-90">
              You're now part of our exclusive tech intelligence network. 
              Expect your first insights soon!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 bg-coral-primary ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-white/90 mb-8"
          >
            {description}
          </motion.p>
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-4 rounded-full border-0  ring-2 ring-white/50 outline-none text-lg"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-coral-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-coral-primary"></div>
                  Subscribing...
                </div>
              ) : (
                'Subscribe'
              )}
            </motion.button>
          </motion.form>
          <motion.p 
            variants={fadeInUp}
            className="text-white/70 text-sm mt-4"
          >
            📊 10,000+ subscribers • 🔒 No spam • ✉️ Weekly insights • 🎯 Enterprise-focused
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
