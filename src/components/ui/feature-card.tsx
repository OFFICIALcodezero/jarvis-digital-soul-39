
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  className 
}) => {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-lg p-6 transition-all duration-300",
      "hover:border-jarvis/40 hover:shadow-lg hover:shadow-jarvis/10",
      "flex flex-col items-start gap-4",
      className
    )}>
      <div className="rounded-full bg-gradient-to-br from-jarvis to-purple-600 p-2.5 text-white">
        <Icon className="h-5 w-5" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
      
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-jarvis/10 to-purple-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
    </div>
  );
};

export const FeatureShowcase: React.FC<{ 
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}> = ({ 
  title, 
  description, 
  children, 
  className,
  align = 'left'
}) => {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">
        <div className={cn(
          "max-w-3xl mb-12",
          align === 'center' ? 'mx-auto text-center' : ''
        )}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-300">
              {description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    </section>
  );
};
