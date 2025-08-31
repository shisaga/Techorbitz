'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';

export default function CareerRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 2 seconds to show the message
    const timer = setTimeout(() => {
      router.push('/join-our-team');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-light to-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md bg-white p-12 rounded-3xl shadow-xl border border-gray-100"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-6xl mb-6"
        >
          🚀
        </motion.div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecting to Careers...
        </h1>
        
        <p className="text-gray-600 mb-6">
          Taking you to our amazing career opportunities page!
        </p>
        
        <div className="flex items-center justify-center gap-2 text-coral-primary">
          <Users className="w-5 h-5" />
          <span className="font-medium">Join Our Team</span>
          <ArrowRight className="w-5 h-5" />
        </div>
        
        <div className="mt-6">
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-coral-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-coral-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-coral-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
