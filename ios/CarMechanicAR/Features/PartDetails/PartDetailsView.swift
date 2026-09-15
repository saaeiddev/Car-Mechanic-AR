import SwiftUI

struct PartDetailsView: View {
    let part: CarPart
    @Environment(FavoritesStore.self) private var favorites
    @State private var show3D = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .trailing, spacing: 16) {
                    HStack { Text(part.nameEn).foregroundStyle(.secondary); Spacer(); VStack(alignment: .trailing) { Text(part.nameFa).font(.largeTitle.bold()); Text(part.category).foregroundStyle(Theme.cyan) } }
                    Text(part.fullDescription).detailCard(title: "معرفی")
                    Text(part.function).detailCard(title: "وظیفه")
                    Text(part.location).detailCard(title: "محل قرارگیری")
                    ListCard(title: "نشانه‌های خرابی", items: part.commonSymptoms)
                    ListCard(title: "نکات نگهداری", items: part.maintenanceTips)
                    if let warning = part.safetyWarning { Text(warning).detailCard(title: "نکات ایمنی", warning: true) }
                    Button { show3D = true } label: { Label("مشاهده سه‌بعدی", systemImage: "cube.transparent") }.buttonStyle(GlassButtonStyle())
                }.padding()
            }
            .background(Theme.background.ignoresSafeArea())
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) { Button { favorites.toggle(part.id) } label: { Image(systemName: favorites.contains(part.id) ? "heart.fill" : "heart") } }
            }
            .sheet(isPresented: $show3D) { ThreeDViewerView(part: part) }
        }
        .environment(\.layoutDirection, .rightToLeft)
    }
}

private struct ListCard: View {
    let title: String; let items: [String]
    var body: some View { if !items.isEmpty { VStack(alignment: .trailing, spacing: 8) { Text(title).font(.headline); ForEach(items, id: \.self) { Text("• \($0)") } }.frame(maxWidth: .infinity, alignment: .trailing).padding().glassCard() } }
}

private extension View {
    func detailCard(title: String, warning: Bool = false) -> some View { VStack(alignment: .trailing, spacing: 8) { Text(title).font(.headline).foregroundStyle(warning ? .orange : Theme.cyan); self }.frame(maxWidth: .infinity, alignment: .trailing).padding().glassCard() }
}
