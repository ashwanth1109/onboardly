import React from 'react';
import { PulsatingBorderProps } from './types';
import { calculateBoundingBox } from './utils';

export const PulsatingBorder: React.FC<PulsatingBorderProps> = ({ 
  targetElements, 
  options, 
  customStyles, 
  className 
}) => {
  const defaultOptions = {
    spotlightPadding: 10,
    animationDuration: 300,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const getBorderStyles = () => {
    const boundingBox = calculateBoundingBox(
      targetElements, 
      mergedOptions.spotlightPadding || 0
    );
    
    if (!boundingBox) return null;
    
    return {
      position: 'fixed',
      top: `${boundingBox.top}px`,
      left: `${boundingBox.left}px`,
      width: `${boundingBox.width}px`,
      height: `${boundingBox.height}px`,
      border: '2px solid #4A90E2',
      borderRadius: '4px',
      pointerEvents: 'none',
      transition: `all ${mergedOptions.animationDuration}ms ease-in-out`,
      animation: options?.highlightPulsate ? 'onboardly-pulse 1.5s infinite' : 'none',
      ...customStyles,
    } as React.CSSProperties;
  };
  
  const borderStyles = getBorderStyles();
  
  if (!borderStyles) return null;
  
  return (
    <div 
      style={borderStyles}
      className={className}
    />
  );
}; 