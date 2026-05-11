# @capgo/capacitor-pedometer

<a href="https://capgo.app/"><img src="https://capgo.app/readme-banner.svg?repo=Cap-go/capacitor-pedometer" alt="Capgo - Instant updates for Capacitor" /></a>

Capacitor plugin for accessing pedometer data including steps, distance, pace, cadence, and floors.

## Compatibility

| Plugin version | Capacitor compatibility | Maintained |
| -------------- | ----------------------- | ---------- |
| v8.\*.\*       | v8.\*.\*                | ✅          |
| v7.\*.\*       | v7.\*.\*                | On demand   |
| v6.\*.\*       | v6.\*.\*                | ❌          |
| v5.\*.\*       | v5.\*.\*                | ❌          |

> **Note:** The major version of this plugin follows the major version of Capacitor. Use the version that matches your Capacitor installation (e.g., plugin v8 for Capacitor 8). Only the latest major version is actively maintained.

## Install

```bash
npm install @capgo/capacitor-pedometer
npx cap sync
```

## Configuration

### iOS

Add the following to your `Info.plist`:

```xml
<key>NSMotionUsageDescription</key>
<string>We need access to your motion data to track steps and activity</string>
```

### Android

The plugin will automatically add the `ACTIVITY_RECOGNITION` permission to your `AndroidManifest.xml`.

For Android 10 (API 29) and above, you need to request the `ACTIVITY_RECOGNITION` permission at runtime.

## API

<docgen-index>

