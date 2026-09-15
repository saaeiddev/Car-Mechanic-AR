import SwiftUI
import AVFoundation

struct ScanInstructionCard: View {
    let status: String
    @State private var pulse = false
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "viewfinder").font(.title2).foregroundStyle(Theme.cyan).scaleEffect(pulse ? 1.08 : 0.92)
            VStack(alignment: .trailing, spacing: 3) {
                Text("دوربین را روی قطعه بگیرید").font(.subheadline.bold())
                Text(status).font(.caption).foregroundStyle(.secondary)
            }
        }
        .padding(.horizontal, 18).padding(.vertical, 12)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Theme.cyan.opacity(0.45)))
        .onAppear { withAnimation(.easeInOut(duration: 1).repeatForever(autoreverses: true)) { pulse = true } }
    }
}

struct SelectedPartSheet: View {
    let part: CarPart
    let more: () -> Void
    let threeD: () -> Void
    var body: some View {
        VStack(alignment: .trailing, spacing: 12) {
            HStack { Text(part.nameEn).font(.caption).foregroundStyle(.secondary); Spacer(); Text(part.nameFa).font(.title2.bold()); Image(systemName: "engine.combustion") .foregroundStyle(Theme.cyan) }
            Text(part.shortDescription).font(.subheadline).multilineTextAlignment(.trailing)
            HStack(spacing: 10) {
                Button("اطلاعات بیشتر", action: more).buttonStyle(GlassButtonStyle())
                Button("مشاهده سه‌بعدی", action: threeD).buttonStyle(GlassButtonStyle())
                Button("ویدئوی آموزشی") { }.buttonStyle(GlassButtonStyle())
            }.font(.caption)
        }
        .padding(16)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 24).stroke(Theme.cyan.opacity(0.35)))
        .shadow(color: .black.opacity(0.35), radius: 24)
    }
}

struct CameraPermissionView: View {
    @Binding var permission: AVAuthorizationStatus
    var body: some View {
        ZStack {
            LinearGradient(colors: [.black, Color(red: 0.02, green: 0.10, blue: 0.14)], startPoint: .top, endPoint: .bottom).ignoresSafeArea()
            VStack(spacing: 18) {
                Image(systemName: "camera.viewfinder").font(.system(size: 56)).foregroundStyle(Theme.cyan)
                Text("دسترسی به دوربین").font(.title2.bold())
                Text("برای شناسایی قطعات خودرو، برنامه به دسترسی دوربین نیاز دارد.").multilineTextAlignment(.center).foregroundStyle(.secondary)
                Button("اجازه دسترسی به دوربین") {
                    Task { let granted = await AVCaptureDevice.requestAccess(for: .video); permission = granted ? .authorized : .denied }
                }.buttonStyle(GlassButtonStyle())
                if permission == .denied { Text("دسترسی دوربین رد شده است. آن را از Settings فعال کنید.").font(.caption).foregroundStyle(.orange) }
            }.padding(28)
        }
    }
}
