import SwiftUI

struct QuizView: View {
    @Environment(PartRepository.self) private var repo
    @State private var index = 0
    @State private var score = 0
    @State private var feedback = ""
    var parts: [CarPart] { Array(repo.all.prefix(8)) }
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                ProgressView(value: Double(index), total: Double(max(parts.count,1))).tint(Theme.cyan)
                if !parts.isEmpty {
                    let target = parts[index % parts.count]
                    Image(systemName:"questionmark.square.dashed").font(.system(size:88)).foregroundStyle(Theme.cyan)
                    Text("این قطعه چیست؟").font(.title2.bold())
                    ForEach(Array(parts.shuffled().prefix(4))) { option in Button(option.nameFa) { if option.id == target.id { score += 1; feedback = "درست ✅" } else { feedback = "پاسخ درست: \(target.nameFa)" }; index = (index + 1) % parts.count }.buttonStyle(GlassButtonStyle()) }
                    Text(feedback).foregroundStyle(.secondary)
                    Text("امتیاز: \(score)").bold()
                }
                Spacer()
            }.padding().background(Theme.background.ignoresSafeArea()).navigationTitle("آزمون")
        }
    }
}
