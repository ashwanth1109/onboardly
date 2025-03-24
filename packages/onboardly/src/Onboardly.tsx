import React from 'react';

export interface OnboardlyProps {
  /**
   * Optional class name to add to the component
   */
  className?: string;
}

/**
 * Onboardly component 
 */
export const Onboardly: React.FC<OnboardlyProps> = ({ 
  className = '',
}) => {
  return (
    <h1 className={className}>
      Onboardly
    </h1>
  );
}; 