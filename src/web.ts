import { WebPlugin } from '@capacitor/core';

import type {
  CapacitorPedometerPlugin,
  GetMeasurementOptions,
  IsAvailableResult,
  Measurement,
  PermissionStatus,
} from './definitions';

export class CapacitorPedometerWeb extends WebPlugin implements CapacitorPedometerPlugin {
  async getMeasurement(_options?: GetMeasurementOptions): Promise<Measurement> {
    throw this.unimplemented('Not implemented on web.');
  }

  async isAvailable(): Promise<IsAvailableResult> {
    return {
      stepCounting: false,
      distance: false,
      pace: false,
      cadence: false,
      floorCounting: false,
    };
  }

  async startMeasurementUpdates(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async stopMeasurementUpdates(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }

  async checkPermissions(): Promise<PermissionStatus> {
    throw this.unimplemented('Not implemented on web.');
  }

  async requestPermissions(): Promise<PermissionStatus> {
    throw this.unimplemented('Not implemented on web.');
  }
  async getPluginVersion(): Promise<{ version: string }> {
    return { version: 'web' };
  }
}
