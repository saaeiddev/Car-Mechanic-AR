from __future__ import annotations
import json, shutil
from pathlib import Path
from huggingface_hub import hf_hub_download
from ultralytics import YOLO
import onnx
REPO_ID="AswinG5/moto-parts-30cls"; WEIGHTS="motopartscls.pt"
ROOT=Path(__file__).resolve().parents[1]; ASSETS=ROOT/"android"/"app"/"src"/"main"/"assets"; ASSETS.mkdir(parents=True,exist_ok=True)
weights_path=hf_hub_download(repo_id=REPO_ID,filename=WEIGHTS); model=YOLO(weights_path); names=model.names
labels=[names[i] for i in sorted(names)] if isinstance(names,dict) else list(names)
exported=model.export(format="onnx",imgsz=224,opset=12,dynamic=False,simplify=False); exported_path=Path(exported)
onnx_model=onnx.load(str(exported_path));onnx.checker.check_model(onnx_model)
model_dest=ASSETS/"car_parts_classifier.onnx"; labels_dest=ASSETS/"car_part_labels.txt"; metadata_dest=ASSETS/"car_part_model_metadata.json"
shutil.copy2(exported_path,model_dest);labels_dest.write_text("\n".join(labels)+"\n",encoding="utf-8")
metadata_dest.write_text(json.dumps({"source":f"https://huggingface.co/{REPO_ID}","weights":WEIGHTS,"task":"image-classification","input_size":224,"labels":labels,"note":"Real on-device classification. Center focus box is UI guidance, not a predicted bounding box."},ensure_ascii=False,indent=2),encoding="utf-8")
print(f"Model ready: {model_dest} ({model_dest.stat().st_size/1024/1024:.1f} MB)")
