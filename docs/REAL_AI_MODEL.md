# Real on-device AI model (Android)

The Android build uses a real neural-network model, not hard-coded demo detections.

- Source: `AswinG5/moto-parts-30cls` on Hugging Face
- Upstream declared license: MIT
- Task: 30-class motorcycle / mechanical-part image classification
- Runtime: ONNX Runtime Android
- Input: RGB 224×224 center crop with ImageNet normalization
- Privacy: inference runs locally on the device

The GitHub Actions build downloads the published weights, exports them to ONNX, validates the graph, and packages it into the APK.

## Important limitation

This model is a classifier, not a multi-object spatial detector. Keep one mechanical part near the center of the camera. The predicted class and confidence are genuine model outputs. The cyan center box is a focus guide rather than a model-predicted bounding box.
