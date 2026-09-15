import SwiftUI

struct HistoryView: View {
    @Environment(HistoryStore.self) private var history
    @Environment(PartRepository.self) private var repo
    var body: some View {
        NavigationStack { List(Array(history.inMemory.enumerated()), id:\.offset) { _, item in if let part = repo.part(id: item.0) { VStack(alignment:.trailing){ Text(part.nameFa).bold(); Text(item.1.formatted()).font(.caption).foregroundStyle(.secondary) }.frame(maxWidth:.infinity,alignment:.trailing) } }.scrollContentBackground(.hidden).background(Theme.background).navigationTitle("تاریخچه شناسایی") }
    }
}
