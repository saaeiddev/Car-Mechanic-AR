import CoreML
import Vision
import CoreVideo

actor CoreMLCarPartDetector: CarPartDetectionService {
    enum DetectorError: Error { case modelMissing, invalidResult }
    private var visionModel: VNCoreMLModel?

    init() {
        if let url = Bundle.main.url(forResource: "CarPartDetector", withExtension: "mlmodelc"),
           let model = try? MLModel(contentsOf: url),
           let vision = try? VNCoreMLModel(for: model) {
            self.visionModel = vision
        }
    }

    func detect(in pixelBuffer: CVPixelBuffer) async throws -> [DetectedCarPart] {
        guard let visionModel else { throw DetectorError.modelMissing }
        return try await withCheckedThrowingContinuation { continuation in
            let request = VNCoreMLRequest(model: visionModel) { request, error in
                if let error { continuation.resume(throwing: error); return }
                let results = (request.results as? [VNRecognizedObjectObservation] ?? []).compactMap { obs -> DetectedCarPart? in
                    guard let top = obs.labels.first, top.confidence >= 0.60 else { return nil }
                    return DetectedCarPart(partID: top.identifier, boundingBox: obs.boundingBox, confidence: top.confidence, timestamp: .now)
                }
                continuation.resume(returning: results)
            }
            request.imageCropAndScaleOption = .scaleFill
            let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .right)
            do { try handler.perform([request]) } catch { continuation.resume(throwing: error) }
        }
    }
}
