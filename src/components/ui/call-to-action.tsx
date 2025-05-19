
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface CallToActionProps {
  title: string;
  description?: string;
  primaryActionLabel: string;
  primaryActionOnClick: () => void;
  secondaryActionLabel?: string;
  secondaryActionOnClick?: () => void;
  className?: string;
  variant?: 'default' | 'dark' | 'gradient';
}

export const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryActionLabel,
  primaryActionOnClick,
  secondaryActionLabel,
  secondaryActionOnClick,
  className,
  variant = 'default'
}) => {
  return (
    <div className={cn(
      "py-12 px-6 rounded-xl",
      {
        'bg-gradient-to-r from-jarvis to-purple-600': variant === 'gradient',
        'bg-black/40 backdrop-blur-lg border border-white/10': variant === 'dark',
        'bg-jarvis/10 backdrop-blur-sm border border-jarvis/20': variant === 'default',
      },
      className
    )}>
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
        
        {description && (
          <p className={cn(
            "text-lg", 
            {
              'text-white/80': variant === 'gradient',
              'text-gray-300': variant !== 'gradient'
            }
          )}>
            {description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            className={cn(
              "px-6 py-2",
              {
                'bg-white text-jarvis hover:bg-gray-100': variant === 'gradient',
                'bg-jarvis text-white hover:bg-jarvis/90': variant !== 'gradient'
              }
            )}
            onClick={primaryActionOnClick}
          >
            <span>{primaryActionLabel}</span>
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          
          {secondaryActionLabel && secondaryActionOnClick && (
            <Button
              variant="outline"
              className={cn(
                "px-6 py-2",
                {
                  'border-white text-white hover:bg-white/10': variant === 'gradient',
                  'border-jarvis text-jarvis hover:bg-jarvis/10': variant !== 'gradient'
                }
              )}
              onClick={secondaryActionOnClick}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
