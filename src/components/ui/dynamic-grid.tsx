
import React from 'react';
import { cn } from '@/lib/utils';

interface DynamicGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number;
  mdCols?: number;
  lgCols?: number;
  gap?: number;
  animate?: boolean;
  stagger?: boolean;
}

export const DynamicGrid: React.FC<DynamicGridProps> = ({
  children,
  className,
  cols = 1,
  mdCols = 2,
  lgCols = 3,
  gap = 6,
  animate = false,
  stagger = false,
}) => {
  // Convert children to array to handle them individually
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div 
      className={cn(
        "grid",
        `grid-cols-${cols}`,
        `md:grid-cols-${mdCols}`,
        `lg:grid-cols-${lgCols}`,
        `gap-${gap}`,
        className
      )}
    >
      {animate ? (
        childrenArray.map((child, index) => (
          <div 
            key={index} 
            className="animate-fade-in" 
            style={{ animationDelay: stagger ? `${index * 0.1}s` : '0s' }}
          >
            {child}
          </div>
        ))
      ) : (
        children
      )}
    </div>
  );
};

export const FeatureGrid: React.FC<DynamicGridProps> = ({
  children,
  className,
  cols = 1,
  mdCols = 2,
  lgCols = 3,
  gap = 6,
  animate = true,
  stagger = true,
}) => {
  // Convert children to array to handle them individually
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div 
      className={cn(
        "grid",
        `grid-cols-${cols}`,
        `md:grid-cols-${mdCols}`,
        `lg:grid-cols-${lgCols}`,
        `gap-${gap}`,
        className
      )}
    >
      {childrenArray.map((child, index) => (
        <div 
          key={index} 
          className={cn(
            "p-6 rounded-xl transition-all duration-300 hover:shadow-purple-glow",
            animate ? "animate-fade-in" : "",
            "bg-gradient-to-br from-black/40 to-jarvis-purple/5 backdrop-blur-sm",
            "border border-jarvis-purple/10 hover:border-jarvis-purple/30"
          )}
          style={{ 
            animationDelay: stagger ? `${index * 0.1}s` : '0s',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}> = ({
  children,
  className,
  hoverEffect = true
}) => {
  return (
    <div 
      className={cn(
        "p-6 rounded-xl bg-black/30 backdrop-blur-md border border-jarvis-purple/10",
        "shadow-lg transition-all duration-300",
        hoverEffect && "hover:shadow-purple-glow hover:border-jarvis-purple/30",
        className
      )}
    >
      {children}
    </div>
  );
};

export const FeatureCard: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}> = ({
  icon,
  title,
  description,
  className
}) => {
  return (
    <div className={cn(
      "p-6 rounded-xl transition-all duration-300",
      "bg-gradient-to-br from-black/40 to-jarvis-purple/5 backdrop-blur-sm",
      "border border-jarvis-purple/10 hover:border-jarvis-purple/30",
      "hover:shadow-purple-glow",
      className
    )}>
      {icon && (
        <div className="mb-4 text-jarvis-purple">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};
