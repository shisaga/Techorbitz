'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code2, Smartphone, Globe, Zap, Users, CheckCircle, Database, Brain, Cloud, Cpu, Briefcase, Heart, Search, Award, Building2, Rocket, Menu, X, Video, Palette, FileText, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogPost {
  title: string;
  excerpt: string;
  date?: string;
  readTime?: string;
  slug?: string;
  publishedAt?: string;
  readingTime?: number;
  showcaseImage?: string;
  coverImage?: string;
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
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

  // Fetch latest blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog?page=1&limit=3');
        const data = await response.json();
        if (data.posts) {
          setBlogPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Keep static data as fallback
        setBlogPosts([]);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <img 
                  src="/chatgpt-logo.png" 
                  alt="TechXak Logo" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-2xl font-bold text-gray-900">
                  <span className="text-coral-primary">Tech</span>Xak
                </span>
              </motion.div>
            </div>
            <nav className="hidden md:flex space-x-8">
              {['Services', 'Expertise', 'Clients', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  whileHover={{ color: '#ff6b47' }}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-coral-primary transition-colors font-medium"
                >
                  {item}
                </motion.a>
              ))}
              <Link href="/career">
                <motion.span
                  whileHover={{ color: '#ff6b47' }}
                  className="text-gray-700 hover:text-coral-primary transition-colors font-medium cursor-pointer"
                >
                  Careers
                </motion.span>
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/start-project">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:block bg-coral-primary text-white px-6 py-2 rounded-full font-medium hover:bg-coral-secondary transition-colors"
                >
                  🚀 Launch Your Vision
                </motion.button>
              </Link>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-t border-gray-100 py-4"
            >
                              <div className="flex flex-col space-y-4 px-4">
                 {['Services', 'Expertise', 'Clients', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-700 hover:text-coral-primary transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <Link href="/career">
                  <span
                    className="text-gray-700 hover:text-coral-primary transition-colors font-medium py-2 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Careers
                  </span>
                </Link>
                <Link href="/start-project" className="w-full mt-4">
                  <button className="bg-coral-primary text-white px-6 py-2 rounded-full font-medium hover:bg-coral-secondary transition-colors w-full">
                    🚀 Launch Your Vision
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center"
          >
            {/* ChatGPT Logo */}
            <motion.div
              variants={fadeInUp}
              className="mb-8 flex justify-center"
            >
              <img 
                src="/chatgpt-logo.png" 
                alt="TechXak AI Technology" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg border-4 border-coral-primary/20"
              />
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Transforming Ideas Into
              <span className="text-coral-primary"> Digital Excellence</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              We work with industry leaders like Google, Apple, and McDonald's to deliver 
              cutting-edge technology solutions including AI/ML, AWS cloud services, IoT, Oracle database, 
              and medical domain expertise that drive business growth and innovation.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {/* Temporarily hidden - Try Our Product button
              <Link href="/try-our-product">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-coral-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-coral-secondary transition-colors flex items-center justify-center gap-2"
                >
                  Try Our Product <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              */}
              <Link href="/schedule-meeting">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-coral-primary text-coral-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-coral-primary hover:text-white transition-colors"
                >
                  Schedule a Call
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Our Services
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Comprehensive technology solutions tailored to your business needs
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Code2 className="w-12 h-12" />,
                title: "Web Development",
                description: "Custom web applications built with modern technologies and best practices."
              },
              {
                icon: <Smartphone className="w-12 h-12" />,
                title: "Mobile Apps",
                description: "Native and cross-platform mobile applications for iOS and Android."
              },
              {
                icon: <Database className="w-12 h-12" />,
                title: "Database & Oracle AI",
                description: "Expert database design, optimization, and Oracle AI integration for intelligent systems."
              },
              {
                icon: <Cloud className="w-12 h-12" />,
                title: "AWS Cloud Solutions",
                description: "Scalable cloud infrastructure, serverless architecture, and AWS services implementation."
              },
              {
                icon: <Cpu className="w-12 h-12" />,
                title: "IoT Solutions",
                description: "Internet of Things development, sensor integration, and smart device connectivity."
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: "Medical Domain",
                description: "Healthcare software, medical device integration, and HIPAA-compliant solutions."
              },
              {
                icon: <Brain className="w-12 h-12" />,
                title: "AI & Machine Learning",
                description: "Artificial intelligence solutions, ML models, and intelligent automation systems."
              },
              {
                icon: <Search className="w-12 h-12" />,
                title: "Hiring Partner",
                description: "Find the best developers for your team at affordable rates with our recruitment expertise."
              },
              {
                icon: <Video className="w-12 h-12" />,
                title: "Video Editing",
                description: "Professional video editing, motion graphics, and multimedia content creation."
              },
              {
                icon: <Palette className="w-12 h-12" />,
                title: "Graphic Design",
                description: "Creative graphic design, branding, UI/UX design, and visual identity solutions."
              },
              {
                icon: <CheckCircle className="w-12 h-12" />,
                title: "Quality Assurance",
                description: "Comprehensive testing and quality assurance for bulletproof applications."
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-coral-primary mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Get Your Demo Project in 7 Days Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-coral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-coral-primary/10 text-coral-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              🚀 Limited Time Offer
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Get Your Demo Project in
              <span className="text-coral-primary"> 7 Days</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            >
              Experience the TechXak difference with a fully functional prototype. 
              We'll build your vision in just one week, so you can see results fast.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "From concept to working prototype in just 7 days. No waiting, no delays."
              },
              {
                icon: "🎯",
                title: "Fully Functional",
                description: "Real working features, not just mockups. Test with real users immediately."
              },
              {
                icon: "💎",
                title: "Premium Quality",
                description: "Enterprise-grade code and design that scales with your business."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Process Timeline */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Your 7-Day Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {[
                { day: "Day 1", title: "Discovery", desc: "Requirements gathering & planning" },
                { day: "Day 2", title: "Design", desc: "UI/UX mockups & wireframes" },
                { day: "Day 3", title: "Development", desc: "Core functionality building" },
                { day: "Day 4", title: "Features", desc: "Advanced features & integration" },
                { day: "Day 5", title: "Testing", desc: "Quality assurance & bug fixes" },
                { day: "Day 6", title: "Polish", desc: "Final touches & optimization" },
                { day: "Day 7", title: "Delivery", desc: "Your demo is ready!" }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="bg-coral-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm mx-auto mb-3">
                    {index + 1}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">{step.day}</div>
                  <div className="text-xs text-gray-600">{step.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{step.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-coral-primary to-blue-600 text-white p-8 rounded-2xl shadow-2xl mb-8"
            >
              <h3 className="text-2xl font-bold mb-4">Ready to See Your Vision Come to Life?</h3>
              <p className="text-lg mb-6 opacity-90">
                Join 500+ companies who've transformed their ideas into reality with TechXak. 
                Your demo project is just 7 days away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/start-project">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-coral-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
                  >
                    🚀 Start Your Project
                  </motion.button>
                </Link>
                <Link href="/schedule-meeting">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white px-6 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-coral-primary transition-colors"
                  >
                    📞 Book Free Consultation
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center items-center gap-8 text-gray-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">No upfront payment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">100% satisfaction guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Source code included</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Trusted by <span className="text-coral-primary">10+ Big Giants</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              🚀 Powering innovation for the world's most successful companies across industries. 
              From Fortune 500 enterprises to tech unicorns, we deliver excellence that drives results.
            </motion.p>
          </motion.div>

          {/* Animated Logo Slider */}
          <div className="relative overflow-hidden">
            <motion.div
              animate={{
                x: [0, -100 * 15] // Move by the width of all logos
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear"
                }
              }}
              className="flex gap-8 items-center"
              style={{ width: 'calc(200px * 30)' }} // Double the logos for seamless loop
            >
              {/* First set of logos */}
              {[
                { 
                  name: "Google", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ), 
                  color: "bg-white", 
                  textColor: "text-gray-700" 
                },
                { 
                  name: "Apple", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  ), 
                  color: "bg-gray-900", 
                  textColor: "text-white" 
                },
                { 
                  name: "McDonald's", 
                  logo: (
                    <div className="text-4xl font-bold text-yellow-500">M</div>
                  ), 
                  color: "bg-red-600", 
                  textColor: "text-white" 
                },
                { 
                  name: "Microsoft", 
                  logo: (
                    <div className="grid grid-cols-2 gap-1 w-8 h-8">
                      <div className="bg-red-500 rounded-sm"></div>
                      <div className="bg-green-500 rounded-sm"></div>
                      <div className="bg-blue-500 rounded-sm"></div>
                      <div className="bg-yellow-500 rounded-sm"></div>
                    </div>
                  ), 
                  color: "bg-white", 
                  textColor: "text-gray-700" 
                },
                { 
                  name: "Netflix", 
                  logo: (
                    <div className="text-3xl font-bold text-white">N</div>
                  ), 
                  color: "bg-red-600", 
                  textColor: "text-white" 
                },
                { 
                  name: "Tesla", 
                  logo: (
                    <svg viewBox="0 0 342 35" className="w-12 h-4">
                      <path fill="currentColor" d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H238.6V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7h24.9zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zM308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7z"/>
                    </svg>
                  ), 
                  color: "bg-white", 
                  textColor: "text-black" 
                },
                { 
                  name: "Amazon", 
                  logo: (
                    <svg viewBox="0 0 1200 358" className="w-16 h-6">
                      <path fill="#232F3E" d="M0 120.5h47.2c25.6 0 51.2-10.2 51.2-40.8 0-26.1-19.3-38.6-48.9-38.6H0v79.4zm20.5-61.4h24.4c17 0 31.8 4.5 31.8 21.6 0 17.6-14.8 21.6-31.8 21.6H20.5V59.1z"/>
                      <path fill="#232F3E" d="M409.1 41.1c-34.1 0-56.8 26.1-56.8 59.1 0 32.9 22.7 59.1 56.8 59.1s56.8-26.1 56.8-59.1c0-33-22.7-59.1-56.8-59.1zm0 100.2c-22.7 0-35.2-17-35.2-41.1s12.5-41.1 35.2-41.1 35.2 17 35.2 41.1-12.5 41.1-35.2 41.1z"/>
                      <path fill="#232F3E" d="M102.3 120.5h47.2c25.6 0 51.2-10.2 51.2-40.8 0-26.1-19.3-38.6-48.9-38.6h-49.5v79.4zm20.5-61.4h24.4c17 0 31.8 4.5 31.8 21.6 0 17.6-14.8 21.6-31.8 21.6h-24.4V59.1z"/>
                      <path fill="#232F3E" d="M204.5 41.1c-34.1 0-56.8 26.1-56.8 59.1 0 32.9 22.7 59.1 56.8 59.1s56.8-26.1 56.8-59.1c0-33-22.7-59.1-56.8-59.1zm0 100.2c-22.7 0-35.2-17-35.2-41.1s12.5-41.1 35.2-41.1 35.2 17 35.2 41.1-12.5 41.1-35.2 41.1z"/>
                      <path fill="#232F3E" d="M306.8 41.1c-34.1 0-56.8 26.1-56.8 59.1 0 32.9 22.7 59.1 56.8 59.1s56.8-26.1 56.8-59.1c0-33-22.7-59.1-56.8-59.1zm0 100.2c-22.7 0-35.2-17-35.2-41.1s12.5-41.1 35.2-41.1 35.2 17 35.2 41.1-12.5 41.1-35.2 41.1z"/>
                      <path fill="#FF9900" d="M950.7 220.3c-107.4 79.2-263.2 121.4-397.4 121.4-188.1 0-357.7-69.6-485.9-185.4-10.1-9.1-1-21.3 11.1-14.3 137.7 80.1 307.8 128.2 483.7 128.2 118.5 0 248.9-24.6 368.8-75.6 18-7.7 33.1 11.9 16.9 25.1l-3.6 0.1z"/>
                    </svg>
                  ), 
                  color: "bg-white", 
                  textColor: "text-black" 
                },
                { 
                  name: "Meta", 
                  logo: (
                    <div className="text-3xl font-bold text-white">f</div>
                  ), 
                  color: "bg-blue-600", 
                  textColor: "text-white" 
                },
                { 
                  name: "Spotify", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  ), 
                  color: "bg-green-500", 
                  textColor: "text-white" 
                },
                { 
                  name: "Uber", 
                  logo: (
                    <div className="text-3xl font-bold text-white">U</div>
                  ), 
                  color: "bg-black", 
                  textColor: "text-white" 
                },
                { 
                  name: "Airbnb", 
                  logo: (
                    <svg viewBox="0 0 200 200" className="w-10 h-10">
                      <path fill="currentColor" d="M156.633 104.602c-.039-3.504-.859-6.964-2.137-10.214-.986-2.516-2.131-4.966-3.249-7.425a1407.959 1407.959 0 0 0-28.003-57.54c-1.374-2.65-2.719-5.316-4.17-7.925-1.426-2.545-3.086-4.995-5.235-6.987-3.429-3.269-8.03-5.218-12.752-5.512h-2.174c-4.861.24-9.606 2.28-13.094 5.68-2.07 1.961-3.672 4.352-5.06 6.826-1.432 2.566-2.758 5.19-4.106 7.798a1418.216 1418.216 0 0 0-19.084 38.464c-3.676 7.73-7.321 15.473-10.827 23.279-1.454 3.252-2.769 6.615-3.264 10.165-.917 5.994.398 12.285 3.6 17.432 2.76 4.471 6.903 8.074 11.732 10.155a26.434 26.434 0 0 0 11.983 2.121c5.483-.291 10.77-2.261 15.409-5.136 5.175-3.176 9.601-7.4 13.722-11.822 3.832 4.13 7.933 8.071 12.667 11.16 4.572 3.008 9.785 5.186 15.268 5.704 5.955.622 12.125-.854 17.123-4.169a26.096 26.096 0 0 0 9.814-12.059 25.814 25.814 0 0 0 1.837-9.995zm-56.684-2.312c-1.495-1.76-2.812-3.664-4.135-5.554-2.226-3.265-4.25-6.678-5.878-10.284-1.334-2.992-2.405-6.133-2.823-9.395-.305-2.588-.232-5.288.718-7.745.85-2.304 2.484-4.3 4.554-5.619 4.932-3.183 11.962-2.839 16.431 1.022 2.262 1.927 3.613 4.776 3.953 7.704.445 3.892-.44 7.801-1.799 11.431-2.566 6.736-6.628 12.774-11.021 18.44zm48.393 8.255c-1.318 4.549-4.486 8.523-8.631 10.816-3.674 2.055-8.059 2.759-12.201 2.067-5.275-.821-10.008-3.62-14.109-6.924-3.014-2.422-5.728-5.19-8.328-8.043 4.105-5.192 7.972-10.624 10.926-16.562 2.578-5.2 4.537-10.834 4.723-16.681.105-3.71-.593-7.488-2.326-10.791-2.269-4.413-6.334-7.803-10.994-9.443-4.353-1.555-9.192-1.694-13.633-.428-4.188 1.185-8.013 3.702-10.634 7.191-2.307 3.042-3.622 6.782-3.927 10.575-.469 5.463.9 10.913 2.971 15.935 3.079 7.338 7.598 13.98 12.589 20.141a68.79 68.79 0 0 1-7.306 7.26c-4.052 3.429-8.688 6.414-13.94 7.55-4.246.953-8.827.479-12.721-1.491-4.561-2.273-8.063-6.554-9.384-11.475-1.01-3.615-.786-7.518.415-11.059.999-2.93 2.354-5.722 3.622-8.541a1408.352 1408.352 0 0 1 27.689-56.927c1.44-2.793 2.858-5.599 4.382-8.346 1.244-2.213 2.691-4.386 4.736-5.94a12.244 12.244 0 0 1 7.749-2.583c2.88-.034 5.743 1.027 7.946 2.878 2.176 1.807 3.646 4.279 4.966 6.743 2.984 5.605 5.85 11.275 8.717 16.939a1379.995 1379.995 0 0 1 23.582 49.054c1.139 2.564 2.358 5.108 3.125 7.814.937 3.337.968 6.941-.004 10.271zM57.249 146.038c2.464-.558 5.156 1.067 5.796 3.513.795 2.503-.785 5.413-3.301 6.137-2.458.864-5.377-.638-6.191-3.092-.772-2.068.054-4.564 1.888-5.787a5.09 5.09 0 0 1 1.808-.771zM73.891 162.195c1.484-1.613 3.575-2.624 5.729-2.946a13.452 13.452 0 0 1 4.295.272c-.018 2.271-.004 4.539-.008 6.811-2.209-.571-4.601-.689-6.769.109a8.062 8.062 0 0 0-3.1 2.037c-.186.159-.141.416-.158.637.013 6.345-.01 12.691.009 19.035-.022.244.037.519-.071.748-2.45.057-4.903.011-7.354.02.001-9.673-.008-19.348.006-29.021 2.064.009 4.129-.008 6.194.004.454-.026.938.207 1.104.65.163.53.111 1.095.123 1.644zM126.719 162.221c1.961-2.029 4.803-3.027 7.592-3.033 2.947-.074 5.967.797 8.244 2.709a8.97 8.97 0 0 1 3.115 4.687c.648 2.261.59 4.636.582 6.965.002 5.124 0 10.249.002 15.374-2.471-.004-4.941.016-7.412-.011.002-5.121 0-10.242.002-15.365 0-1.903.09-3.956-.922-5.651-.705-1.216-2.1-1.822-3.445-1.963-2.562-.41-5.238.609-7.004 2.477-.188.188-.349.426-.328.71-.024.792.096 1.587.028 2.38-.097 1.077.054 2.154.019 3.234a214.498 214.498 0 0 0-.008 6.109c-.14 2.693.104 5.395-.057 8.085-2.461-.008-4.92-.002-7.381-.003-.001-9.678-.018-19.354.009-29.031 1.903.015 3.81 0 5.712.006.492-.031 1.03.244 1.157.744.116.514.081 1.049.095 1.577zM54.539 188.924c-.001-9.677-.015-19.353.005-29.029 2.452.006 4.903.004 7.354.002.019 9.676.005 19.352.007 29.026-2.455 0-4.91-.002-7.366.001zM49.972 159.898c-1.943-.004-3.886.006-5.831-.011-.514-.003-1.17.022-1.421.562-.225.555-.139 1.171-.159 1.755-1.617-1.721-3.896-2.743-6.234-2.965-3.61-.324-7.351.677-10.25 2.869-2.388 1.764-4.153 4.315-5.077 7.125-.445 1.317-.668 2.699-.81 4.08v1.987c.207 4.159 2.057 8.273 5.284 10.954 2.434 2.062 5.562 3.214 8.731 3.415h1.652c2.512-.169 4.992-1.208 6.706-3.08.016.587-.067 1.209.153 1.771.229.455.769.58 1.238.562 2.005-.005 4.013.002 6.02-.009 0-9.669.006-19.342-.002-29.015zm-7.638 19.983c-1.5 1.796-3.843 2.858-6.183 2.784-2.508.019-5.111-.942-6.736-2.909-1.585-1.878-2.064-4.49-1.704-6.877.269-1.932 1.254-3.785 2.81-4.984 1.411-1.114 3.19-1.688 4.971-1.812 2.653-.232 5.45.938 7.046 3.08.09 3.154.002 6.316.042 9.475-.026.416.089.917-.246 1.243zM115.51 168.201c-1.142-2.793-3.168-5.221-5.736-6.805-2.645-1.646-5.817-2.39-8.918-2.179-2.449.161-4.842 1.206-6.542 2.992-.01-5.421 0-10.839-.005-16.26-2.472.001-4.946-.011-7.418.007.013 14.318-.021 28.643.018 42.96 2.047.005 4.096.01 6.144.005.509.04 1.058-.24 1.198-.755.101-.524.064-1.065.067-1.596 1.718 1.911 4.242 2.948 6.78 3.101h1.514c4.109-.206 8.138-2.132 10.717-5.361 3.612-4.429 4.317-10.867 2.181-16.109zm-8.645 12.214c-1.656 1.537-3.948 2.274-6.186 2.252-2.335.054-4.668-1.019-6.147-2.826-.183-.188-.243-.442-.228-.692.002-3.322.005-6.643 0-9.963 1.42-1.852 3.693-3.006 6.018-3.125 2.357-.069 4.83.623 6.56 2.285 1.648 1.529 2.452 3.822 2.4 6.043.048 2.218-.778 4.496-2.417 6.026zM176.503 164.609c-3.144-4.004-8.519-6.024-13.53-5.275-2.093.33-4.076 1.334-5.539 2.874-.016-5.418 0-10.836-.008-16.256-2.468-.003-4.934-.005-7.4.002-.002 14.319 0 28.642 0 42.963 1.945.015 3.895-.003 5.84.015.511.008 1.15-.033 1.412-.555.227-.564.142-1.193.158-1.786 1.705 1.868 4.174 2.9 6.672 3.082h1.666c4.064-.221 8.037-2.118 10.611-5.298 2.102-2.536 3.236-5.784 3.424-9.055v-1.941c-.233-3.158-1.299-6.294-3.306-8.77zm-5.776 14.972c-1.957 2.519-5.41 3.456-8.473 2.967-1.865-.372-3.674-1.379-4.777-2.951-.123-1.219-.012-2.452-.049-3.677.026-2.253-.056-4.513.037-6.762 1.122-1.547 2.918-2.539 4.766-2.949 3.42-.632 7.396.723 9.125 3.881 1.574 2.923 1.417 6.829-.629 9.491z"/>
                    </svg>
                  ), 
                  color: "bg-coral-primary", 
                  textColor: "text-white" 
                },
                { 
                  name: "Slack", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="#E01E5A" d="M6 15a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-5z"/>
                      <path fill="#36C5F0" d="M9 6a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5z"/>
                      <path fill="#2EB67D" d="M18 9a2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5z"/>
                      <path fill="#ECB22E" d="M15 18a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-5z"/>
                    </svg>
                  ), 
                  color: "bg-white", 
                  textColor: "text-gray-700" 
                },
                { 
                  name: "Oracle", 
                  logo: (
                    <svg viewBox="0 0 512 58" className="w-16 h-4">
                      <path fill="currentColor" d="M29 0C13 0 0 13 0 29s13 29 29 29 29-13 29-29S45 0 29 0zm0 46c-9.4 0-17-7.6-17-17s7.6-17 17-17 17 7.6 17 17-7.6 17-17 17z"/>
                      <path fill="currentColor" d="M77 4h23c11 0 20 9 20 20v5c0 6-3 11-8 14l12 15h-15l-10-13h-7v13H77V4zm15 21h8c3 0 5-2 5-5s-2-5-5-5h-8v10z"/>
                      <path fill="currentColor" d="M125 4l25 54h-15l-4-9h-17l-4 9h-15l25-54h5zm0 33l-5-11-5 11h10z"/>
                      <path fill="currentColor" d="M170 4h23c16 0 29 13 29 29s-13 29-29 29h-8v-12h8c9 0 17-7 17-17s-8-17-17-17h-8v46h-15V4z"/>
                      <path fill="currentColor" d="M238 4h23c16 0 29 13 29 29s-13 29-29 29h-23V4zm15 46h8c9 0 17-7 17-17s-8-17-17-17h-8v34z"/>
                      <path fill="currentColor" d="M308 4h54v12h-39v10h35v12h-35v10h39v12h-54V4z"/>
                    </svg>
                  ), 
                  color: "bg-red-700", 
                  textColor: "text-white" 
                },
                { 
                  name: "IBM", 
                  logo: (
                    <div className="text-2xl font-bold text-white">IBM</div>
                  ), 
                  color: "bg-blue-700", 
                  textColor: "text-white" 
                },
                { 
                  name: "Salesforce", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="currentColor" d="M12.5 2C9.5 2 7 4.5 7 7.5c0 .3 0 .6.1.9C6.4 8.1 5.7 8 5 8 2.2 8 0 10.2 0 13s2.2 5 5 5h12c2.8 0 5-2.2 5-5s-2.2-5-5-5c-.3 0-.6 0-.9.1C15.8 6.2 14.3 5 12.5 5c-.3 0-.6 0-.9.1C11.9 3.2 12.3 2 12.5 2z"/>
                    </svg>
                  ), 
                  color: "bg-blue-400", 
                  textColor: "text-white" 
                }
              ].concat([
                // Duplicate set for seamless loop - same logos
                { 
                  name: "Google", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ), 
                  color: "bg-white", 
                  textColor: "text-gray-700" 
                },
                { 
                  name: "Apple", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  ), 
                  color: "bg-gray-900", 
                  textColor: "text-white" 
                },
                { 
                  name: "McDonald's", 
                  logo: (
                    <div className="text-4xl font-bold text-yellow-500">M</div>
                  ), 
                  color: "bg-red-600", 
                  textColor: "text-white" 
                },
                { 
                  name: "Microsoft", 
                  logo: (
                    <div className="grid grid-cols-2 gap-1 w-8 h-8">
                      <div className="bg-red-500 rounded-sm"></div>
                      <div className="bg-green-500 rounded-sm"></div>
                      <div className="bg-blue-500 rounded-sm"></div>
                      <div className="bg-yellow-500 rounded-sm"></div>
                    </div>
                  ), 
                  color: "bg-white", 
                  textColor: "text-gray-700" 
                },
                { 
                  name: "Netflix", 
                  logo: (
                    <div className="text-3xl font-bold text-white">N</div>
                  ), 
                  color: "bg-red-600", 
                  textColor: "text-white" 
                },
                { 
                  name: "Tesla", 
                  logo: (
                    <svg viewBox="0 0 342 35" className="w-12 h-4">
                      <path fill="currentColor" d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H238.6V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7h24.9zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zM308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7z"/>
                    </svg>
                  ), 
                  color: "bg-white", 
                  textColor: "text-black" 
                },
                { 
                  name: "Amazon", 
                  logo: (
                    <svg viewBox="0 0 1200 358" className="w-16 h-6">
                      <path fill="#232F3E" d="M0 120.5h47.2c25.6 0 51.2-10.2 51.2-40.8 0-26.1-19.3-38.6-48.9-38.6H0v79.4zm20.5-61.4h24.4c17 0 31.8 4.5 31.8 21.6 0 17.6-14.8 21.6-31.8 21.6H20.5V59.1z"/>
                      <path fill="#232F3E" d="M409.1 41.1c-34.1 0-56.8 26.1-56.8 59.1 0 32.9 22.7 59.1 56.8 59.1s56.8-26.1 56.8-59.1c0-33-22.7-59.1-56.8-59.1zm0 100.2c-22.7 0-35.2-17-35.2-41.1s12.5-41.1 35.2-41.1 35.2 17 35.2 41.1-12.5 41.1-35.2 41.1z"/>
                      <path fill="#232F3E" d="M102.3 120.5h47.2c25.6 0 51.2-10.2 51.2-40.8 0-26.1-19.3-38.6-48.9-38.6h-49.5v79.4zm20.5-61.4h24.4c17 0 31.8 4.5 31.8 21.6 0 17.6-14.8 21.6-31.8 21.6h-24.4V59.1z"/>
                      <path fill="#232F3E" d="M204.5 41.1c-34.1 0-56.8 26.1-56.8 59.1 0 32.9 22.7 59.1 56.8 59.1s56.8-26.1 56.8-59.1c0-33-22.7-59.1-56.8-59.1zm0 100.2c-22.7 0-35.2-17-35.2-41.1s12.5-41.1 35.2-41.1 35.2 17 35.2 41.1-12.5 41.1-35.2 41.1z"/>
                      <path fill="#232F3E" d="M306.8 41.1c-34.1 0-56.8 26.1-56.8 59.1 0 32.9 22.7 59.1 56.8 59.1s56.8-26.1 56.8-59.1c0-33-22.7-59.1-56.8-59.1zm0 100.2c-22.7 0-35.2-17-35.2-41.1s12.5-41.1 35.2-41.1 35.2 17 35.2 41.1-12.5 41.1-35.2 41.1z"/>
                      <path fill="#FF9900" d="M950.7 220.3c-107.4 79.2-263.2 121.4-397.4 121.4-188.1 0-357.7-69.6-485.9-185.4-10.1-9.1-1-21.3 11.1-14.3 137.7 80.1 307.8 128.2 483.7 128.2 118.5 0 248.9-24.6 368.8-75.6 18-7.7 33.1 11.9 16.9 25.1l-3.6 0.1z"/>
                    </svg>
                  ), 
                  color: "bg-white", 
                  textColor: "text-black" 
                },
                { 
                  name: "Meta", 
                  logo: (
                    <div className="text-3xl font-bold text-white">f</div>
                  ), 
                  color: "bg-blue-600", 
                  textColor: "text-white" 
                },
                { 
                  name: "Spotify", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  ), 
                  color: "bg-green-500", 
                  textColor: "text-white" 
                },
                { 
                  name: "Uber", 
                  logo: (
                    <div className="text-3xl font-bold text-white">U</div>
                  ), 
                  color: "bg-black", 
                  textColor: "text-white" 
                },
                { 
                  name: "Airbnb", 
                  logo: (
                    <svg viewBox="0 0 200 200" className="w-10 h-10">
                      <path fill="currentColor" d="M156.633 104.602c-.039-3.504-.859-6.964-2.137-10.214-.986-2.516-2.131-4.966-3.249-7.425a1407.959 1407.959 0 0 0-28.003-57.54c-1.374-2.65-2.719-5.316-4.17-7.925-1.426-2.545-3.086-4.995-5.235-6.987-3.429-3.269-8.03-5.218-12.752-5.512h-2.174c-4.861.24-9.606 2.28-13.094 5.68-2.07 1.961-3.672 4.352-5.06 6.826-1.432 2.566-2.758 5.19-4.106 7.798a1418.216 1418.216 0 0 0-19.084 38.464c-3.676 7.73-7.321 15.473-10.827 23.279-1.454 3.252-2.769 6.615-3.264 10.165-.917 5.994.398 12.285 3.6 17.432 2.76 4.471 6.903 8.074 11.732 10.155a26.434 26.434 0 0 0 11.983 2.121c5.483-.291 10.77-2.261 15.409-5.136 5.175-3.176 9.601-7.4 13.722-11.822 3.832 4.13 7.933 8.071 12.667 11.16 4.572 3.008 9.785 5.186 15.268 5.704 5.955.622 12.125-.854 17.123-4.169a26.096 26.096 0 0 0 9.814-12.059 25.814 25.814 0 0 0 1.837-9.995zm-56.684-2.312c-1.495-1.76-2.812-3.664-4.135-5.554-2.226-3.265-4.25-6.678-5.878-10.284-1.334-2.992-2.405-6.133-2.823-9.395-.305-2.588-.232-5.288.718-7.745.85-2.304 2.484-4.3 4.554-5.619 4.932-3.183 11.962-2.839 16.431 1.022 2.262 1.927 3.613 4.776 3.953 7.704.445 3.892-.44 7.801-1.799 11.431-2.566 6.736-6.628 12.774-11.021 18.44zm48.393 8.255c-1.318 4.549-4.486 8.523-8.631 10.816-3.674 2.055-8.059 2.759-12.201 2.067-5.275-.821-10.008-3.62-14.109-6.924-3.014-2.422-5.728-5.19-8.328-8.043 4.105-5.192 7.972-10.624 10.926-16.562 2.578-5.2 4.537-10.834 4.723-16.681.105-3.71-.593-7.488-2.326-10.791-2.269-4.413-6.334-7.803-10.994-9.443-4.353-1.555-9.192-1.694-13.633-.428-4.188 1.185-8.013 3.702-10.634 7.191-2.307 3.042-3.622 6.782-3.927 10.575-.469 5.463.9 10.913 2.971 15.935 3.079 7.338 7.598 13.98 12.589 20.141a68.79 68.79 0 0 1-7.306 7.26c-4.052 3.429-8.688 6.414-13.94 7.55-4.246.953-8.827.479-12.721-1.491-4.561-2.273-8.063-6.554-9.384-11.475-1.01-3.615-.786-7.518.415-11.059.999-2.93 2.354-5.722 3.622-8.541a1408.352 1408.352 0 0 1 27.689-56.927c1.44-2.793 2.858-5.599 4.382-8.346 1.244-2.213 2.691-4.386 4.736-5.94a12.244 12.244 0 0 1 7.749-2.583c2.88-.034 5.743 1.027 7.946 2.878 2.176 1.807 3.646 4.279 4.966 6.743 2.984 5.605 5.85 11.275 8.717 16.939a1379.995 1379.995 0 0 1 23.582 49.054c1.139 2.564 2.358 5.108 3.125 7.814.937 3.337.968 6.941-.004 10.271zM57.249 146.038c2.464-.558 5.156 1.067 5.796 3.513.795 2.503-.785 5.413-3.301 6.137-2.458.864-5.377-.638-6.191-3.092-.772-2.068.054-4.564 1.888-5.787a5.09 5.09 0 0 1 1.808-.771zM73.891 162.195c1.484-1.613 3.575-2.624 5.729-2.946a13.452 13.452 0 0 1 4.295.272c-.018 2.271-.004 4.539-.008 6.811-2.209-.571-4.601-.689-6.769.109a8.062 8.062 0 0 0-3.1 2.037c-.186.159-.141.416-.158.637.013 6.345-.01 12.691.009 19.035-.022.244.037.519-.071.748-2.45.057-4.903.011-7.354.02.001-9.673-.008-19.348.006-29.021 2.064.009 4.129-.008 6.194.004.454-.026.938.207 1.104.65.163.53.111 1.095.123 1.644zM126.719 162.221c1.961-2.029 4.803-3.027 7.592-3.033 2.947-.074 5.967.797 8.244 2.709a8.97 8.97 0 0 1 3.115 4.687c.648 2.261.59 4.636.582 6.965.002 5.124 0 10.249.002 15.374-2.471-.004-4.941.016-7.412-.011.002-5.121 0-10.242.002-15.365 0-1.903.09-3.956-.922-5.651-.705-1.216-2.1-1.822-3.445-1.963-2.562-.41-5.238.609-7.004 2.477-.188.188-.349.426-.328.71-.024.792.096 1.587.028 2.38-.097 1.077.054 2.154.019 3.234a214.498 214.498 0 0 0-.008 6.109c-.14 2.693.104 5.395-.057 8.085-2.461-.008-4.92-.002-7.381-.003-.001-9.678-.018-19.354.009-29.031 1.903.015 3.81 0 5.712.006.492-.031 1.03.244 1.157.744.116.514.081 1.049.095 1.577zM54.539 188.924c-.001-9.677-.015-19.353.005-29.029 2.452.006 4.903.004 7.354.002.019 9.676.005 19.352.007 29.026-2.455 0-4.91-.002-7.366.001zM49.972 159.898c-1.943-.004-3.886.006-5.831-.011-.514-.003-1.17.022-1.421.562-.225.555-.139 1.171-.159 1.755-1.617-1.721-3.896-2.743-6.234-2.965-3.61-.324-7.351.677-10.25 2.869-2.388 1.764-4.153 4.315-5.077 7.125-.445 1.317-.668 2.699-.81 4.08v1.987c.207 4.159 2.057 8.273 5.284 10.954 2.434 2.062 5.562 3.214 8.731 3.415h1.652c2.512-.169 4.992-1.208 6.706-3.08.016.587-.067 1.209.153 1.771.229.455.769.58 1.238.562 2.005-.005 4.013.002 6.02-.009 0-9.669.006-19.342-.002-29.015zm-7.638 19.983c-1.5 1.796-3.843 2.858-6.183 2.784-2.508.019-5.111-.942-6.736-2.909-1.585-1.878-2.064-4.49-1.704-6.877.269-1.932 1.254-3.785 2.81-4.984 1.411-1.114 3.19-1.688 4.971-1.812 2.653-.232 5.45.938 7.046 3.08.09 3.154.002 6.316.042 9.475-.026.416.089.917-.246 1.243zM115.51 168.201c-1.142-2.793-3.168-5.221-5.736-6.805-2.645-1.646-5.817-2.39-8.918-2.179-2.449.161-4.842 1.206-6.542 2.992-.01-5.421 0-10.839-.005-16.26-2.472.001-4.946-.011-7.418.007.013 14.318-.021 28.643.018 42.96 2.047.005 4.096.01 6.144.005.509.04 1.058-.24 1.198-.755.101-.524.064-1.065.067-1.596 1.718 1.911 4.242 2.948 6.78 3.101h1.514c4.109-.206 8.138-2.132 10.717-5.361 3.612-4.429 4.317-10.867 2.181-16.109zm-8.645 12.214c-1.656 1.537-3.948 2.274-6.186 2.252-2.335.054-4.668-1.019-6.147-2.826-.183-.188-.243-.442-.228-.692.002-3.322.005-6.643 0-9.963 1.42-1.852 3.693-3.006 6.018-3.125 2.357-.069 4.83.623 6.56 2.285 1.648 1.529 2.452 3.822 2.4 6.043.048 2.218-.778 4.496-2.417 6.026zM176.503 164.609c-3.144-4.004-8.519-6.024-13.53-5.275-2.093.33-4.076 1.334-5.539 2.874-.016-5.418 0-10.836-.008-16.256-2.468-.003-4.934-.005-7.4.002-.002 14.319 0 28.642 0 42.963 1.945.015 3.895-.003 5.84.015.511.008 1.15-.033 1.412-.555.227-.564.142-1.193.158-1.786 1.705 1.868 4.174 2.9 6.672 3.082h1.666c4.064-.221 8.037-2.118 10.611-5.298 2.102-2.536 3.236-5.784 3.424-9.055v-1.941c-.233-3.158-1.299-6.294-3.306-8.77zm-5.776 14.972c-1.957 2.519-5.41 3.456-8.473 2.967-1.865-.372-3.674-1.379-4.777-2.951-.123-1.219-.012-2.452-.049-3.677.026-2.253-.056-4.513.037-6.762 1.122-1.547 2.918-2.539 4.766-2.949 3.42-.632 7.396.723 9.125 3.881 1.574 2.923 1.417 6.829-.629 9.491z"/>
                    </svg>
                  ), 
                  color: "bg-coral-primary", 
                  textColor: "text-white" 
                },
                { 
                  name: "Slack", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="#E01E5A" d="M6 15a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-5z"/>
                      <path fill="#36C5F0" d="M9 6a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5z"/>
                      <path fill="#2EB67D" d="M18 9a2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5z"/>
                      <path fill="#ECB22E" d="M15 18a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-5z"/>
                    </svg>
                  ), 
                  color: "bg-white", 
                  textColor: "text-gray-700" 
                },
                { 
                  name: "Oracle", 
                  logo: (
                    <svg viewBox="0 0 512 58" className="w-16 h-4">
                      <path fill="currentColor" d="M29 0C13 0 0 13 0 29s13 29 29 29 29-13 29-29S45 0 29 0zm0 46c-9.4 0-17-7.6-17-17s7.6-17 17-17 17 7.6 17 17-7.6 17-17 17z"/>
                      <path fill="currentColor" d="M77 4h23c11 0 20 9 20 20v5c0 6-3 11-8 14l12 15h-15l-10-13h-7v13H77V4zm15 21h8c3 0 5-2 5-5s-2-5-5-5h-8v10z"/>
                      <path fill="currentColor" d="M125 4l25 54h-15l-4-9h-17l-4 9h-15l25-54h5zm0 33l-5-11-5 11h10z"/>
                      <path fill="currentColor" d="M170 4h23c16 0 29 13 29 29s-13 29-29 29h-8v-12h8c9 0 17-7 17-17s-8-17-17-17h-8v46h-15V4z"/>
                      <path fill="currentColor" d="M238 4h23c16 0 29 13 29 29s-13 29-29 29h-23V4zm15 46h8c9 0 17-7 17-17s-8-17-17-17h-8v34z"/>
                      <path fill="currentColor" d="M308 4h54v12h-39v10h35v12h-35v10h39v12h-54V4z"/>
                    </svg>
                  ), 
                  color: "bg-red-700", 
                  textColor: "text-white" 
                },
                { 
                  name: "IBM", 
                  logo: (
                    <div className="text-2xl font-bold text-white">IBM</div>
                  ), 
                  color: "bg-blue-700", 
                  textColor: "text-white" 
                },
                { 
                  name: "Salesforce", 
                  logo: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path fill="currentColor" d="M12.5 2C9.5 2 7 4.5 7 7.5c0 .3 0 .6.1.9C6.4 8.1 5.7 8 5 8 2.2 8 0 10.2 0 13s2.2 5 5 5h12c2.8 0 5-2.2 5-5s-2.2-5-5-5c-.3 0-.6 0-.9.1C15.8 6.2 14.3 5 12.5 5c-.3 0-.6 0-.9.1C11.9 3.2 12.3 2 12.5 2z"/>
                    </svg>
                  ), 
                  color: "bg-blue-400", 
                  textColor: "text-white" 
                }
              ]).map((client, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 min-w-[160px] cursor-pointer"
                >
                  <div className={`w-16 h-16 ${client.color} rounded-xl flex items-center justify-center ${client.textColor || 'text-white'} font-bold text-2xl mb-3 shadow-lg`}>
                    {client.logo}
                  </div>
                  <div className="font-semibold text-gray-700 text-sm whitespace-nowrap">{client.name}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
          </div>

          {/* Stats */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {[
              { number: "500+", label: "Projects Completed" },
              { number: "50+", label: "Happy Clients" },
              { number: "10+", label: "Years Experience" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-coral-primary mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Our Core Expertise
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Deep technical expertise across cutting-edge technologies and industry domains
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Database className="w-16 h-16" />,
                title: "Database & Oracle AI",
                skills: ["Oracle Database", "AI Integration", "Data Analytics", "Performance Tuning"]
              },
              {
                icon: <Cloud className="w-16 h-16" />,
                title: "AWS Cloud",
                skills: ["EC2 & Lambda", "S3 & RDS", "CloudFormation", "DevOps"]
              },
              {
                icon: <Cpu className="w-16 h-16" />,
                title: "IoT Solutions",
                skills: ["Sensor Integration", "Edge Computing", "Real-time Data", "Device Management"]
              },
              {
                icon: <Heart className="w-16 h-16" />,
                title: "Medical Domain",
                skills: ["HIPAA Compliance", "Medical Devices", "Healthcare Apps", "Clinical Systems"]
              },
              {
                icon: <Video className="w-16 h-16" />,
                title: "Video Production",
                skills: ["Video Editing", "Motion Graphics", "3D Animation", "Post-Production"]
              },
              {
                icon: <Palette className="w-16 h-16" />,
                title: "Graphic Design",
                skills: ["Brand Identity", "UI/UX Design", "Print Design", "Digital Assets"]
              }
            ].map((expertise, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-coral-light to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-coral-primary/20"
              >
                <div className="text-coral-primary mb-6 flex justify-center">{expertise.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{expertise.title}</h3>
                <ul className="space-y-2">
                  {expertise.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-coral-primary mr-2 flex-shrink-0" />
                      {skill}
          </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hiring Partner Section */}
      <section className="py-20 bg-gradient-to-r from-coral-primary to-coral-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center text-white"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Your Hiring Partner
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl mb-12 max-w-4xl mx-auto opacity-90"
            >
              Need talented developers? We'll find the best candidates for your requirements at affordable rates. 
              Our extensive network and rigorous screening process ensure you get top-quality talent.
            </motion.p>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            >
              {[
                {
                  icon: <Search className="w-12 h-12" />,
                  title: "Talent Sourcing",
                  description: "We find the perfect developers matching your specific requirements and budget."
                },
                {
                  icon: <Award className="w-12 h-12" />,
                  title: "Quality Screening",
                  description: "Rigorous technical interviews and skill assessments to ensure top quality."
                },
                {
                  icon: <Briefcase className="w-12 h-12" />,
                  title: "Affordable Rates",
                  description: "Competitive pricing without compromising on talent quality and expertise."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
                >
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="opacity-90">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-coral-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Find Developers
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-coral-primary transition-colors"
              >
                View Our Talent Pool
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Join Our Team
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Build your career with us. Work on cutting-edge projects with industry leaders and grow your skills.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16"
          >
            <div>
              <motion.h3
                variants={fadeInUp}
                className="text-3xl font-bold text-gray-900 mb-6"
              >
                Why Work With Us?
              </motion.h3>
              <motion.div variants={stagger} className="space-y-4">
                {[
                  "Work with Fortune 500 companies",
                  "Cutting-edge technology stack",
                  "Remote-friendly culture",
                  "Competitive compensation",
                  "Learning & development opportunities",
                  "Health & wellness benefits"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-6 h-6 text-coral-primary mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h4>
              <div className="space-y-4">
                {[
                  { title: "Senior Full Stack Developer", location: "Remote", type: "Full-time" },
                  { title: "AWS Cloud Architect", location: "San Francisco", type: "Full-time" },
                  { title: "AI/ML Engineer", location: "Remote", type: "Contract" },
                  { title: "Database Administrator", location: "New York", type: "Full-time" },
                  { title: "IoT Solutions Engineer", location: "Remote", type: "Full-time" }
                ].map((job, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-coral-primary transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-900">{job.title}</h5>
                      <span className="text-coral-primary text-sm font-medium">{job.type}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{job.location}</p>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-coral-primary text-white py-3 rounded-lg font-semibold hover:bg-coral-secondary transition-colors"
              >
                View All Positions
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

             {/* Blog Preview Section - Only show if there are blog posts */}
       {blogPosts.length > 0 && (
         <section id="blog" className="py-20 bg-gray-50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <motion.div
               initial="initial"
               whileInView="animate"
               viewport={{ once: true }}
               variants={stagger}
               className="text-center mb-16"
             >
               <motion.h2
                 variants={fadeInUp}
                 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
               >
                 Latest Insights
               </motion.h2>
               <motion.p
                 variants={fadeInUp}
                 className="text-xl text-gray-600 max-w-3xl mx-auto"
               >
                 Stay updated with the latest trends in technology and digital innovation
               </motion.p>
             </motion.div>

             <motion.div
               initial="initial"
               whileInView="animate"
               viewport={{ once: true }}
               variants={stagger}
               className="grid grid-cols-1 md:grid-cols-3 gap-8"
             >
               {blogPosts.map((post, index) => (
                 <motion.article
                   key={index}
                   variants={fadeInUp}
                   whileHover={{ y: -5 }}
                   className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                 >
                   {/* Blog Image */}
                   <div className="h-48 rounded-xl mb-6 overflow-hidden">
                     {(post.showcaseImage || post.coverImage) ? (
                       <img
                         src={post.showcaseImage || post.coverImage}
                         alt={post.title}
                         className="w-full h-full object-cover"
                         loading="lazy"
                       />
                     ) : (
                       <div className="w-full h-full bg-gradient-to-br from-coral-light to-coral-primary/20 flex items-center justify-center">
                         <div className="text-coral-primary text-4xl">📝</div>
                       </div>
                     )}
                   </div>
                   <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                     <span>{post.date || (post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '')}</span>
                     <span>•</span>
                     <span>{post.readTime || `${post.readingTime} min read`}</span>
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h3>
                   <p className="text-gray-600 mb-6">{post.excerpt}</p>
                   <Link href={post.slug ? `/blog/${post.slug}` : "#"}>
                     <motion.div
                       whileHover={{ x: 5 }}
                       className="text-coral-primary font-semibold flex items-center gap-2 cursor-pointer"
                       onClick={async () => {
                         // Track view when user clicks to read the article
                         if (post.slug) {
                           try {
                             await fetch(`/api/blog/${post.slug}/view`, {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json' }
                             });
                           } catch (error) {
                             console.error('Error tracking view:', error);
                           }
                         }
                       }}
                     >
                       Read More <ArrowRight className="w-4 h-4" />
                     </motion.div>
                   </Link>
                 </motion.article>
               ))}
             </motion.div>

             {/* View More Blogs Button */}
             <motion.div
               initial="initial"
               whileInView="animate"
               viewport={{ once: true }}
               variants={fadeInUp}
               className="text-center mt-12"
             >
               <Link href="/blog">
                 <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="inline-flex items-center gap-2 bg-coral-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-coral-secondary transition-colors cursor-pointer"
                 >
                   View More Blogs <ChevronRight className="w-5 h-5" />
                 </motion.div>
               </Link>
             </motion.div>
           </div>
         </section>
       )}

      {/* CTA Section */}
      <section className="py-20 bg-coral-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              Join the ranks of successful companies that have chosen TechXak for their technology solutions.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {/* Temporarily hidden - Try Our Product button
              <Link href="/try-our-product">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-coral-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Try Our Product
                </motion.button>
              </Link>
              */}
              <Link href="/schedule-meeting">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-coral-primary transition-colors"
                >
                  Schedule a Call
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-coral-primary">Tech</span>Xak
              </div>
              <p className="text-gray-400 mb-4">
                Transforming ideas into digital excellence through innovative technology solutions.
              </p>
              <div className="flex space-x-4">
                {['📧', '📱', '💼', '🐦'].map((icon, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    href="#"
                    className="text-2xl hover:text-coral-primary transition-colors"
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                {['Web Development', 'Mobile Apps', 'Digital Strategy', 'Consulting'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-coral-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-coral-primary transition-colors">About Us</a></li>
                <li><Link href="/career"><span className="hover:text-coral-primary transition-colors cursor-pointer">Careers</span></Link></li>
                <li><a href="#blog" className="hover:text-coral-primary transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-coral-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 hello@techxak.com</li>
                <li>📱 +91-8494090499</li>
                                  <li>📍 Ahmedabad, Gujarat, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                          <p>&copy; 2024 TechXak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
