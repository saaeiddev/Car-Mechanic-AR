import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const MODEL_URL = 'models/car_parts_classifier.onnx';
const INPUT_SIZE = 224;
const IMAGENET_MEAN = [0.485, 0.456, 0.406];
const IMAGENET_STD = [0.229, 0.224, 0.225];

const PARTS = {
  air_fin:{fa:'پره خنک‌کننده',en:'Air Fin',cat:'خنک‌کاری',desc:'پره‌ها سطح انتقال حرارت را بیشتر می‌کنند تا گرمای قطعات بهتر دفع شود.',fn:'افزایش سطح تماس با هوا و کمک به دفع حرارت',loc:'روی سیلندر یا قطعات خنک‌شونده با هوا',safe:'در زمان داغ بودن موتور به پره‌ها دست نزن.'},
  alternator:{fa:'دینام',en:'Alternator',cat:'برق',desc:'دینام هنگام روشن بودن موتور انرژی مکانیکی را به برق تبدیل می‌کند.',fn:'تولید برق و شارژ باتری',loc:'کنار موتور و متصل به تسمه',safe:'پیش از بررسی تسمه، موتور را خاموش کن.'},
  battery_terminal:{fa:'سر باتری',en:'Battery Terminal',cat:'برق',desc:'ترمینال باتری نقطه اتصال کابل‌های مثبت و منفی به باتری است.',fn:'انتقال جریان الکتریکی بین باتری و مدار خودرو',loc:'روی قطب‌های باتری',safe:'از اتصال کوتاه بین دو قطب جلوگیری کن.'},
  brake_clutch_cable:{fa:'کابل ترمز / کلاچ',en:'Brake / Clutch Cable',cat:'کنترل',desc:'کابل مکانیکی نیروی دست یا پا را به مجموعه ترمز یا کلاچ منتقل می‌کند.',fn:'انتقال نیروی کنترلی',loc:'بین اهرم/پدال و مجموعه مقصد'},
  brake_clutch_lever:{fa:'اهرم ترمز / کلاچ',en:'Brake / Clutch Lever',cat:'کنترل',desc:'اهرم نیروی دست راننده را برای کنترل ترمز یا کلاچ منتقل می‌کند.',fn:'ایجاد ورودی مکانیکی کنترل',loc:'روی فرمان موتورسیکلت یا مجموعه کنترل'},
  brake_light_switch:{fa:'سوئیچ چراغ ترمز',en:'Brake Light Switch',cat:'برق',desc:'با فعال شدن ترمز، مدار چراغ ترمز را وصل می‌کند.',fn:'فعال‌کردن چراغ ترمز',loc:'نزدیک پدال یا اهرم ترمز'},
  brake_oil_reservoir:{fa:'مخزن روغن ترمز',en:'Brake Fluid Reservoir',cat:'ترمز',desc:'مخزن، روغن هیدرولیک سیستم ترمز را نگهداری می‌کند.',fn:'ذخیره و تغذیه روغن ترمز',loc:'بالای سیلندر اصلی ترمز',safe:'روغن ترمز خورنده است و آلودگی آن خطرناک است.'},
  brake_pad:{fa:'لنت ترمز',en:'Brake Pad',cat:'ترمز',desc:'لنت با فشرده شدن روی دیسک اصطکاک ایجاد کرده و سرعت را کم می‌کند.',fn:'ایجاد اصطکاک برای کاهش سرعت',loc:'داخل کالیپر ترمز',safe:'سیستم ترمز حیاتی است؛ سرویس تخصصی توصیه می‌شود.'},
  brake_pedal:{fa:'پدال ترمز',en:'Brake Pedal',cat:'ترمز',desc:'پدال ورودی راننده را به سیستم ترمز منتقل می‌کند.',fn:'اعمال فرمان ترمز',loc:'داخل کابین یا روی مجموعه کنترل'},
  camshaft:{fa:'میل‌سوپاپ',en:'Camshaft',cat:'موتور',desc:'میل‌سوپاپ زمان باز و بسته شدن سوپاپ‌ها را کنترل می‌کند.',fn:'کنترل زمان‌بندی سوپاپ‌ها',loc:'سرسیلندر یا بلوک موتور'},
  carburetor:{fa:'کاربراتور',en:'Carburetor',cat:'سوخت‌رسانی',desc:'کاربراتور هوا و سوخت را با نسبت مناسب ترکیب می‌کند.',fn:'آماده‌سازی مخلوط هوا و سوخت',loc:'بین فیلتر هوا و منیفولد ورودی',safe:'نشتی سوخت می‌تواند خطر آتش‌سوزی ایجاد کند.'},
  chain:{fa:'زنجیر',en:'Chain',cat:'انتقال قدرت',desc:'زنجیر نیرو را بین دو چرخ‌زنجیر منتقل می‌کند.',fn:'انتقال حرکت و گشتاور',loc:'سیستم انتقال قدرت'},
  chain_sprocket:{fa:'چرخ‌زنجیر',en:'Chain Sprocket',cat:'انتقال قدرت',desc:'چرخ‌زنجیر با دندانه‌های خود زنجیر را درگیر و هدایت می‌کند.',fn:'انتقال گشتاور به زنجیر',loc:'ابتدا یا انتهای مسیر زنجیر'},
  clutch_plate:{fa:'صفحه کلاچ',en:'Clutch Plate',cat:'انتقال قدرت',desc:'صفحه کلاچ اتصال موتور و گیربکس را برقرار یا قطع می‌کند.',fn:'کنترل انتقال نیرو از موتور به گیربکس',loc:'بین موتور و گیربکس'},
  crankshaft:{fa:'میل‌لنگ',en:'Crankshaft',cat:'موتور',desc:'میل‌لنگ حرکت رفت و برگشتی پیستون را به حرکت چرخشی تبدیل می‌کند.',fn:'تبدیل حرکت پیستون به دوران',loc:'پایین بلوک موتور'},
  cylinder_block:{fa:'بلوک سیلندر',en:'Cylinder Block',cat:'موتور',desc:'بلوک سیلندر ساختار اصلی موتور و محل حرکت پیستون‌ها است.',fn:'نگهداری سیلندرها و اجزای اصلی موتور',loc:'بدنه اصلی موتور'},
  cylinder_head:{fa:'سرسیلندر',en:'Cylinder Head',cat:'موتور',desc:'سرسیلندر محفظه احتراق، سوپاپ‌ها و مسیرهای هوا را در خود جای می‌دهد.',fn:'بستن بالای سیلندر و نگهداری مجموعه سوپاپ',loc:'بالای بلوک موتور'},
  disc:{fa:'دیسک ترمز',en:'Brake Disc',cat:'ترمز',desc:'دیسک سطح چرخانی است که لنت‌ها روی آن اصطکاک ایجاد می‌کنند.',fn:'ایجاد سطح اصطکاک برای ترمزگیری',loc:'کنار توپی چرخ',safe:'پس از رانندگی می‌تواند بسیار داغ باشد.'},
  forks:{fa:'دوشاخ جلو',en:'Front Forks',cat:'تعلیق',desc:'دوشاخ جلو چرخ را نگه داشته و بخشی از سیستم تعلیق و فرمان است.',fn:'هدایت چرخ و جذب ضربات',loc:'جلوی موتورسیکلت'},
  fuel_tank:{fa:'باک سوخت',en:'Fuel Tank',cat:'سوخت‌رسانی',desc:'باک سوخت را به شکل ایمن ذخیره می‌کند.',fn:'ذخیره سوخت',loc:'بدنه خودرو یا موتورسیکلت',safe:'در نزدیکی بخار سوخت از شعله و جرقه دوری کن.'},
  fuse_box:{fa:'جعبه فیوز',en:'Fuse Box',cat:'برق',desc:'جعبه فیوز مدارهای الکتریکی را در برابر جریان بیش از حد محافظت می‌کند.',fn:'حفاظت از مدارهای برقی',loc:'محفظه موتور یا داخل کابین'},
  gear_box:{fa:'گیربکس',en:'Gearbox',cat:'انتقال قدرت',desc:'گیربکس نسبت دور و گشتاور را برای شرایط مختلف حرکت تغییر می‌دهد.',fn:'تنظیم نسبت انتقال قدرت',loc:'متصل به موتور'},
  gear_lever:{fa:'دسته دنده',en:'Gear Lever',cat:'کنترل',desc:'دسته دنده فرمان انتخاب نسبت گیربکس را منتقل می‌کند.',fn:'انتخاب دنده',loc:'داخل کابین یا کنار پای راننده'},
  handlebar:{fa:'فرمان',en:'Handlebar',cat:'کنترل',desc:'فرمان برای هدایت وسیله و نصب کنترل‌ها استفاده می‌شود.',fn:'کنترل جهت حرکت',loc:'جلوی وسیله'},
  motorcycle_frame:{fa:'شاسی',en:'Frame',cat:'سازه',desc:'شاسی ساختار اصلی نگهدارنده قطعات وسیله است.',fn:'تحمل بار و اتصال اجزا',loc:'اسکلت اصلی وسیله'},
  piston:{fa:'پیستون',en:'Piston',cat:'موتور',desc:'پیستون فشار احتراق را به حرکت رفت و برگشتی تبدیل می‌کند.',fn:'انتقال نیروی احتراق به شاتون و میل‌لنگ',loc:'داخل سیلندر'},
  radiator:{fa:'رادیاتور',en:'Radiator',cat:'خنک‌کاری',desc:'رادیاتور گرمای مایع خنک‌کننده را به هوای محیط منتقل می‌کند.',fn:'کنترل دمای موتور',loc:'جلوی وسیله یا نزدیک جریان هوا',safe:'درپوش سیستم خنک‌کننده را در حالت داغ باز نکن.'},
  shock_absorbers:{fa:'کمک‌فنر',en:'Shock Absorber',cat:'تعلیق',desc:'کمک‌فنر نوسان سیستم تعلیق را کنترل می‌کند.',fn:'کاهش نوسان و حفظ تماس چرخ با سطح',loc:'نزدیک چرخ‌ها'},
  spark_plug:{fa:'شمع',en:'Spark Plug',cat:'موتور',desc:'شمع در موتور بنزینی جرقه لازم برای احتراق مخلوط هوا و سوخت را ایجاد می‌کند.',fn:'ایجاد جرقه احتراق',loc:'روی سرسیلندر',safe:'روی موتور داغ اقدام به باز کردن شمع نکن.'},
  swingarm:{fa:'بازوی نوسانی',en:'Swingarm',cat:'تعلیق',desc:'بازوی نوسانی چرخ عقب را به شاسی متصل می‌کند و اجازه حرکت تعلیق را می‌دهد.',fn:'اتصال چرخ عقب و حرکت کنترل‌شده تعلیق',loc:'بخش عقب شاسی'}
};
const LABELS = Object.keys(PARTS);

