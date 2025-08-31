'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

interface InputFieldProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'search' | 'minimal';
  loading?: boolean;
  error?: string;
  maxLength?: number;
  autoComplete?: string;
  name?: string;
  id?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  icon: Icon,
  rightIcon: RightIcon,
  rightElement,
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
  size = 'md',
  variant = 'default',
  loading = false,
  error,
  maxLength,
  autoComplete,
  name,
  id
}, ref) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-4 text-lg',
    lg: 'px-8 py-5 text-xl'
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20',
    search: 'bg-white border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20',
    minimal: 'bg-gray-50 border border-gray-100 rounded-lg focus:border-coral-primary focus:ring-1 focus:ring-coral-primary/10'
  };

  const getInputClasses = () => {
    const baseClasses = 'w-full outline-none transition-all duration-300 placeholder-gray-400 text-gray-900 font-medium';
    const sizeClass = sizeClasses[size];
    const variantClass = variantClasses[variant];
    const paddingClass = Icon ? 'pl-12' : 'pl-6';
    const rightPaddingClass = (RightIcon || rightElement || loading) ? 'pr-12' : 'pr-6';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
    const errorClass = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : '';
    
    return `${baseClasses} ${sizeClass} ${variantClass} ${paddingClass} ${rightPaddingClass} ${disabledClass} ${errorClass} ${inputClassName}`;
  };

  const iconSize = size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const iconColor = value ? 'text-coral-primary' : 'text-gray-400';

  return (
    <div className={`${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Icon className={`${iconSize} transition-colors ${iconColor}`} />
          </div>
        )}

      {/* Input Field */}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        name={name}
        id={id}
        className={getInputClasses()}
      />

        {/* Right Side Content */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-coral-primary"></div>
          )}
          
          {!loading && RightIcon && (
            <RightIcon className={`${iconSize} ${iconColor}`} />
          )}
          
          {!loading && rightElement && rightElement}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
