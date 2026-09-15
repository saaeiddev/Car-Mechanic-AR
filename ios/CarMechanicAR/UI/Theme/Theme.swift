import SwiftUI

enum Theme {
    static let cyan = Color(red: 0.16, green: 0.82, blue: 1.0)
    static let background = LinearGradient(colors: [Color.black, Color(red: 0.02, green: 0.06, blue: 0.09)], startPoint: .top, endPoint: .bottom)
}

struct GlassButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 12).padding(.vertical, 11)
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 14))
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Theme.cyan.opacity(0.38)))
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
    }
}

extension View {
    func glassCard() -> some View { self.background(.thinMaterial, in: RoundedRectangle(cornerRadius: 20)).overlay(RoundedRectangle(cornerRadius:20).stroke(Color.white.opacity(0.08))) }
    func glassIcon() -> some View { self.frame(minWidth:44,minHeight:44).background(.ultraThinMaterial,in:RoundedRectangle(cornerRadius:14)).overlay(RoundedRectangle(cornerRadius:14).stroke(Color.white.opacity(0.12))).foregroundStyle(.white) }
}
