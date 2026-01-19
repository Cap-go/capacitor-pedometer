// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoCapacitorPedometer",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapgoCapacitorPedometer",
            targets: ["CapacitorPedometerPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.1")
    ],
    targets: [
        .target(
            name: "CapacitorPedometerPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/CapacitorPedometerPlugin"),
        .testTarget(
            name: "CapacitorPedometerPluginTests",
            dependencies: ["CapacitorPedometerPlugin"],
            path: "ios/Tests/CapacitorPedometerPluginTests")
    ]
)