const state = {
  route:'scanner', session:null, stream:null, scanning:false, timer:null, facing:'environment',
  current:null, currentConfidence:0, threshold:Number(localStorage.getItem('threshold')||55),
  scanSpeed:Number(localStorage.getItem('scanSpeed')||700), haptics:localStorage.getItem('haptics')!=='false',
  keepHistory:localStorage.getItem('keepHistory')!=='false', deferredInstall:null
};

function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(t._to);t._to=setTimeout(()=>t.classList.remove('show'),2500)}
function setStatus(text, mode='loading'){const el=$('#modelStatus'); el.textContent=text; const dot=$('.status-dot'); dot.classList.toggle('ready',mode==='ready'); dot.classList.toggle('error',mode==='error');}
function safeJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch{return fallback}}
function saveHistory(label,confidence,source='camera'){if(!state.keepHistory)return; const arr=safeJSON('scanHistory',[]); arr.unshift({label,confidence,source,time:Date.now()}); localStorage.setItem('scanHistory',JSON.stringify(arr.slice(0,60))); renderHistory()}
function getFavorites(){return new Set(safeJSON('favorites',[]))}
function toggleFavorite(label){const s=getFavorites();s.has(label)?s.delete(label):s.add(label);localStorage.setItem('favorites',JSON.stringify([...s]));renderFavorites();renderParts();updateResultActions();toast(s.has(label)?'به علاقه‌مندی‌ها اضافه شد':'از علاقه‌مندی‌ها حذف شد')}

