# Car Mechanic AR — مکانیک با واقعیت افزوده

Persian-first automotive education app with a real camera pipeline, on-device AI recognition, AR-style overlays, part details, gallery analysis, lessons, quiz, history, favorites, settings and 3D-viewer infrastructure.

## Android Real-AI build

The Android app now includes a **real neural-network model** executed locally on the phone with ONNX Runtime. GitHub Actions downloads the licensed upstream weights, exports them to ONNX, validates the model and packages it into the APK before compiling the app.

Current model source: `AswinG5/moto-parts-30cls` (MIT). It supports 30 motorcycle/mechanical-part classes including cylinder head, alternator, clutch plate, piston, crankshaft, camshaft, spark plug, radiator, shock absorber, gearbox, brake disc, brake pad, battery terminal, fuse box, carburetor and fuel tank.

### Important model limitation

The bundled network is an **image classifier**, not a multi-object object detector. Keep one supported mechanical part near the center of the camera. The predicted class and confidence are genuine neural-network outputs. The cyan focus rectangle is a UI guide; it is **not** a model-predicted bounding box. A future true automotive detector can replace the inference service without changing the app screens.

The app does not silently fall back to fake/demo recognition if the production model is unavailable.

## Reproducible Android build

Push to `main` or manually run the `Android Real AI APK` GitHub Actions workflow. It will:

1. Download the published model weights.
2. Export and validate `car_parts_classifier.onnx`.
3. Package the ONNX model and class labels inside the APK.
4. Build with JDK 17 / Gradle 8.9 / targetSdk 35.
5. Upload `CarMechanicAR-RealAI.apk` as a workflow artifact.

Local development requirements:

- Android Studio / Android SDK 35
- JDK 17
- minSdk 28

The exact model build pipeline is in `scripts/prepare_real_ai_model.py`, and model details are documented in `docs/REAL_AI_MODEL.md`.

## iOS

The repository also contains the SwiftUI / ARKit / RealityKit / Vision/Core ML iOS architecture. The current real ONNX Android model integration is Android-specific; the iOS target still uses its separate Core ML adapter/demo configuration until an equivalent production Core ML model is bundled.

## 3D assets

3D viewer infrastructure is present, but final licensed vehicle-part 3D assets are not bundled yet. Placeholder/viewer screens are clearly identified in the UI.

## Safety

This app is educational and does not replace a qualified mechanic. Never touch hot, pressurized, high-voltage or moving components. Turn the vehicle off before inspection where appropriate.
