'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type CommonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
  classTitle?: string;
  classSubTitle?: string;
};

const CommonModal: React.FC<CommonModalProps> = ({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  trigger,
  className,
  classTitle,
  classSubTitle,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn('max-h-[90vh] overflow-y-auto rounded-xl bg-[#111] px-6 py-4 text-white sm:max-w-[600px]', className)}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          {title && <DialogTitle className={cn('text-lg', classTitle)}>{title}</DialogTitle>}
          {subtitle && <p className={cn('text-sm text-gray-400', classSubTitle)}>{subtitle}</p>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CommonModal;
