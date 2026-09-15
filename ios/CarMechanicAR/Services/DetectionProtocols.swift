import CoreVideo
import Foundation

protocol CarPartDetectionService: Sendable {
    func detect(in pixelBuffer: CVPixelBuffer) async throws -> [DetectedCarPart]
}

enum DetectionMode: String, CaseIterable, Identifiable {
    case demo, production
    var id: String { rawValue }
}

protocol CarPartRepositoryProtocol {
    func part(id: String) -> CarPart?
    func search(_ query: String) -> [CarPart]
    var all: [CarPart] { get }
}
