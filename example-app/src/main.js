import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';
import './style.css';
import { CapacitorPedometer } from '@capgo/capacitor-pedometer';

const measurementLabel = document.getElementById('measurement');
const availabilityLabel = document.getElementById('availability');
const permissionLabel = document.getElementById('permission');
const startButton = document.getElementById('start-updates');
const stopButton = document.getElementById('stop-updates');
const singleReadButton = document.getElementById('read-once');

let measurementListener;

function formatMeasurement(measurement) {
  const parts = [];

  if (measurement.numberOfSteps !== undefined) {
    parts.push(`Steps: ${measurement.numberOfSteps}`);
  }

  if (measurement.distance !== undefined) {
    parts.push(`Distance: ${(measurement.distance / 1000).toFixed(2)} km`);
  }

  if (measurement.floorsAscended !== undefined) {
    parts.push(`Floors Up: ${measurement.floorsAscended}`);
  }

  if (measurement.floorsDescended !== undefined) {
    parts.push(`Floors Down: ${measurement.floorsDescended}`);
  }

  if (measurement.currentPace !== undefined) {
    parts.push(`Pace: ${measurement.currentPace.toFixed(2)} s/m`);
  }

  if (measurement.currentCadence !== undefined) {
    parts.push(`Cadence: ${(measurement.currentCadence * 60).toFixed(0)} steps/min`);
  }

  if (measurement.averageActivePace !== undefined) {
    parts.push(`Avg Pace: ${measurement.averageActivePace.toFixed(2)} s/m`);
  }

  return parts.join(' | ');
}

async function refreshAvailability() {
  const availability = await CapacitorPedometer.isAvailable();
  const features = [];
  if (availability.stepCounting) features.push('Steps');
  if (availability.distance) features.push('Distance');
  if (availability.pace) features.push('Pace');
  if (availability.cadence) features.push('Cadence');
  if (availability.floorCounting) features.push('Floors');

  availabilityLabel.textContent = features.length > 0 ? features.join(', ') : 'None available';
}

async function refreshPermission() {
  const { activityRecognition } = await CapacitorPedometer.checkPermissions();
  permissionLabel.textContent = activityRecognition;
}

async function ensurePermission() {
  const { activityRecognition } = await CapacitorPedometer.requestPermissions();
  permissionLabel.textContent = activityRecognition;
  if (activityRecognition !== 'granted') {
    throw new Error(`Permission not granted: ${activityRecognition}`);
  }
}

async function readOnce() {
  try {
    await ensurePermission();

    // Query last 24 hours
    const end = Date.now();
    const start = end - 24 * 60 * 60 * 1000;

    const measurement = await CapacitorPedometer.getMeasurement({ start, end });
    measurementLabel.textContent = formatMeasurement(measurement) || 'No data available';
  } catch (error) {
    measurementLabel.textContent = error.message;
  }
}

async function startUpdates() {
  try {
    await ensurePermission();
    if (!measurementListener) {
      measurementListener = await CapacitorPedometer.addListener('measurement', (event) => {
        measurementLabel.textContent = formatMeasurement(event) || 'No data yet';
      });
    }
    await CapacitorPedometer.startMeasurementUpdates();
    startButton.disabled = true;
    stopButton.disabled = false;
    singleReadButton.disabled = true;
  } catch (error) {
    measurementLabel.textContent = error.message;
  }
}

async function stopUpdates() {
  await CapacitorPedometer.stopMeasurementUpdates();
  if (measurementListener) {
    await measurementListener.remove();
    measurementListener = undefined;
  }
  startButton.disabled = false;
  stopButton.disabled = true;
  singleReadButton.disabled = false;
}

startButton.addEventListener('click', startUpdates);
stopButton.addEventListener('click', stopUpdates);
singleReadButton.addEventListener('click', readOnce);

refreshAvailability();
refreshPermission();

if (Capacitor.isNativePlatform()) {
  CapacitorUpdater.notifyAppReady().catch((error) => {
    console.error('Capgo notifyAppReady failed', error);
  });
}
