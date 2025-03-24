import { OnboardlyProps } from './types';

export const getDefaultOptions = (options?: OnboardlyProps['options']) => {
  const defaultOptions = {
    spotlightPadding: 10,
    maskColor: '#000',
    maskOpacity: 0.7,
    animationDuration: 300,
    highlightPulsate: true,
    showProgressDots: true,
    exitOnEscape: true,
    disableOverlayClose: false,
    disableKeyboardNavigation: false,
    hideBackButtonOnFirstStep: false,
    hideSkipButton: false,
  };
  
  return { ...defaultOptions, ...options };
};

export const getDefaultLabels = (labels?: OnboardlyProps['labels']) => {
  const defaultLabels = {
    nextButton: 'Next',
    backButton: 'Back',
    skipButton: 'Skip',
    finishButton: 'Finish'
  };
  
  return { ...defaultLabels, ...labels };
};

// Calculate the bounding box for target elements
export const calculateBoundingBox = (
  targetElements: Element[], 
  padding: number = 10
) => {
  if (targetElements.length === 0) return null;
  
  // Calculate the bounding box that encompasses all target elements
  const rects = targetElements.map(el => el.getBoundingClientRect());
  
  let minX = Math.min(...rects.map(r => r.left));
  let minY = Math.min(...rects.map(r => r.top));
  let maxX = Math.max(...rects.map(r => r.right));
  let maxY = Math.max(...rects.map(r => r.bottom));
  
  // Apply padding
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;
  
  return {
    top: minY,
    left: minX,
    width: maxX - minX,
    height: maxY - minY,
    rects
  };
}; 