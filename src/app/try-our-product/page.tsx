'use client';

import { motion } from 'framer-motion';
import { 
  Zap, Sparkles, Rocket, Globe, Palette, Code, 
  ArrowRight, Play, CheckCircle, Star, Users,
  Clock, Smartphone, Monitor, Tablet
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function TryOurProductPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Creation",
      description: "Our advanced AI creates stunning websites in minutes, not weeks"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Smart Design System",
      description: "Professional themes that automatically adapt to your brand"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "No Code Required",
      description: "Build complex websites without writing a single line of code"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Responsive",
      description: "Every website looks perfect on all devices automatically"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "SEO Optimized",
      description: "Built-in SEO features to help your website rank higher"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for speed with 99.9% uptime guarantee"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      company: "Bloom Bakery",
      rating: 5,
      text: "I created my bakery website in just 10 minutes! The AI understood exactly what I needed and the result was beyond my expectations.",
      avatar: "👩‍💼"
    },
    {
      name: "Mike Chen",
      role: "Freelancer",
      company: "Chen Design Studio",
      rating: 5,
      text: "As a designer, I'm impressed by the quality. The AI creates websites that would take me days to build manually.",
      avatar: "👨‍🎨"
    },
    {
      name: "Lisa Rodriguez",
      role: "Restaurant Owner",
      company: "Spice Garden",
      rating: 5,
      text: "My restaurant website looks amazing and orders have increased by 40% since launch. The best investment I've made!",
      avatar: "👩‍🍳"
    }
  ];

  const websiteTypes = [
    { type: "Business", count: "2,500+", color: "bg-blue-500" },
    { type: "E-commerce", count: "1,800+", color: "bg-green-500" },
    { type: "Portfolio", count: "3,200+", color: "bg-purple-500" },
    { type: "Blog", count: "1,400+", color: "bg-orange-500" },
    { type: "Restaurant", count: "900+", color: "bg-red-500" },
    { type: "Agency", count: "700+", color: "bg-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backUrl="/" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-coral-light via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-coral-primary/10 text-coral-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Website Builder
              </span>
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              Create Your Dream
              <br />
              <span className="text-coral-primary">Website in Minutes</span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto"
            >
              Our revolutionary AI transforms your ideas into stunning, professional websites. 
              No coding, no design skills needed - just your vision brought to life!
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            >
              <Link href="/website-builder">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-coral-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-coral-secondary transition-colors flex items-center gap-3 shadow-xl"
                >
                  <Rocket className="w-6 h-6" />
                  Try Our Product FREE
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoPlaying(true)}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-coral-primary hover:text-coral-primary transition-colors flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                Watch Demo (2 min)
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: "50K+", label: "Websites Created" },
                { number: "10 min", label: "Average Build Time" },
                { number: "99.9%", label: "Uptime Guarantee" },
                { number: "4.9★", label: "User Rating" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-coral-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600">AI Website Builder - Live Preview</div>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                  <div className="text-6xl mb-6">🚀</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Website is Being Created...</h2>
                  <div className="flex justify-center gap-2 mb-6">
                    <div className="w-3 h-3 bg-coral-primary rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-coral-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-coral-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-gray-600">AI is analyzing your requirements and generating your perfect website...</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Why Choose Our <span className="text-coral-primary">AI Builder?</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Experience the future of web development with our cutting-edge AI technology
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-coral-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Website Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Perfect for <span className="text-coral-primary">Every Business</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Our AI creates websites tailored to your industry and specific needs
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {websiteTypes.map((type, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`w-12 h-12 ${type.color} rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl`}>
                  {type.type[0]}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{type.type}</h3>
                <p className="text-sm text-gray-600">{type.count} created</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              What Our <span className="text-coral-primary">Users Say</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Join thousands of satisfied customers who transformed their business with our AI
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-coral-primary">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-coral-primary to-coral-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Create Your Website?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              Join over 50,000 businesses who chose our AI to build their online presence. 
              Start your free trial today - no credit card required!
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/website-builder">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-coral-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center gap-3 shadow-xl"
                >
                  <Rocket className="w-6 h-6" />
                  Start Building Now - FREE
                </motion.button>
              </Link>
              
              <Link href="/schedule-meeting">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-coral-primary transition-colors flex items-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  Talk to Our Experts
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex items-center justify-center gap-8 text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                No Credit Card Required
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Setup in 5 Minutes
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Cancel Anytime
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
