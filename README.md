# onboardly
NPM library package for Guided Walkthroughs for User Onboarding

## Development Setup

### Building the Package

1. Install dependencies:
```bash
pnpm install
```

2. Build the package:
```bash
pnpm build:packages
```

### Using in a React Application

1. Add the package as a workspace dependency in your application's package.json:
```json
"dependencies": {
  "onboardly": "workspace:*"
}
```

2. Import and use in your React components:
```tsx
import { Onboardly } from 'onboardly';

function App() {
  return (
    <div>
      <Onboardly />
    </div>
  );
}
```

### Testing Changes

After making changes to the package:

1. Rebuild the package:
```bash
pnpm build:packages
```

2. Your React application will automatically use the updated package.
