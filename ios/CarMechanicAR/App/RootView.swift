import SwiftUI

struct RootView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        ZStack(alignment: .trailing) {
            Group {
                switch appState.selectedTab {
                case .scanner: ARScannerView()
                case .learning: LearningView()
                case .models: ExploreModelsView()
                case .quiz: QuizView()
                case .history: HistoryView()
                case .favorites: FavoritesView()
                case .settings: SettingsView()
                }
            }
            .ignoresSafeArea(edges: appState.selectedTab == .scanner ? .all : [])

            if appState.showMenu {
                Color.black.opacity(0.35).ignoresSafeArea().onTapGesture { withAnimation { appState.showMenu = false } }
                SideMenuView()
                    .transition(.move(edge: .trailing).combined(with: .opacity))
            }
        }
        .animation(.spring(response: 0.34, dampingFraction: 0.86), value: appState.showMenu)
        .preferredColorScheme(.dark)
    }
}
