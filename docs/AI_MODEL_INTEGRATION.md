# Automotive detector integration

The app deliberately separates UI/AR tracking from model inference.

## Label contract

Your detector labels should match IDs such as `engine`, `battery`, `spark_plug`, `radiator`, `air_filter`, etc.

## Recommended training path

Use a licensed automotive image dataset plus your own annotated engine-bay and undercarriage images. Train an object detector with bounding boxes, validate per-class precision/recall, export to Core ML for iOS and TensorFlow Lite / compatible on-device format for Android.

Production threshold defaults to 0.60. Tune per model and use temporal persistence to reduce flicker.

Do not claim universal recognition until the model has been validated across vehicle makes, lighting conditions, occlusion and camera distances.