function routeTo(id){state.route=id; $$('.page').forEach(p=>p.classList.toggle('active-page',p.id===id)); $$('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===id)); $('#mobileMenu').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'}); if(id==='history')renderHistory(); if(id==='favorites')renderFavorites();}
$$('[data-route]').forEach(b=>b.addEventListener('click',()=>routeTo(b.dataset.route))); $('#menuBtn').addEventListener('click',()=>$('#mobileMenu').classList.toggle('open'));

async function loadModel(){
  try{
    setStatus('در حال بارگذاری مدل واقعی AI…');
    ort.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 2);
    ort.env.wasm.simd = true;
    state.session = await ort.InferenceSession.create(MODEL_URL,{executionProviders:['wasm'],graphOptimizationLevel:'all'});
    setStatus('مدل AI آماده است','ready');
    toast('مدل هوش مصنوعی آماده شد');
  }catch(err){console.error(err);setStatus('خطا در بارگذاری مدل AI','error');toast('مدل AI بارگذاری نشد؛ اتصال اینترنت را بررسی کن')}
}

async function startCamera(){
  if(!navigator.mediaDevices?.getUserMedia){toast('مرورگر شما دسترسی دوربین را پشتیبانی نمی‌کند');return}
  stopCamera();
  try{
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:state.facing},width:{ideal:1280},height:{ideal:720}},audio:false});
    state.stream=stream; const v=$('#video'); v.srcObject=stream; await v.play(); $('#cameraStage').classList.add('camera-on'); $('#cameraBtn').textContent='خاموش کردن دوربین'; $('#pauseBtn').disabled=false; state.scanning=true; scheduleScan(250); toast('دوربین فعال شد');
  }catch(err){console.error(err);toast('اجازه دسترسی به دوربین داده نشد')}
}
function stopCamera(){if(state.timer)clearTimeout(state.timer); state.timer=null; state.scanning=false; if(state.stream){state.stream.getTracks().forEach(t=>t.stop());state.stream=null} const v=$('#video'); v.srcObject=null; $('#cameraStage').classList.remove('camera-on'); $('#cameraBtn').textContent='فعال‌کردن دوربین'; $('#pauseBtn').disabled=true}
function scheduleScan(delay=state.scanSpeed){clearTimeout(state.timer); if(!state.scanning)return; state.timer=setTimeout(scanFrame,delay)}
async function scanFrame(){if(!state.scanning||!state.session){scheduleScan();return} const v=$('#video'); if(v.readyState<2){scheduleScan();return} try{const result=await classifySource(v);handlePrediction(result,'camera')}catch(e){console.error(e)} finally{scheduleScan()}}

