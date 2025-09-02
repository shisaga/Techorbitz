'use client';

import { motion } from 'framer-motion';
import { 
  Users, Heart, Globe, Zap, Trophy, Coffee,
  MapPin, Clock, DollarSign, GraduationCap,
  Rocket, Star, ArrowRight, Send, CheckCircle,
  Code, Palette, Brain, Headphones, BarChart3,
  Shield, Wifi, Car, Gamepad2, Pizza
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import InputField from '@/components/ui/InputField';
import CustomSelect from '@/components/ui/CustomSelect';

export default function JoinOurTeamPage() {
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    portfolio: '',
    message: ''
  });

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

  const openPositions = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote / Hybrid",
      experience: "5+ years",
      skills: ["React", "Node.js", "Python", "AWS", "MongoDB"],
      description: "Lead development of enterprise applications for Fortune 500 clients"
    },
    {
      title: "AI/ML Engineer",
      department: "AI Research",
      type: "Full-time", 
      location: "Remote / Hybrid",
      experience: "3+ years",
      skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
      description: "Build cutting-edge AI solutions for our clients and internal products"
    },
    {
      title: "DevOps Engineer",
      department: "Infrastructure",
      type: "Full-time",
      location: "Remote / Hybrid", 
      experience: "4+ years",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
      description: "Scale and optimize infrastructure for high-traffic applications"
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      type: "Full-time",
      location: "Remote / Hybrid",
      experience: "3+ years", 
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
      description: "Design beautiful, user-centered experiences for web and mobile"
    },
    {
      title: "Project Manager",
      department: "Operations",
      type: "Full-time",
      location: "Remote / Hybrid",
      experience: "4+ years",
      skills: ["Agile", "Scrum", "Jira", "Stakeholder Management"],
      description: "Lead cross-functional teams delivering projects for major clients"
    },
    {
      title: "Business Development Manager",
      department: "Sales",
      type: "Full-time",
      location: "Remote / Hybrid",
      experience: "5+ years",
      skills: ["B2B Sales", "Client Relations", "Negotiation", "CRM"],
      description: "Build relationships with Fortune 500 companies and drive growth"
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Competitive Salary",
      description: "Top-tier compensation packages with performance bonuses",
      color: "text-green-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Remote-First Culture",
      description: "Work from anywhere in the world with flexible hours",
      color: "text-blue-500"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Learning & Development",
      description: "$5,000 annual learning budget + conference attendance",
      color: "text-purple-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health & Wellness",
      description: "Premium health insurance + mental health support",
      color: "text-red-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Unlimited PTO",
      description: "Take time off when you need it, no questions asked",
      color: "text-orange-500"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Equity & Growth",
      description: "Stock options and clear career advancement paths",
      color: "text-coral-primary"
    }
  ];

  const perks = [
    { icon: <Coffee className="w-5 h-5" />, text: "Premium coffee & snacks" },
    { icon: <Wifi className="w-5 h-5" />, text: "High-speed internet allowance" },
    { icon: <Car className="w-5 h-5" />, text: "Transportation allowance" },
    { icon: <Gamepad2 className="w-5 h-5" />, text: "Gaming room & activities" },
    { icon: <Pizza className="w-5 h-5" />, text: "Team lunches & events" },
    { icon: <Shield className="w-5 h-5" />, text: "Life & disability insurance" }
  ];

  const companyValues = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Innovation First",
      description: "We push boundaries and embrace cutting-edge technologies to solve complex problems."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Team Collaboration", 
      description: "We believe in the power of diverse teams working together towards common goals."
    },
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "Excellence Driven",
      description: "We deliver exceptional quality that exceeds client expectations every time."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "People-Centric",
      description: "We prioritize our team's growth, well-being, and work-life balance."
    }
  ];

  const positionOptions = [
    ...openPositions.map(position => ({ 
      value: position.title, 
      label: position.title, 
      emoji: '💼' 
    })),
    { value: 'other', label: 'Other / General Application', emoji: '🌟' }
  ];

  const experienceOptions = [
    { value: '0-1', label: '0-1 years', emoji: '🌱' },
    { value: '2-3', label: '2-3 years', emoji: '🌿' },
    { value: '4-5', label: '4-5 years', emoji: '🌳' },
    { value: '6-10', label: '6-10 years', emoji: '🏆' },
    { value: '10+', label: '10+ years', emoji: '👑' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit application
    console.log('Application submitted:', applicationData);
  };

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
                <Users className="w-4 h-4" />
                We're Hiring!
              </span>
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              Join Our
              <br />
              <span className="text-coral-primary">Amazing Team</span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto"
            >
              Build the future of technology with Fortune 500 clients. Work with cutting-edge tech, 
              amazing people, and make a real impact on businesses worldwide.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-coral-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-coral-secondary transition-colors flex items-center gap-3 shadow-xl"
              >
                <Rocket className="w-6 h-6" />
                View Open Positions
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('company-culture')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-coral-primary hover:text-coral-primary transition-colors flex items-center gap-3"
              >
                <Heart className="w-5 h-5" />
                Learn About Our Culture
              </motion.button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: "50+", label: "Team Members" },
                { number: "100+", label: "Projects Delivered" },
                { number: "15+", label: "Countries" },
                { number: "4.9★", label: "Glassdoor Rating" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-coral-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section id="company-culture" className="py-20 px-4 sm:px-6 lg:px-8">
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
              Our <span className="text-coral-primary">Core Values</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              These principles guide everything we do and shape our amazing company culture
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {companyValues.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
              >
                <div className="text-coral-primary mb-6 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Amazing <span className="text-coral-primary">Benefits</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              We take care of our team with comprehensive benefits and perks
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`${benefit.color} mb-4`}>{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Perks */}
          <motion.div
            variants={fadeInUp}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Plus Many More Perks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {perks.map((perk, index) => (
                <div key={index} className="flex items-center justify-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                  <div className="text-coral-primary">{perk.icon}</div>
                  <span className="text-center">{perk.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20 px-4 sm:px-6 lg:px-8">
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
              Open <span className="text-coral-primary">Positions</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Find your perfect role and join our team of talented professionals
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="space-y-6"
          >
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">{position.title}</h3>
                      <span className="bg-coral-light text-coral-primary px-3 py-1 rounded-full text-sm font-medium">
                        {position.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {position.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {position.experience}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{position.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {position.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-coral-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-coral-secondary transition-colors flex items-center gap-2"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                    <button className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:border-coral-primary hover:text-coral-primary transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Ready to <span className="text-coral-primary">Apply?</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Send us your application and let's start building something amazing together
            </motion.p>
          </motion.div>

          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <InputField
                  type="text"
                  placeholder="Your full name"
                  value={applicationData.name}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, name: e.target.value }))}
                  icon={Users}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <InputField
                  type="email"
                  placeholder="your@email.com"
                  value={applicationData.email}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <InputField
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={applicationData.phone}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position of Interest *</label>
                <CustomSelect
                  options={positionOptions}
                  value={applicationData.position}
                  onChange={(value) => setApplicationData(prev => ({ ...prev, position: value }))}
                  placeholder="Select a position"
                  width="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <CustomSelect
                  options={experienceOptions}
                  value={applicationData.experience}
                  onChange={(value) => setApplicationData(prev => ({ ...prev, experience: value }))}
                  placeholder="Select experience"
                  width="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/LinkedIn URL</label>
                <InputField
                  type="url"
                  placeholder="https://your-portfolio.com"
                  value={applicationData.portfolio}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, portfolio: e.target.value }))}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter / Why do you want to join us?
              </label>
              <textarea
                value={applicationData.message}
                onChange={(e) => setApplicationData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us about yourself, your experience, and why you'd be a great fit for our team..."
                rows={6}
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20 outline-none resize-none"
              />
            </div>

            <div className="text-center">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-coral-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-coral-secondary transition-colors flex items-center gap-3 mx-auto"
              >
                <Send className="w-5 h-5" />
                Submit Application
              </motion.button>
              
              <p className="text-sm text-gray-500 mt-4">
                We'll review your application and get back to you within 48 hours
              </p>
            </div>
          </motion.form>
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
              Questions About Working Here?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              We'd love to chat! Schedule a call with our team to learn more about life at TechXak.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/schedule-meeting">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-coral-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  Chat with Our Team
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-coral-primary transition-colors flex items-center gap-3"
              >
                <Heart className="w-5 h-5" />
                Follow Our Journey
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
