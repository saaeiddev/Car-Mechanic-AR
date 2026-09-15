import SwiftUI
import RealityKit

struct ThreeDViewerView: View {
    let part: CarPart
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottom) {
                ModelViewerRepresentable(modelName: part.model3DName).ignoresSafeArea()
                Text("برای چرخش بکشید • برای زوم دو انگشت را باز/بسته کنید").font(.caption).padding(10).background(.thinMaterial, in: Capsule()).padding(.bottom, 24)
            }
            .background(Theme.background)
            .navigationTitle(part.nameFa)
            .toolbar { ToolbarItem(placement: .topBarLeading) { Button("بستن") { dismiss() } } }
        }
    }
}

struct ModelViewerRepresentable: UIViewRepresentable {
    let modelName: String
    func makeUIView(context: Context) -> ARView {
        let view = ARView(frame: .zero, cameraMode: .nonAR, automaticallyConfigureSession: false)
        view.environment.background = .color(.init(white: 0.035, alpha: 1))
        let anchor = AnchorEntity(world: .zero)
        let entity: ModelEntity
        if let url = Bundle.main.url(forResource: modelName.replacingOccurrences(of: ".usdz", with: ""), withExtension: "usdz"), let loaded = try? ModelEntity.loadModel(contentsOf: url) {
            entity = loaded
        } else {
            let material = SimpleMaterial(color: .cyan.withAlphaComponent(0.72), isMetallic: true)
            entity = ModelEntity(mesh: .generateBox(size: 0.22, cornerRadius: 0.035), materials: [material])
        }
        entity.generateCollisionShapes(recursive: true)
        anchor.addChild(entity)
        view.scene.addAnchor(anchor)
        view.installGestures([.rotation, .scale, .translation], for: entity)
        let camera = PerspectiveCamera()
        camera.position = [0, 0.05, 0.65]
        let camAnchor = AnchorEntity(world: .zero)
        camAnchor.addChild(camera)
        view.scene.addAnchor(camAnchor)
        return view
    }
    func updateUIView(_ uiView: ARView, context: Context) {}
}
