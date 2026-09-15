import Foundation
import SwiftData

@Model
final class HistoryRecord {
    var partID: String
    var date: Date
    var vehicleNote: String
    var thumbnailData: Data?

    init(partID: String, date: Date = .now, vehicleNote: String = "", thumbnailData: Data? = nil) {
        self.partID = partID
        self.date = date
        self.vehicleNote = vehicleNote
        self.thumbnailData = thumbnailData
    }
}

@Model
final class FavoriteRecord {
    @Attribute(.unique) var partID: String
    init(partID: String) { self.partID = partID }
}
