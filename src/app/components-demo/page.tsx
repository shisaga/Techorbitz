'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Users, Monitor, ArrowRight, ArrowLeft,
  Zap, DollarSign, Clock, Brain, CheckCircle
} from 'lucide-react';
import StepNavigation from '@/components/ui/StepNavigation';
import Header from '@/components/layout/Header';

export default function ComponentsDemo() {
  const [currentStep1, setCurrentStep1] = useState(2);
  const [currentStep2, setCurrentStep2] = useState(3);
  const [currentStep3, setCurrentStep3] = useState(1);

  const campaignSteps = [
    { 
      id: 'settings', 
      title: 'Select campaign settings', 
      description: 'Configure your campaign',
      icon: <Settings className="w-6 h-6" />
    },
    { 
      id: 'ad-group', 
      title: 'Create an ad group', 
      description: 'Group your ads',
      icon: <Users className="w-6 h-6" />
    },
    { 
      id: 'create-ad', 
      title: 'Create an ad', 
      description: 'Design your advertisement',
      icon: <Monitor className="w-6 h-6" />
    }
  ];

  const projectSteps = [
    { id: 'project-type', title: 'Project Type', description: 'What are you building?', icon: <Zap className="w-6 h-6" /> },
    { id: 'industry-budget', title: 'Industry & Budget', description: 'Context and investment', icon: <DollarSign className="w-6 h-6" /> },
    { id: 'timeline-team', title: 'Timeline & Team', description: 'When and how many', icon: <Clock className="w-6 h-6" /> },
    { id: 'technologies', title: 'Technologies', description: 'Tech preferences', icon: <Brain className="w-6 h-6" /> },
    { id: 'contact-info', title: 'Contact Info', description: 'Get in touch', icon: <CheckCircle className="w-6 h-6" /> }
  ];

  const simpleSteps = [
    { id: 'step1', title: 'Step 1' },
    { id: 'step2', title: 'Step 2' },
    { id: 'step3', title: 'Step 3' },
    { id: 'step4', title: 'Step 4' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton backUrl="/" />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🧩 Step Navigation <span className="text-coral-primary">Components</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beautiful, interactive step navigation components for your onboarding flows and multi-step forms.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Default Variant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Default Variant</h2>
                <p className="text-gray-600">Full-featured step navigation with labels, descriptions, and progress bar</p>
              </div>

              <StepNavigation
                steps={campaignSteps}
                currentStep={currentStep1}
                onStepClick={setCurrentStep1}
                allowClickNavigation={true}
                showLabels={true}
                variant="default"
              />

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentStep1(Math.max(1, currentStep1 - 1))}
                  disabled={currentStep1 === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep1(Math.min(campaignSteps.length, currentStep1 + 1))}
                  disabled={currentStep1 === campaignSteps.length}
                  className="flex items-center gap-2 px-4 py-2 bg-coral-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-coral-secondary transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Compact Variant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Compact Variant</h2>
                <p className="text-gray-600">Space-efficient navigation perfect for headers and tight spaces</p>
              </div>

              <div className="flex justify-center mb-8">
                <StepNavigation
                  steps={projectSteps}
                  currentStep={currentStep2}
                  onStepClick={setCurrentStep2}
                  allowClickNavigation={true}
                  showLabels={false}
                  variant="compact"
                />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {projectSteps[currentStep2 - 1]?.title}
                </h3>
                <p className="text-gray-600">
                  {projectSteps[currentStep2 - 1]?.description}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCurrentStep2(Math.max(1, currentStep2 - 1))}
                  disabled={currentStep2 === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep2(Math.min(projectSteps.length, currentStep2 + 1))}
                  disabled={currentStep2 === projectSteps.length}
                  className="flex items-center gap-2 px-4 py-2 bg-coral-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-coral-secondary transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Minimal Variant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Minimal Variant</h2>
                <p className="text-gray-600">Ultra-clean dots for subtle progress indication</p>
              </div>

              <div className="flex justify-center mb-8">
                <StepNavigation
                  steps={simpleSteps}
                  currentStep={currentStep3}
                  variant="minimal"
                  showLabels={false}
                />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Step {currentStep3} of {simpleSteps.length}
                </h3>
                <p className="text-gray-600">
                  Simple progress indication with minimal visual footprint
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCurrentStep3(Math.max(1, currentStep3 - 1))}
                  disabled={currentStep3 === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep3(Math.min(simpleSteps.length, currentStep3 + 1))}
                  disabled={currentStep3 === simpleSteps.length}
                  className="flex items-center gap-2 px-4 py-2 bg-coral-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-coral-secondary transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Usage Examples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-coral-primary to-coral-secondary p-8 rounded-3xl text-white"
            >
              <h2 className="text-2xl font-bold mb-6">🚀 Usage Examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-3">Onboarding Flows</h3>
                  <p className="text-white/90 text-sm">
                    Perfect for multi-step user registration, project setup, or feature introductions.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-3">Checkout Process</h3>
                  <p className="text-white/90 text-sm">
                    Guide users through payment flows with clear progress indication.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-3">Form Wizards</h3>
                  <p className="text-white/90 text-sm">
                    Break complex forms into manageable steps with visual progress.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Code Examples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900 p-8 rounded-3xl text-white"
            >
              <h2 className="text-2xl font-bold mb-6">💻 Code Examples</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-coral-primary">Default Usage</h3>
                  <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-sm">
                    <code>{`<StepNavigation
  steps={steps}
  currentStep={currentStep}
  onStepClick={setCurrentStep}
  allowClickNavigation={true}
  variant="default"
/>`}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-coral-primary">Compact Usage</h3>
                  <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-sm">
                    <code>{`<StepNavigation
  steps={steps}
  currentStep={currentStep}
  variant="compact"
  showLabels={false}
/>`}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
