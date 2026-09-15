import CoreVideo
import Foundation

actor DemoCarPartDetector: CarPartDetectionService {
    private var tick = 0
    private let ids = ["engine", "battery", "air_filter", "radiator", "spark_plug", "brake_disc"]

    func detect(in pixelBuffer: CVPixelBuffer) async throws -> [DetectedCarPart] {
        tick += 1
        // Explicit demo detections: deterministic sample boxes so the complete AR UI can be tested
        // before a trained automotive detector is added.
        let boxes: [CGRect] = [
            CGRect(x: 0.31, y: 0.36, width: 0.38, height: 0.27),
            CGRect(x: 0.73, y: 0.47, width: 0.16, height: 0.13),
            CGRect(x: 0.09, y: 0.48, width: 0.17, height: 0.13),
            CGRect(x: 0.38, y: 0.10, width: 0.38, height: 0.18),
            CGRect(x: 0.63, y: 0.34, width: 0.10, height: 0.08),
            CGRect(x: 0.06, y: 0.13, width: 0.14, height: 0.17)
        ]
        return zip(ids, boxes).enumerated().map { index, pair in
            DetectedCarPart(partID: pair.0, boundingBox: pair.1, confidence: 0.95 - Float(index) * 0.025, timestamp: .now)
        }
    }
}
