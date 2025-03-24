# onboardly
[![npm version](https://img.shields.io/npm/v/onboardly.svg)](https://www.npmjs.com/package/onboardly)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/onboardly.svg)](https://www.npmjs.com/package/onboardly)

NPM library package for Guided Walkthroughs for User Onboarding

## How to use?

[Usage README](./packages/onboardly/README.md)

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
