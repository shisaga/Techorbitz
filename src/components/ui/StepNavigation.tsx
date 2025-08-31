'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  variant?: 'default' | 'compact' | 'minimal';
  showLabels?: boolean;
  allowClickNavigation?: boolean;
  className?: string;
}

export default function StepNavigation({
  steps,
  currentStep,
  onStepClick,
  variant = 'default',
  showLabels = true,
  allowClickNavigation = false,
  className = ''
}: StepNavigationProps) {
  
  const getStepStatus = (index: number) => {
    if (index < currentStep - 1) return 'completed';
    if (index === currentStep - 1) return 'current';
    return 'upcoming';
  };

  const handleStepClick = (index: number) => {
    if (allowClickNavigation && onStepClick) {
      onStepClick(index + 1);
    }
  };

  const getStepColors = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-coral-primary text-white border-coral-primary',
          line: 'bg-coral-primary',
          text: 'text-coral-primary'
        };
      case 'current':
        return {
          circle: 'bg-coral-primary text-white border-coral-primary ring-4 ring-coral-primary/20',
          line: 'bg-gray-200',
          text: 'text-coral-primary font-semibold'
        };
      default:
        return {
          circle: 'bg-gray-100 text-gray-400 border-gray-200',
          line: 'bg-gray-200',
          text: 'text-gray-500'
        };
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        {steps.map((_, index) => {
          const status = getStepStatus(index);
          return (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                status === 'completed' || status === 'current'
                  ? 'bg-coral-primary'
                  : 'bg-gray-200'
              }`}
            />
          );
        })}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const colors = getStepColors(status);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center">
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={allowClickNavigation ? { scale: 1.1 } : {}}
                whileTap={allowClickNavigation ? { scale: 0.95 } : {}}
                onClick={() => handleStepClick(index)}
                disabled={!allowClickNavigation}
                className={`
                  relative w-10 h-10 rounded-full border-2 transition-all duration-300 
                  flex items-center justify-center text-sm font-semibold
                  ${colors.circle}
                  ${allowClickNavigation ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.button>

              {!isLast && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  className={`w-12 h-0.5 mx-2 ${colors.line} transition-colors duration-300`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const colors = getStepColors(status);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              {/* Step Circle */}
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15 }}
                whileHover={allowClickNavigation ? { scale: 1.1 } : {}}
                whileTap={allowClickNavigation ? { scale: 0.95 } : {}}
                onClick={() => handleStepClick(index)}
                disabled={!allowClickNavigation}
                className={`
                  relative w-12 h-12 rounded-full border-2 transition-all duration-300 
                  flex items-center justify-center text-lg font-semibold z-10
                  ${colors.circle}
                  ${allowClickNavigation ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}
                `}
              >
                {step.icon ? (
                  step.icon
                ) : status === 'completed' ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}

                {/* Pulse animation for current step */}
                {status === 'current' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-coral-primary"
                    initial={{ scale: 1, opacity: 0.3 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.button>

              {/* Connecting Line */}
              {!isLast && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: status === 'completed' ? 1 : 0.3 }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                  className={`
                    absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 
                    ${colors.line} transition-colors duration-300
                    origin-left
                  `}
                  style={{ left: '50%', right: '-50%', width: 'calc(100% - 24px)', marginLeft: '12px' }}
                />
              )}

              {/* Step Labels */}
              {showLabels && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.2 }}
                  className="mt-4 text-center max-w-[120px]"
                >
                  <div className={`text-sm font-medium ${colors.text} transition-colors duration-300`}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar Alternative */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gray-200 rounded-full h-2 overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-coral-primary to-coral-secondary rounded-full"
        />
      </motion.div>

      {/* Progress Text */}
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <span>Step {currentStep} of {steps.length}</span>
        <span>{Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}% Complete</span>
      </div>
    </div>
  );
}
