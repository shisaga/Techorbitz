'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const [isOpen, setIsOpen] = useState(open || false);

  useEffect(() => {
    setIsOpen(open || false);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  if (!isOpen) return null;

  return (
    <DialogOverlay onClick={() => handleOpenChange(false)}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogContent>
    </DialogOverlay>
  );
};

interface DialogOverlayProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const DialogOverlay = ({ children, onClick }: DialogOverlayProps) => (
  <div
    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    onClick={onClick}
  >
    <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
      {children}
    </div>
  </div>
);

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </div>
  )
);
DialogContent.displayName = 'DialogContent';

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </div>
  )
);
DialogHeader.displayName = 'DialogHeader';

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  )
);
DialogTitle.displayName = 'DialogTitle';

interface DialogTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const Comp = asChild ? 'div' : 'button';
    return (
      <Comp
        ref={ref as any}
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
DialogTrigger.displayName = 'DialogTrigger';

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger };

