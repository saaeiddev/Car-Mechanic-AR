const CACHE='car-mechanic-ar-web-v7';
const CORE=['./','./index.html','./styles.css','./app.js?v=7','./camera-patch.js?v=7','./manifest.webmanifest','./icon.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;

  const alwaysNetwork = url.pathname.endsWith('.html') ||
    url.pathname.endsWith('/app.js') ||
    url.pathname.endsWith('/camera-patch.js') ||
    url.pathname.endsWith('.onnx') ||
    url.pathname.endsWith('.wasm') ||
    url.pathname.includes('/vendor/ort/');

  if(alwaysNetwork){
    event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request)));
    return;
  }

  event.respondWith((async()=>{
    try{
      const response=await fetch(event.request,{cache:'no-store'});
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});}
      return response;
    }catch(_){return (await caches.match(event.request)) || (await caches.match('./index.html'));}
  })());
});