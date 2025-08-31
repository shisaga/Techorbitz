'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, children, disabled, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (newValue: string) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
      setIsOpen(false);
    };

    return (
      <div
        ref={selectRef}
        className={cn('relative', className)}
        {...props}
      >
        <SelectTrigger
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <SelectValue value={selectedValue} />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        {isOpen && (
          <SelectContent>
            {React.Children.map(children, (child) => {
              if (React.isValidElement<SelectItemProps>(child) && child.type === SelectItem) {
                return React.cloneElement(child, {
                  onSelect: () => handleSelect(child.props.value),
                });
              }
              return child;
            })}
          </SelectContent>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disabled?: boolean;
}

const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, children, disabled, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectValueProps {
  value?: string;
  placeholder?: string;
}

const SelectValue = ({ value, placeholder }: SelectValueProps) => {
  return <span className={cn(!value && 'text-muted-foreground')}>
    {value || placeholder || 'Select an option'}
  </span>;
};
SelectValue.displayName = 'SelectValue';

interface SelectContentProps {
  children: React.ReactNode;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, ...props }, ref) => (
    <div
      ref={ref}
      className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md"
      {...props}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  )
);
SelectContent.displayName = 'SelectContent';

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, onSelect, disabled, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={!disabled ? onSelect : undefined}
      {...props}
    >
      {children}
    </div>
  )
);
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

