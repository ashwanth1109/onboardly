# Onboardly

A simple React component library for Onboardly.

## Installation

```bash
npm install onboardly
# or
yarn add onboardly
# or
pnpm add onboardly
```

## Usage

```jsx
import { Onboardly } from 'onboardly';

function App() {
  return <Onboardly
    steps={[
      {
        target: '#element-id',
        title: 'Welcome',
        content: 'This is the first step of your onboarding tour.'
      },
      // More steps...
    ]}
    isActive={true}
  />;
}
```

## API Reference

### `<Onboardly>` Component

The main component that provides onboarding functionality.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `steps` | `OnboardlyStep[]` | Yes | Array of steps for the onboarding tour |
| `isActive` | `boolean` | Yes | Controls whether the tour is running |
| `currentStep` | `number` | No | Control the current step (controlled mode) |
| `onStepChange` | `(newStep: number) => void` | No | Callback when step changes |
| `onStart` | `() => void` | No | Callback when tour starts |
| `onEnd` | `() => void` | No | Callback when tour ends |
| `classNames` | `object` | No | Custom CSS class names |
| `labels` | `object` | No | Custom button labels |
| `options` | `object` | No | Behavior configuration options |
| `onBeforeStepChange` | `(fromStep: number, toStep: number) => boolean \| Promise<boolean>` | No | Hook called before step changes |
| `onAfterStepChange` | `(currentStep: number) => void` | No | Hook called after step changes |

### `useOnboardly` Hook

A React hook that provides access to the Onboardly context. This hook must be used within an Onboardly component.

```jsx
import { useOnboardly } from 'onboardly';

function MyComponent() {
  const {
    currentStepIndex,
    steps,
    isVisible,
    handleNext,
    handleBack,
    handleSkip,
    changeStep
  } = useOnboardly();
  
  return (
    <div>
      {isVisible && (
        <button onClick={handleNext}>
          Custom Next Button ({currentStepIndex + 1}/{steps.length})
        </button>
      )}
    </div>
  );
}
```

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `currentStepIndex` | `number` | The index of the current step |
| `steps` | `OnboardlyStep[]` | Array of steps for the tour |
| `isVisible` | `boolean` | Whether the tour is currently visible |
| `targetElements` | `Element[]` | DOM elements being targeted in current step |
| `handleNext` | `() => void` | Go to the next step |
| `handleBack` | `() => void` | Go to the previous step |
| `handleSkip` | `() => void` | Skip/end the tour |
| `changeStep` | `(nextStepIndex: number) => Promise<void>` | Go to a specific step |
| `tooltipPosition` | `object` | Current tooltip position |
| `options` | `object` | Merged options object |
| `labels` | `object` | Merged labels object |
| `classNames` | `object` | Custom CSS class names |

### Step Configuration

Each step in the `steps` array is an object with the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `target` | `string \| string[]` | Yes | Element ID(s) to highlight |
| `title` | `string` | Yes | Step title |
| `content` | `string` | Yes | Step content |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | Tooltip position |
| `setup` | `() => void \| Promise<void>` | No | Callback before showing step |
| `cleanup` | `() => void` | No | Callback when exiting step |
| `styles` | `object` | No | Custom styles for this step |

### Custom Styling Options

The `classNames` prop allows customizing CSS classes:

```jsx
<Onboardly
  classNames={{
    tooltip: 'custom-tooltip',
    tooltipTitle: 'custom-title',
    tooltipContent: 'custom-content',
    navigationContainer: 'custom-nav',
    navigationDots: 'custom-dots',
    backButton: 'custom-back-btn',
    nextButton: 'custom-next-btn',
    skipButton: 'custom-skip-btn',
    spotlightMask: 'custom-mask',
    highlightBorder: 'custom-border'
  }}
  // ...other props
/>
```

### Behavior Options

The `options` prop provides advanced configuration:

```jsx
<Onboardly
  options={{
    spotlightPadding: 10,
    disableOverlayClose: false,
    disableKeyboardNavigation: false,
    hideBackButtonOnFirstStep: true,
    hideSkipButton: false,
    showProgressDots: true,
    highlightPulsate: true,
    exitOnEscape: true,
    animationDuration: 300,
    maskColor: 'rgba(0,0,0,0.7)',
    maskOpacity: 0.7
  }}
  // ...other props
/>
```

## Publishing

To publish a new version of the package to npm:

1. Update the version in `package.json`
2. Build the package:
   ```bash
   pnpm build
   ```
3. Log in to npm (if not already logged in):
   ```bash
   npm login
   ```
4. Publish the package:
   ```bash
   npm publish
   ``` 

