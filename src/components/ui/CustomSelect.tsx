'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  emoji?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  width = "w-[240px]",
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.custom-select-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${width} custom-select-container ${className}`}>
      {/* Select Button */}
      <motion.button
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full h-[60px] px-6 py-4 bg-white border border-gray-200 rounded-2xl transition-all duration-300 text-lg font-medium flex items-center justify-between ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:border-coral-primary/50 focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20'
        } outline-none`}
      >
        <span className={`truncate pr-2 ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.emoji && <span>{selectedOption.emoji}</span>}
              <span>{selectedOption.label}</span>
            </span>
          ) : (
            placeholder
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-coral-primary" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto"
        >
          {options.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ backgroundColor: '#ffe5e0' }}
              onClick={() => handleSelect(option.value)}
              className={`w-full px-6 py-3 text-left hover:bg-coral-light transition-colors flex items-center gap-3 text-lg font-medium ${
                value === option.value 
                  ? 'bg-coral-light text-coral-primary' 
                  : 'text-gray-900 hover:text-coral-primary'
              }`}
            >
              {option.emoji && <span className="text-xl flex-shrink-0">{option.emoji}</span>}
              <span className="truncate">{option.label}</span>
              {value === option.value && (
                <span className="ml-auto text-coral-primary flex-shrink-0">✓</span>
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
