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
  return <Onboardly />;
}
```

## Development

For monorepo development instructions, see the root README.md file. 

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