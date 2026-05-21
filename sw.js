const CACHE='daycard-v3';
const STATIC=[
  '/',
  '/index.html',
  '/subscribe.html',
  '/manifest.json'
];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);

  if(e.request.method!=='GET') return;

  if(url.hostname.includes('openweathermap')||
     url.hostname.includes('exchangerate-api')||
     url.hostname.includes('allorigins')||
     url.hostname.includes('ipapi')){
    e.respondWith(
      fetch(e.request)
        .then(res=>{
          const clone=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,clone));
          return res;
        })
        .catch(()=>caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached;
      return fetch(e.request).then(res=>{
        if(res&&res.status===200){
          const clone=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,clone));
        }
        return res;
      });
    })
  );
});
