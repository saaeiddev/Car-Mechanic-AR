from pathlib import Path
import json, shutil
from huggingface_hub import hf_hub_download
from ultralytics import YOLO

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'site' / 'models'
OUT.mkdir(parents=True, exist_ok=True)
repo = 'AswinG5/moto-parts-30cls'
pt = Path(hf_hub_download(repo_id=repo, filename='motopartscls.pt'))
model = YOLO(str(pt))
exported = Path(model.export(format='onnx', imgsz=224, opset=12, simplify=False, dynamic=False))
shutil.copy2(exported, OUT / 'car_parts_classifier.onnx')
labels = [model.names[i] for i in range(len(model.names))]
(OUT / 'car_part_labels.txt').write_text('\n'.join(labels) + '\n', encoding='utf-8')
meta = {
    'source': f'https://huggingface.co/{repo}',
    'weights': 'motopartscls.pt',
    'task': 'image-classification',
    'input_size': 224,
    'labels': labels,
    'note': 'Browser ONNX inference. Center focus rectangle is UI guidance, not a detector bounding box.'
}
(OUT / 'car_part_model_metadata.json').write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Web model ready: {OUT / "car_parts_classifier.onnx"}')
