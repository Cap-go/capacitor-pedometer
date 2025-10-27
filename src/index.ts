import { registerPlugin } from '@capacitor/core';

import type { CapacitorPedometerPlugin } from './definitions';

const CapacitorPedometer = registerPlugin<CapacitorPedometerPlugin>('CapacitorPedometer', {
  web: () => import('./web').then((m) => new m.CapacitorPedometerWeb()),
});

export * from './definitions';
export { CapacitorPedometer };
