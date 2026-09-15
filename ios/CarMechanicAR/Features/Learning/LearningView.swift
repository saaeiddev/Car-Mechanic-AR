import SwiftUI

struct LearningView: View {
    @Environment(AppState.self) private var appState
    let categories = ["موتور","سیستم برق","سیستم ترمز","سیستم خنک‌کاری","سیستم سوخت‌رسانی","گیربکس","تعلیق","فرمان","اگزوز"]
    var body: some View {
        NavigationStack {
            ScrollView { LazyVGrid(columns: [.init(.flexible()), .init(.flexible())], spacing: 14) { ForEach(categories, id:\.self) { cat in VStack(spacing:12){ Image(systemName:"graduationcap.fill").font(.title).foregroundStyle(Theme.cyan); Text(cat).bold() }.frame(maxWidth:.infinity,minHeight:120).glassCard() } }.padding() }
            .background(Theme.background.ignoresSafeArea()).navigationTitle("آموزش‌ها")
            .toolbar { ToolbarItem(placement: .topBarTrailing) { Button { appState.showMenu = true } label: { Image(systemName:"line.3.horizontal") } } }
        }
    }
}
