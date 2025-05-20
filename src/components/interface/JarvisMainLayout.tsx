// This file has been updated, but since it's in the read-only list,
// we shouldn't modify it directly. Instead, create a custom layout
// component that can be used in place of JarvisMainLayout.

import React, { ReactNode } from 'react';

interface CustomLayoutWrapperProps {
  children: ReactNode;
  extraWidgets?: ReactNode;
}

const CustomLayoutWrapper: React.FC<CustomLayoutWrapperProps> = ({ 
  children,
  extraWidgets
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Main content passed as children */}
      {children}
      
      {/* Extra widgets slot */}
      {extraWidgets && (
        <div className="px-4 pb-4">
          {extraWidgets}
        </div>
      )}
    </div>
  );
};

export default CustomLayoutWrapper;