function drawSquareToCanvas(source,canvas){
  const ctx=canvas.getContext('2d',{willReadFrequently:true}); const sw=source.videoWidth||source.naturalWidth||source.width; const sh=source.videoHeight||source.naturalHeight||source.height; const crop=Math.min(sw,sh)*0.82; const sx=(sw-crop)/2, sy=(sh-crop)/2; ctx.clearRect(0,0,INPUT_SIZE,INPUT_SIZE); ctx.drawImage(source,sx,sy,crop,crop,0,0,INPUT_SIZE,INPUT_SIZE); return ctx.getImageData(0,0,INPUT_SIZE,INPUT_SIZE);
}
function preprocess(imageData){const pixels=imageData.data;const plane=INPUT_SIZE*INPUT_SIZE;const f=new Float32Array(plane*3);for(let i=0,p=0;i<plane;i++,p+=4){f[i]=(pixels[p]/255-IMAGENET_MEAN[0])/IMAGENET_STD[0];f[plane+i]=(pixels[p+1]/255-IMAGENET_MEAN[1])/IMAGENET_STD[1];f[2*plane+i]=(pixels[p+2]/255-IMAGENET_MEAN[2])/IMAGENET_STD[2]}return f}
function softmax(values){let max=-Infinity;for(const v of values)if(v>max)max=v;const out=new Float32Array(values.length);let sum=0;for(let i=0;i<values.length;i++){out[i]=Math.exp(values[i]-max);sum+=out[i]}for(let i=0;i<out.length;i++)out[i]/=sum;return out}
function probabilityArray(values){let sum=0,valid=true;for(const v of values){if(v<0||v>1.0001)valid=false;sum+=v}return valid&&sum>0.97&&sum<1.03?values:softmax(values)}
async function classifySource(source){if(!state.session)throw new Error('Model not ready'); const data=preprocess(drawSquareToCanvas(source,$('#captureCanvas'))); const inputName=state.session.inputNames[0]; const tensor=new ort.Tensor('float32',data,[1,3,INPUT_SIZE,INPUT_SIZE]); const result=await state.session.run({[inputName]:tensor}); const raw=result[state.session.outputNames[0]].data; const probs=probabilityArray(raw); let idx=0;for(let i=1;i<probs.length;i++)if(probs[i]>probs[idx])idx=i; return {label:LABELS[idx],confidence:Number(probs[idx]||0)} }

