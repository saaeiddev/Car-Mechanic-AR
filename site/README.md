# Car Mechanic AR Web App

Browser-first replacement for the Android prototype.

- Camera access through `getUserMedia`
- Real ONNX neural-network inference in the browser with ONNX Runtime Web
- 30 supported mechanical/motorcycle part classes
- Gallery image analysis
- Persian part library, detail views, quiz, history, favorites and settings
- Responsive UI for phone, tablet and desktop
- Installable PWA
- Procedural WebGL educational 3D preview

Important: the current upstream model is an image **classifier**, not a multi-object detector. Keep one supported part near the center focus region. The focus rectangle is UI guidance and not a model-predicted bounding box.
