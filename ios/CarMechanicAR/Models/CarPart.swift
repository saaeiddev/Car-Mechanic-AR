import Foundation

struct CarPart: Identifiable, Hashable, Codable {
    let id: String
    let nameFa: String
    let nameEn: String
    let category: String
    let shortDescription: String
    let fullDescription: String
    let function: String
    let location: String
    let commonSymptoms: [String]
    let maintenanceTips: [String]
    let difficultyLevel: String
    let safetyWarning: String?
    let imageName: String
    let model3DName: String
    let videoURL: URL?
    let relatedParts: [String]
}

struct DetectedCarPart: Identifiable, Hashable {
    let id = UUID()
    let partID: String
    /// Vision normalized coordinate system, origin at lower-left.
    let boundingBox: CGRect
    let confidence: Float
    let timestamp: Date
}
