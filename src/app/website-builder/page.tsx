'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, CheckCircle, Sparkles, 
  Globe, Store, Camera, Utensils, Briefcase, 
  Heart, GraduationCap, Music, Gamepad2, 
  Palette, Code, Zap
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import StepNavigation from '@/components/ui/StepNavigation';

interface WebsiteData {
  businessType: string;
  websiteType: string;
  industry: string;
  targetAudience: string;
  features: string[];
  colorScheme: string;
  style: string;
  content: string;
  businessName: string;
  description: string;
}

export default function WebsiteBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    businessType: '',
    websiteType: '',
    industry: '',
    targetAudience: '',
    features: [],
    colorScheme: '',
    style: '',
    content: '',
    businessName: '',
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const totalSteps = 7;

  const steps = [
    { id: 'business-type', title: 'Business Type', description: 'What do you do?', icon: <Briefcase className="w-6 h-6" /> },
    { id: 'website-type', title: 'Website Type', description: 'Purpose of site', icon: <Globe className="w-6 h-6" /> },
    { id: 'industry', title: 'Industry', description: 'Your field', icon: <Zap className="w-6 h-6" /> },
    { id: 'audience', title: 'Target Audience', description: 'Who visits?', icon: <Heart className="w-6 h-6" /> },
    { id: 'features', title: 'Features', description: 'What you need', icon: <Code className="w-6 h-6" /> },
    { id: 'design', title: 'Design Style', description: 'Look & feel', icon: <Palette className="w-6 h-6" /> },
    { id: 'details', title: 'Final Details', description: 'Name & content', icon: <CheckCircle className="w-6 h-6" /> }
  ];

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

  const businessTypes = [
    { value: 'individual', label: 'Individual/Personal', icon: '👤', description: 'Personal brand, portfolio, or blog' },
    { value: 'small-business', label: 'Small Business', icon: '🏪', description: 'Local business, startup, or service' },
    { value: 'enterprise', label: 'Enterprise', icon: '🏢', description: 'Large company or corporation' },
    { value: 'nonprofit', label: 'Non-Profit', icon: '❤️', description: 'Charity, NGO, or community organization' }
  ];

  const websiteTypes = [
    { value: 'business', label: 'Business Website', icon: <Briefcase className="w-8 h-8" />, description: 'Showcase services and attract customers' },
    { value: 'ecommerce', label: 'Online Store', icon: <Store className="w-8 h-8" />, description: 'Sell products online with payment processing' },
    { value: 'portfolio', label: 'Portfolio', icon: <Camera className="w-8 h-8" />, description: 'Display your work and creative projects' },
    { value: 'restaurant', label: 'Restaurant', icon: <Utensils className="w-8 h-8" />, description: 'Menu, reservations, and online ordering' },
    { value: 'blog', label: 'Blog/News', icon: <GraduationCap className="w-8 h-8" />, description: 'Share articles, news, and updates' },
    { value: 'entertainment', label: 'Entertainment', icon: <Music className="w-8 h-8" />, description: 'Music, events, or entertainment business' }
  ];

  const industries = [
    { value: 'technology', label: 'Technology', emoji: '💻' },
    { value: 'healthcare', label: 'Healthcare', emoji: '🏥' },
    { value: 'finance', label: 'Finance', emoji: '💰' },
    { value: 'retail', label: 'Retail', emoji: '🛍️' },
    { value: 'food', label: 'Food & Beverage', emoji: '🍽️' },
    { value: 'education', label: 'Education', emoji: '🎓' },
    { value: 'real-estate', label: 'Real Estate', emoji: '🏠' },
    { value: 'fitness', label: 'Fitness & Health', emoji: '💪' },
    { value: 'creative', label: 'Creative & Arts', emoji: '🎨' },
    { value: 'consulting', label: 'Consulting', emoji: '💼' },
    { value: 'automotive', label: 'Automotive', emoji: '🚗' },
    { value: 'other', label: 'Other', emoji: '🌟' }
  ];

  const targetAudiences = [
    { value: 'consumers', label: 'General Consumers', icon: '👥', description: 'Everyday people looking for products/services' },
    { value: 'businesses', label: 'Other Businesses', icon: '🏢', description: 'B2B clients and corporate customers' },
    { value: 'professionals', label: 'Professionals', icon: '💼', description: 'Industry professionals and experts' },
    { value: 'students', label: 'Students/Young Adults', icon: '🎓', description: 'College students and young professionals' }
  ];

  const availableFeatures = [
    { value: 'contact-form', label: 'Contact Form', icon: '📧' },
    { value: 'online-booking', label: 'Online Booking', icon: '📅' },
    { value: 'payment-processing', label: 'Payment Processing', icon: '💳' },
    { value: 'blog', label: 'Blog Section', icon: '📝' },
    { value: 'gallery', label: 'Photo Gallery', icon: '🖼️' },
    { value: 'testimonials', label: 'Customer Reviews', icon: '⭐' },
    { value: 'social-media', label: 'Social Media Links', icon: '📱' },
    { value: 'newsletter', label: 'Email Newsletter', icon: '📬' },
    { value: 'live-chat', label: 'Live Chat Support', icon: '💬' },
    { value: 'analytics', label: 'Analytics Dashboard', icon: '📊' },
    { value: 'multilingual', label: 'Multiple Languages', icon: '🌍' },
    { value: 'membership', label: 'User Accounts', icon: '👤' }
  ];

  const colorSchemes = [
    { value: 'professional', label: 'Professional Blue', colors: ['#2563eb', '#1e40af', '#1e3a8a'], description: 'Trust and reliability' },
    { value: 'vibrant', label: 'Vibrant Orange', colors: ['#ea580c', '#dc2626', '#b91c1c'], description: 'Energy and enthusiasm' },
    { value: 'nature', label: 'Natural Green', colors: ['#16a34a', '#15803d', '#166534'], description: 'Growth and harmony' },
    { value: 'elegant', label: 'Elegant Purple', colors: ['#9333ea', '#7c3aed', '#6d28d9'], description: 'Luxury and creativity' },
    { value: 'modern', label: 'Modern Gray', colors: ['#374151', '#4b5563', '#6b7280'], description: 'Minimal and clean' },
    { value: 'warm', label: 'Warm Coral', colors: ['#f97316', '#ea580c', '#dc2626'], description: 'Friendly and approachable' }
  ];

  const designStyles = [
    { value: 'modern', label: 'Modern Minimalist', icon: '✨', description: 'Clean lines, lots of white space' },
    { value: 'creative', label: 'Creative & Artistic', icon: '🎨', description: 'Bold colors, unique layouts' },
    { value: 'professional', label: 'Professional Corporate', icon: '💼', description: 'Traditional, trustworthy design' },
    { value: 'playful', label: 'Fun & Playful', icon: '🎉', description: 'Vibrant, engaging, interactive' }
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleFeature = (feature: string) => {
    setWebsiteData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // TODO: Send data to AI generation API
    setTimeout(() => {
      // Generate a unique slug for the website
      const slug = `${websiteData.businessName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      window.location.href = `/preview/${slug}`;
    }, 3000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6 text-center">
              What type of business are you?
            </motion.h2>
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessTypes.map((type) => (
                <motion.button
                  key={type.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWebsiteData(prev => ({ ...prev, businessType: type.value }))}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    websiteData.businessType === type.value
                      ? 'border-coral-primary bg-coral-light'
                      : 'border-gray-200 bg-white hover:border-coral-primary/50'
                  }`}
                >
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.label}</h3>
                  <p className="text-gray-600">{type.description}</p>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6 text-center">
              What type of website do you need?
            </motion.h2>
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websiteTypes.map((type) => (
                <motion.button
                  key={type.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWebsiteData(prev => ({ ...prev, websiteType: type.value }))}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                    websiteData.websiteType === type.value
                      ? 'border-coral-primary bg-coral-light'
                      : 'border-gray-200 bg-white hover:border-coral-primary/50'
                  }`}
                >
                  <div className="text-coral-primary mb-4 flex justify-center">{type.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.label}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6 text-center">
              What industry are you in?
            </motion.h2>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {industries.map((industry) => (
                <motion.button
                  key={industry.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setWebsiteData(prev => ({ ...prev, industry: industry.value }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    websiteData.industry === industry.value
                      ? 'border-coral-primary bg-coral-light'
                      : 'border-gray-200 bg-white hover:border-coral-primary/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{industry.emoji}</div>
                  <div className="text-sm font-medium text-gray-900">{industry.label}</div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Who is your target audience?
            </motion.h2>
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {targetAudiences.map((audience) => (
                <motion.button
                  key={audience.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWebsiteData(prev => ({ ...prev, targetAudience: audience.value }))}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    websiteData.targetAudience === audience.value
                      ? 'border-coral-primary bg-coral-light'
                      : 'border-gray-200 bg-white hover:border-coral-primary/50'
                  }`}
                >
                  <div className="text-4xl mb-4">{audience.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{audience.label}</h3>
                  <p className="text-gray-600">{audience.description}</p>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6 text-center">
              What features do you need?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 text-center mb-8">
              Select all features you'd like to include (you can always add more later)
            </motion.p>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableFeatures.map((feature) => (
                <motion.button
                  key={feature.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleFeature(feature.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center relative ${
                    websiteData.features.includes(feature.value)
                      ? 'border-coral-primary bg-coral-light'
                      : 'border-gray-200 bg-white hover:border-coral-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{feature.label}</div>
                  {websiteData.features.includes(feature.value) && (
                    <CheckCircle className="w-5 h-5 text-coral-primary absolute top-2 right-2" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Choose your design style
            </motion.h2>
            
            {/* Color Scheme */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Color Scheme</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {colorSchemes.map((scheme) => (
                  <motion.button
                    key={scheme.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setWebsiteData(prev => ({ ...prev, colorScheme: scheme.value }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      websiteData.colorScheme === scheme.value
                        ? 'border-coral-primary bg-coral-light'
                        : 'border-gray-200 bg-white hover:border-coral-primary/50'
                    }`}
                  >
                    <div className="flex gap-2 mb-3 justify-center">
                      {scheme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="font-medium text-gray-900 mb-1">{scheme.label}</div>
                    <div className="text-xs text-gray-600">{scheme.description}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Design Style */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Design Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designStyles.map((style) => (
                  <motion.button
                    key={style.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setWebsiteData(prev => ({ ...prev, style: style.value }))}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      websiteData.style === style.value
                        ? 'border-coral-primary bg-coral-light'
                        : 'border-gray-200 bg-white hover:border-coral-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-3">{style.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{style.label}</h4>
                    <p className="text-sm text-gray-600">{style.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Final details for your website
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business/Website Name *
                </label>
                <input
                  type="text"
                  value={websiteData.businessName}
                  onChange={(e) => setWebsiteData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter your business or website name"
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20 outline-none text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brief Description *
                </label>
                <textarea
                  value={websiteData.description}
                  onChange={(e) => setWebsiteData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what you do, your services, or what your website is about..."
                  rows={4}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Content/Requirements (Optional)
                </label>
                <textarea
                  value={websiteData.content}
                  onChange={(e) => setWebsiteData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Any specific content, pages, or features you'd like to include..."
                  rows={3}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20 outline-none resize-none"
                />
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-light to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto p-8"
        >
          <div className="text-8xl mb-8">🚀</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Creating Your Amazing Website!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Our AI is analyzing your requirements and building your perfect website...
          </p>
          
          <div className="flex justify-center gap-3 mb-8">
            <div className="w-4 h-4 bg-coral-primary rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-coral-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-coral-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <div className="bg-white/50 p-6 rounded-2xl">
            <div className="text-left space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Analyzing your requirements...</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Generating layout and design...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-coral-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Creating content and pages...</span>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                <span>Optimizing for mobile and SEO...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backUrl="/try-our-product" />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-coral-light to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-coral-primary/10 text-coral-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI Website Builder
              </span>
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Let's Build Your <span className="text-coral-primary">Perfect Website</span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Answer a few quick questions and our AI will create a stunning, professional website tailored just for you.
            </motion.p>
            
            {/* Step Navigation */}
            <motion.div variants={fadeInUp} className="mb-8">
              <StepNavigation
                steps={steps}
                currentStep={currentStep}
                variant="compact"
                showLabels={false}
                allowClickNavigation={false}
                className="mb-4"
              />
              <p className="text-sm text-gray-500 text-center">
                Step {currentStep} of {totalSteps}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Question Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100"
          >
            {renderStep()}

            {/* Navigation Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </motion.button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {currentStep === totalSteps ? 'Ready to generate your website!' : `${totalSteps - currentStep} questions remaining`}
                </p>
              </div>

              {currentStep === totalSteps ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={!websiteData.businessName || !websiteData.description}
                  className="flex items-center gap-2 bg-coral-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-coral-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate My Website
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-coral-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-coral-secondary transition-colors"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
