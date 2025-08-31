'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, CheckCircle, Clock, DollarSign, 
  Users, Zap, Building2, Smartphone, Globe, Database,
  Brain, Cloud, Heart, Video, Palette
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import CustomSelect from '@/components/ui/CustomSelect';
import InputField from '@/components/ui/InputField';
import StepNavigation from '@/components/ui/StepNavigation';

interface ProjectData {
  projectType: string;
  industry: string;
  budget: string;
  timeline: string;
  teamSize: string;
  technologies: string[];
  description: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}

export default function StartProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    projectType: '',
    industry: '',
    budget: '',
    timeline: '',
    teamSize: '',
    technologies: [],
    description: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  const steps = [
    { id: 'project-type', title: 'Project Type', description: 'What are you building?', icon: <Zap className="w-6 h-6" /> },
    { id: 'industry-budget', title: 'Industry & Budget', description: 'Context and investment', icon: <DollarSign className="w-6 h-6" /> },
    { id: 'timeline-team', title: 'Timeline & Team', description: 'When and how many', icon: <Clock className="w-6 h-6" /> },
    { id: 'technologies', title: 'Technologies', description: 'Tech preferences', icon: <Brain className="w-6 h-6" /> },
    { id: 'contact-info', title: 'Contact Info', description: 'Get in touch', icon: <Users className="w-6 h-6" /> }
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

  const projectTypes = [
    { value: 'web-app', label: 'Web Application', emoji: '💻' },
    { value: 'mobile-app', label: 'Mobile App', emoji: '📱' },
    { value: 'ai-ml', label: 'AI/ML Solution', emoji: '🤖' },
    { value: 'cloud-infrastructure', label: 'Cloud Infrastructure', emoji: '☁️' },
    { value: 'iot-solution', label: 'IoT Solution', emoji: '📡' },
    { value: 'database-optimization', label: 'Database Optimization', emoji: '🗄️' },
    { value: 'medical-software', label: 'Medical Software', emoji: '🏥' },
    { value: 'video-production', label: 'Video Production', emoji: '🎬' },
    { value: 'graphic-design', label: 'Graphic Design', emoji: '🎨' }
  ];

  const industries = [
    { value: 'technology', label: 'Technology', emoji: '💻' },
    { value: 'healthcare', label: 'Healthcare', emoji: '🏥' },
    { value: 'finance', label: 'Finance', emoji: '💰' },
    { value: 'retail', label: 'Retail & E-commerce', emoji: '🛍️' },
    { value: 'manufacturing', label: 'Manufacturing', emoji: '🏭' },
    { value: 'education', label: 'Education', emoji: '🎓' },
    { value: 'government', label: 'Government', emoji: '🏛️' },
    { value: 'startup', label: 'Startup', emoji: '🚀' }
  ];

  const budgetRanges = [
    { value: '10k-25k', label: '$10K - $25K', emoji: '💵' },
    { value: '25k-50k', label: '$25K - $50K', emoji: '💰' },
    { value: '50k-100k', label: '$50K - $100K', emoji: '💎' },
    { value: '100k-250k', label: '$100K - $250K', emoji: '🏆' },
    { value: '250k+', label: '$250K+', emoji: '👑' }
  ];

  const timelines = [
    { value: '1-3months', label: '1-3 Months', emoji: '⚡' },
    { value: '3-6months', label: '3-6 Months', emoji: '📅' },
    { value: '6-12months', label: '6-12 Months', emoji: '📆' },
    { value: '12months+', label: '12+ Months', emoji: '🗓️' }
  ];

  const teamSizes = [
    { value: '1-3', label: '1-3 Developers', emoji: '👤' },
    { value: '4-8', label: '4-8 Developers', emoji: '👥' },
    { value: '9-15', label: '9-15 Developers', emoji: '👨‍👩‍👧‍👦' },
    { value: '15+', label: '15+ Developers', emoji: '🏢' }
  ];

  const availableTechnologies = [
    'React/Next.js', 'Node.js', 'Python', 'AWS', 'MongoDB', 'PostgreSQL',
    'AI/ML', 'IoT', 'Blockchain', 'Mobile Development', 'DevOps', 'Microservices'
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // TODO: Send data to API for estimation
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to estimation page
      window.location.href = '/project-estimation';
    }, 2000);
  };

  const toggleTechnology = (tech: string) => {
    setProjectData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6">
              What type of project do you need?
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <CustomSelect
                options={projectTypes}
                value={projectData.projectType}
                onChange={(value) => setProjectData(prev => ({ ...prev, projectType: value }))}
                placeholder="Select project type"
                width="w-full"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell us about your project vision, goals, and requirements..."
                rows={4}
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20 outline-none resize-none text-lg"
              />
            </motion.div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6">
              What's your industry and budget range?
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <CustomSelect
                  options={industries}
                  value={projectData.industry}
                  onChange={(value) => setProjectData(prev => ({ ...prev, industry: value }))}
                  placeholder="Select your industry"
                  width="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <CustomSelect
                  options={budgetRanges}
                  value={projectData.budget}
                  onChange={(value) => setProjectData(prev => ({ ...prev, budget: value }))}
                  placeholder="Select budget range"
                  width="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6">
              Timeline and team requirements?
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Timeline</label>
                <CustomSelect
                  options={timelines}
                  value={projectData.timeline}
                  onChange={(value) => setProjectData(prev => ({ ...prev, timeline: value }))}
                  placeholder="Select timeline"
                  width="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size Needed</label>
                <CustomSelect
                  options={teamSizes}
                  value={projectData.teamSize}
                  onChange={(value) => setProjectData(prev => ({ ...prev, teamSize: value }))}
                  placeholder="Select team size"
                  width="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6">
              Which technologies interest you?
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <p className="text-gray-600 mb-6">Select all technologies that apply to your project:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableTechnologies.map((tech, index) => (
                  <motion.button
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTechnology(tech)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      projectData.technologies.includes(tech)
                        ? 'border-coral-primary bg-coral-light text-coral-primary'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-coral-primary/50'
                    }`}
                  >
                    <div className="font-medium">{tech}</div>
                    {projectData.technologies.includes(tech) && (
                      <CheckCircle className="w-5 h-5 mt-2 mx-auto" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div variants={stagger} className="space-y-8">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6">
              Contact information
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name (Optional)</label>
                  <InputField
                    type="text"
                    placeholder="Your company name (optional)"
                    value={projectData.companyName}
                    onChange={(e) => setProjectData(prev => ({ ...prev, companyName: e.target.value }))}
                    icon={Building2}
                    variant="default"
                    size="md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                  <InputField
                    type="text"
                    placeholder="Your full name"
                    value={projectData.contactName}
                    onChange={(e) => setProjectData(prev => ({ ...prev, contactName: e.target.value }))}
                    icon={Users}
                    variant="default"
                    size="md"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <InputField
                    type="email"
                    placeholder="your@company.com"
                    value={projectData.email}
                    onChange={(e) => setProjectData(prev => ({ ...prev, email: e.target.value }))}
                    variant="default"
                    size="md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <InputField
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={projectData.phone}
                    onChange={(e) => setProjectData(prev => ({ ...prev, phone: e.target.value }))}
                    variant="default"
                    size="md"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backUrl="/" />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-coral-light to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              🚀 Start Your <span className="text-coral-primary">Dream Project</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Let's build something amazing together! Our Fortune 500 experts will guide you through 
              every step to bring your vision to life.
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

      {/* Onboarding Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="bg-white p-8 md:p-12 rounded-3xl  border border-gray-200"
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
                  {currentStep === totalSteps ? 'Ready to get your estimate!' : `${totalSteps - currentStep} steps remaining`}
                </p>
              </div>

              {currentStep === totalSteps ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting || !projectData.email || !projectData.contactName}
                  className="flex items-center gap-2 bg-coral-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-coral-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating Estimate...
                    </>
                  ) : (
                    <>
                      Get My Estimate
                      <Zap className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-coral-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-coral-secondary transition-colors"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          {/* Side Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Quick Process",
                description: "Only 5 minutes to complete",
                color: "text-blue-500"
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Free Estimate",
                description: "No cost, no commitment",
                color: "text-green-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Team",
                description: "Fortune 500 experienced",
                color: "text-coral-primary"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gray-50 p-6 rounded-2xl text-center"
              >
                <div className={`${feature.color} mb-4 flex justify-center`}>{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
