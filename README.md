# Car Mechanic AR — مکانیک با واقعیت افزوده

A bilingual-source, Persian-first automotive education app with a real camera pipeline, AR overlays, modular part recognition, 3D viewing infrastructure, lessons, quiz, history, favorites and settings.

## What is real vs demo

- **iOS:** real ARKit + RealityKit camera/session infrastructure, spatial anchors, Vision/Core ML adapter, SwiftUI UI.
- **Android:** real Camera2 preview + overlay/tracking UI with a swappable detector abstraction.
- A production automotive object detector is **not bundled**. Both clients ship with an explicit `DemoCarPartDetector` so the app is testable now, while `CoreMLCarPartDetector` / Android detector adapters are isolated for replacement with a trained automotive model.
- 3D viewer infrastructure is included. Place licensed USDZ/GLB assets in the documented resource folders.

## Repository layout

- `ios/` native Swift / SwiftUI / ARKit / RealityKit / Vision / Core ML / SwiftData project source
- `android/` native Android project source
- `docs/` model integration notes and safety notes

## iOS requirements

- macOS + current Xcode
- iPhone with ARKit support
- iOS deployment target 17+ (use the latest installed SDK; the project is intentionally not hard-bound to a marketing OS number)
- XcodeGen is optional but recommended to generate the `.xcodeproj` from `ios/project.yml`

### iOS run

```bash
cd ios
xcodegen generate
open CarMechanicAR.xcodeproj
```

Set your development team, connect an iPhone, then Run.

### Core ML integration

1. Train/export an object detection model whose labels map to `CarPart.id`.
2. Add `CarPartDetector.mlmodel` to the iOS target.
3. Switch `DetectionMode.demo` to `.production` in Settings or App configuration.
4. `CoreMLCarPartDetector` loads the model dynamically and returns Vision bounding boxes.

### USDZ models

Place licensed models in `ios/CarMechanicAR/Resources/Models/` using names such as:

- `engine.usdz`
- `battery.usdz`
- `spark_plug.usdz`
- `alternator.usdz`

The 3D viewer falls back to a generated placeholder mesh if a file is absent.

## Android requirements

- Android Studio / current Android SDK
- minSdk 28
- targetSdk 35

```bash
cd android
./gradlew assembleDebug
```

The detector interface is under `ai/CarPartDetectionService.kt`; replace `DemoCarPartDetector` with a TensorFlow Lite / MediaPipe / custom on-device detector when the model is available.

## Safety

This app is educational. It does not replace a qualified mechanic. Never touch hot, pressurized, high-voltage or moving components. Turn the vehicle off before inspection where appropriate.
