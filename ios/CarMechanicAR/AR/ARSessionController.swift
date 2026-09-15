import ARKit
import RealityKit
import SwiftUI

@MainActor
final class ARSessionController: NSObject, ObservableObject, ARSessionDelegate {
    @Published var detections: [TrackedDetection] = []
    @Published var statusText = "در حال آماده‌سازی واقعیت افزوده…"
    @Published var guidanceText: String?
    @Published var selectedPartID: String?

    let arView = ARView(frame: .zero)
    private var detector: CarPartDetectionService
    private var lastInference = Date.distantPast
    private var isInferencing = false
    private let inferenceInterval: TimeInterval = 0.16 // ~6 fps ML while render remains native frame rate
    private var tracks: [String: TrackedDetection] = [:]

    init(mode: DetectionMode = .demo) {
        detector = mode == .demo ? DemoCarPartDetector() : CoreMLCarPartDetector()
        super.init()
        arView.session.delegate = self
        arView.renderOptions = [.disableMotionBlur]
    }

    func start() {
        guard ARWorldTrackingConfiguration.isSupported else {
            statusText = "این دستگاه از ARKit پشتیبانی نمی‌کند"
            return
        }
        let config = ARWorldTrackingConfiguration()
        config.worldAlignment = .gravity
        config.environmentTexturing = .automatic
        config.frameSemantics = []
        arView.session.run(config, options: [.resetTracking, .removeExistingAnchors])
        statusText = "AR فعال"
    }

    func pause() { arView.session.pause() }

    func setDetectionMode(_ mode: DetectionMode) {
        detector = mode == .demo ? DemoCarPartDetector() : CoreMLCarPartDetector()
    }

    nonisolated func session(_ session: ARSession, didUpdate frame: ARFrame) {
        Task { @MainActor in
            guard !isInferencing, Date().timeIntervalSince(lastInference) >= inferenceInterval else { return }
            isInferencing = true
            lastInference = .now
            let buffer = frame.capturedImage
            do {
                let results = try await detector.detect(in: buffer)
                updateTracks(with: results, frame: frame)
                statusText = results.isEmpty ? "در حال شناسایی…" : "قطعه شناسایی شد"
            } catch {
                statusText = "مدل تشخیص آماده نیست — حالت Demo را فعال کنید"
            }
            isInferencing = false
        }
    }

    private func updateTracks(with detections: [DetectedCarPart], frame: ARFrame) {
        let now = Date()
        for detection in detections where detection.confidence >= 0.60 {
            var tracked = tracks[detection.partID] ?? TrackedDetection(partID: detection.partID, boundingBox: detection.boundingBox, confidence: detection.confidence, lastSeen: now, worldTransform: nil)
            tracked.boundingBox = smooth(old: tracked.boundingBox, new: detection.boundingBox)
            tracked.confidence = detection.confidence
            tracked.lastSeen = now
            let center = CGPoint(x: tracked.boundingBox.midX, y: 1 - tracked.boundingBox.midY)
            let screen = CGPoint(x: center.x * arView.bounds.width, y: center.y * arView.bounds.height)
            if let ray = arView.ray(through: screen) {
                let distance: Float = 0.85
                let position = ray.origin + ray.direction * distance
                var t = matrix_identity_float4x4
                t.columns.3 = SIMD4(position.x, position.y, position.z, 1)
                tracked.worldTransform = t
            }
            tracks[detection.partID] = tracked
        }
        tracks = tracks.filter { now.timeIntervalSince($0.value.lastSeen) < 1.15 }
        self.detections = Array(tracks.values).sorted { $0.confidence > $1.confidence }
        guidanceText = detections.isEmpty ? "زاویه دوربین را تغییر دهید." : nil
    }

    private func smooth(old: CGRect, new: CGRect) -> CGRect {
        let a = 0.34
        return CGRect(x: old.origin.x * (1-a) + new.origin.x * a,
                      y: old.origin.y * (1-a) + new.origin.y * a,
                      width: old.width * (1-a) + new.width * a,
                      height: old.height * (1-a) + new.height * a)
    }
}

struct TrackedDetection: Identifiable, Hashable {
    var id: String { partID }
    let partID: String
    var boundingBox: CGRect
    var confidence: Float
    var lastSeen: Date
    var worldTransform: simd_float4x4?

    static func == (lhs: Self, rhs: Self) -> Bool { lhs.partID == rhs.partID && lhs.boundingBox == rhs.boundingBox }
    func hash(into hasher: inout Hasher) { hasher.combine(partID) }
}
