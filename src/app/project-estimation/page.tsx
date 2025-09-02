'use client';

import { motion } from 'framer-motion';
import { 
  DollarSign, Clock, Users, CheckCircle, Calendar, 
  ArrowRight, Download, Phone, Mail
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function ProjectEstimationPage() {
  const [estimation, setEstimation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // Simulate estimation generation
    setTimeout(() => {
      setEstimation({
        projectType: 'AI/ML Solution',
        estimatedCost: '$75,000 - $125,000',
        timeline: '4-6 months',
        teamSize: '5-7 developers',
        phases: [
          { phase: 'Discovery & Planning', duration: '2-3 weeks', cost: '$8,000 - $12,000' },
          { phase: 'Design & Architecture', duration: '3-4 weeks', cost: '$15,000 - $20,000' },
          { phase: 'Development Phase 1', duration: '6-8 weeks', cost: '$25,000 - $35,000' },
          { phase: 'Development Phase 2', duration: '4-6 weeks', cost: '$20,000 - $30,000' },
          { phase: 'Testing & Deployment', duration: '2-3 weeks', cost: '$7,000 - $13,000' }
        ],
        technologies: ['Python', 'TensorFlow', 'AWS', 'React', 'PostgreSQL'],
        nextSteps: [
          'Review detailed proposal',
          'Schedule technical discussion',
          'Finalize project scope',
          'Sign agreement and start'
        ]
      });
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackButton backUrl="/start-project" />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-coral-primary mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-coral-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generating Your Estimate...</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Our AI is analyzing your requirements and calculating the perfect solution for your project.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>🤖 AI Analysis</span>
              <span>•</span>
              <span>💰 Cost Calculation</span>
              <span>•</span>
              <span>📅 Timeline Planning</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backUrl="/start-project" />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-coral-light to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-6xl mb-6">🎯</motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Your <span className="text-coral-primary">Project Estimate</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Based on your requirements, here's a detailed estimate from our Fortune 500 experts.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Estimation Details */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Summary Cards */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { icon: DollarSign, label: 'Estimated Cost', value: estimation.estimatedCost, color: 'text-green-500' },
              { icon: Clock, label: 'Timeline', value: estimation.timeline, color: 'text-blue-500' },
              { icon: Users, label: 'Team Size', value: estimation.teamSize, color: 'text-purple-500' },
              { icon: CheckCircle, label: 'Project Type', value: estimation.projectType, color: 'text-coral-primary' }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center"
              >
                <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-3`} />
                <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                <div className="text-lg font-bold text-gray-900">{item.value}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Phases */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Project Phases</h2>
              <div className="space-y-4">
                {estimation.phases.map((phase: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-coral-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{phase.phase}</div>
                        <div className="text-sm text-gray-600">{phase.duration}</div>
                      </div>
                    </div>
                    <div className="text-coral-primary font-semibold">{phase.cost}</div>
                  </motion.div>
                ))}
              </div>

              {/* Technologies */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Recommended Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {estimation.technologies.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="bg-coral-light text-coral-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-coral-primary to-coral-secondary p-8 rounded-3xl text-white"
            >
              <h2 className="text-2xl font-bold mb-6">🚀 Next Steps</h2>
              <div className="space-y-4 mb-8">
                {estimation.nextSteps.map((step: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link href="/schedule-meeting">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white text-coral-primary py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Discussion Call
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full border-2 border-white text-white py-3 rounded-full font-semibold hover:bg-white hover:text-coral-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Proposal
                </motion.button>

                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm opacity-90 mb-3">Questions? Contact us directly:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>hello@techxak.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+91-8494090499</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              🏆 Why Fortune 500 Companies Choose Us
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Join Google, Apple, and McDonald's in trusting TechXak for mission-critical projects
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Proven Track Record",
                description: "500+ successful projects with Fortune 500 companies",
                stat: "500+",
                color: "text-green-500"
              },
              {
                title: "Expert Team",
                description: "Senior developers with 10+ years experience",
                stat: "10+",
                color: "text-blue-500"
              },
              {
                title: "On-Time Delivery",
                description: "98% of projects delivered on schedule",
                stat: "98%",
                color: "text-coral-primary"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className={`text-4xl font-bold ${feature.color} mb-3`}>{feature.stat}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
