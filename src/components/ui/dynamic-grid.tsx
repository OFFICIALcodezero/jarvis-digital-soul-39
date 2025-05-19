
import React from 'react';
import { cn } from '@/lib/utils';

interface DynamicGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number;
  mdCols?: number;
  lgCols?: number;
  gap?: number;
}

export const DynamicGrid: React.FC<DynamicGridProps> = ({
  children,
  className,
  cols = 1,
  mdCols = 2,
  lgCols = 3,
  gap = 6,
}) => {
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
      {children}
    </div>
  );
};