let lastSaved={label:null,time:0};
function handlePrediction(result,source){if(!result?.label)return;const pct=Math.round(result.confidence*100); $('#confidenceBar').style.width=`${pct}%`; if(pct<state.threshold){$('#predictionChip').hidden=true; return} state.current=result.label;state.currentConfidence=result.confidence;const p=PARTS[result.label]; $('#predictionChip').hidden=false;$('#predictionName').textContent=p.fa;$('#predictionConfidence').textContent=`${pct}%`; $('#resultFa').textContent=p.fa;$('#resultEn').textContent=p.en;$('#resultDescription').textContent=p.desc;$('#resultFunction').textContent=p.fn;$('#resultLocation').textContent=p.loc;$('#safetyBox').hidden=!p.safe;$('#safetyText').textContent=p.safe||''; $('#openDetailBtn').disabled=false;$('#favoriteCurrentBtn').disabled=false;updateResultActions();update3D(result.label); if(state.haptics&&navigator.vibrate)navigator.vibrate(20); const now=Date.now();if(lastSaved.label!==result.label||now-lastSaved.time>8000){saveHistory(result.label,result.confidence,source);lastSaved={label:result.label,time:now}}
}
function updateResultActions(){if(!state.current)return;const fav=getFavorites().has(state.current);$('#favoriteCurrentBtn').textContent=fav?'★ حذف از علاقه‌مندی‌ها':'☆ افزودن به علاقه‌مندی‌ها'}

$('#cameraBtn').addEventListener('click',()=>state.stream?stopCamera():startCamera());$('#startCameraHero').addEventListener('click',startCamera);$('#cameraSwitchBtn').addEventListener('click',async()=>{state.facing=state.facing==='environment'?'user':'environment';if(state.stream)await startCamera()});$('#pauseBtn').addEventListener('click',()=>{state.scanning=!state.scanning;$('#pauseBtn').textContent=state.scanning?'توقف اسکن':'ادامه اسکن';if(state.scanning)scheduleScan(50);else clearTimeout(state.timer)});
$('#imageInput').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;if(!state.session){toast('مدل هنوز آماده نشده');return}const img=new Image();img.onload=async()=>{try{const r=await classifySource(img);handlePrediction(r,'gallery');routeTo('scanner');toast('تصویر تحلیل شد')}catch(err){console.error(err);toast('تحلیل تصویر ناموفق بود')}finally{URL.revokeObjectURL(img.src)}};img.src=URL.createObjectURL(file)});
$('#favoriteCurrentBtn').addEventListener('click',()=>state.current&&toggleFavorite(state.current));$('#openDetailBtn').addEventListener('click',()=>state.current&&openDetail(state.current));

