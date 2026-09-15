const CACHE='car-mechanic-ar-web-v5';
const CORE=['./','./index.html','./styles.css','./app.js','./camera-patch.js','./manifest.webmanifest','./icon.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
    const clients=await self.clients.matchAll({type:'window'});
    for(const client of clients){
      try{ await client.navigate(client.url); }catch(_){ }
    }
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin) return;

  if(url.pathname.endsWith('/app.js')){
    event.respondWith((async()=>{
      const [appResponse,patchResponse]=await Promise.all([
        fetch(event.request,{cache:'no-store'}),
        fetch(new URL('./camera-patch.js',self.location.href),{cache:'no-store'})
      ]);
      if(!appResponse.ok) return appResponse;
      const appText=await appResponse.text();
      const patchText=patchResponse.ok?await patchResponse.text():'';
      return new Response(`${appText}\n\n${patchText}`,{
        status:200,
        headers:{
          'Content-Type':'text/javascript; charset=utf-8',
          'Cache-Control':'no-store, max-age=0'
        }
      });
    })());
    return;
  }

  if(url.pathname.endsWith('.onnx')||url.pathname.endsWith('.wasm')||url.pathname.includes('/vendor/ort/')){
    event.respondWith(fetch(event.request,{cache:'no-store'}));
    return;
  }

  event.respondWith((async()=>{
    try{
      const response=await fetch(event.request,{cache:'no-store'});
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      }
      return response;
    }catch(_){
      return (await caches.match(event.request)) || (await caches.match('./index.html'));
    }
  })());
});