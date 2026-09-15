(() => {
  'use strict';
  if (window.__CAR_MECHANIC_SCANNER_CORE__) return;
  window.__CAR_MECHANIC_SCANNER_CORE__ = true;

  const LABELS = [
    'cylinder_head','alternator','clutch_plate','chain_sprocket','cylinder_block','piston','crankshaft','camshaft','spark_plug','air_fin',
    'radiator','motorcycle_frame','forks','swingarm','shock_absorbers','gear_box','chain','disc','handlebar','brake_clutch_lever',
    'brake_clutch_cable','brake_pad','battery_terminal','fuse_box','brake_light_switch','gear_lever','brake_pedal','carburetor','fuel_tank','brake_oil_reservoir'
  ];

  const INFO = {
    cylinder_head:['سرسیلندر','Cylinder Head','محفظه احتراق و مجموعه سوپاپ‌ها را در خود جای می‌دهد.','بستن بالای سیلندر و نگهداری سوپاپ‌ها','بالای بلوک موتور'],
    alternator:['دینام','Alternator','هنگام روشن بودن موتور برق تولید می‌کند و باتری را شارژ می‌کند.','تولید برق و شارژ باتری','کنار موتور و متصل به تسمه'],
    clutch_plate:['صفحه کلاچ','Clutch Plate','ارتباط موتور و گیربکس را برقرار یا قطع می‌کند.','کنترل انتقال نیرو','بین موتور و گیربکس'],
    chain_sprocket:['چرخ‌زنجیر','Chain Sprocket','با دندانه‌های خود زنجیر را درگیر و هدایت می‌کند.','انتقال گشتاور به زنجیر','ابتدا یا انتهای مسیر زنجیر'],
    cylinder_block:['بلوک سیلندر','Cylinder Block','ساختار اصلی موتور و محل حرکت پیستون‌ها است.','نگهداری سیلندرها و اجزای اصلی موتور','بدنه اصلی موتور'],
    piston:['پیستون','Piston','فشار احتراق را به حرکت رفت‌وبرگشتی تبدیل می‌کند.','انتقال نیروی احتراق به میل‌لنگ','داخل سیلندر'],
    crankshaft:['میل‌لنگ','Crankshaft','حرکت رفت‌وبرگشتی پیستون را به حرکت چرخشی تبدیل می‌کند.','تبدیل حرکت پیستون به دوران','پایین بلوک موتور'],
    camshaft:['میل‌سوپاپ','Camshaft','زمان باز و بسته شدن سوپاپ‌ها را کنترل می‌کند.','کنترل زمان‌بندی سوپاپ‌ها','سرسیلندر یا بلوک موتور'],
    spark_plug:['شمع','Spark Plug','جرقه لازم برای احتراق مخلوط هوا و سوخت را ایجاد می‌کند.','ایجاد جرقه احتراق','روی سرسیلندر'],
    air_fin:['پره خنک‌کننده','Air Fin','سطح انتقال حرارت را بیشتر می‌کند.','کمک به دفع حرارت','روی قطعات خنک‌شونده با هوا'],
    radiator:['رادیاتور','Radiator','گرمای مایع خنک‌کننده را به هوای محیط منتقل می‌کند.','کنترل دمای موتور','جلوی خودرو یا نزدیک جریان هوا'],
    motorcycle_frame:['شاسی','Frame','ساختار اصلی نگهدارنده اجزای وسیله است.','تحمل بار و اتصال اجزا','اسکلت اصلی وسیله'],
    forks:['دوشاخ جلو','Front Forks','چرخ جلو را نگه می‌دارد و بخشی از تعلیق است.','هدایت چرخ و جذب ضربه','جلوی وسیله'],
    swingarm:['بازوی نوسانی','Swingarm','چرخ عقب را به شاسی متصل می‌کند.','حرکت کنترل‌شده تعلیق عقب','بخش عقب شاسی'],
    shock_absorbers:['کمک‌فنر','Shock Absorber','نوسان سیستم تعلیق را کنترل می‌کند.','کاهش نوسان و حفظ تماس چرخ','نزدیک چرخ‌ها'],
    gear_box:['گیربکس','Gearbox','نسبت دور و گشتاور را برای شرایط مختلف تغییر می‌دهد.','تنظیم نسبت انتقال قدرت','متصل به موتور'],
    chain:['زنجیر','Chain','نیرو را بین دو چرخ‌زنجیر منتقل می‌کند.','انتقال حرکت و گشتاور','سیستم انتقال قدرت'],
    disc:['دیسک ترمز','Brake Disc','سطح چرخانی است که لنت روی آن اصطکاک ایجاد می‌کند.','ایجاد سطح اصطکاک برای ترمزگیری','کنار توپی چرخ'],
    handlebar:['فرمان','Handlebar','برای هدایت وسیله و نصب کنترل‌ها استفاده می‌شود.','کنترل جهت حرکت','جلوی وسیله'],
    brake_clutch_lever:['اهرم ترمز / کلاچ','Brake / Clutch Lever','نیروی دست راننده را به سیستم مربوط منتقل می‌کند.','ایجاد ورودی مکانیکی کنترل','روی فرمان'],
    brake_clutch_cable:['کابل ترمز / کلاچ','Brake / Clutch Cable','نیروی دست یا پا را به مجموعه مقصد منتقل می‌کند.','انتقال نیروی کنترلی','بین اهرم/پدال و مجموعه مقصد'],
    brake_pad:['لنت ترمز','Brake Pad','با فشرده شدن روی دیسک اصطکاک ایجاد می‌کند.','کاهش سرعت خودرو','داخل کالیپر ترمز'],
    battery_terminal:['سر باتری','Battery Terminal','نقطه اتصال کابل‌های مثبت و منفی به باتری است.','انتقال جریان الکتریکی','روی قطب‌های باتری'],
    fuse_box:['جعبه فیوز','Fuse Box','مدارهای برقی را در برابر جریان بیش از حد محافظت می‌کند.','حفاظت از مدارهای الکتریکی','محفظه موتور یا داخل کابین'],
    brake_light_switch:['سوئیچ چراغ ترمز','Brake Light Switch','با فعال شدن ترمز مدار چراغ ترمز را وصل می‌کند.','فعال کردن چراغ ترمز','نزدیک پدال یا اهرم ترمز'],
    gear_lever:['دسته دنده','Gear Lever','فرمان انتخاب نسبت گیربکس را منتقل می‌کند.','انتخاب دنده','داخل کابین'],
    brake_pedal:['پدال ترمز','Brake Pedal','ورودی راننده را به سیستم ترمز منتقل می‌کند.','اعمال فرمان ترمز','داخل کابین'],
    carburetor:['کاربراتور','Carburetor','هوا و سوخت را با نسبت مناسب ترکیب می‌کند.','آماده‌سازی مخلوط هوا و سوخت','بین فیلتر هوا و منیفولد ورودی'],
    fuel_tank:['باک سوخت','Fuel Tank','سوخت را به شکل ایمن ذخیره می‌کند.','ذخیره سوخت','بدنه خودرو یا موتورسیکلت'],
    brake_oil_reservoir:['مخزن روغن ترمز','Brake Fluid Reservoir','روغن هیدرولیک سیستم ترمز را نگهداری می‌کند.','ذخیره و تغذیه روغن ترمز','بالای سیلندر اصلی ترمز']
  };

  const INPUT_SIZE = 224;
  const MEAN = [0.485,0.456,0.406];
  const STD = [0.229,0.224,0.225];
  const core = {stream:null, session:null, facing:'environment', scanning:false, paused:false, timer:null, starting:false};
  const $ = s => document.querySelector(s);

  function notify(message){
    const t=$('#toast');
    if(t){t.textContent=message;t.classList.add('show');clearTimeout(t.__cmto);t.__cmto=setTimeout(()=>t.classList.remove('show'),3200);}
    console.info('[Car Mechanic AR]',message);
  }
  function status(message,mode='loading'){
    const el=$('#modelStatus');if(el)el.textContent=message;
    const dot=$('.status-dot');if(dot){dot.classList.toggle('ready',mode==='ready');dot.classList.toggle('error',mode==='error');}
  }
  function cameraError(err){
    const n=err?.name||'';
    if(n==='NotAllowedError'||n==='SecurityError')return 'دسترسی دوربین مسدود است؛ Camera را برای این سایت روی Allow بگذار.';
    if(n==='NotFoundError'||n==='DevicesNotFoundError')return 'هیچ دوربینی روی دستگاه پیدا نشد.';
    if(n==='NotReadableError'||n==='TrackStartError')return 'دوربین توسط برنامه دیگری در حال استفاده است.';
    if(n==='OverconstrainedError')return 'تنظیمات دوربین با این دستگاه سازگار نبود؛ حالت ساده را امتحان می‌کنم.';
    return `باز کردن دوربین ناموفق بود${n?` (${n})`:''}.`;
  }

  async function ensureModel(){
    if(core.session)return core.session;
    if(!window.ort)throw new Error('ONNX Runtime unavailable');
    status('در حال بارگذاری مدل AI…');
    ort.env.wasm.numThreads=1;ort.env.wasm.proxy=false;ort.env.wasm.wasmPaths=new URL('vendor/ort/',document.baseURI).href;
    const url=new URL('models/car_parts_classifier.onnx',document.baseURI).href;
    const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`model HTTP ${r.status}`);
    const bytes=new Uint8Array(await r.arrayBuffer());
    core.session=await ort.InferenceSession.create(bytes,{executionProviders:['wasm'],graphOptimizationLevel:'all'});
    status('مدل AI آماده است','ready');
    return core.session;
  }

  async function requestCamera(){
    try{
      return await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:core.facing},width:{ideal:1280},height:{ideal:720}}});
    }catch(e){
      if(e?.name==='NotAllowedError'||e?.name==='SecurityError')throw e;
      return navigator.mediaDevices.getUserMedia({audio:false,video:true});
    }
  }

  function stopCamera(){
    clearTimeout(core.timer);core.timer=null;core.scanning=false;core.paused=false;core.starting=false;
    if(core.stream){core.stream.getTracks().forEach(t=>t.stop());core.stream=null;}
    const v=$('#video');if(v){try{v.pause();}catch(_){}v.srcObject=null;v.style.display='';}
    $('#cameraStage')?.classList.remove('camera-on');
    const ph=$('#cameraPlaceholder');if(ph)ph.style.display='';
    const b=$('#cameraBtn');if(b){b.disabled=false;b.textContent='فعال‌کردن دوربین';}
    const h=$('#startCameraHero');if(h)h.disabled=false;
    const p=$('#pauseBtn');if(p){p.disabled=true;p.textContent='توقف اسکن';}
  }

  async function startCamera(){
    if(core.starting)return;
    if(core.stream){stopCamera();return;}
    if(!window.isSecureContext){notify('دوربین فقط روی HTTPS قابل استفاده است.');return;}
    if(!navigator.mediaDevices?.getUserMedia){notify('این مرورگر API دوربین را در اختیار سایت قرار نمی‌دهد.');return;}
    core.starting=true;
    const b=$('#cameraBtn');const h=$('#startCameraHero');
    if(b){b.disabled=true;b.textContent='در حال اتصال…';}if(h)h.disabled=true;
    notify('درخواست دسترسی به دوربین…');
    try{
      const stream=await requestCamera();core.stream=stream;
      const v=$('#video');if(!v)throw new Error('video element missing');
      v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.muted=true;v.autoplay=true;v.srcObject=stream;
      await new Promise(resolve=>{if(v.readyState>=1)return resolve();const done=()=>resolve();v.addEventListener('loadedmetadata',done,{once:true});setTimeout(done,2500);});
      try{await v.play();}catch(e){console.warn('video.play()',e);}
      v.style.display='block';v.style.width='100%';v.style.height='100%';v.style.objectFit='cover';
      $('#cameraStage')?.classList.add('camera-on');const ph=$('#cameraPlaceholder');if(ph)ph.style.display='none';
      if(b){b.disabled=false;b.textContent='خاموش کردن دوربین';}if(h)h.disabled=false;
      const p=$('#pauseBtn');if(p){p.disabled=false;p.textContent='توقف اسکن';}
      core.starting=false;core.scanning=true;core.paused=false;
      notify('دوربین فعال شد');
      ensureModel().then(()=>schedule(80)).catch(e=>{console.error(e);status('خطا در بارگذاری مدل AI','error');notify('دوربین فعال است، اما مدل AI بارگذاری نشد.');});
    }catch(e){console.error('camera start',e);stopCamera();notify(cameraError(e));}
  }

  function imageData(source){
    const c=$('#captureCanvas');const ctx=c.getContext('2d',{willReadFrequently:true});
    const sw=source.videoWidth||source.naturalWidth||source.width,sh=source.videoHeight||source.naturalHeight||source.height;
    if(!sw||!sh)throw new Error('video frame not ready');
    const crop=Math.min(sw,sh)*0.82,sx=(sw-crop)/2,sy=(sh-crop)/2;
    ctx.drawImage(source,sx,sy,crop,crop,0,0,INPUT_SIZE,INPUT_SIZE);return ctx.getImageData(0,0,INPUT_SIZE,INPUT_SIZE);
  }
  function tensorFrom(data){
    const p=data.data,plane=INPUT_SIZE*INPUT_SIZE,out=new Float32Array(plane*3);
    for(let i=0,j=0;i<plane;i++,j+=4){out[i]=(p[j]/255-MEAN[0])/STD[0];out[plane+i]=(p[j+1]/255-MEAN[1])/STD[1];out[2*plane+i]=(p[j+2]/255-MEAN[2])/STD[2];}
    return new ort.Tensor('float32',out,[1,3,INPUT_SIZE,INPUT_SIZE]);
  }
  function probs(raw){
    let sum=0,ok=true,max=-Infinity;for(const v of raw){sum+=v;if(v<0||v>1.0001)ok=false;if(v>max)max=v;}if(ok&&sum>.97&&sum<1.03)return raw;
    const out=new Float32Array(raw.length);sum=0;for(let i=0;i<raw.length;i++){out[i]=Math.exp(raw[i]-max);sum+=out[i];}for(let i=0;i<out.length;i++)out[i]/=sum;return out;
  }
  async function classify(){
    const v=$('#video');if(!core.session||!v||v.readyState<2)return;
    const tensor=tensorFrom(imageData(v));const input=core.session.inputNames[0];const result=await core.session.run({[input]:tensor});
    const raw=result[core.session.outputNames[0]].data,p=probs(raw);let idx=0;for(let i=1;i<p.length;i++)if(p[i]>p[idx])idx=i;
    showResult(LABELS[idx],Number(p[idx]||0));
  }
  function showResult(label,confidence){
    const info=INFO[label]||[label,label,'قطعه مکانیکی شناسایی‌شده توسط مدل AI.','—','—'];const pct=Math.round(confidence*100);
    const bar=$('#confidenceBar');if(bar)bar.style.width=`${pct}%`;
    if(pct<25){const chip=$('#predictionChip');if(chip)chip.hidden=true;return;}
    const chip=$('#predictionChip');if(chip)chip.hidden=false;
    if($('#predictionName'))$('#predictionName').textContent=info[0];if($('#predictionConfidence'))$('#predictionConfidence').textContent=`${pct}%`;
    if($('#resultFa'))$('#resultFa').textContent=info[0];if($('#resultEn'))$('#resultEn').textContent=info[1];
    if($('#resultDescription'))$('#resultDescription').textContent=info[2];if($('#resultFunction'))$('#resultFunction').textContent=info[3];if($('#resultLocation'))$('#resultLocation').textContent=info[4];
  }
  function schedule(delay=700){clearTimeout(core.timer);if(!core.scanning||core.paused)return;core.timer=setTimeout(async()=>{try{await classify();}catch(e){console.warn('scan frame',e);}schedule(700);},delay);}

  function bind(){
    const intercept=(fn)=>e=>{e.preventDefault();e.stopImmediatePropagation();fn();};
    $('#cameraBtn')?.addEventListener('click',intercept(startCamera),true);
    $('#startCameraHero')?.addEventListener('click',intercept(startCamera),true);
    $('#cameraSwitchBtn')?.addEventListener('click',intercept(async()=>{core.facing=core.facing==='environment'?'user':'environment';if(core.stream){stopCamera();await startCamera();}else notify(core.facing==='environment'?'دوربین پشت انتخاب شد':'دوربین جلو انتخاب شد');}),true);
    $('#pauseBtn')?.addEventListener('click',intercept(()=>{if(!core.stream)return;core.paused=!core.paused;const p=$('#pauseBtn');if(p)p.textContent=core.paused?'ادامه اسکن':'توقف اسکن';if(!core.paused)schedule(50);else clearTimeout(core.timer);}),true);
    window.addEventListener('pagehide',()=>{if(core.stream)core.stream.getTracks().forEach(t=>t.stop());});
    console.info('Car Mechanic AR standalone scanner core active');
  }

  bind();
  ensureModel().catch(e=>{console.error('scanner model preload',e);status('مدل AI هنگام اولین اسکن دوباره تلاش می‌کند','error');});
})();