function renderParts(filter=''){const q=filter.trim().toLowerCase();const fav=getFavorites();const list=Object.entries(PARTS).filter(([k,p])=>!q||`${p.fa} ${p.en} ${p.cat} ${k}`.toLowerCase().includes(q));$('#partsGrid').innerHTML=list.map(([k,p])=>`<article class="part-card"><span class="eyebrow">${p.cat}</span><h3>${p.fa}</h3><span class="en">${p.en}</span><p>${p.desc}</p><div class="card-meta"><span>AI CLASS</span><span>${k}</span></div><div class="card-actions"><button class="small-btn details" data-label="${k}">جزئیات</button><button class="small-btn fav" data-label="${k}">${fav.has(k)?'★':'☆'}</button></div></article>`).join('');$$('#partsGrid .details').forEach(b=>b.onclick=()=>openDetail(b.dataset.label));$$('#partsGrid .fav').forEach(b=>b.onclick=()=>toggleFavorite(b.dataset.label))}
$('#learnSearch').addEventListener('input',e=>renderParts(e.target.value));
function openDetail(label){const p=PARTS[label];if(!p)return;$('#detailContent').innerHTML=`<div class="detail-body"><span class="eyebrow">${p.cat} • ${label}</span><h1>${p.fa}</h1><p class="muted">${p.en}</p><p class="lead">${p.desc}</p><div class="detail-sections"><div class="detail-box"><span>وظیفه</span><p>${p.fn}</p></div><div class="detail-box"><span>محل قرارگیری</span><p>${p.loc}</p></div>${p.safe?`<div class="detail-box"><span>نکته ایمنی</span><p>${p.safe}</p></div>`:''}</div><button class="primary-btn detail-fav" style="margin-top:16px">${getFavorites().has(label)?'★ حذف از علاقه‌مندی‌ها':'☆ افزودن به علاقه‌مندی‌ها'}</button></div>`;$('.detail-fav').onclick=()=>{toggleFavorite(label);openDetail(label)};$('#detailDialog').showModal()}
$('#closeDialogBtn').addEventListener('click',()=>$('#detailDialog').close());$('#detailDialog').addEventListener('click',e=>{if(e.target===$('#detailDialog'))$('#detailDialog').close()});

function renderHistory(){const arr=safeJSON('scanHistory',[]);const root=$('#historyList');if(!arr.length){root.innerHTML='<div class="empty-state">هنوز اسکن ثبت‌شده‌ای وجود ندارد.</div>';return}root.innerHTML=arr.map(x=>{const p=PARTS[x.label]||{fa:x.label,en:x.label};return `<div class="history-item"><div><strong>${p.fa}</strong><small>${p.en} • ${x.source==='gallery'?'تصویر':'دوربین'}</small></div><span class="confidence-tag">${Math.round(x.confidence*100)}%</span><span class="time">${new Date(x.time).toLocaleString('fa-IR')}</span></div>`}).join('')}
$('#clearHistoryBtn').addEventListener('click',()=>{localStorage.removeItem('scanHistory');renderHistory();toast('تاریخچه پاک شد')});
function renderFavorites(){const fav=[...getFavorites()];const root=$('#favoritesGrid');if(!fav.length){root.innerHTML='<div class="empty-state" style="grid-column:1/-1">هنوز قطعه‌ای ذخیره نکرده‌ای.</div>';return}root.innerHTML=fav.map(k=>{const p=PARTS[k];return `<article class="part-card"><span class="eyebrow">${p.cat}</span><h3>${p.fa}</h3><span class="en">${p.en}</span><p>${p.desc}</p><div class="card-actions"><button class="small-btn details" data-label="${k}">جزئیات</button><button class="small-btn fav" data-label="${k}">★ حذف</button></div></article>`}).join('');$$('#favoritesGrid .details').forEach(b=>b.onclick=()=>openDetail(b.dataset.label));$$('#favoritesGrid .fav').forEach(b=>b.onclick=()=>toggleFavorite(b.dataset.label))}

