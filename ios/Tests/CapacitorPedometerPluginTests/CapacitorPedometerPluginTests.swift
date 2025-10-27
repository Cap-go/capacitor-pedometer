import XCTest
@testable import CapacitorPedometerPlugin

class CapacitorPedometerPluginTests: XCTestCase {
    func testBasicInitialization() {
        let plugin = CapacitorPedometerPlugin()
        XCTAssertNotNil(plugin)
    }
}
