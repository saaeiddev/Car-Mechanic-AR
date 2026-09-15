import SwiftUI

struct ExploreModelsView: View {
    @Environment(PartRepository.self) private var repo
    @State private var query = ""
    var body: some View {
        NavigationStack {
            List(repo.search(query)) { part in NavigationLink { ThreeDViewerView(part: part) } label: { HStack { Image(systemName:"cube.transparent").foregroundStyle(Theme.cyan); Spacer(); VStack(alignment:.trailing){Text(part.nameFa).bold();Text(part.nameEn).font(.caption).foregroundStyle(.secondary)} } } }
            .searchable(text:$query,prompt:"جستجوی قطعه")
            .scrollContentBackground(.hidden).background(Theme.background).navigationTitle("مدل‌های سه‌بعدی")
        }
    }
}