const quiz={items:[],index:0,score:0};
function startQuiz(){quiz.items=[...LABELS].sort(()=>Math.random()-.5).slice(0,8);quiz.index=0;quiz.score=0;$('#quizStart').hidden=true;$('#quizResult').hidden=true;$('#quizGame').hidden=false;renderQuizQuestion()}
function renderQuizQuestion(){const label=quiz.items[quiz.index],p=PARTS[label];$('#quizCounter').textContent=`${quiz.index+1}/8`;$('#quizProgress').style.width=`${(quiz.index/8)*100}%`;$('#quizScore').textContent=`${quiz.score} امتیاز`;$('#quizQuestion').textContent='این توضیح مربوط به کدام قطعه است؟';$('#quizHint').textContent=p.desc;const wrong=LABELS.filter(x=>x!==label).sort(()=>Math.random()-.5).slice(0,3);const opts=[label,...wrong].sort(()=>Math.random()-.5);$('#quizOptions').innerHTML=opts.map(x=>`<button class="quiz-option" data-label="${x}">${PARTS[x].fa}<small style="display:block;color:#718a94;margin-top:4px">${PARTS[x].en}</small></button>`).join('');$$('.quiz-option').forEach(b=>b.onclick=()=>{if(b.dataset.label===label){quiz.score++;toast('درست بود ✓')}else toast(`پاسخ درست: ${p.fa}`);quiz.index++;if(quiz.index>=8)finishQuiz();else renderQuizQuestion()})}
function finishQuiz(){$('#quizGame').hidden=true;$('#quizResult').hidden=false;$('#quizProgress').style.width='100%';$('#quizResultTitle').textContent=quiz.score>=7?'عالی بود!':quiz.score>=5?'خوب پیش رفتی!':'بیشتر تمرین کن';$('#quizResultText').textContent=`امتیاز نهایی: ${quiz.score} از ۸`}
$('#startQuizBtn').onclick=startQuiz;$('#restartQuizBtn').onclick=startQuiz;

$('#thresholdRange').value=state.threshold;$('#thresholdValue').textContent=`${state.threshold}%`;$('#scanSpeed').value=String(state.scanSpeed);$('#hapticToggle').checked=state.haptics;$('#historyToggle').checked=state.keepHistory;$('#thresholdRange').oninput=e=>{$('#thresholdValue').textContent=`${e.target.value}%`;state.threshold=Number(e.target.value);localStorage.setItem('threshold',state.threshold)};$('#scanSpeed').onchange=e=>{state.scanSpeed=Number(e.target.value);localStorage.setItem('scanSpeed',state.scanSpeed)};$('#hapticToggle').onchange=e=>{state.haptics=e.target.checked;localStorage.setItem('haptics',state.haptics)};$('#historyToggle').onchange=e=>{state.keepHistory=e.target.checked;localStorage.setItem('keepHistory',state.keepHistory)};

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e;$('#installBtn').hidden=false});async function installPWA(){if(!state.deferredInstall){toast('از منوی مرورگر گزینه Add to Home Screen را انتخاب کن');return}state.deferredInstall.prompt();await state.deferredInstall.userChoice;state.deferredInstall=null;$('#installBtn').hidden=true}$('#installBtn').onclick=installPWA;$('#installSettingsBtn').onclick=installPWA;
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(console.warn));

