import SwiftUI

struct FavoritesView: View {
    @Environment(FavoritesStore.self) private var favorites
    @Environment(PartRepository.self) private var repo
    var body: some View { NavigationStack { List(repo.all.filter { favorites.contains($0.id) }) { part in NavigationLink { PartDetailsView(part: part) } label: { Text(part.nameFa) } }.scrollContentBackground(.hidden).background(Theme.background).navigationTitle("علاقه‌مندی‌ها") } }
}
