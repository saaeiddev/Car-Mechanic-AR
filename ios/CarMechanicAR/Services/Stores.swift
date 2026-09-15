import Foundation
import Observation

@Observable
final class HistoryStore {
    static let shared = HistoryStore()
    private(set) var inMemory: [(String, Date)] = []
    func add(partID: String) { inMemory.insert((partID, .now), at: 0) }
}

@Observable
final class FavoritesStore {
    static let shared = FavoritesStore()
    private(set) var ids: Set<String> = []
    func toggle(_ id: String) { if ids.contains(id) { ids.remove(id) } else { ids.insert(id) } }
    func contains(_ id: String) -> Bool { ids.contains(id) }
}

@Observable
final class PreferencesStore {
    static let shared = PreferencesStore()
    var soundEnabled = true
    var hapticsEnabled = true
    var showEnglishNames = true
    var detectionMode: DetectionMode = .demo
    var arQuality = "بالا"
}