let scene,camera3d,renderer,mechanicalGroup,animId;
function init3D(){const canvas=$('#threeCanvas');scene=new THREE.Scene();camera3d=new THREE.PerspectiveCamera(42,1,.1,100);camera3d.position.set(3.2,2.4,4.4);renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));const a=new THREE.AmbientLight(0xbbefff,1.4);const key=new THREE.DirectionalLight(0x55ddff,3);key.position.set(4,5,5);const warm=new THREE.PointLight(0xff8a3d,8,12);warm.position.set(-3,1,2);scene.add(a,key,warm);mechanicalGroup=new THREE.Group();scene.add(mechanicalGroup);update3D('crankshaft');const ro=new ResizeObserver(()=>{const r=canvas.parentElement.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera3d.aspect=r.width/r.height;camera3d.updateProjectionMatrix()});ro.observe(canvas.parentElement);const animate=()=>{animId=requestAnimationFrame(animate);mechanicalGroup.rotation.y+=.006;mechanicalGroup.rotation.x=Math.sin(performance.now()/2500)*.08;renderer.render(scene,camera3d)};animate()}
function clearGroup(){while(mechanicalGroup.children.length){const o=mechanicalGroup.children.pop();o.geometry?.dispose();if(o.material){Array.isArray(o.material)?o.material.forEach(m=>m.dispose()):o.material.dispose()}}}
function update3D(label){if(!mechanicalGroup)return;clearGroup();const metal=new THREE.MeshStandardMaterial({color:0x687b84,metalness:.85,roughness:.32});const dark=new THREE.MeshStandardMaterial({color:0x18262d,metalness:.6,roughness:.45});const cyan=new THREE.MeshStandardMaterial({color:0x1c9fc0,metalness:.55,roughness:.24});const add=(geo,mat,pos=[0,0,0],rot=[0,0,0])=>{const m=new THREE.Mesh(geo,mat);m.position.set(...pos);m.rotation.set(...rot);mechanicalGroup.add(m);return m};if(['disc','brake_pad','brake_oil_reservoir','brake_pedal'].includes(label)){add(new THREE.CylinderGeometry(1.1,1.1,.18,48),metal,[0,0,0],[Math.PI/2,0,0]);add(new THREE.CylinderGeometry(.42,.42,.28,36),dark,[0,0,0],[Math.PI/2,0,0]);for(let i=0;i<10;i++){const a=i/10*Math.PI*2;add(new THREE.CylinderGeometry(.05,.05,.3,12),cyan,[Math.cos(a)*.78,Math.sin(a)*.78,0],[Math.PI/2,0,0])}}else if(['spark_plug'].includes(label)){add(new THREE.CylinderGeometry(.22,.22,1.9,24),metal);add(new THREE.CylinderGeometry(.35,.35,.38,6),dark,[0,-.35,0]);add(new THREE.CylinderGeometry(.11,.11,.7,18),cyan,[0,1.25,0])}else if(['piston','cylinder_block','cylinder_head'].includes(label)){add(new THREE.CylinderGeometry(.72,.72,.9,36),metal,[0,.3,0]);add(new THREE.CylinderGeometry(.25,.25,1.8,20),dark,[0,-.75,0]);add(new THREE.TorusGeometry(.63,.06,14,40),cyan,[0,.68,0],[Math.PI/2,0,0])}else if(['gear_box','chain_sprocket','gear_lever'].includes(label)){for(const [s,x,y] of [[.9,0,0],[.56,1.05,.1],[.44,-1.0,-.2]]){add(new THREE.TorusGeometry(s,.18,14,28),metal,[x,y,0],[Math.PI/2,0,0]);add(new THREE.CylinderGeometry(s*.46,s*.46,.28,20),dark,[x,y,0],[Math.PI/2,0,0])}}else{add(new THREE.BoxGeometry(1.8,1.05,1.1),dark,[0,0,0]);add(new THREE.CylinderGeometry(.48,.48,1.7,28),metal,[0,.82,0],[0,0,Math.PI/2]);add(new THREE.TorusGeometry(.65,.1,12,34),cyan,[0,-.65,.55],[Math.PI/2,0,0]);add(new THREE.CylinderGeometry(.22,.22,2.6,20),metal,[0,0,0],[Math.PI/2,0,0])}}

renderParts();renderHistory();renderFavorites();init3D();loadModel();