* [`getMeasurement(...)`](#getmeasurement)
* [`isAvailable()`](#isavailable)
* [`startMeasurementUpdates()`](#startmeasurementupdates)
* [`stopMeasurementUpdates()`](#stopmeasurementupdates)
* [`checkPermissions()`](#checkpermissions)
* [`requestPermissions()`](#requestpermissions)
* [`addListener('measurement', ...)`](#addlistenermeasurement-)
* [`removeAllListeners()`](#removealllisteners)
* [`getPluginVersion()`](#getpluginversion)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### getMeasurement(...)

```typescript
getMeasurement(options?: GetMeasurementOptions | undefined) => Promise<Measurement>
```

Get pedometer measurements for a specified time range.

| Param         | Type                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| **`options`** | <code><a href="#getmeasurementoptions">GetMeasurementOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#measurement">Measurement</a>&gt;</code>

**Since:** 0.0.1

--------------------


### isAvailable()

```typescript
isAvailable() => Promise<IsAvailableResult>
```

Check which pedometer features are available on this device.

**Returns:** <code>Promise&lt;<a href="#isavailableresult">IsAvailableResult</a>&gt;</code>

**Since:** 0.0.1

--------------------


### startMeasurementUpdates()

```typescript
startMeasurementUpdates() => Promise<void>
```

Start receiving real-time pedometer measurement updates.

On **Android** and **iOS**, the `measurement` event is only fired after calling `startMeasurementUpdates()`.

**Since:** 0.0.1

--------------------


### stopMeasurementUpdates()

```typescript
stopMeasurementUpdates() => Promise<void>
```

Stop receiving real-time pedometer measurement updates.

**Since:** 0.0.1

--------------------


### checkPermissions()

```typescript
checkPermissions() => Promise<PermissionStatus>
```

Check permission to access pedometer data.

On **Android**, this checks the `ACTIVITY_RECOGNITION` permission.
On **iOS**, this checks the motion usage permission.

**Returns:** <code>Promise&lt;<a href="#permissionstatus">PermissionStatus</a>&gt;</code>

**Since:** 0.0.1

--------------------


### requestPermissions()

```typescript
requestPermissions() => Promise<PermissionStatus>
```

Request permission to access pedometer data.

On **Android**, this requests the `ACTIVITY_RECOGNITION` permission.
On **iOS**, this requests motion usage permission.

**Returns:** <code>Promise&lt;<a href="#permissionstatus">PermissionStatus</a>&gt;</code>

**Since:** 0.0.1

--------------------


### addListener('measurement', ...)

```typescript
addListener(eventName: 'measurement', listenerFunc: (event: MeasurementEvent) => void) => Promise<PluginListenerHandle>
```

Called when a new pedometer measurement is received.

| Param              | Type                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| **`eventName`**    | <code>'measurement'</code>                                              |
| **`listenerFunc`** | <code>(event: <a href="#measurement">Measurement</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

**Since:** 0.0.1

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Remove all listeners for this plugin.

**Since:** 0.0.1

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the native Capacitor plugin version.

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

**Since:** 1.0.0

--------------------


### Interfaces


#### Measurement

| Prop                    | Type                | Description                                                                         | Since |
| ----------------------- | ------------------- | ----------------------------------------------------------------------------------- | ----- |
| **`numberOfSteps`**     | <code>number</code> | The number of steps taken by the user.                                              | 0.0.1 |
| **`distance`**          | <code>number</code> | The estimated distance (in meters) traveled by the user. Only available on **iOS**. | 0.0.1 |
| **`floorsAscended`**    | <code>number</code> | The approximate number of floors ascended. Only available on **iOS**.               | 0.0.1 |
| **`floorsDescended`**   | <code>number</code> | The approximate number of floors descended. Only available on **iOS**.              | 0.0.1 |
| **`currentPace`**       | <code>number</code> | The current pace (in seconds per meter). Only available on **iOS**.                 | 0.0.1 |
| **`currentCadence`**    | <code>number</code> | The current cadence (steps per second). Only available on **iOS**.                  | 0.0.1 |
| **`averageActivePace`** | <code>number</code> | The average active pace (in seconds per meter). Only available on **iOS**.          | 0.0.1 |
| **`startDate`**         | <code>number</code> | The start time of this measurement (milliseconds since epoch).                      | 0.0.1 |
| **`endDate`**           | <code>number</code> | The end time of this measurement (milliseconds since epoch).                        | 0.0.1 |


#### GetMeasurementOptions

| Prop        | Type                | Description                                                                               | Since |
| ----------- | ------------------- | ----------------------------------------------------------------------------------------- | ----- |
| **`start`** | <code>number</code> | The start time for the measurement query (milliseconds since epoch). Required on **iOS**. | 0.0.1 |
| **`end`**   | <code>number</code> | The end time for the measurement query (milliseconds since epoch). Required on **iOS**.   | 0.0.1 |


#### IsAvailableResult

| Prop                | Type                 | Description                                                                                               | Since |
| ------------------- | -------------------- | --------------------------------------------------------------------------------------------------------- | ----- |
| **`stepCounting`**  | <code>boolean</code> | Whether step counting is available.                                                                       | 0.0.1 |
| **`distance`**      | <code>boolean</code> | Whether distance measurement is available. Only `true` on **iOS** devices that support distance tracking. | 0.0.1 |
| **`pace`**          | <code>boolean</code> | Whether pace measurement is available. Only `true` on **iOS** devices that support pace tracking.         | 0.0.1 |
| **`cadence`**       | <code>boolean</code> | Whether cadence measurement is available. Only `true` on **iOS** devices that support cadence tracking.   | 0.0.1 |
| **`floorCounting`** | <code>boolean</code> | Whether floor counting is available. Only `true` on **iOS** devices that support floor tracking.          | 0.0.1 |


#### PermissionStatus

| Prop                      | Type                                                                      | Description                                                                                                                                                | Since |
| ------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`activityRecognition`** | <code>'prompt' \| 'prompt-with-rationale' \| 'granted' \| 'denied'</code> | Permission state for activity recognition. On **Android**, this is the `ACTIVITY_RECOGNITION` permission. On **iOS**, this is the motion usage permission. | 0.0.1 |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### Type Aliases


#### MeasurementEvent

<code><a href="#measurement">Measurement</a></code>

</docgen-api>

## Usage

```typescript
import { CapacitorPedometer } from '@capgo/capacitor-pedometer';

// Check availability
const availability = await CapacitorPedometer.isAvailable();
console.log('Features available:', availability);

// Check and request permissions
const permission = await CapacitorPedometer.checkPermissions();
if (permission.activityRecognition !== 'granted') {
  await CapacitorPedometer.requestPermissions();
}

// Start real-time updates
await CapacitorPedometer.addListener('measurement', (data) => {
  console.log('Steps:', data.numberOfSteps);
  console.log('Distance:', data.distance);
});

await CapacitorPedometer.startMeasurementUpdates();

// Query historical data (iOS only - requires start and end timestamps)
const now = Date.now();
const yesterday = now - (24 * 60 * 60 * 1000);
const measurement = await CapacitorPedometer.getMeasurement({
  start: yesterday,
  end: now
});

// Stop updates
await CapacitorPedometer.stopMeasurementUpdates();
await CapacitorPedometer.removeAllListeners();
```

## Platform Support

| Feature | Android | iOS |
|---------|---------|-----|
| Step Counting | ✅ | ✅ |
| Distance | ❌ | ✅ |
| Pace | ❌ | ✅ |
| Cadence | ❌ | ✅ |
| Floor Counting | ❌ | ✅ |
| Historical Queries | ❌ | ✅ |

## Notes

- On **Android**, only step counting is available. The plugin uses the `TYPE_STEP_COUNTER` sensor.
- On **iOS**, all features are available on supported devices using `CMPedometer`.
- Historical data queries require explicit `start` and `end` timestamps on iOS.
- Android's step counter gives cumulative steps since last device reboot; the plugin tracks the delta.
- Measurements are paused when the app is in the background.

## License

MIT
