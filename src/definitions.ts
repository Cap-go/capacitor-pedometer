import type { PluginListenerHandle } from '@capacitor/core';

export interface CapacitorPedometerPlugin {
  /**
   * Get pedometer measurements for a specified time range.
   *
   * @since 0.0.1
   */
  getMeasurement(options?: GetMeasurementOptions): Promise<Measurement>;

  /**
   * Check which pedometer features are available on this device.
   *
   * @since 0.0.1
   */
  isAvailable(): Promise<IsAvailableResult>;

  /**
   * Start receiving real-time pedometer measurement updates.
   *
   * On **Android** and **iOS**, the `measurement` event is only fired after calling `startMeasurementUpdates()`.
   *
   * @since 0.0.1
   */
  startMeasurementUpdates(): Promise<void>;

  /**
   * Stop receiving real-time pedometer measurement updates.
   *
   * @since 0.0.1
   */
  stopMeasurementUpdates(): Promise<void>;

  /**
   * Check permission to access pedometer data.
   *
   * On **Android**, this checks the `ACTIVITY_RECOGNITION` permission.
   * On **iOS**, this checks the motion usage permission.
   *
   * @since 0.0.1
   */
  checkPermissions(): Promise<PermissionStatus>;

  /**
   * Request permission to access pedometer data.
   *
   * On **Android**, this requests the `ACTIVITY_RECOGNITION` permission.
   * On **iOS**, this requests motion usage permission.
   *
   * @since 0.0.1
   */
  requestPermissions(): Promise<PermissionStatus>;

  /**
   * Called when a new pedometer measurement is received.
   *
   * @since 0.0.1
   */
  addListener(eventName: 'measurement', listenerFunc: (event: MeasurementEvent) => void): Promise<PluginListenerHandle>;

  /**
   * Remove all listeners for this plugin.
   *
   * @since 0.0.1
   */
  removeAllListeners(): Promise<void>;
}

/**
 * @since 0.0.1
 */
export interface Measurement {
  /**
   * The number of steps taken by the user.
   *
   * @since 0.0.1
   */
  numberOfSteps?: number;

  /**
   * The estimated distance (in meters) traveled by the user.
   *
   * Only available on **iOS**.
   *
   * @since 0.0.1
   */
  distance?: number;

  /**
   * The approximate number of floors ascended.
   *
   * Only available on **iOS**.
   *
   * @since 0.0.1
   */
  floorsAscended?: number;

  /**
   * The approximate number of floors descended.
   *
   * Only available on **iOS**.
   *
   * @since 0.0.1
   */
  floorsDescended?: number;

  /**
   * The current pace (in seconds per meter).
   *
   * Only available on **iOS**.
   *
   * @since 0.0.1
   */
  currentPace?: number;

  /**
   * The current cadence (steps per second).
   *
   * Only available on **iOS**.
   *
   * @since 0.0.1
   */
  currentCadence?: number;

  /**
   * The average active pace (in seconds per meter).
   *
   * Only available on **iOS**.
   *
   * @since 0.0.1
   */
  averageActivePace?: number;

  /**
   * The start time of this measurement (milliseconds since epoch).
   *
   * @since 0.0.1
   */
  startDate?: number;

  /**
   * The end time of this measurement (milliseconds since epoch).
   *
   * @since 0.0.1
   */
  endDate?: number;
}

/**
 * @since 0.0.1
 */
export interface GetMeasurementOptions {
  /**
   * The start time for the measurement query (milliseconds since epoch).
   *
   * Required on **iOS**.
   *
   * @since 0.0.1
   */
  start?: number;

  /**
   * The end time for the measurement query (milliseconds since epoch).
   *
   * Required on **iOS**.
   *
   * @since 0.0.1
   */
  end?: number;
}

/**
 * @since 0.0.1
 */
export interface IsAvailableResult {
  /**
   * Whether step counting is available.
   *
   * @since 0.0.1
   */
  stepCounting: boolean;

  /**
   * Whether distance measurement is available.
   *
   * Only `true` on **iOS** devices that support distance tracking.
   *
   * @since 0.0.1
   */
  distance: boolean;

  /**
   * Whether pace measurement is available.
   *
   * Only `true` on **iOS** devices that support pace tracking.
   *
   * @since 0.0.1
   */
  pace: boolean;

  /**
   * Whether cadence measurement is available.
   *
   * Only `true` on **iOS** devices that support cadence tracking.
   *
   * @since 0.0.1
   */
  cadence: boolean;

  /**
   * Whether floor counting is available.
   *
   * Only `true` on **iOS** devices that support floor tracking.
   *
   * @since 0.0.1
   */
  floorCounting: boolean;
}

/**
 * @since 0.0.1
 */
export interface PermissionStatus {
  /**
   * Permission state for activity recognition.
   *
   * On **Android**, this is the `ACTIVITY_RECOGNITION` permission.
   * On **iOS**, this is the motion usage permission.
   *
   * @since 0.0.1
   */
  activityRecognition: 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied';
}

/**
 * @since 0.0.1
 */
export type MeasurementEvent = Measurement;
