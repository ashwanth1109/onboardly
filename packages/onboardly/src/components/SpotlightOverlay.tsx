import React from 'react';
import { SpotlightOverlayProps } from './types';
import { calculateBoundingBox } from './utils';

export const SpotlightOverlay: React.FC<SpotlightOverlayProps> = ({ 
  targetElements, 
  options, 
  onClick, 
  customStyles 
}) => {
  const defaultOptions = {
    spotlightPadding: 10,
    maskColor: '#000',
    maskOpacity: 0.7,
    animationDuration: 300,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const getSpotlightStyles = () => {
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
      boxShadow: `0 0 0 9999px rgba(${
        mergedOptions.maskColor === '#000' ? '0, 0, 0' : '255, 255, 255'
      }, ${mergedOptions.maskOpacity})`,
      borderRadius: '4px',
      transition: `all ${mergedOptions.animationDuration}ms ease-in-out`,
      ...customStyles,
    } as React.CSSProperties;
  };
  
  const spotlightStyles = getSpotlightStyles();
  
  if (!spotlightStyles) return null;
  
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9998,
        pointerEvents: 'all',
      }}
    >
      <div
        style={spotlightStyles}
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
}; 