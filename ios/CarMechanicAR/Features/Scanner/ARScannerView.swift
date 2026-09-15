import SwiftUI
import RealityKit
import AVFoundation

struct ARScannerView: View {
    @Environment(AppState.self) private var appState
    @Environment(PartRepository.self) private var repo
    @Environment(HistoryStore.self) private var history
    @Environment(PreferencesStore.self) private var prefs
    @StateObject private var controller = ARSessionController()
    @State private var permission: AVAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: .video)
    @State private var selectedPart: CarPart?
    @State private var showDetails = false

    var body: some View {
        ZStack {
            if permission == .authorized {
                ARViewContainer(controller: controller).ignoresSafeArea()
                Color.black.opacity(0.05).ignoresSafeArea()
                overlay
            } else {
                CameraPermissionView(permission: $permission)
            }
        }
        .onAppear {
            if permission == .authorized {
                controller.setDetectionMode(prefs.detectionMode)
                controller.start()
            }
        }
        .onDisappear { controller.pause() }
        .onChange(of: prefs.detectionMode) { _, mode in controller.setDetectionMode(mode) }
        .sheet(isPresented: $showDetails) {
            if let selectedPart { PartDetailsView(part: selectedPart) }
        }
    }

    private var overlay: some View {
        GeometryReader { geo in
            ZStack {
                VStack(spacing: 12) {
                    topBar
                    ScanInstructionCard(status: controller.statusText)
                    Spacer()
                    cameraControls
                    bottomModeBar
                }
                .padding(.horizontal, 16)
                .padding(.top, max(8, geo.safeAreaInsets.top + 2))
                .padding(.bottom, max(8, geo.safeAreaInsets.bottom + 4))

                ForEach(controller.detections) { detection in
                    if let part = repo.part(id: detection.partID) {
                        DetectionOverlay(detection: detection, part: part, geometry: geo, isSelected: selectedPart?.id == part.id)
                            .onTapGesture { select(part) }
                    }
                }

                if let selectedPart {
                    VStack { Spacer(); SelectedPartSheet(part: selectedPart, more: { showDetails = true }, threeD: { showDetails = true }) }
                        .padding(.horizontal, 12)
                        .padding(.bottom, 120)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
        }
    }

    private var topBar: some View {
        HStack {
            Button { withAnimation { appState.showMenu = true } } label: { Image(systemName: "line.3.horizontal").font(.title2) }.glassIcon()
            Spacer()
            VStack(spacing: 2) {
                Text("مکانیک با واقعیت افزوده").font(.headline.weight(.bold))
                Text("آموزش • شناسایی • تجربه واقعی").font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
            Label("AR", systemImage: "viewfinder").font(.subheadline.bold()).padding(.horizontal, 12).padding(.vertical, 8).background(.thinMaterial, in: Capsule()).overlay(Capsule().stroke(Theme.cyan.opacity(0.7)))
        }
        .foregroundStyle(.white)
    }

    private var cameraControls: some View {
        HStack {
            Button { } label: { VStack { Image(systemName: "photo"); Text("گالری").font(.caption2) } }.glassIcon()
            Spacer()
            Button { UIImpactFeedbackGenerator(style: .light).impactOccurred() } label: {
                ZStack { Circle().fill(.white).frame(width: 74, height: 74); Circle().stroke(Theme.cyan, lineWidth: 5).frame(width: 86, height: 86) }
            }
            Spacer()
            Button { } label: { VStack { Image(systemName: "book"); Text("آموزش‌ها").font(.caption2) } }.glassIcon()
        }
        .padding(.horizontal, 28)
    }

    private var bottomModeBar: some View {
        HStack { Text("عکس"); Spacer(); Text("تشخیص AR").foregroundStyle(Theme.cyan).bold(); Spacer(); Text("ویدئو") }
            .font(.footnote)
            .padding(.horizontal, 24).padding(.vertical, 10)
            .background(.ultraThinMaterial, in: Capsule())
    }

    private func select(_ part: CarPart) {
        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) { selectedPart = part }
        history.add(partID: part.id)
        if prefs.hapticsEnabled { UINotificationFeedbackGenerator().notificationOccurred(.success) }
    }
}

struct ARViewContainer: UIViewRepresentable {
    let controller: ARSessionController
    func makeUIView(context: Context) -> ARView { controller.arView }
    func updateUIView(_ uiView: ARView, context: Context) {}
}

private struct DetectionOverlay: View {
    let detection: TrackedDetection
    let part: CarPart
    let geometry: GeometryProxy
    let isSelected: Bool

    var body: some View {
        let rect = screenRect
        ZStack(alignment: .topLeading) {
            RoundedRectangle(cornerRadius: 14)
                .fill(Theme.cyan.opacity(isSelected ? 0.18 : 0.06))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Theme.cyan.opacity(isSelected ? 1 : 0.55), lineWidth: isSelected ? 2 : 1))
                .shadow(color: Theme.cyan.opacity(isSelected ? 0.65 : 0.15), radius: 12)
                .frame(width: rect.width, height: rect.height)
            HStack(spacing: 6) { Text(part.nameFa).bold(); Image(systemName: "scope") }
                .font(.caption)
                .padding(.horizontal, 10).padding(.vertical, 7)
                .background(.ultraThinMaterial, in: Capsule())
                .overlay(Capsule().stroke(Theme.cyan.opacity(0.8)))
                .offset(y: -38)
        }
        .foregroundStyle(.white)
        .position(x: rect.midX, y: rect.midY)
        .animation(.easeOut(duration: 0.15), value: detection.boundingBox)
        .accessibilityLabel("قطعه شناسایی شده: \(part.nameFa)")
    }

    private var screenRect: CGRect {
        let b = detection.boundingBox
        let w = b.width * geometry.size.width
        let h = b.height * geometry.size.height
        let x = b.minX * geometry.size.width
        let y = (1 - b.maxY) * geometry.size.height
        return CGRect(x: x, y: y, width: w, height: h)
    }
}
