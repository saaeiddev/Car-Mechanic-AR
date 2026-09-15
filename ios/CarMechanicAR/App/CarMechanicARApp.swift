import SwiftUI
import SwiftData

@main
struct CarMechanicARApp: App {
    @State private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(appState)
                .environment(PartRepository.shared)
                .environment(HistoryStore.shared)
                .environment(FavoritesStore.shared)
                .environment(PreferencesStore.shared)
                .environment(\.layoutDirection, .rightToLeft)
        }
        .modelContainer(for: [HistoryRecord.self, FavoriteRecord.self])
    }
}

@Observable
final class AppState {
    var selectedTab: MainTab = .scanner
    var showMenu = false
    var selectedPart: CarPart?
}

enum MainTab: String, CaseIterable {
    case scanner, learning, models, quiz, history, favorites, settings
}
