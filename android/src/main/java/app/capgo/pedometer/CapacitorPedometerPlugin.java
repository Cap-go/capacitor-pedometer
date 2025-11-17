package app.capgo.pedometer;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import androidx.annotation.Nullable;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "CapacitorPedometer",
    permissions = { @Permission(strings = { Manifest.permission.ACTIVITY_RECOGNITION }, alias = "activityRecognition") }
)
public class CapacitorPedometerPlugin extends Plugin implements SensorEventListener {

    private final String pluginVersion = "7.2.3";
    private static final String PERMISSION_GRANTED = "granted";
    private static final String PERMISSION_DENIED = "denied";
    private static final String PERMISSION_PROMPT = "prompt";
    private static final String PERMISSION_PROMPT_WITH_RATIONALE = "prompt-with-rationale";

    @Nullable
    private SensorManager sensorManager;

    @Nullable
    private Sensor stepCounter;

    private int initialStepCount = -1;
    private int currentStepCount = 0;
    private long measurementStartTime = 0;

    private boolean updatesActive = false;

    @Override
    public void load() {
        Context context = getContext();
        sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            stepCounter = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        }
    }

    @PluginMethod
    public void getMeasurement(PluginCall call) {
        if (stepCounter == null) {
            call.reject("Step counter sensor not available on this device.");
            return;
        }

        if (!hasActivityRecognitionPermission()) {
            call.reject("Activity recognition permission not granted.");
            return;
        }

        JSObject result = createMeasurementObject();
        call.resolve(result);
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject result = new JSObject();
        result.put("stepCounting", stepCounter != null);
        // Android doesn't support these advanced features
        result.put("distance", false);
        result.put("pace", false);
        result.put("cadence", false);
        result.put("floorCounting", false);
        call.resolve(result);
    }

    @PluginMethod
    public void startMeasurementUpdates(PluginCall call) {
        if (stepCounter == null) {
            call.reject("Step counter sensor not available on this device.");
            return;
        }

        if (!hasActivityRecognitionPermission()) {
            call.reject("Activity recognition permission not granted.");
            return;
        }

        if (updatesActive) {
            call.resolve();
            return;
        }

        measurementStartTime = System.currentTimeMillis();
        initialStepCount = -1;

        if (sensorManager != null && sensorManager.registerListener(this, stepCounter, SensorManager.SENSOR_DELAY_UI)) {
            updatesActive = true;
            call.resolve();
        } else {
            call.reject("Failed to register step counter listener.");
        }
    }

    @PluginMethod
    public void stopMeasurementUpdates(PluginCall call) {
        if (sensorManager != null && updatesActive) {
            sensorManager.unregisterListener(this);
            updatesActive = false;
            initialStepCount = -1;
            currentStepCount = 0;
        }
        call.resolve();
    }

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        JSObject result = new JSObject();
        result.put("activityRecognition", getPermissionState());
        call.resolve(result);
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (getPermissionState(Manifest.permission.ACTIVITY_RECOGNITION) != PermissionState.GRANTED) {
                requestPermissionForAlias("activityRecognition", call, "permissionCallback");
            } else {
                JSObject result = new JSObject();
                result.put("activityRecognition", PERMISSION_GRANTED);
                call.resolve(result);
            }
        } else {
            // No permission needed on older Android versions
            JSObject result = new JSObject();
            result.put("activityRecognition", PERMISSION_GRANTED);
            call.resolve(result);
        }
    }

    @PermissionCallback
    private void permissionCallback(PluginCall call) {
        JSObject result = new JSObject();
        result.put("activityRecognition", getPermissionState());
        call.resolve(result);
    }

    @PluginMethod
    public void removeAllListeners(PluginCall call) {
        super.removeAllListeners(call);
    }

    @Override
    public void handleOnPause() {
        if (sensorManager != null && updatesActive) {
            sensorManager.unregisterListener(this);
        }
        super.handleOnPause();
    }

    @Override
    public void handleOnResume() {
        super.handleOnResume();
        if (updatesActive && sensorManager != null && stepCounter != null && hasActivityRecognitionPermission()) {
            sensorManager.registerListener(this, stepCounter, SensorManager.SENSOR_DELAY_UI);
        }
    }

    @Override
    public void handleOnDestroy() {
        if (sensorManager != null) {
            sensorManager.unregisterListener(this);
        }
        super.handleOnDestroy();
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != Sensor.TYPE_STEP_COUNTER) {
            return;
        }

        int totalSteps = (int) event.values[0];

        if (initialStepCount == -1) {
            initialStepCount = totalSteps;
            currentStepCount = 0;
        } else {
            currentStepCount = totalSteps - initialStepCount;
        }

        JSObject payload = createMeasurementObject();
        notifyListeners("measurement", payload);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // No-op
    }

    private JSObject createMeasurementObject() {
        JSObject measurement = new JSObject();
        measurement.put("numberOfSteps", currentStepCount);
        measurement.put("startDate", measurementStartTime);
        measurement.put("endDate", System.currentTimeMillis());
        return measurement;
    }

    private boolean hasActivityRecognitionPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            return getPermissionState(Manifest.permission.ACTIVITY_RECOGNITION) == PermissionState.GRANTED;
        }
        return true; // No permission needed on older Android versions
    }

    private String getPermissionState() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            PermissionState state = getPermissionState(Manifest.permission.ACTIVITY_RECOGNITION);
            switch (state) {
                case GRANTED:
                    return PERMISSION_GRANTED;
                case DENIED:
                    return PERMISSION_DENIED;
                default:
                    return PERMISSION_PROMPT;
            }
        }
        return PERMISSION_GRANTED; // No permission needed on older Android versions
    }

    @PluginMethod
    public void getPluginVersion(final PluginCall call) {
        try {
            final JSObject ret = new JSObject();
            ret.put("version", this.pluginVersion);
            call.resolve(ret);
        } catch (final Exception e) {
            call.reject("Could not get plugin version", e);
        }
    }
}
