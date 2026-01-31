import Capacitor
import CoreMotion
import Foundation

@objc(CapacitorPedometerPlugin)
public class CapacitorPedometerPlugin: CAPPlugin, CAPBridgedPlugin {
    private let pluginVersion: String = "8.0.13"
    public let identifier = "CapacitorPedometerPlugin"
    public let jsName = "CapacitorPedometer"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getMeasurement", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startMeasurementUpdates", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopMeasurementUpdates", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "checkPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeAllListeners", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPluginVersion", returnType: CAPPluginReturnPromise)
    ]

    private let pedometer = CMPedometer()
    private var latestMeasurement: [String: Any] = [:]

    @objc func getMeasurement(_ call: CAPPluginCall) {
        guard CMPedometer.isStepCountingAvailable() else {
            call.reject("Pedometer not available")
            return
        }

        let start = call.getDouble("start")
        let end = call.getDouble("end")

        guard let startTimestamp = start, let endTimestamp = end else {
            call.reject("Start and end timestamps are required on iOS")
            return
        }

        let startDate = Date(timeIntervalSince1970: startTimestamp / 1000)
        let endDate = Date(timeIntervalSince1970: endTimestamp / 1000)

        pedometer.queryPedometerData(from: startDate, to: endDate) { [weak self] data, error in
            guard let self = self else { return }

            if let error = error {
                call.reject("Failed to query pedometer data: \(error.localizedDescription)")
                return
            }

            guard let data = data else {
                call.reject("No pedometer data available")
                return
            }

            let measurement = self.createMeasurementDict(from: data, startDate: startDate, endDate: endDate)
            call.resolve(measurement)
        }
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        let result: [String: Bool] = [
            "stepCounting": CMPedometer.isStepCountingAvailable(),
            "distance": CMPedometer.isDistanceAvailable(),
            "pace": CMPedometer.isPaceAvailable(),
            "cadence": CMPedometer.isCadenceAvailable(),
            "floorCounting": CMPedometer.isFloorCountingAvailable()
        ]
        call.resolve(result)
    }

    @objc func startMeasurementUpdates(_ call: CAPPluginCall) {
        guard CMPedometer.isStepCountingAvailable() else {
            call.reject("Pedometer not available")
            return
        }

        let startDate = Date()

        pedometer.startUpdates(from: startDate) { [weak self] data, error in
            guard let self = self else { return }

            if let error = error {
                CAPLog.print("CapacitorPedometerPlugin", "Pedometer error: \(error.localizedDescription)")
                return
            }

            guard let data = data else {
                return
            }

            let measurement = self.createMeasurementDict(from: data, startDate: startDate, endDate: Date())
            self.latestMeasurement = measurement

            DispatchQueue.main.async {
                self.notifyListeners("measurement", data: measurement)
            }
        }

        call.resolve()
    }

    @objc func stopMeasurementUpdates(_ call: CAPPluginCall) {
        pedometer.stopUpdates()
        call.resolve()
    }

    @objc override public func checkPermissions(_ call: CAPPluginCall) {
        call.resolve(["activityRecognition": currentPermissionState()])
    }

    @objc override public func requestPermissions(_ call: CAPPluginCall) {
        // On iOS, pedometer permissions are requested automatically when starting updates
        // We trigger a brief query to prompt for permission if needed
        let startDate = Date(timeIntervalSinceNow: -1)
        let endDate = Date()

        pedometer.queryPedometerData(from: startDate, to: endDate) { [weak self] _, _ in
            guard let self = self else { return }
            call.resolve(["activityRecognition": self.currentPermissionState()])
        }
    }

    @objc override public func removeAllListeners(_ call: CAPPluginCall) {
        super.removeAllListeners(call)
    }

    private func currentPermissionState() -> String {
        guard CMPedometer.isStepCountingAvailable() else {
            return "denied"
        }

        switch CMMotionActivityManager.authorizationStatus() {
        case .authorized:
            return "granted"
        case .denied, .restricted:
            return "denied"
        case .notDetermined:
            return "prompt"
        @unknown default:
            return "prompt"
        }
    }

    private func createMeasurementDict(from data: CMPedometerData, startDate: Date, endDate: Date) -> [String: Any] {
        var measurement: [String: Any] = [:]

        measurement["numberOfSteps"] = data.numberOfSteps.intValue

        if let distance = data.distance {
            measurement["distance"] = distance.doubleValue
        }

        if let floorsAscended = data.floorsAscended {
            measurement["floorsAscended"] = floorsAscended.intValue
        }

        if let floorsDescended = data.floorsDescended {
            measurement["floorsDescended"] = floorsDescended.intValue
        }

        if let currentPace = data.currentPace {
            measurement["currentPace"] = currentPace.doubleValue
        }

        if let currentCadence = data.currentCadence {
            measurement["currentCadence"] = currentCadence.doubleValue
        }

        if let averageActivePace = data.averageActivePace {
            measurement["averageActivePace"] = averageActivePace.doubleValue
        }

        measurement["startDate"] = Int(startDate.timeIntervalSince1970 * 1000)
        measurement["endDate"] = Int(endDate.timeIntervalSince1970 * 1000)

        return measurement
    }

    @objc func getPluginVersion(_ call: CAPPluginCall) {
        call.resolve(["version": self.pluginVersion])
    }
}
