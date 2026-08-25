# FlagPulse React SDK

A lightweight React SDK for FlagPulse, a self-hostable feature flag platform. This package lets you load feature flags from your FlagPulse server, cache them locally, and consume them in React components using a simple hook.

## Documentation

Official docs: https://flagpulse.h208.me


## What this package does

- Loads flags from your self-hosted FlagPulse backend
- Caches values in localStorage to reduce repeated network calls
- Connects to server updates and refreshes flag state automatically
- Exposes a React provider and hook for easy integration

## Installation

```bash
npm install flagbase-react-sdk
```

## Prerequisites

Before using this SDK, make sure you have:

- A running FlagPulse self-hosted instance
- A valid `sdkKey` from the FlagPulse dashboard
- The deployed feature flag base URL, for example:

```bash
https://flags.example.com
```

The `baseUrl` should be the public URL of your FlagPulse deployment, and the `sdkKey` is the client key generated in the dashboard.

## Setup

Wrap your app with the `FlagPulseProvider` and pass your FlagPulse URL and SDK key.

```tsx
import React from "react";
import { FlagPulseProvider, useFlag } from "flagbase-react-sdk";

function App() {
  return (
    <FlagPulseProvider
      baseUrl="https://flags.example.com"
      sdkKey="YOUR_SDK_KEY"
    >
      <FeatureFlagsDemo />
    </FlagPulseProvider>
  );
}
```

## Using flags in components

Use the `useFlag` hook to read a flag value. If the flag is missing or disabled, the fallback value is returned.

```tsx
function FeatureFlagsDemo() {
  const newCheckout = useFlag("new_checkout", false);
  const themeColor = useFlag("theme_color", "blue");

  return (
    <div>
      <h2>Feature demo</h2>

      {newCheckout ? <CheckoutV2 /> : <CheckoutV1 />}

      <p>Theme: {themeColor}</p>
    </div>
  );
}
```

### Example with boolean flags

```tsx
const betaDashboard = useFlag("beta_dashboard", false);

return betaDashboard ? <BetaDashboard /> : <ClassicDashboard />;
```

### Example with string flags

```tsx
const welcomeMessage = useFlag("welcome_message", "Welcome");
```

### Example with numeric flags

```tsx
const maxItems = useFlag("max_items", 10);
```

## Provider props

```tsx
<FlagPulseProvider
  baseUrl="https://flags.example.com"
  sdkKey="YOUR_SDK_KEY"
  ttl={300000}
>
  <App />
</FlagPulseProvider>
```

### Props

- `baseUrl`: URL of your deployed FlagPulse instance
- `sdkKey`: SDK key issued from the FlagPulse dashboard
- `ttl` (optional): cache TTL in milliseconds. Default is `300000` (5 minutes)
- `children`: React content inside the provider

## Direct client usage

This package also exports `FlagPulseClient` if you want to manage the SDK directly.

```tsx
import { FlagPulseClient } from "flagbase-react-sdk";

const client = new FlagPulseClient({
  sdkKey: "YOUR_SDK_KEY",
  baseUrl: "https://flags.example.com",
  ttl: 300000,
});

await client.init();

const isEnabled = client.get("new_checkout", false);
console.log(isEnabled);
```

### Client methods

- `init()`: fetches flags and connects the streaming client
- `get(flagKey, fallback)`: returns a flag value or the provided fallback
- `identify(context)`: stores contextual data for later use
- `onUpdate(callback)`: subscribes to flag updates
- `reset()`: clears cache and state
- `destroy()`: disconnects the live update listener

## How the SDK works

The SDK does the following internally:

1. Validates the `sdkKey` and `baseUrl`
2. Fetches flags from:

```bash
${baseUrl}/api/v1/flags
```

3. Sends the SDK key in the request header:

```http
x-sdk-key: YOUR_SDK_KEY
```

4. Stores the flag list in localStorage for quick access
5. Subscribes to flag updates so UI values refresh in real time

## Self-hosted FlagPulse note

This SDK is meant for self-hosted FlagPulse deployments. In your hosted dashboard, generate the SDK key and use the deployed URL for your environment, such as:

- Development: `https://dev-flags.example.com`
- Staging: `https://staging-flags.example.com`
- Production: `https://flags.example.com`

Keep the SDK key private and do not expose it in client-side code if your deployment requires stricter access controls.

## Example full app

```tsx
import React from "react";
import { FlagPulseProvider, useFlag } from "flagbase-react-sdk";

function App() {
  return (
    <FlagPulseProvider
      baseUrl="https://flags.example.com"
      sdkKey="YOUR_SDK_KEY"
    >
      <Dashboard />
    </FlagPulseProvider>
  );
}

function Dashboard() {
  const enableReports = useFlag("enable_reports", false);

  return (
    <main>
      {enableReports ? <ReportsPage /> : <OverviewPage />}
    </main>
  );
}

function ReportsPage() {
  return <div>Reports enabled</div>;
}

function OverviewPage() {
  return <div>Overview</div>;
}
```

## License

ISC

## Notes

This package is designed for React applications and follows the FlagPulse self-hosted deployment model. For production use, configure your environment-specific base URL and SDK key carefully.
