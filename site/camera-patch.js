(() => {
  'use strict';
  if (window.__CAR_MECHANIC_SCANNER_CORE_V7__) return;
  window.__CAR_MECHANIC_SCANNER_CORE_V7__ = true;

  const LABELS = [
    'cylinder_head','alternator','clutch_plate','chain_sprocket','cylinder_block','piston','crankshaft','camshaft','spark_plug','air_fin',
    'radiator','motorcycle_frame','forks','swingarm','shock_absorbers','gear_box','chain','disc','handlebar','brake_clutch_lever',
    'brake_clutch_cable','brake_pad','battery_terminal','fuse_box','brake_light_switch','gear_lever','brake_pedal','carburetor','fuel_tank','brake_oil_reservoir'
  ];

  // The bundled model was trained on motorcycle/mechanical parts. Only classes
  // that make sense for a car are allowed to become a final result. Motorcycle-
  // only classes are treated as "uncertain" instead of being shown as a wrong car result.
  const CAR_LABELS = new Set([
    'cylinder_head','alternator','clutch_plate','cylinder_block','piston','crankshaft','camshaft','spark_plug','radiator',
    'shock_absorbers','gear_box','disc','brake_pad','battery_terminal','fuse_box','brake_light_switch','gear_lever','brake_pedal',
    'carburetor','fuel_tank','brake_oil_reservoir'
  ]);

  const INFO = {
    cylinder_head:['سرسیلندر','Cylinder Head','محفظه احتراق و مجموعه سوپاپ‌ها را در خود جای می‌دهد.','بستن بالای سیلندر و نگهداری سوپاپ‌ها','بالای بلوک موتور'],
    alternator:['دینام','Alternator','هنگام روشن بودن موتور برق تولید می‌کند و باتری را شارژ می‌کند.','تولید برق و شارژ باتری','کنار موتور و متصل به تسمه'],
    clutch_plate:['صفحه کلاچ','Clutch Plate','ارتباط موتور و گیربکس را برقرار یا قطع می‌کند.','کنترل انتقال نیرو','بین موتور و گیربکس'],
    cylinder_block:['بلوک سیلندر','Cylinder Block','ساختار اصلی موتور و محل حرکت پیستون‌ها است.','نگهداری سیلندرها و اجزای اصلی موتور','بدنه اصلی موتور'],
    piston:['پیستون','Piston','فشار احتراق را به حرکت رفت‌وبرگشتی تبدیل می‌کند.','انتقال نیروی احتراق به میل‌لنگ','داخل سیلندر'],
    crankshaft:['میل‌لنگ','Crankshaft','حرکت رفت‌وبرگشتی پیستون را به حرکت چرخشی تبدیل می‌کند.','تبدیل حرکت پیستون به دوران','پایین بلوک موتور'],
    camshaft:['میل‌سوپاپ','Camshaft','زمان باز و بسته شدن سوپاپ‌ها را کنترل می‌کند.','کنترل زمان‌بندی سوپاپ‌ها','سرسیلندر یا بلوک موتور'],
    spark_plug:['شمع','Spark Plug','جرقه لازم برای احتراق مخلوط هوا و سوخت را ایجاد می‌کند.','ایجاد جرقه احتراق','روی سرسیلندر'],
    radiator:['رادیاتور','Radiator','گرمای مایع خنک‌کننده را به هوای محیط منتقل می‌کند.','کنترل دمای موتور','جلوی خودرو یا نزدیک جریان هوا'],
    shock_absorbers:['کمک‌فنر','Shock Absorber','نوسان سیستم تعلیق را کنترل می‌کند.','کاهش نوسان و حفظ تماس چرخ','نزدیک چرخ‌ها'],
    gear_box:['گیربکس','Gearbox','نسبت دور و گشتاور را برای شرایط مختلف تغییر می‌دهد.','تنظیم نسبت انتقال قدرت','متصل به موتور'],
    disc:['دیسک ترمز','Brake Disc','سطح چرخانی است که لنت روی آن اصطکاک ایجاد می‌کند.','ایجاد سطح اصطکاک برای ترمزگیری','کنار توپی چرخ'],
    brake_pad:['لنت ترمز','Brake Pad','با فشرده شدن روی دیسک اصطکاک ایجاد می‌کند.','کاهش سرعت خودرو','داخل کالیپر ترمز'],
    battery_terminal:['سر باتری','Battery Terminal','نقطه اتصال کابل‌های مثبت و منفی به باتری است.','انتقال جریان الکتریکی','روی قطب‌های باتری'],
    fuse_box:['جعبه فیوز','Fuse Box','مدارهای برقی را در برابر جریان بیش از حد محافظت می‌کند.','حفاظت از مدارهای الکتریکی','محفظه موتور یا داخل کابین'],
    brake_light_switch:['سوئیچ چراغ ترمز','Brake Light Switch','با فعال شدن ترمز مدار چراغ ترمز را وصل می‌کند.','فعال کردن چراغ ترمز','نزدیک پدال ترمز'],
    gear_lever:['دسته دنده','Gear Lever','فرمان انتخاب نسبت گیربکس را منتقل می‌کند.','انتخاب دنده','داخل کابین'],
    brake_pedal:['پدال ترمز','Brake Pedal','ورودی راننده را به سیستم ترمز منتقل می‌کند.','اعمال فرمان ترمز','داخل کابین'],
    carburetor:['کاربراتور','Carburetor','هوا و سوخت را با نسبت مناسب ترکیب می‌کند.','آماده‌سازی مخلوط هوا و سوخت','بین فیلتر هوا و منیفولد ورودی'],
    fuel_tank:['باک سوخت','Fuel Tank','سوخت را به شکل ایمن ذخیره می‌کند.','ذخیره سوخت','بخش عقب/زیر خودرو'],
    brake_oil_reservoir:['مخزن روغن ترمز','Brake Fluid Reservoir','روغن هیدرولیک سیستم ترمز را نگهداری می‌کند.','ذخیره و تغذیه روغن ترمز','بالای سیلندر اصلی ترمز']
  };

  const INPUT_SIZE = 224;
  const MIN_CONF = 0.52;
  const MIN_MARGIN = 0.12;
  const CONSENSUS_WINDOW = 7;
  const CONSENSUS_REQUIRED = 5;
  const core = {
    stream:null, session:null, facing:'environment', scanning:false, paused:false, timer:null, starting:false,
    votes:[], current:null, currentConfidence:0, lastFrame:null
  };
  const $ = s => document.querySelector(s);

  function notify(message){
    const t=$('#toast');
    if(t){t.textContent=message;t.classList.add('show');clearTimeout(t.__cmto);t.__cmto=setTimeout(()=>t.classList.remove('show'),3000);}
    console.info('[Car Mechanic AR]',message);
  }
  function status(message,mode='loading'){
    const el=$('#modelStatus'); if(el) el.textContent=message;
    const dot=$('.status-dot'); if(dot){dot.classList.toggle('ready',mode==='ready');dot.classList.toggle('error',mode==='error');}
  }
  function cameraError(err){
    const n=err?.name||'';
    if(n==='NotAllowedError'||n==='SecurityError')return 'دسترسی دوربین مسدود است؛ Camera را برای این سایت روی Allow بگذار.';
    if(n==='NotFoundError'||n==='DevicesNotFoundError')return 'هیچ دوربینی روی دستگاه پیدا نشد.';
    if(n==='NotReadableError'||n==='TrackStartError')return 'دوربین توسط برنامه دیگری در حال استفاده است.';
    return `باز کردن دوربین ناموفق بود${n?` (${n})`:''}.`;
  }

  function ensureFinalStateUi(){
    if($('#finalScanState')) return $('#finalScanState');
    const head=$('.result-head'); if(!head) return null;
    const el=document.createElement('div'); el.id='finalScanState'; el.className='ai-note';
    el.style.cssText='margin:8px 0 0;padding:8px 10px;border:1px solid rgba(52,211,235,.25);border-radius:10px;background:rgba(52,211,235,.06);font-size:12px';
    el.textContent='برای نتیجه نهایی، قطعه را چند لحظه ثابت در مرکز کادر نگه دار.';
    head.appendChild(el); return el;
  }
  function setFinalState(text){const el=ensureFinalStateUi(); if(el)el.textContent=text;}

  async function ensureModel(){
    if(core.session)return core.session;
    if(!window.ort)throw new Error('ONNX Runtime unavailable');
    status('در حال بارگذاری مدل AI…');
    ort.env.wasm.numThreads=1; ort.env.wasm.proxy=false; ort.env.wasm.wasmPaths=new URL('vendor/ort/',document.baseURI).href;
    const r=await fetch(new URL('models/car_parts_classifier.onnx',document.baseURI).href,{cache:'no-store'});
    if(!r.ok)throw new Error(`model HTTP ${r.status}`);
    const bytes=new Uint8Array(await r.arrayBuffer());
    core.session=await ort.InferenceSession.create(bytes,{executionProviders:['wasm'],graphOptimizationLevel:'all'});
    status('مدل AI آماده است','ready');
    setFinalState('مدل آماده است؛ یک قطعه را نزدیک و ثابت در مرکز کادر بگیر.');
    return core.session;
  }

  async function requestCamera(){
    try{return await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:core.facing},width:{ideal:1280},height:{ideal:720}}});}
    catch(e){if(e?.name==='NotAllowedError'||e?.name==='SecurityError')throw e;return navigator.mediaDevices.getUserMedia({audio:false,video:true});}
  }

  function resetConsensus(){
    core.votes=[]; core.current=null; core.currentConfidence=0; core.lastFrame=null;
    const chip=$('#predictionChip'); if(chip)chip.hidden=true;
    const bar=$('#confidenceBar'); if(bar)bar.style.width='0%';
    setFinalState('در حال اسکن… قطعه را ثابت و در مرکز کادر نگه دار.');
  }

  function stopCamera(){
    clearTimeout(core.timer);core.timer=null;core.scanning=false;core.paused=false;core.starting=false;resetConsensus();
    if(core.stream){core.stream.getTracks().forEach(t=>t.stop());core.stream=null;}
    const v=$('#video');if(v){try{v.pause();}catch(_){}v.srcObject=null;}
    $('#cameraStage')?.classList.remove('camera-on');const ph=$('#cameraPlaceholder');if(ph)ph.style.display='';
    const b=$('#cameraBtn');if(b){b.disabled=false;b.textContent='فعال‌کردن دوربین';}
    const h=$('#startCameraHero');if(h)h.disabled=false;
    const p=$('#pauseBtn');if(p){p.disabled=true;p.textContent='توقف اسکن';}
  }

  async function startCamera(){
    if(core.starting)return;
    if(core.stream){stopCamera();return;}
    if(!window.isSecureContext){notify('دوربین فقط روی HTTPS قابل استفاده است.');return;}
    if(!navigator.mediaDevices?.getUserMedia){notify('این مرورگر API دوربین را در اختیار سایت قرار نمی‌دهد.');return;}
    core.starting=true;const b=$('#cameraBtn'),h=$('#startCameraHero');if(b){b.disabled=true;b.textContent='در حال اتصال…';}if(h)h.disabled=true;
    try{
      const stream=await requestCamera();core.stream=stream;const v=$('#video');if(!v)throw new Error('video element missing');
      v.setAttribute('playsinline','');v.muted=true;v.autoplay=true;v.srcObject=stream;
      await new Promise(resolve=>{if(v.readyState>=1)return resolve();v.addEventListener('loadedmetadata',resolve,{once:true});setTimeout(resolve,2500);});
      try{await v.play();}catch(e){console.warn('video.play()',e);}
      v.style.display='block';v.style.width='100%';v.style.height='100%';v.style.objectFit='cover';
      $('#cameraStage')?.classList.add('camera-on');const ph=$('#cameraPlaceholder');if(ph)ph.style.display='none';
      if(b){b.disabled=false;b.textContent='خاموش کردن دوربین';}if(h)h.disabled=false;
      const p=$('#pauseBtn');if(p){p.disabled=false;p.textContent='توقف اسکن';}
      core.starting=false;core.scanning=true;core.paused=false;resetConsensus();notify('دوربین فعال شد');
      await ensureModel();schedule(100);
    }catch(e){console.error('camera start',e);stopCamera();notify(cameraError(e));}
  }

  function imageData(source){
    const c=$('#captureCanvas'),ctx=c.getContext('2d',{willReadFrequently:true});
    const sw=source.videoWidth||source.naturalWidth||source.width,sh=source.videoHeight||source.naturalHeight||source.height;
    if(!sw||!sh)throw new Error('frame not ready');
    // Match Ultralytics classification inference: resize shortest edge then center-crop square.
    const crop=Math.min(sw,sh),sx=(sw-crop)/2,sy=(sh-crop)/2;
    ctx.clearRect(0,0,INPUT_SIZE,INPUT_SIZE);ctx.drawImage(source,sx,sy,crop,crop,0,0,INPUT_SIZE,INPUT_SIZE);
    return ctx.getImageData(0,0,INPUT_SIZE,INPUT_SIZE);
  }
  function tensorFrom(data){
    const p=data.data,plane=INPUT_SIZE*INPUT_SIZE,out=new Float32Array(plane*3);
    // Ultralytics classification defaults use ToTensor(): RGB pixels scaled to [0,1].
    // Do NOT apply ImageNet mean/std here; that was the main preprocessing bug in v6.
    for(let i=0,j=0;i<plane;i++,j+=4){out[i]=p[j]/255;out[plane+i]=p[j+1]/255;out[2*plane+i]=p[j+2]/255;}
    return new ort.Tensor('float32',out,[1,3,INPUT_SIZE,INPUT_SIZE]);
  }
  function probabilityArray(raw){
    let sum=0,valid=true,max=-Infinity;for(const v of raw){sum+=v;if(v<0||v>1.0001)valid=false;if(v>max)max=v;}
    if(valid&&sum>.97&&sum<1.03)return Float32Array.from(raw);
    const out=new Float32Array(raw.length);sum=0;for(let i=0;i<raw.length;i++){out[i]=Math.exp(raw[i]-max);sum+=out[i];}for(let i=0;i<out.length;i++)out[i]/=sum;return out;
  }
  async function classifySource(source){
    if(!core.session)await ensureModel();
    const tensor=tensorFrom(imageData(source)),input=core.session.inputNames[0],result=await core.session.run({[input]:tensor});
    const p=probabilityArray(result[core.session.outputNames[0]].data);
    const ranked=[...p].map((confidence,index)=>({label:LABELS[index],confidence:Number(confidence)})).sort((a,b)=>b.confidence-a.confidence);
    return {top:ranked[0],second:ranked[1],top3:ranked.slice(0,3),margin:(ranked[0]?.confidence||0)-(ranked[1]?.confidence||0)};
  }

  function acceptable(pred){
    return !!pred?.top && CAR_LABELS.has(pred.top.label) && pred.top.confidence>=MIN_CONF && pred.margin>=MIN_MARGIN;
  }
  function showLive(pred){
    const pct=Math.round((pred?.top?.confidence||0)*100);const bar=$('#confidenceBar');if(bar)bar.style.width=`${pct}%`;
    if(!acceptable(pred)){
      const chip=$('#predictionChip');if(chip)chip.hidden=true;
      setFinalState('هنوز مطمئن نیستم؛ قطعه را نزدیک‌تر، واضح‌تر و جدا از پس‌زمینه در مرکز کادر بگیر.');
      return;
    }
    const info=INFO[pred.top.label];const chip=$('#predictionChip');if(chip)chip.hidden=false;
    if($('#predictionName'))$('#predictionName').textContent=`در حال بررسی: ${info?.[0]||pred.top.label}`;
    if($('#predictionConfidence'))$('#predictionConfidence').textContent=`${pct}%`;
    setFinalState(`در حال تأیید ${info?.[0]||pred.top.label}… چند لحظه ثابت نگه دار.`);
  }

  function saveHistory(label,confidence,source){
    try{const arr=JSON.parse(localStorage.getItem('scanHistory')||'[]');arr.unshift({label,confidence,source,time:Date.now()});localStorage.setItem('scanHistory',JSON.stringify(arr.slice(0,60)));}catch(_){}
  }
  function favoriteSet(){try{return new Set(JSON.parse(localStorage.getItem('favorites')||'[]'));}catch(_){return new Set();}}
  function updateFavoriteButton(){const b=$('#favoriteCurrentBtn');if(!b)return;b.disabled=!core.current;if(core.current)b.textContent=favoriteSet().has(core.current)?'★ حذف از علاقه‌مندی‌ها':'☆ افزودن به علاقه‌مندی‌ها';}

  function renderFinal(label,confidence,source='camera'){
    const info=INFO[label];if(!info)return;core.current=label;core.currentConfidence=confidence;
    const pct=Math.round(confidence*100);const chip=$('#predictionChip');if(chip)chip.hidden=false;
    if($('#predictionName'))$('#predictionName').textContent=`نتیجه نهایی: ${info[0]}`;if($('#predictionConfidence'))$('#predictionConfidence').textContent=`${pct}%`;
    if($('#resultFa'))$('#resultFa').textContent=info[0];if($('#resultEn'))$('#resultEn').textContent=info[1];
    if($('#resultDescription'))$('#resultDescription').textContent=info[2];if($('#resultFunction'))$('#resultFunction').textContent=info[3];if($('#resultLocation'))$('#resultLocation').textContent=info[4];
    if($('#confidenceBar'))$('#confidenceBar').style.width=`${pct}%`;
    const d=$('#openDetailBtn');if(d)d.disabled=false;updateFavoriteButton();
    setFinalState(`نتیجه نهایی ثبت شد: ${info[0]} — اطمینان ${pct}٪. برای قطعه بعدی «اسکن دوباره» را بزن.`);
    saveHistory(label,confidence,source);
    if(source==='camera'){core.paused=true;clearTimeout(core.timer);const p=$('#pauseBtn');if(p){p.disabled=false;p.textContent='اسکن دوباره';}}
    if(navigator.vibrate)navigator.vibrate(30);
  }

  function addVote(pred){
    core.lastFrame=pred;showLive(pred);
    core.votes.push(acceptable(pred)?{label:pred.top.label,confidence:pred.top.confidence,margin:pred.margin}:null);
    if(core.votes.length>CONSENSUS_WINDOW)core.votes.shift();
    const counts=new Map();for(const v of core.votes){if(!v)continue;const x=counts.get(v.label)||{count:0,sum:0,margin:0};x.count++;x.sum+=v.confidence;x.margin+=v.margin;counts.set(v.label,x);}
    let winner=null;for(const [label,x] of counts){if(!winner||x.count>winner.count)winner={label,...x};}
    if(winner&&winner.count>=CONSENSUS_REQUIRED){const avg=winner.sum/winner.count,avgMargin=winner.margin/winner.count;if(avg>=MIN_CONF&&avgMargin>=MIN_MARGIN)renderFinal(winner.label,avg,'camera');}
  }

  async function scanOnce(){const v=$('#video');if(!v||v.readyState<2||core.paused)return;addVote(await classifySource(v));}
  function schedule(delay=650){clearTimeout(core.timer);if(!core.scanning||core.paused)return;core.timer=setTimeout(async()=>{try{await scanOnce();}catch(e){console.warn('scan frame',e);}schedule(650);},delay);}

  async function analyzeImage(file){
    const img=new Image();const url=URL.createObjectURL(file);img.src=url;
    try{await img.decode();const pred=await classifySource(img);if(!acceptable(pred)){resetConsensus();setFinalState('نتیجه این تصویر قابل اعتماد نیست؛ عکس نزدیک‌تر و واضح‌تر از خود قطعه بگیر.');notify('مدل برای این تصویر به نتیجه قابل اعتماد نرسید.');return;}renderFinal(pred.top.label,pred.top.confidence,'gallery');}
    finally{URL.revokeObjectURL(url);}
  }

  function showDetails(){
    if(!core.current)return;const info=INFO[core.current],root=$('#detailContent'),dlg=$('#detailDialog');if(!root||!dlg)return;
    root.innerHTML=`<div class="detail-body"><span class="eyebrow">FINAL AI RESULT</span><h1>${info[0]}</h1><p class="muted">${info[1]}</p><p class="lead">${info[2]}</p><div class="detail-sections"><div class="detail-box"><span>وظیفه</span><p>${info[3]}</p></div><div class="detail-box"><span>محل قرارگیری</span><p>${info[4]}</p></div></div></div>`;
    try{dlg.showModal();}catch(_){}
  }
  function toggleFavorite(){if(!core.current)return;const s=favoriteSet();s.has(core.current)?s.delete(core.current):s.add(core.current);localStorage.setItem('favorites',JSON.stringify([...s]));updateFavoriteButton();notify(s.has(core.current)?'به علاقه‌مندی‌ها اضافه شد':'از علاقه‌مندی‌ها حذف شد');}

  function bind(){
    const capture=(fn)=>e=>{e.preventDefault();e.stopImmediatePropagation();fn(e);};
    $('#cameraBtn')?.addEventListener('click',capture(()=>startCamera()),true);
    $('#startCameraHero')?.addEventListener('click',capture(()=>startCamera()),true);
    $('#cameraSwitchBtn')?.addEventListener('click',capture(async()=>{core.facing=core.facing==='environment'?'user':'environment';if(core.stream){stopCamera();await startCamera();}}),true);
    $('#pauseBtn')?.addEventListener('click',capture(()=>{if(!core.stream)return;if(core.paused){core.paused=false;resetConsensus();const p=$('#pauseBtn');if(p)p.textContent='توقف اسکن';schedule(80);}else{core.paused=true;clearTimeout(core.timer);const p=$('#pauseBtn');if(p)p.textContent='ادامه اسکن';}}),true);
    $('#imageInput')?.addEventListener('change',capture(async e=>{const file=e.target.files?.[0];if(file)await analyzeImage(file);e.target.value='';}),true);
    $('#openDetailBtn')?.addEventListener('click',capture(()=>showDetails()),true);
    $('#favoriteCurrentBtn')?.addEventListener('click',capture(()=>toggleFavorite()),true);
    window.addEventListener('pagehide',()=>{if(core.stream)core.stream.getTracks().forEach(t=>t.stop());});
  }

  ensureFinalStateUi();bind();ensureModel().catch(e=>{console.error('model preload',e);status('مدل AI هنگام اولین اسکن دوباره تلاش می‌کند','error');});
})();