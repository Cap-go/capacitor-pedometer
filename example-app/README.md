# Capacitor Pedometer Example App

This is an example app demonstrating the usage of @capgo/capacitor-pedometer plugin.

## Running the app

### Web
```bash
bun install
bun start
```

### iOS
```bash
bun install
bun run build
npx cap add ios
npx cap open ios
```

### Android
```bash
bun install
bun run build
npx cap add android
npx cap open android
```

## Features Demonstrated

- Checking pedometer feature availability
- Requesting activity recognition permissions
- Starting/stopping real-time step updates
- Querying historical pedometer data (iOS only)
- Displaying steps, distance, pace, cadence, and floor data
